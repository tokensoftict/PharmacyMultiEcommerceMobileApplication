import ButtonSheet from "@/shared/component/buttonSheet";
import {normalize} from "@/shared/helpers";
import {ScrollView, TouchableOpacity, View} from "react-native";
import Typography from "@/shared/component/typography";
import React, {useCallback, useEffect, useState} from "react";
import {Button} from "@/shared/component/buttons";
import ListItemOption, {ListOptions} from "@/shared/component/ListItemOption";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import Icon from "@/shared/component/icon";
import {close} from "@/assets/icons";
import {palette} from "@/shared/constants/colors.ts";
import Toastss from "@/shared/utils/Toast.tsx";

//onValidate: (validateFn: () => Promise<boolean>) => void
// @ts-ignore
export default function Dwi({ callback,  showDialog = false, extra = [], deliveryMethod = ""})
{
    const [dialogShow, setDialogShow] = useState<boolean>(showDialog);
    const [dwilocations, setDwilocations] = useState<ListOptions[]>([]);
    const [dwilocation, setDwilocation] = useState<ListOptions>();

    useEffectOnce(() => {
        let myLocationLists = [];
        for(let key in extra) {
            // @ts-ignore
            myLocationLists.push({
                // @ts-ignore
                id : extra[key].SN,
                // @ts-ignore
                title : extra[key].name,
                // @ts-ignore
                price : extra[key].amount,
                active : false
            })
        }
        setDwilocations(myLocationLists);
    },[])

    function onSelectDwi(option: ListOptions) {
        setDwilocation(option);
    }


    function confirmDwi()
    {
        if(!dwilocation?.id) {
            Toastss("Please select your location");
            return ;
        }

        callback({
            deliveryMethod : deliveryMethod,
            template_settings : dwilocation,
            template_settings_value : []
        });

        setDialogShow(false);
    }

    return (
        <ButtonSheet  dispatch={dialogShow} height={normalize(500)}>
            <View style={{padding: normalize(24), height : '80%', width : '100%'}}>
                <TouchableOpacity onPress={() => setDialogShow(false)} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography style={{fontWeight: '700', fontSize: normalize(18), marginBottom: normalize(10)}}>{"SELECT LOCATION"}</Typography>
                    <Icon icon={close} height={normalize(30)} customStyles={{marginTop:normalize(-15)}} tintColor={palette.main.p100}  />
                </TouchableOpacity>

                <View style={{flex : 1, height : '100%', width : '100%'}}>
                    {
                        dwilocations.length > 0
                            ?
                            <ScrollView  showsVerticalScrollIndicator={false}>
                            <ListItemOption
                                value={dwilocation}
                                options={dwilocations}
                                onChange={onSelectDwi}
                            />
                        </ScrollView>
                            :
                            <></>
                    }

                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(0), paddingLeft: normalize(100), paddingRight : normalize(100)}}>
                <View style={{flex: 1, marginBottom: normalize(34)}}>
                    <Button  title="CONFIRM LOCATION" onPress={() => confirmDwi()}/>
                </View>

            </View>
        </ButtonSheet>
    )
}
