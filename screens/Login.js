import { View, StyleSheet } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { login, useMyContextController } from "../store"
import { useEffect, useState } from "react"

const Login = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController()
  const { userLogin } = controller
  const [email, setEmail] = useState("cdgamer0123@gmail.com")
  const [password, setPassword] = useState("1234567")
  const [hiddenPassword, setHiddenPassword] = useState(true)

  const handleLogin = () => {
    login(dispatch, email, password)
  }

  useEffect(() => {
    console.log(userLogin)
    if (userLogin != null) {
      if (userLogin.role === "admin") {
        navigation.navigate("Admin")
      } else if (userLogin.role === "customer") {
        navigation.navigate("Customer")
      }
    }
  }, [userLogin])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        outlineColor="#f0f0f0"
        activeOutlineColor="#f0565c"
        theme={{ colors: { primary: "#f0565c" } }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={hiddenPassword}
        right={<TextInput.Icon icon="eye" onPress={() => setHiddenPassword(!hiddenPassword)} />}
        style={styles.input}
        mode="outlined"
        outlineColor="#f0f0f0"
        activeOutlineColor="#f0565c"
        theme={{ colors: { primary: "#f0565c" } }}
      />

      <Button mode="contained" onPress={handleLogin} style={styles.loginButton} buttonColor="#f0565c">
        Login
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#f0565c",
    marginBottom: 50,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
})

export default Login
