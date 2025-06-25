import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { savedPlantsService, SavedPlant } from '../../lib/supabase';
import PlantImage from '../../components/PlantImage';

function MyListScreen() {
  const [savedPlants, setSavedPlants] = useState<SavedPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchSavedPlants = async () => {
    try {
      const data = await savedPlantsService.getSavedPlants();
      setSavedPlants(data);
    } catch (error) {
      console.error('Error fetching saved plants:', error);
      Alert.alert('Error', 'Failed to load your saved plants. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSavedPlants();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSavedPlants();
  };

  const handleViewPlant = (savedPlant: SavedPlant) => {
    router.push({
      pathname: '/plant/detail',
      params: { plant: encodeURIComponent(JSON.stringify(savedPlant.plants)) },
    });
  };

  const handleRemovePlant = async (savedPlant: SavedPlant) => {
    Alert.alert(
      'Remove Plant',
      `Are you sure you want to remove ${savedPlant.plants.name} from your list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await savedPlantsService.removePlant(savedPlant.plant_id);
              setSavedPlants((prev) => prev.filter((p) => p.id !== savedPlant.id));
              Alert.alert('Success', `${savedPlant.plants.name} has been removed from your list.`);
            } catch (error) {
              console.error('Error removing plant:', error);
              Alert.alert('Error', 'Failed to remove plant. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderPlantItem = ({ item }: { item: SavedPlant }) => (
    <View style={styles.plantItem}>
      <TouchableOpacity onPress={() => handleViewPlant(item)} style={styles.row}>
        <PlantImage
          imagePath={item.plants.image_path}
          style={styles.plantImage}
          defaultSize={80}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.plants.name}</Text>
          {item.plants.scientific_name && (
            <Text style={styles.scientificName}>{item.plants.scientific_name}</Text>
          )}
          {item.plants.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.plants.description}
            </Text>
          )}
          <View style={styles.plantMeta}>
            {item.plants.categories?.name && (
              <View style={styles.categoryTag}>
                <Ionicons name="leaf" size={12} color="#2F684E" />
                <Text style={styles.categoryText}>{item.plants.categories.name}</Text>
              </View>
            )}
            {item.plants.care_level && (
              <View style={styles.careLevelTag}>
                <Text style={styles.careLevelText}>{item.plants.care_level}</Text>
              </View>
            )}
            
          </View>
          <Text style={styles.savedDate}>
            Saved {new Date(item.saved_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleViewPlant(item)} style={styles.actionButton}>
          <Ionicons name="eye-outline" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemovePlant(item)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>My Saved Plants</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2F684E" />
          <Text style={styles.loadingText}>Loading your plants...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Saved Plants</Text>
        <Text style={styles.subHeader}>{savedPlants.length} plants in your collection</Text>
      </View>

      <FlatList
        data={savedPlants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlantItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={64} color="#2F684E" />
            <Text style={styles.emptyTitle}>No saved plants yet</Text>
            <Text style={styles.emptySubtitle}>
              Search for plants and add them to your collection to see them here
            </Text>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => router.push('/(tabs)/search')}
            >
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.searchButtonText}>Start Searching</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F2EA',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2F684E',
  },
  subHeader: {
    fontSize: 14,
    marginTop: 4,
    color: '#2F684E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2F684E',
  },
  plantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  plantImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 3,
    color: '#2F684E',
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 5,
    color: '#000',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
    color: '#000',
  },
  plantMeta: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
  },
  careLevelTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  careLevelText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
  },
  waterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    backgroundColor: '#f0f0f0',
  },
  waterText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
  },
  savedDate: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    color: '#000',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    backgroundColor: '#2F684E',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default MyListScreen;