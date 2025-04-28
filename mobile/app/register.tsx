import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import LoadingScreen from './components/LoadingScreen';

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const validatePhone = () => {
    // Check if phone is exactly 8 digits
    return phone.length === 8 && /^\d+$/.test(phone);
  };

  const handleRegister = async () => {
    if (!validatePhone()) {
      Alert.alert('Invalid Phone', 'Please enter a valid 8-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', res.user.uid), {
        email,
        firstName,
        lastName,
        phone,
        role: 'user',
        createdAt: new Date()
      });

      router.replace('/home');
    } catch (err) {
      console.error('Registration Error:', err);
      Alert.alert('Error', 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };
  
  if(loading) return <LoadingScreen message='Signing you up...' />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Join Us</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number (8 digits)</Text>
            <TextInput
              style={styles.input}
              placeholder="8-digit phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={8}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/login')}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Log In</Text></Text>
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
      maxWidth: 500,



    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
        width: '100%', // For side-by-side inputs
        flexGrow: 1,
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
    loginLink: {
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

export default Register;