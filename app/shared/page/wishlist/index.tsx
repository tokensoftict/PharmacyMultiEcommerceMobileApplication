import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import React, {useCallback, useState} from "react";
import {Alert, Image, ScrollView, View} from "react-native";
import WishlistItemHorizontalList from "@/shared/component/wishlistItemHorizontalList";
import {WishlistInterface} from "@/service/wishlist/interface/WishlistInterface.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import WishlistService from "@/service/wishlist/WishlistService.tsx";
import CartService from "@/service/cart/CartService.tsx";
import {normalize} from "@/shared/helpers";
import HeaderWithIcon from "@/shared/component/headerBack";
import {emptyCart} from "@/assets/icons";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import List from "@/shared/component/list";
import {semantic} from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import {Button} from "@/shared/component/buttons";


export default function Wishlist() {
    const {isDarkMode} = useDarkMode()
    const {navigate} = useNavigation<NavigationProps>()
    const [selectedProductToRemove, setSelectedProductToRemove] = useState({})
    const [openDeleteItem, setOpenDeleteItem] = useState(false)
    const [cartErrorList, setCartErrorList] = useState("Your wishlist is empty for now 💫 Start adding items you love!")

    const [isLoading, setIsLoading] = useState(false);
    const [wishlistItemList, setWishlistItemList] = useState<WishlistInterface>();

    const navigation = useNavigation<NavigationProps>();

    function toggleOpenDeleteItem() {
        setOpenDeleteItem(!openDeleteItem);
    }

    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            loadWishItems();
        }, [])
    );


    function removeFromWishlist(product: any) {
        Alert.alert('PS GDC', 'Are you sure you want to remove '+product.name+" from your wishlist?", [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {text: 'Yes', onPress: () => {
                    setIsLoading(true);
                    (new WishlistService()).remove(product.id).then((response) => {
                        setIsLoading(false);
                        loadWishItems();
                    })
                }},
        ]);
    }


    function clearWishlistItems() {
        Alert.alert('PS GDC', 'Are you sure you want to clear all the item(s)?', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {text: 'Yes', onPress: () => {
                    setIsLoading(true);
                    (new CartService()).clear().then((response) => {
                        setIsLoading(false);
                        loadWishItems();
                    })
                }},
        ]);
    }


    function loadWishItems() {
        setIsLoading(true);
        (new WishlistService()).get().then((response) => {
            setIsLoading(false);
            if(response.data.status === true) {
                setWishlistItemList(response.data)
            }else {
                setIsLoading(response.data.message);
            }
        }, (error) => {
            setIsLoading(false);
            Toasts('There was an error while loading cart');
        })
    }

    function renderItem(item: any, key: number) {
        return <View style={{marginBottom: 20, flex: 1}} key={key}>
            <WishlistItemHorizontalList product={item} onRemoveItem={removeFromWishlist} />
        </View>
    }



    return (
        <View style={{flex: 1}}>
            <WrapperNoScroll loading={isLoading}>
                <HeaderWithIcon   onPress={loadWishItems} title="MY WISHLIST" />
                {
                    isLoading ? <></> :
                        <>
                            {
                                (wishlistItemList?.data ?? []).length > 0  ?
                                    <>
                                        <View style={{flex: 1, paddingHorizontal: normalize(10),  backgroundColor : semantic.background.white.w111}}>
                                            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1}}>
                                                <View style={{height: normalize(10)}} />
                                                <List
                                                    between
                                                    data={wishlistItemList?.data ?? []}
                                                    rows={1}
                                                    renderItem={renderItem}
                                                />
                                            </ScrollView>
                                        </View>
                                    </>
                                    :
                                    <View style={{ flex: 1,
                                        paddingHorizontal: normalize(15),
                                        justifyContent: 'center',}}>
                                        <Typography style={{textAlign : 'center',alignSelf : 'center',fontWeight : 'regular', fontSize : normalize(16)}}>{cartErrorList}</Typography>
                                        <View style={{paddingHorizontal : normalize(120), marginTop : normalize(10)}}>
                                            <Button title="Go Back" onPress={() =>navigation.goBack() }/>
                                        </View>
                                    </View>

                            }

                        </>
                }
            </WrapperNoScroll>
        </View>
    );


}
