import {StyleSheet} from 'react-native';
import {normalize} from '../../helpers';
import {semantic} from '../../constants/colors';

export const _styles = (active: boolean | undefined) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      fontSize: normalize(16),
      marginRight: normalize(7),
    },
    containerRadioButton: {
      borderWidth: 1,
      borderColor: active ? semantic.background.red.d500 : semantic.text.grey,
      width: normalize(25),
      height: normalize(25),
      borderRadius: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
    innerRadioButton: {
      width: normalize(15),
      height: active ? normalize(15) : 0,
      backgroundColor: semantic.background.red.d500,
      borderRadius: 150,
    },
  });
