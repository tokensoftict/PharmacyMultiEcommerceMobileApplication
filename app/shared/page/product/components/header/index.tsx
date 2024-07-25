import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "../../../../../shared/component/icon";
import { arrowBack, like } from "../../../../../assets/icons";
import Typography from "../../../../../shared/component/typography";
import {styles} from './styles'
import { useNavigation } from "@react-navigation/native";
import useDarkMode from "../../../../../shared/hooks/useDarkMode";
import { semantic } from "../../../../../shared/constants/colors";
import {ProductListInterface} from "@/service/product/ProductListInterface.tsx";

interface header {
    title: string|undefined
}
export default function Header({title} : header) {
  const {isDarkMode} = useDarkMode()
  const {goBack} = useNavigation()
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Icon customStyles={{tintColor: isDarkMode ? semantic.background.white.w500 : semantic.background.red.d500}} icon={arrowBack} />
      </TouchableOpacity>
      <Typography  numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
          {title}
      </Typography>

      <TouchableOpacity>
        <Icon icon={like} />
      </TouchableOpacity>
    </View>
  )
}
