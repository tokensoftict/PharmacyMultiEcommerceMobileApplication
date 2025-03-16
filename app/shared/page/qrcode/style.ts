import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Light background for contrast
    },
    qrImage: {
        borderRadius: 10, // Optional rounded corners
        backgroundColor: 'white', // Ensures QR is visible on dark mode
        padding: 10, // Adds spacing around QR code
    },
})
