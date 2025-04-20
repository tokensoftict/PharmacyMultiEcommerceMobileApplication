import {Dimensions, StyleSheet} from "react-native";
import { normalize } from "@/shared/helpers";
import {labels, palette} from "@/shared/constants/colors";


const primaryColor = '#d32f2f';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fefefe',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
        maxHeight: '90%',
    },
    header: {
        backgroundColor: primaryColor,
        paddingTop: 40,
        paddingBottom: 20,
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    closeBtn: {
        position: 'absolute',
        right: 16,
        top: 40,
        zIndex: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: '#fff',
        borderWidth: 2,
        marginBottom: 8,
    },
    customerName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    customerTag: {
        fontSize: 14,
        color: '#f1f1f1',
    },
    contentContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: primaryColor,
    },
    label: {
        color: '#666',
        marginTop: 10,
    },
    value: {
        fontSize: 15,
        color: '#333',
    },
    fancyButtonWrapper: {
        marginTop: 10,
    },
    fancyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    fancyButtonShadowWrapper: {
        borderRadius: 50,
        backgroundColor: '#ff4b2b',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6, //
    },
    fancyButton: {
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
