import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plant } from '../lib/supabase';
import PlantImage from './PlantImage';

interface PlantCardProps {
  plant: Plant;
  onPress?: () => void;
}

export default function PlantCard({ plant, onPress }: PlantCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/plant/detail',
        params: {
          plant: encodeURIComponent(JSON.stringify(plant))
        }
      });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <PlantImage
        imagePath={plant.image_path}
        style={styles.image}
        defaultSize={80}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{plant.name}</Text>
        {plant.scientific_name && (
          <Text style={styles.scientific}>{plant.scientific_name}</Text>
        )}
        {plant.water_frequency_days && (
          <Text style={styles.watering}>Water every {plant.water_frequency_days} days</Text>
        )}
        <View style={styles.meta}>
          {plant.care_level && (
            <Text style={styles.care}>Care: {plant.care_level}</Text>
          )}
          {plant.light_requirements && (
            <Text style={styles.light}>Light: {plant.light_requirements}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#333',
  },
  scientific: {
    fontStyle: 'italic',
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  watering: {
    color: '#2e86de',
    fontSize: 14,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  care: {
    color: '#10ac84',
    fontSize: 14,
  },
  light: {
    color: '#ff9f43',
    fontSize: 14,
  },
});