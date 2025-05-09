import {Dimensions, StyleSheet} from 'react-native';
import { normalize } from '@/shared/helpers';
import {FONT} from "@/shared/constants/fonts.ts";

const imageSize = normalize(50);
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
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
    },
    sectionHeaderText: {
        color: '#fff',
        fontSize: normalize(16),
        fontWeight: 'bold',
    },
    sectionHeaderSubText: {
        color: '#fff',
        fontSize: normalize(10),
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    categoryMenuContainer: {
        paddingHorizontal: normalize(10),
        paddingBottom: normalize(20),
        paddingTop: normalize(10),
    },
    categoryCard: {
        backgroundColor: '#fff',
        borderRadius: normalize(8),
        padding: normalize(10),
        marginRight: normalize(16),
        alignItems: 'center',
        width: normalize(90),
        elevation: normalize(4),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    imageWrapper: {
        width: imageSize,
        height: imageSize,
        borderRadius: imageSize / 2,
        overflow: 'hidden',
        marginBottom: 8,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    categoryText: {
        fontSize: normalize(12),
        textAlign: 'center',
        color: '#333',
        fontFamily: FONT.BOLD
    },
});
