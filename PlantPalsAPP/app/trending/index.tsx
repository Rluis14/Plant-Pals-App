// app/trending/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TrendingScreen() {
  // Placeholder state for quote and image
  const [quote, setQuote] = useState("“To plant a garden is to believe in tomorrow.”");
  const [imageUrl, setImageUrl] = useState(null);

  // 🔽 API call placeholder
  /*
  useEffect(() => {
    const fetchTrendingPlant = async () => {
      try {
        const response = await fetch('https://your-api-url.com/trending-plant'); <REPLACE THIS TO ENDPOINT
        const data = await response.json();
        setQuote(data.quote);
        setImageUrl(data.imageUrl);
      } catch (error) {
        console.error('Failed to fetch trending plant:', error);
      }
    };

    fetchTrendingPlant();
  }, []);
  */

  return (
    <View style={styles.container}>
      {/* Image — Use static fallback or API image */}
      <Image 
        source={
          imageUrl 
            ? { uri: imageUrl } 
            : require('../../assets/images/not.png')
        } 
        style={styles.image} 
        resizeMode="contain"
      />

      {/* Quote */}
      <Text style={styles.quote}>{quote}</Text>

      {/* Icons */}
      <View style={styles.iconRow}>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={28} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={28} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="musical-notes-outline" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '90%',
    height: 300,
    marginBottom: 20,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
});
