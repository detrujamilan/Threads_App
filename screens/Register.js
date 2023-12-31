import {
  View,
  Text,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { baseUrl } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  const [isName, setIsName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = async () => {
    const data = {
      name: isName,
      email: email,
      password: password,
    };
    axios
      .post(`${baseUrl}/register`, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show("Registration Successful", ToastAndroid.SHORT);
        }
        if (response.status === 400) {
          ToastAndroid.show("user already registered", ToastAndroid.SHORT);
        }
        const token = response.data.verificationToken;
        AsyncStorage.setItem("token", token);
        navigation.navigate("Main")
        setIsName("");
        setPassword("");
        setEmail("");
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(`Registration failed ${error}`, ToastAndroid.SHORT);
      });
  };
  return (
    <SafeAreaView className="flex-1 items-center">
      <View className="mt-20">
        <Image
          style={{ width: 80, height: 100, resizeMode: "stretch" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>
      <View className="pt-5">
        <Text className="font-medium text-base">Register to Your Account</Text>
      </View>
      <KeyboardAvoidingView>
        <View className="pt-10">
          <View className="pb-8">
            <View className="flex-row border rounded-md space-x-3 items-center">
              <Ionicons
                name="person"
                style={{ marginLeft: 8 }}
                size={24}
                color="grey"
              />
              <TextInput
                value={isName}
                placeholderTextColor={"black"}
                placeholder="Enter Your Name "
                className="w-[300px] p-2 text-base"
                onChangeText={(text) => {
                  setIsName(text);
                }}
              />
            </View>
          </View>
          <View className="flex-row border rounded-md space-x-3 items-center">
            <MaterialIcons
              name="email"
              style={{ marginLeft: 8 }}
              size={24}
              color="grey"
            />
            <TextInput
              value={email}
              placeholderTextColor={"black"}
              placeholder="Enter Your Email "
              className="w-[300px] p-2 text-base"
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
          </View>
          <View className="pt-8">
            <View className="flex-row border rounded-md space-x-3 items-center">
              <AntDesign
                name="lock"
                style={{ marginLeft: 8 }}
                size={24}
                color="grey"
              />
              <TextInput
                secureTextEntry={true}
                value={password}
                placeholderTextColor={"black"}
                placeholder="Enter Your Email "
                className="w-[300px] p-2 text-base"
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />
            </View>
          </View>
          <View className="mt-12">
            <Pressable
              className="w-[200px] bg-black flex m-auto p-[15px] rounded-md"
              onPress={handleRegister}
            >
              <Text className="text-white text-center text-base">Register</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text className="text-center pt-4">
                Already have an account? Sign in
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
