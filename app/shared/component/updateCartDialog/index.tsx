import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, TouchableOpacity, View} from "react-native";
import {styles} from './styles';
import Typography from "@/shared/component/typography";
import {currencyType} from "@/shared/constants/global.ts";
import Environment from "@/shared/utils/Environment.tsx";
import {normalize} from "@/shared/helpers";
import Counter from "@/shared/component/counter";
import {palette, semantic} from "@/shared/constants/colors.ts";
import CartService from "@/service/cart/CartService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import {useFocusEffect} from "@react-navigation/native";


interface ProductList {
    product: any,
    visible : boolean,
    onClose : any,
    onCartUpdated : any
}
export default function UpdateCartDialog({product, onClose, visible, onCartUpdated}: ProductList) {
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [addToCartQuantity, setAddToCartQuantity] = useState(product?.cart_quantity);
    const [removeProductLoading, setRemoveProductLoading] = useState(false);
    const cartService = new CartService();

    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus\
            setAddToCartQuantity(product?.cart_quantity);
        }, [product?.cart_quantity])
    );


    function removeProduct() {
        setRemoveProductLoading(true);
        cartService.remove(product.id).then((response) => {
            setRemoveProductLoading(false);
            if(response.data.status === true) {
                Toastss("Product has been removed successfully ");
                onClose(false);
                onCartUpdated();
            } else {
                Toastss("There was an error removing the product, please try again.");
            }
        })
    }


    function updateCart()
    {
        if(parseInt(product?.quantity) >= addToCartQuantity) {
            setAddToCartLoading(true);
            cartService.add(product?.id, addToCartQuantity).then((response) => {
                if (response.data.status === true) {
                    Toastss('Item has been updated Successfully!');
                    onClose(false);
                    onCartUpdated();
                }
                setAddToCartLoading(false);
            })
        } else {
            Toastss("Insufficient quantity, Total available quantity is "+product?.quantity);
        }

    }


    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => {onClose(false)}}>
                        <Typography style={styles.cancelButtonText}>X</Typography>
                    </TouchableOpacity>

                    <Image source={{ uri: product?.image }} style={styles.productImage} />
                    <Typography style={styles.productName}>{product?.name}</Typography>
                    <Typography style={styles.productPrice}>
                        {product?.special ? (
                            <>
                                <Typography style={styles.promoPrice}>{currencyType} {product?.special} </Typography>
                                <Typography style={styles.originalPrice}>{currencyType} {product?.price}</Typography>
                            </>
                        ) : (
                            currencyType+' '+product?.price
                        )}
                    </Typography>
                    {  (Environment.isWholeSalesEnvironment() &&  product?.doorstep )  ?
                        <Typography style={styles.doorstep}>
                            + Door Delivery: {product?.doorstep}
                        </Typography>
                        : <></>
                    }
                    <View style={{flex : 1, flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', width : '100%', paddingHorizontal : normalize(30)}}>
                        <Typography style={styles.productCategory}>Category: {'N/A'}</Typography>
                        <Typography style={styles.productQuantity}>{product?.quantity} Available</Typography>
                    </View>

                    <View style={{flex : 1, flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', width : '100%', paddingHorizontal : normalize(30)}}>
                        { product?.expiry_date ?
                            <Typography style={styles.productExpiry}>Expiry: {product?.expiry_date}</Typography>
                            : <></>
                        }
                        <Typography style={styles.productCarton}>Carton: {product?.carton}</Typography>
                    </View>

                    <View style={styles.quantityHolder}>
                        <Typography style={styles.quantity}>Quantity</Typography>
                        <Counter cant={product?.cart_quantity} onChange={(qty, typeOperation) =>{
                            setAddToCartQuantity(qty);
                        }} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity disabled={addToCartLoading}  style={styles.addToCartButton} onPress={updateCart}>
                            {
                                addToCartLoading ? <ActivityIndicator color={semantic.background.white.w500} /> :  <Typography style={styles.buttonText}>Update Cart</Typography>
                            }

                        </TouchableOpacity>
                        <TouchableOpacity disabled={removeProductLoading}  style={styles.buyNowButton} onPress={removeProduct}>
                            {
                                removeProductLoading ? <ActivityIndicator color={palette.main.p500} /> :  <Typography style={styles.buttonText2}>Remove</Typography>
                            }

                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
