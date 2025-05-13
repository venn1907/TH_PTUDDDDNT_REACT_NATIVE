'use client';

import {Alert, StyleSheet, View} from 'react-native';
import {Text, IconButton, Menu} from 'react-native-paper';
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useMyContextController} from '../store';

const ServiceDetail = ({navigation, route}) => {
  const {serviceId} = route.params || {};
  const [service, setService] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;

  useEffect(() => {
    if (serviceId) {
      // Fetch service details from Firestore
      const SERVICES = firestore().collection('SERVICES');
      const unsubscribe = SERVICES.doc(serviceId).onSnapshot(
        doc => {
          if (doc.exists) {
            setService({id: doc.id, ...doc.data()});
          } else {
            alert('Service not found');
            navigation.goBack();
          }
        },
        error => {
          console.error('Error fetching service: ', error);
          alert('Error loading service details');
        },
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      alert('No service ID provided');
      navigation.goBack();
    }
  }, [serviceId, navigation]);

  const handleEdit = () => {
    setMenuVisible(false);
    // Navigate to edit screen with service data
    navigation.navigate('AddNewService', {
      editMode: true,
      service: service,
    });
  };

  const handleDelete = () => {
    setMenuVisible(false);
    // Confirm before deleting
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this service?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const SERVICES = firestore().collection('SERVICES');
            SERVICES.doc(serviceId)
              .delete()
              .then(() => {
                Alert.alert('Success', 'Service deleted successfully');
                navigation.goBack();
              })
              .catch(error => {
                console.error('Error deleting service: ', error);
                Alert.alert('Error', 'Failed to delete service');
              });
          },
          style: 'destructive',
        },
      ],
    );
  };

  // Format date function
  const formatDate = timestamp => {
    if (!timestamp) return 'N/A';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Service detail</Text>
        {userLogin?.role == 'admin' ? (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                iconColor="white"
                size={24}
                onPress={() => setMenuVisible(true)}
              />
            }>
            <Menu.Item onPress={handleEdit} title="Edit" />
            <Menu.Item onPress={handleDelete} title="Delete" />
          </Menu>
        ) : (
          <Text></Text>
        )}
      </View>

      {/* Service Details */}
      {service && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service name:</Text>
            <Text style={styles.detailValue}>{service.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>
              {service.price?.toLocaleString() || 0} đ
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Creator:</Text>
            <Text style={styles.detailValue}>{service.creator || 'Hung'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>
              {formatDate(service.createdAt)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Final update:</Text>
            <Text style={styles.detailValue}>
              {formatDate(service.updatedAt || service.createdAt)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#f0565c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
  },
});

export default ServiceDetail;
