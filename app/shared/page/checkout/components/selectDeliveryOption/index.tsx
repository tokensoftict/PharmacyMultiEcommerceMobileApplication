import React, {useCallback, useEffect, useRef, useState} from "react";
import {ActivityIndicator, ScrollView, TouchableOpacity, View} from "react-native";
import {location, truck, truckInTracking} from "@/assets/icons";
import ListOptionCard, {OptionCardOptions} from "@/shared/component/ListOptionCard";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import {useFocusEffect} from "@react-navigation/native";
import {palette, semantic} from "@/shared/constants/colors.ts";
import {normalize} from "@/shared/helpers";
import Toastss from "@/shared/utils/Toast";
import {useLoading} from "@/shared/utils/LoadingProvider";
import PickUpAtStore from "@/shared/page/checkout/components/selectDeliveryOption/option/pickUpAtStore.tsx";
import Dwi from "@/shared/page/checkout/components/selectDeliveryOption/option/dwi.tsx";
import Doi from "@/shared/page/checkout/components/selectDeliveryOption/option/doi.tsx";
import HeaderWithIcon from "@/shared/component/headerBack";
import CheckoutService from "@/service/checkout/CheckoutService.tsx";
import Dsd from "@/shared/page/checkout/components/selectDeliveryOption/option/dsd.tsx";
import SubHeader from "@/shared/component/subHeader";

export default function SelectDeliveryOption({ onValidate }: { onValidate: (validateFn: () => Promise<boolean>) => void })  {
  const [deliverySelected, setDeliverySelected] = useState<OptionCardOptions>();
  const [checkOutDelivery, setCheckOutDelivery] = useState<OptionCardOptions[]>([]);
  const [isCheckOutDeliveryLoading, setIsCheckOutDeliveryLoading] = useState(false);
  const {isDarkMode} = useDarkMode();
  const checkOutService = new CheckoutService();
  const { showLoading, hideLoading } = useLoading();
  const [dwiDelivery, setDwiDelivery] = useState<any>(
      {
        deliveryMethod : false,
        template_settings : false,
        template_settings_value : false
      }
  );
  const dwiDeliveryRef = useRef(dwiDelivery);
  dwiDeliveryRef.current = dwiDeliveryRef;

  useFocusEffect(
      useCallback(() => {
        // This will run whenever the screen comes into focus
        getCheckOutDelivery();
      }, [])
  );

  useEffect(() => {
    dwiDeliveryRef.current = dwiDelivery; // Keep ref in sync with state
  }, [dwiDelivery]);

  useEffect(() => {
    onValidate(async function validateAddress(){
      if(!dwiDeliveryRef.current.deliveryMethod) {
        Toastss("Please complete and confirm your delivery method!");
        return false;
      }

      showLoading("Saving delivery method...");
      const response = await checkOutService.saveCheckDeliveryMethod(dwiDeliveryRef.current);
      if(response.data.status !== true) {
        Toastss(response.data.message);
        return false;
      }
      hideLoading();
      return true;
    }); // Validation passes if an address is selected
  }, [deliverySelected]);


  function getCheckOutDelivery() {
    setIsCheckOutDeliveryLoading(true);
    checkOutService.getCheckoutDelivery().then((response) => {
      setCheckOutDelivery([])
      if(response.data.status === true) {
        let myDeliveryLists = [];
        for(let key in response.data.data) {
          myDeliveryLists.push({
            id : response.data.data[key].id,
            icon : truck,
            title : response.data.data[key].name,
            description : response.data.data[key].description,
            active : false,
            code : response.data.data[key].code,
            extra : response.data.data[key].template_settings_value,
          });

        }
        setCheckOutDelivery(myDeliveryLists)
      }
      setIsCheckOutDeliveryLoading(false);
    });
  }

  function onSelectDelivery(option: OptionCardOptions) {
    setDeliverySelected(option)
  }

  const callBackFromDialogs = (data: any) => {
    setDwiDelivery(data);
    dwiDeliveryRef.current = data;
  }

  return (
      <View style={{
        width:'100%',
        height:'100%',
        flex: 1,
        backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w100,
      }}>
        <SubHeader icon={truckInTracking}   title="SELECT DELIVERY METHOD" />
        {
          isCheckOutDeliveryLoading
              ?
              <View style={{flex : 1, justifyContent : 'center', width:'100%', height:'100%'}}>
                <ActivityIndicator size="large" color={palette.main.p500} />
              </View>
              :
              <View style={{flex : 1, height : '100%', width : '100%'}}>
                <ScrollView  showsVerticalScrollIndicator={false}>
                  <ListOptionCard
                      value={deliverySelected}
                      onChange={onSelectDelivery}
                      options={checkOutDelivery}
                  />
                  <View style={{height:normalize(120)}}/>
                  {
                    deliverySelected?.code === "Pickup" ? <PickUpAtStore callback={callBackFromDialogs} deliveryMethod={deliverySelected.id} extra={deliverySelected.extra} showDialog={ deliverySelected?.code === "Pickup"}/> : <></>
                  }
                  {
                    deliverySelected?.code === "Dwi" ?  <Dwi callback={callBackFromDialogs}  deliveryMethod={deliverySelected.id} extra={deliverySelected.extra} showDialog={ deliverySelected?.code === "Dwi"}/> : <></>
                  }

                  {
                    deliverySelected?.code === "Doi" ?  <Doi callback={callBackFromDialogs} deliveryMethod={deliverySelected.id} extra={deliverySelected.extra} showDialog={ deliverySelected?.code === "Doi"}/> : <></>
                  }
                  {
                      deliverySelected?.code === "Dsd" ? <Dsd callback={callBackFromDialogs} deliveryMethod={deliverySelected.id} extra={deliverySelected.extra} showDialog={ deliverySelected?.code === "Dsd"}/> : <></>
                  }
                </ScrollView>
              </View>
        }
      </View>
  )
}
