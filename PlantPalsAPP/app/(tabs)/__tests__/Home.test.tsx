import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { plantService, Plant } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import PlantImage from '../../../components/PlantImage';


export default function HomeFeedScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [fact, setFact] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featuredPlants, setFeaturedPlants] = useState<Plant[]>([]);
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  const API_KEY = '3e472eb5649948f2bc281216252006'; // Your WeatherAPI.com key
  const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';
  
  // Plant facts database
  const plantFacts = [
    "Plants can communicate with each other through their root systems.",
    "Some plants can grow without soil using hydroponics.",
    "The smell of freshly cut grass is actually a plant distress signal.",
    "Bamboo is the fastest-growing woody plant in the world.",
    "The tallest sunflower on record reached 30 feet 1 inch tall.",
    "Plants release oxygen during photosynthesis.",
    "Some plants can survive for months without water by going dormant.",
    "The study of plants is called botany.",
    "Plants can improve indoor air quality by filtering toxins.",
    "A single tree can absorb 48 pounds of CO2 per year.",
    "Some plants can live for thousands of years.",
    "Plants have been used for medicine for over 60,000 years."
  ];

  // Fetch weather data from WeatherAPI.com
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `${WEATHER_API_URL}?key=${API_KEY}&q=auto:ip&aqi=no`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setWeather({
        city: data.location.name,
        temp: data.current.temp_c,
        condition: data.current.condition.text,
        icon: `https:${data.current.condition.icon}`,
        humidity: data.current.humidity,
        wind: data.current.wind_kph,
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Unable to load weather data');
      setWeather({
        city: "Error",
        temp: "--",
        condition: "Weather unavailable",
        icon: null,
        humidity: "--",
        wind: "--",
      });
    }
  };

  // Fetch featured plants
  const fetchFeaturedPlants = async () => {
    try {
      const plants = await plantService.getAllPlants();
      // Get a random selection of 3 plants for featured section
      const shuffled = plants.sort(() => 0.5 - Math.random());
      setFeaturedPlants(shuffled.slice(0, 3));
    } catch (error) {
      console.error('Error fetching featured plants:', error);
    }
  };

  // Generate random plant fact
  const generateFact = () => {
    const randomIndex = Math.floor(Math.random() * plantFacts.length);
    setFact(plantFacts[randomIndex]);
  };

  // Handle plant selection
  const handlePlantSelect = (plant: Plant) => {
    router.push({
      pathname: '/plant/detail',
      params: { plant: encodeURIComponent(JSON.stringify(plant)) },
    });
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/_auth/welcome');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();
    generateFact();
    fetchFeaturedPlants();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Initial data load
  useEffect(() => {
    fetchWeather();
    generateFact();
    fetchFeaturedPlants();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>PlantHome</Text>
          {user && (
            <Text style={styles.welcomeText}>Welcome back!</Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
            <Ionicons name="search-outline" size={28} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weather Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="partly-sunny-outline" size={24} color="#333" />
          <Text style={styles.cardTitle}>Weather</Text>
        </View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : weather ? (
          <>
            <Text style={styles.weatherText}>{weather.city}</Text>
            <View style={styles.weatherRow}>
              <View style={styles.weatherMain}>
                <Text style={styles.temperature}>{weather.temp}°C</Text>
                <Text style={styles.condition}>{weather.condition}</Text>
              </View>
              {weather.icon && (
                <Image 
                  source={{ uri: weather.icon }} 
                  style={styles.weatherIcon}
                />
              )}
            </View>
            <View style={styles.weatherDetails}>
              <Text style={styles.detailText}>Humidity: {weather.humidity}%</Text>
              <Text style={styles.detailText}>Wind: {weather.wind} km/h</Text>
            </View>
          </>
        ) : (
          <Text>Loading weather...</Text>
        )}
      </View>

      {/* Featured Plants Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="leaf-outline" size={24} color="#333" />
          <Text style={styles.cardTitle}>Featured Plants</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plantsScroll}>
          {featuredPlants.map((plant) => (
            <TouchableOpacity 
              key={plant.id} 
              style={styles.plantCard}
              onPress={() => handlePlantSelect(plant)}
            >
              <PlantImage
                imagePath={plant.image_path}
                style={styles.plantCardImage}
                defaultSize={120}
              />
              <Text style={styles.plantCardName} numberOfLines={2}>{plant.name}</Text>
              <Text style={styles.plantCardCare}>{plant.care_level} Care</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Text style={styles.exploreButtonText}>Explore More Plants</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Plant Fact Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="leaf-outline" size={24} color="#333" />
          <Text style={styles.cardTitle}>Plant Fact</Text>
        </View>
        <Text style={styles.factText}>"{fact}"</Text>
        <TouchableOpacity 
          style={styles.factButton} 
          onPress={generateFact}
        >
          <Text style={styles.buttonText}>New Fact</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9f1',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c6e49',
  },
  welcomeText: {
    fontSize: 16,
    color: '#2c6e49',
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  logoutButton: {
    padding: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#555',
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  weatherMain: {
    flex: 1,
  },
  temperature: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2c6e49',
    marginVertical: 5,
  },
  condition: {
    fontSize: 18,
    color: '#777',
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
  },
  plantsScroll: {
    marginBottom: 15,
  },
  plantCard: {
    width: 140,
    marginRight: 15,
    alignItems: 'center',
  },
  plantCardImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  plantCardName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  plantCardCare: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c6e49',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  factText: {
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 26,
    color: '#555',
    marginBottom: 15,
  },
  factButton: {
    backgroundColor: '#2c6e49',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#e63946',
    fontSize: 16,
    textAlign: 'center',
  },
});