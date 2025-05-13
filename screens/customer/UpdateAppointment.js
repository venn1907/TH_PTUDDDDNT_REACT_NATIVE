"use client"

import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Text, Button, TextInput, Divider } from "react-native-paper"
import { useState, useEffect } from "react"
import firestore from "@react-native-firebase/firestore"
import DateTimePicker from "@react-native-community/datetimepicker"

const UpdateAppointment = ({ navigation, route }) => {
  const { appointment } = route.params || {}

  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (appointment) {
      // Set date from appointment
      if (appointment.appointmentDate) {
        const appointmentDate = appointment.appointmentDate.toDate
          ? appointment.appointmentDate.toDate()
          : new Date(appointment.appointmentDate)
        setDate(appointmentDate)
      }

      // Set notes from appointment
      setNotes(appointment.notes || "")
    } else {
      Alert.alert("Error", "No appointment data provided")
      navigation.goBack()
    }
  }, [appointment])

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDatePicker(false)
    setDate(currentDate)
  }

  const handleUpdateAppointment = () => {
    if (!appointment || !appointment.id) {
      Alert.alert("Error", "Invalid appointment data")
      return
    }

    // Update appointment in Firestore
    const APPOINTMENTS = firestore().collection("APPOINTMENTS")
    APPOINTMENTS.doc(appointment.id)
      .update({
        appointmentDate: date,
        notes: notes,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Success", "Appointment updated successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
      })
      .catch((error) => {
        console.error("Error updating appointment: ", error)
        Alert.alert("Error", "Failed to update appointment")
      })
  }

  // Format date for display
  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Update Appointment</Text>

        {appointment && (
          <>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceInfoLabel}>Service:</Text>
              <Text style={styles.serviceInfoValue}>{appointment.serviceName}</Text>
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.serviceInfoLabel}>Price:</Text>
              <Text style={styles.serviceInfoValue}>{appointment.price?.toLocaleString() || 0} đ</Text>
            </View>
          </>
        )}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Update Date & Time</Text>
          <Divider style={styles.divider} />

          <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.dateButton} textColor="#f0565c">
            {formatDate(date)}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Divider style={styles.divider} />

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests or notes"
            multiline
            numberOfLines={4}
            style={styles.notesInput}
            mode="outlined"
            outlineColor="#e0e0e0"
            activeOutlineColor="#f0565c"
          />
        </View>

        <Button mode="contained" onPress={handleUpdateAppointment} style={styles.updateButton} buttonColor="#f0565c">
          Update Appointment
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
  serviceInfo: {
    flexDirection: "row",
    marginBottom: 10,
  },
  serviceInfoLabel: {
    fontWeight: "bold",
    width: 80,
  },
  serviceInfoValue: {
    flex: 1,
  },
  formSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 10,
  },
  dateButton: {
    borderColor: "#f0565c",
  },
  notesInput: {
    backgroundColor: "#f9f9f9",
  },
  updateButton: {
    marginVertical: 20,
    paddingVertical: 5,
  },
})

export default UpdateAppointment
