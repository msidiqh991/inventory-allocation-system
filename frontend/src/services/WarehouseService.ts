import fetchAPI from "@/utils/api";
import { Warehouse } from "@/types";

const WarehouseService = {
  async getAllWarehouses(): Promise<Warehouse[]> {
    const response = await fetchAPI("/warehouses", { method: "GET" });

    return (response.data ?? []).map((item: Warehouse) => ({
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }
}

export default WarehouseService;