import React, {useEffect, useRef, useCallback, useState} from "react";
import LinearGradient from "react-native-linear-gradient";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
    Modal, RefreshControl,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Icon from "@/shared/component/icon";
import {add_circle, list, arrowBack, checkIcon, close, drug, notification, history, medica} from "@/assets/icons";
import {palette, semantic} from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import {normalize} from "@/shared/helpers";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {MedReminderSchedules} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";


const { width } = Dimensions.get("window");

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const QUICK_ACTIONS = [
    {
        icon: <Icon icon={add_circle} width={28} height={28} tintColor={'white'} />,
        label: "Add\nMedication",
        route: "medReminderForm",
        color:  semantic.background.white,
        gradient: ["#4CAF50", "#2E7D32"] as [string, string],
    },
    {
        icon: <Icon icon={list} width={28} height={28} tintColor={'white'} />,
        label: "List \nMedication",
        route: "listMedReminder",
        color: "#1976D2",
        gradient: ["#2196F3", "#1976D2"] as [string, string],
    },
    {
        icon: <Icon icon={history} width={28} height={28} tintColor={'white'} />,
        label: "History\nLog",
        route: "schedulesHistory",
        color: "#C2185B",
        gradient: ["#E91E63", "#C2185B"] as [string, string],
    },
    {
        icon: <Icon icon={medica} width={28} height={28} tintColor={'white'} />,
        label: "Refill\nTracker",
        route: "refillTracker",
        color: "#E64A19",
        gradient: ["#FF5722", "#E64A19"] as [string, string],
    },
];

interface CircularProgressProps {
    progress: number;
    totalDoses: number;
    completedDoses: number;
}

function CircularProgress({
                              progress,
                              totalDoses,
                              completedDoses,
                          }: CircularProgressProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const size = width * 0.55;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, [progress]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressTextContainer}>
                <Text style={styles.progressPercentage}>
                    {Math.round(progress * 100)}%
                </Text>
                <Text style={styles.progressDetails}>
                    {completedDoses} of {totalDoses} doses
                </Text>
            </View>
            <Svg width={size} height={size} style={styles.progressRing}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="white"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
        </View>
    );
}

