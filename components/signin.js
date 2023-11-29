import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase/supabase';
import Toast from 'react-native-toast-message';


const SignIn = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const [name, setName] = useState('');

   const handleSignIn = async (e) => {
    e.preventDefault();
    console.log('username', username);
    console.log('sign in');
    
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
            console.log(res);
            AsyncStorage.setItem('email', username);
            navigation.navigate('Home');
        });

    
};


    const handleSubmit = async () => {
    navigation.navigate('Sign up');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button style={styles.input} title="Sign In" onPress={handleSignIn} />
            <Button style={styles.input} title="Sign up" onPress={handleSubmit} />
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, // Added padding for better layout
        marginTop: 50, // Added marginTop to avoid top of screen
    },
    input: {
        width: '100%',
        height: 40, // Increased height for better touch area
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 20, // Increased margin for better spacing
        paddingHorizontal: 0, // Increased padding for text
    },
});

export default SignIn;
