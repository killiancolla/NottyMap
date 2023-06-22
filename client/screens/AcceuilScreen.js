import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import geolib from 'geolib';
import PushNotification from "react-native-push-notification";
import axios from 'axios';

const AccueilScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [lieuxNotifications, setLieuxNotifications] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/notifications')
      .then((response) => {
        setLieuxNotifications(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (userLocation) {
      lieuxNotifications.forEach((lieu) => {
        const distance = geolib.getDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: lieu.latitude, longitude: lieu.longitude }
        );

        if (distance < lieu.rayon) {
          PushNotification.localNotification({
            message: lieu.message,
          });
        }
      });
    }
  }, [userLocation, lieuxNotifications]);

  return (
    <View style={{ padding: 20 }}>
      {userLocation ? (
        <>
          <Text style={{ fontSize: 18 }}>Votre localisation:</Text>
          <Text>Latitude: {userLocation.latitude}</Text>
          <Text>Longitude: {userLocation.longitude}</Text>
        </>
      ) : (
        <Text>Récupération de votre localisation...</Text>
      )}
    </View>
  );
};

export default AccueilScreen;
