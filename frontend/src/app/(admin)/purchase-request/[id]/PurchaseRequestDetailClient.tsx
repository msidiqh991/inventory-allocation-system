"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftCircle,
  Send,
  Calendar,
  Package,
  Pocket,
} from "@deemlol/next-icons";

import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { TableStatusBadge } from "@/components/tables";
import ProductService from "@/services/ProductService";
import WarehouseService from "@/services/WarehouseService";
import PurchaseRequestService from "@/services/PurchaseRequestService";
import { Product, Warehouse, PurchaseRequestApiResponse } from "@/types";

interface PurchaseRequestDetailClientProps {
  id: number;
}

export default function PurchaseRequestDetailClient({
  id,
}: PurchaseRequestDetailClientProps) {
  const router = useRouter();
  const [detail, setDetail] = useState<PurchaseRequestApiResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [detailData, productsData, warehousesData] = await Promise.all([
          PurchaseRequestService.getPurchaseRequestDetail(id),
          ProductService.getAllProducts(),
          WarehouseService.getAllWarehouses(),
        ]);

        setDetail(detailData);
        setProducts(productsData);
        setWarehouses(warehousesData);
      } catch (err: any) {
        console.error("Error fetching purchase request detail:", err);
        setError(err.message || "Failed to load purchase request details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitForApproval = async () => {
    if (!detail) return;

    const confirmSubmit = window.confirm(
      `Are you sure you want to submit Purchase Request ${detail.reference} for approval? This will change the status to PENDING and cannot be undone.`
    );

    if (!confirmSubmit) return;

    setSubmitting(true);
    try {
      const response = await PurchaseRequestService.updatePurchaseRequestStatus(
        id,
        { status: "PENDING" }
      );

      const successMessage = encodeURIComponent(
        `Purchase Request ${response.data.reference} has been submitted for approval (Status: ${response.data.status}).`
      );
      router.push(`/purchase-request?success=${successMessage}`);
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to submit purchase request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900/60">
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading purchase request detail...</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900/60">
        <Alert
          variant="error"
          title="Error Loading Data"
          message={error || "Purchase request not found."}
        />
        <Link href="/purchase-request" className="mt-4 inline-block">
          <Button
            size="md"
            variant="outline"
            startIcon={<ArrowLeftCircle size={16} />}
          >
            Back to List
          </Button>
        </Link>
      </div>
    );
  }

  const warehouseOptions = warehouses.map((warehouse) => ({
    value: String(warehouse.id),
    label: warehouse.name,
  }));

  const productOptions = products.map((product) => ({
    value: String(product.id),
    label: `${product.name} (${product.sku})`,
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    )}`;
  };

  const totalQuantity = detail.PurchaseRequestItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900/60">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Purchase Request Detail
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-brand-600 dark:text-brand-400 text-lg font-semibold">
                {detail.reference}
              </span>
              <TableStatusBadge status={detail.status} />
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/purchase-request">
              <Button
                size="md"
                variant="outline"
                startIcon={<ArrowLeftCircle size={16} />}
              >
                Back to List
              </Button>
            </Link>
            {detail.status === "DRAFT" && (
              <Button
                size="md"
                variant="primary"
                startIcon={<Send size={16} color="white" />}
                onClick={handleSubmitForApproval}
                disabled={submitting}
                className="bg-green-600! hover:bg-green-700!"
              >
                {submitting ? "Submitting..." : "Submit for Approval"}
              </Button>
            )}
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="bg-brand-100 dark:bg-brand-900/50 rounded-lg p-2">
              <Pocket
                size={20}
                className="text-brand-600 dark:text-brand-400"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vendor</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                PT FOOM LAB GLOBAL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="bg-brand-100 dark:bg-brand-900/50 rounded-lg p-2">
              <Calendar
                size={20}
                className="text-brand-600 dark:text-brand-400"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Request Date
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatDate(detail.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="bg-brand-100 dark:bg-brand-900/50 rounded-lg p-2">
              <Package
                size={20}
                className="text-brand-600 dark:text-brand-400"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Quantity
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {totalQuantity}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900/60">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Request Information
        </h3>

        <div>
          <Label>Warehouse</Label>
          <div className="relative">
            <Select
              options={warehouseOptions}
              defaultValue={String(detail.warehouse_id)}
              disabled={true}
              placeholder="Select warehouse"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Items ({detail.PurchaseRequestItems.length})</Label>
          {detail.PurchaseRequestItems.map((item, idx) => (
            <div
              key={item.id}
              className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/40 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="bg-brand-500 inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold text-white">
                  {idx + 1}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  SKU: <em className="font-medium">{item.Product.sku}</em>
                </span>
              </div>

              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-7">
                  <Label>Product</Label>
                  <div className="relative">
                    <Select
                      options={productOptions}
                      defaultValue={String(item.product_id)}
                      disabled={true}
                      placeholder="Select product"
                    />
                  </div>
                </div>

                <div className="col-span-5">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    defaultValue={String(item.quantity)}
                    disabled={true}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
