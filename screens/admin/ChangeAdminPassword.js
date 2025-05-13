"use client"

import { StyleSheet, View, Alert } from "react-native"
import { Text, Button, TextInput, Divider } from "react-native-paper"
import { useState } from "react"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { useMyContextController } from "../../store"

const ChangeAdminPassword = ({ navigation }) => {
  const [controller] = useMyContextController()
  const { userLogin } = controller

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required")
      return
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match")
      return
    }

    try {
      // Re-authenticate user
      const user = auth().currentUser
      const credential = auth.EmailAuthProvider.credential(userLogin.email, currentPassword)

      await user.reauthenticateWithCredential(credential)

      // Update password
      await user.updatePassword(newPassword)

      // Update password in Firestore
      const USERS = firestore().collection("USERS")
      await USERS.doc(userLogin.email).update({
        password: newPassword,
      })

      Alert.alert("Success", "Password changed successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      console.error("Error changing password: ", error)

      if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Current password is incorrect")
      } else {
        Alert.alert("Error", "Failed to change password. Please try again.")
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Password Information</Text>
        <Divider style={styles.divider} />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password *</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            style={styles.input}
            mode="outlined"
            outlineColor="#e0e0e0"
            activeOutlineColor="#f0565c"
            right={
              <TextInput.Icon
                icon={showCurrentPassword ? "eye-off" : "eye"}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password *</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            style={styles.input}
            mode="outlined"
            outlineColor="#e0e0e0"
            activeOutlineColor="#f0565c"
            right={
              <TextInput.Icon
                icon={showNewPassword ? "eye-off" : "eye"}
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            }
          />
          <Text style={styles.helperText}>Password must be at least 6 characters</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password *</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            mode="outlined"
            outlineColor="#e0e0e0"
            activeOutlineColor="#f0565c"
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
        </View>
      </View>

      <Button mode="contained" onPress={handleChangePassword} style={styles.changeButton} buttonColor="#f0565c">
        Change Password
      </Button>
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
  helperText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  changeButton: {
    marginVertical: 20,
    paddingVertical: 5,
  },
})

export default ChangeAdminPassword
