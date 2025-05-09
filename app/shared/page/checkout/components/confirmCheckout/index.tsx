import {
    ScrollView,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator, Alert
} from "react-native";
import {normalize} from "@/shared/helpers";
import {close, shoppingBag} from "@/assets/icons";
import React, {useCallback, useState} from "react";
import {palette, semantic} from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import {currencyType} from "@/shared/constants/global.ts";
import {useFocusEffect} from "@react-navigation/native";
import Toasts from "@/shared/utils/Toast.tsx";
import {CartInterface} from "@/service/cart/interface/CartInterface.tsx";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import OverlayLoader from "@/shared/component/overlayLoader";
import CheckBox from "@/shared/component/checkbox";
import CheckoutService from "@/service/checkout/CheckoutService.tsx";
import ButtonSheet from "@/shared/component/buttonSheet";
import Icon from "@/shared/component/icon";
import ErrorText from "@/shared/component/ErrorText";
import Environment from "@/shared/utils/Environment.tsx";
import SubHeader from "@/shared/component/subHeader";
import {useGlobal} from "@/shared/helpers/GlobalContext.tsx";

export default function ConfirmCheckout({ onValidate }: { onValidate: (validateFn: () => Promise<boolean>) => void })  {
    const [isLoading, setIsLoading] = useState(false);
    const {isDarkMode} = useDarkMode();
    const checkOutService = new CheckoutService();
    const [couponDialog, setCouponDialog] = useState(false);
    const [couponValue, setCouponValue] = useState("");
    const [errorCouponValue, setErrorCouponValue] = useState("");
    const [applyCouponLoading, setApplyCouponLoading] = useState(false);
    const [removeCouponLoading, setRemoveCouponLoading] = useState(false);
    const [hasCoupon, setHasCoupon] = useState(undefined);
    const {checkoutButton, setCheckoutButton} = useGlobal();
    const [confirmOrderDetails, setConfirmOrderDetails] = useState<any>({
        'totalToPay' : 0,
        'totalToPayFormatted' : 0.0,
        'paymentAnalysis' : []
    });


    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            loadConfirmOrder();
        }, [])
    );


    function loadConfirmOrder() {
        setIsLoading(true);
        setCheckoutButton(false);
        checkOutService.getConfirmOrder().then((response) => {
            if(response.data.status) {
                setConfirmOrderDetails(response.data.data);
                setCheckoutButton(true);
                response.data.data.paymentAnalysis.forEach((item: any) => {
                    if(item?.hasCoupon === true) {
                        setHasCoupon(item);
                    }
                })
            }

            setIsLoading(false);
        });
    }


    function toggleExtraTotal(analysis : any)
    {
        checkOutService.removeOrAddOrderTotal(analysis.id).then((response) => {
            loadConfirmOrder();
        })
    }


    function applyCoupon() {
        setErrorCouponValue("");
        if(couponValue === "") {
            setErrorCouponValue("Please enter your coupon code.")
        } else {
            setApplyCouponLoading(true);
            checkOutService.applyCouponCode(couponValue).then((response) => {
                setApplyCouponLoading(false);
                if(response.data.status === true) {
                    loadConfirmOrder();
                    setCouponDialog(false);
                    Toasts("Coupon / Voucher Code has been applied successfully.");
                } else {
                    setErrorCouponValue(response.data.error);
                }
            })
        }
    }


    function removeCoupon() {
        // @ts-ignore
        Alert.alert('PS GDC', 'Are you sure you to remove this '+hasCoupon.discount_type+' ?', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {text: 'Yes', onPress: () => {
                    setRemoveCouponLoading(true);
                    checkOutService.removeCouponOrVoucher().then((response) => {
                        setRemoveCouponLoading(false);
                        setHasCoupon(undefined);
                        if(response.data.status === true) {
                            setCouponDialog(false);
                            loadConfirmOrder();
                        }
                    })
                }}
        ])
    }


    const styles = StyleSheet.create({
        container: {
            marginTop: normalize(20),
        },
        inputGroup: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: normalize(30),
            padding: normalize(5),
            elevation: normalize(5), // Shadow for Android
            shadowColor: "#000", // Shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },
        input: {
            flex: 0.8,
            fontSize: normalize(18),
            paddingHorizontal: normalize(15),
            color: "#333",
            borderTopLeftRadius: normalize(30),
            borderBottomLeftRadius: normalize(30),
        },
        button: {
            flex: 0.2,
            backgroundColor: semantic.alert.danger.d500, // Orange Gradient-like Button
            paddingVertical: normalize(14),
            paddingHorizontal: normalize(20),
            borderTopRightRadius: normalize(30),
            borderBottomRightRadius: normalize(30),
        },
        buttonText: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
        },
        removeButtonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: normalize(14),
            flex: 1,
            textAlign: 'center',
        },
        removeButton: {
            flex: 1,
            flexDirection : 'row',
            backgroundColor: 'red',
            padding: normalize(10),
            borderRadius: normalize(5),
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: normalize(5),
        }

    });


    return (
        <View style={{
            flex: 1,
        }}>
            {
                Environment.isSuperMarketEnvironment() ?
                    <View style={{zIndex:20, right : normalize(90), top : normalize(23), position : 'absolute',display : "flex", marginRight: normalize(-100)}}>
                        <TouchableOpacity onPress={() => {setCouponDialog(true);}}>
                            <Typography style={{color : semantic.alert.danger.d500, fontSize: normalize(12), fontWeight: '600', marginTop : normalize(4)}}>{
                                // @ts-ignore
                                hasCoupon !== undefined ? "Remove "+hasCoupon.discount_type : "Apply Coupon or Voucher ?"
                            }</Typography>
                        </TouchableOpacity>
                    </View> :
                    <></>
            }
            <SubHeader icon={shoppingBag}   title="Confirm Order" />
            <View style={{
                position : 'absolute',
                left : normalize(-60),
                right :  normalize(-60),
                bottom : normalize(90),
                paddingBottom : normalize(10),
                paddingHorizontal : normalize(40),
                backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w100,
            }}>
                {
                    isLoading
                        ?
                        <View style={{height: isLoading ? 100 : 'auto'}}>
                            <OverlayLoader loading={isLoading} title={""} height={100} />
                        </View>
                        :
                        <>
                            {
                                confirmOrderDetails.paymentAnalysis.length > 0 &&
                                <View style={{ flex : 1, paddingVertical : normalize(15), flexDirection : 'column', justifyContent : 'space-between', height: 'auto', backgroundColor : semantic.alert.danger.d100}}>
                                    {

                                        confirmOrderDetails.paymentAnalysis.map((item: any, index : number) => {
                                            return (

                                                <View key={item.name} style={{ paddingHorizontal:normalize(10), paddingVertical : normalize(5),  borderStyle:"solid",  flexDirection: 'row', alignItems: 'flex-start',  justifyContent : 'space-between'}}>
                                                    <View style={{width:'72%', display : 'flex', flexDirection : 'row'}}>
                                                        {
                                                            item?.id &&  <CheckBox onChange={() => toggleExtraTotal(item)} value={item.autoCheck} />

                                                        }
                                                        <View style={{width : normalize(4)}}></View>
                                                        <Typography numberOfLines={1} style={{fontWeight :'500', width : '100%', fontSize: normalize(12)}}>{item.name}</Typography>
                                                    </View>

                                                    <Typography style={{fontWeight :'500'}}>{currencyType} {item.amount_formatted}</Typography>
                                                </View>

                                            )
                                        })
                                    }
                                </View>
                            }

                            <View style={{
                                borderStyle : 'dashed',
                                borderWidth : 2,
                                borderColor : palette.main.p500,
                                height : normalize(50),
                                flex : 1,
                                alignItems : 'center',
                                justifyContent : 'center'
                            }}>
                                <Typography
                                    style={{
                                        fontWeight : '600',
                                        fontSize: normalize(25),
                                    }}
                                >
                                    {
                                        currencyType+" "+confirmOrderDetails.totalToPayFormatted
                                    }
                                </Typography>
                            </View>
                        </>
                }
            </View>
            <ButtonSheet dispatch={couponDialog} height={normalize(220)}>
                <View style={{padding: normalize(24)}}>
                    <TouchableOpacity onPress={() => setCouponDialog(false)} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography style={{fontWeight: '700', fontSize: normalize(18), marginBottom: normalize(10)}}>{
                            // @ts-ignore
                            hasCoupon !== undefined ? "REMOVE "+hasCoupon.discount_type.toUpperCase() : "APPLY COUPON OR VOUCHER"
                        }</Typography>
                        <Icon icon={close} height={normalize(30)} customStyles={{marginTop:normalize(-15)}} tintColor={palette.main.p100}  />
                    </TouchableOpacity>

                    {
                        hasCoupon !== undefined ?

                            <View style={{justifyContent : "space-around", marginTop: normalize(10)}}>
                                <View style={{flexDirection : "row", justifyContent : "space-between", marginBottom:normalize(10)}}>
                                    <Typography style={{fontWeight :'500'}}>Name :</Typography>
                                    <Typography style={{fontWeight :'600'}}>{
                                        // @ts-ignore
                                        hasCoupon.name
                                    }</Typography>
                                </View>
                                <View style={{flexDirection : "row", justifyContent : "space-between",  marginBottom:normalize(10)}}>
                                    <Typography style={{fontWeight :'500'}}>Value :</Typography>
                                    <Typography style={{fontWeight :'600'}}>{
                                        // @ts-ignore
                                        hasCoupon.amount_formatted
                                    }</Typography>
                                </View>
                                <View style={{flexDirection : "row", justifyContent : "space-between", marginBottom:normalize(10)}}>
                                    <Typography style={{fontWeight :'500'}}>Type :</Typography>
                                    <Typography style={{fontWeight :'600'}}>{
                                        // @ts-ignore
                                        hasCoupon.type
                                    }</Typography>
                                </View>
                                <View style={{paddingHorizontal: normalize(75),flexDirection: 'row', width: '100%', padding: normalize(10),}}>
                                    <TouchableOpacity disabled={removeCouponLoading}  style={styles.removeButton} onPress={removeCoupon}>
                                        { removeCouponLoading ?  <ActivityIndicator color={semantic.background.white.w500} /> :  <Typography style={styles.removeButtonText}>Remove {
                                            // @ts-ignore
                                            hasCoupon.discount_type
                                        }</Typography> }
                                    </TouchableOpacity>
                                </View>

                            </View>
                            :  <View style={styles.container}>
                                <View style={styles.inputGroup}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={"Coupon or Voucher"}
                                        placeholderTextColor="#aaa"
                                        value={couponValue}
                                        onChangeText={(text) => setCouponValue(text)}
                                    />
                                    <TouchableOpacity onPressIn={applyCoupon} disabled={applyCouponLoading} style={styles.button} onPress={() => {}}>
                                        {
                                            applyCouponLoading ?  <ActivityIndicator color={"white"}></ActivityIndicator> :
                                                <Typography style={styles.buttonText}>Apply</Typography>
                                        }
                                    </TouchableOpacity>
                                </View>
                                {
                                    errorCouponValue !== "" ?   <View style={{marginTop: normalize(5)}}>
                                        <ErrorText numberOfLines={2}>{errorCouponValue}</ErrorText>
                                    </View> : <></>
                                }

                            </View>
                    }

                </View>
            </ButtonSheet>
        </View>
    );

}
