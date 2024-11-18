export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  sku: string;
  brand: string;
  createdAt: Date;
  imageUrl: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
