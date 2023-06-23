import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const NotificationsScreen = ({ navigation }) => {
  const [lieuxNotifications, setLieuxNotifications] = useState([]);
  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Identification' }],
        });
      } else {
        const response = await axios.get(`http://${Constants.manifest.IP_ADDRESS}:3001/api/users/${userId}`);
        setLieuxNotifications(response.data.lieuxNotifications);
      }
    };

    checkUserId();

    const unsubscribe = navigation.addListener('focus', checkUserId);

    return unsubscribe;
  }, [navigation]);

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

  const handleDeleteNotification = async (lieu) => {
    const userId = await AsyncStorage.getItem('userId');
    const response = await axios.delete(`http://${Constants.manifest.IP_ADDRESS}:3001/api/users/deleteNotif/${userId}/${lieu.nom}`);
    setLieuxNotifications(lieuxNotifications.filter(item => item.nom !== lieu.nom));
  };


  const handleAddNotification = () => {
    navigation.navigate('Ajouter une notification');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Lieux de notifications:</Text>
        <ScrollView>
          {lieuxNotifications.map((lieu, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>Nom: {lieu.nom}</Text>
              <Text style={styles.cardText}>Latitude: {lieu.latitude}</Text>
              <Text style={styles.cardText}>Longitude: {lieu.longitude}</Text>
              <Text style={styles.cardText}>Rayon: {lieu.rayon}m</Text>
              <Text style={styles.cardText}>Message: {lieu.message}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNotification(lieu)}>
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleDeconnexion}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleAddNotification}>
        <Text style={styles.addButtonText}>Ajouter une notification</Text>
      </TouchableOpacity>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  logoutButton: {
    padding: 10,
    backgroundColor: '#f00',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#00f',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  deleteButton: {
    marginTop: 10, // Espacement du dessus
    alignSelf: 'center', // Aligner au centre
    paddingVertical: 10, // Padding vertical
    paddingHorizontal: 20, // Padding horizontal
    backgroundColor: '#ff0000', // Couleur du fond
    borderRadius: 5, // Rayon de la bordure
  },

  deleteButtonText: {
    color: '#ffffff', // Couleur du texte
    fontSize: 16, // Taille de la police
    fontWeight: 'bold', // Poids de la police
  },
});


export default NotificationsScreen;
