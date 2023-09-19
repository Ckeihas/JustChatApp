import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { doc, onSnapshot, getDoc, arrayRemove, updateDoc, query, where, getDocs, arrayUnion, addDoc, serverTimestamp, collection } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function FriendRequests(){
    const {params: currentUser} = useRoute();
    const [friendRequest, setFriendRequest] = useState([]);

    console.log("Requestit: ", currentUser)
    const navigation = useNavigation();
    useEffect(() => {
        const userRef = doc(db, "users", currentUser)

        const getFriendRequest = async (field) => {
            const userRef = doc(db, "users", currentUser)
            const getUserData = await getDoc(userRef)
            console.log("PATH: ", userRef.path)
            const requestArray = [];
            let counter = 0;
            if(getUserData.data().request.length > 0){
                getUserData.data().request.forEach(async reference => {
                    counter++
                    const refDoc = doc(db, reference.path);
                    const refSnapshot = await getDoc(refDoc);
                    requestArray.push(refSnapshot)
  
                    if(counter == requestArray.length){
                        setFriendRequest(requestArray)
                        counter = 0
                    }
                });
            }
        }
        getFriendRequest()
        
    }, [])
    

    const addContact = async (newContact) => {
        const userRef = doc(db, "users", currentUser)
        const friendRef = doc(db, "users", newContact.id)
        const messageRef = collection(db, "chat")
        const getUserData = await getDoc(userRef)
        
        getUserData.data().request.forEach( async ref => {
            
            const refDoc = doc(db, ref.path);
            const refSnapshot = await getDoc(refDoc);
    
            if(refSnapshot.id == newContact.id){
                await updateDoc(userRef, {
                    request: arrayRemove(refDoc)
                })
            }
        });
       
        await addDoc(messageRef, {
            text: "",
            users: arrayUnion(doc(db, "users/" + newContact.id), 
            doc(db, "users/" + currentUser)),
            timeStamp: serverTimestamp()
            // contacts: arrayUnion(doc(db, "users/" + newContact.id))
        }).then(async (item) => {
            console.log("Chat item: ", item.path)
            await updateDoc(userRef, {
                contacts: arrayUnion(doc(db, item.path))
            })
            await updateDoc(friendRef, {
                contacts: arrayUnion(doc(db, item.path))
            })
        })
    }

    const deleteRequest = () => {

    }
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-outline" size={32} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Pending invites</Text>
            </View>
            { 
            !friendRequest.length == 0 ?
                friendRequest.map( (item, index) => {
                    return(
                        <View key={index} style={styles.requestCont}>
                            <View>
                                <Text>{item.data().name}</Text>
                                <Text>{item.data().email}</Text>
                            </View>

                            <TouchableOpacity style={styles.checkMarkBtn} onPress={() => addContact(item)}>
                                <Ionicons 
                                name="checkmark-outline" 
                                size={30} 
                                color='white'
                                style={styles.checkMark}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.trashMarkBtn}>
                                <Ionicons 
                                name="trash-outline" 
                                size={30} 
                                color='white'
                                style={styles.trashMark}
                                />
                            </TouchableOpacity>
                        </View>
                    )
                }) :
                <View style={styles.message}>
                    <Text>No requests</Text>
                </View>
            }
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 30,
        marginBottom: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 90
    },
    requestCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        marginHorizontal: 50,
        marginVertical: 10,
        padding: 10,
        borderRadius: 10
    },
    requestInfoCont: {
        flexDirection: 'column'
    },
    checkMark: {
        backgroundColor: 'green',
        borderRadius: 100
    },
    checkMarkBtn: {
        borderRadius: 20,
        marginHorizontal: 30
    },
    trashMark: {
        backgroundColor: 'red'
    },
    trashMarkBtn: {
        marginHorizontal: 10
    },
    message: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})