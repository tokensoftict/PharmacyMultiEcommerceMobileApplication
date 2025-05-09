import { StyleSheet } from 'react-native';
import { normalize } from '@/shared/helpers';

export const styles = StyleSheet.create({
    searchWrapper: {
        paddingHorizontal: normalize(24),
        paddingTop: normalize(10),
        paddingBottom: normalize(10),
        backgroundColor: '#fff',
    },
    searchBox: {
        backgroundColor: '#f4f4f4',
        borderRadius: normalize(10),
        paddingHorizontal: normalize(15),
        height: normalize(45),
        fontSize: normalize(14),
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    categoryMenuContainer: {
        paddingHorizontal: normalize(16),
        paddingBottom: normalize(30),
    },
    categoryCard: {
        flex: 1,
        alignItems: 'center',
        margin: normalize(6),
        backgroundColor: '#ffffff',
        borderRadius: normalize(12),
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(5),
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        minWidth: normalize(100),
        maxWidth: normalize(110),
    },
    imageWrapper: {
        width: normalize(50),
        height: normalize(50),
        borderRadius: normalize(25),
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(6),
        overflow: 'hidden',
    },
    categoryImage: {
        width: normalize(40),
        height: normalize(40),
        resizeMode: 'contain',
    },
    categoryText: {
        fontSize: normalize(12),
        textAlign: 'center',
        color: '#333',
    },
});
