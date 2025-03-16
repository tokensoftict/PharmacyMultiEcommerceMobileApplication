import {Dimensions, Image, View} from "react-native";
import {normalize} from "@/shared/helpers";
import HeaderWithIcon from "@/shared/component/headerBack";
import {qrcode, shoppingBag} from "@/assets/icons";
import React, {useState} from "react";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {styles} from './style.ts';
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

export default function QrcodeScreen () {
    const [isLoading, setIsLoading] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const qrSize = screenWidth * 0.8; // 80% of screen width
    const qrHeight = screenHeight * 0.8; // 80% of screen height

    const user = new AuthSessionService().getAuthSession();


    return (
        <View style={{flex: 1}}>
            <WrapperNoScroll loading={isLoading}>
                <View style={{paddingHorizontal: normalize(24)}}>
                    <HeaderWithIcon icon={qrcode}   title="MY QR CODE" />
                </View>
                <View style={styles.container}>
                    <Image
                        source={{ uri: 'http://auth.staging.generaldrugcentre.com/api/v1/account/my-qrcode?id='+user.data?.id }}
                        style={[styles.qrImage, { width: qrSize, height: qrSize }]}
                        resizeMode="contain"
                    />
                </View>
            </WrapperNoScroll>
        </View>
    );
}
