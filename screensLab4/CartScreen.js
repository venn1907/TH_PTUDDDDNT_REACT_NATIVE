import {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useAppContext} from '../context/AppContext';

const CartScreen = ({navigation}) => {
  const {cart, dispatch, calculateCartTotal, saveOrder, user} = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIncreaseQuantity = item => {
    dispatch({
      type: 'UPDATE_CART_ITEM',
      payload: {id: item.id, quantity: item.quantity + 1},
    });
  };

  const handleDecreaseQuantity = item => {
    if (item.quantity > 1) {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: {id: item.id, quantity: item.quantity - 1},
      });
    } else {
      dispatch({type: 'REMOVE_FROM_CART', payload: item.id});
    }
  };

  const handleProceedToPayment = async () => {
    if (cart.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Please add items to your cart before proceeding to payment.',
      );
      return;
    }

    if (!user) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to proceed with the payment.',
      );
      return;
    }

    try {
      setIsProcessing(true);

      const {total} = calculateCartTotal();

      const order = await saveOrder(cart, total);

      navigation.navigate('PaymentSuccess', {
        total: total,
        orderId: order.id,
      });
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing your payment.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCartItem = ({item}) => (
    <View style={styles.cartItem}>
      <View style={styles.itemRow}>
        <Image
          source={item.imageUrl}
          style={styles.itemImage}
          defaultSource={require('../assets/images/placeholder-food.png')}
        />
        <Text style={styles.itemName}>{item.name}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleDecreaseQuantity(item)}>
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>

        <View style={styles.quantityValue}>
          <Text>{item.quantity}</Text>
        </View>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleIncreaseQuantity(item)}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>

        <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
      </View>
    </View>
  );

  const {itemsTotal, taxes, deliveryCharges, discount, total} =
    calculateCartTotal();

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        }
      />

      {cart.length > 0 && (
        <View style={styles.billContainer}>
          <Text style={styles.billTitle}>Bill Receipt</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Items Total</Text>
            <Text style={styles.billValue}>{itemsTotal.toFixed(2)} ₹</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Offer Discount</Text>
            <Text style={styles.billValue}>-{discount.toFixed(2)} ₹</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes (8%)</Text>
            <Text style={styles.billValue}>{taxes.toFixed(2)} ₹</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Charges</Text>
            <Text style={styles.billValue}>{deliveryCharges.toFixed(2)} ₹</Text>
          </View>

          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Pay</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} ₹</Text>
          </View>
        </View>
      )}

      <View style={styles.checkoutContainer}>
        {cart.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalAmount}>₹ {total.toFixed(2)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            (cart.length === 0 || isProcessing) && styles.disabledButton,
          ]}
          onPress={handleProceedToPayment}
          disabled={cart.length === 0 || isProcessing}>
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.checkoutButtonText}>Proceed To Pay</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#999',
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#333',
  },
  quantityValue: {
    width: 40,
    height: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemPrice: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
  },
  billContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 14,
    color: '#333',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: '#008000',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default CartScreen;
