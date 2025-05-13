"use client"

import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native"
import { Text, Card, Searchbar } from "react-native-paper"
import { useState, useEffect } from "react"
import firestore from "@react-native-firebase/firestore"

const FindService = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])

  useEffect(() => {
    // Fetch all services
    const SERVICES = firestore().collection("SERVICES")
    const unsubscribe = SERVICES.orderBy("name").onSnapshot(
      (snapshot) => {
        const servicesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setServices(servicesList)
        setFilteredServices(servicesList)
      },
      (error) => {
        console.error("Error fetching services: ", error)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Filter services based on search query
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (query.trim() === "") {
      setFilteredServices(services)
    } else {
      const filtered = services.filter((service) => service.name.toLowerCase().includes(query.toLowerCase()))
      setFilteredServices(filtered)
    }
  }

  const handleServicePress = (serviceId) => {
    navigation.navigate("ServiceDetail", { serviceId })
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search services..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView style={styles.serviceList}>
        {filteredServices.length === 0 ? (
          <Text style={styles.noResults}>No services found</Text>
        ) : (
          filteredServices.map((service) => (
            <TouchableOpacity key={service.id} onPress={() => handleServicePress(service.id)}>
              <Card style={styles.serviceCard}>
                <Card.Content style={styles.serviceCardContent}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>{service.price?.toLocaleString() || 0} đ</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
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
    padding: 20,
  },
  searchBar: {
    marginBottom: 20,
    elevation: 2,
  },
  serviceList: {
    flex: 1,
  },
  serviceCard: {
    marginBottom: 10,
    borderRadius: 10,
  },
  serviceCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    flex: 1,
    fontSize: 16,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noResults: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
})

export default FindService
