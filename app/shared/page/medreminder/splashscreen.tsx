import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import {normalize} from "@/shared/helpers";

// @ts-ignore
export default function SplashScreen({ navigation }) {
    useEffect(() => {

        setTimeout(() => {
            navigation.replace('mainMenu');
        }, 4000);
    }, []);

    return (
        <View style={styles.container}>
            <LottieView
                source={require('@/assets/medicine.json')}
                autoPlay
                loop
                style={styles.lottie}
            />
            <Text style={styles.title}>Welcome to Medication Reminder</Text>
            <Text style={styles.subtitle}>Stay on track with your medications</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: normalize(400),
        height: normalize(400),
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'red',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        marginTop: 10,
        textAlign: 'center',
    },
});
