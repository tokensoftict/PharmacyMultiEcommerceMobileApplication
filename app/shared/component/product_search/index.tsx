import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    TouchableOpacity,
    Animated,
    Modal,
    ActivityIndicator,
    Dimensions,
    Image, KeyboardAvoidingView, Platform,
} from "react-native";
import Icon from "@/shared/component/icon";
import { arrowBack, filter } from "@/assets/icons";
import Input from "@/shared/component/input";
import { normalize } from "@/shared/helpers";
import { design } from "@/shared/constants/colors.ts";
import { activeOpacity, currencyType } from "@/shared/constants/global.ts";
import SearchProductService from "@/service/product/SearchProductService.tsx";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import Typography from "@/shared/component/typography";
import Environment from "@/shared/utils/Environment.tsx";
import {MILISEARCH_MASTER_INDEX, MILISEARCH_MASTER_KEY, MILISEARCH_URL} from "@env";

interface SearchDialogProps {
    visible: boolean;
    onClose: () => void;
    onItemSelected?: (item: any) => void;
}

export default function SearchDialog({ visible, onClose, onItemSelected }: SearchDialogProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [submittedResults, setSubmittedResults] = useState<any[]>([]);
    const [popularProducts, setPopularProducts] = useState<any[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const translateYAnim = useState(new Animated.Value(-10))[0];
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProps>();

    const meilisearch = new SearchProductService({
        host: MILISEARCH_URL,
        apiKey: MILISEARCH_MASTER_KEY,
        index: MILISEARCH_MASTER_INDEX
    });

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            fadeAnim.setValue(0);
            translateYAnim.setValue(-10);
        }
    }, [visible]);

    useEffect(() => {
        if (visible && popularProducts.length === 0) {
            loadPopularProducts();
        }
    }, [visible]);

    const loadPopularProducts = async () => {
        setLoading(true);
        try {
            const data = await meilisearch.getPopularProducts({ limit: 22 });
            setPopularProducts(data || []);
        } catch (error) {
            console.error("Error loading popular products:", error);
        }
        setLoading(false);
    };

    const handleSearch = async (text: string) => {
        setQuery(text);
        setIsSubmitted(false);
        if (text.length > 3) {
            setLoading(true);
            try {
                // @ts-ignore
                const data = await meilisearch.query(text, { limit: 20 });
                setResults(data || []);
            } catch (error) {
                console.error("Search error:", error);
            }
            setLoading(false);
        } else {
            setResults([]);
        }
    };

    const handleQuerySubmit = async () => {
        if (query.length > 3) {
            setLoading(true);
            setIsSubmitted(true);
            try {
                // @ts-ignore
                const data = await meilisearch.query(query, { limit: 40 });
                setSubmittedResults(data || []);
            } catch (error) {
                console.error("Submit search error:", error);
            }
            setLoading(false);
        }
    };

    const navigateTo = (productId: string) => {
        // @ts-ignore
        navigation.navigate("detailProduct", { productId });
        setResults([]);
        setSubmittedResults([]);
        setIsSubmitted(false);
        onClose();
    };

    const renderProductItem = ({ item }: any) => (
        <TouchableOpacity
            style={{
                width: Dimensions.get('window').width / 3 - normalize(10),
                margin: normalize(5),
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#f9f9f9",
                borderRadius: 8,
                padding: normalize(8),
                alignItems: "center"
            }}
            activeOpacity={activeOpacity}
            onPress={() => onItemSelected ? onItemSelected(item) : navigateTo(item.id)}
        >
            <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: normalize(80), borderRadius: 6, resizeMode: "contain" }}
            />
            <Typography numberOfLines={1} style={{ marginTop: 5, fontWeight: "500", fontSize: normalize(11) }}>
                {item.name}
            </Typography>
            <Typography style={{ color: "red", fontWeight: "600", fontSize: normalize(12) }}>
                {currencyType}
                {item?.[Environment.isWholeSalesEnvironment() ? "wholesales" : "retail"]?.price}
            </Typography>
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{
                        height: normalize(130),
                        width: '100%',
                        backgroundColor: design.text1.background,
                        paddingTop: normalize(50),
                        paddingHorizontal: normalize(15)
                    }}>
                        <Animated.View style={{
                            width: "100%",
                            flex: 1,
                            borderRadius: 10,
                            opacity: fadeAnim,
                            transform: [{ translateY: translateYAnim }]
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: 5 }}>
                                <Input
                                    leftIcon={<Icon icon={arrowBack} onPress={() => {
                                        setResults([]);
                                        setSubmittedResults([]);
                                        setIsSubmitted(false);
                                        onClose();
                                        setQuery("");
                                    }} />}
                                    rightIcon={<Icon icon={filter} />}
                                    value={query}
                                    autoFocus={true}
                                    onChangeText={handleSearch}
                                    onSubmitEditing={handleQuerySubmit}
                                    placeholder={'Search for Product, Drugs and Cosmetics...'}
                                />
                            </View>
                            {loading && <ActivityIndicator size="large" color="red" style={{ marginTop: 10 }} />}
                        </Animated.View>
                    </View>

                    <View style={{ flex: 1, backgroundColor: "#FFF", padding: normalize(10) }}>
                        {!loading && query.length <= 3 && !isSubmitted && (
                            <>
                                <Typography style={{
                                    fontSize: normalize(14),
                                    fontWeight: "700",
                                    paddingVertical: normalize(10),
                                    marginBottom: normalize(10)
                                }}>POPULAR PRODUCTS</Typography>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={popularProducts}
                                    numColumns={3}
                                    renderItem={renderProductItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                />
                            </>
                        )}

                        {!loading && results.length > 0 && query.length > 3 && !isSubmitted && (
                            <FlatList
                                data={results}
                                keyExtractor={(item) => item.id.toString()}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        activeOpacity={activeOpacity}
                                        onPress={() => onItemSelected ? onItemSelected(item) : navigateTo(item.id)}
                                    >
                                        <View style={{
                                            padding: normalize(15),
                                            backgroundColor: "#fff",
                                            borderRadius: 5
                                        }}>
                                            <Typography numberOfLines={1} style={{
                                                fontWeight: '500',
                                                fontSize: normalize(12)
                                            }}>
                                                {item.name}
                                            </Typography>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}

                        {!loading && isSubmitted && submittedResults.length > 0 && (
                            <>
                                <Typography style={{
                                    fontSize: normalize(14),
                                    fontWeight: "700",
                                    paddingVertical: normalize(10),
                                    marginBottom: normalize(10)
                                }}>SEARCH RESULTS</Typography>
                                <FlatList
                                    data={submittedResults}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={3}
                                    renderItem={renderProductItem}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                />
                            </>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
