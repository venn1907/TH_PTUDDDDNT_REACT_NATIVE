import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Admin from '../screens/Admin';
import Customers from '../screens/Customers';
import AddNewService from '../screens/AddNewService';
import ServiceDetail from '../screens/ServiceDetail';
import Customer from '../screens/Customer';
import CustomerAppointments from '../screens/customer/CustomerAppointments';
import UpdateAppointment from '../screens/customer/UpdateAppointment';

const Stack = createStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Customers" component={Customers} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="AddNewService" component={AddNewService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
      <Stack.Screen name="Customer" component={Customer} />
      <Stack.Screen
        name="CustomerAppointments"
        component={CustomerAppointments}
      />
      <Stack.Screen name="UpdateAppointment" component={UpdateAppointment} />
    </Stack.Navigator>
  );
};

export default Router;
