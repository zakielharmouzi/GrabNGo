import React, { useState, useEffect,useRef } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Image ,ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase/supabase';
import Toast from 'react-native-toast-message';

const logo = require('../assets/logo.png');

const SignIn = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [name, setName] = useState('');
    const toastRef = useRef(null);


    const handleUsernameChange = (text) => {
        setUsername(text);
    };
    const handlePasswordChange = (text) => {
        setPassword(text);
    };

   const handleSignIn = async (e) => {
    e.preventDefault();
    Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Logged in successfully',
        visibilityTime: 4000,
    });
    console.log(username);
        await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        }).then((res) => {
            if (res.error) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: res.error.message,
                visibilityTime: 4000,
            });
            return;
        }
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Success',
                text2: 'Logged in successfully',
                visibilityTime: 4000,
            });
            AsyncStorage.setItem('email', username);
            navigation.navigate('Home');
        });
    
};



    const handleSubmit = async () => {
    navigation.navigate('Sign up');
    };

    return (
            <View style={styles.container}>
                <Image
                    source={logo} // Replace with your actual image path
                    style={{ width: 221, height: 180, marginBottom: 30,}}/>
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={username}
                    onChangeText={handleUsernameChange}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={handlePasswordChange}
                />
                <TouchableOpacity onPress={handleSignIn}>
                    <Text style={styles.loginText} >Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit}>
                    <Text style={styles.signupText} >Don't have an account? Sign up here!</Text>
                </TouchableOpacity>
                {/* <Toast ref={toastRef} /> */}
            </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, // Added padding for better layout
        marginTop: -120, // Added marginTop to avoid top of screen
        
    },
    input: {
        width: '90%',
        borderRadius: 4,
        height: 40, // Increased height for better touch area
        borderWidth: 1,
        borderColor: '#d9d9d9',
        paddingLeft: 7,
        marginBottom: 20, // Increased margin for better spacing
        paddingHorizontal: 0, // Increased padding for text
        backgroundColor: '#e6e6e6',
    },
    signupText:{
        color: '#0092b3',
        textDecorationLine: 'underline',
        height: 90,
        paddingTop: 50, // change this bach thbt text lt7t
    },
    loginText: {
        width: '70%',
        backgroundColor: '#1877F2',
        borderWidth: 2,
        borderColor: '#3d90ff',
        paddingHorizontal: 80,
        paddingVertical: 10,
        color: 'white',
        borderRadius: 4,
        fontWeight: 'bold'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
      },
    
    
});

export default SignIn;
