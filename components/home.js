import React, { useState, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet,Text,Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase/supabase';
import { AuthContext } from '../Authcontext/authcontext';

const Home = ({ navigation }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const { userEmail } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const handle_signout = async () => {
    await supabase.auth.signOut();
    AsyncStorage.removeItem('sb-jwbgvkgvkjspfnyurjfd-auth-torken');
    AsyncStorage.removeItem('email');
    setName('');
    setRole('');
    navigation.navigate('Sign in');
  };


  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
  const username = userEmail || await AsyncStorage.getItem('email');
  setIsLoading(true);
  if (username) {
    try {
      const { data, error } = await supabase
        .from('student')
        .select('*')
        .eq('email', username);

      if (error) throw error;

      if (data.length === 1) {
        setName(data[0].username);
        setRole(data[0].role);
        console.log(data[0].role);
        if (data[0].role === 'Staff') {
          navigation.navigate('Staff');
        } else {
          console.log(data[0].role);
          navigation.navigate('User');
        }
      } else if (data.length === 0) {
        console.error('No user found with the email:', username);
        // Handle the case where no user is found
      } else {
        console.error('Multiple users found with the email:', username);
        // Handle the case where multiple users are found
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert(error.message);
    }
  } else {
    navigation.navigate('Sign in');
  }
  setIsLoading(false);
};

      fetchUserData();
    }, [userEmail, navigation])
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  else{
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Home Page!</Text>
        <Pressable title="Sign out" onPress={handle_signout} />
        <Pressable onPress={handle_signout}>
        <Text>Sign out</Text>
    </Pressable>

      </View>
    );
  }
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
