import ButtonSheet from "@/shared/component/buttonSheet";
import {normalize} from "@/shared/helpers";
import {Animated, Dimensions, Easing, ScrollView, TouchableOpacity, View} from "react-native";
import Typography from "@/shared/component/typography";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "@/shared/component/buttons";
import ListItemOption, {ListOptions} from "@/shared/component/ListItemOption";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import Icon from "@/shared/component/icon";
import {close, arrowBack} from "@/assets/icons";
import {palette, semantic} from "@/shared/constants/colors";
import useDarkMode from "@/shared/hooks/useDarkMode";
import DeliveryToDriverWithinIlorin
    from "@/shared/page/checkout/components/selectDeliveryOption/option/doi/delivertodriverwithinilorin.tsx";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// @ts-ignore
export default function Dwi({callback,  deliveryMethod = "", showDialog = false, extra = []})
{
    const [dialogShow, setDialogShow] = useState<boolean>(showDialog);
    const [doiOptions, setDoiOptions] = useState<ListOptions[]>([]);
    const [doiOption, setDoiOption] = useState<ListOptions>();
    const {isDarkMode} = useDarkMode();

    const [step, setStep] = useState(1);
    const slideAnim = useRef(new Animated.Value(0)).current; // Slide animation
    const validationRefs = useRef({}); // Store validation functions

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: step - 1,
            duration: 250, // Faster transition (previously 500ms)
            easing: Easing.inOut(Easing.ease), // Smooth easing
            useNativeDriver: true,
        }).start();
    }, [step]);

    // Register validation function for each step
    const registerValidation = (stepIndex : number, validationFunc : any) => {
        // @ts-ignore
        validationRefs.current[stepIndex] = validationFunc;
    };


    useEffectOnce(() => {
        let myDoiLists = [];
        for(let key in extra) {
            // @ts-ignore
            myDoiLists.push({
                // @ts-ignore
                id : key,
                // @ts-ignore
                title : extra[key].name,
                // @ts-ignore
                price : extra[key].amount,
                active : false,
                // @ts-ignore
                option : extra[key].option,
            })
        }
        setDoiOptions(myDoiLists);
    },[])

    function onSelectDoi(option: ListOptions) {
        setDoiOption(option);
        if(option.option.length > 0) {
            nextStep();
        }
    }

    const nextStep = () => {
        setStep((prev) => Math.min(prev + 1, 2));
    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const getDriverDetailsCallback = (data : any) => {
        callback({
            deliveryMethod :deliveryMethod,
            // @ts-ignore
            template_settings :  extra[doiOption?.id],
            template_settings_value : data
        });

        setDialogShow(false);
    }



    const renderStepContent = () => (
        <Animated.View
            style={[
                {
                    flexDirection: 'row',
                    backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w100,
                    height: '100%',
                    width: SCREEN_WIDTH * 3,
                    overflow: 'hidden',
                },
                {
                    transform: [
                        {
                            translateX: slideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -SCREEN_WIDTH],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >

            <View style={{ width: SCREEN_WIDTH, display: 'flex' }}>
                <View style={{padding: normalize(24), height : '100%', width : '100%'}}>
                    <TouchableOpacity onPress={() => setDialogShow(false)} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography style={{fontWeight: '700', fontSize: normalize(18), marginBottom: normalize(10)}}>{"SELECT LOCATION"}</Typography>
                        <Icon icon={close} height={normalize(30)} customStyles={{marginTop:normalize(-15)}} tintColor={palette.main.p100}  />
                    </TouchableOpacity>

                    <View style={{ height : '60%', width : '100%', justifyContent : 'center' }}>
                        {
                            doiOptions.length > 0
                                ?
                                <ListItemOption
                                    value={doiOption}
                                    options={doiOptions}
                                    onChange={onSelectDoi}
                                />
                                :
                                <></>
                        }
                    </View>
                    {
                        doiOption?.option.length === 0 ?  <View style={{marginBottom: normalize(50), flexDirection: 'row', alignItems: 'center', marginTop: normalize(0), paddingLeft: normalize(100), paddingRight : normalize(100)}}>
                           <View style={{flex: 1}}>
                               <Button  title="SAVE" onPress={() =>getDriverDetailsCallback({})}/>
                           </View>
                       </View> : <></>
                    }
                </View>

            </View>
            <View style={{ width: SCREEN_WIDTH , display: 'flex'}}>
                <View>
                    <View style={{padding: normalize(24), height : '70%', width : '100%'}}>
                        <TouchableOpacity onPress={() => prevStep()} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Icon icon={arrowBack} height={normalize(30)} customStyles={{marginBottom : normalize(5)}}  tintColor={palette.main.p100}  />
                        </TouchableOpacity>
                        <View style={{flex : 1, height : '80%', width : '100%'}}>
                            <DeliveryToDriverWithinIlorin  callback={getDriverDetailsCallback}/>
                        </View>
                    </View>

                </View>
            </View>

        </Animated.View>
    );



    return (
        <ButtonSheet  dispatch={dialogShow} height={normalize(360)}>
            <View style={
                {
                    flex: 1,
                    backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w100,
                    overflow: 'hidden',
                }
            }>{renderStepContent()}</View>
        </ButtonSheet>
    )
}
