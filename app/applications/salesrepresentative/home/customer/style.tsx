import {StyleSheet} from "react-native";
import {normalize} from "@/shared/helpers";
const primaryColor = '#d32f2f';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fefefe',
        borderTopLeftRadius: normalize(24),
        borderTopRightRadius: normalize(24),
        paddingBottom: normalize(20),
        maxHeight: '90%',
    },
    header: {
        backgroundColor: primaryColor,
        paddingTop: normalize(40),
        paddingBottom: normalize(20),
        alignItems: 'center',
        borderTopLeftRadius: normalize(24),
        borderTopRightRadius: normalize(24),
    },
    closeBtn: {
        position: 'absolute',
        right: normalize(16),
        top: normalize(40),
        zIndex: normalize(10),
    },
    avatar: {
        width: normalize(80),
        height: normalize(80),
        borderRadius: normalize(40),
        borderColor: '#fff',
        borderWidth: normalize(2),
        marginBottom: normalize(8),
    },
    customerName: {
        fontSize: normalize(20),
        fontWeight: 'bold',
        color: '#fff',
    },
    customerTag: {
        fontSize: normalize(14),
        color: '#f1f1f1',
    },
    contentContainer: {
        padding: normalize(16),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: normalize(16),
        padding: normalize(16),
        marginBottom: normalize(16),
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: normalize(0), height: normalize(3) },
        shadowRadius: normalize(6),
        elevation: normalize(4),
    },
    cardTitle: {
        fontSize: normalize(16),
        fontWeight: 'bold',
        marginBottom: normalize(10),
        color: primaryColor,
    },
    label: {
        color: '#666',
        marginTop: normalize(10),
    },
    value: {
        fontSize: normalize(15),
        color: '#333',
    },
    fancyButtonWrapper: {
        marginTop: normalize(10),
    },
    fancyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: normalize(16),
    },
    fancyButtonShadowWrapper: {
        borderRadius: normalize(50),
        backgroundColor: '#ff4b2b',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: normalize(0), height: normalize(4) },
        shadowRadius: normalize(8),
        elevation: normalize(6), //
    },
    fancyButton: {
        paddingVertical: normalize(14),
        borderRadius: normalize(50),
        alignItems: 'center',
        justifyContent: 'center',
    },
});
