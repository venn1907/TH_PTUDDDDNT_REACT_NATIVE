import {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useAppContext} from '../context/AppContext';
import Feather from 'react-native-vector-icons/Feather';
import HeaderRight from '../components/HeaderRight';

const CategoriesScreen = ({navigation}) => {
  const {categories, loading, cart, user} = useAppContext();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={24} color="#c1121f" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <HeaderRight
          cartCount={cart.length}
          onCartPress={() => navigation.navigate('Cart')}
        />
      ),
    });
  }, [navigation, cart.length]);

  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() =>
        navigation.navigate('FoodItems', {
          categoryId: item.id,
          categoryName: item.name,
        })
      }>
      <Image
        source={item.imageUrl}
        style={styles.categoryImage}
        defaultSource={require('../assets/images/placeholder-food.png')}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c1121f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cuisine</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c1121f',
    marginVertical: 15,
    marginLeft: 15,
  },
  listContainer: {
    padding: 10,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#c1121f',
    textAlign: 'center',
  },
});

export default CategoriesScreen;
