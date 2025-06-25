import React, { useState } from 'react';
import { Image, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { getPlantImageUrl } from '../lib/supabase';

interface PlantImageProps {
  imagePath?: string;
  style?: any;
  defaultSize?: number;
  showDebugInfo?: boolean;
}

export const PlantImage: React.FC<PlantImageProps> = ({ 
  imagePath, 
  style, 
  defaultSize = 100,
  showDebugInfo = false
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageUrl = getPlantImageUrl(imagePath);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Fallback images for different scenarios
  const getFallbackImage = () => {
    if (error) {
      // If image failed to load, show a default plant image
      return 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    return imageUrl;
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: getFallbackImage() }}
        style={[
          styles.image,
          style,
          { width: style?.width || defaultSize, height: style?.height || defaultSize }
        ]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        resizeMode="cover"
      />
      {loading && (
        <View style={[styles.loadingOverlay, style]}>
          <ActivityIndicator size="small" color="#2F684E" />
        </View>
      )}
      {showDebugInfo && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Path: {imagePath || 'none'}</Text>
          <Text style={styles.debugText}>Error: {error ? 'Yes' : 'No'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 8,
  },
  debugInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 4,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
  },
});

export default PlantImage;