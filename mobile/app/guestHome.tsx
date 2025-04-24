import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const guestHome = () => {
    const router = useRouter();
    interface Doctor {
        id: string;
        isSuspended: boolean;
        profession: string;
        fullName: string;
        profileImageUrl?: string;
        location?: string;
        phone?: string;
    }

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpec, setSelectedSpec] = useState('All');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const snap = await getDocs(collection(db, 'doctors'));
                const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
                const filtered = docs.filter(doc => !doc.isSuspended);
                setDoctors(filtered);

                const specList = Array.from(new Set(filtered.map(doc => doc.profession))).sort();
                setSpecialties(['All', ...specList]);
            } catch (err) {
                console.error('Error fetching doctors:', err);
            }
        };

        fetchDoctors();
    }, []);

    const filteredDoctors = selectedSpec === 'All'
        ? doctors
        : doctors.filter(doc => doc.profession === selectedSpec);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={require('../assets/images/logo_whiteText.png')}
                    resizeMode='contain'
                />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.professionScroll}>
                {specialties.map((item, index) => (
                    <TouchableOpacity
                        key={`${item}-${index}`}
                        onPress={() => setSelectedSpec(item)}
                        style={[
                        styles.professionText,
                        selectedSpec === item && { backgroundColor: '#fff' }
                        ]}
                    >
                    <Text style={{ color: selectedSpec === item ? '#000' : '#fff' }}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={styles.cardsWrapper}>
                {filteredDoctors.map((doc) => (
                    <View key={doc.id} style={styles.card}>
                        <View style={styles.cardTop}>
                            <Image
                                source={{ uri: doc.profileImageUrl || './assets/images/placeholder-profile.png' }}
                                style={styles.cardImage}
                            />
                            <Text style={styles.cardName}>Dr. {doc.fullName}</Text>
                        </View>

                    <View style={styles.divider} />

                    <View style={styles.cardDetails}>
                    <Text style={styles.detailText}>{doc.profession}</Text>
                    <Text style={styles.detailText}></Text>
                    <Text style={styles.detailText}>{doc.phone}</Text>
                    </View>

                    <View style={styles.cardActions}>
                        <TouchableOpacity onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doc.id } })} style={styles.actionBtn}>
                            <FontAwesome name="eye" size={16} color="white" />
                            <Text style={styles.btnText}>View</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn}>
                            <FontAwesome name="calendar" size={16} color="white" />
                            <Text style={styles.btnText}>Book</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    flex: 1,
  },
  header: {
    top: 0,
    height: 100,
    alignItems: 'center',
    paddingTop: 50,
    marginBottom: 50,
  },
  logo: {
    width: 200,
    height: 50,
  },
  professionScroll: {
    paddingHorizontal: 20,
    maxHeight: 50,
  },
  professionText: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    width: 'auto',
    backgroundColor: '#2c2c2c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 10,
  },
  cardsWrapper: {
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  
  cardName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardDetails: {
    marginTop: 10,
    alignItems: 'flex-start',
    gap: 3,
  },
  detailText: {
    color: '#fff',
    fontSize: 13,
    padding: 5
  },
  cardLocation: {
    color: '#888',
    fontSize: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 10,
    marginTop: 20
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005bcc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  
  btnText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
  },
});

export default guestHome;
