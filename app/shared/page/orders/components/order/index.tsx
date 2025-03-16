import React from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import Typography from "@/shared/component/typography";
import {_styles} from './styles'
import { activeOpacity, currencyType } from "@/shared/constants/global";
import useDarkMode from "@/shared/hooks/useDarkMode";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import {normalize} from "@/shared/helpers";
import {OrderListInterface} from "@/service/order/interface/OrderListInterface.tsx";

interface OrderProps {
  product: OrderListInterface;
  track?: boolean | undefined
}
export default function Order({product, track=true}: OrderProps) {
  const {navigate} = useNavigation<NavigationProps>()
  const {isDarkMode} = useDarkMode()
  const styles = _styles(isDarkMode);
  const navigation = useNavigation<NavigationProps>();

  function navigateTo() {
    // @ts-ignore
    navigation.navigate('showOrder', {orderId : product.id})

  }


  return (
    <View>
      <TouchableOpacity onPress={navigateTo}  activeOpacity={activeOpacity} style={styles.containerOrder}>
        <View style={styles.containerImage}>
          <Image style={styles.image} resizeMode="contain" source={{uri: product.image}} />
        </View>

        <View style={styles.containerInfo}>
          <View style={{display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
            <Typography style={styles.name} >Order Date: {product.orderDate}</Typography>
            <View style={{height : normalize(13) ,marginLeft : normalize(5),marginRight : normalize(5),borderWidth: 1, borderColor: 'gray', borderStyle : 'solid'}}></View>
            <Typography style={styles.statusLabel}>{product.status}</Typography>
          </View>
          <Typography style={styles.category} >Order ID: {product.orderId}</Typography>
          <Typography style={styles.price}>
            Total: {currencyType} {product.total}
          </Typography>
          <Typography style={styles.category} >{product.payment_method}</Typography>
        </View>
      </TouchableOpacity>
    </View>
  )
}
