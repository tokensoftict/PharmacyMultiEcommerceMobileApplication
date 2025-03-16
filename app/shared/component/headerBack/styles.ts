import {StyleSheet} from 'react-native'
import { normalize } from "../../helpers";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: normalize(15),
  },
  title: {
    fontSize: normalize(15),
    fontWeight: '700',
    marginLeft: normalize(6)
  }
})
