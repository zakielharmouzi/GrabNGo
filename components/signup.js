import React, { useState } from 'react';
import { View, TextInput,Text, Button, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../supabase/supabase';

const SignupForm = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (text) => {
        setUsername(text);
    };

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        supabase.auth.signUp({
            email: email,
            password: password,
        }).then((res) => {
            if (res.error) {
                alert(res.error.message);
                return;
            }
            alert('Check your email for confirmation!');
            navigation.navigate('Sign in');
        });
        supabase.from('student').insert([
            { username: username, email: email },
        ]).then((res) => {
            if (res.error) {
                alert(res.error.message);
                return;
            }
        });
    };

    const handleLoginPress = () => {
        navigation.navigate('Sign in'); 
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={handleUsernameChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange}
            />
            <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.text}>Sing up</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleLoginPress}>
                <Text style={styles.text}>Login</Text>
            </Pressable>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        padding: 10,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    button: {
        width: '100%',
        height: 40,
        padding: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default SignupForm;
