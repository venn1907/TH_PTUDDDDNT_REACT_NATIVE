'use client';

import {StyleSheet, View, ScrollView} from 'react-native';
import {Text, Button, Avatar, Card, Divider} from 'react-native-paper';
import {useMyContextController, logout} from '../../store';
import { useEffect } from 'react';

const CustomerProfile = ({navigation}) => {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;

  const handleLogout = () => {
    logout(dispatch);
  };

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate('Login');
    }
  }, [userLogin]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="account" style={styles.avatar} />
        <Text style={styles.name}>{userLogin?.fullName || 'Customer'}</Text>
        <Text style={styles.email}>{userLogin?.email || ''}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name:</Text>
              <Text style={styles.infoValue}>
                {userLogin?.fullName || 'N/A'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{userLogin?.email || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{userLogin?.phone || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>
                {userLogin?.address || 'N/A'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('UpdateProfile')}
            style={styles.button}
            buttonColor="#f0565c">
            Update Profile
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('ChangePassword')}
            style={styles.button}
            buttonColor="#f0565c">
            Change Password
          </Button>

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#f0565c">
            Logout
          </Button>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    backgroundColor: 'white',
  },
  name: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  infoValue: {
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    marginBottom: 15,
  },
  logoutButton: {
    borderColor: '#f0565c',
  },
});

export default CustomerProfile;
