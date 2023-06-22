import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const myip = '10.74.0.121'
const AccueilScreen = ({ navigation }) => {
  const [lieuxNotifications, setLieuxNotifications] = useState([]);
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
        const response = await axios.get(`http://${myip}:3001/api/users/${userId}`);
        setLieuxNotifications(response.data.lieuxNotifications);
      }
    };
    checkUserId();
  }, []);

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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Lieux de notifications:</Text>
        {lieuxNotifications.map((lieu) => (
          <View key={lieu._id} style={styles.card}>
            <Text style={styles.cardText}>Nom: {lieu.nom}</Text>
            <Text style={styles.cardText}>Latitude: {lieu.latitude}</Text>
            <Text style={styles.cardText}>Longitude: {lieu.longitude}</Text>
            <Text style={styles.cardText}>Rayon: {lieu.rayon}</Text>
            <Text style={styles.cardText}>Message: {lieu.message}</Text>
          </View>
        ))}
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
