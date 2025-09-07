import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  available: boolean;
  stock: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
};

export const updateProductAvailability = async (productId: string, available: boolean) => {
  const { error } = await supabase
    .from('products')
    .update({ available })
    .eq('id', productId);

  if (error) {
    console.error('Error updating product availability:', error);
    throw error;
  }
};