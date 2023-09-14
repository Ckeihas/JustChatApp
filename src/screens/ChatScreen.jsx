import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat"
import { doc, onSnapshot, getDoc, addDoc, serverTimestamp, query, collection, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase/config";


export default function ChatScreen(){
    const {params: data} = useRoute();
    console.log("The datum: ", data)
    const navigation = useNavigation();
    const [messages, setMessages] = useState([])
    //console.log("Current user: ", messages)

    const getMessagesFunc = useCallback(async () => {
        
        const messageRef = collection(db, "message");
        const queryMessages = query(messageRef, where("chatID", "==", data.user.chatId))
        const getMessages = await getDocs(queryMessages)
        const messagesArray = [];
        let counter = 0;
        getMessages.docs.forEach((item) => {
            //console.log("Yksi viesti: ", item.data())
            const date = new Date(item.data().timestamp.seconds * 1000 + item.data().timestamp.nanoseconds / 1000000);
            messagesArray.push({
                _id: item.id,
                text: item.data().text,
                createdAt: date,
                user: {
                    _id: item.data().sender
                }
            })
            counter++
        })

        if(counter == getMessages.docs.length){
            const sortedmessages = messagesArray.sort((a, b) => a.createdAt - b.createdAt);
            setMessages(sortedmessages.reverse())
        }
    }, [])
    useEffect( () => {      
        const chatRef = doc(db, "chat", data.user.chatId)
        const unsubscribe = onSnapshot((chatRef), async (snapshot) => {
            getMessagesFunc()
        })
        return () => unsubscribe();
    }, [])

    const addMessage = useCallback(async (message) => {
        const messageRef = collection(db, "message")
        const chatRef = doc(db, "chat", data.user.chatId)

        console.log("GIFTED CHAT: ", message)

        await addDoc(messageRef, {
        chatID: data.user.chatId,         
        sender: data.currentUser,
        text: message[0].text,
        timestamp: new Date()              
        }).then(async item => {
            console.log("ITEM: ", item.path)
            await updateDoc(chatRef, {
                text: item.path
            })
        })
    }, []);

    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.headercont}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-outline" size={32} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerName}>{data.user.user.name}</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal-outline" size={32} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
            <GiftedChat
                messages={messages}
                onSend={messages => addMessage(messages)}
                user={{
                    _id: data.currentUser,
                }}
            />
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    headercont: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 30
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})