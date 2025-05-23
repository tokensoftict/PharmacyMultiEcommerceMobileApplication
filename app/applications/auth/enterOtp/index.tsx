import React, {useState} from "react";
import Wrapper from "@/shared/component/wrapper";
import {Image, View} from "react-native";
import Typography from "@/shared/component/typography";
import { OtpInput } from "react-native-otp-entry";
import { Button } from "@/shared/component/buttons";
import {styles} from './styles'
import TitleAuth from "@/shared/component/titleAuth";
import {normalize} from "@/shared/helpers";
import {logo} from "@/assets/images";
import AuthSessionService from "@/service/auth/AuthSessionService";
import ErrorText from "@/shared/component/ErrorText";
import OtpService from "@/service/auth/OtpService";
import Toasts from "@/shared/utils/Toast";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import {palette, semantic} from "@/shared/constants/colors.ts";


// @ts-ignore
export default  function EnterOtp({ navigation, route }) {
    const [otpError, setOtpError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const [otpCode, setOtpCode] = useState("");

    const userProfile = (new AuthSessionService()).getAuthSession();


    useEffectOnce(function(){
       const requestForOTP = route.params?.otp ?? true;
       if(requestForOTP){
           navigation.addListener("focus", function (){
               requestForOtp();
           });
       }
    }, []);

    const navigateAndClearStack = () => {
        const app = userProfile.data.apps;
        if(app.length === 1) {
            navigation.replace("supermarket");
        } else {
            navigation.replace("storeSelector")
        }
    }

    function doValidateOTP() {
        if (!(otpCode.length === 4)) {
            setOtpError("Please enter the complete otp code that was sent your phone!");
        } else {
            setOtpError("");
            setIsLoading(true);
            setLoadingMessage("Validating Otp Code Please wait..");
            (new OtpService()).validateOTP(otpCode, userProfile.data.phone).then(function (response) {
                setIsLoading(false);
                if (response.data.status === true) {
                    Toasts("Phone Number has been verified successfully");
                    new AuthSessionService().completeSession();
                    navigateAndClearStack();
                } else {
                    const error = response.data.error;
                    if(error.hasOwnProperty("otp")){
                        const error_string = error.otp.join("\\n");
                        setOtpError(error_string)
                    }else if(error.hasOwnProperty("phone")){
                        const error_string = error.phone.join("\\n");
                        setOtpError(error_string)
                    }
                }
            }, function (error) {
                setIsLoading(false);
            });
        }
    }


    function requestForOtp(){
        setIsLoading(true);
        (new OtpService()).requestForOtp(userProfile.data.phone).then(function (response){
            setIsLoading(false);
            if(response.data.status === true){
                // Toasts a message saying otp has been sent to  there phone
            }else{
                setOtpError(response.data.error);
            }
        }, function(error){setIsLoading(false)});
    }

    return (
        <Wrapper loading={isLoading} titleLoader={loadingMessage}>
            <View style={styles.container}>
                <View style={styles.titleImageContainer}>
                    <TitleAuth title="Enter Otp Code"/>
                    <Image
                        style={{
                            width: normalize(100),
                            height: normalize(60),
                            marginTop: normalize(10)
                        }}
                        source={logo}
                    />
                </View>

                <View style={styles.containerEmail}>
                    <Typography>A Four digits code has been sent to</Typography>
                    <Typography style={styles.textEmail}>{userProfile.data.phone}</Typography>
                </View>

                <View style={styles.form}>
                    <OtpInput
                        numberOfDigits={4}
                        focusColor={palette.main.p500}
                        autoFocus={false}
                        hideStick={true}
                        placeholder="******"
                        blurOnFilled={true}
                        disabled={false}
                        type="numeric"
                        secureTextEntry={false}
                        focusStickBlinkingDuration={500}
                        onFilled={(text) => setOtpCode(text)}
                        textInputProps={{
                            accessibilityLabel: "Enter Otp Code",
                        }}
                    />
                    <View style={{height : normalize(10)}}/>
                    {otpError !== '' ? <ErrorText>{otpError}</ErrorText> : ''}
                </View>
                <View style={styles.containerBtns}>
                    <View style={styles.divider}/>
                    <View style={{flex: 1}}>
                        <Button title="Continue" loadingText={loadingMessage} loading={isLoading} disabled={isLoading} onPress={doValidateOTP}/>
                    </View>
                </View>
            </View>
        </Wrapper>
    )
}
