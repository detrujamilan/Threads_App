import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../utils/utils";


const CreateScreen = () => {
  const [content, setContent] = useState("");

  const handleSharePost = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const postData = {
      userId,
    };

    if (content) {
      postData.content = content;
    }

    axios
      .post(`${baseUrl}/create-post`, postData)
      .then((response) => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        setContent("");
      })
      .catch((error) => {
        console.error("error creating post", error);
      });
  };
  return (
    <SafeAreaView className="flex-1  mt-7">
      <View className="p-[10px]">
        <View className="flex-row items-center gap-3">
          <Image
            source={require("../assets/user.png")}
            style={{ width: 70, height: 50 }}
          />
          <Text className="text-base font-medium">Milan</Text>
        </View>
        <TextInput
          className="mt-3 h-10 "
          value={content}
          onChangeText={(text) => {
            setContent(text);
          }}
          placeholder="Type our Message"
          multiline
          placeholderTextColor={"black"}
        />
        <TouchableOpacity className="mt-5">
          <Button
            onPress={handleSharePost}
            className="text-center text-white p-4"
            title="Share Post"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateScreen;
