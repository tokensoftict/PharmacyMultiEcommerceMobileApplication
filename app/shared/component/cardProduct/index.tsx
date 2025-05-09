import React from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { currencyType } from "@/shared/constants/global.ts";
import {_styles} from './styles'
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { normalize } from "@/shared/helpers";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import {ProductListInterface} from "@/service/product/ProductListInterface";
import Icon from "@/shared/component/icon";
import {white_shopping_cart} from "@/assets/icons";
import {store} from "@/redux/store/store";
import * as action from "@/redux/actions";
import {semantic} from "@/shared/constants/colors.ts";
import Environment from "@/shared/utils/Environment.tsx";
import {Card} from "react-native-paper";


interface ProductList {
    product: ProductListInterface,
}

export default function CardProduct({product}: ProductList) {
  const {isDarkMode} = useDarkMode()
  const styles = _styles(isDarkMode)
  const navigation = useNavigation<NavigationProps>();

  function navigateTo() {
      // @ts-ignore
      navigation.navigate('detailProduct', {productId : product.id})

  }
  return (
        <Card mode="contained" style={{ width: normalize(170),   backgroundColor : "#FFF", margin:normalize(10)}}  onPress={navigateTo}>
        <View style={styles.containerImage}>
          <Image style={styles.image} resizeMode="contain" source={{uri: product.image}} />
        </View>
        <View style={{marginTop: normalize(12), paddingLeft:normalize(10)}}>
            <Typography ellipsizeMode={'tail'} numberOfLines={2} style={styles.name}>{product.name}</Typography>
            <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
            {
                product.special !== false ?
                    <View>
                        <Typography style={styles.special}>{currencyType} {product.price}</Typography>
                        <Typography style={styles.price}>{currencyType} {product.special}</Typography>
                    </View>
                    :
                    <Typography style={styles.price}>{currencyType} {product.price}</Typography>
            }

                {
                    Environment.isLogin() ?
                        <TouchableOpacity style={styles.addToCart} onPress={() => {
                            store.dispatch(action.setProductDialogData(product))
                        }}>
                            <Icon width={15} height={15} tintColor={semantic.background.white.w500}  icon={white_shopping_cart} />
                        </TouchableOpacity>
                        : <></>
                }


        </View>
            {
                (Environment.isWholeSalesEnvironment() &&  product?.doorstep ) ?
                    <Typography style={styles.doorStep}>+ Door Delivery : {currencyType} {product?.doorstep}</Typography>
                    :
                    <></>
            }
        </View>
        </Card>
  )
}
