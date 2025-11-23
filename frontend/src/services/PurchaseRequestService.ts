import fetchAPI from "@/utils/api";
import {
  PurchaseRequest,
  PurchaseRequestPayload,
  PurchaseRequestUpdatePayload,
  PurchaseRequestListApiResult,
  PurchaseRequestDetailApiResult,
  PurchaseRequestCreateResponse,
  PurchaseRequestApiResponse
} from "@/types";

const PurchaseRequestService = {
  async getAllPurchaseRequests(): Promise<PurchaseRequest[]> {
    const response: PurchaseRequestListApiResult = await fetchAPI("/purchase/request", { method: "GET" });

    return (response.data ?? []).map((item: PurchaseRequestApiResponse): PurchaseRequest => {
      const totalQuantity = item.PurchaseRequestItems.reduce(
        (sum, prItem) => sum + prItem.quantity,
        0
      );

      return {
        id: item.id,
        reference: item.reference,
        warehouse_id: item.warehouse_id,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        totalQuantity: totalQuantity,
        vendor: "PT FOOM LAB GLOBAL",
        requestDate: item.createdAt,
      };
    });
  },

  async getPurchaseRequestDetail(id: number): Promise<PurchaseRequestApiResponse> {
    const response: PurchaseRequestDetailApiResult = await fetchAPI(`/purchase/request/${id}`, { method: "GET" });
    return response.data;
  },

  async createPurchaseRequest(payload: PurchaseRequestPayload): Promise<PurchaseRequestCreateResponse> {
    const response: PurchaseRequestCreateResponse = await fetchAPI("/purchase/request", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return response;
  },

  async updatePurchaseRequestStatus(id: number, payload: PurchaseRequestUpdatePayload): Promise<PurchaseRequestCreateResponse> {
    const response: PurchaseRequestCreateResponse = await fetchAPI(`/purchase/request/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    return response;
  },

  async deletePurchaseRequest(id: number): Promise<{ status: string; message: string }> {
    const response = await fetchAPI(`/purchase/request/${id}`, {
      method: "DELETE"
    });
    return response;
  }
};

export default PurchaseRequestService;  