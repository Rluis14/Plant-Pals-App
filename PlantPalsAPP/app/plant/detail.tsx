import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plant, savedPlantsService } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import PlantImage from '../../components/PlantImage';

export default function PlantDetailScreen() {
  const { plant } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [plantDetails, setPlantDetails] = useState<Plant | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (plant) {
      try {
        const plantStr = Array.isArray(plant) ? plant[0] : plant;
        const plantObj = JSON.parse(decodeURIComponent(plantStr));
        setPlantDetails(plantObj);
        
        checkSavedStatus(plantObj.id);
      } catch (error) {
        console.error('Error parsing plant data:', error);
        Alert.alert('Error', 'Failed to load plant details');
        router.back();
      }
    }
  }, [plant]);

  const checkSavedStatus = async (plantId: number) => {
    if (!user) {
      setCheckingStatus(false);
      return;
    }

    try {
      const saved = await savedPlantsService.isPlantSaved(plantId);
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSavePlant = async () => {
    if (!plantDetails) return;

    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to save plants to your collection.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/_auth/login') }
        ]
      );
      return;
    }

    try {
      if (isSaved) {
        await savedPlantsService.removePlant(plantDetails.id);
        setIsSaved(false);
        Alert.alert('Removed', `${plantDetails.name} has been removed from your saved plants.`);
      } else {
        await savedPlantsService.savePlant(plantDetails.id);
        setIsSaved(true);
        Alert.alert('Saved', `${plantDetails.name} has been added to your saved plants!`);
      }
    } catch (error: any) {
      console.error('Error saving/removing plant:', error);
      if (error.message === 'Plant is already saved') {
        Alert.alert('Already Saved', `${plantDetails.name} is already in your saved plants.`);
        setIsSaved(true);
      } else if (error.message === 'User not authenticated') {
        Alert.alert(
          'Login Required',
          'Please login to save plants to your collection.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => router.push('/_auth/login') }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to save plant. Please try again.');
      }
    }
  };

  if (!plantDetails) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading plant details...</Text>
      </View>
    );
  }

  const handleGoBack = () => {
    router.back();
  };

  const getLightIcon = (lightRequirement: string) => {
    switch (lightRequirement?.toLowerCase()) {
      case 'low': return 'moon';
      case 'medium': return 'partly-sunny';
      case 'high': return 'sunny';
      case 'bright': return 'sunny';
      default: return 'bulb';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={handleSavePlant} 
            style={styles.headerActionButton}
            disabled={checkingStatus}
          >
            <Ionicons 
              name={isSaved ? "heart" : "heart-outline"} 
              size={24} 
              color="#000"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Plant Image */}
        <View style={styles.imageContainer}>
          <PlantImage
            imagePath={plantDetails.image_path}
            style={styles.plantImage}
            defaultSize={300}
          />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{plantDetails.name}</Text>
          {plantDetails.scientific_name && (
            <Text style={styles.scientificName}>{plantDetails.scientific_name}</Text>
          )}
          
          <View style={styles.tagsContainer}>
            {plantDetails.categories?.name && (
              <View style={styles.categoryTag}>
                <Ionicons name="leaf" size={14} color="#000" />
                <Text style={styles.categoryText}>{plantDetails.categories.name}</Text>
              </View>
            )}
            {plantDetails.care_level && (
              <View style={styles.careLevelTag}>
                <Text style={styles.careLevelText}>{plantDetails.care_level} Care</Text>
              </View>
            )}
          </View>
        </View>

        {plantDetails.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{plantDetails.description}</Text>
          </View>
        )}

        <View style={styles.careInfoContainer}>
          {plantDetails.water_frequency_days && (
            <View style={styles.careInfoCard}>
              <View style={styles.careInfoHeader}>
                <Ionicons name="water" size={24} color="#000" />
                <Text style={styles.careInfoTitle}>Watering</Text>
              </View>
              <Text style={styles.careInfoValue}>Every {plantDetails.water_frequency_days} days</Text>
              {plantDetails.water_instructions && (
                <Text style={styles.careInfoDescription}>{plantDetails.water_instructions}</Text>
              )}
            </View>
          )}

          {plantDetails.light_requirements && (
            <View style={styles.careInfoCard}>
              <View style={styles.careInfoHeader}>
                <Ionicons name={getLightIcon(plantDetails.light_requirements)} size={24} color="#000" />
                <Text style={styles.careInfoTitle}>Light</Text>
              </View>
              <Text style={styles.careInfoValue}>{plantDetails.light_requirements} light</Text>
            </View>
          )}
        </View>

        {plantDetails.water_instructions && plantDetails.water_frequency_days && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care Instructions</Text>
            <View style={styles.instructionItem}>
              <Ionicons name="water" size={20} color="#000" />
              <Text style={styles.instructionText}>{plantDetails.water_instructions}</Text>
            </View>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={handleSavePlant} 
            style={[styles.primaryButton, isSaved && styles.savedPrimaryButton]}
            disabled={checkingStatus}
          >
            <Ionicons 
              name={isSaved ? "heart" : "heart-outline"} 
              size={20} 
              color="#fff"
            />
            <Text style={styles.primaryButtonText}>
              {isSaved ? 'Remove from My Plants' : 'Add to My Plants'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerActionButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  plantImage: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
    color: '#000',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  careLevelTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  careLevelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
  },
  careInfoContainer: {
    marginBottom: 24,
  },
  careInfoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  careInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  careInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  careInfoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  careInfoDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
  },
  actionButtons: {
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    backgroundColor: '#2c6e49',
  },
  savedPrimaryButton: {
    backgroundColor: '#e63946',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});