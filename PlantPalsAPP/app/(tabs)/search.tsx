import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase, Plant, savedPlantsService } from '../../lib/supabase';

function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedPlantIds, setSavedPlantIds] = useState<Set<number>>(new Set());
  const router = useRouter();

  const searchPlants = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from('plants')
        .select(`
          *,
          categories (
            name
          )
        `)
        .or(`name.ilike.%${query}%,scientific_name.ilike.%${query}%`)
        .order('name');

      if (error) {
        console.error('Search error:', error);
        Alert.alert('Error', 'Failed to search plants. Please try again.');
        setResults([]);
      } else {
        setResults(data || []);
        await checkSavedStatus(data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search plants. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = async (plants: Plant[]) => {
    try {
      const savedStatuses = await Promise.all(
        plants.map(plant => savedPlantsService.isPlantSaved(plant.id))
      );
      
      const savedIds = new Set<number>();
      plants.forEach((plant, index) => {
        if (savedStatuses[index]) {
          savedIds.add(plant.id);
        }
      });
      
      setSavedPlantIds(savedIds);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPlants(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePlantSelect = (plant: Plant) => {
    router.push({
      pathname: '/plant/detail',
      params: { plant: encodeURIComponent(JSON.stringify(plant)) },
    });
  };

  const handleSavePlant = async (plant: Plant) => {
    try {
      if (savedPlantIds.has(plant.id)) {
        await savedPlantsService.removePlant(plant.id);
        setSavedPlantIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(plant.id);
          return newSet;
        });
        Alert.alert('Removed', `${plant.name} has been removed from your saved plants.`);
      } else {
        await savedPlantsService.savePlant(plant.id);
        setSavedPlantIds(prev => new Set(prev).add(plant.id));
        Alert.alert('Saved', `${plant.name} has been added to your saved plants!`);
      }
    } catch (error) {
      console.error('Error saving/removing plant:', error);
      if (error instanceof Error && error.message === 'Plant is already saved') {
        Alert.alert('Already Saved', `${plant.name} is already in your saved plants.`);
      } else {
        Alert.alert('Error', 'Failed to save plant. Please try again.');
      }
    }
  };

  const renderPlantItem = ({ item }: { item: Plant }) => {
    const isSaved = savedPlantIds.has(item.id);
    
    return (
      <View style={styles.resultItem}>
        <TouchableOpacity 
          style={styles.plantInfo}
          onPress={() => handlePlantSelect(item)}
        >
          <Text style={styles.resultText}>{item.name}</Text>
          {item.scientific_name && (
            <Text style={styles.scientificName}>{item.scientific_name}</Text>
          )}
          {item.description && (
            <Text style={styles.resultDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.plantMeta}>
            {item.categories?.name && (
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{item.categories.name}</Text>
              </View>
            )}
            {item.care_level && (
              <View style={styles.careLevelTag}>
                <Text style={styles.careLevelText}>{item.care_level}</Text>
              </View>
            )}
            {item.water_frequency_days && (
              <View style={styles.waterTag}>
                <Ionicons name="water" size={12} color="#66D9EF" />
                <Text style={styles.waterText}>{item.water_frequency_days}d</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={() => handleSavePlant(item)}
            style={[styles.saveButton, isSaved && styles.savedButton]}
          >
            <Ionicons 
              name={isSaved ? "heart" : "heart-outline"} 
              size={20} 
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePlantSelect(item)} style={styles.viewButton}>
            <Ionicons name="chevron-forward" size={20} color="#2F684E" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Search Plants</Text>
      </View>

      <Text style={styles.instructions}>Search for a plant and explore its care tips!</Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} style={styles.searchIcon} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Search by name or scientific name..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchTerm('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Searching plants...</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlantItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && hasSearched ? (
            <Text style={styles.placeholder}>
              {searchTerm.length > 0 ? `No plants found for "${searchTerm}"` : 'Start typing to search for plants'}
            </Text>
          ) : !hasSearched ? (
            <Text style={styles.placeholder}>Start typing to search for plants</Text>
          ) : null
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
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#A67B5B',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2F684E',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  plantInfo: {
    flex: 1,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2F684E',
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 6,
    color: '#2F684E',
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: '#A67B5B',
  },
  plantMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#2F684E',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  careLevelTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#2F684E',
  },
  careLevelText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  waterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
    backgroundColor: '#2F684E',
  },
  waterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  saveButton: {
    borderWidth: 2,
    borderColor: '#2F684E',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2F684E',
  },
  savedButton: {
    borderColor: '#000',
  },
  viewButton: {
    padding: 8,
  },
  placeholder: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#2F684E',
  },
});

export default SearchScreen;