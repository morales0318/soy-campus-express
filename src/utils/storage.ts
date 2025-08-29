import { User, Order } from '../types';

const LS_USERS = "soy_users";
const LS_AUTH = "soy_auth_user";
const LS_ORDERS = (username: string) => `soy_orders_${username}`;
const LS_ALL_ORDERS = "soy_all_orders";

export function getUsers(): User[] {
  try { 
    return JSON.parse(localStorage.getItem(LS_USERS) || "[]"); 
  } catch { 
    return []; 
  }
}

export function saveUsers(users: User[]): void { 
  localStorage.setItem(LS_USERS, JSON.stringify(users)); 
}

export function findUser(username: string): User | undefined { 
  return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase()); 
}

export function setAuthedUser(username: string): void { 
  localStorage.setItem(LS_AUTH, username); 
}

export function getAuthedUser(): string | null { 
  return localStorage.getItem(LS_AUTH); 
}

export function logout(): void { 
  localStorage.removeItem(LS_AUTH); 
}

export function saveOrder(username: string, order: Order): void {
  const key = LS_ORDERS(username);
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push(order);
  localStorage.setItem(key, JSON.stringify(existing));
  
  // Also save to all orders for admin view
  const allOrders = getAllOrders();
  const orderWithId = { ...order, id: Date.now().toString(), username };
  allOrders.push(orderWithId);
  localStorage.setItem(LS_ALL_ORDERS, JSON.stringify(allOrders));
}

export function getOrders(username: string): Order[] {
  const key = LS_ORDERS(username);
  try { 
    return JSON.parse(localStorage.getItem(key) || "[]"); 
  } catch { 
    return []; 
  }
}

export function getAllOrders(): any[] {
  try { 
    return JSON.parse(localStorage.getItem(LS_ALL_ORDERS) || "[]"); 
  } catch { 
    return []; 
  }
}

export function updateOrderStatus(orderId: string, status: "pending" | "delivered"): void {
  const allOrders = getAllOrders();
  const updatedOrders = allOrders.map(order => 
    order.id === orderId ? { ...order, status } : order
  );
  localStorage.setItem(LS_ALL_ORDERS, JSON.stringify(updatedOrders));
  
  // Also update in user's orders
  const order = allOrders.find(o => o.id === orderId);
  if (order) {
    const userOrders = getOrders(order.username);
    const updatedUserOrders = userOrders.map(o => 
      o.createdAt === order.createdAt ? { ...o, status } : o
    );
    const key = LS_ORDERS(order.username);
    localStorage.setItem(key, JSON.stringify(updatedUserOrders));
  }
}