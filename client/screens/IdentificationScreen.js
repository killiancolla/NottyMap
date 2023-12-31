import { React, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IdentificationScreen = ({ navigation }) => {

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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inscriptionButton}
        onPress={() => navigation.navigate('Inscription')}
      >
        <Text style={styles.inscriptionText}>Inscription</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.connexionButton}
        onPress={() => navigation.navigate('Connexion')}
      >
        <Text style={styles.connexionText}>Connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inscriptionButton: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#2196f3',
  },
  inscriptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connexionButton: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#b3e5fc', // Un bleu plus clair pour la connexion
  },
  connexionText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IdentificationScreen;
