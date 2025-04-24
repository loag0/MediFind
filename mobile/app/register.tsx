import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import LoadingScreen from './components/LoadingScreen';

WebBrowser.maybeCompleteAuthSession();

const countryCodes = [
  { code: '+267', country: 'Botswana' },
  { code: '+27', country: 'South Africa' },
  { code: '+263', country: 'Zimbabwe' },
  { code: '+260', country: 'Zambia' },
];

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [modalVisible, setModalVisible] = useState(false);

  const [_, response, googlePromptAsync] = Google.useIdTokenAuthRequest({
    clientId: '316330482055-j0ifukfcqsh71092kjomiccate763ih9.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@username0/mobile',
  });

  const validatePhone = () => {
    // Basic validation - can be enhanced based on specific requirements
    return phone.length >= 7 && /^\d+$/.test(phone);
  };

  const handleRegister = async () => {
    if (!validatePhone()) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', res.user.uid), {
        email,
        firstName,
        lastName,
        phone: `${countryCode}${phone}`,
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

  const handleGoogleSignUp = async () => {
    if (!validatePhone()) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number before continuing with Google');
      return;
    }

    setLoading(true);
    try {
      const result = await googlePromptAsync();
      console.log("Google sign-in result:", result);

      if (result?.type === 'success') {
        const credential = GoogleAuthProvider.credential(result.params.id_token);
        const userCred = await signInWithCredential(auth, credential);

        await setDoc(doc(db, 'users', userCred.user.uid), {
          email: userCred.user.email,
          firstName: firstName || userCred.user.displayName?.split(' ')[0] || '',
          lastName: lastName || userCred.user.displayName?.split(' ').slice(1).join(' ') || '',
          phone: `${countryCode}${phone}`,
          role: 'user',
          createdAt: new Date()
        });

        router.replace('/home');
      }
    } catch (error) {
      console.error('Google Sign-up Error:', error);
      Alert.alert('Error', 'Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === 'success') {
        setLoading(true);
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          const userCred = await signInWithCredential(auth, credential);
    
          await setDoc(doc(db, 'users', userCred.user.uid), {
            email: userCred.user.email,
            firstName: firstName || userCred.user.displayName?.split(' ')[0] || '',
            lastName: lastName || userCred.user.displayName?.split(' ').slice(1).join(' ') || '',
            phone: `${countryCode}${phone}`,
            role: 'user',
            createdAt: new Date()
          });
    
          router.replace('/home');
        } catch (error) {
          console.error('Google Auth Error:', error);
          Alert.alert('Error', 'Failed to authenticate with Google.');
        } finally {
          setLoading(false);
        }
      }
    };
  
    signInWithGoogle();
  }, [response]);
  
  if(loading) return <LoadingScreen message='Signing you up...' />;

  const renderCountryItem = ({ item }: { item: { code: string; country: string } }) => (
    <TouchableOpacity 
      style={styles.countryItem}
      onPress={() => {
        setCountryCode(item.code);
        setModalVisible(false);
      }}
    >
      <Text style={styles.countryItemText}>{item.code} ({item.country})</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        
        <View style={styles.phoneContainer}>
          <TouchableOpacity 
            style={styles.countryCodeButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.countryCodeText}>{countryCode}</Text>
            <FontAwesome name="caret-down" size={16} color="white" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone Number"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

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

      {/* Country Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country Code</Text>
            
            <FlatList
              data={countryCodes}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
            />
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
        paddingBottom: 40,
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
    phoneContainer: {
        flexDirection: 'row',
        width: '70%',
        marginVertical: 12,
    },
    countryCodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        width: '30%',
        height: 50,
        marginRight: 8,
    },
    countryCodeText: {
        color: 'white',
        fontSize: 16,
    },
    phoneInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        color: 'white',
        height: 50,
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
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        maxHeight: '70%',
        backgroundColor: '#222',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    countryList: {
        width: '100%',
    },
    countryItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        width: '100%',
    },
    countryItemText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        marginTop: 15,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#444',
        width: '100%',
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default Register;