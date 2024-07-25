import React, {useState} from "react";
import {_styles} from './styles'
import ButtonSheet from "../../../shared/component/buttonSheet";
import * as action from "../../../redux/actions";
import {Image, TouchableOpacity, View} from "react-native";
import Typography from "../../../shared/component/typography";
import {Button, ButtonOutline} from "../../../shared/component/buttons";
import {ProductListInterface} from "../../../service/product/ProductListInterface";
import {store} from "../../../redux/store/store";
import CartService from "../../../service/cart/CartService";
import {normalize} from "../../../shared/helpers";
import {currencyType} from "../../../shared/constants/global";
import Counter from "../../../shared/component/counter";
import Toast from "react-native-toast-message";
import {Data} from "../../../service/product/show/interface/ProductInformationInterface.tsx";
import useDarkMode from "../../../shared/hooks/useDarkMode.tsx";

interface ProductList {
    product: ProductListInterface|Data|undefined,
}
export default function AddToCartDialog({product = undefined}: ProductList) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>();
    const {isDarkMode} = useDarkMode()
    const styles = _styles(isDarkMode)
    function addItemToCart() {
        setIsLoading(true);
        (new CartService().add(product?.id, (quantity ?? 1))).then((response) =>{
            setIsLoading(false);
            Toast.show({
                type: 'success',
                text1: 'Shopping Cart',
                text2: 'Item has been added to cart Successfully!',
                position : "top",
            });
            store.dispatch(action.setProductDialogData(undefined))
            setQuantity(1);
        }, (error)=>{
            console.log(error)
            setIsLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Shopping Cart',
                text2: 'There was an error adding Item to cart!',
                position : "top",
            });
        });
    }

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', {productId : product.id})

    }
    return (
        <ButtonSheet  dispatch={product !== undefined}>
            <View style={styles.bodyButtonSheet}>
                <Typography style={styles.titleButtonSheet}>ADD PRODUCT TO CART</Typography>
                <View style={styles.containerProduct}>
                    <TouchableOpacity onPress={navigateTo} style={styles.container}>
                        <View style={styles.containerImage}>
                            <Image style={styles.image} resizeMode="contain" source={{uri: product?.image}} />
                        </View>

                        <View style={styles.containerInfo}>
                            <View style={styles.actions}>
                                <Typography numberOfLines={2} ellipsizeMode={'tail'} style={styles.name}>{product?.name}</Typography>
                                {
                                    product?.special !== undefined ?
                                        <View style={{flexDirection : "row", justifyContent: 'space-between', marginTop: normalize(5)}}>
                                            <Typography style={styles.price}>{currencyType} {product?.special}</Typography>
                                            <View style={{width:normalize(10)}}/>
                                            <Typography style={styles.special}>{currencyType} {product?.price}</Typography>
                                        </View>
                                        :
                                        <Typography style={styles.price}>{currencyType} {product?.price}</Typography>
                                }
                                <Typography style={styles.doorStep}>+ Door Delivery : {currencyType} {product?.doorstep}</Typography>
                                <Typography style={styles.category}>{product?.quantity} Available</Typography>
                            </View>
                            <View style={styles.actions}>
                                <Counter onChange={(quantity) => {
                                    setQuantity(quantity)
                                }} />
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>

                <View style={styles.footerButtonSheet}>
                    <View style={{flex: 1}}>
                        <Button  title="ADD TO CART" disabled={isLoading} loading={isLoading} onPress={addItemToCart} />
                    </View>
                    <View style={{width: 10}} />
                    <View style={{flex: 1}}>
                        <ButtonOutline onPress={() =>{
                            store.dispatch(action.setProductDialogData(undefined))
                        }} title="CANCEL" />
                    </View>
                </View>
            </View>
        </ButtonSheet>
    );
}
