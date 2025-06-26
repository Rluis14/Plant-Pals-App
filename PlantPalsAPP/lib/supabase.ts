import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwfbgmqynqgnrclzhrnl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZmJnbXF5bnFnbnJjbHpocm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTcwOTIsImV4cCI6MjA2NTA3MzA5Mn0.nDaEt-iVGF8Wo665wHUV2StFf2E-QmjqcC765Me9a3s'

// Create Supabase client with optimized settings for mobile
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    // Add retry configuration
    retryAttempts: 3,
    retryDelay: 1000,
  },
  global: {
    headers: {
      'X-Client-Info': 'plantpals-mobile-app',
      'User-Agent': 'PlantPals/1.0.0 (Mobile App)'
    }
  },
  // Add timeout configuration
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

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
  user_id: string
  saved_at: string
  plants: Plant
}

export type UserProfile = {
  user_id: string
  full_name: string
  created_at: string
  updated_at: string
}

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation helper
const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Enhanced authentication service with better error handling
export const authService = {
  // Sign up new user with comprehensive validation
  async signUp(email: string, password: string, fullName: string) {
    try {
      // Validate inputs before making API call
      const cleanEmail = email.trim().toLowerCase();
      
      if (!cleanEmail) {
        throw new Error('Please enter your email address.');
      }
      
      if (!isValidEmail(cleanEmail)) {
        throw new Error('Please enter a valid email address (e.g., user@example.com).');
      }
      
      if (!password) {
        throw new Error('Please enter a password.');
      }
      
      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters long.');
      }
      
      if (!fullName.trim()) {
        throw new Error('Please enter your full name.');
      }

      console.log('Attempting to sign up user:', cleanEmail);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim()
          },
          // Disable email confirmation for development
          emailRedirectTo: undefined,
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        
        // Handle specific error types with user-friendly messages
        if (error.message.includes('captcha') || error.message.includes('verification')) {
          throw new Error('Please try again in a few moments. If this continues, contact support.');
        }
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          throw new Error(`An account with ${cleanEmail} already exists. Please try logging in instead.`);
        }
        if (error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        }
        if (error.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (error.message.includes('rate limit') || error.message.includes('too many')) {
          throw new Error('Too many attempts. Please wait 5 minutes and try again.');
        }
        if (error.message.includes('signup is disabled')) {
          throw new Error('Account registration is temporarily disabled. Please try again later.');
        }
        
        // Generic error fallback
        throw new Error(`Registration failed: ${error.message}`);
      }

      console.log('Signup successful:', data.user?.email);
      
      // If user was created but needs email confirmation, handle it
      if (data.user && !data.session) {
        console.log('User created, waiting for email confirmation');
      }
      
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in user with comprehensive validation and helpful error messages
  async signIn(email: string, password: string) {
    try {
      // Validate inputs before making API call
      const cleanEmail = email.trim().toLowerCase();
      
      if (!cleanEmail) {
        throw new Error('Please enter your email address.');
      }
      
      if (!isValidEmail(cleanEmail)) {
        throw new Error('Please enter a valid email address (e.g., user@example.com).');
      }
      
      if (!password) {
        throw new Error('Please enter your password.');
      }

      console.log('Attempting to sign in user:', cleanEmail);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error('Supabase signin error:', error);
        
        // Handle specific error types with helpful messages
        if (error.message.includes('captcha') || error.message.includes('verification')) {
          throw new Error('Please try again in a few moments. If this continues, contact support.');
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before logging in.');
        }
        if (error.message.includes('Too many requests') || error.message.includes('rate limit')) {
          throw new Error('Too many attempts. Please wait 5 minutes and try again.');
        }
        if (error.message.includes('User not found')) {
          throw new Error(`No account found with email ${cleanEmail}. Would you like to create a new account?`);
        }
        if (error.message.includes('signin is disabled')) {
          throw new Error('Login is temporarily disabled. Please try again later.');
        }
        
        // Generic error fallback
        throw new Error(`Login failed: ${error.message}`);
      }

      console.log('Signin successful:', data.user?.email);
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out user
  async signOut() {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
        throw error;
      }
      console.log('Signout successful');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Get user error:', error);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Get session error:', error);
        return null;
      }
      return session;
    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'no user');
      callback(event, session);
    });
  }
}

