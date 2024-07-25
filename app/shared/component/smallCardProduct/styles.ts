import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import {design, palette, semantic} from "../../constants/colors";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    width: normalize(100),
    marginBottom: normalize(12),
    marginTop:normalize(12),
    marginRight:normalize(5),
    marginLeft:normalize(5),
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f03,
    borderRadius: normalize(5),
    shadowOpacity: 0.11,
    shadowRadius: 3,
    elevation: 16,
    shadowOffset: {
      width: 0,
      height: 0,
    },

  },
  containerImage: {
    width: '100%',
    height: normalize(60),
  },
  image: {
    width: '100%',
    height: normalize(60)
  },
  name: {
    fontSize : normalize(8),
    fontWeight: 'regular',
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    maxHeight: normalize(30),
    height: normalize(30),
    alignItems : "center",
  },
  category: {
    color: isDarkMode ? semantic.text.white : design.text1.color,
    backgroundColor : isDarkMode ? semantic.text.black :  design.text1.background,
    padding: normalize(2),
    paddingLeft : normalize(5),
    borderRadius: normalize(5),
    width : '80%',
    fontWeight: '500',
    fontSize: normalize(7),
    marginVertical: normalize(2)
  },
  price: {
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    fontWeight: '600',
    marginBottom:normalize(2),
    fontSize: normalize(11),
  },
  special: {
    fontSize: normalize(9),
    fontWeight: 'regular',
    color : semantic.alert.danger.d500,
    textDecorationLine: "line-through",
    marginTop: normalize(2),
  },
  doorStep: {
    fontSize: normalize(8),
    color: isDarkMode ? semantic.text.white : palette.main.p500,
    fontWeight: 'regular',
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
