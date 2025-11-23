import { Metadata } from "next";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StockTableClient from "@/app/(admin)/stock/_components/StockTableClient";
import StockService from "@/services/StockService";
import { StockItem } from "@/types";

export const metadata: Metadata = {
  title: "Stock Dashboard - Inventory Allocation System",
  description: "Admin dashboard for monitoring stock levels across warehouses.",
};

const fetchStockData = async (): Promise<StockItem[]> => {
  try {
    const response = await StockService.getAllStockItems();
    return response;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
};

export default async function Dashboard() {
  const stockData = await fetchStockData();

  return (
    <div>
      <PageBreadcrumb pageTitle="Stock Inventory Overview" />
      <StockTableClient initialData={stockData} />
    </div>
  );
}
