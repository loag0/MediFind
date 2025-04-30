import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const SearchPage = () => {
  const router = useRouter();
  const [mapLoading, setMapLoading] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
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
        setLoadingDoctors(true);
        const snap = await getDocs(collection(db, 'doctors'));
        const allDoctors = snap.docs.map(doc => ({ 
          id: doc.id, 
          ...(doc.data() as { 
            isSuspended?: boolean; 
            location?: any; 
            profession?: string; 
            fullName?: string; 
            city?: string;
            map?: { lat: number; lng: number }; 
            profileImageUrl?: string; 
            phone?: string; 
          }) 
        }));
    
        const validDoctors = allDoctors.filter(doc => {
          const loc = doc.location;
          return (
            !doc.isSuspended &&
            loc &&
            (loc.lat || loc.latitude || loc._lat) &&
            (loc.lng || loc.longitude || loc._long)
          );
        });
        
        setDoctors(validDoctors);
    
        const specList = Array.from(
          new Set(validDoctors.map(doc => doc.profession).filter((spec): spec is string => spec !== undefined))
        ).sort();
        setSpecialties(['All', ...specList]);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoadingDoctors(false);
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
        doc.profession?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.city?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpec && matchesSearch;
    });

    setFilteredDoctors(filtered);
  }, [doctors, selectedSpec, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      
      <View style={styles.mapContainer}>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          onMapReady={() => setMapLoading(false)}
          showsUserLocation={true}
          onRegionChangeComplete={() => setMapLoading(false)}
        >
          {filteredDoctors.map(doc => {
  // Debug what's actually in the location object
  console.log('Doctor location data:', doc.fullName, doc.location);
  
  // Skip if no location data
  if (!doc.location) {
    console.log('Missing location for doctor:', doc.fullName);
    return null;
  }
  
  // Extract coordinates from the location map
  const lat = doc.location.latitude;
  const lng = doc.location.longitude;
  
  // Skip if invalid coordinates
  if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
    console.log('Invalid location for doctor:', doc.fullName);
    return null;
  }
  
  return (
    <Marker
      key={doc.id}
      coordinate={{ latitude: 24.6581, longitude: 25.9122 }}
      title={doc.fullName || 'Doctor'}
      description={doc.profession || 'Medical Professional'}
      onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doc.id } })}
    />
  );
})}
        </MapView>
      )}
      {mapLoading && (
      <View style={styles.mapLoadingOverlay}>
        <Text style={styles.mapLoadingText}>Loading Map...</Text>
      </View>
      )}
      </View>

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
          {loadingDoctors ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#11cc77" />
              <Text style={styles.loadingText}>Loading doctors...</Text>
            </View>
          ) : filteredDoctors.length === 0 ? (
            <Text style={styles.noDocText}>No doctors available right now.</Text>
          ) : filteredDoctors.map(doc => (
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
              <Text style={styles.detailText}>{doc.city || 'Unknown'}</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  
  content: { flex: 1, left: 0, right: 0, zIndex: 1},

  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: 300,
    backgroundColor: 'rgb(216, 216, 216)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  mapLoadingText: {
    color: 'white',
    fontSize: 18,
  },
  mapContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchHeader: {
    position: 'relative',
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
    paddingVertical: 50,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
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