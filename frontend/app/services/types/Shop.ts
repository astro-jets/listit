// 1. Define the structure based on your API response
export interface Shop {
  id: number;
  name: string;
  description: string;
  logo_url: string | null;
  banner_url: string | null;
  address_text: string | null;
  location:
    | {
        lat: number;
        lng: number;
        logo?: string | null;
        shopBio?: string;
        shopName?: string;
      }
    | string; // It could be the object OR a string fallback
  owner_id: string;
  status: string;
}
