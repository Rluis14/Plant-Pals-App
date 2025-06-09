import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SearchResultsScreen() {
  const [results, setResults] = useState([]);
  const { searchTerm } = useLocalSearchParams();
  const router = useRouter();

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call with mock data
    const mockResults = [
      { id: 1, name: 'Monstera Deliciosa', description: 'Popular houseplant with split leaves' },
      { id: 2, name: 'Snake Plant', description: 'Low maintenance succulent' },
      { id: 3, name: 'Pothos', description: 'Trailing vine plant' },
    ].filter(plant => 
      plant.name.toLowerCase().includes((searchTerm as string)?.toLowerCase() || '')
    );
    
    setResults(mockResults);
  }, [searchTerm]);

  const handleViewDetails = (plant: any) => {
    router.push({
      pathname: '/plant/detail',
      params: {
        plant: encodeURIComponent(JSON.stringify(plant)),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Results for "{searchTerm}"</Text>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <TouchableOpacity onPress={() => handleViewDetails(item)}>
              <Text style={styles.plantName}>{item.name}</Text>
              <Text style={styles.plantDescription}>{item.description}</Text>
            </TouchableOpacity>

            <View style={styles.icons}>
              <TouchableOpacity>
                <Ionicons name="add-circle-outline" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleViewDetails(item)}>
                <Ionicons name="information-circle-outline" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.placeholder}>No results found</Text>}
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
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '600',
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantName: {
    fontSize: 16,
    fontWeight: '500',
  },
  plantDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  icons: {
    flexDirection: 'row',
    gap: 10,
  },
  placeholder: {
    marginTop: 20,
    color: '#888',
    textAlign: 'center',
  },
});