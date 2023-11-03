import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../utils/utils";
import { UserType } from "../UserContext";
import UserList from "../UserList";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("People");
  const [users, setUsers] = useState([]);
  const [userId,setUserId] = useState("")

  const handleSelectedButton = (buttonName) => {
    setSelectedButton(buttonName);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const userId = await AsyncStorage.getItem("userId");
      
      if (userId) {
        setUserId(userId);
        axios
          .get(`${baseUrl}/user/${userId}`)
          .then((response) => {
            console.log("response",response.data);
            setUsers(response.data);
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
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
        <View>
          <Text className="pt-5">
            {
              users.map((item,id)=>{
                return <UserList item={item}  key={id}/>
              })
            }
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ActivityScreen;
