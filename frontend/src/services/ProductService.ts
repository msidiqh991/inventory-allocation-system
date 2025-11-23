import fetchAPI from "@/utils/api";
import { Product } from "@/types";

const ProductService = {
  async getAllProducts(): Promise<Product[]> {
    const response = await fetchAPI("/products", { method: "GET" });

    return (response.data ?? []).map((item: Product) => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }
}

export default ProductService;