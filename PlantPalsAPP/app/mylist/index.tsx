import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { savedPlantsService } from '../../lib/supabase';

interface Plant {
  id: number;
  name: string;
  scientific_name?: string;
  image_path?: string;
  categories?: { name: string };
}

interface SavedPlant {
  id: number;
  plant_id: number;
  saved_at: string;
  plants: Plant;
}

export default function MyListScreen() {
  const [savedPlants, setSavedPlants] = useState<SavedPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedPlants();
    }
  }, [user]);

  const fetchSavedPlants = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await savedPlantsService.getUserSavedPlants(user.id);
      setSavedPlants(data || []);
    } catch (error) {
      console.error('Failed to fetch saved plants:', error);
      Alert.alert('Error', 'Failed to load your saved plants');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPlant = (plant: Plant) => {
    router.push({
      pathname: '/plant/detail',
      params: { plant: encodeURIComponent(JSON.stringify(plant)) },
    });
  };

  const handleRemovePlant = async (savedPlantId: number, plantId: number) => {
    if (!user) return;

    Alert.alert(
      'Remove Plant',
      'Are you sure you want to remove this plant from your list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await savedPlantsService.removeSavedPlant(user.id, plantId);
              setSavedPlants(prev => prev.filter(item => item.id !== savedPlantId));
            } catch (error) {
              console.error('Failed to remove plant:', error);
              Alert.alert('Error', 'Failed to remove plant from your list');
            }
          }
        }
      ]
    );
  };

  const renderPlantItem = ({ item }: { item: SavedPlant }) => (
    <View style={styles.plantItem}>
      <TouchableOpacity onPress={() => handleViewPlant(item.plants)} style={styles.row}>
        <Image
          source={
            item.plants.image_path 
              ? { uri: `https://your-supabase-url.supabase.co/storage/v1/object/public/plant-images/${item.plants.image_path}` }
              : require('../../assets/images/not.png')
          }
          style={styles.image}
        />
        <View style={styles.plantInfo}>
          <Text style={styles.name}>{item.plants.name}</Text>
          {item.plants.scientific_name && (
            <Text style={styles.scientificName}>{item.plants.scientific_name}</Text>
          )}
          {item.plants.categories && (
            <Text style={styles.category}>{item.plants.categories.name}</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleViewPlant(item.plants)}>
          <Ionicons name="eye-outline" size={22} color="#2F684E" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemovePlant(item.id, item.plants.id)}>
          <Ionicons name="trash-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading your saved plants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Saved Plants</Text>

      <FlatList
        data={savedPlants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlantItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={64} color="#A67B5B" />
            <Text style={styles.emptyTitle}>No saved plants yet</Text>
            <Text style={styles.emptySubtitle}>
              Start exploring and save plants you'd like to remember!
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.exploreButtonText}>Explore Plants</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={savedPlants.length === 0 ? styles.emptyList : undefined}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#2F684E',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  plantInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F684E',
    marginBottom: 2,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#A67B5B',
    backgroundColor: '#E6F2EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F684E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#2F684E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});