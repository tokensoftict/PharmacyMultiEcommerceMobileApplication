import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, TouchableOpacity, View} from "react-native";
import {location, shoppingBag} from "@/assets/icons";
import ListOptionCard, {OptionCardOptions} from "@/shared/component/ListOptionCard";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import {useFocusEffect} from "@react-navigation/native";
import {palette, semantic} from "@/shared/constants/colors.ts";
import {normalize} from "@/shared/helpers";
import Toastss from "@/shared/utils/Toast";
import {useLoading} from "@/shared/utils/LoadingProvider";
import HeaderWithIcon from "@/shared/component/headerBack";
import CheckoutService from "@/service/checkout/CheckoutService";

export default function SelectCheckoutAddress({ onValidate }: { onValidate: (validateFn: () => Promise<boolean>) => void })  {
    const [addressSelected, setAddressSelected] = useState<OptionCardOptions>();
    const [checkOutAddress, setCheckOutAddress] = useState<OptionCardOptions[]>([]);
    const [isCheckOutAddressLoading, setIsCheckOutAddressLoading] = useState(false);
    const {isDarkMode} = useDarkMode();
    const checkOutService = new CheckoutService();
    const { showLoading, hideLoading } = useLoading();

    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            getCheckOutAddress();
        }, [])
    );

    useEffect(() => {
        onValidate(async function validateAddress(){
            if (!addressSelected?.id) {
                Toastss("Please select your address");
                return false;
            }

            showLoading("Saving address...");
            const response = await checkOutService.saveCheckoutAddress(addressSelected.id);
            if(response.data.status !== true) {
                Toastss(response.data.message);
                return false;
            }
            hideLoading();

            return true;
        }); // Validation passes if an address is selected
    }, [addressSelected]);

    function getCheckOutAddress() {
        setIsCheckOutAddressLoading(true);
        checkOutService.getCheckoutAddress().then((response) => {
            setCheckOutAddress([])
            if(response.data.status === true) {
                let myAddressLists = [];
                for(let key in response.data.data) {
                    myAddressLists.push({
                        id : response.data.data[key].id,
                        icon : location,
                        title : response.data.data[key].name,
                        description : response.data.data[key].address_1+", "
                            +response.data.data[key].address_2+", "
                            +response.data.data[key].town+", "
                            +response.data.data[key].state+", "
                            +response.data.data[key].country,
                        active : response.data.data[key].isDefault,
                    });

                    if(response.data.data[key].isDefault) {
                        setAddressSelected(response.data.data[key]);
                    }
                }
                setCheckOutAddress(myAddressLists)
            }
            setIsCheckOutAddressLoading(false);
        });
    }

    function onSelectAddress(option: OptionCardOptions) {
        setAddressSelected(option)
    }

    return (
        <View style={{
            width:'100%',
            height:'100%',
            flex: 1,
            backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w100,
        }}>
            <View style={{paddingVertical: normalize(15)}}>
                <HeaderWithIcon icon={location}   title="SELECT DELIVERY ADDRESS" />
            </View>

            {
                isCheckOutAddressLoading
                    ?
                    <View style={{flex : 1, justifyContent : 'center', width:'100%', height:'100%'}}>
                        <ActivityIndicator size="large" color={palette.main.p500} />
                    </View>
                    :
                    <ScrollView  showsVerticalScrollIndicator={false}>
                        <ListOptionCard
                            value={addressSelected}
                            onChange={onSelectAddress}
                            options={checkOutAddress}
                        />
                        <View style={{height:normalize(120)}}/>
                    </ScrollView>
            }
        </View>
    )
}
