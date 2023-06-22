import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
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
      }else{
        const response = await axios.get(`http://${myip}:3001/api/users/${userId}`)
        setLieuxNotifications(response.data.lieuxNotifications)
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

  return (
    <View style={{ padding: 20 }}>
      <Text onPress={handleDeconnexion}>Deconnexion</Text>
      <Text style={{ fontSize: 18 }}>Lieux de notifications:</Text>
      {lieuxNotifications.map((lieu) => (
        <View key={lieu._id}>
          <Text>Nom: {lieu.nom}</Text>
          <Text>Latitude: {lieu.latitude}</Text>
          <Text>Longitude: {lieu.longitude}</Text>
          <Text>Rayon: {lieu.rayon}</Text>
          <Text>Message: {lieu.message}</Text>
        </View>
      ))}
    </View>
  );
};

export default AccueilScreen;
