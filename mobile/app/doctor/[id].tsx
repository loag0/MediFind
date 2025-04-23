import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import LoadingScreen from '../components/LoadingScreen';

export default function DoctorDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const docRef = doc(db, 'doctors', id!);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setDoctor(snap.data());
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
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.divider} />
      </View>

      <Text style={styles.bio}>{doctor.bio}</Text>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => router.push(`/booking?id=${id}`)}
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
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,
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
    paddingLeft: 10,
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
    paddingLeft: 10,
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
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});
