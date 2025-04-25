import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const SearchPage = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snap = await getDocs(collection(db, 'doctors'));
        const allDoctors = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { isSuspended?: boolean; location?: any; profession?: string; fullName?: string; map?: { lat: number; lng: number }; profileImageUrl?: string; phone?: string; }) }));

        const validDoctors = allDoctors.filter(doc => !doc.isSuspended && doc.location);
        setDoctors(validDoctors);

        const specList = Array.from(new Set(validDoctors.map(doc => doc.profession).filter((spec): spec is string => spec !== undefined))).sort();
        setSpecialties(['All', ...specList]);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doc => {
      const matchesSpec = selectedSpec === 'All' || doc.profession === selectedSpec;
      const matchesSearch =
        searchQuery === '' ||
        doc.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.profession?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpec && matchesSearch;
    });

    setFilteredDoctors(filtered);
  }, [doctors, selectedSpec, searchQuery]);

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {filteredDoctors.map(doc => (
            <Marker
              key={doc.id}
              coordinate={{
                latitude: parseFloat(doc.map?.lat || 0),
                longitude: parseFloat(doc.map?.lng || 0),
              }}
              title={doc.fullName}
              description={doc.profession}
              onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doc.id } })}
            />
          ))}
        </MapView>
      )}

      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or profession..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome name="times-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.professionScroll}>
          {specialties.map(spec => (
            <TouchableOpacity
              key={spec}
              onPress={() => setSelectedSpec(spec)}
              style={[styles.professionText, selectedSpec === spec && { backgroundColor: '#fff' }]}
            >
              <Text style={{ color: selectedSpec === spec ? '#000' : '#fff' }}>{spec}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      <ScrollView style={styles.content}>

        <View style={styles.cardsWrapper}>
          {filteredDoctors.map(doc => (
            <View key={doc.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Image
                  source={{ uri: doc.profileImageUrl || './assets/images/placeholder-profile.png' }}
                  style={styles.cardImage}
                />
                <Text style={styles.cardName}>Dr. {doc.fullName}</Text>
              </View>

              <View style={styles.divider} />
              <Text style={styles.detailText}>{doc.profession}</Text>
              <Text style={styles.detailText}>Lat: {doc.location?._lat}</Text>
              <Text style={styles.detailText}>Lng: {doc.location?.lng}</Text>
              <Text style={styles.detailText}>{doc.phone}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doc.id } })} style={styles.actionBtn}>
                  <FontAwesome name="eye" size={16} color="white" />
                  <Text style={styles.btnText}>View</Text>
                </TouchableOpacity>

              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  map: { width: Dimensions.get('window').width, height: 300, zIndex: 0, position: 'relative', top: 0 },
  content: { flex: 1, left: 0, right: 0, zIndex: 1},

  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
    maxHeight: 40,

  },
  backButton: {
    position: 'absolute',
    paddingHorizontal: 20,
    paddingVertical: 30,
    top: 0,
    marginRight: 15,
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
  },
  searchIcon: {
    color: 'black',
    marginRight: 10,
  },
  searchInput: {
    padding: 10,
    flex: 1,
    color: 'black',
    fontSize: 16,
    paddingVertical: 10,

  },
  professionScroll: {
    paddingHorizontal: 15,
    maxHeight: 45,
  },

  professionText: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#333',
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsWrapper: {
    paddingVertical: 15,
    paddingHorizontal: 15,
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
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 10,
  },
  detailText: {
    color: '#fff',
    fontSize: 13,
    paddingVertical: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
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

export default SearchPage;