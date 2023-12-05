import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import SignIn from './components/signin';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupForm from './components/signup';
import Home from './components/home';
import Toast from 'react-native-toast-message';
import Homeuser from './components/userstack/homeuser';
import Homestaff from './components/staffstack/homestaff';
import { AuthProvider } from './Authcontext/authcontext';
import Proxy from './components/staffstack/proxy';
import Cossa from './components/staffstack/cossa';
import Cafeteria from './components/staffstack/cafeteria';
import Cafeteria_user from './components/userstack/cafeteria_user';
import Cossa_user from './components/userstack/cossa_user';
import Proxy_user from './components/userstack/proxy_user';
import Cart_user from './components/userstack/cart_user';


const Stack = createStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const toastRef = useRef(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('sb-jwbgvkgvkjspfnyurjfd-auth-token');
      setIsSignedIn(!!token);
      setIsLoading(false); // Set loading to false after the check
    };

    checkToken();
  }, []);

  if (isLoading) {
    // Show a loading indicator while checking the token
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
     <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isSignedIn ? "Home" : "Sign in"}>
        <Stack.Screen name="Sign up" component={SignupForm} />
        <Stack.Screen name="Sign in" component={SignIn} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="User" component={Homeuser} />
        <Stack.Screen name="Staff" component={Homestaff} />
        <Stack.Screen name="Proxy" component={Proxy} />
        <Stack.Screen name="Cossa" component={Cossa} />
        <Stack.Screen name="Cafeteria" component={Cafeteria} />
        <Stack.Screen name="Cafeteria_user" component={Cafeteria_user} />
        <Stack.Screen name="Cossa_user" component={Cossa_user} />
        <Stack.Screen name="Proxy_user" component={Proxy_user} />
        <Stack.Screen name="Cart" component={Cart_user} />
      </Stack.Navigator>
      {/* <Toast ref={toastRef} /> */}
    </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
