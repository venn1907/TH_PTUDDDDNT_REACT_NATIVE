import {MyContextControllerProvider} from './store';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './routers/Router';
import {Provider} from 'react-native-paper';

const App = () => {
  const USERS = firestore().collection('USERS');

  const ADMIN = {
    fullName: 'Admin',
    email: 'thangcdnguyen@gmail.com',
    password: '123456',
    phone: '0868042251',
    address: 'Bình Dương',
    role: 'admin',
  };

  useEffect(() => {
    //DK tai khoan admin
    USERS.doc(ADMIN.email).onSnapshot(u => {
      if (!u.exists) {
        auth()
          .createUserWithEmailAndPassword(ADMIN.email, ADMIN.password)
          .then(response => {
            USERS.doc(ADMIN.email).set(ADMIN);
            console.log('Add new account admin');
          })
          .catch(e => {
            console.log('Account admin exists');
          });
      }
    });
  }, []);

  return (
    <MyContextControllerProvider>
      <Provider>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </Provider>
    </MyContextControllerProvider>
  );
};

export default App;
