// app/search/results.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const router = useRouter();

const handleNavigate = (plant) => {
  router.push({
    pathname: '/plant/detail',
    params: {
      plant: encodeURIComponent(JSON.stringify(plant)), // ✅ Safe for URL
    },
  });
};

export default function SearchResultsScreen() {
  const [results, setResults] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const searchTerm = route.params?.searchTerm ?? '';

  // 🔽 Placeholder for fetching search results by term
  /*
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://your-api-url.com/search?query=${searchTerm}`);
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      }
    };

    fetchResults();
  }, [searchTerm]);
  */

  const handleViewDetails = (plant: any) => {
    navigation.navigate('search/detail', { plant });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Results for "{searchTerm}"</Text>

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <TouchableOpacity onPress={() => handleViewDetails(item)}>
              <Text style={styles.plantName}>{item.name}</Text>
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
