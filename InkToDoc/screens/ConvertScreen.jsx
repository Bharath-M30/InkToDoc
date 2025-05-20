import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
  Button,
  Linking,
  Image,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ConvertScreen({ route }) {
  const navigation = useNavigation();
  const { imageUri } = route.params || {};
  const [isConverting, setIsConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  useEffect(() => {
    if (!imageUri) {
      Alert.alert('No image', 'Please capture an image first.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [imageUri]);

  const handleConvert = async () => {
    try {
      setIsConverting(true);
      const formData = new FormData();
      formData.append('file', { uri: imageUri, name: 'image.jpg', type: 'image/jpeg' });
      const res = await fetch('http://192.168.1.8:8000/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const { text } = await res.json();
      if (!text) throw new Error('No OCR text');
      setExtractedText(text);
      setConversionComplete(true);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'OCR failed. Try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileSave = async (format) => {
    try {
      const formData = new FormData();
      formData.append('text', extractedText);
      formData.append('format', format);
      const res = await fetch('http://192.168.1.8:8000/save', {
        method: 'POST',
        body: formData,
      });
  
      const blob = await res.blob();
  
      const base64 = await blobToBase64(blob);
      const timestamp = Date.now();
      const fileName = `doc_${timestamp}.${format}`;
      const fileUri = FileSystem.documentDirectory + fileName;
  
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const docs = JSON.parse(await AsyncStorage.getItem('documents') || '[]');
      docs.unshift({
        id: `${timestamp}`,
        name: fileName,
        date: new Date().toLocaleString(),
        uri: fileUri,
      });
      await AsyncStorage.setItem('documents', JSON.stringify(docs));
  
      Alert.alert('Saved', `File saved as ${fileName}`, [
        {
          text: 'OK',
          onPress: () => {
            setSaveModalVisible(false);
            navigation.navigate('HomeTabs', { screen: 'Documents' });
          },
        },
      ]);
  
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Save failed', 'Could not save file.');
    }
  };
  
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        resolve(base64data);
      };
      reader.readAsDataURL(blob);
    });
  };

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.preview}
          resizeMode="contain"
        />
      )}
      <View style={styles.iconRow}>
        <Feather name="edit-3" size={70} color="#fff" />
        {isConverting
          ? <ActivityIndicator style={styles.arrow} size="large" color="#fff" />
          : conversionComplete
            ? <AntDesign name="checkcircle" size={40} color="lime" style={styles.arrow} />
            : <AntDesign name="arrowright" size={40} color="#fff" style={styles.arrow} />}
        <Feather name="file" size={70} color="#fff" />
      </View>

      <Text style={styles.title}>
        {conversionComplete ? 'Conversion completed' : 'Convert to Document ?'}
      </Text>

      <View style={styles.buttonContainer}>
        {!conversionComplete && !isConverting && (
          <Pressable
            style={({ pressed }) => [
              styles.convertButton,
              { backgroundColor: pressed ? '#083b6a' : '#0A4C87' },
            ]}
            onPress={handleConvert}
          >
            <Text style={styles.convertText}>Convert</Text>
          </Pressable>
        )}

        {conversionComplete && (
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: pressed ? '#0a3b66' : '#0A4C87' },
            ]}
            onPress={() => setSaveModalVisible(true)}
          >
            <Text style={styles.convertText}>Save</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            { backgroundColor: pressed ? '#d3d3d3' : '#fff' },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      <Modal
        transparent
        visible={isSaveModalVisible}
        animationType="fade"
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Save As</Text>
            <View style={styles.modalButtons} >
              <Button title="Save as PDF" onPress={() => handleFileSave('pdf')} />
            </View>
            <View style={styles.modalButtons}>
              <Button title="Save as DOCX" onPress={() => handleFileSave('docx')} />
            </View>
            <View>
              <Button title="Cancel" onPress={() => setSaveModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64A4DB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
  },
  convertButton: {
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 4,
  },
  saveButton: {
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 4,
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#ddd',
  },
  convertText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0A4C87',
  },
  cancelText: {
    color: '#0A4C87',
    fontSize: 16,
    fontWeight: '600',
  },
  arrow: {
    marginLeft: 50,
    marginRight: 50,
    paddingTop: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
  },
  
  modalContainer: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
    maxWidth: 350,
    elevation: 5, // adds shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4, // for iOS shadow
  },

  modalButtons: {
    marginBottom: 6,
  }
  ,
  modalTitle: {
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 12,
    color: '#0A4C87',
    textAlign: 'center',
  },
  
});
