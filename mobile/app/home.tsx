import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const home = () => {
    const router = useRouter();
  return (
    <View style={styles.container}>

        <View style={styles.header}>
            
            <Image
                style={styles.logo}
                source={require('../assets/images/logo_whiteText.png')}
                resizeMode='contain'
            >
            </Image>    

            <View style={styles.navBtns}>
                <TouchableOpacity onPress={() => router.push('./searchPage')}>
                    <Text style={{color: 'white', fontSize: 20, marginVertical: 10}}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('./userProfile')}>
                    <Text style={{color: 'white', fontSize: 20, marginVertical: 10}}>User</Text>
                </TouchableOpacity>
            </View>
        </View>

        <Text style={styles.welcomeText}>WELCOME,</Text>
        <Text style={{color: 'white', fontSize: 36, alignSelf: 'flex-start', marginLeft: 25, fontWeight: 'bold'}}>JOHN DOE</Text>
        
        <ScrollView style={styles.professionScroll}>
            <View className='flex-row flex-wrap'>
                {['All', 'Cardiologist'].map((item) => (
                    <TouchableOpacity key={item} style={styles.professionText}>
                        <Text >{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>

        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#111111',
        alignItems: 'center',
        flex: 1,
    },
    header: {
        top: 0,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 45,
    },
    logo:{
        width: '50%',
        height: 100,
        alignSelf: 'flex-start',
        marginRight: 30
    },
    welcomeText: {
        color: 'white',
        fontSize: 36,
        marginTop: 150,
        marginLeft: 25,
        fontWeight: 'condensed',
        alignSelf: 'flex-start'
    },
    professionScroll: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        backgroundColor: '#111111',
    },
    professionText: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 8,
        width: 50,
        height: 50,
        color: 'black',
        fontSize: 16,
        marginLeft: 25,
    },
    navBtns: {
        flexDirection: 'row',
        width: '25%',
        gap: 20,
    },
});

export default home