import * as React from "react";
import base64 from "base-64";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from "react-native-elements";

function LoginScreen({ navigation }) {
  const [userinfo, setUserinfo] = React.useState({
    username: "",
    password: "",
  });

  //set value
  const inputChange = (e, key) => {
    setUserinfo((state) => {
      return {
        ...state,
        [key]: e,
      };
    });
  };

  //login
  const login = async () => {
    const reponse = await fetch("http://cs571.cs.wisc.edu:5000/login", {
      method: "GET",
      headers: {
        Authorization:
          "Basic " + base64.encode(userinfo.username + ":" + userinfo.password),
      },
    });
  
    let code = reponse.status
    const result =await reponse.json()
    
    if(code !== 200) {
      Alert.alert(result.message ? result.message :"network error")
      return
    }
    
    await AsyncStorage.setItem(
      'user_token',
      result.token
    )

    await AsyncStorage.setItem(
      'username',
      userinfo.username
    )
    
    navigation.navigate("Profile");
  };

  const toSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.head}>Fitness Tracker</Text>
      <Text style={styles.paragraph}>
        Welcome Please login or signup to continue
      </Text>
      <TextInput
        value={userinfo.username}
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="red"
        onChangeText={(e) => {
          inputChange(e, "username");
        }}
      />
      <TextInput
        value={userinfo.password}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="red"
        onChangeText={(e) => {
          inputChange(e, "password");
        }}
        secureTextEntry={true}
      />
      <View style={styles.btnContainer}>
        <Button title="LOGIN" onPress={login}></Button>
        <Button title="SIGNUP" onPress={toSignup}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "red",
    width: 200,
    height: 35,
    marginBottom: 28,
    paddingLeft: 8,
  },
  btnContainer: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "red",
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default LoginScreen;
