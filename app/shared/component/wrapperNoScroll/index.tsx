import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, StatusBar, View} from 'react-native';
import OverlayLoader from "@/shared/component/overlayLoader";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from '@/shared/helpers';
import {design, semantic} from '@/shared/constants/colors';
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import {store} from "@/redux/store/store.tsx";
import AddToCartDialog from "@/shared/component/addToCartDialog";
import {SafeAreaProvider,SafeAreaView} from "react-native-safe-area-context";

interface WrapperProps {
    children: React.ReactNode;
    backgroundColorStatusBar?: string;
    barStyle?: StatusBarStyle;
    loading?: boolean;
    titleLoader?: string;
    overlayLoaderHeight?: number;
}
export default function WrapperNoScroll({
                                            children,
                                            backgroundColorStatusBar,
                                            barStyle,
                                            loading,
                                            titleLoader,
                                            overlayLoaderHeight,
                                        }: WrapperProps) {

    const [addToCartProduct, setAddToCartProduct] = useState()

    useEffectOnce(() => {
        store.subscribe(() =>{
            const selectedProduct = store.getState().systemReducer.product
            setAddToCartProduct(selectedProduct)
        });
    }, []);

    return (

        <SafeAreaProvider>
            <StatusBar backgroundColor={design.text1.background} barStyle="light-content" />
            <SafeAreaView
                edges={['top']}
                style={{
                flex: 1,
                backgroundColor : design.text1.background
            }}>

                    <View style={{ backgroundColor : semantic.background.white.w101, flex : 1, width : '100%', height : '100%'}}>

                        <AddToCartDialog product={addToCartProduct}/>
                        <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight} />
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            keyboardVerticalOffset={Platform.OS === "ios" ? normalize(50) : 0} // adjust if needed
                        >
                        <View style={{opacity: loading ? 0 : 1, flex: 1, width : '100%', height : '100%', backgroundColor: "#FFF"}}>
                            {children}
                        </View>
                        </KeyboardAvoidingView>
                    </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}
