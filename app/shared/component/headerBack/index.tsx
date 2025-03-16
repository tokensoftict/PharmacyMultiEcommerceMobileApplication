import React from 'react';
import { TouchableOpacity, View } from "react-native";
import Icon from "../icon";
import { arrowBack } from "../../../assets/icons";
import Typography from "../typography";
import {styles} from './styles'
import { useNavigation } from "@react-navigation/native";
import useDarkMode from "../../hooks/useDarkMode.tsx";
import { semantic } from "../../constants/colors";

interface HeaderBackProps {
  title?: string;
  icon?: React.ReactNode | undefined;
  onPress?:any | undefined
}
export default function HeaderWithIcon({title, icon, onPress}: HeaderBackProps) {
  const {goBack} = useNavigation()
  const {isDarkMode} = useDarkMode()
  const stylesIcon = {
    tintColor: isDarkMode ? semantic.background.white.w500 : semantic.background.red.d500
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Icon customStyles={stylesIcon} icon={icon ? icon : arrowBack} />
      </TouchableOpacity>
      {title && (
        <Typography style={styles.title}>{title}</Typography>
      )}
    </View>
  )
}
