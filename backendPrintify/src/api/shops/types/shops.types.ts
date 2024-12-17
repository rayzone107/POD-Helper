export interface Shop {
  id: number;
  title: string;
  sales_channel: string;
}

export interface ShippingDetailsResponse {
  profiles: {
    variant_ids: number[];
    first_item: {
      cost: number;
      currency: string;
    };
    additional_items: {
      cost: number;
      currency: string;
    };
    countries: string[];
  }[];
}
