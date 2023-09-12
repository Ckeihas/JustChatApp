import { View, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Notification({email, id}){
    const [request, setRequest] = useState(false);
    
    useEffect(() => {
        const findUserRequests = async () => {
            
            if(id){
                const test = doc(db, "users", id)
                onSnapshot(test, (snapshot) => {
                    if(snapshot.exists() && snapshot.data().request.length > 0){
                        console.log("Daatumi ssatu: ", snapshot.data())
                        snapshot.data().request.forEach( async reference => {
                            const refDoc = doc(db, reference.path);
                            const refSnapshot = await getDoc(refDoc);
                            console.log("Reference: ", refSnapshot.data())
                        });
                        setRequest(true)
                    } else{
                        setRequest(false)
                    }
                })
            } else {
                console.log("Wait for the id")
            }
            

        }
        findUserRequests();
    }, [id])
    
    return(
        <View>
        {
            request ? (
                <View style={styles.container}>

                </View>
            ) : (
                <View></View>
            )
        
        }
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        height: 8,
        width: 8,
        backgroundColor: 'red',
        position: 'absolute',
        borderRadius: 100,
        right: 10
    }
})