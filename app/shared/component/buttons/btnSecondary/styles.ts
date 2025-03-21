import {StyleSheet} from 'react-native';
import {palette, semantic} from '../../../constants/colors';
import {normalize} from '../../../helpers';

export const _styles = (disabled: boolean | undefined) =>
  StyleSheet.create({
    container: {
      backgroundColor: disabled
        ? semantic.fill.f04
        : palette.main.p100,
      paddingHorizontal: normalize(10),
      paddingVertical: normalize(16),
      borderRadius: normalize(16),
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: disabled ? semantic.text.white : palette.main.p500,
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
