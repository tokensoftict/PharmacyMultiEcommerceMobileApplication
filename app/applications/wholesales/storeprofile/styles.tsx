import { StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        paddingBottom: normalize(30),
    },
    header: {
        width: '100%',
        backgroundColor: '#ff6600',
        paddingVertical: normalize(30),
        alignItems: 'center',
        borderBottomLeftRadius: normalize(20),
        borderBottomRightRadius: normalize(20),
    },
    storeName: {
        fontSize: normalize(26),
        fontWeight: 'bold',
        color: '#fff',
    },
    storeTagline: {
        fontSize: normalize(16),
        color: '#fff',
        marginTop: normalize(5),
    },
    card: {
        backgroundColor: '#fff',
        padding: normalize(20),
        marginTop: normalize(20),
        width: '90%',
        borderRadius: normalize(16),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: normalize(10),
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: normalize(8),
    },
    label: {
        fontSize: normalize(16),
        fontWeight: '600',
        color: '#333',
    },
    value: {
        fontSize: normalize(16),
        fontWeight: '500',
        color: '#666',
    },
    ctaButton: {
        marginTop: normalize(30),
        backgroundColor: '#ff6600',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(40),
        borderRadius: normalize(30),
        shadowColor: '#ff6600',
        shadowOpacity: 0.4,
        shadowRadius: normalize(10),
        elevation: 5,
    },
    ctaText: {
        fontSize: normalize(18),
        fontWeight: 'bold',
        color: '#fff',
    },
});
