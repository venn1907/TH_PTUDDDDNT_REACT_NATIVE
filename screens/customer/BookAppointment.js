'use client';

import {StyleSheet, View, ScrollView, Alert, Platform} from 'react-native';
import {Text, Button, TextInput, Divider} from 'react-native-paper';
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useMyContextController} from '../../store';
import DateTimePicker from '@react-native-community/datetimepicker';

const BookAppointment = ({navigation, route}) => {
  const [controller] = useMyContextController();
  const {userLogin} = controller;
  const {serviceId} = route.params || {};

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Fetch all services
    const SERVICES = firestore().collection('SERVICES');
    const unsubscribe = SERVICES.orderBy('name').onSnapshot(
      snapshot => {
        const servicesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(servicesList);

        // If serviceId is provided, select that service
        if (serviceId) {
          const service = servicesList.find(s => s.id === serviceId);
          if (service) {
            setSelectedService(service);
          }
        }
      },
      error => {
        console.error('Error fetching services: ', error);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [serviceId]);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      const currentDate = new Date(date);
      const newDate = new Date(selectedDate);

      // Only update the date part, keep the time part
      currentDate.setFullYear(newDate.getFullYear());
      currentDate.setMonth(newDate.getMonth());
      currentDate.setDate(newDate.getDate());

      setDate(currentDate);
    }

    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      return;
    }

    if (selectedTime) {
      const currentDate = new Date(date);
      const newTime = new Date(selectedTime);

      // Only update the time part, keep the date part
      currentDate.setHours(newTime.getHours());
      currentDate.setMinutes(newTime.getMinutes());

      setDate(currentDate);
    }

    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const handleBookAppointment = () => {
    if (!selectedService) {
      Alert.alert('Error', 'Please select a service');
      return;
    }

    if (!userLogin || !userLogin.email) {
      Alert.alert('Error', 'You must be logged in to book an appointment');
      return;
    }

    // Create appointment in Firestore
    const APPOINTMENTS = firestore().collection('APPOINTMENTS');
    APPOINTMENTS.add({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: selectedService.price,
      customerEmail: userLogin.email,
      customerName: userLogin.fullName,
      appointmentDate: date,
      notes: notes,
      status: 'Pending',
      createdAt: firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        Alert.alert('Success', 'Appointment booked successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CustomerAppointments'),
          },
        ]);
      })
      .catch(error => {
        console.error('Error booking appointment: ', error);
        Alert.alert('Error', 'Failed to book appointment');
      });
  };

  // Format date for display
  const formatDate = date => {
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Format time for display
  const formatTime = date => {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Book an Appointment</Text>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          <Divider style={styles.divider} />

          <ScrollView style={styles.serviceList} horizontal>
            {services.map(service => (
              <Button
                key={service.id}
                mode={
                  selectedService?.id === service.id ? 'contained' : 'outlined'
                }
                onPress={() => setSelectedService(service)}
                style={styles.serviceButton}
                buttonColor={
                  selectedService?.id === service.id ? '#f0565c' : undefined
                }
                textColor={
                  selectedService?.id === service.id ? 'white' : '#f0565c'
                }>
                {service.name}
              </Button>
            ))}
          </ScrollView>

          {selectedService && (
            <View style={styles.selectedService}>
              <Text style={styles.selectedServiceName}>
                {selectedService.name}
              </Text>
              <Text style={styles.selectedServicePrice}>
                {selectedService.price?.toLocaleString() || 0} đ
              </Text>
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Select Date & Time</Text>
          <Divider style={styles.divider} />

          <View style={styles.dateTimeContainer}>
            <Button
              mode="outlined"
              onPress={showDatePickerModal}
              style={styles.dateButton}
              textColor="#f0565c"
              icon="calendar">
              {formatDate(date)}
            </Button>

            <Button
              mode="outlined"
              onPress={showTimePickerModal}
              style={styles.timeButton}
              textColor="#f0565c"
              icon="clock">
              {formatTime(date)}
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={date}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Divider style={styles.divider} />

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests or notes"
            multiline
            numberOfLines={4}
            style={styles.notesInput}
            mode="outlined"
            outlineColor="#e0e0e0"
            activeOutlineColor="#f0565c"
          />
        </View>

        <Button
          mode="contained"
          onPress={handleBookAppointment}
          style={styles.bookButton}
          buttonColor="#f0565c">
          Book Appointment
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
  },
  serviceList: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  serviceButton: {
    marginRight: 10,
    borderColor: '#f0565c',
  },
  selectedService: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  selectedServiceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedServicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    marginRight: 5,
    borderColor: '#f0565c',
  },
  timeButton: {
    flex: 1,
    marginLeft: 5,
    borderColor: '#f0565c',
  },
  notesInput: {
    backgroundColor: '#f9f9f9',
  },
  bookButton: {
    marginVertical: 20,
    paddingVertical: 5,
  },
});

export default BookAppointment;
