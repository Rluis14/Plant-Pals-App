import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function PlantCard({ plant }) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push({
      pathname: '/plant/detail',
      params: {
        plant: encodeURIComponent(JSON.stringify(plant))
      }
    });
  };

  const waterInfo = {
    summary: `Water every ${plant.water_frequency_days} days`,
    instructions: plant.water_instructions
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Image 
        source={{ uri: plant.image_url }} 
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{plant.name}</Text>
        {plant.scientific_name && (
          <Text style={styles.scientific}>{plant.scientific_name}</Text>
        )}
        <Text style={styles.watering}>{waterInfo.summary}</Text>
        <View style={styles.meta}>
          <Text style={styles.care}>Care: {plant.care_level}</Text>
          <Text style={styles.light}>Light: {plant.light_requirements}</Text>
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