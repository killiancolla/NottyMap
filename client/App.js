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

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Identification" component={IdentificationScreen} />
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
        <Stack.Screen name="Liste des notifications" component={NotificationsScreen} />
        <Stack.Screen name="Ajouter une notification" component={AddNotificationScreen} />
        <Stack.Screen name="Accueil" component={AccueilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


//FONCTION INUTILE POUR LE MOMENT, SERVAIENT POUR LE TEST DE BONNE RECEPTION DE NOTIFICATION : FONCTIONNEL
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // if (Device.isDevice) {
  //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   if (existingStatus !== 'granted') {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== 'granted') {
  //     alert('Failed to get push token for push notification!');
  //     return;
  //   }
  //   token = (await Notifications.getExpoPushTokenAsync()).data;
  //   // console.log(token);
  // } else {
  //   alert('Must use physical device for Push Notifications');
  // }

  // return token;
}

