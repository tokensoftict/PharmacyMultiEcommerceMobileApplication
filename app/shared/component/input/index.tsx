import React, { LegacyRef, useState } from "react";
import {View, TextInput} from 'react-native';
import {_styles} from './styles';
import Typography from '../typography';
import {semantic} from '../../constants/colors';
import {KeyboardTypeOptions} from 'react-native/Libraries/Components/TextInput/TextInput';
import { NativeSyntheticEvent, NativeTouchEvent } from "react-native/Libraries/Types/CoreEventTypes";
import useDarkMode from "../../hooks/useDarkMode.tsx";

interface InputProps {
  value?: string | undefined;
  onChangeText?: ((text: string) => void) | undefined;
  multiline?: boolean | undefined;
  maxLength?: number | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
  editable?: boolean | undefined;
  placeholder?: string | undefined;
  secureTextEntry?: boolean | undefined;
  leftIcon?: React.ReactNode | undefined;
  rightIcon?: React.ReactNode | undefined;
  label?: string | undefined;
  onPressIn?: ((e: NativeSyntheticEvent<NativeTouchEvent>) => void) | undefined;
  inputRef?: any
}

export default function Input({
  value,
  onChangeText,
  multiline,
  maxLength,
  keyboardType,
  editable,
  placeholder = '',
  secureTextEntry,
  leftIcon,
  rightIcon,
  label,
  onPressIn,
  inputRef,
}: InputProps) {
  const [isFocus, setFocus] = useState(false);
  const {isDarkMode} = useDarkMode()
  const styles = _styles(isFocus, isDarkMode);
  return (
    <View>
      {label && <Typography style={styles.label}>{label}</Typography>}
      <View style={styles.container}>
        {leftIcon && leftIcon}
        <TextInput
          ref={inputRef}
          onPressIn={onPressIn}
          multiline={multiline}
          onChangeText={onChangeText}
          value={value}
          maxLength={maxLength}
          keyboardType={keyboardType}
          editable={editable}
          // @ts-ignore
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocus(true)}
          placeholderTextColor={semantic.text.grey}
          style={styles.input}
        />
        {rightIcon && rightIcon}
      </View>
    </View>
  );
}
