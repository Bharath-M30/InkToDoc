import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import HowToScreen from './screens/HowToScreen';
import DocumentsScreen from './screens/DocumentsScreen';
import ConvertScreen from './screens/ConvertScreen';
import AboutScreen from './screens/AboutScreen';
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isSplashDone, setIsSplashDone] = useState(false);

  // Splash screen delay
  useEffect(() => {
    setTimeout(() => {
      setIsSplashDone(true);
    }, 3000); // 3 seconds splash screen
  }, []);

  if (!isSplashDone) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeTabs" options={{ headerShown: false }}>
          {() => (
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: '#0A4C87',
                  height: 70,
                  paddingBottom: 15,
                  paddingTop: 10,
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#92BEE9',
              }}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  tabBarIcon: ({ color }) => (
                    <Icon name="home" size={24} color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="Documents"
                component={DocumentsScreen}
                options={{
                  tabBarIcon: ({ color }) => (
                    <Icon name="folder" size={24} color={color} />
                  ),
                }}
              />
              
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Convert" component={ConvertScreen} options={{ title: 'Convert' }} />
        <Stack.Screen name="HowTo" component={HowToScreen} options={{ title: 'How To Use' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}