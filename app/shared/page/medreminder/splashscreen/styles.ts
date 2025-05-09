import { StyleSheet } from "react-native";
import {normalize} from "@/shared/helpers";

export const styles = StyleSheet.create({
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
        fontSize: normalize(22),
        fontWeight: 'bold',
        color: 'red',
        marginTop: normalize(20),
    },
    subtitle: {
        fontSize: normalize(16),
        color: 'gray',
        marginTop: normalize(10),
        textAlign: 'center',
    },
});
