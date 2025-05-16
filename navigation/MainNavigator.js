import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useAppContext} from '../context/AppContext';
import LoginScreen from '../screensLab4/LoginScreen';
import SignupScreen from '../screensLab4/SignUpScreen';
import ForgotPasswordScreen from '../screensLab4/ForgotPasswordScreen';
import CategoriesScreen from '../screensLab4/CategoriesScreen';
import FoodItemsScreen from '../screensLab4/FoodItemsScreen';
import CartScreen from '../screensLab4/CartScreen';
import PaymentSuccessScreen from '../screensLab4/PaymentSuccessScreen';
import ProfileScreen from '../screensLab4/ProfileScreen';
import OrderHistoryScreen from '../screensLab4/OrderHistoryScreen';
import OrderDetailScreen from '../screensLab4/OrderDetailScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

const FoodNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#c1121f',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{title: 'Restaurant App'}}
      />
      <Stack.Screen
        name="FoodItems"
        component={FoodItemsScreen}
        options={({route}) => ({title: route.params?.categoryName || 'Menu'})}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{title: 'Cart'}}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

const OrderHistoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#c1121f',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{title: 'Order History'}}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{title: 'Order Detail'}}
      />
    </Stack.Navigator>
  );
};

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#c1121f',
        drawerInactiveTintColor: '#333',
      }}>
      <Drawer.Screen
        name="Home"
        component={FoodNavigator}
        options={{title: 'Home'}}
      />
      <Drawer.Screen
        name="Orders"
        component={OrderHistoryNavigator}
        options={{title: 'Orders History'}}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Drawer.Navigator>
  );
};

const MainNavigator = () => {
  const {isAuthenticated} = useAppContext();

  return isAuthenticated ? <AppDrawerNavigator /> : <AuthNavigator />;
};

export default MainNavigator;
