import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { router, useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const login = () => {

    const navigation = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleRequest, , googlePromptAsync] = Google.useIdTokenAuthRequest({ clientId: 'YOUR_GOOGLE_CLIENT_ID' });
  const [fbRequest, , fbPromptAsync] = Facebook.useAuthRequest({ clientId: 'YOUR_FACEBOOK_APP_ID' });

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    const result = await googlePromptAsync();
    if (result?.type === 'success') {
      const credential = GoogleAuthProvider.credential(result.params.id_token);
      await signInWithCredential(auth, credential);
      router.push('/login');
    }
  };

  const handleFacebookLogin = async () => {
    const result = await fbPromptAsync();
    if (result?.type === 'success') {
      const credential = FacebookAuthProvider.credential(result.params.access_token);
      await signInWithCredential(auth, credential);
      router.push('/login');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log In</Text>

        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <Text>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
          <Text>Continue with Facebook</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.flexLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.flexLine} />
        </View>

        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('/register')}>
          <Text style={styles.link}>New here? Create account here</Text>
        </TouchableOpacity>
        <Text style={styles.link}>Forgot password?</Text>
      </ScrollView>
    </View>
    
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#111111',
        alignItems: 'center',
        flex: 1,
        padding: 24
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    socialButton: {
        backgroundColor: '#f1f1f1',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
      },
      flexLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
      },
      orText: {
        marginHorizontal: 12,
        color: '#444',
        fontWeight: '600',
        fontSize: 14,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
      },
      button: {
        backgroundColor: 'black',
        padding: 14,
        borderRadius: 8,
        marginTop: 8,
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
      },
      link: {
        color: '#444',
        marginTop: 16,
        textAlign: 'center',
      },
});

export default login