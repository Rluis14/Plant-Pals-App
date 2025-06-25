import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PlantCard from '../../../components/PlantCard';
import { plantService, Plant } from '../../../lib/supabase';

export default function SearchResultsScreen() {
  const [results, setResults] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Get search parameters
  const searchTerm = params.searchTerm || '';
  const categoryId = params.categoryId ? Number(params.categoryId) : null;

  const fetchResults = async () => {
    setLoading(true);
    
    try {
      let plants: Plant[] = [];

      if (categoryId) {
        // Search by category - you'll need to implement this in plantService
        plants = await plantService.getAllPlants();
        plants = plants.filter(plant => plant.category_id === categoryId);
      } else if (searchTerm) {
        // Search by text
        plants = await plantService.searchPlants(searchTerm.toString());
      }

      setResults(plants);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchTerm, categoryId]);

  const handlePlantPress = (plant: Plant) => {
    router.push({
      pathname: '/plant/detail',
      params: { plant: encodeURIComponent(JSON.stringify(plant)) }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {categoryId 
          ? `Category Results` 
          : `Results for "${searchTerm}"`}
      </Text>

      {loading ? (
        <Text style={styles.placeholder}>Loading plants...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PlantCard 
              plant={item} 
              onPress={() => handlePlantPress(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.placeholder}>No plants found</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  placeholder: {
    marginTop: 20,
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
  },
});