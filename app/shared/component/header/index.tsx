import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import Typography from "../../../shared/component/typography";
import {styles} from './styles'
import Icon from "../../../shared/component/icon";
import { location, homeNotifications, homeLike, homeNotificationsDark, homeLikeDark } from "../../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../../routes/stack";
import useDarkMode from "../../hooks/useDarkMode.tsx";
import AuthSessionService from "../../../service/auth/AuthSessionService.tsx";
import {normalize} from "@/shared/helpers";

export default function Header() {
  const {isDarkMode} = useDarkMode()
  const {navigate} = useNavigation<NavigationProps>()

  const userProfile = (new AuthSessionService()).getAuthSession();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image style={styles.avatar} source={{uri: userProfile.data.image}} />
        <View>
          <Typography style={styles.nameUser}>{ userProfile.data.firstname}</Typography>
          <View style={styles.row}>
            <Icon customStyles={styles.iconLocation} icon={location} />
            <Typography style={styles.location}>No Location</Typography>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigate('enterOTP')}>
          {isDarkMode ? (
            <Icon customStyles={styles.iconSize} icon={homeNotificationsDark} />
          ) : (
            <Icon customStyles={styles.iconSize} icon={homeNotifications} />
          )}
        </TouchableOpacity>
        <View style={styles.widthSpace}/>
        <TouchableOpacity onPress={() => navigate('enterOTP')}>
          {isDarkMode ? (
            <Icon customStyles={styles.iconSize} icon={homeLikeDark} />
          ) : (
            <Icon customStyles={styles.iconSize} icon={homeLike} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}
