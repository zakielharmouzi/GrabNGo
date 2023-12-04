import React, { useState,useRef } from 'react';
import { ScrollView, View, TextInput, Text, Pressable, StyleSheet, Image } from 'react-native';
import { supabase } from '../supabase/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Toast from 'react-native-toast-message';

const logo = require('../assets/logo2.png');

const SignupForm = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const toastRef = useRef(null);


    const handleUsernameChange = (text) => {
        setUsername(text);
    };

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
};


    const handleSubmit = async(e) => {
        e.preventDefault();
    if (password !== confirmPassword) {
        Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Error',
            text2: 'Passwords do not match',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
            onShow: () => {},
            onHide: () => {},
            onPress: () => {}
        });
        return;
    }   
    // if(username.length < 6){
    //     Toast.show({
    //         type: 'error',
    //         position: 'top',
    //         text1: 'Error',
    //         text2: 'Username must be at least 6 characters',
    //         visibilityTime: 4000,
    //         autoHide: true,
    //         topOffset: 30,
    //         bottomOffset: 40,
    //         onShow: () => {},
    //         onHide: () => {},
    //         onPress: () => {}
    //     });
    //     return;
    // }
      const res = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (res.error) {
        // Show error message and return early if sign-up failed
        Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Error',
            text2: res.error.message,
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
        });
        return;
    }

    // If sign-up was successful, add user to 'student' table
    const { data, error } = await supabase.from('student').insert([
        { username: username, email: email },
    ]);

    if (error) {
        // Handle error in inserting to 'student' table
        alert(error.message);
        return;
    }

    // If everything was successful, navigate to 'Sign in' and show a confirmation
    alert('Check your email for confirmation!');
    navigation.navigate('Sign in');
};

    const handleLoginPress = () => {
        navigation.navigate('Sign in'); 
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
            <Image
                    source={logo} // Replace with your actual image path
                    style={{ width: 68.25, height: 64.65, marginBottom: 8, marginTop: -35,}}/>
            <MaskedView
                style={styles.maskedView}
                maskElement={<Text style={styles.text}>Create a GrabNGo Account</Text>}
            >
                <LinearGradient
                colors={['#533785', '#2BA1C4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.5 }}
                style={{ flex: 1 }}
                />
            </MaskedView>

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
            <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            />

            <Pressable onPress={handleSubmit}>
                <Text style={styles.signupText}>Sign up</Text>
            </Pressable>
            <Pressable onPress={handleLoginPress}>
                <Text style={styles.gobackText}>Cancel</Text>
            </Pressable>
            <Toast ref={toastRef} />
        </View>
        </ScrollView>
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
    button: {
        width: '100%',
        height: 40,
        padding: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    signupText: {
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
    gobackText: {
        width: '70%',
        backgroundColor: '#e60000',
        borderWidth: 2,
        borderColor: '#bfbfbf',
        paddingHorizontal: 30,
        paddingVertical: 10,
        color: 'white',
        borderRadius: 30,
        fontWeight: 'bold',
        marginTop: 120
    },
    maskedView: {
        flex: -20,
        flexDirection: 'row',
        height: '18%',
      },
      text: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
      },
      scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});

export default SignupForm;
