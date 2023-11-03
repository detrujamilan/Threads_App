import { View, Text } from "react-native";
import React from "react";

const UserList = ({ item }) => {
  return (
    <View className="flex-1 fle-col">
      <Text className="text-black">{item?.name}</Text>
    </View>
  );
};

export default UserList;
