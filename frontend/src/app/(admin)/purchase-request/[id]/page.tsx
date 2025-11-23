import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseRequestDetailClient from "./PurchaseRequestDetailClient";

export const metadata: Metadata = {
  title: "Purchase Request Detail | Inventory Allocation System",
  description: "Purchase Request detail page",
};

export default async function PurchaseRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <>
      <PageBreadcrumb pageTitle={`Purchase Request #${id}`} />
      <div className="flex flex-col gap-9">
        <PurchaseRequestDetailClient id={Number(id)} />
      </div>
    </>
  );
}