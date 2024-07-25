import { StyleSheet } from "react-native";
import { normalize } from "../../../shared/helpers";
import {design, semantic} from "../../../shared/constants/colors";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        paddingHorizontal: normalize(24),
    },
    containerHeader: {
        paddingHorizontal: normalize(24),
        elevation: 14,
        alignSelf: 'stretch',
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },
    containerFooter: {
        paddingHorizontal: normalize(24),
    },
    containerImage: {
        width: '100%',
        height: normalize(300),
        marginTop: normalize(10)
    },
    image: {
        width: '100%',
        height: normalize(300)
    },
    containerName: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: normalize(15),
    },
    name: {
        fontSize: normalize(19),
        fontWeight: '700',
        width : '90%'
    },
    addToCart: {
        marginRight:normalize(20),
        backgroundColor:semantic.alert.danger.d500,
        borderRadius:normalize(100),
        width:normalize(50),
        height:normalize(50),
        padding:normalize(10),
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerCantSold: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: normalize(20)
    },
    sold: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(4),
        borderRadius: normalize(4)
    },
    separator: {
        width: normalize(12)
    },
    space: {
        width: normalize(2)
    },
    quantityStyle: {
        color: isDarkMode ? semantic.text.white : design.text1.color,
        backgroundColor : isDarkMode ? semantic.text.black :  design.text1.background,
        padding: normalize(2),
        paddingLeft : normalize(5),
        borderRadius: normalize(5),
        width : '30%',
        fontWeight: '500',
        fontSize: normalize(10),
        marginVertical: normalize(8),
    },
    sizeStar: {
        width: normalize(15),
        height: normalize(15),
    },
    containerDescription: {
        marginTop: normalize(40)
    },
    descriptionTitle: {
        fontSize: normalize(18),
        fontWeight: '700'
    },
    description: {
        lineHeight: 16,
        marginTop: normalize(10)
    },
    quantity: {
        fontWeight: '700',
        fontSize: normalize(18)
    },
    valueVariant: {
        marginTop: normalize(18),
        fontWeight: '700'
    },
    price: {
        fontSize: normalize(18),
        fontWeight: '700'
    },
    total: {
        fontSize: normalize(20),
        fontWeight: '700',
    },
    special: {
        fontSize: normalize(15),
        color : semantic.alert.danger.d500,
        textDecorationLine: "line-through",
        marginTop: normalize(5),
    },
    priceHolder : {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems : 'flex-start',
        marginRight : normalize(5)
    }
})
