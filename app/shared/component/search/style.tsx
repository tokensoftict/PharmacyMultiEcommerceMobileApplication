import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";


export const styles = StyleSheet.create({
    container:{
        marginTop:normalize(20),
        height:normalize(150),
    },
    containerSearch: {
        paddingHorizontal: normalize(24),
        marginVertical: normalize(14),
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
});
