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
    fetch_order_status = async () => {
    const { data, error } = await supabase
      .from('order')
      .select('*')
      .eq('user_id', userEmail)
      .eq('status', 'ready')
      .eq('flaged', 'false')
      
    if (error) {
      alert(error.message);
      return;
    }
    if (data.length > 0) {
      const { data:order_data,error } = await supabase
        .from('order_item')
        .select('*')
        .eq('order_id', data[0].order_id);
      if (error) {
        console.error(error.message);
        return;
      }
      alert('order number ' + data[0].order_id +' that contains the following item:'+ order_data[0].item_category + ' is ready for collection');
      await supabase
        .from('order')
        .update({ flaged: 'true' })
        .eq('order_id', data[0].order_id);
    }
    };

    getusername();
    checkToken();


    const interval = setInterval(() => {
    fetch_order_status();
  }, 10000);

  // Clear interval on component unmount
  return () => clearInterval(interval);
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

    const handlecart = () => {
        navigation.navigate('Cart');
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
    <Pressable style={styles.cartbutton} onPress={handlecart}>
        <Text>Cart</Text>
    </Pressable>
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
  cartbutton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});

export default Homestaff;
