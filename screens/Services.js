'use client';

import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Card, IconButton, Text} from 'react-native-paper';
import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useMyContextController} from '../store';

const Services = ({navigation}) => {
  const [controller] = useMyContextController();
  const {userLogin} = controller;
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Subscribe to services collection
    const SERVICES = firestore().collection('SERVICES');
    const unsubscribe = SERVICES.orderBy('createdAt', 'desc').onSnapshot(
      snapshot => {
        const servicesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(servicesList);
      },
      error => {
        console.error('Error fetching services: ', error);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleAddNewService = () => {
    navigation.navigate('AddNewService');
  };

  const handleServicePress = serviceId => {
    navigation.navigate('ServiceDetail', {serviceId});
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{userLogin?.fullName || ''}</Text>
        <Avatar.Icon size={30} icon="account" style={styles.avatar} />
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logolab3.png')} />
      </View>

      {/* Service List */}
      <View style={styles.serviceListHeader}>
        <Text style={styles.serviceListTitle}>Danh sách dịch vụ</Text>
        <IconButton
          icon="plus-circle"
          iconColor="#f0565c"
          size={40}
          onPress={handleAddNewService}
        />
      </View>

      <ScrollView style={styles.serviceList}>
        {services.map(service => (
          <TouchableOpacity
            key={service.id}
            onPress={() => handleServicePress(service.id)}>
            <Card key={service.id} style={styles.serviceCard}>
              <Card.Content style={styles.serviceCardContent}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price} đ</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#f0565c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginVertical: 10,
  },
  avatar: {
    backgroundColor: 'white',
    marginRight: 20,
    borderRadius: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoK: {
    color: '#f0565c',
  },
  logoAMI: {
    color: '#f0565c',
  },
  logoSPA: {
    color: '#f0565c',
  },
  serviceListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  serviceListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#f0565c',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceList: {
    paddingHorizontal: 20,
  },
  serviceCard: {
    marginBottom: 10,
    borderRadius: 10,
  },
  serviceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    flex: 1,
    fontSize: 16,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Services;
