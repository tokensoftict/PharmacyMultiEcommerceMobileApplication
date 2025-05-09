import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    ScrollView,
} from 'react-native';
import Typography from "@/shared/component/typography";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import SentenceCase from "@/shared/utils/SentenceCase.tsx";
import {normalize} from "@/shared/helpers";

const appImages: Record<string, any> = {
    "wholesales": require("@/assets/images/wholesales.jpg"),
    "supermarket": require("@/assets/images/supermarket.jpg"),
    "sales representative" : require("@/assets/images/sales_rep.jpg"),
};


// @ts-ignore
const StoreSelectionScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const userProfile =  (new AuthSessionService().getAuthSession()).data;
    const userApps = userProfile.apps.map(function(app : any){
        return {
            id: app.name,
            name: app.name,
            image: app.name,
            description: app.description,
            status: app.info.status,
            last_seen : 'Last Seen: '+app.last_seen,
        };

    });

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const fadeInStyle = {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
    };

    function selectStore(store: string, status : boolean) {
        new AuthSessionService().setEnvironment(store)
        if(store === "wholesales" && !status ) {
            navigation.navigate("storePendingApproval");
        } else {
            navigation.replace(store)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.centeredContent}>
                <Animated.View style={[styles.logoWrapper, fadeInStyle]}>
                    <Image
                        source={require("@/assets/images/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                <View style={styles.welcomeSection}>
                    <Typography style={styles.welcome}>Welcome Back {userProfile?.name} 👋</Typography>
                    <Typography style={styles.subtitle}>Choose a store to get started</Typography>
                </View>

                {userApps.map((store : any, index : any) => (
                    <Animated.View key={index} style={[styles.cardWrapper, fadeInStyle]}>
                        <TouchableOpacity onPress={() => selectStore((store.name == "sales representative" ? 'sales_representative' : store.name), store.status)} activeOpacity={0.85}>
                            <View style={styles.card}>
                                <Image resizeMode="cover" source={appImages[store.name]} style={styles.cardImage} />
                                <View style={styles.cardContent}>
                                    <Typography numberOfLines={1} style={styles.storeName}>{store.name == "supermarket" ? "SUPERMARKET & PHARMACY" : ( store.name === "wholesales" ? "WHOLESALES & BULK-SALES" :  store.name)}</Typography>
                                    <Typography numberOfLines={2} style={styles.storeDesc}>{store.description}</Typography>
                                    <Typography style={styles.lastLogin}>{store.last_seen}</Typography>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    centeredContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(30),
        paddingHorizontal: normalize(20),
    },
    logoWrapper: {
        marginBottom: normalize(20),
        alignItems: 'center',
    },
    logo: {
        width: normalize(150),
        height: normalize(150),
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: normalize(30),
    },
    welcome: {
        fontSize: normalize(20),
        fontWeight: 'bold',
        color: '#B30000',
    },
    subtitle: {
        fontSize: normalize(16),
        color: '#555',
        marginTop: normalize(6),
    },
    cardWrapper: {
        width: '100%',
        marginBottom: normalize(20),
    },
    card: {
        backgroundColor: '#fefefe',
        borderRadius: normalize(16),
        elevation: normalize(1),
        overflow: 'hidden',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: normalize(10),
    },
    cardImage: {
        width: normalize(100),
        height: '100%',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    cardContent: {
        flex: 1,
        padding: normalize(12),
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    storeName: {
        fontSize: normalize(18),
        fontWeight: '600',
        color: '#B30000',
    },
    storeDesc: {
        fontSize: normalize(14),
        color: '#333',
        marginTop: 4,
    },
    lastLogin: {
        fontSize: normalize(12),
        color: '#888',
        marginTop: 6,
    },
});


export default StoreSelectionScreen;
