import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import LoadingScreen from './components/LoadingScreen';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Login Failed', (error as any)?.message ?? 'Something went wrong with your login');
      setLoading(false);
      setEmail('');
      setPassword('');
    }
  };

  if (loading) return <LoadingScreen message='Logging in...'/>; 
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Your email" 
              placeholderTextColor='#999'
              autoCapitalize="none"
              keyboardType="email-address"
              value={email} 
              onChangeText={setEmail} 
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Your password" 
              placeholderTextColor='#999' 
              secureTextEntry 
              value={password} 
              onChangeText={setPassword} 
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword} onPress={() => alert('Reset password functionality goes here')}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={() => router.replace('/register')}>
          <Text style={styles.link}>New here? <Text style={styles.linkBold}>Create an account</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#111111',
  },
  container: {
    backgroundColor: '#111111',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    paddingTop: 80,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 40,
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 6,
    paddingLeft: 2,
  },
  input: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
    height: 50,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerLink: {
    marginTop: 30,
  },
  link: {
    color: '#ccc',
    fontSize: 16,
  },
  linkBold: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default Login;