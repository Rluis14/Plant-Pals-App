import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SearchDetailScreen() {
  const { plant } = useLocalSearchParams();
  const router = useRouter();
  const [plantDetails, setPlantDetails] = useState(null);

  useEffect(() => {
    if (plant) {
      try {
        const plantStr = Array.isArray(plant) ? plant[0] : plant;
        const plantObj = JSON.parse(decodeURIComponent(plantStr));
        setPlantDetails(plantObj);
      } catch (error) {
        console.error('Error parsing plant data:', error);
        Alert.alert('Error', 'Failed to load plant details');
        router.back();
      }
    }
  }, [plant]);

  const handleAddToList = () => {
    Alert.alert("Added", "Plant added to your list!");
  };

  const handleSetReminder = () => {
    Alert.alert("Reminder", "Watering reminder set!");
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!plantDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading plant details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#2F684E" />
      </TouchableOpacity>

      <Text style={styles.title}>{plantDetails.name}</Text>

      <Image 
        source={require('../../assets/images/not.png')}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.description}>{plantDetails.description || 'No description available.'}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleAddToList}>
          <Ionicons name="add-circle-outline" size={28} color="#2F684E" />
          <Text style={styles.buttonText}>Add to My List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleSetReminder}>
          <Ionicons name="alarm-outline" size={28} color="#2F684E" />
          <Text style={styles.buttonText}>Set Reminder</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2F684E',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 30,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 6,
    fontSize: 14,
    color: '#2F684E',
  },
});