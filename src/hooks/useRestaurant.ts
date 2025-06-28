import { useState, useEffect } from 'react';
import { supabase, Restaurant } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useRestaurant = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRestaurant();
    } else {
      setRestaurant(null);
      setLoading(false);
    }
  }, [user]);

  const fetchRestaurant = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching restaurant:', error);
      } else {
        setRestaurant(data);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRestaurant = async (restaurantData: Partial<Restaurant>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert([
          {
            ...restaurantData,
            owner_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        return { error };
      }

      // Create initial credits balance
      await supabase
        .from('credits_balance')
        .insert([
          {
            restaurant_id: data.id,
            sms_credits: 150,
            email_credits: 200,
            whatsapp_utility_credits: 75,
            whatsapp_marketing_credits: 50,
          },
        ]);

      setRestaurant(data);
      return { data };
    } catch (error) {
      return { error };
    }
  };

  const updateRestaurant = async (updates: Partial<Restaurant>) => {
    if (!restaurant) return { error: 'No restaurant found' };

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update(updates)
        .eq('id', restaurant.id)
        .select()
        .single();

      if (error) {
        return { error };
      }

      setRestaurant(data);
      return { data };
    } catch (error) {
      return { error };
    }
  };

  return {
    restaurant,
    loading,
    createRestaurant,
    updateRestaurant,
    refetch: fetchRestaurant,
  };
};