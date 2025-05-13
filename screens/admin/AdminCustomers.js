"use client"

import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Text, Card, Searchbar, Divider, IconButton, Avatar } from "react-native-paper"
import { useState, useEffect } from "react"
import firestore from "@react-native-firebase/firestore"

const AdminCustomers = ({ navigation }) => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Subscribe to users collection
    const USERS = firestore().collection("USERS")
    const unsubscribe = USERS.where("role", "==", "customer").onSnapshot(
      (snapshot) => {
        const customersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setCustomers(customersList)
        filterCustomers(customersList, searchQuery)
      },
      (error) => {
        console.error("Error fetching customers: ", error)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const filterCustomers = (customers, query) => {
    if (!query) {
      setFilteredCustomers(customers)
      return
    }

    const filtered = customers.filter(
      (customer) =>
        customer.fullName?.toLowerCase().includes(query.toLowerCase()) ||
        customer.email?.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone?.includes(query),
    )
    setFilteredCustomers(filtered)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    filterCustomers(customers, query)
  }

  const handleUpdateCustomer = (customer) => {
    navigation.navigate("UpdateCustomer", { customer })
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search customers..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView style={styles.customersList}>
        {filteredCustomers.length === 0 ? (
          <Text style={styles.noCustomers}>No customers found</Text>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.email} style={styles.customerCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.customerInfo}>
                    <Avatar.Icon size={40} icon="account" style={styles.avatar} />
                    <View>
                      <Text style={styles.customerName}>{customer.fullName}</Text>
                      <Text style={styles.customerEmail}>{customer.email}</Text>
                    </View>
                  </View>
                  <View style={styles.actionButtons}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      iconColor="#f0565c"
                      onPress={() => handleUpdateCustomer(customer)}
                    />
                  </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text>{customer.phone || "N/A"}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text>{customer.address || "N/A"}</Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  searchBar: {
    marginBottom: 15,
    elevation: 2,
  },
  customersList: {
    flex: 1,
  },
  customerCard: {
    marginBottom: 15,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    backgroundColor: "#f0565c",
    marginRight: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  customerEmail: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
  },
  divider: {
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 5,
    width: 80,
  },
  noCustomers: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
})

export default AdminCustomers
