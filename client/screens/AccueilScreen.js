import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import MapView, { Marker } from 'react-native-maps';

const AccueilScreen = ({ navigation }) => {
  const [lieuxNotifications, setLieuxNotifications] = useState([]);
  const [location, setLocation] = useState(null)
  const [thisPlace, setThisPlace] = useState([])
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      const getLocationAsync = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status === 'granted') {
          const currentLocation = await Location.getCurrentPositionAsync({})
          setLocation(currentLocation.coords)
        } else {
          console.log('Permissions de localisation refusées');
        }
      }
      if (!location) {
        getLocationAsync();
      }

      return () => setLocation(null);  // Cette ligne est exécutée lorsque l'écran perd le focus
    }, [])
  );

  useEffect(() => {
    if (!isFocused) return;
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
    checkUserId();
  }, [isFocused]);

  useEffect(() => {
    if (lieuxNotifications.length > 0) {
      if (isFocused && location) {
        const lieuxFiltres = lieuxNotifications.filter(lieu => {
          const isWithinRadius = getDistanceFromLatLonInMeters(location.latitude, location.longitude, lieu.latitude, lieu.longitude) < lieu.rayon;
          if (isWithinRadius) {
            sendNotification('📍 Vous êtes arrivé à ' + lieu.nom + '. Cliquez pour consulter votre rappel');
          }
          return isWithinRadius;
        });
        setThisPlace(lieuxFiltres);
      } else {
        setThisPlace([])
      }
    } else {
      setThisPlace([])
    }
  }, [isFocused, location, lieuxNotifications]);


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
        {(!location && lieuxNotifications.length > 0) ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="red" />
            <Text style={styles.loadingText}>Loading....</Text>
          </View>
        ) : (
          thisPlace.length > 0 ? (
            thisPlace.map((place, index) => (
              <View key={index} style={styles.placeContainer}>
                <Text style={styles.placeName}>📍{place.nom}📍</Text>
                <Text style={styles.placeMessage}>{place.message}</Text>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: place.latitude,
                    longitude: place.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                    title={place.nom}
                    description={place.message}
                  />
                </MapView>
              </View>
            ))
          ) : (
            <Text style={styles.noLieuxText}>Aucun lieu trouvé.</Text>
          )
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleNotif}>
        <Text style={styles.logoutButtonText}>Liste Notif</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleDeconnexion}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
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
  placeCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeText: {
    fontSize: 16,
  },
  placeContainer: {
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  placeMessage: {
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  map: {
    height: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  noLieuxText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AccueilScreen;
