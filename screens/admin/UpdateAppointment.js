"use client"

import { StyleSheet, View, ScrollView, Alert, Platform } from "react-native"
import { Text, Button, TextInput, Divider, Chip } from "react-native-paper"
import { useState, useEffect } from "react"
import firestore from "@react-native-firebase/firestore"
import DateTimePicker from "@react-native-community/datetimepicker"

const UpdateAppointment = ({ navigation, route }) => {
  const { appointment } = route.params || {}

  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("Pending")

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

      // Set status from appointment
      setStatus(appointment.status || "Pending")
    } else {
      Alert.alert("Error", "No appointment data provided")
      navigation.goBack()
    }
  }, [appointment])

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false)
      return
    }

    if (selectedDate) {
      const currentDate = new Date(date)
      const newDate = new Date(selectedDate)

      // Only update the date part, keep the time part
      currentDate.setFullYear(newDate.getFullYear())
      currentDate.setMonth(newDate.getMonth())
      currentDate.setDate(newDate.getDate())

      setDate(currentDate)
    }

    if (Platform.OS === "android") {
      setShowDatePicker(false)
    }
  }

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed") {
      setShowTimePicker(false)
      return
    }

    if (selectedTime) {
      const currentDate = new Date(date)
      const newTime = new Date(selectedTime)

      // Only update the time part, keep the date part
      currentDate.setHours(newTime.getHours())
      currentDate.setMinutes(newTime.getMinutes())

      setDate(currentDate)
    }

    if (Platform.OS === "android") {
      setShowTimePicker(false)
    }
  }

  const showDatePickerModal = () => {
    setShowDatePicker(true)
  }

  const showTimePickerModal = () => {
    setShowTimePicker(true)
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
        status: status,
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
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
  }

  // Format time for display
  const formatTime = (date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
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
              <Text style={styles.serviceInfoLabel}>Customer:</Text>
              <Text style={styles.serviceInfoValue}>{appointment.customerName}</Text>
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.serviceInfoLabel}>Email:</Text>
              <Text style={styles.serviceInfoValue}>{appointment.customerEmail}</Text>
            </View>

            <View style={styles.serviceInfo}>
              <Text style={styles.serviceInfoLabel}>Price:</Text>
              <Text style={styles.serviceInfoValue}>{appointment.price?.toLocaleString() || 0} đ</Text>
            </View>
          </>
        )}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <Divider style={styles.divider} />

          <View style={styles.statusContainer}>
            <Chip
              selected={status === "Pending"}
              onPress={() => setStatus("Pending")}
              style={styles.statusChip}
              selectedColor="#f0565c"
            >
              Pending
            </Chip>
            <Chip
              selected={status === "Confirmed"}
              onPress={() => setStatus("Confirmed")}
              style={styles.statusChip}
              selectedColor="#f0565c"
            >
              Confirmed
            </Chip>
            <Chip
              selected={status === "Completed"}
              onPress={() => setStatus("Completed")}
              style={styles.statusChip}
              selectedColor="#f0565c"
            >
              Completed
            </Chip>
            <Chip
              selected={status === "Cancelled"}
              onPress={() => setStatus("Cancelled")}
              style={styles.statusChip}
              selectedColor="#f0565c"
            >
              Cancelled
            </Chip>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Update Date & Time</Text>
          <Divider style={styles.divider} />

          <View style={styles.dateTimeContainer}>
            <Button
              mode="outlined"
              onPress={showDatePickerModal}
              style={styles.dateButton}
              textColor="#f0565c"
              icon="calendar"
            >
              {formatDate(date)}
            </Button>

            <Button
              mode="outlined"
              onPress={showTimePickerModal}
              style={styles.timeButton}
              textColor="#f0565c"
              icon="clock"
            >
              {formatTime(date)}
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={date}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
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
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statusChip: {
    margin: 5,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    flex: 1,
    marginRight: 5,
    borderColor: "#f0565c",
  },
  timeButton: {
    flex: 1,
    marginLeft: 5,
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
