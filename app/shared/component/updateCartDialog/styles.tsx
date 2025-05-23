import {StyleSheet} from "react-native";
import {normalize} from "@/shared/helpers";
import {design, labels, semantic} from "@/shared/constants/colors.ts";

export const  styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: normalize(320),
        height: normalize(410),
        backgroundColor: 'white',
        borderRadius: normalize(10),
        alignItems: 'center',
    },
    productImage: {
        width: normalize(120),
        height: normalize(150),
        resizeMode: 'contain',
        marginBottom: normalize(10),
    },
    productName: {
        fontSize: normalize(15),
        fontWeight: 'bold',
        paddingHorizontal: normalize(10),
        color: '#333',
    },
    productPrice: {
        fontSize: normalize(16),
        fontWeight: 'bold',
        color: 'red',
        marginVertical: normalize(5),
    },
    doorstep: {
        fontSize: normalize(8),
        fontWeight: 'bold',
        color: 'red',
    },
    promoPrice: {
        color: 'red',
        fontWeight: 'bold',
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: 'gray',
        fontSize: normalize(14),
        marginLeft: normalize(5),
    },
    productCategory: {
        color: design.text1.color,
        backgroundColor :  design.text1.background,
        padding: normalize(2),
        paddingLeft : normalize(10),
        paddingRight : normalize(10),
        borderRadius: normalize(5),
        fontWeight: '500',
        fontSize: normalize(10),
    },
    productQuantity: {
        color: design.text1.color,
        backgroundColor :  design.text1.background,
        padding: normalize(2),
        paddingLeft : normalize(10),
        paddingRight : normalize(10),
        borderRadius: normalize(5),
        fontWeight: '500',
        fontSize: normalize(10),
    },
    productExpiry: {
        color: labels.type1.textColor,
        backgroundColor :  labels.type1.background,
        padding: normalize(2),
        paddingLeft : normalize(10),
        paddingRight : normalize(10),
        borderRadius: normalize(5),
        fontWeight: '500',
        fontSize: normalize(10),
    },
    productCarton: {
        color: labels.type2.textColor,
        backgroundColor :  labels.type2.background,
        padding: normalize(2),
        paddingLeft : normalize(10),
        paddingRight : normalize(10),
        borderRadius: normalize(5),
        fontWeight: '500',
        fontSize: normalize(10),
        marginVertical: normalize(8),
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        padding: normalize(10),
    },
    addToCartButton: {
        flex: 1,
        flexDirection : 'row',
        backgroundColor: 'red',
        padding: normalize(10),
        borderRadius: normalize(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: normalize(5),
    },
    buyNowButton: {
        flex: 1,
        flexDirection : 'row',
        borderWidth: normalize(1),
        borderColor: semantic.alert.danger.d500,
        padding: normalize(10),
        justifyContent: 'center',
        borderRadius: normalize(5),
        alignItems: 'center',
        marginLeft: normalize(5),
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: normalize(14),
        flex: 1,
        textAlign: 'center',
    },

    buttonText2: {
        color : semantic.alert.danger.d500,
        fontWeight: 'bold',
        fontSize: normalize(14),
        flex: 1,
        textAlign: 'center',
    },
    cancelButton: {
        position: 'absolute',
        top: normalize(10),
        right: normalize(10),
        backgroundColor: 'red',
        width: normalize(30),
        height: normalize(30),
        borderRadius: normalize(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: normalize(18),
        fontWeight: 'bold',
    },
    quantityHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: normalize(5),
        paddingLeft: normalize(20),
        justifyContent: 'space-between',

    },
    quantity: {
        fontWeight: '700',
        fontSize: normalize(15)
    },
});
