import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MyListScreen() {
  const [savedPlants, setSavedPlants] = useState([]);
  const router = useRouter();

  // 🔽 Placeholder for fetching user's saved plant list
  /*
  useEffect(() => {
    const fetchSavedPlants = async () => {
      try {
        const response = await fetch('https://your-api-url.com/mylist'); // REPLACE WITH ENDPOINT
        const data = await response.json();
        setSavedPlants(data.plants); // expects an array of saved plants
      } catch (error) {
        console.error('Failed to fetch saved plants:', error);
      }
    };

    fetchSavedPlants();
  }, []);
  */

  interface Plant {
    id: number | string;
    name: string;
    imageUrl?: string;
    [key: string]: any;
  }

  const handleViewPlant = (plant: Plant) => {
    router.push({
      pathname: '/plant/detail',
      params: { plant: encodeURIComponent(JSON.stringify(plant)) },
    });
  };

  const handleRemovePlant = (plantId) => {
    setSavedPlants((prev) => prev.filter((p) => p.id !== plantId));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Saved Plants</Text>

      <FlatList
        data={savedPlants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.plantItem}>
            <TouchableOpacity onPress={() => handleViewPlant(item)} style={styles.row}>
              <Image
                source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/images/not.png')}
                style={styles.image}
              />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleViewPlant(item)}>
                <Ionicons name="eye-outline" size={22} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemovePlant(item.id)}>
                <Ionicons name="trash-outline" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.placeholder}>You haven’t saved any plants yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  plantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 16,
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  placeholder: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888',
  },
});
