import React, {useCallback, useState} from 'react';
import HeaderWithIcon from "@/shared/component/headerBack";
import {Dimensions, ScrollView, View} from "react-native";
import {styles} from './styles'
import Order from "@/shared/page/orders/components/order";
import TopNavigation, {TopNavigationProps} from "@/shared/page/orders/components/topNavigation";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {normalize} from "@/shared/helpers";
import {semantic} from "@/shared/constants/colors.ts";
import {useFocusEffect} from "@react-navigation/native";
import OrderService from "@/service/order/OrderService.tsx";
import {OrderListInterface} from "@/service/order/interface/OrderListInterface.tsx";
import LottieView from "lottie-react-native";
import Typography from "@/shared/component/typography";
import OverlayLoader from "@/shared/component/overlayLoader";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
export default function Orders() {

    const [isLoading, setIsLoading] = useState(false);
    const [orderItemList, setOrderItemList] = useState<OrderListInterface[]>([]);
    const orderService = new OrderService();

    useEffectOnce(() => {
        loadOrders("In Progress")
    }, [])

    const height = Dimensions.get("window").height - normalize(500);

    function loadOrders(orderType : string) {
        setIsLoading(true);
        setOrderItemList([]);
        orderService.list(orderType).then((response) => {
            setIsLoading(false);
            if (response.data.status === true) {
                setOrderItemList(response.data.data);
            }
        })
    }


    function onTabSelected(tab : TopNavigationProps) {
        loadOrders(tab.name)
    }


    return (
        <WrapperNoScroll>
            <HeaderWithIcon  title={"MY ORDERS"} />
            <View style={{
                height: normalize(80),
                marginTop: normalize(-20),
                backgroundColor : semantic.background.white.w101
            }}>
                <View style={{ flex : 1, paddingHorizontal: normalize(10)}}>
                <TopNavigation onChange={onTabSelected} />
                </View>
            </View>
            <View style={{flex: 1, height: '100%'}}>
            {
                isLoading ? <OverlayLoader height={height}  loading={isLoading} title={""} /> :
                    <ScrollView style={{height : '100%'}} showsVerticalScrollIndicator={false}>

                    {
                        orderItemList.length === 0 ?
                            <View style={{paddingHorizontal : normalize(50),flex : 1, flexDirection : "column", justifyContent : "center", alignItems : "center"}}>
                                <LottieView
                                    source={require("@/assets/order_empty.json")}
                                    autoPlay
                                    resizeMode="contain"
                                    loop={false}
                                    style={{   width: 400, height: 300,}}
                                />
                                <Typography style={{textAlign : 'center',alignSelf : 'center',fontWeight : 'regular', fontSize : normalize(16)}}>No orders found just yet 🛍️ Start shopping to place your first one!</Typography>
                            </View>
                            :
                            <View style={styles.container}>
                                {
                                    orderItemList.length > 0
                                        ?
                                        (
                                            orderItemList.map(item => {
                                                return (
                                                    <Order key={item.id} product={item} />
                                                )
                                            })
                                        )
                                        :
                                        <></>
                                }
                            </View>
                    }


                </ScrollView>
            }
            </View>
        </WrapperNoScroll>
    )
}
