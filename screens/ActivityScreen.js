import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../utils/utils";
import { UserType } from "../UserContext";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("People");
  const [content, setContent] = useState("");
  const [users, setUsers] = useState("");
  const { userId, setUserId } = useContext(UserType);

  const handleSelectedButton = (buttonName) => {
    setSelectedButton(buttonName);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const decodedToken = jwtDecode(token, { header: true });
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`${baseUrl}/user/${userId}`)
        .then((response) => {
          console.log(response);
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
    return () => fetchUsers();
  }, []);
  return (
    <SafeAreaView className="mt-7">
      <View className="p-[10px]">
        <Text className="font-bold text-lg">Activity</Text>
        <View className="flex-row items-center justify-between gap-3 mt-1">
          <TouchableOpacity
            onPress={() => handleSelectedButton("People")}
            className={`flex-1 border-[#D0D0D0] p-3 rounded-md ${
              selectedButton === "People" ? "bg-black" : "bg-white"
            }`}
          >
            <Text
              className={`text-center font-bold ${
                selectedButton === "People" ? "text-white" : "text-black"
              }`}
            >
              People
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelectedButton("All")}
            className={`flex-1 border-[#D0D0D0] p-3 rounded-md ${
              selectedButton === "All" ? "bg-black" : "bg-white"
            }`}
          >
            <Text
              className={`text-center font-bold ${
                selectedButton === "All" ? "text-white" : "text-black"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelectedButton("Request")}
            className={`flex-1 border-[#D0D0D0] p-3 rounded-md ${
              selectedButton === "Request" ? "bg-black" : "bg-white"
            }`}
          >
            <Text
              className={`text-center font-bold ${
                selectedButton === "Request" ? "text-white" : "text-black"
              }`}
            >
              Request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ActivityScreen;
