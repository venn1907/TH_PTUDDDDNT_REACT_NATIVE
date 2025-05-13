"use client"

import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Text, Card, Button, Divider } from "react-native-paper"
import { useState, useEffect } from "react"
import firestore from "@react-native-firebase/firestore"
import { useMyContextController } from "../../store"

const CustomerAppointments = ({ navigation }) => {
  const [controller] = useMyContextController()
  const { userLogin } = controller
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (userLogin && userLogin.email) {
      // Subscribe to appointments collection filtered by user email
      const APPOINTMENTS = firestore().collection("APPOINTMENTS")
      const unsubscribe = APPOINTMENTS.where("customerEmail", "==", userLogin.email)
        .orderBy("appointmentDate", "desc")
        .onSnapshot(
          (snapshot) => {
            const appointmentsList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            setAppointments(appointmentsList)
          },
          (error) => {
            console.error("Error fetching appointments: ", error)
          },
        )

      // Cleanup subscription on unmount
      return () => unsubscribe()
    }
  }, [userLogin])

  const handleUpdateAppointment = (appointment) => {
    navigation.navigate("UpdateAppointment", { appointment })
  }

  const handleDeleteAppointment = (appointmentId) => {
    Alert.alert("Confirm Cancellation", "Are you sure you want to cancel this appointment?", [
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
              Alert.alert("Success", "Appointment cancelled successfully")
            })
            .catch((error) => {
              console.error("Error cancelling appointment: ", error)
              Alert.alert("Error", "Failed to cancel appointment")
            })
        },
        style: "destructive",
      },
    ])
  }

  // Format date function
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)

    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>

      <ScrollView style={styles.appointmentsList}>
        {appointments.length === 0 ? (
          <Text style={styles.noAppointments}>You have no appointments</Text>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} style={styles.appointmentCard}>
              <Card.Content>
                <Text style={styles.serviceName}>{appointment.serviceName}</Text>
                <Divider style={styles.divider} />
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

                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => handleUpdateAppointment(appointment)}
                    style={styles.updateButton}
                    textColor="#f0565c"
                  >
                    Update
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleDeleteAppointment(appointment.id)}
                    style={styles.deleteButton}
                    textColor="red"
                  >
                    Cancel
                  </Button>
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
      return { color: "green" }
    case "cancelled":
      return { color: "red" }
    case "completed":
      return { color: "blue" }
    default:
      return { color: "orange" }
  }
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
  appointmentsList: {
    flex: 1,
  },
  appointmentCard: {
    marginBottom: 15,
    borderRadius: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  updateButton: {
    flex: 1,
    marginRight: 10,
    borderColor: "#f0565c",
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
    borderColor: "red",
  },
  noAppointments: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
})

export default CustomerAppointments
