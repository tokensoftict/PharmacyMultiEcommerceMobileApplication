import React, {useState} from "react";
import {Animated, ScrollView, View} from "react-native";
import Typography from "@/shared/component/typography";
import {_styles} from './styles'
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import {Data} from "@/service/category/CategoryInterface.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import CategoryService from "@/service/category/CategoryService";
import {ProductList} from "@/service/product/ProductListInterface.tsx";
import SmallCardProduct from "@/shared/component/smallCardProduct";
import HeaderWithIcon from "@/shared/component/headerBack";
import {categories, shoppingBag} from "@/assets/icons";
import {normalize} from "@/shared/helpers";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import FlatList = Animated.FlatList;
import {ButtonOutline} from "@/shared/component/buttons";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";

export default function Categories() {
    const {isDarkMode} = useDarkMode();
    const styles = _styles(isDarkMode);
    let hasReachTheEnd = false;
    const [lastPage, setLastPage] = useState(3);
    const navigation = useNavigation<NavigationProps>();
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const [categoryResponseList, setCategoryResponseList] = useState<Data[]>([]);
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

    function loadCategory () {
        if(pageNumber >= lastPage) return ;
        setIsCategoryLoading(true);
        (new CategoryService()).getCategories(pageNumber).then((response) => {
            setIsCategoryLoading(false);
            if(response.data.status === true) {
                setPageNumber((existingPageNumber) =>{
                    if(existingPageNumber == 1) return 2;
                    return (existingPageNumber + 1)
                });
                setCategoryResponseList((existingCategory) => {
                    return [...existingCategory, ...response.data.data];
                });
            }
        }, (error) =>{
            setIsCategoryLoading(false);
        })
    }

    useEffectOnce(() =>{
        loadCategory();
    }, []);

    const categoryItem = (id : number, title : string, stocks: ProductList[]) => {
        return (
            <View key={id} style={styles.categoryHolder}>
                <View style={styles.categoryHeader}>
                    <Typography style={styles.categoryName}>{title.toUpperCase()}</Typography>
                    <Typography onPress={() => {
                        navigateTo("stock/"+id+"/by_productcategory", title.toUpperCase(), id)
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
        <WrapperNoScroll loading={isCategoryLoading}>
        <View style={{flex: 1}}>
            <HeaderWithIcon  title="CATEGORIES" />
            <FlatList
               showsVerticalScrollIndicator={false}
               removeClippedSubviews={false}
                numColumns={1}
                onEndReached={() => {
                    if (!isCategoryLoading) {
                        loadCategory()
                    }
                }}
                onEndReachedThreshold={0.5}
                data={categoryResponseList}
                keyExtractor={(item) => item.id.toString()}
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
        </View>
        </WrapperNoScroll>
    );

}
