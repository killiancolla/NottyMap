import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
// import Geolocation from 'react-native-geolocation-service';
// import geolib from 'geolib';
// import PushNotification from "react-native-push-notification";
import axios from 'axios';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

const AccueilScreen = ({ navigation }) => {
  const [lieuxNotifications, setLieuxNotifications] = useState([]);
  const [location, setLocation] = useState(null)
  const [thisPlace, setThisPlace] = useState([])

  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Identification' }],
        });
      } else {
        const response = await axios.get(`http://${Constants.manifest.IP_ADDRESS}:3001/api/users/${userId}`)
        setLieuxNotifications(response.data.lieuxNotifications)
      }
    };
    const getLocationAsync = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({})
        setLocation(currentLocation.coords)
      } else {
        console.log('Permissions de localisation refusées');
      }
    }
    getLocationAsync()
    checkUserId();
  }, []);

  useEffect(() => {
    if (location && lieuxNotifications.length > 0) {
      const lieuxFiltres = lieuxNotifications.filter(lieu => {
        const isWithinRadius = getDistanceFromLatLonInMeters(location.latitude, location.longitude, lieu.latitude, lieu.longitude) < lieu.rayon;
        if (isWithinRadius) {
          sendNotification(lieu.message);
        }
        return isWithinRadius;
      });
      setThisPlace(lieuxFiltres);
    }
  }, [location, lieuxNotifications]);


  const handleDeconnexion = async (event) => {
    try {
      await AsyncStorage.removeItem('userId');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Identification' }],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotif = async (event) => {
    navigation.navigate('Liste des notifications')
  }

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  async function sendNotification(message) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "NottyMap",
        body: message,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {thisPlace.length > 0 ? (
          thisPlace.map((place) =>
            <Text>{place.message}</Text>
          )
        ) : (
          <Text>Loading....</Text>
        )}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleDeconnexion}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleNotif}>
        <Text style={styles.logoutButtonText}>Liste Notif</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
  },
  logoutButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default AccueilScreen;
