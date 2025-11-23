const {
  PurchaseRequest,
  PurchaseRequestItem,
  Stock,
  Product,
  sequelize,
} = require("../../models");

const ApiError = require("../utils/ApiError");

const processIncomingStock = async (payload) => {
  if (!payload) throw new ApiError(400, "Invalid payload");

  const { reference, vendor, details } = payload;

  if (!reference || !vendor || !details) {
    throw new ApiError(400, "Missing required fields in payload");
  }

  if (vendor !== "PT FOOM LAB GLOBAL") {
    throw new ApiError(400, "Invalid vendor");
  }

  const pr = await PurchaseRequest.findOne({
    where: { reference },
    include: [PurchaseRequestItem],
  });

  if (!pr) throw new ApiError(404, "Purchase Request not found");

  if (pr.status === "COMPLETED") {
    return { 
      message: "Already processed (idempotent)", 
      reference: pr.reference 
    };
  }

  if (pr.status !== "PENDING") {
    throw new ApiError(400, "Purchase Request not in PENDING status");
  }

  const itemUpdates = [];

  for (const item of details) {
    const vendorSku = item.sku_barcode;
    const qty = Number(item.qty);

    if (!vendorSku || isNaN(qty) || qty <= 0) {
      throw new ApiError(400, "Invalid item details in payload");
    }

    const product = await Product.findOne({ where: { sku: vendorSku } });
    if (!product) {
      throw new ApiError(404, `Product with SKU ${vendorSku} not found`);
    }

    itemUpdates.push({
      product_id: product.id,
      quantity: qty,
    });
  }

  await sequelize.transaction(async (t) => {
    for (const item of itemUpdates) {
      const existing = await Stock.findOne({
        where: {
          warehouse_id: pr.warehouse_id,
          product_id: item.product_id,
        },
        transaction: t,
      });

      if (existing) {
        await existing.update(
          { quantity: existing.quantity + item.quantity },
          { transaction: t }
        );
      } else {
        await Stock.create(
          {
            warehouse_id: pr.warehouse_id,
            product_id: item.product_id,
            quantity: item.quantity,
          },
          {
            transaction: t,
          }
        );
      }
    }

    await pr.update({ status: "COMPLETED" }, { transaction: t });
  });

  return {
    reference,
    updated_items: itemUpdates.length,
  };
};

module.exports = { processIncomingStock };