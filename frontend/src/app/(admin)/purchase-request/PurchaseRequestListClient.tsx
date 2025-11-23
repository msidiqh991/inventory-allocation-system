"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { Column } from "@/types/table";
import { Plus, Eye, Trash2 } from "@deemlol/next-icons";
import { PurchaseRequest } from "@/types/purchaseRequest";
import { TableTemplate, TableStatusBadge } from "@/components/tables";
import { useSimpleFetch } from "@/hooks/useSimpleFetch";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import PurchaseRequestService from "@/services/PurchaseRequestService";

export default function PurchaseRequestListClient() {
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();

  const {
    data: purchaseRequests,
    loading,
    error,
    refetch,
  } = useSimpleFetch(PurchaseRequestService.getAllPurchaseRequests);

  useEffect(() => {
    const successParam = searchParams.get('success');
    if (successParam) {
      setSuccessMsg(decodeURIComponent(successParam));
      setTimeout(() => setSuccessMsg(""), 5000);
      
      window.history.replaceState({}, '', '/purchase-request');
    }
  }, [searchParams]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this purchase request? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      await PurchaseRequestService.deletePurchaseRequest(id);
      setSuccessMsg("Purchase request deleted successfully.");
      await refetch();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setErrorMsg((err as Error).message || "Failed to delete purchase request");
      setTimeout(() => setErrorMsg(""), 5000);
    } 
  };

  const columns: Column<PurchaseRequest>[] = [
    { isIndex: true, header: "No.", widthClass: "w-1/12" },
    { key: "reference", header: "Reference", widthClass: "w-1/5" },
    { key: "vendor", header: "Vendor", widthClass: "w-1/5" },
    {
      key: "totalQuantity",
      header: "Total Qty",
      render: (row, _rowIndex, _globalIndex) => (
        <span className="text-brand-600 dark:text-brand-400 font-semibold">
          {row.totalQuantity}
        </span>
      ),
      widthClass: "w-1/6",
    },
    {
      key: "requestDate",
      header: "Request Date",
      render: (row) => {
        const date = new Date(row.requestDate);
        return (
          <span className="text-gray-600 dark:text-gray-300">
            {date.toLocaleDateString("en-GB")}{" "}
            {date.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        );
      },
      widthClass: "w-1/5",
    },
    {
      header: "Status",
      render: (row) => <TableStatusBadge status={row.status} />,
      widthClass: "w-1/6",
    },
    {
      header: "Actions",
      render: (row) => {
        const canModify = row.status === "DRAFT";

        return (
          <div className="flex gap-2">
            <Link href={`/purchase-request/${row.id}`}>
              <Button
                size="sm"
                variant="outline"
                startIcon={<Eye size={16} color="gray" />}
                className="px-3! py-2!"
              >
                Detail
              </Button>
            </Link>
            <Button
              size="sm"
              variant="primary"
              className="bg-red-500! px-3! py-2! hover:bg-red-600! disabled:bg-red-300!"
              startIcon={<Trash2 size={16} color="white" />}
              disabled={!canModify}
              onClick={() => handleDelete(row.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
      widthClass: "w-1/5",
    },
  ];

  return (
    <div className="space-y-4">
      {(error || errorMsg) && (
        <Alert
          variant="error"
          title="Error"
          message={error || errorMsg}
        />
      )}
      {successMsg && (
        <Alert variant="success" title="Success" message={successMsg} />
      )}
      <div className="flex items-center justify-end">
        <Link href="/purchase-request/new">
          <Button
            size="sm"
            startIcon={<Plus size={18} color="white" />}
            variant="primary"
          >
            Add Purchase Request
          </Button>
        </Link>
      </div>
      <TableTemplate
        columns={columns}
        data={purchaseRequests || []}
        loading={loading}
        error={error}
        pagination={{
          currentPage: page,
          pageSize: 5,
          onPageChange: setPage,
        }}
        showCountInfo
      />
    </div>
  );
}