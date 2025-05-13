'use client';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {IconButton} from 'react-native-paper';
import AdminTransactions from './admin/AdminTransactions';
import AdminCustomers from './admin/AdminCustomers';
import AdminProfile from './admin/AdminProfile';
import UpdateAppointment from './admin/UpdateAppointment';
import UpdateCustomer from './admin/UpdateCustomer';
import UpdateAdminProfile from './admin/UpdateAdminProfile';
import ChangeAdminPassword from './admin/ChangeAdminPassword';
import Services from './Services';

const Tab = createMaterialBottomTabNavigator();
const TransactionsStack = createStackNavigator();
const CustomersStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Transactions Stack Navigator
const TransactionsStackScreen = () => {
  return (
    <TransactionsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f0565c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <TransactionsStack.Screen
        name="AdminTransactions"
        component={AdminTransactions}
        options={{title: 'Appointments'}}
      />
      <TransactionsStack.Screen
        name="UpdateAppointment"
        component={UpdateAppointment}
        options={{title: 'Update Appointment'}}
      />
    </TransactionsStack.Navigator>
  );
};

// Customers Stack Navigator
const CustomersStackScreen = () => {
  return (
    <CustomersStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f0565c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <CustomersStack.Screen
        name="AdminCustomers"
        component={AdminCustomers}
        options={{title: 'Customers'}}
      />
      <CustomersStack.Screen
        name="UpdateCustomer"
        component={UpdateCustomer}
        options={{title: 'Update Customer'}}
      />
    </CustomersStack.Navigator>
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
        name="AdminProfile"
        component={AdminProfile}
        options={{title: 'Profile'}}
      />
      <ProfileStack.Screen
        name="UpdateAdminProfile"
        component={UpdateAdminProfile}
        options={{title: 'Update Profile'}}
      />
      <ProfileStack.Screen
        name="ChangeAdminPassword"
        component={ChangeAdminPassword}
        options={{title: 'Change Password'}}
      />
    </ProfileStack.Navigator>
  );
};

// Main Admin Tab Navigator
const Admin = () => {
  return (
    <Tab.Navigator
      initialRouteName="Services"
      activeColor="#f0565c"
      inactiveColor="#777777"
      barStyle={{backgroundColor: 'white'}}>
      <Tab.Screen
        name="Services"
        component={Services}
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
        name="Transactions"
        component={TransactionsStackScreen}
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
        name="Customers"
        component={CustomersStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <IconButton
              icon="account-group"
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

export default Admin;
