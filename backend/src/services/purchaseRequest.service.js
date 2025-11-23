const {
  PurchaseRequest,
  PurchaseRequestItem,
  Product,
  Warehouse,
  sequelize,
} = require("../../models");

const axios = require("axios");

const ApiError = require("../utils/ApiError");

const pad = (num, size = 5) => String(num).padStart(size, "0");

const create = async (data) => {
  return await sequelize.transaction(async (t) => {
    const warehouse = await Warehouse.findByPk(data.warehouse_id, { transaction: t });
    if (!warehouse) throw new ApiError(400, "Invalid warehouse ID");

    const count = await PurchaseRequest.count({ transaction: t });
    const reference = data.reference ?? `PR-${pad(count + 1)}`;

    const pr = await PurchaseRequest.create(
      {
        reference: reference,
        warehouse_id: data.warehouse_id,
        status: "DRAFT",
      },
      { transaction: t }
    );

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new ApiError(400, "Items must be provided and cannot be empty");
    }

    for (const item of data.items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) throw new ApiError(400, `Invalid product ID: ${item.product_id}`);

      await PurchaseRequestItem.create(
        {
          purchase_request_id: pr.id,
          product_id: item.product_id,
          quantity: item.quantity,
        },
        { transaction: t }
      );
    }

    return pr;
  });
};

const getAll = async () => {
  return await PurchaseRequest.findAll({
    include: [
      { model: PurchaseRequestItem, include: [Product] },
      { model: Warehouse }
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getById = async (id) => {
  const pr = await PurchaseRequest.findByPk(id, {
    include: [
      { model: PurchaseRequestItem, include: [Product] },
      { model: Warehouse }
    ],
  });

  if (!pr) throw new ApiError(404, "Purchase Request not found");
  return pr;
};

const update = async (id, data) => {
  return sequelize.transaction(async (t) => {
    const pr = await PurchaseRequest.findByPk(id, { 
      transaction: t, 
      lock: t.LOCK.UPDATE
    });

    if (!pr) throw new ApiError(404, "Purchase Request not found");

    if (pr.status !== "DRAFT") {
      throw new ApiError(400, "Only DRAFT Purchase Request can be edited");
    }

    if (data.warehouse_id !== undefined) {
      const warehouse = await Warehouse.findByPk(data.warehouse_id, { transaction: t });
      if (!warehouse) throw new ApiError(400, "Invalid warehouse ID");
      pr.warehouse_id = data.warehouse_id;
    }

    if (Array.isArray(data.items)) {
      if (data.items.length === 0) {
        throw new ApiError(400, "Items cannot be empty");
      }

      await PurchaseRequestItem.destroy({
        where: { purchase_request_id: id },
        transaction: t,
      });

      for (const item of data.items) {
        const product = await Product.findByPk(item.product_id, { transaction: t });
        if (!product) throw new ApiError(400, `Invalid product ID: ${item.product_id}`);

        await PurchaseRequestItem.create(
          {
            purchase_request_id: pr.id,
            product_id: item.product_id,
            quantity: item.quantity,
          },
          {
            transaction: t,
          }
        );
      }
    }

    if (data.status) {
      const newStatus = data.status.toUpperCase();

      if (newStatus === "PENDING") {
        pr.status = "PENDING";
        await pr.save({ transaction: t });

        const prWithItems = await PurchaseRequest.findByPk(id, {
          include: [{ 
              model: PurchaseRequestItem, 
              include: [{ 
                  model: Product, 
                  attributes: ["name", "sku"]
                }] 
            }],
        });

        await _sendToFoomHub(prWithItems);
      }
      else if (newStatus !== "DRAFT") {
        throw new ApiError(400, "Can only transition status to DRAFT or PENDING" );
      }
    }

    await pr.save({ transaction: t })
    return pr;
  });
};

const remove = async (id) => {
  return await sequelize.transaction(async (t) => {
    const pr = await PurchaseRequest.findByPk(id, { transaction: t });
    if (!pr) throw new ApiError(404, "Purchase Request not found");

    if (pr.status !== "DRAFT") {
      throw new ApiError(400, "Only DRAFT Purchase Request can be deleted");
    }

    await PurchaseRequestItem.destroy({
      where: { purchase_request_id: id },
      transaction: t,
    });

    await pr.destroy({ transaction: t });
    return true;
  })
};

const _sendToFoomHub = async (pr) => {
  const payload = {
    vendor: process.env.VENDOR,
    reference: pr.reference,
    qty_total: pr.PurchaseRequestItems.reduce((sum, item) => sum + item.quantity, 0),
    details: pr.PurchaseRequestItems.map((item) => ({
      product_name: item.Product.name,
      sku_barcode: item.Product.sku,
      qty: item.quantity,
    }))
  }

  try {
    await axios.post(
      `${process.env.HUB_FOOM_URL}/api/request/purchase`,
      payload,
      {
        headers: {
          "secret-key": process.env.HUB_FOOM_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("FOOM Hub error:", error.response?.data || error.message);
    throw new ApiError(500, "Failed to notify Foom Hub");
  }
};
  
module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  _sendToFoomHub,
};
