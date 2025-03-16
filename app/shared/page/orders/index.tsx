import React, {useCallback, useState} from 'react';
import HeaderWithIcon from "@/shared/component/headerBack";
import { shoppingBag } from "@/assets/icons";
import {ScrollView, View} from "react-native";
import {styles} from './styles'
import Order from "@/shared/page/orders/components/order";
import TopNavigation from "@/shared/page/orders/components/topNavigation";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {normalize} from "@/shared/helpers";
import {semantic} from "@/shared/constants/colors.ts";
import {useFocusEffect} from "@react-navigation/native";
import OrderService from "@/service/order/OrderService.tsx";
import {OrderListInterface} from "@/service/order/interface/OrderListInterface.tsx";
export default function Orders() {

  const [isLoading, setIsLoading] = useState(false);
  const [orderItemList, setOrderItemList] = useState<OrderListInterface[]>([]);
  const orderService = new OrderService();
  useFocusEffect(
      useCallback(() => {
        // This will run whenever the screen comes into focus
        loadOrders()
      }, [])
  );


  function loadOrders() {
    setIsLoading(true);
    orderService.list().then((response) => {
      setIsLoading(false);
      if (response.data.status === true) {
        setOrderItemList(response.data.data);
      }
    })
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
          <TopNavigation />
        </View>
          {
              isLoading ? <></> :   <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.container}>
                      {
                          orderItemList.length > 0
                              ?
                              (
                                  orderItemList.map(item => {
                                      return (
                                          <Order product={item} />
                                      )
                                  })
                              )
                              :
                              <></>
                      }
                  </View>
              </ScrollView>
          }
      </WrapperNoScroll>
  )
}
