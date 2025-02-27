import Wrapper from "../../../shared/component/wrapper";
import React, {useEffect, useState} from "react";
import {ScrollView, View} from "react-native";
import Header from "../../../shared/component/header";
import Search from "../../../shared/component/search";
import WholesalesHomeService from "../../../service/wholesales/WholesalesHomeService";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {WholesalesHomePageInterface} from "@/service/wholesales/interface/WholesalesHomePageInterface.ts";
import SpecialOffers from "../../../shared/component/specialOffers";
import useEffectOnce from "../../../shared/hooks/useEffectOnce.tsx";
import HorizontalProductList from "../../../shared/component/HorizontalProductList";
import {store} from "../../../redux/store/store";
import {ProductListInterface} from "../../../service/product/ProductListInterface";
import AddToCartDialog from "../../../shared/component/addToCartDialog";


export default function WholesalesHomePage() {
    const navigation = useNavigation<NavigationProps>();
    const [isLoading, setIsLoading] = useState(false);
    const [homePageData, setHomePageData] = useState<WholesalesHomePageInterface>();
    const wholesalesService = new WholesalesHomeService();
    useEffectOnce(function(){
        setIsLoading(true)
        wholesalesService.loadHomePage().then(function(response){
            setIsLoading(false)
            setHomePageData(response.data)
        }, function (error){setIsLoading(false)})
    },[]);

    return (
        <Wrapper loading={isLoading}>
                <Header/>
                <Search placeholder={"Search For Products."} onChange={() => {
                }} value={undefined}/>

                {
                    homePageData?.data?.banners  ?
                        <SpecialOffers  banners={homePageData.data.banners}/> :
                        ''
                }
                {
                    homePageData?.data?.productLists ?
                        homePageData?.data?.productLists.map(productList => (
                            <HorizontalProductList key={productList.id} title={productList.label} productList={productList.products} serverURL={productList.label} moreRoute={productList.label}/>
                        )) :
                        ''
                }
        </Wrapper>
    );

}
