import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { auth } from '../firebase/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import LoadingScreen from './components/LoadingScreen';
import { FontAwesome } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: '316330482055-j0ifukfcqsh71092kjomiccate763ih9.apps.googleusercontent.com', 
    redirectUri: 'https://auth.expo.io/@username0/mobile',
  });

  useEffect(() => {
    const authenticateGoogle = async () => {
      if (googleResponse?.type === 'success') {
        const { id_token } = googleResponse.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        router.push('/home');
      }
    };
    authenticateGoogle();
  }, [googleResponse]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (error) {
      alert((error as any)?.message ?? 'Something went wrong 😵');
    }
    setTimeout(() => {
      router.replace('/home');
      setLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    await googlePromptAsync();
  };

  if (loading) return <LoadingScreen message='Logging in...'/>; 
  
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <FontAwesome name="google" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.flexLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.flexLine} />
        </View>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor='#ccc' value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor='#ccc' secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.forgotPassword}>

          <Text style={styles.forgotPasswordText}>Forgot password?</Text>

        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.link}>New here? Create an account</Text>
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    width: '50%',
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
      marginTop: 40,
      width: '50%',
  },
  buttonText: {
      color: 'black',
      textAlign: 'center',
      fontSize: 20,
  },
  link: {
      color: '#fff',
      marginTop: 30,
      textAlign: 'center',
      fontSize: 16,
      textDecorationLine: 'underline',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: 65,
  },
  forgotPasswordText: {
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default Login;