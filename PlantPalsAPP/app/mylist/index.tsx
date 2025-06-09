import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Plant {
  id: number | string;
  name: string;
  imageUrl?: string;
  description?: string;
}

export default function MyListScreen() {
  const [savedPlants, setSavedPlants] = useState<Plant[]>([]);
  const router = useRouter();

  // Mock data for demonstration
  useEffect(() => {
    const mockPlants: Plant[] = [
      { id: 1, name: 'Monstera Deliciosa', description: 'Popular houseplant with split leaves' },
      { id: 2, name: 'Snake Plant', description: 'Low maintenance succulent' },
    ];
    setSavedPlants(mockPlants);
  }, []);

  const handleViewPlant = (plant: Plant) => {
    router.push({
      pathname: '/plant/detail',
      params: { plant: encodeURIComponent(JSON.stringify(plant)) },
    });
  };

  const handleRemovePlant = (plantId: number | string) => {
    Alert.alert(
      'Remove Plant',
      'Are you sure you want to remove this plant from your list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSavedPlants((prev) => prev.filter((p) => p.id !== plantId));
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#2F684E" />
        </TouchableOpacity>
        <Text style={styles.header}>My Saved Plants</Text>
      </View>

      <FlatList
        data={savedPlants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.plantItem}>
            <TouchableOpacity onPress={() => handleViewPlant(item)} style={styles.row}>
              <Image
                source={require('../../assets/images/not.png')}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleViewPlant(item)}>
                <Ionicons name="eye-outline" size={22} color="#2F684E" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemovePlant(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.placeholder}>You haven't saved any plants yet.</Text>
        }
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2F684E',
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
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F684E',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  placeholder: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});