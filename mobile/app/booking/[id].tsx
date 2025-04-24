// /app/booking/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
//import { format } from 'date-fns';

export default function Booking() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const auth = getAuth();

  const [doctor, setDoctor] = useState<any>(null);
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    firstName: '',
    lastName: '' 
  });
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorSnap = await getDoc(doc(db, 'doctors', id as string));
        if (!doctorSnap.exists()) throw new Error('Doctor not found');
        setDoctor(doctorSnap.data());

        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not logged in');
        
        const userSnap = await getDoc(doc(db, 'users', userId));
        if (!userSnap.exists()) throw new Error('User not found');
        
        const user = userSnap.data();
        setUserData({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone || '',
          firstName: user.firstName,
          lastName: user.lastName
        });
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load data');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  //const formattedDate = format ? format(date, 'PPP p') : date.toLocaleString();

  const handleSubmit = async () => {
    if (!doctor || !userData.name) {
      Alert.alert('Error', 'Missing doctor or user information');
      return;
    }

    const subject = 'Appointment Request';
    const body = `Hi Dr. ${doctor.fullName},\n\nI'd like to book an appointment on.\n\nName: ${userData.name}\nPhone: ${userData.phone}\nEmail: ${userData.email}\nPurpose: ${purpose}`;
    const mailto = `mailto:${doctor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      await addDoc(collection(db, 'appointments'), {
        doctorId: id,
        userId: auth.currentUser?.uid,
        doctorName: doctor.fullName,
        userName: userData.name,
        userEmail: userData.email,
        userPhone: userData.phone,
        purpose,
        datetime: date,
        createdAt: new Date(),
      });

      Linking.openURL(mailto).catch(err => {
        console.error(err);
        Alert.alert('Error', 'Failed to open email app');
      });
      
      Alert.alert('Success', 'Appointment request sent!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save appointment.');
    }
  };

  if (loading) return (
    <View style={styles.container}>
      <Text style={styles.loading}>Loading...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={28} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Book an appointment with:</Text>
      <Text style={styles.title}>Dr. {doctor.fullName}</Text>

      <TextInput style={styles.input} value={userData.name} editable={true} />
      <TextInput style={styles.input} value={userData.email} editable={true} />
      <TextInput style={styles.input} value={userData.phone} editable={true} />

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
        {/*<Text style={styles.inputText}>{formattedDate}</Text>*/}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="datetime"
          value={date}
          onChange={(event, selectedDate) => {
            setShowPicker(Platform.OS === 'ios');
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Purpose of visit"
        placeholderTextColor="#ccc"
        multiline
        value={purpose}
        onChangeText={setPurpose}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flex: 1,
    paddingHorizontal: 20,
    padding: 20,
  },
  loading: {
    color: 'white',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  backButton: {
    paddingTop: 50,
    paddingLeft: 5,
    marginBottom: 30,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginVertical: 8,
  },
  inputText: {
    color: '#fff',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#005bcc',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});