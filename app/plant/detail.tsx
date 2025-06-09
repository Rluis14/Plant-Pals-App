import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface PlantData {
  id?: number | string;
  name: string;
  description?: string;
  scientific_name?: string;
  water_frequency_days?: number;
  water_instructions?: string;
  light_requirements?: string;
  care_level?: string;
  category_id?: number;
  image_path?: string;
}

export default function PlantDetailScreen() {
  const { plant } = useLocalSearchParams();
  const router = useRouter();
  const [plantDetails, setPlantDetails] = useState<PlantData | null>(null);

  useEffect(() => {
    if (plant) {
      try {
        const plantStr = Array.isArray(plant) ? plant[0] : plant;
        if (plantStr && typeof plantStr === 'string') {
          const plantObj = JSON.parse(decodeURIComponent(plantStr));
          setPlantDetails(plantObj);
        }
      } catch (error) {
        console.error('Error parsing plant data:', error);
        Alert.alert('Error', 'Failed to load plant details');
        router.back();
      }
    }
  }, [plant]);

  if (!plantDetails) {
    return (
      <View style={styles.center}>
        <Text>Loading plant details...</Text>
      </View>
    );
  }

  const handleSetReminder = () => {
    Alert.alert("Reminder", "Watering reminder set!");
  };

  const handleSave = () => {
    Alert.alert("Saved", "This plant was added to your list.");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#2F684E" />
      </TouchableOpacity>

      <Text style={styles.title}>{plantDetails.name}</Text>

      {plantDetails.scientific_name && (
        <Text style={styles.scientificName}>{plantDetails.scientific_name}</Text>
      )}

      <Image 
        source={require('../../assets/images/not.png')}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.description}>
        {plantDetails.description || 'No description provided.'}
      </Text>

      {plantDetails.care_level && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Care Level:</Text>
          <Text style={styles.infoValue}>{plantDetails.care_level}</Text>
        </View>
      )}

      {plantDetails.light_requirements && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Light Requirements:</Text>
          <Text style={styles.infoValue}>{plantDetails.light_requirements}</Text>
        </View>
      )}

      {plantDetails.water_frequency_days && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Water Every:</Text>
          <Text style={styles.infoValue}>{plantDetails.water_frequency_days} days</Text>
        </View>
      )}

      {plantDetails.water_instructions && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Watering Instructions:</Text>
          <Text style={styles.infoValue}>{plantDetails.water_instructions}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
          <Ionicons name="heart-outline" size={26} color="#2F684E" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSetReminder} style={styles.iconButton}>
          <Ionicons name="alarm-outline" size={26} color="#2F684E" />
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
  backButton: {
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2F684E',
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
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
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F684E',
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
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