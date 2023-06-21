import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import IdentificationScreen from './screens/IdentificationScreen';
import ConnexionScreen from './screens/ConnexionScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import AcceuilScreen from './screens/AcceuilScreen';
import InscriptionScreen from './screens/NotificationsScreen';
import AddNotificationScreen from './screens/AddNotificationScreen';
import SetNotificationsScreen from './screens/SetNotificationsScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Identification" component={IdentificationScreen} />
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
        <Stack.Screen name="Accueil" component={AcceuilScreen} />
        <Stack.Screen name="Notification détails" component={NotificationsScreen} />
        <Stack.Screen name="Ajout de Notification" component={AddNotificationScreen} />
        <Stack.Screen name="Modification de Notifications" component={SetNotificationsScreen} />
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


