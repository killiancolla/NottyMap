import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const InscriptionScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

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

  const handleInscription = async (event) => {
    event.preventDefault();
    try {
      let formData = {
        nom: name,
        age: age,
        email: email,
        motDePasse: password
      }
      const response = await axios.post(`http://${Constants.manifest.IP_ADDRESS}:3001/api/users/register`, formData)
      setEmail('')
      setPassword('')
      setName('')
      setAge('')
      setConfirmPassword('')
      navigation.reset({
        index: 0,
        routes: [{ name: 'Connexion' }],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Text style={styles.title}>Inscription</Text>

          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Nom"
            placeholderTextColor='grey'
          />

          <TextInput
            style={styles.inputSmall}
            onChangeText={setAge}
            value={age}
            placeholder="Age"
            placeholderTextColor='grey'
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor='grey'
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

          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Confirmez le mot de passe"
            placeholderTextColor='grey'
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.inscriptionButton}
            onPress={handleInscription}
          >
            <Text style={styles.inscriptionText}>S'inscrire</Text>
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
  inputSmall: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: 100,
  },
  inscriptionButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#2196f3',
  },
  inscriptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InscriptionScreen;
