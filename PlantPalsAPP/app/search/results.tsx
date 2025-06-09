// app/search/results.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import PlantCard from '../../components/PlantCard';
import { supabase } from '@/lib/supbase'


export default function SearchResultsScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  
  // Get search parameters
  const searchTerm = params.searchTerm || '';
  const categoryId = params.categoryId ? Number(params.categoryId) : null;

  const fetchResults = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('plants')
        .select(`
          id, 
          name,
          scientific_name,
          description,
          water_frequency_days,
          water_instructions,
          light_requirements,
          care_level,
          image_path,
          categories(name)
        `)
        .limit(20);

      if (categoryId) {
        // Search by category
        query = query.eq('category_id', categoryId);
      } else if (searchTerm) {
        // Search by text
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Add image URLs
      const plantsWithImages = data.map(plant => ({
        ...plant,
        image_url: supabase.storage
          .from('plant_images')
          .getPublicUrl(plant.image_path).data.publicUrl
      }));

      setResults(plantsWithImages);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchTerm, categoryId]);

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
              onPress={() => navigation.navigate('plant/detail', { plant: item })}
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