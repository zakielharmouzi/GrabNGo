import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Pressable,TouchableOpacity,Image } from 'react-native';
import Logout from '../logout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../supabase/supabase';
import { AuthContext } from '../../Authcontext/authcontext';


const Homestaff = ({ navigation }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const { userEmail,setUserEmail } = React.useContext(AuthContext);
  const logo = require('../../assets/logo.png');
  

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


    const handleRestaurantClick = (restaurantId) => {
        console.log(`Restaurant clicked: ${restaurantId}`);
        if (restaurantId === 1) {
            navigation.navigate('Proxy_user');
        } else if (restaurantId === 2) {
            navigation.navigate('Cossa_user');
        } else if (restaurantId === 3) {
            navigation.navigate('Cafeteria_user');
        }
    };

  return (
    <View style={styles.container}>
    <Pressable onPress={handle_signout}>
        <Text>Sign out</Text>
    </Pressable>
    <View style={styles.content}>
        <Text style={styles.title}>Welcome to the Home Page For Staffs!</Text>
        <Text style={styles.subtitle}>This is a simple home page in React Native.</Text>
        <Text style={styles.subtitle}>Hello, {name}!</Text>
        <Text style={styles.subtitle}>Your role is {role}!</Text>
        <View style={styles.restaurantsContainer}>
        {[1, 2, 3].map((id) => (
        <TouchableOpacity key={id} onPress={() => handleRestaurantClick(id)}>
            <Image source={logo} style={styles.restaurantImage} />
        </TouchableOpacity>
        ))}
    </View>
    
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
  restaurantsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  restaurantImage: {
    width: 100,
    height: 100,
    margin: 10,
  },
});

export default Homestaff;
