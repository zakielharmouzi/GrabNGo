import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase/supabase';

const Logout = ({ navigation }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    AsyncStorage.removeItem('sb-jwbgvkgvkjspfnyurjfd-auth-token');
    AsyncStorage.removeItem('email');
    navigation.navigate('Sign in');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    margin: 10,
  },
  button: {
    borderWidth: 2,
    borderColor: 'darkgray',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});
