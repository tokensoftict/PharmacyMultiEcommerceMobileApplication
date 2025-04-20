import React, { useState } from "react";
import  {Text, Image, TouchableOpacity, View} from "react-native";
import Typography from "../typography";
import { currencyType } from "../../constants/global";
import {_styles} from './styles'
import useDarkMode from "../../hooks/useDarkMode.tsx";
import { useNavigation } from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack";
import {IconButton} from "react-native-paper";
import {trash} from "@/assets/icons";
import {normalize} from "@/shared/helpers";
import {Items} from "@/service/wishlist/interface/WishlistInterface";
import Environment from "@/shared/utils/Environment.tsx";

interface ProductList {
    product: Items | undefined,
    onRemoveItem : Function
}
export default function WishlistItemHorizontalList({product, onRemoveItem}: ProductList) {
    const {isDarkMode} = useDarkMode()
    const styles = _styles(isDarkMode)
    const [cant, setCant] = useState(1)
    const navigation = useNavigation<NavigationProps>();

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', {productId : product.id})

    }

    return (
        <View style={styles.container}>
            <View style={styles.actionsHeader}>
                <TouchableOpacity style={styles.viewOrderButton}>
                    <Typography style={styles.buttonText}>Add to Cart</Typography>
                </TouchableOpacity>
                <IconButton size={normalize(20)} iconColor={'red'} icon={trash} onPress={() =>onRemoveItem(product)} />
            </View>
            <TouchableOpacity onPress={navigateTo} style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.containerImage}>
                        <Image style={styles.image} resizeMode="contain" source={{uri: product?.image}} />
                    </View>

                    <View style={styles.containerInfo}>
                        <View style={styles.actions}>
                            <Typography numberOfLines={1} ellipsizeMode={'tail'} style={styles.name}>{product?.name}</Typography>
                            <View style={styles.priceTotalContainer}>
                                <Typography style={styles.price}>{currencyType} {product?.price}</Typography>
                            </View>
                            {
                                (Environment.isWholeSalesEnvironment() &&  product?.doorstep )  ?
                                    <Typography style={styles.doorStep}>+ Door Delivery : {currencyType} {product?.doorstep}</Typography>
                                    : <></>
                            }
                            <Typography style={styles.category}>{product?.quantity} Available</Typography>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
