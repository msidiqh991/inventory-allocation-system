import { Product, Warehouse } from "@/types";

export type PurchaseRequestStatus = "DRAFT" | "PENDING" | "COMPLETED";

export interface PurchaseRequest {
  id: number;
  reference: string;
  warehouse_id: number;
  status: PurchaseRequestStatus;
  createdAt: string;
  updatedAt: string;
  totalQuantity: number;
  vendor: string;
  requestDate: string;
}

export interface PurchaseRequestItem {
  id: number;
  purchase_request_id: number;
  product_id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  Product: Product;
}

export interface PurchaseRequestApiResponse {
  id: number;
  reference: string;
  warehouse_id: number;
  status: PurchaseRequestStatus;
  createdAt: string;
  updatedAt: string;
  PurchaseRequestItems: PurchaseRequestItem[];
  Warehouse: Warehouse;
}

export interface PurchaseRequestListApiResult {
  status: string;
  message: string;
  data: PurchaseRequestApiResponse[];
}

export interface PurchaseRequestItemInput {
  product_id: number;
  quantity: number;
}

export interface PurchaseRequestPayload {
  warehouse_id: number;
  items: PurchaseRequestItemInput[];
}

export interface PurchaseRequestUpdatePayload {
  status: PurchaseRequestStatus;
}

// Response for Create/Update operations
export interface PurchaseRequestCreateResponse {
  status: string;
  message: string;
  data: {
    id: number;
    reference: string;
    warehouse_id: number;
    status: PurchaseRequestStatus;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PurchaseRequestDetailApiResult {
  status: string;
  message: string;
  data: PurchaseRequestApiResponse;
}

