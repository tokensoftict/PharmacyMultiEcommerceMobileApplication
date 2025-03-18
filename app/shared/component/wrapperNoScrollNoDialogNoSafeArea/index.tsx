import React, {useState} from 'react';
import {Platform, SafeAreaView, ScrollView, View} from 'react-native';
import OverlayLoader from "../overlayLoader";
import CustomStatusBar from "../customStatusBar";
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
export default function WrapperNoScrollNoDialogNoSafeArea({loading, overlayLoaderHeight, children}: WrapperProps) {
    return (
        <View style={{flex : 1,  backgroundColor: "#f8f9fa",}}>
            <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight} />
            {children}
        </View>
    );
}
