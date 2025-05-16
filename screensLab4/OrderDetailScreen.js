import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';

const OrderDetailScreen = ({route, navigation}) => {
  const {order} = route.params;

  const formatDate = date => {
    try {
      return format(new Date(date), "dd MMMM yyyy 'at' HH:mm", {locale: vi});
    } catch (error) {
      return 'Undefined';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Detail</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created At:</Text>
          <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, styles.statusCompleted]} />
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total:</Text>
          <Text style={styles.totalValue}>₹ {order.total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The dishes have been placed</Text>
        {order.items.map(item => (
          <View key={item.id} style={styles.itemContainer}>
            <Image
              source={item.imageUrl}
              style={styles.itemImage}
              defaultSource={require('../assets/images/placeholder-food.png')}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹ {item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.itemQuantity}>
              <Text style={styles.quantityText}>x{item.quantity}</Text>
              <Text style={styles.itemTotal}>
                ₹ {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>
            ₹{' '}
            {order.items
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxes (8%)</Text>
          <Text style={styles.summaryValue}>
            ₹{' '}
            {(
              order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              ) * 0.08
            ).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Charges</Text>
          <Text style={styles.summaryValue}>₹ 30.00</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Payment Total</Text>
          <Text style={styles.grandTotal}>₹ {order.total.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.orderAgainButton}
        onPress={() => navigation.navigate('Categories')}>
        <Text style={styles.orderAgainText}>Reorder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  orderId: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    color: '#4CAF50',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemQuantity: {
    alignItems: 'flex-end',
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  orderAgainButton: {
    backgroundColor: '#c1121f',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailScreen;
