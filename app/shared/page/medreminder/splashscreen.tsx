import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import {normalize} from "@/shared/helpers";
import Typography from "@/shared/component/typography";

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
            <Typography style={styles.title}>Welcome to Medication Reminder</Typography>
            <Typography style={styles.subtitle}>Stay on track with your medications</Typography>
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
