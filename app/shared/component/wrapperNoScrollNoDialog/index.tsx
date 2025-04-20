import React, {useState} from 'react';
import {Platform, SafeAreaView, ScrollView, View} from 'react-native';
import OverlayLoader from "../overlayLoader";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from '../../helpers';
import useDarkMode from '../../hooks/useDarkMode.tsx';
import {semantic} from '../../constants/colors';
import {SafeAreaProvider} from "react-native-safe-area-context";

interface WrapperProps {
    children: React.ReactNode;
    backgroundColorStatusBar?: string;
    barStyle?: StatusBarStyle;
    loading?: boolean;
    titleLoader?: string;
    overlayLoaderHeight?: number;
}
export default function WrapperNoScrollNoDialog({
                                                    children,
                                                    backgroundColorStatusBar,
                                                    barStyle,
                                                    loading,
                                                    titleLoader,
                                                    overlayLoaderHeight,
                                                }: WrapperProps) {
    const {isDarkMode} = useDarkMode();
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor : semantic.background.white.w101,
                marginTop : normalize(32)
            }}>
                <View style={{height: normalize(10)}}/>
                <View>
                    <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight} />
                    {children}
                </View>
                {Platform.OS === 'ios' && <View style={{height: normalize(20)}} />}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
