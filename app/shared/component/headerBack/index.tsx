import React from 'react';
import { TouchableOpacity, View } from "react-native";
import Icon from "../icon";
import { arrowBack } from "../../../assets/icons";
import Typography from "../typography";
import {styles} from './styles'
import { useNavigation } from "@react-navigation/native";
import useDarkMode from "../../hooks/useDarkMode.tsx";
import { semantic } from "../../constants/colors";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

interface HeaderBackProps {
  title?: string;
  icon?: React.ReactNode | undefined;
  onPress?:any | undefined
}
export default function HeaderWithIcon({title, icon, onPress}: HeaderBackProps) {
  const {isDarkMode} = useDarkMode()
  const navigation = useNavigation<NavigationProps>();
  const stylesIcon = {
    tintColor: isDarkMode ? semantic.background.white.w500 : semantic.background.red.d500
  }

  function goBack() {
    if(navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // @ts-ignore
      navigation.replace(new AuthSessionService().getEnvironment());
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => goBack()}>
        <Icon customStyles={stylesIcon} icon={icon ? icon : arrowBack} />
      </TouchableOpacity>
      {title && (
        <Typography style={styles.title}>{title}</Typography>
      )}
    </View>
  )
}
