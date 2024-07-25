import {StyleSheet} from 'react-native';
import {normalize} from '../../../shared/helpers';
import {semantic} from '../../../shared/constants/colors';

export const styles = StyleSheet.create({
    container: {
        marginTop: normalize(14),
    },
    divider: {
        marginRight: normalize(10),
    },
    dividerDots: {
        marginHorizontal: normalize(5),
    },
    image: {
        height: normalize(132),
        width: normalize(272),
        borderRadius: normalize(12)
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: normalize(10),
    },
    titleSection: {
        fontSize: normalize(18),
        fontWeight: '600',
        marginLeft: normalize(10),
        marginBottom: normalize(12)
    },
    containerBanner: {
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: semantic.background.red.d500,
        height: normalize(132),
        width: normalize(272),
        borderRadius: normalize(12),
        opacity: 0.5,
    },
    containerInfo: {
        position: 'absolute',
        left: normalize(6),
        top: normalize(20)
    },
    title: {
        color: semantic.text.white,
        fontWeight: '700',
        fontSize: normalize(18)
    },
    description: {
        marginTop: normalize(7),
        color: semantic.text.white,
        fontWeight: '500',
    },
    dot: {
        width: normalize(9),
        height: normalize(9),
        borderRadius: 150,
        backgroundColor: semantic.text.grey,
    },
    dotActive: {
        backgroundColor: semantic.background.red.d500,
    },
});

