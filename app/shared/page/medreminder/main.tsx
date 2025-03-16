import React, {useEffect, useRef, useCallback, useState} from "react";
import LinearGradient from "react-native-linear-gradient";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    RefreshControl, Dimensions,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Icon from "@/shared/component/icon";
import {add_circle, list, arrowBack, checkIcon, close, drug, notification, history, medica} from "@/assets/icons";
import {palette, semantic} from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import styles from "./main_styles"
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {MedReminderSchedules} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import Toastss from "@/shared/utils/Toast";

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
        route: "historyLogs",
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
            } else {
                Toastss("There was an error loading schedules please try again.");
            }

            if(response.data?.data?.length > 0){
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

