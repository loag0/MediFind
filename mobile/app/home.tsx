import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../firebase/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const auth = getAuth();

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
  const [specialties, setSpecialties] = useState<string[]>(['All']);
  const [selectedSpec, setSelectedSpec] = useState('All');

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      try {
        const authUser = auth.currentUser;
        if (authUser) {
          const userSnap = await getDoc(doc(db, 'users', authUser.uid));
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
            });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    // Load doctors data
    const loadDoctorsData = async () => {
      try {
        const snap = await getDocs(collection(db, 'doctors'));
        const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        const filtered = docs.filter(doc => !doc.isSuspended);
        setDoctors(filtered);

        const specList = Array.from(new Set(filtered.map(doc => doc.profession))).sort();
        setSpecialties(['All', ...specList]);
      } catch (error) {
        console.error('Error loading doctors data:', error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadUserData();
    loadDoctorsData();
  }, []);

  const filteredDoctors =
    selectedSpec === 'All' ? doctors : doctors.filter(doc => doc.profession === selectedSpec);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require('../assets/images/logo_whiteText.png')}
          resizeMode="contain"
        />
        <View style={styles.navBtns}>
          <TouchableOpacity onPress={() => router.push('./searchPage')}>
            <FontAwesome name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('./userProfile')}>
            <FontAwesome name="user" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.welcomeText}>WELCOME,</Text>
      {loadingUser ? (
        <Text style={styles.nameText}>...</Text>
      ) : (
        <Text style={styles.nameText}>
          {user.firstName?.toUpperCase()} {user.lastName?.toUpperCase()}
        </Text>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.professionScroll}>
        {specialties.map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedSpec(item)}
            style={[
              styles.professionText,
              selectedSpec === item && { backgroundColor: '#fff' },
            ]}
          >
            <Text style={{ color: selectedSpec === item ? '#000' : '#fff' }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.cardsWrapper}>
        {loadingDoctors ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#11cc77" />
            <Text style={styles.loadingText}>Loading doctors...</Text>
          </View>
        ) : filteredDoctors.length === 0 ? (
          <Text style={styles.noDocText}>
            No doctors available right now.
          </Text>
        ) : (
          filteredDoctors.map(doc => (
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
                <Text style={styles.detailText}>{doc.phone}</Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: '/doctor/[id]', params: { id: doc.id } })
                  }
                  style={styles.actionBtn}
                >
                  <FontAwesome name="eye" size={16} color="white" />
                  <Text style={styles.btnText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
    left: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 30,
    paddingTop: 50,
  },
  logo: {
    marginLeft: -20,
    width: 200,
    height: 50,
  },
  navBtns: {
    flexDirection: 'row',
    gap: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 36,
    marginLeft: 20,
    fontWeight: '400',
  },
  nameText: {
    color: 'white',
    fontSize: 32,
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontWeight: 'bold',
  },
  professionScroll: {
    marginTop: 20,
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
    minHeight: 300,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  noDocText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#2c2c2c',
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
    justifyContent: 'center',
    backgroundColor: '#11cc77',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    width: 100,
  },
  btnText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
  },
});

export default Home;