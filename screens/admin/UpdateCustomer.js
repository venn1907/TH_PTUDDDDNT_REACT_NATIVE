"use client"

import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Text, Button, TextInput, Divider } from "react-native-paper"
import { useState, useEffect } from "react"
import firestore from "@react-native-firebase/firestore"

const UpdateCustomer = ({ navigation, route }) => {
  const { customer } = route.params || {}

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName || "")
      setPhone(customer.phone || "")
      setAddress(customer.address || "")
    } else {
      Alert.alert("Error", "No customer data provided")
      navigation.goBack()
    }
  }, [customer])

  const handleUpdateCustomer = () => {
    if (!customer || !customer.email) {
      Alert.alert("Error", "Invalid customer data")
      return
    }

    if (!fullName.trim()) {
      Alert.alert("Error", "Full name is required")
      return
    }

    // Update customer in Firestore
    const USERS = firestore().collection("USERS")
    USERS.doc(customer.email)
      .update({
        fullName,
        phone,
        address,
      })
      .then(() => {
        Alert.alert("Success", "Customer updated successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
      })
      .catch((error) => {
        console.error("Error updating customer: ", error)
        Alert.alert("Error", "Failed to update customer")
      })
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Update Customer</Text>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              mode="outlined"
              outlineColor="#e0e0e0"
              activeOutlineColor="#f0565c"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={customer?.email || ""}
              editable={false}
              style={[styles.input, styles.disabledInput]}
              mode="outlined"
              outlineColor="#e0e0e0"
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              mode="outlined"
              outlineColor="#e0e0e0"
              activeOutlineColor="#f0565c"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={2}
              style={styles.input}
              mode="outlined"
              outlineColor="#e0e0e0"
              activeOutlineColor="#f0565c"
            />
          </View>
        </View>

        <Button mode="contained" onPress={handleUpdateCustomer} style={styles.updateButton} buttonColor="#f0565c">
          Update Customer
        </Button>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f9f9f9",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  helperText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  updateButton: {
    marginVertical: 20,
    paddingVertical: 5,
  },
})

export default UpdateCustomer
