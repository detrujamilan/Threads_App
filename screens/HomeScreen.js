import { Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  useEffect(() => {
    const fetchUsers = async () => {
      const userId = await AsyncStorage.getItem("userId");
    };
    return () => fetchUsers();
  }, []);
  return (
    <SafeAreaView>
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
