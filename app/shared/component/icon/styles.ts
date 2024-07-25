import {StyleSheet} from 'react-native';
import {normalize} from '../../helpers';

interface Sizes {
  width?: number | undefined;
  height?: number | undefined;
  isDarkMode: boolean
}
export const _styles = ({width, height, isDarkMode}: Sizes) =>
  StyleSheet.create({
    icon: {
      width: width || normalize(24),
      height: height || normalize(24),
    },
  });
