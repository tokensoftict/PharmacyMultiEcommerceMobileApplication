import React, {useState} from "react";
import WholesalesHomeService from "@/service/wholesales/WholesalesHomeService";
import {homeBuild} from "@/service/wholesales/interface/WholesalesHomePageInterface.ts";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import {View} from "react-native";
import CollapsableHeader from "shared/elements/CollapsableHeader";
import TopBrands from "shared/elements/TopBrands";
import HorizontalProductList from "@/shared/component/HorizontalProductList";
import FlashDeals from "@/shared/elements/FlashDeals";
import ImageSlider from "@/shared/elements/ImageSlider";


export default function WholesalesHomePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [homePageData, setHomePageData] = useState<homeBuild[]>([]);
    const wholesalesService = new WholesalesHomeService();
    useEffectOnce(function(){
        loadHomePage();
    },[]);

    function loadHomePage() {
        setIsLoading(true)
        wholesalesService.loadHomePage().then(function(response){
            setIsLoading(false);
            setHomePageData(response.data.data);
        }, function (error){setIsLoading(false)})
    }


    return (
        <CollapsableHeader headerText={"WHOLESALES AND BULK-SALES"} headerSubtitle={"Purchase medications and health supplies at wholesale prices and in bulk quantities."} loading={isLoading} onRefresh={loadHomePage}>
            <View style={{ width: '100%', height: '100%' }}>
                {
                    homePageData.map((item, index) => {
                        const key = `${item.type}-${index}`;
                        if (item.component === 'topBrands') {
                            return (
                                <TopBrands key={index} categories={item.data.brands} title={item.data.label} />
                            );
                        } else if (item.component === 'Horizontal_List') {
                            return (
                                <HorizontalProductList key={key} title={item.label ?? ""} productList={item.data} id={item.data.id} moreRoute={item.seeAll ?? ""} />
                            );
                        }else if (item.component === 'FlashDeals') {
                            return (
                                <FlashDeals key={key} title={item.label} deals={item.data} />
                            );
                        }
                        else if (item.component === 'ImageSlider') {
                            return (
                                <ImageSlider key={key} sliders={item.data} />
                            );
                        }
                        else {
                            return <React.Fragment key={key} />;
                        }
                    })
                }
            </View>
        </CollapsableHeader>
    );

}
