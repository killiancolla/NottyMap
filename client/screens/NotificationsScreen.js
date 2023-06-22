import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

const NotificationsScreen = () => {
  const [lieuxNotifications, setLieuxNotifications] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/notifications') // Remplacez par votre URL d'API
      .then((response) => {
        setLieuxNotifications(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
      <Text style={{ fontSize: 18 }}>{item.nom}</Text>
      <Text>Latitude: {item.latitude}, Longitude: {item.longitude}</Text>
      <Text>Rayon: {item.rayon} mètres</Text>
      <Text>Message: {item.message}</Text>
    </View>
  );

  return (
    <FlatList
      data={lieuxNotifications}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

export default NotificationsScreen;
