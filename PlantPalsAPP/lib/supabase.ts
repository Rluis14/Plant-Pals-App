import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwfbgmqynqgnrclzhrnl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZmJnbXF5bnFnbnJjbHpocm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTcwOTIsImV4cCI6MjA2NTA3MzA5Mn0.nDaEt-iVGF8Wo665wHUV2StFf2E-QmjqcC765Me9a3s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Plant = {
  id: number
  name: string
  scientific_name?: string
  description?: string
  water_frequency_days?: number
  water_instructions?: string
  light_requirements?: string
  care_level?: string
  category_id?: number
  image_path?: string
  categories?: {
    name: string
  }
}

export type SavedPlant = {
  id: number
  plant_id: number
  user_id?: string
  saved_at: string
  plants: Plant
}

// Saved plants functions
export const savedPlantsService = {
  // Get all saved plants for a user (for now, we'll use a dummy user_id)
  async getSavedPlants(): Promise<SavedPlant[]> {
    const { data, error } = await supabase
      .from('saved_plants')
      .select(`
        *,
        plants (
          *,
          categories (
            name
          )
        )
      `)
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved plants:', error);
      throw error;
    }

    return data || [];
  },

  // Save a plant to user's list
  async savePlant(plantId: number): Promise<void> {
    // Check if plant is already saved
    const { data: existing } = await supabase
      .from('saved_plants')
      .select('id')
      .eq('plant_id', plantId)
      .single();

    if (existing) {
      throw new Error('Plant is already saved');
    }

    const { error } = await supabase
      .from('saved_plants')
      .insert([
        {
          plant_id: plantId,
          user_id: 'demo_user', // In a real app, this would be the authenticated user's ID
        }
      ]);

    if (error) {
      console.error('Error saving plant:', error);
      throw error;
    }
  },

  // Remove a plant from user's saved list
  async removePlant(plantId: number): Promise<void> {
    const { error } = await supabase
      .from('saved_plants')
      .delete()
      .eq('plant_id', plantId);

    if (error) {
      console.error('Error removing plant:', error);
      throw error;
    }
  },

  // Check if a plant is saved
  async isPlantSaved(plantId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_plants')
      .select('id')
      .eq('plant_id', plantId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking if plant is saved:', error);
      return false;
    }

    return !!data;
  }
};