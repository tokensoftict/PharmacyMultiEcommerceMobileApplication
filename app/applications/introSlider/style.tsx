import {StyleSheet} from "react-native";
import {FONT} from "@/shared/constants/fonts.ts";
import {normalize} from "@/shared/helpers";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    skipButton: {
        position: 'absolute',
        top: normalize(50),
        right: normalize(20),
        zIndex: 10,
    },
    skipText: {
        color: '#EF4444',
        fontWeight: '600',
        fontSize: normalize(16),
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: normalize(20),
    },
    image: {
        width: normalize(280),
        height: normalize(280),
        marginBottom: normalize(30),
    },
    title: {
        fontSize: normalize(28),
        fontWeight: 'bold',
        color: '#DC2626',
        textAlign: 'center',
        marginBottom: normalize(12),
        fontFamily: FONT.NORMAL
    },
    description: {
        fontSize: normalize(16),
        color: '#4B5563',
        textAlign: 'center',
        paddingHorizontal: normalize(10),
        fontFamily: FONT.NORMAL
    },
    footer: {
        position: 'absolute',
        bottom: normalize(30),
        width: '100%',
        paddingHorizontal: normalize(20),
    },
    getStartedButton: {
        backgroundColor: '#EF4444',
        paddingVertical: normalize(14),
        borderRadius: normalize(16),
    },
    getStartedText: {
        color: '#ffffff',
        fontSize: normalize(18),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    lottie: {
        width: normalize(300),
        height: normalize(300),
        alignSelf: 'center',
        marginBottom: normalize(30),
    },
    navButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        alignSelf: 'center',
        marginTop: normalize(20),
    },

    navButton: {
        padding: normalize(12),
        borderRadius: normalize(10),
        backgroundColor: '#ff3e3e',
        minWidth: normalize(120),
        alignItems: 'center',
    },

    navText: {
        color: '#fff',
        fontSize: normalize(16),
        fontWeight: 'bold',
    },
});
