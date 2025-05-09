import {PermissionsAndroid, Platform} from "react-native";
import messaging from "@react-native-firebase/messaging";
import {store} from "@/redux/store/store.tsx";
import * as action from "@/redux/actions";
import notifee from "@notifee/react-native";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import {getApp} from "@react-native-firebase/app";
import SpInAppUpdates, {
    NeedsUpdateResponse,
    IAUUpdateKind,
    StartUpdateOptions,
} from 'sp-react-native-in-app-updates';


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

const checkForUpdate = function() {
    const inAppUpdates = new SpInAppUpdates(
        false // isDebug
    );
    inAppUpdates.checkNeedsUpdate().then((result) => {
        if (result.shouldUpdate) {
            let updateOptions: StartUpdateOptions = {};
            if (Platform.OS === 'android') {
                updateOptions = {
                    updateType: IAUUpdateKind.FLEXIBLE,
                };
            }
            inAppUpdates.startUpdate(updateOptions);
        }
    });
}


const getToken = async () => {

    try {
       const token = await getApp().messaging().getToken();
       store.dispatch(action.setFirebaseDeviceToken(token))
       return token;
    } catch (e) {
       return false
    }

}


export async function requestAllNotificationPermissions() {
    await requestUserPermission();
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        await notifee.requestPermission();
    }

}

export const bootUpApplication = async () => {
    const authService = new AuthSessionService();
    const intro_page_status = await authService.getIntroPageStatus();
    if(intro_page_status === "NO") {
        await authService.destroySession();
        authService.setLaunchPage(JSON.stringify({"page" : "introSlider", "extraData" : {}}));
    } else{
        authService.setLaunchPage(JSON.stringify({"page" : "supermarket", "extraData" : {}}));
    }
    authService.setEnvironment("supermarket"); //set environment to be supermarket by default because supermarket is the default space
    await requestAllNotificationPermissions();
    await getToken();
    await getApp().messaging().subscribeToTopic("psgdc_notification");
    await getApp().messaging().subscribeToTopic("psgdc_notification_testing");
    const loginStatus = await  authService.autoLogin();
    if(loginStatus) {
        const userProfile =  (new AuthSessionService().getAuthSession()).data;
        const userApp = userProfile.apps.length;
        if(userApp > 1) {
            authService.setLaunchPage(JSON.stringify({"page" : "storeSelector", "extraData" : {}}))
        } else {
            authService.setLaunchPage(JSON.stringify({"page" : "supermarket", "extraData" : {}}))
        }
    }

    const initialNotification = await notifee.getInitialNotification()
    if (initialNotification) {

        const notificationExtra = JSON.parse(initialNotification.notification.data?.extra+"");
        const environment =     initialNotification.notification.data?.environment;
        const notificationType = initialNotification.notification.data?.notificationType;
        notificationExtra['body'] = initialNotification.notification.body;
        notificationExtra['title'] = initialNotification.notification.title;
        //prepare the mobile application environment
        if(environment) {
            authService.setEnvironment(environment+"");
        }


        switch (notificationType) {
            case "VIEW_MED_REMINDER":
                authService.setLaunchPage(JSON.stringify({"page" : "viewReminder", "extraData" : notificationExtra}));
                break;

        }

    }


    const firebaseInitialNotification = await getApp().messaging().getInitialNotification();
    if(firebaseInitialNotification) {


        const notificationExtra = JSON.parse(firebaseInitialNotification.data?.extra+"");
        const environment =     firebaseInitialNotification.data?.environment;
        const notificationType = firebaseInitialNotification.data?.notificationType;
        notificationExtra['body'] = firebaseInitialNotification.notification?.body;
        notificationExtra['title'] = firebaseInitialNotification.notification?.title;

        if(environment) {
            authService.setEnvironment(environment+"");
        }

        switch (notificationType) {
            case "APPROVE_MED_REMINDER_SCHEDULES":
                authService.setLaunchPage(JSON.stringify({"page" : "viewLogs", "extraData" : notificationExtra}));
                break;
            case "VIEW_ORDER" :
                authService.setLaunchPage(JSON.stringify({"page" : "showOrder", "extraData" : notificationExtra}))
        }

    }

    checkForUpdate();

}
