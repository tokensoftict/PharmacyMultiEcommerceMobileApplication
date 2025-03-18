import React, {useEffect, useState} from "react";
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Animated,
    Modal,
    ActivityIndicator,
} from "react-native";
import Icon from "@/shared/component/icon";
import {arrowBack, filter} from "@/assets/icons";
import Input from "@/shared/component/input";
import {normalize} from "@/shared/helpers";
import {semantic} from "@/shared/constants/colors.ts";
import {activeOpacity} from "@/shared/constants/global.ts";
import SearchProductService from "@/service/product/SearchProductService.tsx";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import Typography from "@/shared/component/typography";
export default function SearchDialog({ visible, onClose, onItemSelected = undefined }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const translateYAnim = useState(new Animated.Value(-10))[0];
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProps>();

    const meilisearch = new SearchProductService(
        {
            host : "http://192.168.0.116:7700",
            apiKey: "YOUR_MASTER_KEY",
            index :"stocks"
        }
    )


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



    const handleSearch = async (text : string) => {
        setQuery(text);

        if (text.length > 3) {
            setLoading(true);
            try {
                // Replace with your actual API endpoint
                const data = await meilisearch.query(text)
                console.log(data);
                // @ts-ignore
                setResults(data); // Ensure the API returns an array of objects like [{ id, name }]
            } catch (error) {
                console.error("Error fetching search results:", error);
            }

            setLoading(false);
        } else {
            setResults([]);
        }
    };

    function navigateTo(productId: string) {
        // @ts-ignore
        navigation.navigate('detailProduct', {productId : productId})
        setResults([]);
        onClose();
    }

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View style={{ flex: 1, backgroundColor: "#FFF", alignItems: "center" }}>
                <View style={{ flex: 0.08 }}/>
                <Animated.View style={{ width: "90%", flex : 1, backgroundColor: semantic.background.white.w500, borderRadius: 10, opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: 5 }}>
                        <Input
                            leftIcon={<Icon icon={arrowBack} onPress={() =>{
                                setResults([]);
                                onClose();
                                setQuery("")
                            }} />}
                            rightIcon={<Icon icon={filter} />}
                            value={query}
                            onChangeText={(value) => handleSearch(value)}
                            placeholder={'Search for Product, Drugs and Cosmetics...'}
                        />
                    </View>
                    {loading && <ActivityIndicator size="large" color="red" style={{ marginTop: 10 }} />}

                    {/* Search Results */}
                    {!loading && results.length > 0 && (
                        <FlatList
                            data={results}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item?.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity activeOpacity={activeOpacity} onPress={() => onItemSelected ? onItemSelected(item) : navigateTo(item.id)}>
                                    <View style={{ padding: normalize(15), backgroundColor: "#fff", borderRadius: 5 }}>
                                        <Typography numberOfLines={1} ellipsizeMode={'tail'} style={{ fontWeight:'500', fontSize: normalize(12) }}>{item.name}</Typography>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
}
