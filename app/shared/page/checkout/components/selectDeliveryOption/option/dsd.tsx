import React, {useCallback, useState} from "react";
import ListItemOption, {ListOptions} from "@/shared/component/ListItemOption";
import ButtonSheet from "@/shared/component/buttonSheet";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {normalize} from "@/shared/helpers";
import Typography from "@/shared/component/typography";
import Icon from "@/shared/component/icon";
import {close} from "@/assets/icons";
import {palette} from "@/shared/constants/colors.ts";
import {Button} from "@/shared/component/buttons";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import CheckoutService from "@/service/checkout/CheckoutService.tsx";
import {useFocusEffect} from "@react-navigation/native";
import {currencyType} from "@/shared/constants/global.ts";


// @ts-ignore
export default function Dsd({callback,  deliveryMethod = "", showDialog = false, extra = []})
{
    const [dialogShow, setDialogShow] = useState<boolean>(showDialog);
    const [loading, setLoading] = useState<boolean>(false);
    const [dsd, setDsd] = useState([]);

    function confirmDsd()
    {
        callback({
            deliveryMethod : deliveryMethod,
            template_settings : {},
            template_settings_value : []
        });

        setDialogShow(false);
    }

    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            loadDoorStepDelivery();
        }, [])
    );

    function loadDoorStepDelivery() {
        setLoading(true);
        new CheckoutService().getDoorStepDelivery().then((response) => {
            setLoading(false);
            if (response.data.status === true) {
                setDsd(response.data.data);
            }
        });
    }

    return (
        <ButtonSheet  dispatch={dialogShow} height={normalize(300)}>
            <WrapperNoScrollNoDialogNoSafeArea loading={loading}>
                <View style={{padding: normalize(24)}}>
                    <TouchableOpacity onPress={() => setDialogShow(false)} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography style={{fontWeight: '700', fontSize: normalize(18), marginBottom: normalize(10)}}>{"DOOR STEP DELIVERY"}</Typography>
                        <Icon icon={close} height={normalize(30)} customStyles={{marginTop:normalize(-15)}} tintColor={palette.main.p100}  />
                    </TouchableOpacity>
                </View>
                <View style={{flex : 1, width : '100%', paddingHorizontal: normalize(20)}}>
                    <View style={{flex : 1, flexDirection : "row", justifyContent : "space-between"}}>
                        <Typography style={{fontSize : normalize(16), fontWeight : "600"}}>Delivery Date :</Typography>
                        <Typography style={{fontSize : normalize(16), fontWeight : "600"}}>{
                            // @ts-ignore
                            dsd.delivery_date
                        }</Typography>
                    </View>
                </View>
                <View style={{
                    borderStyle : 'dashed',
                    paddingHorizontal: normalize(20),
                    borderWidth : 1,
                    borderColor : palette.main.p500,
                    height : normalize(50),
                    flex : 1,
                    alignItems : 'center',
                    justifyContent : 'center',
                    marginBottom : normalize(15)
                }}>
                    <Typography
                        style={{
                            fontWeight : '600',
                            fontSize: normalize(25),
                        }}
                    >
                        {
                            // @ts-ignore
                            currencyType+" "+dsd.total
                        }
                    </Typography>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(0), paddingLeft: normalize(100), paddingRight : normalize(100)}}>
                    <View style={{flex: 1, marginBottom: normalize(34)}}>
                        <Button  title="CONFIRM DELIVERY" onPress={() => confirmDsd()}/>
                    </View>
                </View>
            </WrapperNoScrollNoDialogNoSafeArea>
        </ButtonSheet>
    )

}
