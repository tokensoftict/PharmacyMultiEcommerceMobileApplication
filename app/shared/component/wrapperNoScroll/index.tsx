import React, {useState} from 'react';
import {Platform, SafeAreaView, ScrollView, View} from 'react-native';
import OverlayLoader from "../overlayLoader";
import CustomStatusBar from "../customStatusBar";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from '../../helpers';
import useDarkMode from '../../hooks/useDarkMode.tsx';
import {semantic} from '../../constants/colors';
import useEffectOnce from "../../../shared/hooks/useEffectOnce.tsx";
import {store} from "../../../redux/store/store.tsx";
import AddToCartDialog from "../../../shared/component/addToCartDialog";
import {SafeAreaProvider} from "react-native-safe-area-context";

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
    const {isDarkMode} = useDarkMode();
    const [addToCartProduct, setAddToCartProduct] = useState()

    useEffectOnce(() => {
        store.subscribe(() =>{
            const selectedProduct = store.getState().systemReducer.product
            setAddToCartProduct(selectedProduct)
        });
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor : semantic.background.white.w101,
            }}>
                <View style={{height: normalize(10)}}/>
                <AddToCartDialog product={addToCartProduct}/>
                <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight} />
               {children}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
