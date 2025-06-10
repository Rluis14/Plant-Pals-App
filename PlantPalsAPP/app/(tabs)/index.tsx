import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TrendingScreen() {
  const [quote, setQuote] = useState("To plant a garden is to believe in tomorrow.");
  const [imageUrl, setImageUrl] = useState(null);

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

      <Image 
        source={require('../../assets/images/not.png')} 
        style={styles.image} 
        resizeMode="contain"
      />

      <Text style={styles.quote}>{quote}</Text>

      <View style={styles.iconRow}>
        <TouchableOpacity onPress={handleLike} style={styles.iconButton}>
          <Ionicons name="heart-outline" size={28} color="#2F684E" />
          <Text style={styles.iconLabel}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBookmark} style={styles.iconButton}>
          <Ionicons name="bookmark-outline" size={28} color="#2F684E" />
          <Text style={styles.iconLabel}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
          <Ionicons name="share-outline" size={28} color="#2F684E" />
          <Text style={styles.iconLabel}>Share</Text>
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
  headerContainer: {
    alignSelf: 'stretch',
    marginBottom: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2F684E',
  },
  image: {
    width: '90%',
    height: 300,
    marginBottom: 20,
    borderRadius: 12,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2F684E',
    paddingHorizontal: 20,
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
    color: '#2F684E',
  },
});