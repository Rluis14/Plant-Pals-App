// app/search/index.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const router = useRouter(); // ✅ useRouter goes here

  // 🔽 Placeholder for future API fetch
  /*
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`https://your-api-url.com/search?query=${searchTerm}`); // REPLACE WITH ENDPOINT
        const data = await response.json();
        setResults(data.results); // assumes the API returns a list in `results`
      } catch (error) {
        console.error('Search API error:', error);
      }
    };

    if (searchTerm.length > 2) {
      fetchSearchResults();
    }
  }, [searchTerm]);
  */

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Search for a plant and explore its care tips!</Text>

      <TextInput
        style={styles.input}
        placeholder="Search plants..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: '/search/results', params: { searchTerm } })}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Optional: Show inline results below */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem}>
            <Text style={styles.resultText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.placeholder}>No results to display</Text>}
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
  instructions: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
  },
  placeholder: {
    marginTop: 20,
    color: '#888',
    textAlign: 'center',
  },
});
// This is a simple search screen that allows users to input a search term and view results.
// The search term is passed to a results screen when the user presses the "Search" button.