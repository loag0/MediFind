import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import LoadingScreen from '../components/LoadingScreen';
import { Alert } from 'react-native';

export default function DoctorDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  const checkAvailability = (startTime: string, endTime: string) => {

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
  };

  const handleBooking = () => {
    if (doctor.workingHours?.start && doctor.workingHours?.end && !isAvailable) {
      Alert.alert(
        "Doctor Unavailable",
        `Dr. ${doctor.fullName} is currently unavailable. Working hours are ${doctor.workingHours.start} - ${doctor.workingHours.end}.`,
        [
          { text: "OK", style: "cancel" },
        ]
      );
    } else {
      router.push({ pathname: '/booking/[id]', params: { id } });
    }
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const docRef = doc(db, 'doctors', id!);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const docData = snap.data();
          setDoctor(docData);
          
          if (docData.workingHours?.start && docData.workingHours?.end) {
            setIsAvailable(checkAvailability(docData.workingHours.start, docData.workingHours.end));
          }
        }
      } catch (err) {
        console.error('Failed to fetch doctor details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if(loading) return <LoadingScreen message='Fetching doctor...'/>;
  if (!doctor) return <Text style={{ color: 'black', alignItems: 'center', textAlign: 'center' }}>Doctor not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.profileSection}>
        <Image source={{ uri: doctor.profileImageUrl }} style={styles.profileImage} />
        <Text style={styles.name}>Dr. {doctor.fullName}</Text>
        <Text style={styles.profession}>{doctor.profession}</Text>
        
        {doctor.workingHours?.start && doctor.workingHours?.end && (
          <View style={[styles.availabilityLabel, 
            { backgroundColor: isAvailable ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)' }]}>
            <View style={[styles.statusDot, 
              { backgroundColor: isAvailable ? '#00FF00' : '#FF0000' }]} />
            <Text style={styles.availabilityText}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        )}
        
        <Text style={styles.location}></Text>
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Contact Info</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Phone: {doctor.phone || 'N/A'}</Text>
        <Text style={styles.infoText}>Fax: {doctor.fax || 'N/A'}</Text>
        <Text style={styles.infoText}>Email: {doctor.email || 'N/A'}</Text>
        {doctor.workingHours?.start && doctor.workingHours?.end && (
          <Text style={styles.infoText}>Working Hours: {doctor.workingHours.start} - {doctor.workingHours.end}</Text>
        )}
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.divider} />
      </View>

      <Text style={styles.bio}>{doctor.bio}</Text>

      <TouchableOpacity
        style={[
          styles.bookButton,
          !isAvailable && doctor.workingHours?.start ? styles.bookButtonUnavailable : null
        ]}
        onPress={handleBooking}
      >
        <FontAwesome name="calendar" size={20} color="white" />
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flex: 1,
    padding: 20,
  },
  backButton: {
    paddingTop: 50,
    paddingLeft: 5,
    marginBottom: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profession: {
    color: '#ccc',
    fontSize: 24,
  },
  location: {
    color: '#888',
    fontSize: 20,
  },
  availabilityLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,
    paddingLeft: 5
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  infoSection: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  infoText: {
    color: '#ccc',
    fontSize: 16,
    marginVertical: 4,
  },
  bio: {
    color: '#eee',
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 22,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005bcc',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 30,
  },
  bookButtonUnavailable: {
    backgroundColor: '#444',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});