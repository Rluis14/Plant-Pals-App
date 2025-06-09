// File: app/(auth)/welcome.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WelcomeScreen = () => {
  return (
    <LinearGradient 
      colors={['#E6F2EA', '#D4E8DE']} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image 
            // source={require('')} 
            resizeMode="contain" 
            style={styles.logo} 
          />
          <Text style={styles.title}>PlantPals</Text>
          <Text style={styles.subtitle}>Discover, Grow, and Care for Your Green Friends</Text>
        </View>

        <View style={styles.plantContainer}>
          {/* <Image 
            source={require('')} 
            style={styles.plantImage} 
          /> */}
          <View style={styles.circle} />
        </View>

        <View style={styles.featureContainer}>
          <View style={styles.featureCard}>
            {/* <Image 
              source={require('')} 
              style={styles.featureIcon} 
            /> */}
            <Text style={styles.featureText}>Discover thousands of plants</Text>
          </View>
          
          <View style={styles.featureCard}>
            {/* <Image 
              source={require('')} 
              style={styles.featureIcon} 
            /> */}
            <Text style={styles.featureText}>Smart watering reminders</Text>
          </View>
          
          <View style={styles.featureCard}>
            {/* <Image 
              source={require('')} 
              style={styles.featureIcon} 
            /> */}
            <Text style={styles.featureText}>Connect with plant lovers</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="./login" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="./register" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
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
  plantContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    position: 'relative',
  },
  plantImage: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    zIndex: 2,
  },
  circle: {
    position: 'absolute',
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.6,
    borderRadius: Dimensions.get('window').width * 0.3,
    backgroundColor: '#A67B5B',
    opacity: 0.1,
    zIndex: 1,
  },
  featureContainer: {
    marginVertical: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#2F684E',
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#2F684E',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2F684E',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2F684E',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;