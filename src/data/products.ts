import { Product } from '../types';

export const PRODUCTS: Product[] = [
  { id: 1, name: "Classic", price: 20, emoji: "🥛", flavorKey: "classic" },
  { id: 2, name: "Mango Soya", price: 25, emoji: "🥭", flavorKey: "mango" },
  { id: 3, name: "Choco Soya", price: 25, emoji: "🍫", flavorKey: "chocolate" },
  { id: 4, name: "Strawberry Soya", price: 25, emoji: "🍓", flavorKey: "strawberry" },
  { id: 5, name: "Ube Soya", price: 25, emoji: "🍠", flavorKey: "ube" },
  { id: 6, name: "Coffee Soya", price: 25, emoji: "☕", flavorKey: "coffee" },
  { id: 7, name: "Banana Soya", price: 25, emoji: "🍌", flavorKey: "banana" },
];

export const CAMPUS_OPTIONS = [
  "Main Gate", 
  "Library", 
  "Cafeteria", 
  "Dorms", 
  "Gym", 
  "Science Building", 
  "Admin Office"
];