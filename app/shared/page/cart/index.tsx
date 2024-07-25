import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import HeaderWithIcon from "../../../shared/component/headerBack";
import { shoppingBag } from "../../../assets/icons";
import List from "../../../shared/component/list";
import { Button, ButtonOutline } from "../../../shared/component/buttons";
import { normalize } from "../../../shared/helpers";
import ButtonSheet from "../../../shared/component/buttonSheet";
import Typography from "../../../shared/component/typography";
import {styles} from './styles'
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import useDarkMode from "../../../shared/hooks/useDarkMode";
import { semantic } from "../../../shared/constants/colors";
import useEffectOnce from "../../../shared/hooks/useEffectOnce.tsx";
import CartService from "../../../service/cart/CartService.tsx";
import {CartInterface} from "../../../service/cart/interface/CartInterface";
import Toast from "react-native-toast-message";
import CardProductHorizontal from "../../../shared/component/cardProductHorizontal";
import CartItemHorizontalList from "../../../shared/component/cartItemHorizontalList";
import WrapperNoScroll from "../../../shared/component/wrapperNoScroll";
import {currencyType} from "../../../shared/constants/global.ts";
export default function Cart() {
  const {isDarkMode} = useDarkMode()
  const {navigate} = useNavigation<NavigationProps>()
  const [selectedProductToRemove, setSelectedProductToRemove] = useState({})
  const [openDeleteItem, setOpenDeleteItem] = useState(false)


  const [isLoading, setIsLoading] = useState(false);
  const [cartItemList, setCartItemList] = useState<CartInterface>();

  function toggleOpenDeleteItem() {
    setOpenDeleteItem(!openDeleteItem);
  }

  useEffectOnce(() => {
    loadCartItems();
  }, []);


  function loadCartItems() {
    setIsLoading(true);
    (new CartService()).get().then((response) => {
      setIsLoading(false);
      if(response.data.status === true) {
        console.log(response.data);
        setCartItemList(response.data)
      }else {
        console.log("hello")
      }
    }, (error) => {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text2: 'There was an error while loading cart',
        position : "top",
      });
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
  return (
      <View style={{flex: 1}}>
        <WrapperNoScroll loading={isLoading}>
          <View style={{flex: 1, paddingHorizontal: normalize(24)}}>
            <HeaderWithIcon icon={shoppingBag}  onPress={loadCartItems} title="Shopping Cart" />
            <View style={{height: normalize(10)}}/>
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
          <View style={{ height: 200, backgroundColor : 'white'}}>
            <View style={{ paddingHorizontal:normalize(12), borderStyle:"solid",  flexDirection: 'row', alignItems: 'center', marginTop: normalize(20),  justifyContent : 'space-between'}}>
              <View style={{flexDirection:"column"}}>
                <Typography style={{fontWeight :'500'}}>Order Total</Typography>
                <Typography style={{fontWeight : '300', fontSize:normalize(12)}}>{cartItemList?.data.meta.noItems} Items(s) currently in your shopping cart</Typography>
              </View>
              <Typography style={{fontWeight :'500'}}>{currencyType} {cartItemList?.data.meta.totalItemsInCarts}</Typography>
            </View>
            <View style={{ paddingHorizontal:normalize(12), borderStyle:"solid",  flexDirection: 'row', alignItems: 'center', marginTop: normalize(5),  justifyContent : 'space-between'}}>
              <Typography style={{fontWeight :'400', fontSize:normalize(12)}}>Door Delivery (Ilorin)</Typography>
              <Typography style={{fontWeight :'500', fontSize:normalize(12)}}>{currencyType} {cartItemList?.data.meta.totalItemsInCarts}</Typography>
            </View>

            <View style={{ paddingHorizontal:normalize(12), borderStyle:"solid",  flexDirection: 'row', alignItems: 'center', marginTop: normalize(5),  justifyContent : 'space-between'}}>
              <Typography style={{fontWeight :'400', fontSize:normalize(12)}}>Estimated Delivery Date</Typography>
              <Typography style={{fontWeight :'500'}}>Mon, July 15th, 2024</Typography>
            </View>

            <View style={{ paddingHorizontal:normalize(20),  flexDirection: 'row', alignItems: 'center', marginTop: normalize(24),  justifyContent : 'space-around'}}>
              <View style={{flex: 1}}>
                <ButtonOutline title="CLEAR ITEMS"   />
              </View>
              <View style={{width: 60}} />
              <View style={{flex: 1}}>
                <Button title="CHECKOUT" />
              </View>
            </View>
          </View>
          <ButtonSheet onClose={toggleOpenDeleteItem} dispatch={openDeleteItem}>
            <View style={styles.bodyButtonSheet}>
              <Typography style={styles.titleButtonSheet}>{"cart.remove_cart"}</Typography>
              <View style={styles.containerProduct}>
                <CardProductHorizontal  product={undefined} />
              </View>

              <View style={styles.footerButtonSheet}>
                <View style={{flex: 1}}>
                  <ButtonOutline onPress={toggleOpenDeleteItem} title="general.cancel" />
                </View>
                <View style={{width: 10}} />
                <View style={{flex: 1}}>
                  <Button title="general.yes_remove" />
                </View>
              </View>
            </View>
          </ButtonSheet>
        </WrapperNoScroll>
      </View>
  )
}
