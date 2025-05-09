import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, TouchableOpacity, View} from "react-native";
import {creditCardPlus} from "@/assets/icons";
import ListOptionCard, {OptionCardOptions} from "@/shared/component/ListOptionCard";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import {useFocusEffect} from "@react-navigation/native";
import {palette, semantic} from "@/shared/constants/colors.ts";
import {normalize} from "@/shared/helpers";
import Toastss from "@/shared/utils/Toast.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider";
import HeaderWithIcon from "@/shared/component/headerBack";
import CheckoutService from "@/service/checkout/CheckoutService.tsx";
import SubHeader from "@/shared/component/subHeader";

export default function SelectPaymentOption({ onValidate }: { onValidate: (validateFn: () => Promise<boolean>) => void })  {
  const [paymentSelected, setPaymentSelected] = useState<OptionCardOptions>();
  const [checkOutPayment, setCheckOutPayment] = useState<OptionCardOptions[]>([]);
  const [isCheckOutPaymentLoading, setIsCheckOutPaymentLoading] = useState(false);
  const {isDarkMode} = useDarkMode();
  const checkOutService = new CheckoutService();
  const { showLoading, hideLoading } = useLoading();

  useFocusEffect(
      useCallback(() => {
        // This will run whenever the screen comes into focus
        getCheckOutPayment();
      }, [])
  );

  useEffect(() => {
    // @ts-ignore
    onValidate(async function validateAddress(){
      if (!paymentSelected?.id) {
        Toastss("Please select your preferred method payment");
        return false;
      }
      showLoading("Saving payment method...");
      const response = await checkOutService.saveCheckoutPaymentMethod(paymentSelected.id);
      if(response.data.status !== true) {
        Toastss(response.data.message);
        return false;
      }
      hideLoading();

      return paymentSelected?.id;
    }); // Validation passes if an address is selected
  }, [paymentSelected]);


  function getCheckOutPayment() {
    setIsCheckOutPaymentLoading(true);
    checkOutService.getCheckoutPaymentMethod().then((response) => {
      setCheckOutPayment([])
      if(response.data.status === true) {
        let myPaymentLists = [];
        for(let key in response.data.data) {
          myPaymentLists.push({
            id : response.data.data[key].id,
            icon : creditCardPlus,
            title : response.data.data[key].name,
            description : response.data.data[key].description,
            active : false,
          });

        }
        setCheckOutPayment(myPaymentLists)
      }
      setIsCheckOutPaymentLoading(false);
    });
  }

  function onSelectPayment(option: OptionCardOptions) {
    setPaymentSelected(option)
  }

  return (
      <View style={{
        width:'100%',
        height:'100%',
        flex: 1,
        backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w100,
      }}>
        <SubHeader icon={creditCardPlus}   title="SELECT PAYMENT METHOD" />

        {
          isCheckOutPaymentLoading
              ?
              <View style={{flex : 1, justifyContent : 'center', width:'100%', height:'100%'}}>
                <ActivityIndicator size="large" color={palette.main.p500} />
              </View>
              :
              <ScrollView  showsVerticalScrollIndicator={false}>
                <ListOptionCard
                    value={paymentSelected}
                    onChange={onSelectPayment}
                    options={checkOutPayment}
                />
                <View style={{height:normalize(120)}}/>
              </ScrollView>
        }
      </View>
  )
}
