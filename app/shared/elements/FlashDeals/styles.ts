import {Dimensions, StyleSheet} from 'react-native';
import {normalize} from "@/shared/helpers";
import {semantic} from "@/shared/constants/colors.ts";
import {FONT} from "@/shared/constants/fonts.ts";
const { width } = Dimensions.get('window');
export default StyleSheet.create({
    sectionTitle: {
        fontSize: normalize(18),
        fontWeight: 'bold',
        margin: normalize(10),
        color: 'red',
    },
    dealCard: {
        flex: 1,
        flexDirection: 'row',
        width: normalize(150),
        padding: normalize(10),
        marginHorizontal: normalize(10),
        backgroundColor: '#fff',
        borderColor: semantic.background.white.wgrey,
        borderWidth: normalize(1),
        borderRadius: normalize(8),
        justifyContent: 'space-between',
    },
    price: {
        fontSize: normalize(10),
        fontFamily : FONT.LIGHT,
        fontWeight: '400',
        marginTop: normalize(5),
    },
    sectionHeaderContainer: {
        width: width,
        height: normalize(50),
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(16),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    sectionHeaderImage: {
        resizeMode: 'cover',
        borderRadius: 0,
        alignSelf: 'center',
    },
    sectionHeaderText: {
        color: '#fff',
        fontSize: normalize(14),
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    sectionHeaderSubText: {
        color: '#fff',
        fontSize: normalize(10),
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: normalize(12),
        marginBottom: normalize(15),
        flex: 1,
        marginHorizontal: normalize(5),
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        padding: normalize(15),
        height: normalize(80),
    },
    cardInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },
    cardContent: {
        width: '70%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    productName: {
        fontWeight: '500',
        fontSize: normalize(14),
        color: '#333',
        marginBottom: normalize(5),
    },
    productPrice: {
        fontSize: normalize(13),
        color: '#e53935', // red accent
    },
    fireIcon: {
        width: "30%",
        fontSize: normalize(15),
        marginLeft: normalize(5),
    },
});
