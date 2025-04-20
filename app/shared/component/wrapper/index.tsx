import React, {useState} from 'react';
import {RefreshControl, SafeAreaView, ScrollView, View} from 'react-native';
import OverlayLoader from "../overlayLoader";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from '../../helpers';
import useDarkMode from '../../hooks/useDarkMode.tsx';
import {palette, semantic} from '../../constants/colors';
import AddToCartDialog from "@/shared/component/addToCartDialog";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import {store} from "@/redux/store/store.tsx";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Environment from "@/shared/utils/Environment.tsx";

interface WrapperProps {
    children: React.ReactNode;
    backgroundColorStatusBar?: string;
    barStyle?: StatusBarStyle;
    loading?: boolean;
    titleLoader?: string;
    overlayLoaderHeight?: number;
    onRefresh?: () => void;
}
export default function Wrapper({
                                    children,
                                    backgroundColorStatusBar,
                                    barStyle,
                                    loading,
                                    titleLoader,
                                    overlayLoaderHeight,
                                    onRefresh
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
        Environment.checkForImpersonateCustomerData() ?
            <View style={{flex : 1,  backgroundColor: semantic.background.white.w101}}>
                <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight} />
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} />
                    }
                    >
                    {children}
                </ScrollView>
            </View>
            : <SafeAreaProvider>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor : semantic.background.white.w101,
            }}>
                <View style={{ backgroundColor : semantic.background.white.w101, flex : 1, width : '100%', height : '100%'}}>
                    <View style={{height: normalize(10)}}/>
                    <AddToCartDialog product={addToCartProduct}/>
                    <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight}/>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} />
                        }
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0)'}}
                        showsVerticalScrollIndicator={false}>
                        {children}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>

    );
}
