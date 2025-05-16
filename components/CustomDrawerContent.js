import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useAppContext} from '../context/AppContext';
import Feather from 'react-native-vector-icons/Feather';

const CustomDrawerContent = props => {
  const {user, signOut, cart} = useAppContext();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <View style={styles.userInfoSection}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.email || 'User'}</Text>
        </View>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Feather name="log-out" size={22} color="#c1121f" />
        <Text style={styles.signOutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#c1121f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 30,
  },
  badge: {
    backgroundColor: '#c1121f',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 20,
  },
  signOutText: {
    fontSize: 16,
    color: '#c1121f',
    marginLeft: 30,
  },
});

export default CustomDrawerContent;
