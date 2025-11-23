export interface StockItem {
  id: number;
  product_id: number;
  product_name: string;
  warehouse_id: number;
  warehouse_name: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockApiResponse {
  id: number;
  warehouse_id: number;
  product_id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  Product: {
    id: number;
    name: string;
    sku: string;
  };
  Warehouse: {
    id: number;
    name: string;
  };
}

export interface StockAvailability {
  product_id: number;
  warehouse_id: number;
  available_quantity: number;
}