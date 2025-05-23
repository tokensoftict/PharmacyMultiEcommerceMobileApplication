import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { currencyType } from "@/shared/constants/global";
import {_styles} from './styles'
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { useNavigation } from "@react-navigation/native";

import Counter from "../counter";
import {NavigationProps} from "@/shared/routes/stack";
import {ProductListInterface} from "@/service/product/ProductListInterface";
import {normalize} from "@/shared/helpers";
import Environment from "@/shared/utils/Environment.tsx";

interface ProductList {
    product: ProductListInterface|undefined,
}
export default function CardProductHorizontal({product}: ProductList) {
    const {isDarkMode} = useDarkMode()
    const styles = _styles(isDarkMode)
    const [cant, setCant] = useState(1)
    const navigation = useNavigation<NavigationProps>();

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', {productId : product.id})

    }

    return (
        <TouchableOpacity onPress={navigateTo} style={styles.container}>
            <View style={styles.containerImage}>
                <Image style={styles.image} resizeMode="contain" source={{uri: product?.image}} />
            </View>

            <View style={styles.containerInfo}>
                <View style={styles.actions}>
                    <Typography numberOfLines={2} ellipsizeMode={'tail'} style={styles.name}>{product?.name}</Typography>
                    {
                        product?.special !== false ?
                            <View style={{flexDirection : "row", justifyContent: 'space-between', marginTop: normalize(5)}}>
                                <Typography style={styles.price}>{currencyType} {product?.special}</Typography>
                                <View style={{width:normalize(10)}}/>
                                <Typography style={styles.special}>{currencyType} {product?.price}</Typography>
                            </View>
                        :
                         <Typography style={styles.price}>{currencyType} {product?.price}</Typography>
                    }
                    {
                        (Environment.isWholeSalesEnvironment() &&  product?.doorstep ) ?
                        <Typography style={styles.doorStep}>+ Door Delivery : {currencyType} {product?.doorstep}</Typography>
                        : <></>
                    }
                    <Typography style={styles.category}>{product?.quantity} Available</Typography>
                </View>
                <View style={styles.actions}>
                    <Counter onChange={(newCant) => setCant(newCant)} />
                    {
                        // @ts-ignore
                        product?.special_not_formatted ?
                            // @ts-ignore
                            <Typography style={styles.totalPrice}>{currencyType} { (product?.special_not_formatted * cant).toFixed(2) }</Typography>
                            :
                            // @ts-ignore
                            <Typography style={styles.totalPrice}>{currencyType} { (product?.price_not_formatted * cant).toFixed(2) }</Typography>
                    }
                </View>
            </View>

        </TouchableOpacity>
    )
}
