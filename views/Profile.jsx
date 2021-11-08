import * as React from "react";
import base64 from "base-64";
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Profile({ navigation }) {
  const [userinfo, setUserinfo] = React.useState({
    firstName: "",
    goalDailyActivity: "0",
    goalDailyCalories: "0",
    goalDailyCarbohydrates: "0",
    goalDailyFat: "0",
    goalDailyProtein: "0",
    lastName: ""
  });

  const [inputList, setInputList] = React.useState([
    {
      title: "Personal Information",
      subList: [
        {
          title: "First Name",
          key: "firstName",
        },
        {
          title: "Last Name",
          key: "lastName",
        },
      ],
    },
    {
      title: "Fitness Goals",
      subList: [
        {
          title: "Daily Calories (kcal)",
          key: "goalDailyCalories",
        },
        {
          title: "Daily Protein (grams)",
          key: "goalDailyProtein",
        },
        {
          title: "Daily Carbs (grams)",
          key: "goalDailyCarbohydrates",
        },
        {
          title: "Daily Fat (grams)",
          key: "goalDailyFat",
        },
        {
          title: "Daily Activity (mins)",
          key: "goalDailyActivity",
        },
      ],
    },
  ]);

  React.useEffect(() => {
    getInitInfo();
  }, []);

  const getInitInfo = async () => {
    const token = await AsyncStorage.getItem("user_token");
    const username = await AsyncStorage.getItem("username");
    const reponse = await fetch(
      "http://cs571.cs.wisc.edu:5000/users/" + username,
      {
        method: "GET",
        headers: {
          "x-access-token": token,
        },
      }
    );

    let code = reponse.status;
    const result = await reponse.json();

    if (code !== 200) {
      Alert.alert(result.message ? result.message : "network error");
      return;
    }

    setUserinfo(result)
  };

  //set value
  const inputChange = (e, key) => {
    setUserinfo((state) => {
      return {
        ...state,
        [key]: e,
      };
    });
  };

  //save
  const saveProfile = async () => {
    const token = await AsyncStorage.getItem("user_token");
    const username = await AsyncStorage.getItem("username");
    const reponse = await fetch(
      "http://cs571.cs.wisc.edu:5000/users/" + username,
      {
        method: "PUT",
        headers: {
          "x-access-token": token,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          ...userinfo,
          goalDailyActivity: Number(userinfo.goalDailyActivity),
          goalDailyCalories: Number(userinfo.goalDailyCalories),
          goalDailyCarbohydrates:  Number(userinfo.goalDailyCarbohydrates),
          goalDailyFat:  Number(userinfo.goalDailyFat),
          goalDailyProtein:  Number(userinfo.goalDailyProtein)
        })
      }
    );

    let code = reponse.status;
    const result = await reponse.json();

    if (code !== 200) {
      Alert.alert(result.message ? result.message : "network error");
      return;
    }

    Alert.alert(result.message ? result.message : "success");
  };

  const exitProfile = () => {
    navigation.navigate("Login");
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 30,
          paddingTop: 20,
        }}
      >
        <Text style={styles.h1}>About Me</Text>
        <Text style={styles.paragraph}>Let's get to know you</Text>
        <Text style={[styles.paragraph, styles.bottomDistance]}>
          Specify your information below.
        </Text>

        {inputList.map((item) => {
          return (
            <View key={item.title} style={styles.bigWrapper}>
              <Text style={[styles.head, styles.bottomDistance]}>
                {item.title}
              </Text>
              {item.subList.map((subItem) => {
                return (
                  <View key={subItem.key} style={styles.bigWrapper}>
                    <Text style={styles.title}>{subItem.title}</Text>
                    <TextInput
                      value={ String(userinfo[subItem.key])}
                      style={styles.input}
                      placeholder={subItem.title}
                      placeholderTextColor="red"
                      onChangeText={(e) => {
                        inputChange(e, subItem.key);
                      }}
                    />
                  </View>
                );
              })}
            </View>
          );
        })}

        <View style={styles.btnContainer}>
          <Button
            title="SAVE PROFILE"
            style={styles.save}
            onPress={saveProfile}
          ></Button>
          <Button title="EXIT" onPress={exitProfile}></Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 30,
  },
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
  bigWrapper: {
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
  save: {
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 8,
  },
  bottomDistance: {
    marginBottom: 30,
  },
});

export default Profile;
