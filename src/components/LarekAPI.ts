import { IApi, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";

export class LarekApi extends Api implements IApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProducts(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
    data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    )
  }
}