import React, { useRef, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { styles } from "./style";
import LottieView from "lottie-react-native";

// Import animations
import animationWelcome from '@/assets/welcome.json';
import animationStores from '@/assets/stores.json';
import animationSearch from '@/assets/search.json';
import animationReminder from '@/assets/reminder.json';
import animationOrders from '@/assets/orders.json';
import bestPrice from '@/assets/bestprice.json';
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

const { width, height } = Dimensions.get('window');

// Slides definition
const slides = [
    {
        title: "Welcome to \n PS GDC PHARMACY & SUPERMARKET",
        desc: "Your one-stop shop for Wholesales Pharmacy, Supermarket, Groceries & More - all in one app",
        animation: animationWelcome,
    },
    {
        title: "Switch Between Stores",
        desc: "Access multiple stores for Bulk and Small Quantities - from a single account.",
        animation: animationStores,
    },
    {
        title: "Smart Search & Cart",
        desc: "Find products instantly with smart AI search, add to cart, and check out fast",
        animation: animationSearch,
    },
    {
        title: "Daily Dosage Reminder",
        desc: "Never miss your dose of medicine again. Custom Alarm system to remind you of daily dosage with templates",
        animation: animationReminder,
    },
    {
        title: "Track Orders & Stock",
        desc: "See your order history, track statuses, and stay updated with live inventory sync.",
        animation: animationOrders,
    },
    {
        title: "Best Price Nationwide",
        desc: "Live Available Stock 24/7  sync & be aware of Lowest Current Market Price",
        animation: bestPrice,
    },
];

// @ts-ignore
export default IntroSlider = ({ navigation }) => {
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex === slides.length - 1) {
            new AuthSessionService().setIntroPageStatus("YES");
            navigation.replace('supermarket');
        } else {
            // @ts-ignore
            carouselRef.current?.scrollTo({ index: currentIndex + 1, animated: true });
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            // @ts-ignore
            carouselRef.current?.scrollTo({ index: currentIndex - 1, animated: true });
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSkip = () => {
        navigation.replace('supermarket');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <Carousel
                ref={carouselRef}
                loop={false}
                width={width}
                height={height * 0.85}
                autoPlay={false}
                scrollAnimationDuration={800}
                data={slides}
                onSnapToItem={index => setCurrentIndex(index)}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <LottieView
                            source={item.animation}
                            autoPlay
                            loop
                            style={styles.lottie}
                        />
                        <Animated.Text
                            entering={FadeInUp.delay(200).duration(500)}
                            style={styles.title}
                        >
                            {item.title}
                        </Animated.Text>
                        <Animated.Text
                            entering={FadeInUp.delay(300).duration(500)}
                            style={styles.description}
                        >
                            {item.desc}
                        </Animated.Text>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <View style={styles.navButtons}>
                    <TouchableOpacity
                        onPress={handlePrev}
                        disabled={currentIndex === 0}
                        style={[
                            styles.navButton,
                            currentIndex === 0 && { opacity: 0.5 }
                        ]}
                    >
                        <Text style={styles.navText}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNext} style={styles.navButton}>
                        <Text style={styles.navText}>
                            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
