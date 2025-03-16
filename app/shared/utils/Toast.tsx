import {Alert, Platform, ToastAndroid,} from "react-native";


export default function Toastss(msg: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
        Alert.alert(msg);
    }
}