export default function MainMenu() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState<boolean>(false);
    // @ts-ignore
    const [medicationHistory, setMedicationHistory] = useState<MedReminderSchedules[]>([]);

    const [progress, setProgress] = useState(0);
    const [totalDoses, setTotalDoses] = useState(0);
    const [completedDoses, setCompletedDoses] = useState(0);


    function goBack() {
        navigation.goBack();
    }

    function navigate(path : string)
    {
        // @ts-ignore
        navigation.navigate(path);
    }

    const loadTodayHistory = useCallback(() => {
        setLoading(true);
        (new MedReminderService()).loadTodayHistory("today-history").then((response) => {
            setLoading(false);
            if (response.data.status === true) {
                setMedicationHistory(response.data.data);
            }

            if(response.data.data.length > 0){
                const _totalDoses = response.data.data.length;
                const _completedDoses = response.data.data.filter(function(data : MedReminderSchedules){
                    return data.status === "completed";
                }).length;
                const _progress = (_completedDoses / _totalDoses );
                setCompletedDoses(_completedDoses);
                setTotalDoses(_totalDoses);
                setProgress(_progress);
            }

        });
    }, []);

    // Load history whenever the screen is focused
    useFocusEffect(
        useCallback(() => {
            loadTodayHistory();
        }, [loadTodayHistory])
    );



    return (
        <WrapperNoScrollNoDialogNoSafeArea loading={loading}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading ?? false} onRefresh={loadTodayHistory} />
                }
            >
                <LinearGradient colors={[palette.main.p500, palette.main.p100]} style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={goBack}>
                            <Icon  icon={arrowBack} tintColor={'white'} />
                        </TouchableOpacity>
                        <Typography style={styles.title}>MED REMINDER</Typography>
                    </View>

                    <CircularProgress
                        progress={progress}
                        totalDoses={totalDoses}
                        completedDoses={completedDoses}
                    />


                </LinearGradient>

                <View style={styles.content}>
                    <View style={styles.quickActionsContainer}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.quickActionsGrid}>
                            {QUICK_ACTIONS.map((action) => (
                                <TouchableOpacity key={action.route} onPress={() => navigate(action.route)} style={styles.actionButton}>
                                    <LinearGradient
                                        colors={action.gradient}
                                        style={styles.actionGradient}
                                    >
                                        <View style={styles.actionContent}>
                                            <View style={styles.actionIcon}>
                                                { action.icon }
                                            </View>
                                            <Text style={styles.actionLabel}>{action.label}</Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Today's Schedule</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllButton}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        {medicationHistory.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Icon icon={drug} width={48} height={48} tintColor="#ccc" />
                                <Text style={styles.emptyStateText}>
                                    No medications scheduled for today
                                </Text>
                                <TouchableOpacity style={styles.addMedicationButton}>
                                    <Text style={styles.addMedicationButtonText}>
                                        Add Medication
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            medicationHistory.map((medication) => {
                                const taken = medication.status !== "Pending";
                                return (
                                    <View key={medication.id} style={styles.doseCard}>
                                        <View
                                            style={[
                                                styles.doseBadge,
                                                { backgroundColor: `${palette.main.p300}15` },
                                            ]}
                                        >
                                            <Icon icon={medica} width={24} height={24} tintColor="red" />
                                        </View>
                                        <View style={styles.doseInfo}>
                                            <View>
                                                <Text style={styles.medicineName}>{medication.drugName}</Text>
                                                <Text style={styles.dosageInfo}>{medication.dosage}mg</Text>
                                            </View>
                                            <View style={styles.doseTime}>
                                                <Icon icon={history} width={24} height={24} tintColor="#666" />
                                                <Text style={styles.timeText}>{medication.scheduled_at}</Text>
                                            </View>
                                        </View>
                                        {
                                            taken ? (
                                                <View style={[styles.takenBadge]}>
                                                    <Icon icon={checkIcon} width={20} height={20} tintColor="#4CAF50" />
                                                    <Text style={styles.takenText}>Taken</Text>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.takeDoseButton,
                                                        { backgroundColor: palette.main.p100 },
                                                    ]}
                                                    onPress={() => {}}
                                                >
                                                    <Text style={styles.takeDoseText}>Take</Text>
                                                </TouchableOpacity>
                                            )
                                        }

                                    </View>
                                )
                            })
                        )
                        }
                    </View>
                </View>
            </ScrollView>
        </WrapperNoScrollNoDialogNoSafeArea>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: normalize(15),
        fontWeight: '700',
        color : 'white',
        width : '80%',
        textAlign : 'center',
        justifyContent : "center",

    },
    header: {
        paddingTop: 50,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: normalize(15),
        paddingHorizontal : normalize(15),
        marginTop : normalize(10)
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    greeting: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
        opacity: 0.9,
    },
    content: {
        flex: 1,
        paddingTop: 20,
    },
    quickActionsContainer: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    quickActionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 15,
    },
    actionButton: {
        width: (width - 52) / 2,
        height: 110,
        borderRadius: 16,
        overflow: "hidden",
    },
    actionGradient: {
        flex: 1,
        padding: 15,
    },
    actionContent: {
        flex: 1,
        justifyContent: "space-between",
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
        marginTop: 8,
    },
    section: {
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 5,
    },
    seeAllButton: {
        color: "#2E7D32",
        fontWeight: "600",
    },
    doseCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    doseBadge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    doseInfo: {
        flex: 1,
        justifyContent: "space-between",
    },
    medicineName: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    dosageInfo: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    doseTime: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: {
        marginLeft: 5,
        color: "#666",
        fontSize: 14,
    },
    takeDoseButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginLeft: 10,
    },
    takeDoseText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    progressContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    progressTextContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    },
    progressPercentage: {
        fontSize: 36,
        fontWeight: "bold",
        color: "white",
    },
    progressLabel: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.9)",
        marginTop: 4,
    },
    progressRing: {
        transform: [{ rotate: "-90deg" }],
    },
    flex1: {
        flex: 1,
    },
    notificationButton: {
        position: "relative",
        padding: 8,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 12,
        marginLeft: 8,
    },
    notificationBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "#FF5252",
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#146922",
        paddingHorizontal: 4,
    },
    notificationCount: {
        color: "white",
        fontSize: 11,
        fontWeight: "bold",
    },
    progressDetails: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    closeButton: {
        padding: 5,
    },
    notificationItem: {
        flexDirection: "row",
        padding: 15,
        borderRadius: 12,
        backgroundColor: "#f5f5f5",
        marginBottom: 10,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    notificationTime: {
        fontSize: 12,
        color: "#999",
    },
    emptyState: {
        alignItems: "center",
        padding: 30,
        backgroundColor: "white",
        borderRadius: 16,
        marginTop: 10,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#666",
        marginTop: 10,
        marginBottom: 20,
    },
    addMedicationButton: {
        backgroundColor: "#1a8e2d",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    addMedicationButtonText: {
        color: "white",
        fontWeight: "600",
    },
    takenBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 10,
    },
    takenText: {
        color: "#4CAF50",
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 4,
    },
});
