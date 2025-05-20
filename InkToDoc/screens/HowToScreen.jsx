// screens/HowToScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HowToScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>How To Use InkToDoc</Text>

      <Text style={styles.step}>Step 1: Click on either Gallery or Scan buttons from the home page.</Text>
      <Text style={styles.step}>Step 2: If you select Scan, the camera will open. Scan the entire document you want to digitize. Please make sure the images are clear and taken in a well-lit environment for better results.</Text>
      <Text style={styles.step}>Step 3: If you chose the Gallery button, your gallery will open. Choose the images you want to digitize.</Text>
      <Text style={styles.step}>Step 4: After selection, InkToDoc will process the document and show you the digitized result.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A4C87',
    marginBottom: 20,
  },
  step: {
    fontSize: 18,
	fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
});
