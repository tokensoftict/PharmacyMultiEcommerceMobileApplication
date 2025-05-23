import React from 'react';
import { ActivityIndicator, TouchableOpacity } from "react-native";
import {_styles} from './styles';
import Typography from "../../typography";
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import { semantic } from "../../../constants/colors.ts";

interface ButtonProps {
  disabled?: boolean | undefined;
  leftIcon?: React.ReactNode | undefined;
  title?: string | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  loading?: boolean | undefined;
}
export default function ButtonSecondary({
  disabled,
  leftIcon,
  title = 'Done',
  onPress,
  loading,
}: ButtonProps) {
  const styles = _styles(disabled);
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={styles.container}>
      {leftIcon && leftIcon}
      {loading ? (
        <ActivityIndicator color={semantic.background.white.w500} />
      ) : (
        <Typography style={styles.text}>{title}</Typography>
      )}
    </TouchableOpacity>
  );
}
