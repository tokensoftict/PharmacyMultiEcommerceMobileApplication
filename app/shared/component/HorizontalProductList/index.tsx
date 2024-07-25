import React, {useState} from 'react';
import {ScrollView, View, TouchableOpacity, Image, Button} from 'react-native';
import {styles} from './styles';
import Typography from "../../../shared/component/typography";
import CardProduct from "../../../shared/component/cardProduct";
import ButtonSheet from "@/shared/component/buttonSheet";
import CardProductHorizontal from "@/shared/component/cardProductHorizontal";
import {ButtonOutline} from "@/shared/component/buttons";

interface horizontalProductList {
    title : string,
    productList : any[],
    serverURL : string,
    moreRoute : string
}

export default function  HorizontalProductList({productList, title, serverURL, moreRoute} : horizontalProductList) {
    return (
        <View style={styles.container}>
            <Typography style={styles.titleSection}>
                {title}
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {productList.map((product : any, index) => (
                    <CardProduct key={product.id} product={product} />
                ))}
            </ScrollView>


        </View>

    );
}
