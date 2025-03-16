import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import {design, palette, semantic} from "../../constants/colors";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
     flex: 1,
  },
  viewOrderButton: {
    backgroundColor: semantic.alert.danger.d500,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: normalize(10),
    fontWeight: "bold",
  },
  priceTotalContainer : {
    flexDirection: 'row',
    justifyContent : "space-between",
    alignItems : "flex-start",
    marginBottom:normalize(6),
    marginTop:normalize(6),
  },
  grid : {
    flex: 1,
    flexDirection: 'row',
    justifyContent : "space-between",
    alignItems : "center",
    width:"100%",
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor : semantic.text.white,
    padding : normalize(10),
    elevation : 50,
    shadowColor : semantic.fill.f04,
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 2,
    shadowRadius: 1,
    // flex: 1,
  },
  containerImage: {
    width: normalize(80),
    height: normalize(90),
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    borderRadius: normalize(16)
  },
  image: {
    width: '100%',
    height: normalize(90)
  },
  name: {
    fontSize: normalize(9),
    fontWeight: '500',
    color: isDarkMode ? semantic.text.white : semantic.text.black,
  },
  category: {
    color: isDarkMode ? semantic.text.white : design.text1.color,
    backgroundColor : isDarkMode ? semantic.text.black :  design.text1.background,
    padding: normalize(1),
    paddingLeft : normalize(3),
    borderRadius: normalize(10),
    width : '30%',
    fontSize: normalize(8),
    marginVertical: normalize(2)
  },
  price: {
    fontSize : normalize(9),
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    fontWeight: '700',
    marginTop: normalize(2)
  },
  special: {
    fontSize: normalize(9),
    color : semantic.alert.danger.d500,
    textDecorationLine: "line-through",
    marginTop: normalize(5),
  },
  specialHolder : {
    flexDirection : 'row'
  },
  doorStep: {
    fontSize: normalize(10),
    color: isDarkMode ? semantic.text.white : palette.main.p500,
    fontWeight: '500',
    marginBottom:normalize(6),
  },
  totalPrice: {
    color: palette.main.p500,
    fontSize: normalize(12),
    fontWeight: '600',
    marginLeft : normalize(25)
  },
  containerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: normalize(18)
  },
  actions: {
    flex :1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  actionsHeader: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius : 10,
    borderTopLeftRadius : 10,
    backgroundColor : semantic.text.white,
    padding : normalize(10),
    paddingTop: normalize(0),
    paddingBottom: normalize(0),
    borderBottomColor : semantic.background.white.w111,
    borderStyle : 'solid',
    borderBottomWidth : normalize(1),
  },
  actionsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomRightRadius : 10,
    borderBottomLeftRadius : 10,
    backgroundColor : semantic.text.white,
    padding : normalize(10),
    paddingTop: normalize(0),
    paddingBottom: normalize(0),
    borderBottomColor : semantic.background.white.w111,
    borderStyle : 'solid',
    borderBottomWidth : normalize(1),
  },
  containerCant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cant: {
    backgroundColor: palette.main.p500,
    width: normalize(24),
    height: normalize(24),
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cantText: {
    color: semantic.text.white,
    fontSize: normalize(16),
    fontWeight: '700'
  }
})
