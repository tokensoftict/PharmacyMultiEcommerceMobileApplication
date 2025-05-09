import React, {useState} from 'react';
import {ScrollView, View, TouchableOpacity, Image, Button, ImageBackground} from 'react-native';
import {styles} from './styles';
import Typography from "@/shared/component/typography";
import CardProduct from "@/shared/component/cardProduct";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";

interface horizontalProductList {
    title : string,
    productList : any[],
    id : number,
    moreRoute : string
}

export default function  HorizontalProductList({productList, title, id, moreRoute} : horizontalProductList) {
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
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/category-header-bg.jpg')} // Optional background image
                style={styles.sectionHeaderContainer}
                imageStyle={styles.sectionHeaderImage}
            >
                <Typography style={styles.sectionHeaderText}>{title.toUpperCase()}</Typography>

                <TouchableOpacity>
                    <Typography onPress={() => navigateTo(moreRoute, title, id)}  style={styles.sectionHeaderSubText}>See All Items</Typography>
                </TouchableOpacity>
            </ImageBackground>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {productList.map((product : any, index) => (
                    <CardProduct key={product.id} product={product} />
                ))}
            </ScrollView>


        </View>

    );
}
