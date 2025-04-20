import React, {useState} from 'react';
import {View, Text, Modal, Image, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {normalize} from "@/shared/helpers";
import {currencyType} from "@/shared/constants/global.ts";
import {design, labels, palette, semantic} from "@/shared/constants/colors.ts";
import CartService from "@/service/cart/CartService.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import {ProductListInterface} from "@/service/product/ProductListInterface.tsx";
import {Data} from "@/service/product/show/interface/ProductInformationInterface.tsx";
import {store} from "@/redux/store/store.tsx";
import * as action from "@/redux/actions";
import Typography from "@/shared/component/typography";
import Counter from "@/shared/component/counter";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import Environment from "@/shared/utils/Environment.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
// Import your normalize function

interface ProductList {
    visible : boolean;
    product: ProductListInterface|Data|undefined,
}

// @ts-ignore
const ProductDialog = ({visible, product}:ProductList) => {

    const [buyNowQuantity, setBuyNowQuantity] = useState(1);
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [addToCartQuantity, setAddToCartQuantity] = useState(1);
    const navigation = useNavigation<NavigationProps>();
    const cartService = new CartService();

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('checkout')
        onClose();
    }

    function buyNow()
    {
        // @ts-ignore
        if(parseInt(product?.max == "0" ? product?.quantity : product?.max) >= addToCartQuantity) {
            setBuyNowLoading(true);
            cartService.add(product?.id, buyNowQuantity).then((response) => {
                setBuyNowLoading(false);
                if (response.data.status === true) {
                    onClose();
                    navigateTo();
                }
            })
        }else {
            Toastss("Insufficient quantity, Total available quantity is "+product?.quantity);
        }
    }

    function addToCart()
    {
// @ts-ignore
        if(parseInt(product?.quantity) >= addToCartQuantity) {
            setAddToCartLoading(true);
            cartService.add(product?.id, addToCartQuantity).then((response) => {
                if (response.data.status === true) {
                    Toasts('Item has been added to cart Successfully!');
                    onClose()
                }
                setAddToCartLoading(false);
            })
        } else {
            Toastss("Insufficient quantity, Total available quantity is "+product?.quantity);
        }

    }

    function onClose() {
        store.dispatch(action.setProductDialogData(undefined))
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Cancel Button */}
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Typography style={styles.cancelButtonText}>X</Typography>
                    </TouchableOpacity>

                    {/* Product Image */}
                    <Image source={{ uri: product?.image }} style={styles.productImage} />

                    {/* Product Details */}
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
                        <Counter onChange={(qty, typeOperation) =>{
                            setBuyNowQuantity(qty);
                            setAddToCartQuantity(qty);
                        }} />
                    </View>
                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity disabled={addToCartLoading}  style={styles.addToCartButton} onPress={addToCart}>
                            {
                                addToCartLoading ? <ActivityIndicator color={semantic.background.white.w500} /> :  <Typography style={styles.buttonText}>Add to Cart</Typography>
                            }

                        </TouchableOpacity>
                        <TouchableOpacity disabled={buyNowLoading}  style={styles.buyNowButton} onPress={buyNow}>
                            {
                                buyNowLoading ? <ActivityIndicator color={palette.main.p500} /> :  <Typography style={styles.buttonText2}>Buy Now</Typography>
                            }

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: normalize(320),
        height: normalize(410),
        backgroundColor: 'white',
        borderRadius: normalize(10),
        alignItems: 'center',
    },
    productImage: {
        width: normalize(120),
        height: normalize(150),
        resizeMode: 'contain',
        marginBottom: normalize(10),
    },
    productName: {
        fontSize: normalize(15),
        fontWeight: 'bold',
        paddingHorizontal: normalize(10),
        color: '#333',
    },
    productPrice: {
        fontSize: normalize(16),
        fontWeight: 'bold',
        color: 'red',
        marginVertical: normalize(5),
    },
    doorstep: {
        fontSize: normalize(8),
        fontWeight: 'bold',
        color: 'red',
    },
    promoPrice: {
        color: 'red',
        fontWeight: 'bold',
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: 'gray',
        fontSize: normalize(14),
        marginLeft: normalize(5),
    },
    productCategory: {
        color: design.text1.color,
        backgroundColor :  design.text1.background,
        padding: normalize(2),
        paddingLeft : normalize(10),
        paddingRight : normalize(10),
        borderRadius: normalize(5),
        fontWeight: '500',
        fontSize: normalize(10),
    },
    productQuantity: {
        color: design.text1.color,
        backgroundColor :  design.text1.background,
        padding: normalize(2),
        paddingLeft : normalize(10),
        paddingRight : normalize(10),
        borderRadius: normalize(5),
        fontWeight: '500',
        fontSize: normalize(10),
    },
    productExpiry: {
        color: labels.type1.textColor,
        backgroundColor :  labels.type1.background,
        padding: normalize(2),
        paddingLeft : normalize(10),
        paddingRight : normalize(10),
        borderRadius: normalize(5),
        fontWeight: '500',
        fontSize: normalize(10),
    },
    productCarton: {
        color: labels.type2.textColor,
        backgroundColor :  labels.type2.background,
        padding: normalize(2),
        paddingLeft : normalize(10),
        paddingRight : normalize(10),
        borderRadius: normalize(5),
        fontWeight: '500',
        fontSize: normalize(10),
        marginVertical: normalize(8),
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        padding: normalize(10),
    },
    addToCartButton: {
        flex: 1,
        flexDirection : 'row',
        backgroundColor: 'red',
        padding: normalize(10),
        borderRadius: normalize(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: normalize(5),
    },
    buyNowButton: {
        flex: 1,
        flexDirection : 'row',
        borderWidth: normalize(1),
        borderColor: semantic.alert.danger.d500,
        padding: normalize(10),
        justifyContent: 'center',
        borderRadius: normalize(5),
        alignItems: 'center',
        marginLeft: normalize(5),
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: normalize(14),
        flex: 1,
        textAlign: 'center',
    },

    buttonText2: {
        color : semantic.alert.danger.d500,
        fontWeight: 'bold',
        fontSize: normalize(14),
        flex: 1,
        textAlign: 'center',
    },
    cancelButton: {
        position: 'absolute',
        top: normalize(10),
        right: normalize(10),
        backgroundColor: 'red',
        width: normalize(30),
        height: normalize(30),
        borderRadius: normalize(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: normalize(18),
        fontWeight: 'bold',
    },
    quantityHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: normalize(5),
        paddingLeft: normalize(20),
        justifyContent: 'space-between',

    },
    quantity: {
        fontWeight: '700',
        fontSize: normalize(15)
    },
});

export default ProductDialog;
