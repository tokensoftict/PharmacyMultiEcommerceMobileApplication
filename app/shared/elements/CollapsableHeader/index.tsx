import React, {useRef, useState} from 'react';
import {styles} from "./styles";
import {
    View,
    Animated,
    StatusBar,
    SafeAreaView, RefreshControl,
} from 'react-native';
import {normalize} from "@/shared/helpers";
import AddToCartDialog from "@/shared/component/addToCartDialog";
import OverlayLoader from "@/shared/component/overlayLoader";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import {store} from "@/redux/store/store.tsx";
import Typography from "@/shared/component/typography";
import Search from "@/shared/component/search";
import {design} from "@/shared/constants/colors.ts";

const HEADER_MAX_HEIGHT = normalize(220);
const HEADER_MIN_HEIGHT = normalize(0);
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HEADER_IMAGE = require('@/assets/images/wholesales_banner.jpeg'); // Replace with your image path

interface WrapperProps {
    children: React.ReactNode;
    loading?: boolean;
    onRefresh?: () => void;
    overlayLoaderHeight?: number;
    headerText : string;
    headerSubtitle: string;

}

export default function CollapsableWrapper({headerText, headerSubtitle, children, loading, onRefresh, overlayLoaderHeight}:WrapperProps) {
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1], // no fade, stays fully visible
        extrapolate: 'clamp',
    });

    const imageTranslate = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -0],
        extrapolate: 'clamp',
    });

    const actionBarVisible = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
    });

    const [addToCartProduct, setAddToCartProduct] = useState()

    useEffectOnce(() => {
        store.subscribe(() =>{
            const selectedProduct = store.getState().systemReducer.product
            setAddToCartProduct(selectedProduct)
        });
    }, []);
//opacity: loading ? 0 : 1,
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={design.text1.background} barStyle="light-content" />
            <Animated.View
                style={[
                    styles.actionBar,
                    {
                        opacity: actionBarVisible,
                        transform: [
                            {
                                translateY: actionBarVisible.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-50, 0],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.actionBarContent}>
                    <Search placeholder={"Search Products..."} onChange={() => {
                    }} value={undefined}/>
                </View>
            </Animated.View>
            <AddToCartDialog product={addToCartProduct}/>
            <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight}/>
            <Animated.View style={[styles.header, { height: headerHeight, opacity: loading ? 0 : 1 }]}>
                <Animated.Image
                    source={HEADER_IMAGE}
                    style={[
                        styles.headerBackground,
                        {
                            opacity: imageOpacity,
                            transform: [{ translateY: imageTranslate }],
                        },
                    ]}
                    resizeMode="cover"
                />
                <View style={styles.headerOverlay}>
                    <Typography style={styles.headerText}>{headerText}</Typography>
                    <Typography style={styles.headerSubtitle}>{headerSubtitle}</Typography>
                    <View style={{flex : 1, marginTop : normalize(5)}}>
                        <Search placeholder={"Search Products..."} onChange={() => {
                        }} value={undefined}/>
                    </View>
                </View>
            </Animated.View>


                <Animated.ScrollView
                    contentContainerStyle={[styles.scrollContent, {opacity: loading ? 0 : 1}]}
                    refreshControl={
                        <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY }}}],
                        { useNativeDriver: false }
                    )}
                >
                    {children}
                </Animated.ScrollView>


        </SafeAreaView>
    );
};


