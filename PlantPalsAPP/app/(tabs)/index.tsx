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
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/gifs/WateringCat.gif')}
        />
      }> 
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>

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