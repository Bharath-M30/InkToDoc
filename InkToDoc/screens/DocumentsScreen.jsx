import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Alert,
  Platform,
} from 'react-native';
import Header from '../components/Header';
import { Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';

export default function DocumentsScreen() {
  const [docs, setDocs] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) loadDocs();
  }, [isFocused]);

  const loadDocs = async () => {
    const json = await AsyncStorage.getItem('documents');
    setDocs(json ? JSON.parse(json) : []);
  };

  const handleOpen = async (item) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }
      await Sharing.shareAsync(item.uri);
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Could not open the file');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.uri.endsWith('.jpg') || item.uri.endsWith('.png') ? (
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      ) : (
        <Feather name="file" size={40} color="#083B6A" />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.fileText}>{item.name}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <Pressable
        onPress={() => handleOpen(item)}
        style={({ pressed }) => [
          styles.openButton,
          { backgroundColor: pressed ? '#083B6A' : '#0A4C87' },
        ]}
      >
        <FontAwesome name="folder-open" size={18} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={docs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#64A4DB' },
  list: { padding: 12, paddingBottom: 80 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  thumbnail: { width: 60, height: 60, borderRadius: 8 },
  textContainer: { flex: 1, marginLeft: 10 },
  fileText: { fontWeight: 'bold', fontSize: 14 },
  dateText: { fontSize: 13, marginTop: 4 },
  openButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#0A4C87',
    elevation: 2,
  },
});
