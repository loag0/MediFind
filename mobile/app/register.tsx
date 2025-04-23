import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import LoadingScreen from './components/LoadingScreen';

WebBrowser.maybeCompleteAuthSession();

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [_, response, googlePromptAsync] = Google.useIdTokenAuthRequest({
    clientId: '316330482055-j0ifukfcqsh71092kjomiccate763ih9.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@username0/mobile',
  });

  const handleRegister = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', res.user.uid), {
        email,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date()
      });

      router.replace('/home');
    } catch (err) {
      console.error('Registration Error:', err);
      Alert.alert('Error', 'Failed to register.');
    }
  };

  const handleGoogleSignUp = async () => {
    const result = await googlePromptAsync();
    console.log("Google sign-in result:", result);

    if (result?.type === 'success') {
      const credential = GoogleAuthProvider.credential(result.params.id_token);
      const userCred = await signInWithCredential(auth, credential);

      await setDoc(doc(db, 'users', userCred.user.uid), {
        email: userCred.user.email,
        role: 'user',
        createdAt: new Date()
      });

      router.replace('/home');
    }
  };

  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCred = await signInWithCredential(auth, credential);
  
        await setDoc(doc(db, 'users', userCred.user.uid), {
          email: userCred.user.email,
          role: 'user',
          createdAt: new Date()
        });
  
        router.replace('/home');
      }
    };
  
    signInWithGoogle();
  }, [response]);
  
  if(loading) return <LoadingScreen message='Signing you up...' />;

  return (
    <View style={styles.container}>

        <Text style={styles.title}>Sign Up</Text>

        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp}>
          <FontAwesome name="google" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.socialText}>Sign up with Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.flexLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.flexLine} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#ccc"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#ccc"
          value={lastName}
          onChangeText={setLastName}
        />

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
        fontSize: 16,
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
