import { User, Order } from '../types';

const LS_USERS = "soy_users";
const LS_AUTH = "soy_auth_user";
const LS_ORDERS = (username: string) => `soy_orders_${username}`;

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
}

export function getOrders(username: string): Order[] {
  const key = LS_ORDERS(username);
  try { 
    return JSON.parse(localStorage.getItem(key) || "[]"); 
  } catch { 
    return []; 
  }
}