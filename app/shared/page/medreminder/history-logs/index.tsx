import React, {useCallback, useState} from 'react';
import {styles} from "./styles"
import LinearGradient from "react-native-linear-gradient";
import {palette} from "@/shared/constants/colors.ts";
import {Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Icon from "@/shared/component/icon";
import {arrowBack, checkIcon, drug, history, medica} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {Calendar} from "react-native-calendars";
import {MedReminderSchedules} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import {normalize} from "@/shared/helpers";
import formatDate from "@/shared/utils/DateFormatter.ts";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";


export default function HistoryLogs() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
    const [medicationHistory, setMedicationHistory] = useState<MedReminderSchedules[]>([]);
    const [date, setDate] = useState(formatDate(new Date()));
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
                setMedicationHistory([]);
                Toastss("There was an error loading schedules please try again.");
            }
        });
    }, []);

    const loadCustomHistory = function(date:string) {
        setLoading(true);
        (new MedReminderService()).loadHistoryWithFilter(date).then((response) => {
            setLoading(false);
            setRefreshLoading(false);
            if (response.data.status === true) {
                setMedicationHistory(response.data.data);
            } else {
                setMedicationHistory([]);
                Toastss("There was an error loading schedules please try again.");
            }
        })
    }

    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            loadTodayHistory();
        }, [loadTodayHistory])
    );


    function refreshLoadingTrigger()
    {
        setRefreshLoading(true);
        loadTodayHistory();
    }

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

    return (
        <WrapperNoScrollNoDialogNoSafeArea loading={loading}>
            <LinearGradient colors={[palette.main.p500, palette.main.p100]} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={goBack}>
                        <Icon  icon={arrowBack} tintColor={'white'} />
                    </TouchableOpacity>
                    <Typography style={styles.title}>History Logs</Typography>
                </View>
            </LinearGradient>
            <View style={styles.container}>
                <Calendar
                    style={{
                        borderWidth: 1,
                        borderColor: 'gray',
                        height: normalize(350),
                        borderRadius : normalize(10),
                    }}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#dd99ee'
                    }}
                    onDayPress={day => {
                        loadCustomHistory(day.dateString);
                        setDate(formatDate((new Date(day.timestamp))));
                    }}
                    />
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Typography style={styles.sectionTitle}>{date}</Typography>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshLoading} onRefresh={refreshLoadingTrigger} />
                        }
                    >
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
                                                (
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
                                            )
                                        }

                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    )
                    }

                    </ScrollView>
                </View>
            </View>
        </WrapperNoScrollNoDialogNoSafeArea>
    );

}
