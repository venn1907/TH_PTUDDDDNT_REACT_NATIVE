import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useAppContext} from '../context/AppContext';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const {resetPassword, loading} = useAppContext();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    const success = await resetPassword(email);

    if (success) {
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for instructions to reset your password.',
        [{text: 'OK', onPress: () => navigation.navigate('Login')}],
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Forgot Password</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.instructionText}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    color: '#4a5af7',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  formContainer: {
    width: '100%',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 30,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#4a5af7',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
