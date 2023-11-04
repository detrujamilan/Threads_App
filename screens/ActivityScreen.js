import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../utils/utils";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("People");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  console.log("userId",userId)
  const [requsetSent, setRequsetSent] = useState(false);

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
            setUsers(response.data);
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    };
    return () => fetchUsers();
  }, []);

  const handleFollow = async (currentuserId, selectedUserId) => {
    try {
      const response = await fetch(`${baseUrl}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentuserId,
          selectedUserId,
        }),
      });
      if (response.ok) {
        setRequsetSent(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

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
        <View className="pt-5 ">
          {users?.map((item, id) => {
            return (
              <>
                <View
                  key={id}
                  className="flex-row px-2 items-center justify-between py-2"
                >
                  <View className="flex-row items-center gap-3">
                    <Image
                      source={require("../assets/user.png")}
                      style={{ width: 50, height: 50 }}
                    />
                    <Text className="text-base font-medium">{item.name}</Text>
                  </View>

                  {requsetSent || item?.followers?.includes(userId) ? (
                    <TouchableOpacity>
                      <Text className="cursor-pointer  px-8 py-3 border-[#D0D0D0] text-black bg-opacity-80  rounded-sm hover:bg-opacity-70 transition font-semibold shadow-md">
                        Following
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleFollow(userId, item.id)}
                    >
                      <Text className="cursor-pointer  px-8 py-3 border-[#D0D0D0] text-black bg-opacity-80  rounded-sm hover:bg-opacity-70 transition font-semibold shadow-md">
                        Follow
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ActivityScreen;
