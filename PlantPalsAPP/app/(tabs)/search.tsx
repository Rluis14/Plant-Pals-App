import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type PlantResult = {
  id: number;
  name: string;
  description: string;
};

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PlantResult[]>([]);
  const router = useRouter();

  // Mock data for demonstration
  const mockPlants: PlantResult[] = [
    { id: 1, name: 'Monstera Deliciosa', description: 'Popular houseplant with split leaves' },
    { id: 2, name: 'Snake Plant', description: 'Low maintenance succulent' },
    { id: 3, name: 'Pothos', description: 'Trailing vine plant' },
    { id: 4, name: 'Fiddle Leaf Fig', description: 'Large leafed indoor tree' },
    { id: 5, name: 'Peace Lily', description: 'Flowering houseplant' },
  ];

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredResults = mockPlants.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push({ 
        pathname: '/search/results', 
        params: { searchTerm: searchTerm.trim() } 
      });
    }
  };

  const handlePlantSelect = (plant: PlantResult) => {
    router.push({
      pathname: '/plant/detail',
      params: { plant: encodeURIComponent(JSON.stringify(plant)) },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Search Plants</Text>
      </View>

      <Text style={styles.instructions}>Search for a plant and explore its care tips!</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search plants..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem}
            onPress={() => handlePlantSelect(item)}
          >
            <Text style={styles.resultText}>{item.name}</Text>
            <Text style={styles.resultDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searchTerm.length > 0 ? (
            <Text style={styles.placeholder}>No results found for "{searchTerm}"</Text>
          ) : (
            <Text style={styles.placeholder}>Start typing to search for plants</Text>
          )
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
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#2F684E',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#2F684E',
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultItem: {
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F684E',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  placeholder: {
    marginTop: 40,
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
  },
});