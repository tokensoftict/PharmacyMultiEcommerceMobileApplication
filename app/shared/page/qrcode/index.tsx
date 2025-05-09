import {Dimensions, Image, View} from "react-native";
import {normalize} from "@/shared/helpers";
import HeaderWithIcon from "@/shared/component/headerBack";
import {qrcode, shoppingBag} from "@/assets/icons";
import React, {useState} from "react";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {styles} from './style.ts';
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import QrCodeService from "@/service/auth/QrCodeService.tsx";
import {Card} from "react-native-paper";

export default function QrcodeScreen () {
    const [isLoading, setIsLoading] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const qrSize = screenWidth * 0.8; // 80% of screen width
    const qrHeight = screenHeight; // 80% of screen height
    const user = new AuthSessionService().getAuthSession();
    const qrCodeService = new QrCodeService();
    const [qrCodeLink, setQrCodeLink] = useState("");
    function loadQrCode() {
        setIsLoading(true);
        qrCodeService.qrCode(user.data?.id).then((response) => {
            setIsLoading(false);
            if(response.data.status === true) {
                setQrCodeLink(response.data.data.qrcode);
            }
        })
    }

    useEffectOnce(function(){
        loadQrCode();
    },[]);


    return (
        <View style={{flex: 1}}>
            <WrapperNoScroll loading={isLoading}>
                <HeaderWithIcon    title="MY QR CODE" />
                <View style={styles.container}>
                    <Card style={{backgroundColor: '#fff3f3',
                        borderRadius: normalize(5),
                        padding: normalize(10),
                        borderColor: '#ffcdd2',
                        borderWidth: normalize(1),}}>
                        {
                            qrCodeLink !== "" ? <Image
                                source={{ uri: qrCodeLink }}
                                style={[styles.qrImage, { width: qrSize, height: qrSize }]}
                                resizeMode="contain"
                            />
                                : <></>
                        }

                    </Card>
                </View>
            </WrapperNoScroll>
        </View>
    );
}
