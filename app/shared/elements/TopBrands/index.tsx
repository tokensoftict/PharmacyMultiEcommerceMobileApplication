import React from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { styles } from './styles';
import Typography from "@/shared/component/typography";
import {normalize} from "@/shared/helpers";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";

type Brand = {
    id: string;
    name: string;
    image: string;
};

interface TopBrandsMenuProps {
    categories: Brand[];
    title : string;
}


export default function TopBrands ({ categories, title } : TopBrandsMenuProps){
    const navigation = useNavigation<NavigationProps>();
    function navigateTo() {
        // @ts-ignore
        navigation.navigate('brandList')
    }

    function listProduct(endpoint : string, title : string, id : number) {
        // @ts-ignore
        navigation.navigate('productList',
            {
                endpoint : endpoint,
                title : title,
                id : id
            }
        )
    }

    return (
        <View style={{marginTop:normalize(10)}}>
            {/* Section Header */}
            <ImageBackground
                source={require('@/assets/images/category-header-bg.jpg')} // Optional background image
                style={styles.sectionHeaderContainer}
                imageStyle={styles.sectionHeaderImage}
            >
                <Typography style={styles.sectionHeaderText}>{title.toUpperCase()}</Typography>

                <TouchableOpacity>
                    <Typography onPress={() => navigateTo()}  style={styles.sectionHeaderSubText}>See All Items</Typography>
                </TouchableOpacity>
            </ImageBackground>

            {/* Scrollable Category Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryMenuContainer}
            >
                {categories.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.categoryCard}
                        activeOpacity={0.8}
                        onPress={() => listProduct("stock/"+item.id+"/by_manufacturer", item.name, parseInt(item.id))}
                    >
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: item.image }} style={styles.categoryImage} />
                        </View>
                        <Typography numberOfLines={1} ellipsizeMode="tail" style={styles.categoryText}>
                            {item.name}
                        </Typography>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

