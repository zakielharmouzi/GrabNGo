import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase/supabase';
import { AuthContext } from '../Authcontext/authcontext';

const Home = ({ navigation }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const { userEmail } = useContext(AuthContext);

  const handle_signout = async () => {
    await supabase.auth.signOut();
    AsyncStorage.removeItem('sb-jwbgvkgvkjspfnyurjfd-auth-token');
    AsyncStorage.removeItem('email');
    setName('');
    setRole('');
    navigation.navigate('Sign in');
  };


  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const username = userEmail || await AsyncStorage.getItem('email');
        if (username) {
          try {
            const { data, error } = await supabase
              .from('student')
              .select('*')
              .eq('email', username)
              .single();

            if (error) throw error;

            setName(data.username);
            setRole(data.role);
            console.log(data.role);
            if (data.role === 'Staff') {
            navigation.navigate('Staff');
        } else{
          console.log(role);
            navigation.navigate('User');
        }
      
          } catch (error) {
            console.error('Error fetching user data:', error);
            alert(error.message);
          }
        } else {
          navigation.navigate('Sign in');
        }
      };

      fetchUserData();
    }, [userEmail, navigation])
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={handle_signout}>
        <Text>Sign out</Text>
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
