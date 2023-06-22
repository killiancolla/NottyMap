import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants  from 'expo-constants';
const AddNotificationScreen = () => {
  const [nom, setNom] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [rayon, setRayon] = useState('');
  const [message, setMessage] = useState('');
  const [id, setId] = useState(null);


  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Identification' }],
        });
      } else {
        setId(userId);
      }
    };
    checkUserId();
  }, []);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLongitude(location.coords.longitude.toString());
        setLatitude(location.coords.latitude.toString());
      }
    };

    fetchUserLocation();
  }, []);

  const handleFormSubmit = async () => {
    try {
      const notificationData = {
        nom: nom,
        longitude: longitude,
        latitude: latitude,
        rayon: rayon,
        message: message,
      };

      console.log(notificationData)

      const response = await axios.patch(`http://${Constants.manifest.IP_ADDRESS}:3001/api/users/addNotifs/${id}`, notificationData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une notification</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
      />
      <TextInput
        style={styles.input}
        placeholder="Rayon"
        value={rayon}
        onChangeText={setRayon}
      />
      <TextInput
        style={styles.input}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleFormSubmit}>
        <Text style={styles.addButtonText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddNotificationScreen;
