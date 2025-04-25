import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import bgImg from '../assets/images/landing-page_background.jpg';
import { useRouter } from 'expo-router';
import LoadingScreen from './components/LoadingScreen';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (loading) return <LoadingScreen />;

  const handleNav = (route: '/' | '/guestHome' | '/register' | '/login') => {
    setLoading(true);
    setTimeout(() => {
      router.push(route);
    }, 500);
  };

  return (
    <ImageBackground source={bgImg} style={styles.container} resizeMode='cover'>
      <Image
        source={require('../assets/images/logo_whiteText.png')}
        style={styles.logo}
        resizeMode='contain'
      />

      <Text style={styles.welcometext}>Find the help you need</Text>

      <View style={styles.bottomBox}>
        <TouchableOpacity style={styles.button} onPress={() => handleNav('/register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNav('/login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.text}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={() => handleNav('/guestHome')}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: '75%',
    height: 100,
    flexShrink: 1,
    marginTop: 300,
  },
  welcometext: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#1c1c1c',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    margin: 10,
  },
  button: {
    width: '80%',
    padding: 15,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%',
  },
  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#fff',
    margin: 10,
  },
  orText: {
    marginHorizontal: 10,
    color: '#777',
    fontWeight: '500',
  },
  guestText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});
