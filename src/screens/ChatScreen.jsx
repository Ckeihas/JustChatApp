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
    console.log("Current user: ", messages)

    const getMessagesFunc = async () => {
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
    }
    useEffect(() => {      
        
        getMessagesFunc();
        
        // setMessages([
        // {
        //     _id: 1,
        //     text: 'Hello developer',
        //     createdAt: new Date(),
        //     user: {
        //     _id: 2,
        //     name: 'React Native',
        //     avatar: 'https://placeimg.com/140/140/any',
        //     },
        // },
        // ])
        // return () => unsubscribe();
    }, [])

    const addMessage = async (message) => {
        const messageRef = collection(db, "message")
        const chatRef = doc(db, "chat", data.user.chatId)

        await addDoc(messageRef, {
        chatID: data.user.chatId,         
        sender: data.currentUser,
        text: message[0].text,
        timestamp: new Date()              
        }).then(async item => {
            await updateDoc(chatRef, {
                text: item.path
            })
        }).then(() => {
            const chatRef = doc(db, "chat", data.user.chatId)
            const unsubscribe = onSnapshot((chatRef), async (snapshot) => {
                //console.log("MUUTOS: ", snapshot.data())
                let counter = 0;
                console.log(counter)
                if(snapshot.exists() && snapshot.data().text != ""){
                    // const messageRef = doc(db, snapshot.data().text)
                    // const querySnapshot = await getDoc(messageRef)
                    //console.log("Snapshot: ",snapshot.data())
                    counter++
                    const messageRef = doc(db, snapshot.data().text)
                    const newMessage = await getDoc(messageRef)
                    console.log("Tuliko viesti: ", newMessage.id)
                    const date = new Date(newMessage.data().timestamp.seconds * 1000 + newMessage.data().timestamp.nanoseconds / 1000000)
                    const objectToFind = { _id: newMessage.id};
    
                    
                    const containsObject = messages.some(item => item._id === objectToFind._id);
                        if(containsObject){
                            console.log("Löyty", containsObject)
                        } else {
                            setMessages(previousMessages =>
                                GiftedChat.append(previousMessages, {
                                    _id: newMessage.id,
                                    text: newMessage.data().text,
                                    createdAt: date,
                                    user: {
                                        _id: newMessage.data().sender
                                    }
                                }),
                            )
                            //console.log("Kaikki viestit: ", messages)
                        }
                    
                    // console.log('Messages:', messages.map(item => item._id));
                    // console.log('Object to Find:', objectToFind._id);
                    
                        // GiftedChat.append({
                        //     _id: querySnapshot.data().chatID,
                        //     text: querySnapshot.data().text,
                        //     createdAt: querySnapshot.data().timestamp,
                        //     user: {
                        //         _id: querySnapshot.data().sender
                        //     }
                        // })
                        console.log("kui mont kertaa: ", counter)
                }
            })
            return () => unsubscribe();
        })
        
    };

    const onSend = useCallback((messages = []) => {
        console.log("The viesti: ", messages[0].text)
        setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
        )
    }, [])
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