import {Dimensions, StyleSheet} from "react-native";
import {normalize} from "@/shared/helpers";
import {semantic} from "@/shared/constants/colors.ts";

const { width, height } = Dimensions.get("window");
export const styles = StyleSheet.create(
    {
        header: {
            flex: 0.2,
            paddingTop: normalize(55),
            borderBottomLeftRadius: normalize(15),
            borderBottomRightRadius: normalize(15),
            position: "relative",
        },
        item: {
            paddingVertical: normalize(12),
            fontSize: 18,
            borderBottomWidth : normalize(1),
            borderStyle : 'solid',
            borderColor : semantic.text.borderColor
        },
        headerContent: {
            flexDirection: 'row',
            paddingBottom: normalize(10),
            paddingHorizontal : normalize(15),
            marginTop : normalize(10)
        },
        notes: {
            fontSize: normalize(13),
            fontWeight: "600",
            color: "white",
            marginTop: normalize(10),
        },
        titleMed: {
            fontSize: normalize(15),
            fontWeight: "700",
            color: "white",
            marginTop: normalize(15),
        },
        container: {
            paddingTop: normalize(10),
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            flex : 0.4,
            position: "absolute",
            height: "100%",
            width: "100%",
            alignSelf: "center",
            bottom: 20,
            top: normalize(170),
            shadowColor: "#000",
            borderRadius: normalize(10),
            shadowRadius: normalize(8),
            elevation: normalize(3),
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.05,
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(10),
        },

        title: {
            fontSize: normalize(15),
            fontWeight: '700',
            color : 'white',
            width : '90%',
            textAlign : 'center',
            justifyContent : "center",
        },
        pulseCircle: {
            width: width * 0.7,
            height: width * 0.7,
            borderRadius: width * 0.35,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: normalize(5),
            borderColor: "rgba(255, 255, 255, 0.4)",
            shadowColor: "#fff",
            shadowOpacity: 0.8,
            shadowRadius: normalize(20),
        },
        drugName: {
            fontSize: normalize(32),
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center",
            textShadowColor: "#000",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 5,
            paddingHorizontal: normalize(20), // Prevents overflow
            maxWidth: "90%", // Ensures it doesn’t extend too far
            flexWrap: "wrap", // Allows breaking into multiple lines
        },
        infoBox: {
            marginTop: normalize(20),
            alignItems: "center",
        },
        dosage: {
            fontSize: normalize(20),
            color: "#fff",
            fontWeight: "500",
            marginBottom: normalize(5),
        },
        time: {
            fontSize: normalize(18),
            color: "#fff",
            fontWeight: "700",
        },
        buttonContainer: {
            flexDirection: "row",
            marginTop: normalize(40),
        },
        snoozeButton: {
            backgroundColor: "#f7b733",
            padding: normalize(15),
            borderRadius: normalize(10),
            marginRight: normalize(15),
            elevation: normalize(5),
        },
        takeButton: {
            backgroundColor: "#4CAF50",
            padding: normalize(15),
            borderRadius: normalize(10),
            elevation: normalize(5),
        },
        buttonText: {
            color: "white",
            fontSize: normalize(18),
            fontWeight: "bold",
        },
    }
);
