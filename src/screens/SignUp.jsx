import { View, Button, SafeAreaView, StyleSheet, TextInput } from "react-native";
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase/config";
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc, query, where, getDocs, getDoc } from "firebase/firestore";

WebBrowser.maybeCompleteAuthSession();

export default function SignUp(){
    const [userInfo, setUserInfo] = useState();
    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: "300465958210-8tuioghc0ojvsannd1hot9q3qhivqqde.apps.googleusercontent.com",
        androidClientId: "300465958210-g8878nn7586gvt0vf7g3npdcg2k4ev03.apps.googleusercontent.com",
    });

    const navigation = useNavigation();

    useEffect(() => {
        if(response?.type == "success"){
            const {id_token} = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
        }
    }, [response])

    useEffect(() => {
        const onsub = onAuthStateChanged(auth, async (user) => {
            const usersRef = collection(db, "users");
            const findUser = query(usersRef, where("email", "==", user.email))
            const querySnapshot = await getDocs(findUser);
           
            if(!querySnapshot.empty){
                const userDoc = querySnapshot.docs[0];
                // Access the data of the document
                console.log("User document data:", userDoc.data());
                navigation.push("home", user)
            } else {
                console.log("User not found")
                await addDoc(usersRef, {
                    name: user.displayName,
                    email: user.email
                })
            }
            
        })

        return () => onsub();
    }, [])

    const createEmailAndPassword = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then( async (userCredential) => {
          // Signed in 
        //   const user = userCredential.user;
          console.log("Sähköposti käyttäjä: ", userCredential)

            const usersRef = collection(db, "users");
            const findUser = query(usersRef, where("email", "==", email))
            const querySnapshot = await getDocs(findUser);
           
            if(!querySnapshot.empty){
                const userDoc = querySnapshot.docs[0];
                // Access the data of the document
                console.log("User document data:", userDoc.data());
                navigation.push("home", userCredential)
            } else {
                console.log("User not found")
                await addDoc(usersRef, {
                    name: userName,
                    email: email
                })
                navigation.push("home", userCredential)
            }
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("VIRHE: ", errorMessage)

          // ..
        });
    }
    return(
        <View style={styles.container}>
            <SafeAreaView>
                <TextInput 
                style={styles.input}
                onChangeText={setUserName}
                placeholder="Name"
                />
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
                <View style={styles.emailBtn}>
                    <Button style={{color: 'red'}} title="Email" onPress={() => createEmailAndPassword()}></Button>
                </View>
                <View style={styles.btnCont}>
                    <Button style={{color: 'red'}} title="Google" onPress={() => promptAsync()}></Button>
                </View>
            </SafeAreaView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnCont: {
        backgroundColor: 'lightblue'
    },
    emailBtn: {
        backgroundColor: 'green'
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
})