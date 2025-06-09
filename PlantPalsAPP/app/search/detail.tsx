import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Correct for expo-router
import { Ionicons } from '@expo/vector-icons';

export default function SearchDetailScreen() {
  const { plant } = useLocalSearchParams();
  const plantStr = Array.isArray(plant) ? plant[0] : plant;
  const plantObj = JSON.parse(decodeURIComponent(plantStr)); // decode the passed object

  const [plantDetails, setPlantDetails] = useState(plantObj || null);

  // 🔽 API fetch placeholder — for getting full plant detail by ID
  /*
  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await fetch(`https://your-api-url.com/plants/${plantObj.id}`); // REPLACE WITH ENDPOINT
        const data = await response.json();
        setPlantDetails(data);
      } catch (error) {
        console.error('Error fetching plant detail:', error);
      }
    };

    if (!plantObj.description) {
      fetchPlantDetails();
    }
  }, []);
  */

  if (!plantDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading plant details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{plantDetails.name}</Text>

      {/* <Image 
        source={
          plantDetails.imageUrl 
            ? { uri: plantDetails.imageUrl } 
            : require('../../assets/images/plant-placeholder.png')
        }
        style={styles.image}
        resizeMode="cover"
      /> */}

      <Text style={styles.description}>{plantDetails.description || 'No description available.'}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="add-circle-outline" size={28} />
          <Text style={styles.buttonText}>Add to My List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="alarm-outline" size={28} />
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
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
  },
});
