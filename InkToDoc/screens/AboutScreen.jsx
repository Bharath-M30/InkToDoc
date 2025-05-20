import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>InkToDoc</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Members</Text>
        <Text style={styles.text}>• Bharath M</Text>
        <Text style={styles.text}>• Kathirgaman M</Text>
        <Text style={styles.text}>• Kaarthikey G</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Supervisor</Text>
        <Text style={styles.text}>Arshiya Mobeen M - Assistant Professor, CSE </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Institution</Text>
        <Text style={styles.text}>Jeppiaar Engineering College, Chennai</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Abstract</Text>
        <Text style={styles.text}>
          Our project, *InkToDoc*, is an AI-powered mobile application designed to digitize and convert handwritten or historical records into accessible, editable digital documents. By leveraging OCR and language models, the app not only converts the text but also enhances readability, supports regional languages, and allows users to export the output into formats such as PDF. This tool aims to preserve history, improve accessibility for researchers, and simplify documentation for government and academic purposes.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2FB',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0A4C87',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0A4C87',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    lineHeight: 22,
    color: '#333',
  },
});
