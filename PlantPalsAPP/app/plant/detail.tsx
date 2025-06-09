import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PlantDetailScreen() {
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

      <Image 
        source={require('../../assets/images/not.png')}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.description}>
        {plantDetails.description || 'No description provided.'}
      </Text>

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
    marginBottom: 15,
    color: '#2F684E',
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
    color: '#2F684E',
  },
});