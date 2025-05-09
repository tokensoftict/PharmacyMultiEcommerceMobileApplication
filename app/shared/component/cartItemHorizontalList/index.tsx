import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { currencyType } from "@/shared/constants/global";
import {_styles} from './styles'
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { useNavigation } from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack";
import {Items} from "@/service/cart/interface/CartInterface.tsx";
import Environment from "@/shared/utils/Environment.tsx";

interface ProductList {
    product: Items | undefined,
    onPress: (product: Items | undefined) => void,
}
export default function CartItemHorizontalList({product, onPress}: ProductList) {
    const {isDarkMode} = useDarkMode()
    const styles = _styles(isDarkMode)
    const [cant, setCant] = useState(1)
    const navigation = useNavigation<NavigationProps>();

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', {productId : product.id})

    }

    return (
        <TouchableOpacity onPress={() => onPress(product)} style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.containerImage}>
                    <Image style={styles.image} resizeMode="contain" source={{uri: product?.image}} />
                </View>

                <View style={styles.containerInfo}>
                    <View style={styles.actions}>
                        <Typography numberOfLines={1} ellipsizeMode={'tail'} style={styles.name}>{product?.name}</Typography>
                        <View style={styles.priceTotalContainer}>
                            <Typography style={styles.price}>{currencyType} {product?.price} X {product?.cart_quantity}</Typography>
                            <Typography style={styles.totalPrice}>Total : {currencyType} {product?.total}</Typography>
                        </View>
                        {
                            (Environment.isWholeSalesEnvironment() &&  product?.doorstep ) ?
                            <Typography style={styles.doorStep}>+ Door Delivery : {currencyType} {product?.doorstep}</Typography>
                            : <></>
                        }
                        <Typography style={styles.category}>{product?.quantity} Available</Typography>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
