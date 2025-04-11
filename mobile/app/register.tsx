import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground,
  ImageComponent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-facebook';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // for Facebook
import { AntDesign } from '@expo/vector-icons';    // for Google


WebBrowser.maybeCompleteAuthSession();

const Register = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [googleRequest, , googlePromptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
  });

  useEffect(() => {
    (async () => {
      await Facebook.initializeAsync({ appId: 'YOUR_FACEBOOK_APP_ID' });
    })();
  }, []);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('./home');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    const result = await googlePromptAsync();
    if (result?.type === 'success') {
      const credential = GoogleAuthProvider.credential(result.params.id_token);
      await signInWithCredential(auth, credential);
      router.push('./home');
    }
  };

  const handleFacebookRegister = async () => {
    try {
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      if (result.type === 'success') {
        const credential = FacebookAuthProvider.credential(result.token);
        await signInWithCredential(auth, credential);
        router.push('./home');
      } else {
        console.log('Facebook login cancelled');
      }
    } catch (err) {
      console.error('Facebook Login Error:', err);
      alert('Facebook login failed. Try again.');
    }
  };

  return (
    <View style={styles.container}>

        <Text style={styles.title}>Sign Up</Text>

        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleRegister}>
          <Text style={styles.socialText}>Sign up with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookRegister}>
          <Text style={styles.socialText}>Sign up with Facebook</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.flexLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.flexLine} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#111111',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        paddingTop: 80,
        fontSize: 48,
        marginBottom: 40,
        textAlign: 'center',
        color: 'white',
    },
    socialButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        width: '70%',
        height: 50
    },
    socialText: {
        color: 'white',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        width: '60%',
    },
    flexLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
    },
    orText: {
        marginHorizontal: 12,
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        margin: 12,
        color: 'white',
        width: '70%',
        height: 50
    },
    button: {
        backgroundColor: 'white',
        padding: 14,
        borderRadius: 8,
        marginTop: 50,
        width: '50%',
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
    },
    link: {
        color: '#fff',
        marginTop: 50,
        textAlign: 'center',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default Register;
