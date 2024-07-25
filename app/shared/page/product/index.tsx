import React, {useState} from 'react';
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import {_styles} from './styles'
import Header from "./components/header";
import useDarkMode from "../../../shared/hooks/useDarkMode";
import Typography from "../../../shared/component/typography";
import Icon from "../../../shared/component/icon";
import {star, shippingCart, shoppingBag, white_shopping_cart} from "../../../assets/icons";
import Counter from "../../../shared/component/counter";
import { currencyType } from "../../../shared/constants/global.ts";
import { Button } from "../../../shared/component/buttons";
import {useNavigation, useRoute} from "@react-navigation/native";
import { NavigationProps } from "../../routes/stack";
import useEffectOnce from "../../../shared/hooks/useEffectOnce";
import ProductService from "../../../service/product/show/ProductService";
import {ProductInformationInterface, Data} from "@/service/product/show/interface/ProductInformationInterface";
import Toast from "react-native-toast-message";
import WrapperNoScroll from "../../../shared/component/wrapperNoScroll";
import {ProductListInterface} from "@/service/product/ProductListInterface.tsx";
import {store} from "../../../redux/store/store.tsx";
import AddToCartDialog from "../../../shared/component/addToCartDialog";
import * as action from "../../../redux/actions";
import {semantic} from "../../../shared/constants/colors";

export default function DetailProduct() {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const {navigate} = useNavigation<NavigationProps>()
    const {isDarkMode} = useDarkMode()
    const styles = _styles(isDarkMode)
    const [isLoading, setIsLoading] = useState(false);
    const productService = new ProductService();
    const [productInformation, setProductInformation] = useState<ProductInformationInterface>();
    const [addToCartProduct, setAddToCartProduct] = useState<Data>()


    useEffectOnce(function(){
        // @ts-ignore
        const productId = route.params?.productId;
        if(!productId) {
            Toast.show({
                type: 'error',
                text2: 'Unknown error occurred!',
                position : "top",
            });
            navigation.goBack();
        }
        setIsLoading(true)
        productService.getProduct(productId).then((response) => {
            setIsLoading(false);
            setProductInformation(response.data);
        }, (error)=>{
            setIsLoading(false);
            Toast.show({
                type: 'error',
                text2: 'Unknown error occurred!',
                position : "top",
            });
            navigation.goBack();
        });
    },[]);

    return (
        <WrapperNoScroll loading={isLoading}>
            <View style={styles.containerHeader}>
                <Header title={productInformation?.data.name} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={styles.containerImage}>
                    <Image resizeMode="contain" style={styles.image} source={{uri: productInformation?.data.image}} />
                </View>

                <View style={styles.containerName}>

                    <Typography style={styles.name}>{productInformation?.data.name}</Typography>
                    <TouchableOpacity style={styles.addToCart} onPress={() => {
                        store.dispatch(action.setProductDialogData(productInformation?.data))
                    }}>
                        <Icon width={32} height={32} tintColor={semantic.background.white.w500}  icon={white_shopping_cart} />
                    </TouchableOpacity>
                </View>

                <View style={styles.containerCantSold}>
                    <View style={styles.sold}>
                        <Typography >745</Typography>
                        <View style={styles.space} />
                        <Typography>Sold</Typography>
                    </View>
                    <View style={styles.separator} />
                    <TouchableOpacity onPress={() => navigate('login')} style={styles.row}>
                        <Icon customStyles={styles.sizeStar} icon={star} />
                        <View style={styles.space} />
                        <View style={styles.space} />
                        <Typography >4.7</Typography>
                        <View style={styles.space} />
                        <Typography >(3242</Typography>
                        <View style={styles.space} />
                        <Typography>Review)   </Typography>
                        <View style={styles.space} />
                        <Typography style={styles.quantityStyle}>{productInformation?.data.store.quantity} Available</Typography>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerDescription}>
                    <Typography style={styles.descriptionTitle}>Description</Typography>

                    <Typography style={styles.description} >
                        {productInformation?.data.description}
                    </Typography>
                </View>
            </ScrollView>
            <View style={styles.containerFooter}>
                <View style={styles.containerName}>
                    <Typography style={styles.quantity}>Quantity</Typography>
                    <Counter onChange={() => console.log('juga')} />
                </View>
                <View style={styles.containerName}>
                    <View style={{flex: 1,}}>
                        <Typography style={styles.price}>Price</Typography>
                        {
                            productInformation?.data.special !== undefined ?


                                <View style={styles.priceHolder}>
                                    <Typography style={styles.special} >{currencyType} {productInformation?.data.price}</Typography>
                                    <Typography style={styles.total} >{currencyType} {productInformation?.data.special}</Typography>
                                </View>
                                :
                                <Typography style={styles.total} >{currencyType} {productInformation?.data.price}</Typography>
                        }
                    </View>
                    <View style={{flex: 1}}>
                        <Button leftIcon={<Icon customStyles={{tintColor: 'white'}} icon={shoppingBag} />} title="Buy Now" />
                    </View>
                </View>
            </View>
        </WrapperNoScroll>
    )
}
