import {Dimensions, Platform, StyleSheet} from "react-native";
import {design, palette, semantic} from "@/shared/constants/colors.ts";
import {normalize} from "@/shared/helpers";


const { width: SCREEN_WIDTH } = Dimensions.get('window');


export const _styles = (isDarkMode: boolean, width: number) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: semantic.background.white.w500 ,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor : semantic.background.white.w500 ,
        alignItems: 'center',
        paddingHorizontal: normalize(0),
        paddingVertical: normalize(10),

    },
    stepHeader: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: normalize(5),
        backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w500,
    },
    stepTitle: {
        fontSize: normalize(12),
        fontWeight: 'normal',
        color: '#AAAAAA', // Grey for inactive steps
        textAlign: 'center',
    },
    stepTitleActive: {
        color: '#FF0000', // Red for active step
    },
    stepDescription: {
        fontSize: normalize(12),
        color: '#666666',
        marginTop: normalize(5),
        textAlign: 'center',
    },
    stepLine: {
        height: normalize(2),
        width: '100%',
        backgroundColor: '#DDDDDD',
        marginTop: normalize(10),
        borderRadius: 3,
    },
    stepLineActive: {
        backgroundColor: design.text1.background,
    },
    content: {
        flex: 1,
        height: '100%',
        backgroundColor: semantic.background.white.w100,
        overflow: 'hidden',
    },
    stepsContainer: {
        flexDirection: 'row',
        backgroundColor: semantic.background.white.w100 ,
        height: '100%',
        width: SCREEN_WIDTH * normalize(4),
        overflow: 'hidden',
    },
    step: {
        width: SCREEN_WIDTH,
        paddingHorizontal: normalize(20),

    },
    label: {
        fontSize: normalize(16),
        marginBottom: normalize(8),
        color: '#333333',
    },
    input: {
        height: normalize(40),
        borderColor: '#DDDDDD',
        borderWidth: normalize(1),
        borderRadius: normalize(4),
        marginBottom: normalize(20),
        paddingHorizontal: normalize(10),
        backgroundColor: '#FAFAFA',
    },
    navigation: {
        flexDirection: 'row',
        paddingBottom: normalize(25),
        marginBottom: normalize(10),
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? normalize(-28) : normalize(-38),
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#FFFFFF',

        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: normalize(10),
        shadowRadius: normalize(6),

        // Android Shadow
        elevation: 5,

    },
    buttonPrimary: {
        display: 'flex',
        flexDirection : 'row',
        backgroundColor: '#FF0000',
        padding: normalize(18),
        flex: 1,
        textAlign : 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonSecondaryWithSwiper: {
        backgroundColor: palette.main.p100,
        borderWidth: 1,
        borderColor: palette.main.p500,
        padding: normalize(15),
        flex: 0.2,
        alignItems: 'center',
    },

    buttonSecondary: {
        backgroundColor: palette.main.p100,
        borderWidth: 1,
        borderColor: palette.main.p500,
        padding: normalize(15),
        flex: 0.2,
        alignItems: 'center',
    },
    buttonPrimaryText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: normalize(16),
    },
    buttonSecondaryText: {
        color: '#FF0000',
        fontWeight: 'bold',
        fontSize: normalize(16),
    },



});
