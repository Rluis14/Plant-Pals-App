import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeFeedScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

type WeatherData = {
  city: string;
  temp: number | string;
  condition: string;
  icon: string | null;
  humidity: number | string;
  wind: number | string;
} | null;

export default function HomeFeedScreen({ navigation }: HomeFeedScreenProps) {
  const [weather, setWeather] = useState<WeatherData>(null);
  const [fact, setFact] = useState('');
  const [lastWatered, setLastWatered] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    "Plants can improve indoor air quality by filtering toxins."
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

  // Generate random plant fact
  const generateFact = () => {
    const randomIndex = Math.floor(Math.random() * plantFacts.length);
    setFact(plantFacts[randomIndex]);
  };

  // Handle watering
  const handleWaterPlants = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastWatered(`Last watered: Today at ${timeString}`);
  };

  // Handle logout
  const handleLogout = () => {
    // In a real app, this would clear auth tokens and navigate to login
    console.log('User logged out');
    navigation.navigate('Login');
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();
    generateFact();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Initial data load
  useEffect(() => {
    fetchWeather();
    generateFact();
    setLastWatered("No watering recorded today");
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
        <Text style={styles.title}>PlantHome</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#333" />
        </TouchableOpacity>
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

      {/* Water Reminder Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="water-outline" size={24} color="#333" />
          <Text style={styles.cardTitle}>Water Reminder</Text>
        </View>
        <Text style={styles.reminderText}>Your plants need water!</Text>
        <Text style={styles.lastWatered}>{lastWatered}</Text>
        <TouchableOpacity 
          style={styles.waterButton} 
          onPress={handleWaterPlants}
        >
          <Text style={styles.buttonText}>I Watered My Plants</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c6e49',
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
  reminderText: {
    fontSize: 18,
    color: '#e63946',
    fontWeight: '500',
    marginBottom: 10,
  },
  lastWatered: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
  },
  factText: {
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 26,
    color: '#555',
    marginBottom: 15,
  },
  waterButton: {
    backgroundColor: '#4c956c',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
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