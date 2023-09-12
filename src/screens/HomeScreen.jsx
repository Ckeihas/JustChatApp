import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Button, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import Contacts from "../components/Contacts";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Notification from "../components/Notification";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config"; 

export default function HomeScreen(){
    const {params: user} = useRoute();
    //console.log("Home Screen tiedot: ", user)
    const [currentUser, setCurrentUser] = useState({});
    
    //console.log("Current user: ", currentUser)
    const navigation = useNavigation();

    useEffect( () => {

        const getUser = async () => {
            const usersRef = collection(db, "users");
            const findUser = query(usersRef, where("email", "==", user._tokenResponse.email))
            const querySnapshot = await getDocs(findUser);
    
            if(!querySnapshot.empty) {
                //Show user
                const userDoc = querySnapshot.docs[0];
                const searchedUser = {
                    id: querySnapshot.docs[0].id,
                    name: userDoc.data().name,
                    email: userDoc.data().email,
                    contacts: userDoc.data().contacts
                }
                setCurrentUser(searchedUser)
            } else {
                //Users not found
            }
        }
         getUser();
    }, [])

    const signUserOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Sign out successfull")
            navigation.navigate("auth")
        }).catch((error) => {
        // An error happened.
            console.log("Couldn't sign out: ", error
            )
        });
    }
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <TouchableOpacity onPress={() => navigation.push("search", currentUser.id)}>
                    <Ionicons name="search-outline" size={26}/>
                </TouchableOpacity>

                <Text style={styles.header}>JustChat</Text>

                <View style={styles.rightSideHeader}>
                    <TouchableOpacity onPress={() => navigation.push("requests", currentUser.id)}>
                        <Notification email = {currentUser.email} id = {currentUser.id}/>
                        <Ionicons name="notifications-outline" size={26} style={{right: 10, position: 'absolute'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="settings-outline" size={26}/>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.contactsView}>
                <Contacts userContacts = {currentUser.contacts} currentUser = {currentUser}/>             
            </ScrollView>
            <Button title="Sign Out" onPress={() => signUserOut()}/>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 24,
        alignItems: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    contactsView: {
        alignItems: 'center'
    },
    rightSideHeader: {
        flexDirection: 'row',
    }
})