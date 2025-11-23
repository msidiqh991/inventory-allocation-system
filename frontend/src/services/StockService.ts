import fetchAPI from "@/utils/api";
import { StockApiResponse, StockItem } from "@/types";

const StockService = {
    async getAllStockItems(): Promise<StockItem[]> {
        const response = await fetchAPI("/stocks", { method: "GET" });
        
        return (response.data ?? []).map((item: StockApiResponse): StockItem => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.Product.name,
            warehouse_id: item.warehouse_id,
            warehouse_name: item.Warehouse.name,
            quantity: item.quantity,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));
    },

    async getStockByWarehouse(warehouseId: number): Promise<StockItem[]> {
        const allStocks = await this.getAllStockItems();
        return allStocks.filter(stock => stock.warehouse_id === warehouseId);
    },

    async checkStockAvailability(warehouseId: number, productId: number): Promise<number> {
        const stocks = await this.getStockByWarehouse(warehouseId);
        const stock = stocks.find(s => s.product_id === productId);
        return stock?.quantity || 0;
    }
}

export default StockService;
