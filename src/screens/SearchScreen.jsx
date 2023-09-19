import { View, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Button, Text, ActivityIndicator } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase/config"; 

export default function SearchScreen(){
    const navigation = useNavigation();
    const {params: currentUser} = useRoute();

    const [searchEmail, setSearchEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [foundUser, setFoundUser] = useState();
    const [notFoundMsg, setNotFoundMsg] = useState(false)

    const searchUser = async () => {
        setNotFoundMsg(false)
        setLoading(true);
        const usersRef = collection(db, "users");
        const findUser = query(usersRef, where("email", "==", searchEmail.toLowerCase()))
        const querySnapshot = await getDocs(findUser);

        if(!querySnapshot.empty) {
            //Show user
            const userDoc = querySnapshot.docs[0];
            const searchedUser = {
                id: querySnapshot.docs[0].id,
                name: userDoc.data().name,
                email: userDoc.data().email
            }
            setFoundUser(searchedUser)
            setLoading(false);
        } else {
            //Users not found
            setNotFoundMsg(true)
            setLoading(false);
        }
    }

    const addUserFriend = async () => {
        const search = doc(db, "users", foundUser.id)
        await updateDoc(search, {
            request: arrayUnion(doc(db, "users/" + currentUser))
        })
    }
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCont}>
                <TextInput 
                style={styles.input} 
                placeholder="Search users with email..."
                onChangeText={setSearchEmail}
                />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close-outline" size={28}/>
                </TouchableOpacity>
            </View>

            {
                loading ? (
                    <ActivityIndicator size="large"/>
                ) : foundUser ? (
                    <View style={styles.searchResultCont}>
                        <View>
                            <Text style={styles.searchResultName}>{foundUser.name}</Text>
                            <Text style={styles.searchResultEmail}>{foundUser.email}</Text>
                        </View>
                        <TouchableOpacity style={styles.addBtn} onPress={() => addUserFriend()}>
                            <Text style={styles.addText}>Add friend+</Text>
                        </TouchableOpacity>
                    </View>
                ) : notFoundMsg ? (
                    <View style={styles.notFoundCont}>
                        <Text style={styles.notFoundMessage}>User not found. Check if the email is correct.</Text>
                    </View>
                ) : (
                    <View></View>
                )
            }
            
            <View>
                <Button title="Search" onPress={() => searchUser()}/>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1
    },
    headerCont: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    searchResultCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        padding: 15
    },
    searchResultName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    searchResultEmail: {
        fontSize: 12,
        color: 'gray'
    },
    addBtn: {
        marginLeft: 20,
        backgroundColor: '#0094e4',
        padding: 15,
        borderRadius: 20
    },
    addText: {
        color: 'white',
        fontWeight: 'bold'
    },
    notFoundCont: {
        alignItems: 'center',
        paddingHorizontal: 80
    },
    notFoundMessage: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center'
    }
})