import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Vibration, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import SoundPlayer from 'react-native-sound-player'
import ModalComponent from "react-native-modal";

// @ts-ignore
const OrderSuccessDialog = ({ visible, onClose, onViewOrder }) => {

    const animationRef = useRef(null);

    useEffect(() => {
        if (visible) {
            // @ts-ignore
            animationRef.current?.play

            // Play success sound
            try {
                SoundPlayer.playAsset(require("@/assets/success.mp3"))
            } catch (e) {
                console.log(`cannot play the sound file`, e)
            }

            // Vibrate the phone
            Vibration.vibrate(500); // Standard vibration
        }
    }, [visible]);

    return (
        <ModalComponent isVisible={visible} animationIn="zoomIn" animationOut="zoomOut">
            <View style={styles.container}>

                <LottieView
                    ref={animationRef}
                    source={require("@/assets/confetti.json")}
                    autoPlay
                    loop={true}
                    style={styles.animation}
                />


                <Text style={styles.emoji}>🎉😊</Text>


                <Text style={styles.text}>Order Placed Successfully!</Text>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.viewOrderButton} onPress={onViewOrder}>
                        <Text style={styles.buttonText}>View Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ModalComponent>
    );

};

const styles = StyleSheet.create({
    container: {
        width: "90%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 15,
        alignItems: "center",
        alignSelf: "center",
    },
    animation: {
        width: 200,
        height: 200,
    },
    emoji: {
        fontSize: 50,
        marginBottom: 10,
    },
    text: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    viewOrderButton: {
        backgroundColor: "#28a745",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    closeButton: {
        backgroundColor: "#dc3545",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default OrderSuccessDialog;
