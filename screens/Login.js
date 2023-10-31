import {
  View,
  Text,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter all required fields");
    }
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
        <Text className="font-medium text-base">Login to Your Account</Text>
      </View>
      <KeyboardAvoidingView>
        <View className="pt-10">
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
          <View className="flex-row justify-between items-center pt-3">
            <Text> Keep me logged in </Text>
            <Text className="text-[#007FFF] font-medium"> Forgot Password</Text>
          </View>
          <View className="mt-12">
            <Pressable
              className="w-[200px] bg-black flex m-auto p-[15px] rounded-md"
              onPress={handleLogin}
            >
              <Text className="text-white text-center text-base">Login In</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text className="text-center pt-4">
                Don't have an account? Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
