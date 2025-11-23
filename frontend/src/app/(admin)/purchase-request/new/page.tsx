import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseRequestFormClient from "./PurchaseRequestFormClient";

export const metadata: Metadata = {
  title: "New Purchase Request - Inventory Allocation System",
  description: "Create a new purchase request.",
};

export default function CreatePurchaseRequestPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="New Purchase Request" />
      <PurchaseRequestFormClient />
    </div>
  );
}