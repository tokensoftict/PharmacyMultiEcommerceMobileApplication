import {PermissionsAndroid, Platform} from "react-native";
import messaging from "@react-native-firebase/messaging";
import {store} from "@/redux/store/store.tsx";
import * as action from "@/redux/actions";
import {getApp} from "@react-native-firebase/app";
import {useEffect} from "react";
import notifee, {EventType} from "@notifee/react-native";

async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
        console.log('Notification caused application to open', initialNotification.notification);
        console.log('Press action used to open the app', initialNotification.pressAction);
    }
}

const requestUserPermission = async () => {
    if(Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if(granted !== PermissionsAndroid.RESULTS.GRANTED) {
            return ;
        }
    }
    if(Platform.OS === 'ios') {
        const authStatus = await getApp().messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          return;
        }
    }
/*
    useEffect(() => {
        bootstrap();
        return notifee.onForegroundEvent(({ type, detail }) => {
            console.log(detail);
            console.log(type);
            switch (type) {
                case EventType.DISMISSED:
                    console.log('User dismissed notification', detail.notification);
                    break;
                case EventType.PRESS:
                    console.log('User pressed notification', detail.notification);
                    break;
            }
        });
    }, []);
*/
}


const getToken = async () => {
    try {
        const token = await getApp().messaging().getToken();
        store.dispatch(action.setFirebaseDeviceToken(token))
        console.log(token);
        return token;
    } catch (e) {
        console.error(e);
       return false
    }
}

export const usePushNotification = async () => {
    await requestUserPermission()
    getToken();
    getApp().messaging().subscribeToTopic("psgdc_notification");
    getApp().messaging().subscribeToTopic("psgdc_notification_testing");

}
