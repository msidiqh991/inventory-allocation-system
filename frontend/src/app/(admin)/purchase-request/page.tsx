import { Metadata } from "next";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseRequestListClient from "./PurchaseRequestListClient";

export const metadata: Metadata = {
  title: "Purchase Requests - Inventory Allocation System",
  description:
    "Manage and track all purchase requests efficiently within the Inventory Allocation System.",
};

export default function ListPurchaseRequestPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Purchase Requests" />
      <PurchaseRequestListClient />
    </div>
  );
}
