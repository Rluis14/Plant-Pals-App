import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hwfbgmqynqgnrclzhrnl.supabase.coL'
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZmJnbXF5bnFnbnJjbHpocm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTcwOTIsImV4cCI6MjA2NTA3MzA5Mn0.nDaEt-iVGF8Wo665wHUV2StFf2E-QmjqcC765Me9a3s'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions for database operations
export const plantService = {
  // Get all plants with category info
  async getAllPlants() {
    const { data, error } = await supabase
      .from('plants')
      .select(`
        *,
        categories(name)
      `)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Search plants by name
  async searchPlants(searchTerm) {
    const { data, error } = await supabase
      .from('plants')
      .select(`
        *,
        categories(name)
      `)
      .ilike('name', `%${searchTerm}%`)
      .limit(20);
    
    if (error) throw error;
    return data;
  },

  // Get plants by category
  async getPlantsByCategory(categoryId) {
    const { data, error } = await supabase
      .from('plants')
      .select(`
        *,
        categories(name)
      `)
      .eq('category_id', categoryId)
      .limit(20);
    
    if (error) throw error;
    return data;
  },

  // Get single plant by ID
  async getPlantById(id) {
    const { data, error } = await supabase
      .from('plants')
      .select(`
        *,
        categories(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const categoryService = {
  // Get all categories
  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }
};

export const savedPlantsService = {
  // Get user's saved plants
  async getUserSavedPlants(userId) {
    const { data, error } = await supabase
      .from('saved_plants')
      .select(`
        *,
        plants(
          *,
          categories(name)
        )
      `)
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Save a plant for user
  async savePlant(userId, plantId) {
    const { data, error } = await supabase
      .from('saved_plants')
      .insert({
        user_id: userId,
        plant_id: plantId
      })
      .select();
    
    if (error) throw error;
    return data;
  },

  // Remove saved plant
  async removeSavedPlant(userId, plantId) {
    const { error } = await supabase
      .from('saved_plants')
      .delete()
      .eq('user_id', userId)
      .eq('plant_id', plantId);
    
    if (error) throw error;
  },

  // Check if plant is saved by user
  async isPlantSaved(userId, plantId) {
    const { data, error } = await supabase
      .from('saved_plants')
      .select('id')
      .eq('user_id', userId)
      .eq('plant_id', plantId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};

export const userService = {
  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};