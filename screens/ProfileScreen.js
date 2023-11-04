import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState("");
    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const response = await axios.get(`${baseUrl}/profile/${userId}`);
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);
  const handleLogOut = async () => {
    await AsyncStorage.removeItem("token");
    ToastAndroid.show("clear token", ToastAndroid.SHORT);
    navigation.replace("Login");
  };
  return (
    <SafeAreaView className="mt-14 p-4">
      <View className="flex-row items-center gap-3">
        <Text className="text-xl">{user.name}</Text>
        <View className="text-xl">
          <Text className="bg-[#d0d0d0] px-5 py-1 rounded-md">Threads.net</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-5 mt-4">
        <Image
          source={require("../assets/user.png")}
          style={{ width: 60, height: 60 }}
        />
        <View>
          <Text className="text-sm font-normal">BTech.</Text>
          <Text className="text-sm font-normal">Movie Buff | Musical Nerd</Text>
          <Text className="text-sm font-normal">Love Yourself</Text>
        </View>
      </View>

      <View>
        <Text className="text-gray-400 text-sm mt-4">
          {user.followers?.length} followers
        </Text>
      </View>

      <View className="flex-row justify-between items-center gap-5 mt-2">
        <TouchableOpacity
          className={` border-[#D0D0D0] p-3 rounded-md bg-white flex-1`}
        >
          <Text className={`text-center font-bold text-black `}>
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogOut}
          className={` border-[#D0D0D0] p-3 rounded-md bg-white flex-1`}
        >
          <Text className={`text-center font-bold text-black `}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
