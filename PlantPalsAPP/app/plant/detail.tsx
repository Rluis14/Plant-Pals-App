// app/plant/detail.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

// ✅ This gives you access to the passed URL params
const { plant } = useLocalSearchParams();

// ✅ Decode the string back into a usable object
const plantStr = Array.isArray(plant) ? plant[0] : plant;
const plantObj = plantStr ? JSON.parse(decodeURIComponent(plantStr)) : null;

type PlantDetailRouteParams = {
  plant?: any; // Replace 'any' with your actual plant type if available
};

export default function PlantDetailScreen() {
  const params = useLocalSearchParams();
  
  // Decode the plant data
  const plant = params.plant 
    ? JSON.parse(decodeURIComponent(params.plant as string)) 
    : null;

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text>Plant data not available</Text>
      </View>
    );
  }
  // 🔽 Placeholder to fetch latest details by plant ID
  /*
  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await fetch(`https://your-api-url.com/plants/${plant.id}`);
        const data = await response.json();
        setPlantDetails(data);
      } catch (error) {
        console.error('Failed to load plant details:', error);
      }
    };

    if (!plant.description) {
      fetchPlantDetails();
    }
  }, []);
  */

  if (!plantDetails) {
    return (
      <View style={styles.center}>
        <Text>Loading plant details...</Text>
      </View>
    );
  }

  const handleSetReminder = () => {
    Alert.alert("Reminder", "Watering reminder set!");
    // Replace this with push notification or calendar integration
  };

  const handleSave = () => {
    Alert.alert("Saved", "This plant was added to your list.");
    // Replace with POST to user’s saved list
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{plantDetails.name}</Text>

      {/* <Image 
        source={
          plantDetails.imageUrl 
            ? { uri: plantDetails.imageUrl } 
            : require('')
        }
        style={styles.image}
      /> */}

      <Text style={styles.description}>
        {plantDetails.description || 'No description provided.'}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
          <Ionicons name="heart-outline" size={26} />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSetReminder} style={styles.iconButton}>
          <Ionicons name="alarm-outline" size={26} />
          <Text style={styles.buttonText}>Remind</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 30,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 6,
    fontSize: 14,
  },
});
