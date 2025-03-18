import {Platform, StyleSheet} from "react-native";
import { normalize } from "../../helpers";
import {design, palette, semantic} from "../../constants/colors";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    width: normalize(176),
    marginBottom: normalize(12),
    marginTop:normalize(12),
    marginRight:normalize(5),
    marginLeft:normalize(15),
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f03,
    borderRadius: normalize(5),
    shadowOpacity: 0.11,
    ...Platform.select({
      ios: {
        shadowRadius: normalize(3),
        elevation: normalize(20),
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
      android: {
        shadowRadius: normalize(3),
        elevation: normalize(2),
        shadowOffset: {
          width: 0,
          height: 0,
        },
      }
    }),

  },
  containerImage: {
    width: '100%',
    height: normalize(115),
  },
  image: {
    width: '100%',
    height: normalize(115)
  },
  name: {
    fontWeight: '400',
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    maxHeight: normalize(40),
    fontSize: normalize(12),
    alignItems : "center",
    marginBottom: normalize(4),
    height: normalize(35),
  },
  category: {
    color: isDarkMode ? semantic.text.white : design.text1.color,
    backgroundColor : isDarkMode ? semantic.text.black :  design.text1.background,
    padding: normalize(2),
    paddingLeft : normalize(5),
    borderRadius: normalize(5),
    width : '50%',
    fontWeight: '500',
    fontSize: normalize(10),
    marginVertical: normalize(8)
  },
  price: {
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    fontWeight: '500',
    marginBottom:normalize(4),
  },
  special: {
    fontSize: normalize(9),
    color : semantic.alert.danger.d500,
    textDecorationLine: "line-through",
    marginTop: normalize(5),
  },
  doorStep: {
    fontSize: normalize(10),
    color: isDarkMode ? semantic.text.white : palette.main.p500,
    fontWeight: '500'
  },
  addToCart: {
    marginRight:normalize(8),
    marginTop:normalize(0),
    backgroundColor:semantic.alert.danger.d500,
    borderRadius:normalize(100),
    width:normalize(35),
    height:normalize(35),
    padding:normalize(10),
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 1,
  }
})
