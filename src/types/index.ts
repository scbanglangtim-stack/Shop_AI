export interface Post {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  discount?: boolean;
}
