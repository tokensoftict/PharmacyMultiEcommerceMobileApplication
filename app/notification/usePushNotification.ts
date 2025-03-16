import {PermissionsAndroid, Platform} from "react-native";
import messaging from "@react-native-firebase/messaging";
import {store} from "@/redux/store/store.tsx";
import * as action from "@/redux/actions";
import {getApp} from "@react-native-firebase/app";


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
