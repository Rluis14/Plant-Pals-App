import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TrendingScreen() {
  const [quote, setQuote] = useState("To plant a garden is to believe in tomorrow.");

  const handleLike = () => {
    console.log('Liked!');
  };

  const handleBookmark = () => {
    console.log('Bookmarked!');
  };

  const handleShare = () => {
    console.log('Shared!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Trending</Text>
      </View>

      <Text style={styles.quote}>{quote}</Text>

      <View style={styles.iconRow}>
        <TouchableOpacity onPress={handleLike} style={styles.iconButton}>
          <Ionicons name="heart-outline" size={28} color="#000" />
          <Text style={styles.iconLabel}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBookmark} style={styles.iconButton}>
          <Ionicons name="bookmark-outline" size={28} color="#000" />
          <Text style={styles.iconLabel}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
          <Ionicons name="share-outline" size={28} color="#000" />
          <Text style={styles.iconLabel}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerContainer: {
    alignSelf: 'stretch',
    marginBottom: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    color: '#000',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
  },
});