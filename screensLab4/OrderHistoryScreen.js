import {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useAppContext} from '../context/AppContext';
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';

const OrderHistoryScreen = ({navigation}) => {
  const {orders, fetchUserOrders, user, loading} = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserOrders(user.uid);
    }
  }, [user]);

  const handleRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await fetchUserOrders(user.uid);
      setRefreshing(false);
    }
  };

  const formatDate = date => {
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm', {locale: vi});
    } catch (error) {
      return 'Undefined';
    }
  };

  const renderOrderItem = ({item}) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetail', {order: item})}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
      </View>

      <View style={styles.orderSummary}>
        <Text style={styles.itemCount}>{item.items.length} dishes</Text>
        <Text style={styles.orderTotal}>₹ {item.total.toFixed(2)}</Text>
      </View>

      <View style={styles.orderItems}>
        {item.items.slice(0, 3).map(foodItem => (
          <View key={foodItem.id} style={styles.foodItem}>
            <Image
              source={foodItem.imageUrl}
              style={styles.foodImage}
              defaultSource={require('../assets/images/placeholder-food.png')}
            />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{foodItem.name}</Text>
              <Text style={styles.foodQuantity}>x{foodItem.quantity}</Text>
            </View>
          </View>
        ))}
        {item.items.length > 3 && (
          <Text style={styles.moreItems}>
            +{item.items.length - 3} other items
          </Text>
        )}
      </View>

      <View style={styles.orderStatus}>
        <View style={[styles.statusIndicator, styles.statusCompleted]} />
        <Text style={styles.statusText}>Completed</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c1121f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/images/placeholder-food.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>You do not have any orders</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.shopButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  orderItems: {
    marginBottom: 15,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  foodInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 14,
    color: '#333',
  },
  foodQuantity: {
    fontSize: 14,
    color: '#666',
  },
  moreItems: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#c1121f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderHistoryScreen;
