import React, {useCallback, useState} from 'react';
import HeaderWithIcon from "@/shared/component/headerBack";
import {ScrollView, View} from "react-native";
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
export default function Orders() {

    const [isLoading, setIsLoading] = useState(false);
    const [orderItemList, setOrderItemList] = useState<OrderListInterface[]>([]);
    const orderService = new OrderService();
    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            loadOrders("In Progress")
        }, [])
    );


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
        <WrapperNoScroll loading={isLoading}>
            <View style={{
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(10),
                height: normalize(100),
                backgroundColor : semantic.background.white.w101
            }}>
                <HeaderWithIcon  title={"MY ORDERS"} />
                <TopNavigation onChange={onTabSelected} />
            </View>
            {
                isLoading ? <></> :   <ScrollView showsVerticalScrollIndicator={false}>

                    {
                        orderItemList.length === 0 ?
                            <View style={{flex : 1, flexDirection : "column", justifyContent : "center", alignItems : "center"}}>
                                <LottieView
                                    source={require("@/assets/order_empty.json")}
                                    autoPlay
                                    resizeMode="contain"
                                    loop={false}
                                    style={{   width: 500, height: 400,}}
                                />
                                <Typography>No Order Found !</Typography>
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
        </WrapperNoScroll>
    )
}
