import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

const UserScreen = ({ userId, navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId);
  }, []);

  const fetchUser = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToAddNotificationScreen = () => {
    navigation.navigate('AddNotificationScreen');
  };

  if (!user) {
    return (
      <View>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>User: {user.email}</Text>
      <Text>Notifications:</Text>
      {user.lieuxNotifications.map((notification) => (
        <View key={notification._id}>
          <Text>Nom: {notification.nom}</Text>
          <Text>Message: {notification.message}</Text>
        </View>
      ))}
      <Button
        title="Add Notification"
        onPress={navigateToAddNotificationScreen}
      />
    </View>
  );
};

export default UserScreen;
