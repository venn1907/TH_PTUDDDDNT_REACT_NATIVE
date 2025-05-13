'use client';

import {StyleSheet, View, Alert} from 'react-native';
import {Button, Text, TextInput, IconButton} from 'react-native-paper';
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const AddNewService = ({navigation, route}) => {
  const {editMode, service} = route.params || {editMode: false, service: null};
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('0');

  useEffect(() => {
    if (editMode && service) {
      setServiceName(service.name || '');
      setPrice(service.price?.toString() || '0');
    }
  }, [editMode, service]);

  const handleSaveService = () => {
    // Validate inputs
    if (!serviceName.trim()) {
      Alert.alert('Error', 'Please enter a service name');
      return;
    }

    if (isNaN(Number.parseFloat(price)) || Number.parseFloat(price) < 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    // Add or update service in Firestore
    const SERVICES = firestore().collection('SERVICES');

    if (editMode && service) {
      // Update existing service
      SERVICES.doc(service.id)
        .update({
          name: serviceName,
          price: Number.parseFloat(price),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          Alert.alert('Success', 'Service updated successfully');
          navigation.goBack();
        })
        .catch(error => {
          console.error('Error updating service: ', error);
          Alert.alert('Error', 'Failed to update service. Please try again.');
        });
    } else {
      // Add new service
      SERVICES.add({
        name: serviceName,
        price: Number.parseFloat(price),
        creator: 'Hung', // You might want to get this from the current user
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
        .then(() => {
          Alert.alert('Success', 'Service added successfully');
          navigation.goBack();
        })
        .catch(error => {
          console.error('Error adding service: ', error);
          Alert.alert('Error', 'Failed to add service. Please try again.');
        });
    }
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
        <Text style={styles.headerTitle}>Service</Text>
        <View style={{width: 40}} /> {/* Empty view for balance */}
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Service name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={serviceName}
            onChangeText={setServiceName}
            placeholder="Input a service name"
            style={styles.input}
            mode="outlined"
            outlineColor="#e0e0e0"
            activeOutlineColor="#f0565c"
            theme={{colors: {primary: '#f0565c'}}}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Price <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            outlineColor="#e0e0e0"
            activeOutlineColor="#f0565c"
            theme={{colors: {primary: '#f0565c'}}}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSaveService}
          style={styles.addButton}
          buttonColor="#f0565c">
          {editMode ? 'Update' : 'Add'}
        </Button>
      </View>
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
    paddingVertical: 10,
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  required: {
    color: '#f0565c',
  },
  input: {
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    marginTop: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
});

export default AddNewService;
