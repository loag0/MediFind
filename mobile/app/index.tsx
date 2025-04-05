import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      {/* Black stethoscope image */}
      <Image
        source={require('../assets/images/landing-page_background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Login options */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>
        
        <TouchableOpacity>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: '100%',
    height: '70%',
    position: 'absolute',
    top: 0,
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    paddingVertical: 14,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#666',
  },
  orText: {
    color: '#FFF',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  guestText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;