import React, { useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import notifee, { AndroidNotificationSetting } from '@notifee/react-native';
import Typography from '@/shared/component/typography';
import {styles} from "./styles"

// @ts-ignore
export default function SplashScreen({ navigation }) {

    useEffect(() => {
        const runSplashFlow = async () => {
            // Show splash for 3 seconds
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Check permission after splash
            const settings = await notifee.getNotificationSettings();
            if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
                navigation.replace('mainMenu');
            } else {
                promptPermission();
            }
        };

        runSplashFlow();
    }, []);

    const promptPermission = () => {
        Alert.alert(
            'Enable Alarm & Reminders',
            'We need permission to send timely reminders with sound and vibration, even in the background. Please enable alarm and reminder settings to never miss a dose.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Enable',
                    onPress: async () => {
                        await notifee.openAlarmPermissionSettings();
                        navigation.goBack(); // Optional: Let user try again or return
                    }
                }
            ]
        );
    };

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
