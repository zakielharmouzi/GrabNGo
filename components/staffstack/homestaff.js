import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Logout from '../logout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../supabase/supabase';

const Homestaff = ({ navigation }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('sb-jwbgvkgvkjspfnyurjfd-auth-token');
      if (!token) {
        navigation.navigate('Sign in');
      }
    };  
    const getusername = async () => {
      const username = await AsyncStorage.getItem('email');
      console.log(username);
      supabase.from('student').select('*').eq('email', username,role).then((res) => {
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
  }, []);
  return (
    <View style={styles.container}>
      <Logout navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to the Home Page For Staffs!</Text>
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

export default Homestaff;
