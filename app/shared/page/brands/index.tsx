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
import {ButtonOutline} from "@/shared/component/buttons";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack";
import BrandService from "@/service/brands/BrandService";

export default function Brands() {
    const {isDarkMode} = useDarkMode();
    const styles = _styles(isDarkMode);
    let hasReachTheEnd = false;
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
        setIsBrandLoading(true);
        (new BrandService()).getBrands(pageNumber).then((response) => {
            setIsBrandLoading(false);
            if(response.data.status === true) {
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
            <View key={id} style={styles.categoryHolder}>
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
        <View style={{flex: 1}}>
            <WrapperNoScroll loading={isBrandLoading}>
                {
                    isBrandLoading ?
                        <></> :
                        <>
                            <View style={{paddingHorizontal: normalize(24)}}>
                                <HeaderWithIcon icon={brand}  onPress={() =>{
                                    if(!isBrandLoading) {
                                        loadBrand();
                                    }
                                }} title="BRANDS" />
                            </View>
                            <FlatList
                                ListFooterComponent={
                                    <View style={{paddingHorizontal:normalize(15), marginBottom:normalize(30)}}>
                                        <ButtonOutline title={'LORD MORE'} onPress={() => {
                                            loadBrand()
                                        }}/>
                                    </View>
                                }
                                numColumns={1}
                                data={brandResponseList}
                                keyExtractor={(item, index) => item.id.toString()+Math.floor(Math.random() * 10).toString()}
                                renderItem={(item) => {
                                    return  (
                                        <View style={styles.holder}>
                                            {
                                                categoryItem(item.item?.id, item.item?.name, item.item?.stocks)
                                            }
                                        </View>
                                    )

                                }}>
                            </FlatList>
                            <View style={{height: normalize(80)}}/>
                        </>
                }

            </WrapperNoScroll>
        </View>
    );

}
