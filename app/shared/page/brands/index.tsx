import React, {useState} from "react";
import {Animated, ScrollView, View} from "react-native";
import Typography from "@/shared/component/typography";
import {_styles} from './styles'
import useDarkMode from "@/shared/hooks/useDarkMode";
import {Data} from "@/service/category/CategoryInterface";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import {ProductList} from "@/service/product/ProductListInterface";
import SmallCardProduct from "@/shared/component/smallCardProduct";
import HeaderWithIcon from "@/shared/component/headerBack";
import {brand, shoppingBag} from "@/assets/icons";
import {normalize} from "@/shared/helpers";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import FlatList = Animated.FlatList;
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack";
import BrandService from "@/service/brands/BrandService";

export default function Brands() {
    const {isDarkMode} = useDarkMode();
    const styles = _styles(isDarkMode);
    const [lastPage, setLastPage] = useState(3);
    const navigation = useNavigation<NavigationProps>();
    const [isBrandLoading, setIsBrandLoading] = useState(false);
    const [brandResponseList, setBrandResponseList] = useState<Data[]>([]);
    const [pageNumber, setPageNumber] =useState(1);

    function navigateTo(endpoint : string, title : string, id : number) {
        // @ts-ignore
        navigation.navigate('productList',
            {
                endpoint : endpoint,
                title : title,
                id : id
            }
        )
    }

    function loadBrand () {
        if(pageNumber >= lastPage) return ;
        setIsBrandLoading(true);
        (new BrandService()).getBrands(pageNumber).then((response) => {
            setIsBrandLoading(false);
            if(response.data.status === true) {
                setLastPage(response.data.meta.last_page);
                setPageNumber((existingPageNumber) => {
                    if(existingPageNumber == 1) return 2;
                    return (existingPageNumber + 1)
                });
                setBrandResponseList((existingBrand) => {
                    return [...existingBrand, ...response.data.data];
                });
            }
        }, (error) =>{
            setIsBrandLoading(false);
        })
    }

    useEffectOnce(() =>{
        loadBrand();
    }, []);

    const categoryItem = (id : number, title : string, stocks: ProductList[]) => {
        return (
            <View>
                <View style={styles.categoryHeader}>
                    <Typography style={styles.categoryName}>{title.toUpperCase()}</Typography>
                    <Typography onPress={() => {
                        navigateTo("stock/"+id+"/by_manufacturer", title.toUpperCase(), id)
                    }} style={styles.seeAll}>SEE ALL</Typography>
                </View>
                <View style={styles.categoryBody}>
                    {
                        stocks.map((stock) => {
                            return (
                                // @ts-ignore
                                <SmallCardProduct key={stock.id} product={stock}/>
                            )
                        })
                    }
                </View>
            </View>
        );
    }



    return (
        <WrapperNoScroll loading={isBrandLoading}>
            <HeaderWithIcon   title="BRANDS" />
        <View style={{flex: 1}}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={brandResponseList}
                removeClippedSubviews={false}
                keyExtractor={(item) => item.id.toString()}
                numColumns={1}
                renderItem={({item}) => (
                    <View style={styles.holder}>
                        {categoryItem(item.id, item.name, item.stocks)}
                    </View>
                )}
                onEndReached={() => {
                    if (!isBrandLoading) {
                        loadBrand();
                    }
                }}
                onEndReachedThreshold={0.5}
            />
        </View>
        </WrapperNoScroll>
    );

}
