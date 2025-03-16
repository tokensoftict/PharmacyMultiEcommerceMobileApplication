import ButtonSheet from "@/shared/component/buttonSheet";
import {normalize} from "@/shared/helpers";
import {TouchableOpacity, View} from "react-native";
import Typography from "@/shared/component/typography";
import React, {useState} from "react";
import {Button} from "@/shared/component/buttons";
import Icon from "@/shared/component/icon";
import {close} from "@/assets/icons";
import {palette} from "@/shared/constants/colors.ts";


// @ts-ignore
export default function PickUpAtStore({callback,  deliveryMethod = "", showDialog = false, extra = {address : ""}})
{
    const [dialogShow, setDialogShow] = useState<boolean>(showDialog);

    function confirmAddress()
    {
        callback({
            "deliveryMethod": deliveryMethod,
            "template_settings": {},
            "template_settings_value": {}
        });

        setDialogShow(false);
    }

    return (
        <ButtonSheet  dispatch={dialogShow}>
            <View style={{padding: normalize(24)}}>
                <TouchableOpacity onPress={() => setDialogShow(false)} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography style={{fontWeight: '700', fontSize: normalize(18), marginBottom: normalize(10)}}>{"PICK UP STORE ADDRESS"}</Typography>
                    <Icon icon={close} height={normalize(30)} customStyles={{marginTop:normalize(-15)}} tintColor={palette.main.p100}  />
                </TouchableOpacity>
                <Typography>{extra?.address}</Typography>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(0), paddingLeft: normalize(100), paddingRight : normalize(100)}}>
                <View style={{flex: 1, marginBottom: normalize(34)}}>
                    <Button  title="CONFIRM ADDRESS" onPress={() => confirmAddress()}/>
                </View>
            </View>
        </ButtonSheet>
    )
}
