import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import SignUp from "../screens/SignUp";
import ChatScreen from "../screens/ChatScreen";
import SignIn from "../screens/SignIn";
import SearchScreen from "../screens/SearchScreen";
import FriendRequests from "../screens/FriendRequests";

const Stack = createNativeStackNavigator();

export default function AppNavigation(){
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="signin" options={{headerShown: false}} component={SignIn}/>
                <Stack.Screen name="auth" options={{headerShown: false}} component={SignUp}/>
                <Stack.Screen name="home" options={{headerShown: false}} component={HomeScreen}/>
                <Stack.Screen name="chat" options={{headerShown: false}} component={ChatScreen}/>
                <Stack.Screen name="search" options={{headerShown: false}} component={SearchScreen}/>
                <Stack.Screen name="requests" options={{headerShown: false}} component={FriendRequests}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}