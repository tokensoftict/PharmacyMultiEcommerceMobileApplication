import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    withSpring,
    interpolate,
    runOnJS,
} from "react-native-reanimated";
import { Svg, Path } from "react-native-svg";
import { palette, semantic } from "@/shared/constants/colors.ts";
import {normalize} from "@/shared/helpers";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.6;

// @ts-ignore
const SwipeToComplete = ({ swipedAndCompleteOrder }) => {
    const translateX = useSharedValue(0);

    // ✅ Wrap state update in a separate function for Hermes
    const completeOrder = () => {
        setTimeout(() => {
            swipedAndCompleteOrder(true);
        },300);
        setTimeout(() => {
            resetSwipe();
        }, 1000)
    }

    const resetSwipe = () => {
        translateX.value = withSpring(0);
    };

    const swipeGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = Math.min(event.translationX, SWIPE_THRESHOLD);
        })
        .onEnd(() => {
            if (translateX.value > SWIPE_THRESHOLD * 0.9) {
                translateX.value = withSpring(SWIPE_THRESHOLD);

                // ✅ Use setTimeout outside of runOnJS
                runOnJS(completeOrder)();
            } else {
                translateX.value = withSpring(0);
            }
        });
    return (
        <View style={styles.container}>
            <View style={styles.swipeContainer}>
                <Text style={styles.label}>Swipe to Complete Order 👉</Text>

                <View style={styles.track}>
                    <Animated.View
                        style={[
                            styles.swipeIndicator,
                            {
                                opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [1, 0]),
                            },
                        ]}
                    >
                        <Svg width="30" height="30" viewBox="0 0 24 24">
                            <Path
                                fill="black"
                                d="M14 5L20 12L14 19M4 12H19"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </Animated.View>

                    <GestureDetector gesture={swipeGesture}>
                        <Animated.View
                            style={[
                                styles.swipeButton,
                                {
                                    transform: [{ translateX }],
                                },
                            ]}
                        >
                            <Text style={styles.buttonText}>☰</Text>
                        </Animated.View>
                    </GestureDetector>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: semantic.background.white.w500,
    },
    swipeContainer: {
        width: width * 0.8,
        alignItems: "center",
    },
    label: {
        fontSize: 12,
        marginBottom: 5,
        color: palette.main.p500,
        fontWeight: "bold",
    },
    track: {
        width: "100%",
        height: 60,
        backgroundColor: "#ddd",
        borderRadius: 10,
        justifyContent: "center",
        paddingHorizontal: 10,
        position: "relative",
        overflow: "hidden",
    },
    swipeButton: {
        width: 120,
        height: 60,
        backgroundColor: palette.main.p300,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 10,
        shadowRadius: 6,
    },
    buttonText: {
        fontSize: normalize(24),
        color: "white",
    },
    swipeIndicator: {
        position: "absolute",
        right: 20,
        top: "50%",
        transform: [{ translateY: -15 }],
    },
    successText: {
        fontSize: 20,
        color: "#4CAF50",
        fontWeight: "bold",
    },
});

export default SwipeToComplete;
