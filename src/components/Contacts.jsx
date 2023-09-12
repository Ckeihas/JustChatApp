import { View, StyleSheet, Image, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, {useEffect, useReducer, useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot, getDoc, arrayRemove, updateDoc, query, where, getDocs, arrayUnion, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { ActivityIndicator } from "react-native";

export default function Contacts({userContacts, currentUser}){
    const [contacts, setContacts] = useState([])
    const [contactInfo, setContactInfo] = useState([])
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation();
    useEffect( () => {
        if(userContacts){
            const contactsArray = [];
            let counter = 0;
            userContacts.forEach(async element => {
                counter++
                console.log(element.path)
                const chatRef = doc(db, element.path)
                const querySnapshot = await getDoc(chatRef)
                
                contactsArray.push({user: querySnapshot.data(), chatId: element.id})
                
                if(counter == contactsArray.length){
                    contactsArray.map(async (contact) => {
                            setContacts(contactsArray)
                    })
                    
                }
            });
        }
    }, [userContacts])

    useEffect(() => {
        const foundUsers = [];
        let counter = 0;
        contacts.map(user => {

            user.user.users.forEach(async element => {
                const userRef = doc(db, element.path);
                const querySnapshot = await getDoc(userRef);
                if(element.id != currentUser.id){
                    foundUsers.push({user: querySnapshot.data(), chatId: user.chatId})
                }
                if(foundUsers.length == contacts.length){
                    setContactInfo(foundUsers)
                }
            })
        })
    }, [contacts])

    return(
        <SafeAreaView style={styles.container}>
                {          
                !contactInfo.length == 0 ? (contactInfo.map( (user) => {
                const usersArray = [];
                const promises = [];

                return(
                    <View key={user.email}>
                     <TouchableOpacity style={styles.child} onPress={() => navigation.push("chat", {user: user, currentUser: currentUser.id})}>
                         <Image style={styles.avatar} source={require("../../assets/avatar.png")}/>
                         <View style={styles.texts} key={user.email}>
                             <Text>{user.user.name}</Text>
                             <Text>Latest Message</Text>
                         </View>
                     </TouchableOpacity>
                     <View style={styles.line}></View>
                     </View>
                )
                })) : (
                    <View style={styles.message} >
                        <Text>Your contacts will appear here!</Text>
                    </View> )
                }
            
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        width: 300,
    },
    line: {
        width: 300,
        height: 1,
        marginTop: 10,
        backgroundColor: 'black'
    },
    child: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,       
        marginRight: 20,
        marginTop: 16
    },
    texts: {
        flexDirection: 'column'
    },
    message: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})