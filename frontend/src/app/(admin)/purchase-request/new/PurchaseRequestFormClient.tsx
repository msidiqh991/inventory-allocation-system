"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Plus, Trash2, ArrowLeftCircle } from "@deemlol/next-icons";
import { useSimpleFetch } from "@/hooks/useSimpleFetch";
import {
  ProductService,
  WarehouseService,
  StockService,
  PurchaseRequestService,
} from "@/services";
import { StockItem } from "@/types/stock";

import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { PurchaseRequestPayload } from "@/types";

interface ItemRow {
  product_id: number;
  quantity: number;
}

export default function PurchaseRequestFormClient() {
  const { data: products, loading: loadingProducts } = useSimpleFetch(
    ProductService.getAllProducts,
  );
  const { data: warehouses, loading: loadingWarehouses } = useSimpleFetch(
    WarehouseService.getAllWarehouses,
  );
  const [warehouseStocks, setWarehouseStocks] = useState<StockItem[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(false);

  const [warehouseId, setWarehouseId] = useState<number | "">("");
  const [items, setItems] = useState<ItemRow[]>([
    { product_id: 0, quantity: 0 },
  ]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const availableProducts = products || [];
  const availableWarehouses = warehouses || [];

  useEffect(() => {
    if (warehouseId !== "") {
      setLoadingStocks(true);
      StockService.getStockByWarehouse(Number(warehouseId))
        .then((stocks) => {
          setWarehouseStocks(stocks);
          setItems((prevItems) =>
            prevItems.map((item) => {
              if (item.product_id !== 0) {
                const stock = stocks.find((s) => s.product_id === item.product_id);
                return { ...item, available_stock: stock?.quantity || 0 };
              }
              return item;
            }),
          );
        }).catch((err) => console.error("Failed to load stocks:", err))
          .finally(() => setLoadingStocks(false));
    } else {
      setWarehouseStocks([]);
      setItems((prevItems) =>
        prevItems.map((item) => ({ ...item, available_stock: undefined })),
      );
    }
  }, [warehouseId]);

  const chosenProductIds = useMemo(
    () => items
      .map((row) => typeof row.product_id === "number" ? row.product_id : null)
      .filter(Boolean),
    [items],
  );

  const getAvailableStock = (productId: number): number => {
    const stock = warehouseStocks.find((s) => s.product_id === productId);
    return stock?.quantity || 0;
  };

  const productOptions = (currentId: number | "") =>
    availableProducts
      .filter((product) => product.id === currentId || !chosenProductIds.includes(product.id))
      .map((product) => {
        const availableStock = warehouseId !== "" ? getAvailableStock(product.id) : null;
        return {
          value: String(product.id),
          label: availableStock !== null 
            ? `${product.name} (${product.sku}) - [Stock: ${availableStock}]`
            : `${product.name} (${product.sku})`,
        };
      });

  const warehouseOptions = availableWarehouses.map((warehouse) => ({
    value: String(warehouse.id),
    label: warehouse.name,
  }));

  const addRow = () => {
    setItems((prev) => [...prev, { product_id: 0, quantity: 0 }]);
  };

  const removeRow = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, patch: Partial<ItemRow>) => {
    setItems((prev) => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  };

  const validate = (): string[] => {
    const errors: string[] = [];

    if (warehouseId === "") {
      errors.push("Warehouse is required.");
    }

    if (!items.length) {
      errors.push("At least one item row is required.");
    }

    items.forEach((row, i) => {
      if (row.product_id === 0) {
        errors.push(`Row ${i + 1}: Product required.`);
      }
      if (row.quantity === 0 || Number(row.quantity) <= 0) {
        errors.push(`Row ${i + 1}: Quantity must higher than 0.`);
      }
    });

    const productIds = items.map((row) => row.product_id).filter((id) => id !== null);
    
    const duplicates = productIds.filter(
      (id, idx) => productIds.indexOf(id) !== idx,
    );

    if (duplicates.length) {
      errors.push("Duplicate products not allowed.");
    }

    return errors;
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    const errors = validate();
    if (errors.length) {
      setSubmitError(errors.join(" "));
      return;
    }

    setSubmitting(true);
    try {
      const payload: PurchaseRequestPayload = {
        warehouse_id: Number(warehouseId),
        items: items.map((row) => ({
          product_id: row.product_id,
          quantity: row.quantity,
        })),
      };
      const response = await PurchaseRequestService.createPurchaseRequest(payload);
      const successMessage = encodeURIComponent(
        `Purchase Request ${response.data.reference} successfully created with status ${response.data.status}.`
      );

      router.push(`/purchase-request?success=${successMessage}`);
    } catch (error) {
      setSubmitError((error as Error).message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const disabledForm = loadingProducts || loadingWarehouses || loadingStocks || submitting;

  return (
    <div className="space-y-7">
      {submitError && (
        <Alert variant="error" title="Submission Error" message={submitError} />
      )}

      <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900/60">
        <div className="rounded bg-amber-200 text-sm">
          <div className="p-4 text-amber-900">
            <strong>Note:</strong> New Purchase Requests are created in DRAFT
            status. You can review and submit them for approval later.
          </div>
        </div>

        <div>
          <Label>Warehouse</Label>
          <div className="relative">
            <Select
              options={warehouseOptions}
              placeholder={
                loadingWarehouses ? "Loading warehouses..." : "Select warehouse"
              }
              onChange={(val) => setWarehouseId(Number(val))}
              defaultValue={warehouseId === "" ? "" : String(warehouseId)}
              disabled={loadingWarehouses}
            />
            {loadingStocks && (
              <p className="mt-1 text-xs text-gray-500">
                Loading stock data...
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Items</Label>
          {items.map((row, idx) => {
            const rowErrors: string[] = [];
            if (submitError?.includes(`Row ${idx + 1}: Product required.`)) {
              rowErrors.push("Product required");
            }
            if (submitError?.includes(`Row ${idx + 1}: Quantity must higher than 0.`)) { 
              rowErrors.push("Quantity > 0") 
            }

            return (
              <div
                key={idx}
                className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/40 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-brand-500 inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold text-white">
                    {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    disabled={items.length === 1}
                    className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-40 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} color="red" />
                  </button>
                </div>

                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-7">
                    <Label>Product</Label>
                    <div className="relative">
                      <Select
                        options={productOptions(row.product_id)}
                        placeholder={
                          loadingProducts ? "Loading products..." : "Select product"
                        }
                        onChange={(val) =>
                          updateRow(idx, { product_id: Number(val) })
                        }
                        defaultValue={
                          row.product_id === null ? "" : String(row.product_id)
                        }
                        disabled={
                          loadingProducts || warehouseId === "" || loadingStocks
                        }
                      />
                    </div>
                    {rowErrors.includes("Product required") && (
                      <p className="text-error-500 mt-1 text-xs">
                        Product required
                      </p>
                    )}
                  </div>

                  <div className="col-span-5">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      defaultValue={
                        row.quantity === 0 ? getAvailableStock(row.product_id)
                          : String(row.quantity)
                      }
                      onChange={(e) =>
                        updateRow(idx, { quantity: Number(e.target.value) })
                      }
                      placeholder="0"
                      error={rowErrors.includes("Quantity > 0")}
                      hint={
                        rowErrors.includes("Quantity > 0") ? "Must higher than 0" : ""
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <Button
            size="sm"
            variant="outline"
            onClick={addRow}
            startIcon={<Plus size={16} color="black" />}
            disabled={disabledForm}
            className="mt-1"
          >
            Add Item Row
          </Button>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            size="md"
            variant="primary"
            onClick={() => router.back()}
            startIcon={<ArrowLeftCircle size={16} color="white" />}
            className="w-full bg-gray-400 hover:bg-gray-500 sm:w-auto"
          >
            Cancel Request
          </Button>
          <Button
            size="md"
            variant="primary"
            disabled={disabledForm}
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          >
            {submitting ? "Submitting..." : "Create Purchase Request"}
          </Button>
        </div>
      </div>
    </div>
  );
}