// Helper function to get plant image URL
export const getPlantImageUrl = (imagePath?: string): string => {
  if (!imagePath) {
    return 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=400'
  }

  if (imagePath.startsWith('http')) {
    return imagePath
  }

  const { data } = supabase.storage
    .from('plant-images')
    .getPublicUrl(imagePath)

  return data.publicUrl
}

// Storage debug service for development
export const storageDebugService = {
  async listFiles() {
    try {
      const { data, error } = await supabase.storage
        .from('plant-images')
        .list('', { limit: 100 })
      
      if (error) {
        console.error('Storage list error:', error)
        return []
      }
      
      console.log('Storage files:', data?.map(f => f.name) || [])
      return data || []
    } catch (error) {
      console.error('Storage debug error:', error)
      return []
    }
  }
}

// Plant image service for syncing
export const plantImageService = {
  async syncPlantImages() {
    try {
      const files = await storageDebugService.listFiles()
      console.log(`Found ${files.length} files in storage`)
      
      // Update plants with correct image paths
      const { data: plants, error } = await supabase
        .from('plants')
        .select('id, name, image_path')
        .is('image_path', null)
      
      if (error) {
        console.error('Error fetching plants for sync:', error)
        return
      }
      
      console.log(`Found ${plants?.length || 0} plants without image paths`)
    } catch (error) {
      console.error('Image sync error:', error)
    }
  }
}

// Saved plants functions with proper authentication
export const savedPlantsService = {
  async getSavedPlants(): Promise<SavedPlant[]> {
    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

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
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false })

      if (error) {
        console.error('Error fetching saved plants:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getSavedPlants:', error)
      throw error
    }
  },

  async savePlant(plantId: number): Promise<void> {
    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Check if plant is already saved
      const { data: existing } = await supabase
        .from('saved_plants')
        .select('id')
        .eq('plant_id', plantId)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        throw new Error('Plant is already saved')
      }

      const { error } = await supabase
        .from('saved_plants')
        .insert([
          {
            plant_id: plantId,
            user_id: user.id,
          }
        ])

      if (error) {
        console.error('Error saving plant:', error)
        throw error
      }

      console.log(`Plant ${plantId} saved successfully for user ${user.id}`)
    } catch (error) {
      console.error('Error saving plant:', error)
      throw error
    }
  },

  async removePlant(plantId: number): Promise<void> {
    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('saved_plants')
        .delete()
        .eq('plant_id', plantId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error removing plant:', error)
        throw error
      }

      console.log(`Plant ${plantId} removed successfully for user ${user.id}`)
    } catch (error) {
      console.error('Error removing plant:', error)
      throw error
    }
  },

  async isPlantSaved(plantId: number): Promise<boolean> {
    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        return false
      }

      const { data, error } = await supabase
        .from('saved_plants')
        .select('id')
        .eq('plant_id', plantId)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking if plant is saved:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Error checking if plant is saved:', error)
      return false
    }
  }
}

// Plant service functions
export const plantService = {
  async getAllPlants(): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select(`
        *,
        categories (
          name
        )
      `)
      .order('name')

    if (error) {
      console.error('Error fetching plants:', error)
      throw error
    }

    return data || []
  },

  async searchPlants(searchTerm: string): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select(`
        *,
        categories (
          name
        )
      `)
      .or(`name.ilike.%${searchTerm}%,scientific_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('name')
      .limit(50)

    if (error) {
      console.error('Error searching plants:', error)
      throw error
    }

    return data || []
  },

  async getPlantById(id: number): Promise<Plant | null> {
    const { data, error } = await supabase
      .from('plants')
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching plant:', error)
      return null
    }

    return data
  }
}

// User profile service
export const userProfileService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      return null
    }
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in updateUserProfile:', error)
      throw error
    }
  }
}