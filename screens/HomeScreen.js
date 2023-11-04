import { Image, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/utils";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setUserId(userId);
    };
    return () => fetchUsers();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/get-posts`);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.put(
        `${baseUrl}/post/${postId}/${userId}/like`
      );
      const updatePost = response.data;

      const updatedPosts =
        posts.map((post) => (post._id === updatePost._id ? updatePost : post));
      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDisLike = async (postId) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.put(
        `${baseUrl}/post/${postId}/${userId}/unlike`
      );
      const updatePost = response.data;

      const updatedPosts =
        posts.map((post) => (post._id === updatePost._id ? updatePost : post));
      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <ScrollView className="mt-10 flex-1 bg-white">
      <View className="mt-5">
        {posts?.map((post) => {
          return (
            <>
              <View className="py-3">
                <View className="flex-row gap-4 items-center">
                  <Image
                    source={require("../assets/user.png")}
                    style={{ width: 70, height: 50 }}
                  />
                  <View>
                    <Text className="font-bold  text-base">
                      {post.user.name}
                    </Text>
                    <Text className="my-[3px]">{post?.content}</Text>
                    <View className="flex-row gap-2 items-center">
                      {post?.likes?.includes(userId) ? (
                        <AntDesign
                          onPress={() => handleDisLike(post?._id)}
                          name="heart"
                          size={18}
                          color="red"
                        />
                      ) : (
                        <AntDesign
                          onPress={() => handleLike(post?._id)}
                          name="hearto"
                          size={18}
                          color="black"
                        />
                      )}

                      <FontAwesome name="comment-o" size={18} color="black" />
                      <Ionicons
                        name="share-social-outline"
                        size={18}
                        color="black"
                      />
                    </View>

                    <Text className="mt-2">
                      {post.likes?.length} likes * {post.replies?.length}reply
                    </Text>
                  </View>
                </View>
              </View>
            </>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
