import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {AppContextProvider} from './context/AppContext';
import MainNavigator from './navigation/MainNavigator';

const App = () => {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <StatusBar barStyle="default" backgroundColor="#fff" />
        <MainNavigator />
      </NavigationContainer>
    </AppContextProvider>
  );
};

export default App;
