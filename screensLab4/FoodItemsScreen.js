import {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useAppContext} from '../context/AppContext';
import HeaderRight from '../components/HeaderRight';

const FoodItemsScreen = ({route, navigation}) => {
  const {categoryId, categoryName} = route.params;
  const {foodItems, loading, fetchFoodItemsByCategory, dispatch, cart} =
    useAppContext();

  useEffect(() => {
    fetchFoodItemsByCategory(categoryId);

    navigation.setOptions({
      headerRight: () => (
        <HeaderRight
          cartCount={cart.length}
          onCartPress={() => navigation.navigate('Cart')}
        />
      ),
    });
  }, [categoryId, navigation, cart.length]);

  const handleAddToCart = item => {
    dispatch({type: 'ADD_TO_CART', payload: item});
    Alert.alert('Success', `${item.name} added to cart!`);
  };

  const renderFoodItem = ({item}) => (
    <View style={styles.foodItem}>
      <View style={styles.foodImageContainer}>
        <Image
          source={item.imageUrl}
          style={styles.foodImage}
          defaultSource={require('../assets/images/placeholder-food.png')}
        />
      </View>

      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodCategory}>{categoryName.toLowerCase()}</Text>
        <Text style={styles.foodDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.foodPrice}>₹ {item.price}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToCart(item)}>
        <Text style={styles.addButtonText}>ADD TO CART</Text>
      </TouchableOpacity>
    </View>
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
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{categoryName}</Text>
        <Text style={styles.restaurantLocation}>Block 12</Text>
      </View>

      <Text style={styles.menuHeader}>Menu</Text>

      <FlatList
        data={foodItems}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No items found in this category
            </Text>
          </View>
        }
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  restaurantInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  restaurantLocation: {
    fontSize: 16,
    color: '#d4a017',
    marginTop: 5,
  },
  menuHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
    color: '#c1121f',
  },
  listContainer: {
    padding: 10,
  },
  foodItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  foodImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  foodInfo: {
    marginBottom: 15,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  foodCategory: {
    fontSize: 14,
    color: '#d4a017',
    marginTop: 5,
  },
  foodDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  priceContainer: {
    marginTop: 10,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008000',
  },
  addButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FoodItemsScreen;
