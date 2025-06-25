import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F684E" />
      </View>
    );
  }

  // If user is authenticated, go to home, otherwise go to welcome
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/_auth/welcome" />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F2EA',
  },
});