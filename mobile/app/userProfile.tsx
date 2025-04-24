import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import LoadingScreen from './components/LoadingScreen';

const countryCodes = [
  { code: '+267', country: 'Botswana' },
  { code: '+27', country: 'South Africa' },
  { code: '+263', country: 'Zimbabwe' },
  { code: '+260', country: 'Zambia' },
];

export default function UserProfile() {
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const parsePhoneWithCode = (fullPhone: string) => {
    if (!fullPhone) return { code: '+267', number: '' };
    
    // Find the country code that matches the beginning of the phone number
    const countryCode = countryCodes.find(c => 
      fullPhone.startsWith(c.code)
    )?.code || '+267';
    
    const number = fullPhone.substring(countryCode.length);
    return { code: countryCode, number };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          Alert.alert('Error', 'Not logged in');
          router.replace('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data && typeof data.firstName === 'string' && typeof data.lastName === 'string' && typeof data.email === 'string' && typeof data.phone === 'string') {
            setUserData({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
            });
          } else {
            console.error('Invalid user data:', data);
            Alert.alert('Error', 'Invalid user data');
          }
          
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          
          const { code, number } = parsePhoneWithCode(data.phone);
          setCountryCode(code);
          setPhone(number);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setUpdating(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Validate phone
      if (!/^\d+$/.test(phone) || phone.length < 7) {
        Alert.alert('Error', 'Please enter a valid phone number');
        setUpdating(false);
        return;
      }

      await updateDoc(doc(db, 'users', currentUser.uid), {
        firstName,
        lastName,
        phone: `${countryCode}${phone}`
      });

      Alert.alert('Success', 'Profile updated successfully');
      
      setUserData(prev => ({
        ...prev,
        firstName,
        lastName,
        phone: `${countryCode}${phone}`
      }));
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    setUpdating(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('User not authenticated');
      }
      
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Change password
      await updatePassword(user, newPassword);
      
      Alert.alert('Success', 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (error) {
      console.error('Password change error:', error);
      if ((error as { code?: string }).code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect');
      } else {
        setPasswordError('Failed to change password');
      }
    } finally {
      setUpdating(false);
    }
  };

  const renderCountryItem = ({ item }: { item: { code: string; country: string } }) => (
    <TouchableOpacity 
      style={styles.countryItem}
      onPress={() => {
        setCountryCode(item.code);
        setModalVisible(false);
      }}
    >
      <Text style={styles.countryItemText}>{item.code} ({item.country})</Text>
    </TouchableOpacity>
  );

  if (loading) return <LoadingScreen message="Loading profile..." />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Your Profile</Text>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { color: '#aaa' }]}
            value={userData.email}
            editable={false}
          />
          
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            placeholderTextColor="#999"
          />
          
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            placeholderTextColor="#999"
          />
          
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneContainer}>
            <TouchableOpacity 
              style={styles.countryCodeButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <FontAwesome name="caret-down" size={16} color="white" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={handleUpdateProfile}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          {showChangePassword ? (
            <>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor="#999"
              />
              
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Enter new password"
                placeholderTextColor="#999"
              />
              
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm new password"
                placeholderTextColor="#999"
              />
              
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleChangePassword}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.passwordButton}
              onPress={() => setShowChangePassword(true)}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              auth.signOut();
              router.replace('/login');
            }}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => Alert.alert('Coming Soon', 'Account deletion will be available in a future update.')
                  }
                ]
              );
            }}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Country Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country Code</Text>
            
            <FlatList
              data={countryCodes}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
            />
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#111111',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#111111',
  },
  backButton: {
    paddingTop: 30,
    paddingLeft: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#005bcc',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111111',
  },
  label: {
    color: '#ccc',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    width: '30%',
    marginRight: 8,
  },
  countryCodeText: {
    color: 'white',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#444',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#005bcc',
    marginLeft: 8,
  },
  updateButton: {
    backgroundColor: '#005bcc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordButton: {
    backgroundColor: '#444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#ff4040',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  deleteButtonText: {
    color: '#ff4040',
    fontWeight: '500',
    fontSize: 16,
  },
  errorText: {
    color: '#ff4040',
    marginBottom: 15,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  countryList: {
    width: '100%',
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    width: '100%',
  },
  countryItemText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#444',
    width: '100%',
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});