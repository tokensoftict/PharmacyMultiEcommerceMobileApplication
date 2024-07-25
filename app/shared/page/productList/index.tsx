import React, {useState} from "react";
import {Animated, ScrollView, View} from "react-native";
import useDarkMode from "../../../shared/hooks/useDarkMode.tsx";
import {_styles} from "./styles";
import {useNavigation, useRoute} from "@react-navigation/native";
import {NavigationProps} from "../../../shared/routes/stack";
import Header from "../../../shared/page/product/components/header";
import WrapperNoScroll from "../../../shared/component/wrapperNoScroll";
import useEffectOnce from "../../../shared/hooks/useEffectOnce.tsx";
import {normalize} from "../../../shared/helpers";
import {ButtonOutline} from "../../../shared/component/buttons";
import FlatList = Animated.FlatList;
import ProductListService from "../../../shared/page/productList/service/ProductListService.tsx";
import {ProductListInterface} from "../../../service/product/ProductListInterface.tsx";
import Toast from "react-native-toast-message";
import CardProduct from "../../../shared/component/cardProduct";


export default function ProductList() {
    const {isDarkMode} = useDarkMode();
    const styles = _styles(isDarkMode);
    const route = useRoute();
    const navigation = useNavigation<NavigationProps>();
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [pageNumber, setPageNumber] =useState(1);
    const [title , setTitle] = useState("");
    const [listId , setListId] = useState();
    const [endpoint , setEndPoint] = useState("");
    const [productList, setProductList] = useState<ProductListInterface[]>([])

    useEffectOnce(function(){
        // @ts-ignore
        setTitle(route.params?.title)
        // @ts-ignore
        setListId(route.params?.id)
        // @ts-ignore
        setEndPoint(route.params?.endpoint);

        // @ts-ignore
        loadProduct(route.params?.endpoint);
    }, [])


    function loadProduct(link: string) {
        setIsProductLoading(true);
        (new ProductListService().getProduct(link, pageNumber).then((response) => {
            setIsProductLoading(false);
            if(response.data.status === true) {
                setProductList(response.data.data);
            }
        }, (error) => {
            setIsProductLoading(false);
            Toast.show({
                type: 'error',
                text2: 'Unknown error occurred!',
                position : "top",
            });
            navigation.goBack();
        }))
    }

    return (
        <WrapperNoScroll loading={isProductLoading}>
            <View style={styles.containerHeader}>
                <Header title={title} />
                <View style={{height: normalize(10)}}/>
            </View>
            <FlatList
                numColumns={2}
                data={productList}
                // @ts-ignore
                keyExtractor={(item, index) =>item.id.toString()}
                renderItem={(item) => {
                    return  (
                        <CardProduct key={item.item.id} product={item.item} />
                    )
                }}
                ListFooterComponent={
                    <View style={{paddingHorizontal:normalize(15), marginBottom:normalize(30)}}>
                        <ButtonOutline title={'LORD MORE'} onPress={() => {
                        }}/>
                    </View>
                }
            >
            </FlatList>

        </WrapperNoScroll>
    );
}
