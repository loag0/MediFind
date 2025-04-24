import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Doctor {
  id: string;
  isSuspended: boolean;
  profession: string;
  fullName: string;
  profileImageUrl?: string;
  location?: string;
  phone?: string;
}

const SearchPage = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snap = await getDocs(collection(db, 'doctors'));
        const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor)).filter(doc => doc.fullName);
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

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = selectedSpec === 'All' || doc.profession === selectedSpec;
    
    const matchesSearch = 
      searchQuery === '' || 
      doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.profession.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSpecialty && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
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
        {specialties.map((item) => (
          <TouchableOpacity
            key={item}
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
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
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
                <TouchableOpacity 
                  onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doc.id } })} 
                  style={styles.actionBtn}
                >
                  <FontAwesome name="eye" size={16} color="white" />
                  <Text style={styles.btnText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => router.push({ pathname: '/booking/[id]', params: { id: doc.id } })} 
                  style={styles.actionBtn}
                >
                  <FontAwesome name="calendar" size={16} color="white" />
                  <Text style={styles.btnText}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noResultsText}>No doctors found matching your search</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    flex: 1,
    paddingTop: 50,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    color: 'black',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 10,

  },
  professionScroll: {
    paddingHorizontal: 20,
    maxHeight: 50,
    marginBottom: 10,
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
  noResultsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  }
});

export default SearchPage;