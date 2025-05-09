import React from 'react';
import {Dimensions, ImageBackground, TouchableOpacity, View} from "react-native";
import Carousel, {
    ICarouselInstance,
    Pagination,
} from "react-native-reanimated-carousel";
import {useSharedValue} from "react-native-reanimated";
import {normalize} from "@/shared/helpers";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";


const width = Dimensions.get("window").width;

type ImageSlider = {
    name : string;
    id : number,
    banner : string;
    seeAll : string;
};

interface ImageSliderProps {
    sliders: ImageSlider[];
}


export default function ImageSlider({sliders}: ImageSliderProps) {
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const navigation = useNavigation<NavigationProps>();
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


    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    return (
        <View style={{ flex: 1, marginBottom : normalize(15) }}>
            <Carousel
                ref={ref}
                width={width}
                height={normalize(180)}
                data={sliders}
                autoPlayInterval={4500}
                mode="parallax"
                autoPlay={true}
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                onProgressChange={progress}
                renderItem={({item, index }) => (
                    <TouchableOpacity onPress={() => navigateTo(item.seeAll, item.name, item.id)}>
                        <ImageBackground
                            source={{uri : item.banner}} // Optional background image
                            style={
                                {
                                    width: width,
                                    height: '100%',
                                }
                            }
                            imageStyle={{  resizeMode: 'cover', borderRadius: 0,}}
                        >
                        </ImageBackground>
                    </TouchableOpacity>
                )}
            />

            <Pagination.Basic
                progress={progress}
                data={sliders}
                dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
                containerStyle={{ gap: 5, marginTop: 10 }}
                onPress={onPressPagination}
            />
        </View>
    );
}
