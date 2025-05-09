import {StyleSheet} from 'react-native'
import { normalize } from "../../helpers";
import {design, labels} from "@/shared/constants/colors.ts";

export const styles = StyleSheet.create({
  container: {
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'space-between',
    backgroundColor :design.text1.background,
    alignContent : 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: normalize(5),
    paddingBottom: normalize(5),
    paddingHorizontal: normalize(15),
    marginBottom : normalize(20)
  },
  title: {
    fontSize: normalize(20),
    fontWeight: '700',
    color : design.text1.color,
    marginLeft: normalize(10),
  }
})
