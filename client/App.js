import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import IdentificationScreen from './screens/IdentificationScreen';
import ConnexionScreen from './screens/ConnexionScreen.js';
import InscriptionScreen from './screens/InscriptionScreen';
import AccueilScreen from './screens/AccueilScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AddNotificationScreen from './screens/AddNotificationScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const Stack = createNativeStackNavigator();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Identification"
          component={IdentificationScreen}
          options={{
            title: 'Identification',
            headerStyle: {
              backgroundColor: 'red',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Connexion"
          component={ConnexionScreen}
          options={{
            title: 'Connexion',
            headerStyle: {
              backgroundColor: 'red',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Inscription"
          component={InscriptionScreen}
          options={{
            title: 'Inscription',
            headerStyle: {
              backgroundColor: 'red',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Liste des notifications"
          component={NotificationsScreen}
          options={{
            title: 'Liste des notifications',
            headerStyle: {
              backgroundColor: 'red',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Ajouter une notification"
          component={AddNotificationScreen}
          options={{
            title: 'Ajouter une notification',
            headerStyle: {
              backgroundColor: 'red',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Accueil"
          component={AccueilScreen}
          options={{
            title: 'Accueil',
            headerStyle: {
              backgroundColor: 'red',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
