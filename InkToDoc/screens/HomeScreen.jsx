import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import ActionCard from '../components/ActionCard';

export default function HomeScreen({ navigation }) {
  const handleCameraLaunch = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera access is required to scan documents.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      navigation.navigate('Convert', { imageUri });
    }
  };

  const handleGalleryLaunch = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Media library access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      navigation.navigate('Convert', { imageUri });
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.cardsWrapper}>
        <ActionCard
          icon="camera"
          text="Scan a document"
          onPress={handleCameraLaunch}
        />
        <ActionCard
          icon="image"
          text="Choose from gallery"
          onPress={handleGalleryLaunch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#63A8E3',
  },
  cardsWrapper: {
    flex: 1,
    padding: 16,
  },
});
