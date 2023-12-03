import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet,Pressable } from 'react-native';
import Logout from './logout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase/supabase';


const Home = ({ navigation }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const handle_signout = async () => {
    await supabase.auth.signOut();
    AsyncStorage.removeItem('sb-jwbgvkgvkjspfnyurjfd-auth-token');
    AsyncStorage.removeItem('email');
    setName('');
    setRole('');
    navigation.navigate('Sign in');
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('sb-jwbgvkgvkjspfnyurjfd-auth-token');
      console.log(token);
      if (!token) {
        navigation.navigate('Sign in');
      }
    };  
    const getusername = async () => {
      const username = await AsyncStorage.getItem('email');
      console.log("got username",username);
      supabase.from('student').select('*').eq('email', username).then((res) => {
        if (res.error) {
          alert(res.error.message);
          return;
        }
        setName(res.data[0].username);
        setRole(res.data[0].role);
      });
    }
    getusername();
    checkToken();
    // redirect();

  }, []);


  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handle_signout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to the Home Page!</Text>
        <Text style={styles.subtitle}>This is a simple home page in React Native.</Text>
        <Text style={styles.subtitle}>Hello, {name}!</Text>
        <Text style={styles.subtitle}>Your role is {role}!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
  },
});

export default Home;
