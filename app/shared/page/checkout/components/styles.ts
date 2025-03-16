import {Dimensions, StyleSheet} from "react-native";
import {palette, semantic} from "@/shared/constants/colors.ts";
import {normalize} from "@/shared/helpers";


const { width: SCREEN_WIDTH } = Dimensions.get('window');


export const _styles = (isDarkMode: boolean, width: number) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w500,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor :isDarkMode ? semantic.background.red.d500 : semantic.background.white.w500,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,

    },
    stepHeader: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w500,
    },
    stepTitle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#AAAAAA', // Grey for inactive steps
        textAlign: 'center',
    },
    stepTitleActive: {
        color: '#FF0000', // Red for active step
    },
    stepDescription: {
        fontSize: 12,
        color: '#666666',
        marginTop: 5,
        textAlign: 'center',
    },
    stepLine: {
        height: 2,
        width: '100%',
        backgroundColor: '#DDDDDD',
        marginTop: 10,
        borderRadius: 3,
    },
    stepLineActive: {
        backgroundColor: '#FF0000',
    },
    content: {
        flex: 1,
        height: '100%',
        backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w100,
        overflow: 'hidden',
    },
    stepsContainer: {
        flexDirection: 'row',
        backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w100,
        height: '100%',
        width: SCREEN_WIDTH * 4,
        overflow: 'hidden',
    },
    step: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 20,

    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333333',
    },
    input: {
        height: 40,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#FAFAFA',
    },
    navigation: {
        flexDirection: 'row',
        paddingBottom: normalize(25),
        marginBottom: normalize(10),
        position: 'absolute',
        bottom: normalize(-20),
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#FFFFFF',

        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 10,
        shadowRadius: 6,

        // Android Shadow
        elevation: 5,

    },
    buttonPrimary: {
        display: 'flex',
        flexDirection : 'row',
        backgroundColor: '#FF0000',
        padding: 18,
        flex: 1,
        textAlign : 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonSecondaryWithSwiper: {
        backgroundColor: palette.main.p100,
        borderWidth: 1,
        borderColor: palette.main.p500,
        padding: 15,
        flex: 0.2,
        alignItems: 'center',
    },

    buttonSecondary: {
        backgroundColor: palette.main.p100,
        borderWidth: 1,
        borderColor: palette.main.p500,
        padding: 15,
        flex: 0.2,
        alignItems: 'center',
    },
    buttonPrimaryText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonSecondaryText: {
        color: '#FF0000',
        fontWeight: 'bold',
        fontSize: 16,
    },



});
