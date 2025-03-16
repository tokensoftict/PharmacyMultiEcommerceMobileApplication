import {Platform, StyleSheet} from "react-native";
import { normalize } from "../../helpers";


export const styles = StyleSheet.create({
    container:{
        marginTop:normalize(20),
    },
    containerSearch: {
        ...Platform.select({
            ios: {
                paddingHorizontal: normalize(24),
                marginVertical: normalize(14),
            },
            android: {
                paddingHorizontal: normalize(15),
                marginVertical: normalize(14),
            }
        }),
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
});
