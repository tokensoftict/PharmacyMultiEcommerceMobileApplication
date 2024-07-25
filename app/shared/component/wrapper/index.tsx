import React, {useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import OverlayLoader from "../overlayLoader";
import CustomStatusBar from "../customStatusBar";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from '../../helpers';
import useDarkMode from '../../hooks/useDarkMode.tsx';
import {semantic} from '../../constants/colors';
import AddToCartDialog from "../../../shared/component/addToCartDialog";
import {ProductListInterface} from "../../../service/product/ProductListInterface.tsx";
import useEffectOnce from "../../../shared/hooks/useEffectOnce.tsx";
import {store} from "../../../redux/store/store.tsx";

interface WrapperProps {
  children: React.ReactNode;
  backgroundColorStatusBar?: string;
  barStyle?: StatusBarStyle;
  loading?: boolean;
  titleLoader?: string;
}
export default function Wrapper({
  children,
  backgroundColorStatusBar,
  barStyle,
  loading,
  titleLoader,
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

    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? semantic.background.red.d500 : 'white',

      }}>
      <AddToCartDialog product={addToCartProduct}/>
      <OverlayLoader loading={loading} title={""} />
      <CustomStatusBar
        barStyle={barStyle}
        backgroundColor={backgroundColorStatusBar}
      />

      <View style={{height: normalize(32), backgroundColor: 'black',  opacity: 0}} />
      <ScrollView style={{marginBottom:normalize(100), backgroundColor: 'rgba(255, 255, 255, 0)'}} showsVerticalScrollIndicator={false}>{children}</ScrollView>
      {Platform.OS === 'ios' && <View style={{height: normalize(20), backgroundColor: 'black',  opacity: 0}} />}
    </View>
  );
}
