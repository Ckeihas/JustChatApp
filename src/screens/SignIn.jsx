import { View, TextInput, Button, SafeAreaView, StyleSheet } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function SignIn(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const signUserIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("Sign in user: ", userCredential)
            // ...
            navigation.push("home", userCredential)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("MEssage: ", errorMessage)
        });
    }
    return(
        <SafeAreaView>
            <TextInput 
            style={styles.input}
            onChangeText={setEmail}
            placeholder="Email"
            />
            <TextInput 
            style={styles.input}
            onChangeText={setPassword}
            placeholder="Password"
            />
            <Button title="Sign In" onPress={() => signUserIn()}/>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
})