import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import Wrapper from "@/shared/component/wrapper";
import React, {useState} from "react";
import OrderService from "@/service/order/OrderService.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import {useNavigation, useRoute} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {ScrollView, View} from "react-native";
import {normalize} from "@/shared/helpers";
import {semantic} from "@/shared/constants/colors.ts";
import HeaderWithIcon from "@/shared/component/headerBack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {styles} from "./styles";
import Typography from "@/shared/component/typography";
import {currencyType} from "@/shared/constants/global.ts";
import {Order, Product} from "@/service/order/interface/OrderListInterface.tsx";
import CartItemHorizontalList from "@/shared/component/cartItemHorizontalList";
import OrderItemHorizontalList from "@/shared/component/orderItemHorizontalList";


export default function ShowOrder()
{
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const [isLoading, setIsLoading] = useState(false);
    const orderService = new OrderService();
    const [order, setOrder] = useState<Order>();

    useEffectOnce(function(){
        // @ts-ignore
        const orderId = route.params?.orderId;
        if(!orderId) {
            Toasts('Unknown error occurred!');
            navigation.goBack();
        }

        setIsLoading(true)
        orderService.get(orderId).then((response) => {
            setIsLoading(false);
            if(response.data.status) {
                setOrder(response.data.data);
            }
        }, (error)=>{
            setIsLoading(false);
            Toasts('Unknown error occurred!')
            navigation.goBack();
        });

    },[]);


    function renderItem(item: any, key: number) {
        return <View style={{marginBottom: 20, flex: 1}} key={key}>
            <OrderItemHorizontalList product={item} />
        </View>
    }


    return (
        <WrapperNoScroll loading={isLoading}>
            <View style={{
                paddingHorizontal: normalize(20),
                height: normalize(40),
                backgroundColor : semantic.background.white.w101,
                borderBottomWidth : 1,
                borderBottomColor : semantic.alert.danger.d500,
                borderStyle : "solid"
            }}>
                <HeaderWithIcon  title={"ORDER DETAILS"} />
            </View>
            {
                isLoading ? <></> :  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>

                        <View style={{ borderBottomWidth : 1, borderBottomColor : semantic.alert.danger.d500, borderStyle : "solid",paddingVertical: normalize(15),paddingHorizontal: normalize(10)}}>
                            <View style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                <Typography style={{fontWeight : 'bold',fontSize : normalize(12)}}>Order Number</Typography>
                                <Typography style={{fontWeight : 'normal',fontSize : normalize(12)}}>{order?.orderId}</Typography>
                            </View>
                            <View style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                <Typography style={{fontWeight : 'bold',fontSize : normalize(12)}}>Invoice Number</Typography>
                                <Typography style={{fontWeight : 'normal',fontSize : normalize(12)}}>{order?.invoiceNo}</Typography>
                            </View>
                            <View style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                <Typography style={{fontWeight : 'bold',fontSize : normalize(12)}}>Order Date</Typography>
                                <Typography style={{fontWeight : 'normal',fontSize : normalize(12)}}>{order?.orderDate}</Typography>
                            </View>
                            <View style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                <Typography style={{fontWeight : 'bold',fontSize : normalize(12)}}>Total Amount</Typography>
                                <Typography style={{fontWeight : 'normal',fontSize : normalize(12)}}>{currencyType}{order?.totalAmount}</Typography>
                            </View>
                            <View style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                <Typography style={{fontWeight : 'bold',fontSize : normalize(12)}}>Status</Typography>
                                <Typography style={{color : semantic.alert.danger.d500, fontWeight : 'normal',fontSize : normalize(12)}}>{order?.status}</Typography>
                            </View>
                        </View>

                        <View style={{ borderBottomWidth : 1, borderBottomColor :semantic.alert.danger.d500, borderStyle : "solid",paddingVertical: normalize(15),paddingHorizontal: normalize(10)}}>
                            {
                                // @ts-ignore
                                order?.products?.length > 0
                                    ?
                                    (
                                        order?.products.map((item: any, index: number) => {
                                            return renderItem(item, index)
                                        })
                                    )
                                    :
                                    <></>
                            }
                        </View>

                        <View style={{ borderBottomWidth : 1, borderBottomColor : semantic.alert.danger.d500, borderStyle : "solid",paddingVertical: normalize(20),paddingHorizontal: normalize(10)}}>
                            <View style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                <Typography style={{fontWeight : 'bold',fontSize : normalize(12)}}>Delivery Address</Typography>
                                <Typography style={{fontWeight : '200',fontSize : normalize(12)}}>Order Item</Typography>
                            </View>
                            <View style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                <Typography numberOfLines={2} ellipsizeMode={'tail'} style={{flex : 0.8, fontWeight : '300',fontSize : normalize(10)}}>{order?.address}</Typography>
                                <Typography style={{alignItems: 'center', fontWeight : '200',fontSize : normalize(12)}}>{order?.itemsCount} Items</Typography>
                            </View>
                        </View>


                        <View style={{ borderBottomWidth : 0, borderBottomColor : semantic.alert.danger.d500, borderStyle : "solid",paddingVertical: normalize(20),paddingHorizontal: normalize(10)}}>
                            <View style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                <Typography style={{fontWeight : 'bold',fontSize : normalize(12)}}>Payment Method</Typography>
                                <Typography style={{fontWeight : '400',fontSize : normalize(12)}}>{order?.paymentMethod}</Typography>
                            </View>

                            {
                                // @ts-ignore
                                order?.orderTotals.length > 0 ? (
                                    order?.orderTotals.map((item, index) => {
                                        return (
                                            <View key={'orderTotal-'+index} style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                                <Typography numberOfLines={1} ellipsizeMode={'tail'} style={{flex: 0.9, color : semantic.background.white.wgreyblack, fontWeight : 'bold',fontSize : normalize(12)}}>{item.name}:</Typography>
                                                <Typography style={{fontWeight : '700',fontSize : normalize(12)}}>{currencyType} {item.value_formatted}</Typography>
                                            </View>
                                        )
                                    })
                                ) : <></>
                            }

                            <View style={{paddingVertical : normalize(5),display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                                <Typography style={{color : semantic.background.white.wgreyblack, fontWeight : 'bold',fontSize : normalize(12)}}>Total :</Typography>
                                <Typography style={{fontWeight : '700',fontSize : normalize(12)}}>{currencyType} {order?.totalAmount}</Typography>
                            </View>

                        </View>


                    </View>
                </ScrollView>
            }
        </WrapperNoScroll>
    )
}
