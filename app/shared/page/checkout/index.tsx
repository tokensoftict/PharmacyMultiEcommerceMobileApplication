import React from 'react';
import { View } from "react-native";
import HeaderWithIcon from "@/shared/component/headerBack";
import { normalize } from "@/shared/helpers";
import useDarkMode from "@/shared/hooks/useDarkMode";
import { semantic } from "@/shared/constants/colors";
import CheckoutStepper from "@/shared/page/checkout/components/checkForm.tsx";


export default function Checkout() {
    const {isDarkMode} = useDarkMode()
    return (
        <View style={{flex: 1,  backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w500}}>
            <View style={{paddingHorizontal: normalize(24)}}>
                <View style={{height: normalize(60)}} />
                <HeaderWithIcon title={"CHECKOUT"} />
            </View>
            <View style={{height: normalize(10)}} />
            <CheckoutStepper />
            <View style={{height: normalize(10)}} />
        </View>
    );
}
