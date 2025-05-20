import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Modal, Animated, Pressable, TouchableOpacity,BackHandler, Alert } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-20)).current;
  const navigation = useNavigation();


  const openMenu = () => {
    setMenuVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setMenuVisible(false); // Instantly close modal
  };

  const handleQuit = () => {
    BackHandler.exitApp();
  };
  
  const handleResetApp = async () => {
    try {
      await AsyncStorage.clear();
      closeMenu();
      Alert.alert('App Reset', 'All data has been cleared.');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };
  
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image
          source={require('../assets/logo.png')} // your logo
          style={styles.logo}
        />
        <Text style={styles.title}>InkToDoc</Text>
      </View>

      <Pressable onPress={openMenu} style={styles.menuButton}>
        <Entypo name="dots-three-vertical" size={20} color="#fff" />
      </Pressable>

      {menuVisible && (
        <Modal transparent visible animationType="none">
          <Pressable style={styles.backdrop} onPress={closeMenu}>
            <Animated.View
              style={[
                styles.popupMenu,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                },
              ]}
            >
              <TouchableOpacity onPress={() => {
                  closeMenu();
                  navigation.navigate('About'); // Navigate to HowToScreen
                }}
               style={styles.menuItem}>
                <Text style={styles.menuText}>About</Text>
                <Ionicons name="information-circle-outline" size={20} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => {
                  closeMenu();
                  navigation.navigate('HowTo'); // Navigate to HowToScreen
                }} style={styles.menuItem}
              >
                <Text style={styles.menuText}>How To</Text>
                <Ionicons name="help-circle-outline" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResetApp}
                style={styles.menuItem}
              >
                <Text style={styles.menuText}>Reset App</Text>
                <Ionicons name="refresh-outline" size={20} color="#fff" />
              </TouchableOpacity>


              <TouchableOpacity onPress={() => {
                  closeMenu();
                  handleQuit();
                }} style={styles.menuItem}
              >
                <Text style={styles.menuText}>Quit</Text>
                <Ionicons name="power-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0A4C87',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    padding: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent', // No dark shadow now
  },
  popupMenu: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#63A9E4',
    borderRadius: 12,
    paddingVertical: 8,
    width: 180,
    shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 15, // more height for deeper shadow
  },
  shadowOpacity: 1, // increase opacity
  shadowRadius: 5, // softer, bigger blur
  elevation: 20, // Android shadow depth (higher = deeper)
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff66',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
