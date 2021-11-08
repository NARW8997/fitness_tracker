import * as React from "react";
import base64 from "base-64";
import { View, Text, TextInput, StyleSheet , Alert } from "react-native";
import { Button } from "react-native-elements";

function Signup({ navigation }) {
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

  const signup = async () => {
    
    const reponse = await fetch("http://cs571.cs.wisc.edu:5000/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        username:userinfo.username,
        password:userinfo.password,
      })
    })

    let code = reponse.status
    const result =await reponse.json()

    if(code !== 200) {
      Alert.alert(result.message ? result.message :"network error")
      return
    }
    
    Alert.alert(result.message)
  };


  const backLogin = ()=>{
    navigation.navigate("Login");
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.head}>Fitness Tracker</Text>
      <Text style={styles.paragraph}>New here?Let's get started!</Text>
      <Text style={styles.paragraph}>Please create an account below</Text>
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
        <Button
          title="CREATE ACCOUNT"
          style={styles.signup}
          onPress={signup}
        ></Button>
        <Button title="NEVERMIND!" onPress={backLogin}></Button>
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
    justifyContent: "space-around",
  },
  signup: {
    marginRight: 12,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default Signup;
