import React, {useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import OverlayLoader from "../overlayLoader";
import CustomStatusBar from "../customStatusBar";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from '../../helpers';
import useDarkMode from '../../hooks/useDarkMode.tsx';
import {semantic} from '../../constants/colors';
import useEffectOnce from "../../../shared/hooks/useEffectOnce.tsx";
import {store} from "../../../redux/store/store.tsx";
import {ProductListInterface} from "../../../service/product/ProductListInterface";
import AddToCartDialog from "../../../shared/component/addToCartDialog";

interface WrapperProps {
  children: React.ReactNode;
  backgroundColorStatusBar?: string;
  barStyle?: StatusBarStyle;
  loading?: boolean;
  titleLoader?: string;
}
export default function WrapperNoScroll({
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
            console.log(selectedProduct);
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
      <OverlayLoader loading={loading} title={titleLoader} />
      <CustomStatusBar
        barStyle={barStyle}
        backgroundColor={backgroundColorStatusBar}
      />
      <View style={{height: normalize(32)}} />
        {children}
        {Platform.OS === 'ios' && <View style={{height: normalize(20), backgroundColor: 'black',  opacity: 0}} />}

    </View>
  );
}
