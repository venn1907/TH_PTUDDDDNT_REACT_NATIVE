"use client"

import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native"
import { Text, Card, FAB, Searchbar } from "react-native-paper"
import { useState, useEffect } from "react"
import firestore from "@react-native-firebase/firestore"
import { useMyContextController } from "../../store"

const CustomerServices = ({ navigation }) => {
  const [controller] = useMyContextController()
  const { userLogin } = controller
  const [services, setServices] = useState([])

  useEffect(() => {
    // Subscribe to services collection
    const SERVICES = firestore().collection("SERVICES")
    const unsubscribe = SERVICES.orderBy("createdAt", "desc").onSnapshot(
      (snapshot) => {
        const servicesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setServices(servicesList)
      },
      (error) => {
        console.error("Error fetching services: ", error)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleServicePress = (serviceId) => {
    navigation.navigate("ServiceDetail", { serviceId })
  }

  const handleFindService = () => {
    navigation.navigate("FindService")
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{userLogin?.fullName || "Customer"}</Text>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          <Text style={styles.logoK}>K</Text>
          <Text style={styles.logoAMI}>AMI </Text>
          <Text style={styles.logoSPA}>SPA</Text>
        </Text>
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleFindService}>
        <Searchbar
          placeholder="Find services..."
          editable={false}
          onPressIn={handleFindService}
          style={styles.searchBar}
        />
      </TouchableOpacity>

      {/* Service List */}
      <View style={styles.serviceListHeader}>
        <Text style={styles.serviceListTitle}>Danh sách dịch vụ</Text>
      </View>

      <ScrollView style={styles.serviceList}>
        {services.map((service) => (
          <TouchableOpacity key={service.id} onPress={() => handleServicePress(service.id)}>
            <Card style={styles.serviceCard}>
              <Card.Content style={styles.serviceCardContent}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price?.toLocaleString() || 0} đ</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Book Appointment FAB */}
      <FAB
        style={styles.fab}
        icon="calendar-plus"
        color="white"
        onPress={() => navigation.navigate("BookAppointment")}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#f0565c",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoK: {
    color: "#f0565c",
  },
  logoAMI: {
    color: "#f0565c",
  },
  logoSPA: {
    color: "#f0565c",
  },
  searchButton: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    elevation: 2,
  },
  serviceListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  serviceListTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceList: {
    paddingHorizontal: 20,
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#f0565c",
  },
})

export default CustomerServices
