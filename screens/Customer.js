'use client';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {IconButton} from 'react-native-paper';
import {useMyContextController} from '../store';
import CustomerServices from './customer/CustomerServices';
import CustomerAppointments from './customer/CustomerAppointments';
import CustomerProfile from './customer/CustomerProfile';
import ServiceDetail from './ServiceDetail';
import FindService from './customer/FindService';
import BookAppointment from './customer/BookAppointment';
import UpdateAppointment from './customer/UpdateAppointment';
import UpdateProfile from './customer/UpdateProfile';
import ChangePassword from './customer/ChangePassword';

const Tab = createBottomTabNavigator();
const ServicesStack = createStackNavigator();
const AppointmentsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Services Stack Navigator
const ServicesStackScreen = () => {
  return (
    <ServicesStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f0565c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <ServicesStack.Screen
        name="CustomerServices"
        component={CustomerServices}
        options={{title: 'Services'}}
      />
      <ServicesStack.Screen
        name="FindService"
        component={FindService}
        options={{title: 'Find Service'}}
      />
      <ServicesStack.Screen
        name="ServiceDetail"
        component={ServiceDetail}
        options={{title: 'Service Detail', headerShown: false}}
      />
      <ServicesStack.Screen
        name="BookAppointment"
        component={BookAppointment}
        options={{title: 'Book Appointment'}}
      />
    </ServicesStack.Navigator>
  );
};

// Appointments Stack Navigator
const AppointmentsStackScreen = () => {
  return (
    <AppointmentsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f0565c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <AppointmentsStack.Screen
        name="CustomerAppointments"
        component={CustomerAppointments}
        options={{title: 'Appointments'}}
      />
      <AppointmentsStack.Screen
        name="UpdateAppointment"
        component={UpdateAppointment}
        options={{title: 'Update Appointment'}}
      />
    </AppointmentsStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f0565c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <ProfileStack.Screen
        name="CustomerProfile"
        component={CustomerProfile}
        options={{title: 'Profile'}}
      />
      <ProfileStack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{title: 'Update Profile'}}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{title: 'Change Password'}}
      />
    </ProfileStack.Navigator>
  );
};

// Main Customer Tab Navigator
const Customer = () => {
  const [controller] = useMyContextController();
  const {userLogin} = controller;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f0565c',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {backgroundColor: 'white'},
      }}>
      <Tab.Screen
        name="Services"
        component={ServicesStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <IconButton
              icon="store"
              iconColor={color}
              size={24}
              style={{margin: 0}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <IconButton
              icon="calendar"
              iconColor={color}
              size={24}
              style={{margin: 0}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <IconButton
              icon="account"
              iconColor={color}
              size={24}
              style={{margin: 0}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Customer;
