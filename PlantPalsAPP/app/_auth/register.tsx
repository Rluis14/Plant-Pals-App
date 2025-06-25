import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { signUp } = useAuth();

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('Full name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email (e.g., user@example.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Handle input changes with validation
  const handleNameChange = (text: string) => {
    setName(text);
    if (nameError) {
      validateName(text);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      validatePassword(text);
    }
    // Also revalidate confirm password if it's been entered
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword, text);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      validateConfirmPassword(text, password);
    }
  };
  
  const handleRegister = async () => {
    // Validate all inputs
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Registration attempt for:', email.trim());
      await signUp(email, password, name);
      
      // Show success message
      Alert.alert(
        'Account Created!', 
        'Your account has been created successfully. You can now log in.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login screen
              router.replace('/_auth/login');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorTitle = 'Registration Failed';
      let errorMessage = error.message || 'Registration failed. Please try again.';
      let buttons: any[] = [{ text: 'OK', style: 'default' }];
      
      // Handle specific error cases with helpful actions
      if (errorMessage.includes('already exists')) {
        errorTitle = 'Account Already Exists';
        buttons = [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login Instead', 
            onPress: () => router.push('/_auth/login')
          }
        ];
      } else if (errorMessage.includes('valid email')) {
        errorTitle = 'Invalid Email';
        errorMessage = 'Please enter a valid email address (e.g., user@example.com).';
      } else if (errorMessage.includes('Password must be at least')) {
        errorTitle = 'Password Too Short';
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (errorMessage.includes('Security verification failed')) {
        errorTitle = 'Security Check';
        errorMessage = 'Security verification failed. Please wait a few minutes and try again.';
      } else if (errorMessage.includes('Too many signup attempts')) {
        errorTitle = 'Too Many Attempts';
        errorMessage = 'Too many registration attempts. Please wait a few minutes before trying again.';
      }
      
      Alert.alert(errorTitle, errorMessage, buttons);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name.trim() && email.trim() && password && confirmPassword && 
                     !nameError && !emailError && !passwordError && !confirmPasswordError;

  return (
    <LinearGradient 
      colors={['#E6F2EA', '#D4E8DE']} 
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/plant-logo.png')} 
              style={styles.logo} 
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our plant-loving community</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                placeholder="Your full name"
                placeholderTextColor="#A67B5B"
                value={name}
                onChangeText={handleNameChange}
                onBlur={() => validateName(name)}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="your.email@example.com"
                placeholderTextColor="#A67B5B"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }, passwordError ? styles.inputError : null]}
                  placeholder="••••••••"
                  placeholderTextColor="#A67B5B"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  editable={!loading}
                />
                <TouchableOpacity 
                  style={styles.showPasswordButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color="#A67B5B" 
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }, confirmPasswordError ? styles.inputError : null]}
                  placeholder="••••••••"
                  placeholderTextColor="#A67B5B"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  onBlur={() => validateConfirmPassword(confirmPassword, password)}
                  editable={!loading}
                />
                <TouchableOpacity 
                  style={styles.showPasswordButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color="#A67B5B" 
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[
                styles.registerButton, 
                (!isFormValid || loading) && styles.disabledButton
              ]}
              onPress={handleRegister}
              disabled={!isFormValid || loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our 
                <Text style={styles.termsLink}> Terms of Service</Text> and 
                <Text style={styles.termsLink}> Privacy Policy</Text>
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/_auth/login" asChild>
              <TouchableOpacity disabled={loading}>
                <Text style={[styles.footerLink, loading && styles.disabledText]}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F684E',
    marginBottom: 10,
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    fontSize: 16,
    color: '#2F684E',
    textAlign: 'center',
    maxWidth: 300,
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 30,
    padding: 25,
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#2F684E',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#A67B5B',
    color: '#2F684E',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 15,
    padding: 10,
  },
  registerButton: {
    backgroundColor: '#2F684E',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    color: '#2F684E',
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
  },
  termsLink: {
    color: '#66D9EF',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#2F684E',
    marginRight: 5,
  },
  footerLink: {
    color: '#66D9EF',
    fontWeight: 'bold',
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default RegisterScreen;