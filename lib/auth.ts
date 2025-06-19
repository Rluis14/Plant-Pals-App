import { supabase } from './supabase'

export interface SignUpData {
  email: string
  password: string
  fullName: string
}

export interface SignInData {
  email: string
  password: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  created_at: string
  updated_at: string
}

class AuthService {
  // Sign up new user
  async signUp({ email, password, fullName }: SignUpData) {
    try {
      // Use the edge function for signup to ensure proper profile creation
      const { data, error } = await supabase.functions.invoke('auth-signup', {
        body: { email, password, fullName }
      })

      if (error) {
        throw new Error(error.message || 'Failed to create account')
      }

      return data
    } catch (error) {
      console.error('SignUp error:', error)
      throw error
    }
  }

  // Sign in existing user
  async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('SignIn error:', error)
      throw error
    }
  }

  // Sign out current user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('SignOut error:', error)
      throw error
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        throw new Error(error.message)
      }
      return session
    } catch (error) {
      console.error('GetSession error:', error)
      throw error
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Profile not found
        }
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('GetUserProfile error:', error)
      throw error
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<Pick<UserProfile, 'full_name'>>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('UpdateUserProfile error:', error)
      throw error
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'plantpalsapp://reset-password',
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('ResetPassword error:', error)
      throw error
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()