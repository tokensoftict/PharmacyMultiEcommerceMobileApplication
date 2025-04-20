/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from "@notifee/react-native";
import {getApp} from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";

messaging(getApp()).setBackgroundMessageHandler(async remoteMessage => {
    console.log("Message handled in the background "+remoteMessage);
})

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
        // Remove the notification
        console.log(detail);
        console.log(type);
        await notifee.cancelNotification(notification.id);
    }
});

AppRegistry.registerComponent(appName, () => App);
