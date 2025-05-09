import React from 'react';
import {
    View,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    Animated,
} from 'react-native';
import styles from './styles';
import { normalize } from '@/shared/helpers';
import Typography from '@/shared/component/typography';
import {currencyType} from "@/shared/constants/global.ts";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";

interface Deal {
    id : number;
    name: string;
    price: string;
    icon : string;
    seeAll : string
}

interface flashDealProps {
    title?: string;
    deals?: Deal[];
}

export default function FlashDeals({title, deals} : flashDealProps) {


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


    const renderDeal = ({ item }: { item: Deal }) => {
        return (
            <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8} onPress={() =>navigateTo(item.seeAll, item.name, item.id)}>
                <View style={styles.cardInner}>
                    <View style={styles.cardContent}>
                        <Typography numberOfLines={1} ellipsizeMode={"tail"} style={styles.productName}>
                            {item.name}
                        </Typography>
                        <Typography style={styles.productPrice}>
                            {currencyType}{item.price}
                        </Typography>
                    </View>
                    <Animated.Text style={styles.fireIcon}>{item.icon}</Animated.Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ marginBottom: normalize(20) }}>
            <ImageBackground
                source={require('@/assets/images/category-header-bg.jpg')}
                style={styles.sectionHeaderContainer}
                imageStyle={styles.sectionHeaderImage}
            >
                <Typography style={styles.sectionHeaderText}>
                    {(title ?? "").toUpperCase()}
                </Typography>
            </ImageBackground>

            <FlatList
                data={deals}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: normalize(10) }}
                contentContainerStyle={{ paddingTop: normalize(15) }}
                renderItem={renderDeal}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
