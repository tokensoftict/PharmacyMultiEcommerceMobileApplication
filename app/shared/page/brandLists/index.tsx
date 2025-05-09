import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
import { styles } from './styles';
import { normalize } from '@/shared/helpers';
import Typography from '@/shared/component/typography';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack.tsx';
import BrandService from '@/service/brands/BrandService.tsx';
import HeaderWithIcon from '@/shared/component/headerBack';
import { arrowBack } from '@/assets/icons';
import WrapperNoScroll from '@/shared/component/wrapperNoScroll';
import Input from "@/shared/component/input";

interface Category {
    id: string;
    name: string;
    image: string;
}

export default function BrandLists() {
    const navigation = useNavigation<NavigationProps>();

    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchBrands = async () => {
        setIsLoading(true);
        new BrandService().getBrandList().then((response) => {
            setIsLoading(false);
            if (response.data.status === true) {
                setCategories(response.data.data);
            }
        });
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredCategories(
            categories.filter((item) => item.name.toLowerCase().includes(query))
        );
    }, [searchQuery, categories]);

    const navigateTo = (endpoint: string, title: string, id: number) => {
        // @ts-ignore
        navigation.navigate('productList', { endpoint, title, id });
    };

    const renderItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            activeOpacity={0.85}
            onPress={() =>
                navigateTo(`stock/${item.id}/by_manufacturer`, item.name, parseInt(item.id))
            }
        >
            <View style={styles.imageWrapper}>
                <Image source={{ uri: item.image }} style={styles.categoryImage} />
            </View>
            <Typography numberOfLines={1} ellipsizeMode="tail" style={styles.categoryText}>
                {item.name}
            </Typography>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <WrapperNoScroll loading={isLoading}>
                <View style={{ paddingHorizontal: normalize(24) }}>
                    <HeaderWithIcon icon={arrowBack} onPress={() => navigation.goBack()} title="TOP BRANDS" />
                </View>

                <View style={styles.searchWrapper}>
                    <Input
                        placeholder="Search brands..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    data={filteredCategories}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={3}
                    contentContainerStyle={styles.categoryMenuContainer}
                    showsVerticalScrollIndicator={false}
                />
            </WrapperNoScroll>
        </View>
    );
}
