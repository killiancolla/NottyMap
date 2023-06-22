import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const ConnexionScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Accueil' }],
        });
      }
    };
    checkUserId();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let formData = {
        username: email,
        password: password
      }
      const response = await axios.post(`http://${Constants.manifest.IP_ADDRESS}:3001/api/users/login`, formData)
      setEmail('')
      setPassword('')
      await AsyncStorage.setItem('userId', response.data.id);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Accueil' }],
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Text style={styles.title}>Connexion</Text>

          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor='grey'
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Mot de passe"
            placeholderTextColor='grey'
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.connexionButton}
            onPress={handleSubmit}
          >
            <Text style={styles.connexionText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  connexionButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#2196f3',
  },
  connexionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConnexionScreen;
