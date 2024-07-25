import {StyleSheet} from 'react-native';
import {palette, semantic} from '../../../constants/colors';
import {normalize} from '../../../helpers';

export const _styles = (disabled: boolean | undefined, sm: boolean | undefined) =>
    StyleSheet.create({
        container: {
            backgroundColor: disabled
                ? palette.main.pdisabled
                : palette.main.p500,
            paddingHorizontal: normalize(sm ? 6 : 10),
            paddingVertical: normalize(sm ? 8 : 16),
            borderRadius: normalize(sm ? 5 : 5),
            flexDirection: 'row',
            alignItems: 'center',
        },
        loadingButton : {
            flexDirection: 'row',
            alignItems: 'center',
        },
        text: {
            color: semantic.text.white,
            fontWeight: '700',
            marginHorizontal: normalize(4),
            fontSize: normalize(14),
            textAlign: 'center',
            flex: 1,
        },
        icon: {
            tintColor: semantic.text.white,
            width: normalize(24),
            height: normalize(24),
        },
    });
