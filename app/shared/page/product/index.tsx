import React, {useState} from 'react';
import { Image, ScrollView, View } from "react-native";
import {_styles} from './styles'
import Header from "./components/header";
import useDarkMode from "@/shared/hooks/useDarkMode";
import Typography from "@/shared/component/typography";
import Icon from "@/shared/component/icon";
import {star,  shoppingBag, white_shopping_cart} from "@/assets/icons";
import Counter from "@/shared/component/counter";
import { currencyType } from "@/shared/constants/global.ts";
import {Button, ButtonOutline} from "@/shared/component/buttons";
import {useNavigation, useRoute} from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import ProductService from "@/service/product/show/ProductService";
import {ProductInformationInterface, Data} from "@/service/product/show/interface/ProductInformationInterface";
import Toasts from "@/shared/utils/Toast.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import CartService from "@/service/cart/CartService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import Environment from "@/shared/utils/Environment.tsx";
import HeaderWithIcon from "@/shared/component/headerBack";

export default function DetailProduct() {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const {isDarkMode} = useDarkMode()
    const styles = _styles(isDarkMode)
    const [isLoading, setIsLoading] = useState(false);
    const productService = new ProductService();
    const [productInformation, setProductInformation] = useState<ProductInformationInterface>();
    const [buyNowQuantity, setBuyNowQuantity] = useState(1);
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [addToCartQuantity, setAddToCartQuantity] = useState(1);
    const cartService = new CartService();

    useEffectOnce(function(){
        // @ts-ignore
        const productId = route.params?.productId;
        if(!productId) {
            Toasts('Unknown error occurred!');
            navigation.goBack();
        }
        setIsLoading(true)
        productService.getProduct(productId).then((response) => {
            setIsLoading(false);
            setProductInformation(response.data);
        }, (error)=>{
            setIsLoading(false);
            Toasts('Unknown error occurred!')
            navigation.goBack();
        });
    },[]);

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('checkout')

    }

    function buyNow()
    {
        // @ts-ignore
        if(parseInt(productInformation?.data.max === 0 ? productInformation?.data.quantity : productInformation?.max) >= addToCartQuantity) {
            setBuyNowLoading(true);
            cartService.add(productInformation?.data.id, buyNowQuantity).then((response) => {
                if (response.data.status === true) {
                    navigateTo();
                }
                setBuyNowLoading(false);
            })
        } else {
            Toastss("Insufficient quantity, Total available quantity is "+productInformation?.data.max);
        }
    }

    function addToCart()
    {
        // @ts-ignore
        if(parseInt(productInformation?.data.max === 0 ? productInformation?.data.quantity : productInformation?.max) >= addToCartQuantity) {
            setAddToCartLoading(true);
            cartService.add(productInformation?.data.id, addToCartQuantity).then((response) => {
                if (response.data.status === true) {
                    Toasts('Item has been added to cart Successfully!')
                }
                setAddToCartLoading(false);
            })
        } else {
            // @ts-ignore
            Toastss("Insufficient quantity, Total available quantity to order is "+ productInformation?.data.quantity);
        }
    }



    return (
        <WrapperNoScroll loading={isLoading}>
            <HeaderWithIcon  title={productInformation?.data.name}/>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {
                    // @ts-ignore
                    (productInformation?.data.box > 1 && Environment.isSuperMarketEnvironment()) ? <Typography style={styles.sachetStyle}>This Product is sold as individual sachets.</Typography> : <></>
                }
                <View style={styles.containerImage}>
                    <Image resizeMode="contain" style={styles.image} source={{uri: productInformation?.data.image}} />
                </View>

                <View style={{flex : 1, flexDirection : 'row', alignItems : 'center'}}>

                    <View style={styles.containerName}>
                        <Typography style={styles.name}>{productInformation?.data.name}</Typography>
                    </View>
                </View>
                <View style={{flex : 1, flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                    {
                        (productInformation?.data.special !== undefined && productInformation?.data.special)
                            ?
                            <View style={styles.priceHolder}>
                                <Typography style={styles.special} >{currencyType} {productInformation?.data.price}</Typography>
                                <Typography style={styles.total} >{currencyType} {productInformation?.data.special}</Typography>
                            </View>
                            :
                            <View style={styles.priceHolder}>
                                <Typography style={styles.total} >{currencyType} {productInformation?.data.price}</Typography>
                            </View>
                    }
                    <Typography style={styles.quantityStyle}>{productInformation?.data.store.quantity} Available</Typography>
                </View>
                <View style={styles.containerCantSold}>
                    <View style={styles.sold}>
                        <Typography >{productInformation?.data.totalSold}</Typography>
                        <View style={styles.space} />
                        <Typography>Sold</Typography>
                    </View>
                    {
                        productInformation?.data.classification ?
                            <Typography style={styles.cartonStyle}>{productInformation?.data.classification}</Typography>
                            : <></>
                    }
                </View>
                <View style={{flex : 1, flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                    {
                        Environment.isWholeSalesEnvironment() ?  <Typography style={styles.categoryStyle}>Carton: {productInformation?.data.carton}</Typography> : <></>
                    }
                    {
                        productInformation?.data.store.expiry_date ?  <Typography style={styles.expiryStyle}>Expiry Date :{productInformation?.data.store.expiry_date}</Typography> : <></>
                    }

                </View>


                <View style={styles.separator} />

                {
                    productInformation?.data.description.length === 0 ? <></> :

                        <View style={styles.containerDescription}>
                            <Typography style={styles.descriptionTitle}>Description</Typography>

                            <Typography style={styles.description} >
                                {productInformation?.data.description}
                            </Typography>
                        </View>
                }

            </ScrollView>
            <View style={styles.containerFooter}>
                <View style={styles.quantityHolder}>
                    <Typography style={styles.quantity}>Quantity</Typography>
                    <Counter onChange={(qty, typeOperation) =>{
                        setBuyNowQuantity(qty);
                        setAddToCartQuantity(qty);
                    }} />
                </View>
                <View style={styles.buttonsHolder}>
                    <View style={{flex :0.45}}>
                        <ButtonOutline loading={buyNowLoading} disabled={buyNowLoading} onPress={buyNow} leftIcon={<Icon customStyles={{tintColor: 'red'}} icon={shoppingBag} />} title="Buy Now" />
                    </View>
                    <View style={{flex :0.5}}>
                        <Button loading={addToCartLoading} disabled={addToCartLoading} onPress={addToCart} leftIcon={<Icon customStyles={{tintColor: 'white'}} icon={white_shopping_cart} />} title="Add To cart" />
                    </View>
                </View>
            </View>
        </WrapperNoScroll>
    )
}
