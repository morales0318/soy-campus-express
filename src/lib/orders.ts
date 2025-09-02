import { supabase } from "@/integrations/supabase/client";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  product_name: string;
  quantity: number;
  status: 'pending' | 'delivered';
  delivery_option: 'pickup' | 'delivery';
  delivery_fee: number;
  total_amount: number;
  created_at: string;
}

export const createOrder = async (items: OrderItem[], deliveryOption: 'pickup' | 'delivery' = 'pickup') => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  // Calculate pricing - all products now cost 25, delivery adds 5
  const basePrice = 25;
  const deliveryFee = deliveryOption === 'delivery' ? 5 : 0;
  
  // Create orders for each item
  const orders = items.map(item => {
    const itemTotal = (basePrice + deliveryFee) * item.quantity;
    return {
      user_id: user.id,
      product_name: item.productName,
      quantity: item.quantity,
      delivery_option: deliveryOption,
      delivery_fee: deliveryFee,
      total_amount: itemTotal,
      status: 'pending' as const,
    };
  });

  const { data, error } = await supabase
    .from('orders')
    .insert(orders)
    .select();

  if (error) {
    console.error('Error creating orders:', error);
    throw error;
  }

  return data;
};

export const getUserOrders = async (): Promise<Order[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }

  return (data || []) as Order[];
};

export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }

  return (data || []) as Order[];
};

export const updateOrderStatus = async (orderId: string, status: 'pending' | 'delivered') => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};