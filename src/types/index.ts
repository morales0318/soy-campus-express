export interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  flavorKey: string;
}

export interface User {
  username: string;
  password: string;
  contact: string;
  facebook: string;
  campus: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  items: CartItem[];
  total: number;
  createdAt: string;
  delivery: {
    campus: string;
    contact: string;
    facebook: string;
    username: string;
  };
  status: "pending" | "delivered";
}