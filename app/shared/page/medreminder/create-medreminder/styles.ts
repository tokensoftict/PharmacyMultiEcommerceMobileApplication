import { StyleSheet, Dimensions } from 'react-native';
import {normalize} from "@/shared/helpers";
import {semantic} from "@/shared/constants/colors.ts";

export const { width, height } = Dimensions.get('window');

const PRIMARY_COLOR = '#d32f2f';
const LIGHT_GRAY = '#f7f7f7';
const DARK_TEXT = '#222';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: normalize(-20),
    },
    slider: {
        flexDirection: 'row',
        height: normalize(height / 1.65),
    },
    slide: {
        width,
        padding: normalize(20),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    stepTitle: {
        fontSize: normalize(23),
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom:  normalize(6),
    },
    stepDescription: {
        fontSize: normalize(15),
        color: '#666',
        marginBottom:  normalize(24),
        textAlign: 'left',
    },
    label: {
        marginBottom:  normalize(8),
        fontSize: normalize(16),
        fontWeight: '500',
        color: semantic.text.grey
    },
    fieldWrapper: {
        width: '100%',
        marginBottom: normalize(18),
    },
    input: {
        width: '100%',
        padding:  normalize(14),
        borderRadius:  normalize(10),
        backgroundColor: LIGHT_GRAY,
        fontSize:  normalize(16),
        color: DARK_TEXT,
    },
    tagGroup: {
        marginTop: normalize(10),
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        paddingVertical:  normalize(8),
        paddingHorizontal:  normalize(16),
        marginRight:  normalize(8),
        marginBottom:  normalize(8),
        borderRadius:  normalize(10),
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    tagSelected: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
    },
    tagText: {
        color: '#444',
        fontSize: normalize(15),
    },
    tagTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal:  normalize(30),
        paddingVertical:  normalize(20),
        backgroundColor: LIGHT_GRAY,
        width: '100%',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: normalize(2) },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        // Elevation for Android
        elevation: normalize(4),
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical:  normalize(12),
        paddingHorizontal:  normalize(28),
        borderRadius:  normalize(8),
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        fontSize:  normalize(16),
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonTextDisabled: {
        color: '#eee',
    },
    item: {
        fontSize: normalize(18),
        borderStyle : 'solid',
        paddingVertical: normalize(7),
    },
});
