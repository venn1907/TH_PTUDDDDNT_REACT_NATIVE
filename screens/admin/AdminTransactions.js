"use client"

import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from "react-native"
import { Text, Card, Button, Divider, Chip, Searchbar, Menu, IconButton } from "react-native-paper"
import { useState, useEffect } from "react"
import firestore from "@react-native-firebase/firestore"

const AdminTransactions = ({ navigation }) => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    // Subscribe to appointments collection
    const APPOINTMENTS = firestore().collection("APPOINTMENTS")
    const unsubscribe = APPOINTMENTS.orderBy("appointmentDate", "desc").onSnapshot(
      (snapshot) => {
        const appointmentsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setAppointments(appointmentsList)
        filterAppointments(appointmentsList, searchQuery, statusFilter)
      },
      (error) => {
        console.error("Error fetching appointments: ", error)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const filterAppointments = (appointments, query, status) => {
    let filtered = [...appointments]

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.customerName?.toLowerCase().includes(query.toLowerCase()) ||
          appointment.serviceName?.toLowerCase().includes(query.toLowerCase()) ||
          appointment.customerEmail?.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((appointment) => appointment.status?.toLowerCase() === status.toLowerCase())
    }

    setFilteredAppointments(filtered)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    filterAppointments(appointments, query, statusFilter)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    filterAppointments(appointments, searchQuery, status)
  }

  const handleUpdateStatus = (appointment, newStatus) => {
    const APPOINTMENTS = firestore().collection("APPOINTMENTS")
    APPOINTMENTS.doc(appointment.id)
      .update({
        status: newStatus,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Success", `Appointment ${newStatus.toLowerCase()} successfully`)
      })
      .catch((error) => {
        console.error("Error updating appointment status: ", error)
        Alert.alert("Error", "Failed to update appointment status")
      })
  }

  const handleUpdateAppointment = (appointment) => {
    navigation.navigate("UpdateAppointment", { appointment })
  }

  const handleDeleteAppointment = (appointmentId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this appointment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          const APPOINTMENTS = firestore().collection("APPOINTMENTS")
          APPOINTMENTS.doc(appointmentId)
            .delete()
            .then(() => {
              Alert.alert("Success", "Appointment deleted successfully")
            })
            .catch((error) => {
              console.error("Error deleting appointment: ", error)
              Alert.alert("Error", "Failed to delete appointment")
            })
        },
        style: "destructive",
      },
    ])
  }

  const openMenu = (appointment) => {
    setSelectedAppointment(appointment)
    setMenuVisible(true)
  }

  // Format date function
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)

    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search appointments..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView horizontal style={styles.filterContainer}>
        <Chip
          selected={statusFilter === "all"}
          onPress={() => handleStatusFilter("all")}
          style={styles.filterChip}
          selectedColor="#f0565c"
        >
          All
        </Chip>
        <Chip
          selected={statusFilter === "pending"}
          onPress={() => handleStatusFilter("pending")}
          style={styles.filterChip}
          selectedColor="#f0565c"
        >
          Pending
        </Chip>
        <Chip
          selected={statusFilter === "confirmed"}
          onPress={() => handleStatusFilter("confirmed")}
          style={styles.filterChip}
          selectedColor="#f0565c"
        >
          Confirmed
        </Chip>
        <Chip
          selected={statusFilter === "completed"}
          onPress={() => handleStatusFilter("completed")}
          style={styles.filterChip}
          selectedColor="#f0565c"
        >
          Completed
        </Chip>
        <Chip
          selected={statusFilter === "cancelled"}
          onPress={() => handleStatusFilter("cancelled")}
          style={styles.filterChip}
          selectedColor="#f0565c"
        >
          Cancelled
        </Chip>
      </ScrollView>

      <ScrollView style={styles.appointmentsList}>
        {filteredAppointments.length === 0 ? (
          <Text style={styles.noAppointments}>No appointments found</Text>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} style={styles.appointmentCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text style={styles.serviceName}>{appointment.serviceName}</Text>
                  <Menu
                    visible={menuVisible && selectedAppointment?.id === appointment.id}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                      <TouchableOpacity onPress={() => openMenu(appointment)}>
                        <IconButton icon="dots-vertical" size={20} />
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                        setMenuVisible(false)
                        handleUpdateAppointment(appointment)
                      }}
                      title="Update"
                    />
                    <Menu.Item
                      onPress={() => {
                        setMenuVisible(false)
                        handleDeleteAppointment(appointment.id)
                      }}
                      title="Delete"
                    />
                  </Menu>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Customer:</Text>
                  <Text>{appointment.customerName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text>{appointment.customerEmail}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date & Time:</Text>
                  <Text>{formatDate(appointment.appointmentDate)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={getStatusStyle(appointment.status)}>{appointment.status || "Pending"}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price:</Text>
                  <Text>{appointment.price?.toLocaleString() || 0} đ</Text>
                </View>

                {appointment.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notes}>{appointment.notes}</Text>
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  {appointment.status?.toLowerCase() === "pending" && (
                    <Button
                      mode="contained"
                      onPress={() => handleUpdateStatus(appointment, "Confirmed")}
                      style={styles.confirmButton}
                      buttonColor="green"
                    >
                      Confirm
                    </Button>
                  )}

                  {appointment.status?.toLowerCase() === "confirmed" && (
                    <Button
                      mode="contained"
                      onPress={() => handleUpdateStatus(appointment, "Completed")}
                      style={styles.completeButton}
                      buttonColor="blue"
                    >
                      Complete
                    </Button>
                  )}

                  {appointment.status?.toLowerCase() !== "cancelled" && (
                    <Button
                      mode="outlined"
                      onPress={() => handleUpdateStatus(appointment, "Cancelled")}
                      style={styles.cancelButton}
                      textColor="red"
                    >
                      Cancel
                    </Button>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  )
}

// Helper function to get status style
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return { color: "green", fontWeight: "bold" }
    case "cancelled":
      return { color: "red", fontWeight: "bold" }
    case "completed":
      return { color: "blue", fontWeight: "bold" }
    default:
      return { color: "orange", fontWeight: "bold" }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  searchBar: {
    marginBottom: 10,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  filterChip: {
    marginRight: 8,
  },
  appointmentsList: {
    flex: 1,
  },
  appointmentCard: {
    marginBottom: 15,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
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
    width: 100,
  },
  notesContainer: {
    marginTop: 10,
  },
  notesLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  notes: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  confirmButton: {
    flex: 1,
    marginRight: 5,
  },
  completeButton: {
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 5,
    borderColor: "red",
  },
  noAppointments: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
})

export default AdminTransactions
