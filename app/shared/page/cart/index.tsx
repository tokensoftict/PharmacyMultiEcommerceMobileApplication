import React, {useCallback, useState} from "react";
import {Alert, Image, ScrollView, View} from "react-native";
import HeaderWithIcon from "@/shared/component/headerBack";
import {emptyCart, shoppingBag} from "@/assets/icons";
import List from "@/shared/component/list";
import { Button, ButtonOutline } from "@/shared/component/buttons";
import { normalize } from "@/shared/helpers";
import Typography from "@/shared/component/typography";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import useDarkMode from "@/shared/hooks/useDarkMode";
import CartService from "@/service/cart/CartService.tsx";
import {CartInterface} from "@/service/cart/interface/CartInterface";
import Toasts from "@/shared/utils/Toast.tsx";
import CartItemHorizontalList from "@/shared/component/cartItemHorizontalList";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {currencyType} from "@/shared/constants/global";
import {semantic} from "@/shared/constants/colors";



export default function Cart() {
  const {isDarkMode} = useDarkMode()
  const {navigate} = useNavigation<NavigationProps>()
  const [selectedProductToRemove, setSelectedProductToRemove] = useState({})
  const [openDeleteItem, setOpenDeleteItem] = useState(false)
  const [cartErrorList, setCartErrorList] = useState("Your Shopping Cart is empty!")


  const [isLoading, setIsLoading] = useState(false);
  const [cartItemList, setCartItemList] = useState<CartInterface>();

  function toggleOpenDeleteItem() {
    setOpenDeleteItem(!openDeleteItem);
  }

  useFocusEffect(
      useCallback(() => {
        // This will run whenever the screen comes into focus
        loadCartItems();
      }, [])
  );

  function loadCartItems() {
    setIsLoading(true);
    (new CartService()).get().then((response) => {
      setIsLoading(false);
      if(response.data.status === true) {
        setCartItemList(response.data)
      }else {
        setIsLoading(response.data.message);
      }
    }, (error) => {
      setIsLoading(false);
      Toasts('There was an error while loading cart');
    })
  }

  function removeFormCart(product: any) {
    setSelectedProductToRemove(product)
    toggleOpenDeleteItem()
  }

  function renderItem(item: any, key: number) {
    return <View style={{marginBottom: 20, flex: 1}} key={key}>
      <CartItemHorizontalList product={item} />
    </View>
  }


  function clearCartItems() {
    Alert.alert('Shopping Cart', 'Are you sure you want to clear all the item(s)?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => {
          setIsLoading(true);
          (new CartService()).clear().then((response) => {
              setIsLoading(false);
              loadCartItems();
          })
        }},
    ]);
  }


  return (
      <View style={{flex: 1}}>
        <WrapperNoScroll loading={isLoading}>
          <View style={{paddingHorizontal: normalize(24)}}>
            <HeaderWithIcon icon={shoppingBag}  onPress={loadCartItems} title="SHOPPING CART" />
          </View>
          {
            isLoading ? <></> :
                <>
                  {
                    (cartItemList?.data.items ?? []).length > 0  ?
                        <>
                          <View style={{flex: 1, paddingHorizontal: normalize(24)}}>
                            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1}}>
                              <View style={{height: normalize(32)}} />
                              <List
                                  between
                                  data={cartItemList?.data.items ?? []}
                                  rows={1}
                                  renderItem={renderItem}
                              />
                            </ScrollView>
                          </View>
                          <View style={{ height: normalize(265), backgroundColor : semantic.alert.danger.d100}}>
                            <View style={{ paddingHorizontal:normalize(12), borderStyle:"solid",  flexDirection: 'row', alignItems: 'center', marginTop: normalize(20),  justifyContent : 'space-between'}}>
                              <View style={{flexDirection:"column"}}>
                                <Typography style={{fontWeight :'500'}}>Order Total</Typography>
                                <Typography style={{fontWeight : '300', fontSize:normalize(12)}}>{cartItemList?.data.meta.noItems} Items(s) currently in your shopping cart</Typography>
                              </View>
                              <Typography style={{fontWeight :'500'}}>{currencyType} {cartItemList?.data.meta.totalItemsInCarts_formatted}</Typography>
                            </View>
                            {
                              cartItemList?.data.meta?.doorStepDelivery ?
                                  <>
                                  <View style={{ paddingHorizontal:normalize(12), borderStyle:"solid",  flexDirection: 'row', alignItems: 'center', marginTop: normalize(5),  justifyContent : 'space-between'}}>
                                    <Typography style={{fontWeight :'400', fontSize:normalize(12)}}>{cartItemList?.data.meta?.doorStepDelivery.name}</Typography>
                                    <Typography style={{fontWeight :'500', fontSize:normalize(12)}}>{currencyType} {cartItemList?.data.meta?.doorStepDelivery.amount_formatted}</Typography>
                                  </View>
                                  <View style={{ paddingHorizontal:normalize(12), borderStyle:"solid",  flexDirection: 'row', alignItems: 'center', marginTop: normalize(5),  justifyContent : 'space-between'}}>
                                    <Typography style={{fontWeight :'400', fontSize:normalize(12)}}>Estimated Delivery Date</Typography>
                                    <Typography style={{fontWeight :'500'}}>{cartItemList?.data.meta?.doorStepDelivery.deliveryDate}</Typography>
                                  </View>
                                  </>
                                  : <></>
                            }

                            <View style={{ paddingHorizontal:normalize(18),  flexDirection: 'row', alignItems: 'center', marginTop: normalize(24),  justifyContent : 'space-around'}}>
                              <View style={{flex: 1}}>
                                <ButtonOutline title="CLEAR ITEMS"  onPress={() => clearCartItems()} />
                              </View>
                              <View style={{width: 60}} />
                              <View style={{flex: 1}}>
                                <Button title="CHECKOUT" onPress={() => navigate('checkout')}/>
                              </View>
                            </View>
                          </View>
                        </>
                        :
                        <>
                        <View style={{display : 'flex', flex : 0.8, justifyContent : 'center' ,alignItems : 'center'}}>
                          <Image resizeMode={'contain'} style={{ width:'30%'}} source={emptyCart}/>
                          <Typography style={{fontWeight : '300', marginTop : normalize(-40)}}>{cartErrorList}</Typography>
                        </View>
                        </>
                  }

                </>
          }
        </WrapperNoScroll>
      </View>
  )
}
