export interface Listing {
  id: number;
  title: string;
  price: string | number;
  category: string;
  image: string;
  shop_name: string;
  location: string;
  is_favorited?: boolean;
}
