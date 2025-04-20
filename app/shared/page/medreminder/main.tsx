import React, {useEffect, useRef, useCallback, useState} from "react";
import LinearGradient from "react-native-linear-gradient";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    RefreshControl, Dimensions, Alert,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Icon from "@/shared/component/icon";
import {add_circle, list, arrowBack, checkIcon, close, drug, notification, history, medica} from "@/assets/icons";
import {palette, semantic} from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import styles from "./main_styles"
import {CommonActions, useFocusEffect, useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {MedReminderSchedules} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import Toastss from "@/shared/utils/Toast";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce";

const { width } = Dimensions.get("window");


// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const QUICK_ACTIONS = [
    {
        icon: <Icon icon={add_circle} width={28} height={28} tintColor={'white'} />,
        label: "Add\nReminder",
        route: "medReminderForm",
        color:  semantic.background.white,
        gradient: ["#4CAF50", "#2E7D32"] as [string, string],
    },
    {
        icon: <Icon icon={list} width={28} height={28} tintColor={'white'} />,
        label: "List \nReminder",
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
                <Typography style={styles.progressPercentage}>
                    {Math.round(progress * 100)}%
                </Typography>
                <Typography style={styles.progressDetails}>
                    {completedDoses} of {totalDoses} doses
                </Typography>
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
    const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
    // @ts-ignore
    const [medicationHistory, setMedicationHistory] = useState<MedReminderSchedules[]>([]);

    const [progress, setProgress] = useState(0);
    const [totalDoses, setTotalDoses] = useState(0);
    const [completedDoses, setCompletedDoses] = useState(0);
    const {showLoading, hideLoading} = useLoading();

    function goBack() {
        navigation.goBack();
    }

    function navigate(path : string, params = {})
    {
        // @ts-ignore
        navigation.navigate(path, params);
    }

    const loadTodayHistory = useCallback(() => {
        setLoading(true);
        (new MedReminderService()).loadTodayHistory("today-history").then((response) => {
            setLoading(false);
            setRefreshLoading(false);
            if (response.data.status === true) {
                setMedicationHistory(response.data.data);
            } else {
                Toastss("There was an error loading schedules please try again.");
            }

            if(response.data?.data?.length > 0){
                const _totalDoses = response.data.data.length;
                const _completedDoses = response.data.data.filter(function(data : MedReminderSchedules){
                    return  ( data.status  !== "Pending" &&  data.status  !== "Cancelled")
                }).length;
                const _progress = (_completedDoses / _totalDoses );
                setCompletedDoses(_completedDoses);
                setTotalDoses(_totalDoses);
                setProgress(_progress);
            }

        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            loadTodayHistory();
        }, [loadTodayHistory])
    );


    const makeScheduleHasTaken = function (schedule_id : number | string)
    {
        Alert.alert('PS GDC', 'Are you sure you mark this med schedule has taken ?', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {text: 'Yes', onPress: () => {
                    const updateData = {
                        status : 'Completed',
                    };
                    showLoading("Updating Med Schedule, please wait...");
                    (new MedReminderService()).updateHistoryStatus(schedule_id, updateData).then((response) => {
                        if(response.data.status === true){
                            hideLoading();
                            Toastss("Med Schedule has been updated successfully.");
                            loadTodayHistory();
                        }
                    })
                }}
        ])
    }

    function refreshLoadingTrigger()
    {
        setRefreshLoading(true);
        loadTodayHistory();
    }

    return (
        <WrapperNoScrollNoDialogNoSafeArea loading={loading} >
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshLoading} onRefresh={refreshLoadingTrigger} />
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
                        <Typography style={styles.sectionTitle}>Quick Actions</Typography>
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
                                            <Typography style={styles.actionLabel}>{action.label}</Typography>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Typography style={styles.sectionTitle}>Today's Schedule</Typography>
                            <TouchableOpacity onPress={() => navigate('historyLogs')}>
                                <Typography style={styles.seeAllButton}>See All</Typography>
                            </TouchableOpacity>
                        </View>
                        {medicationHistory.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Icon icon={drug} width={48} height={48} tintColor="#ccc" />
                                <Typography style={styles.emptyStateText}>
                                    No medications scheduled for today
                                </Typography>
                                <TouchableOpacity onPress={() => navigate('medReminderForm')} style={styles.addMedicationButton}>
                                    <Typography style={styles.addMedicationButtonText}>
                                        Add Medication
                                    </Typography>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            medicationHistory.map((medication) => {
                                const taken = (medication.status !== "Pending" && medication.status !== "Cancelled");
                                return (
                                    <TouchableOpacity key={medication.id} style={{flex : 1}}
                                                      onPress={() => navigate('viewReminder', {schedule : medication})}>
                                        <View  style={styles.doseCard}>
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
                                                    <Typography style={styles.medicineName}>{medication.drugName}</Typography>
                                                    <Typography style={styles.dosageInfo}>{medication.dosage}mg</Typography>
                                                </View>
                                                <View style={styles.doseTime}>
                                                    <Icon icon={history} width={24} height={24} tintColor="#666" />
                                                    <Typography style={styles.timeText}>{medication.scheduled_at}</Typography>
                                                </View>
                                            </View>
                                            {
                                                taken ? (
                                                    <View style={[styles.takenBadge]}>
                                                        <Icon icon={checkIcon} width={15} height={15}  />
                                                        <Typography style={styles.takenText}>Taken</Typography>
                                                    </View>
                                                ) : (
                                                   medication.allowTaken ?  <TouchableOpacity
                                                       style={[
                                                           styles.takeDoseButton,
                                                           { backgroundColor: palette.main.p100 },
                                                       ]}
                                                       onPress={() => makeScheduleHasTaken(medication.id)}
                                                   >
                                                       <Typography style={styles.takeDoseText}>Take</Typography>
                                                   </TouchableOpacity> : <></>
                                                )
                                            }

                                        </View>
                                    </TouchableOpacity>
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

