import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const PaymentSuccessScreen = ({route, navigation}) => {
  const {total, orderId} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Payment Complete</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.successText}>Payment Successfull</Text>

        <View style={styles.checkmarkContainer}>
          <Image
            source={require('../assets/images/check.png')}
            width={80}
            height={80}
          />
        </View>

        <Text style={styles.messageText}>Your payment has been approved!</Text>

        <Text style={styles.amountText}>
          <Text style={styles.currencySymbol}>₹ </Text>
          <Text style={styles.amount}>{Math.floor(total)}</Text>
          <Text style={styles.decimal}>
            .{((total % 1) * 100).toFixed(0).padStart(2, '0')}
          </Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewOrderButton}
          onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.viewOrderText}>See Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.homeButtonText}>Return Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  messageText: {
    fontSize: 18,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  orderIdText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  amountText: {
    marginTop: 20,
  },
  currencySymbol: {
    fontSize: 24,
    color: '#333',
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  decimal: {
    fontSize: 24,
    color: '#333',
  },
  buttonContainer: {
    padding: 20,
  },
  viewOrderButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#c1121f',
  },
  viewOrderText: {
    color: '#c1121f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#c1121f',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentSuccessScreen;
