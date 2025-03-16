import { ScrollView, View, Dimensions} from "react-native";
import {normalize} from "@/shared/helpers";
import HeaderWithIcon from "@/shared/component/headerBack";
import {shoppingBag} from "@/assets/icons";
import React, {useCallback, useState} from "react";
import {palette, semantic} from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import {currencyType} from "@/shared/constants/global.ts";
import {useFocusEffect} from "@react-navigation/native";
import CartService from "@/service/cart/CartService.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import {CartInterface} from "@/service/cart/interface/CartInterface.tsx";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import List from "@/shared/component/list";
import CartItemHorizontalList from "@/shared/component/cartItemHorizontalList";
import OverlayLoader from "@/shared/component/overlayLoader";
import CheckBox from "@/shared/component/checkbox";
import CheckoutService from "@/service/checkout/CheckoutService.tsx";

export default function ConfirmCheckout({ onValidate }: { onValidate: (validateFn: () => Promise<boolean>) => void })  {
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cartItemList, setCartItemList] = useState<CartInterface>();
    const {isDarkMode} = useDarkMode();
    const checkOutService = new CheckoutService();
    const [modalVisible, setModalVisible] = useState(false);

    const { height } = Dimensions.get('window');
    const isSmallScreen = height < 700; // iPhone SE and other small devices
    const componentHeight = isSmallScreen ? height * 0.35 : height * 0.43;

    const [confirmOrderDetails, setConfirmOrderDetails] = useState<any>({
        'totalToPay' : 0,
        'totalToPayFormatted' : 0.0,
        'paymentAnalysis' : []
    });

    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            loadCartItems();
        }, [])
    );



    function loadCartItems() {
        setIsCartLoading(true);
        (new CartService()).get().then((response) => {
           setIsCartLoading(false);
            if(response.data.status === true) {
                setCartItemList(response.data)
                loadConfirmOrder();
            }else {
                setIsCartLoading(response.data.message);
            }
        }, (error) => {
            setIsCartLoading(false);
            Toasts('There was an error while loading cart');
        })
    }

    function renderItem(item: any, key: number) {
        return <View style={{marginBottom: 10, flex: 1}} key={key}>
            <CartItemHorizontalList product={item} />
        </View>
    }

    function loadConfirmOrder() {
        setIsLoading(true);
        checkOutService.getConfirmOrder().then((response) => {
            if(response.status) {
                setConfirmOrderDetails(response.data.data);
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



    return (
        <View style={{
            flex: 1,
        }}>
            <View style={{paddingVertical: normalize(10)}}>
                <HeaderWithIcon icon={shoppingBag}   title="Your Order" />
            </View>


            <View style={{height:normalize(componentHeight)}}>
                {
                    isCartLoading ?
                        <View style={{height : '100%'}}>
                            <OverlayLoader loading={isCartLoading} title={""} height={normalize(componentHeight)} />
                        </View> :
                        <>

                            {
                                (cartItemList?.data.items ?? []).length > 0  ?
                                    <>
                                        <View  style={{height : normalize(20), flex: 1, paddingHorizontal: normalize(0)}}>
                                            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop : normalize(-5), flex: 1}}>
                                                <View style={{height: normalize(20)}} />
                                                <List
                                                    between
                                                    data={cartItemList?.data.items ?? []}
                                                    rows={1}
                                                    renderItem={renderItem}
                                                />
                                            </ScrollView>
                                        </View>
                                    </>
                                    :
                                    <></>
                            }

                        </>
                }
            </View>

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
                            <OverlayLoader loading={isCartLoading} title={""} height={100} />
                        </View>
                        :
                        <>
                            {
                                confirmOrderDetails.paymentAnalysis.length > 0 &&
                                <View style={{ flex : 1, paddingVertical : normalize(15), flexDirection : 'column', justifyContent : 'space-between', height: 'auto', backgroundColor : semantic.alert.danger.d100}}>
                                    {
                                        confirmOrderDetails.paymentAnalysis.map((item: any, index : number) => {
                                            return (
                                                <>
                                                    <View key={index} style={{ paddingHorizontal:normalize(10), paddingVertical : normalize(5),  borderStyle:"solid",  flexDirection: 'row', alignItems: 'flex-start',  justifyContent : 'space-between'}}>
                                                        <View style={{width:'72%', display : 'flex', flexDirection : 'row'}}>
                                                            {
                                                                item?.id &&  <CheckBox onChange={() => toggleExtraTotal(item)} value={item.autoCheck} />
                                                            }
                                                            <View style={{width : normalize(4)}}></View>
                                                            <Typography numberOfLines={1} style={{fontWeight :'500', width : '100%', fontSize: normalize(12)}}>{item.name}</Typography>
                                                        </View>

                                                        <Typography style={{fontWeight :'500'}}>{currencyType} {item.amount_formatted}</Typography>
                                                    </View>
                                                </>
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
        </View>
    );
}
