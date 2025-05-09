import React, {useCallback, useState} from 'react';
import {styles} from "./styles"
import LinearGradient from "react-native-linear-gradient";
import {palette} from "@/shared/constants/colors.ts";
import {Alert, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Icon from "@/shared/component/icon";
import {
    arrowBack,
    check,
    checkIcon,
    close,
    history,
    medica,
} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {MedReminderInterface, MedReminderSchedules} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";
import ButtonSheet from "@/shared/component/buttonSheet";
import {normalize} from "@/shared/helpers";
import {Button, ButtonOutline} from "@/shared/component/buttons";
import {scheduleNotification} from "@/shared/utils/ScheduleNotification.tsx";
import dayjs from "dayjs";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Environment from "@/shared/utils/Environment.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";


export default function ViewLogs() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
    const [medication, setMedication] = useState<MedReminderInterface>();
    const [medicationHistory, setMedicationHistory] = useState<MedReminderSchedules[]>([]);
    const [openApproveMedReminderDialog, setApproveMedReminderDialog] = useState(false);
    const {showLoading, hideLoading} = useLoading();
    const [approveLoading, setApproveLoading] = useState(false);
    const [notificationData, setNotificationData] = useState({});
    const route = useRoute();
    function goBack() {
        new AuthSessionService().removeLaunchPage();
        if(navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.replace(new AuthSessionService().getEnvironment());
        }

    }


    function navigate(path : string, params = {})
    {
        // @ts-ignore
        navigation.navigate(path, params);
    }

    const loadTodayHistory = useCallback((medication : MedReminderInterface) => {
        setLoading(true);
        // @ts-ignore
        (new MedReminderService()).loadHistoryForReminder(medication?.id).then((response) => {
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


    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            const notificationData = Environment.getNotificationData();
            // @ts-ignore
            const medReminder = route.params?.medReminder ?? notificationData;
            setMedication(medReminder);
            loadTodayHistory(medReminder);
            if(notificationData) {
                setNotificationData(notificationData);
                triggerApproveMedReminder(true);
            }
        }, [])
    );


    function refreshLoadingTrigger()
    {  // @ts-ignore
        const medReminder = route.params?.medReminder ?? getNotificationData();
        setRefreshLoading(true);
        loadTodayHistory(medReminder);
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
                            // @ts-ignore
                            const medReminder = route.params?.medReminder ?? getNotificationData();
                            loadTodayHistory(medReminder);
                        }
                    })
                }}
        ])
    }

    function triggerApproveMedReminder(status : boolean){
        setApproveMedReminderDialog(status);
    }

    function approveMedReminder(){
        setApproveLoading(true);
        (new MedReminderService()).show(medication?.id ?? "").then((response) => {
            if (response.data.status === true) {
                // Extract schedules
                const schedules = response.data.data.schedules;
                // Schedule notifications and store their IDs
                Promise.all(
                    schedules.map(async (schedule : any) => {
                        const  notificationId =  await scheduleNotification(
                            schedule.id,
                            schedule.drugName,
                            schedule.dosage,
                            "mg",
                            // @ts-ignore
                            new Date(dayjs(schedule.js_date)).getTime(),
                            schedule,
                            new AuthSessionService().getEnvironment(),
                            "VIEW_MED_REMINDER",
                        );
                        return { [schedule.id]: notificationId };
                    })
                ).then((schedules) => {
                    setApproveLoading(false);
                    Toastss("Medication Reminder has been scheduled successfully.");
                    setApproveMedReminderDialog(false);
                    // Navigate back
                }).finally(() => {
                    setApproveLoading(false);
                }).catch(() => {
                    setApproveLoading(false);
                    Toastss("There was an error creating schedules, please try again.");
                    setApproveMedReminderDialog(true);
                });
            } else {
                setApproveLoading(false);
            }
        });
    }

    return (
        <WrapperNoScroll loading={loading}>
            <HeaderWithIcon title={medication?.drug_name}/>
            <View style={styles.container}>
                <View style={styles.section}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshLoading} onRefresh={refreshLoadingTrigger} />
                        }
                    >
                        {
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
                        }
                    </ScrollView>
                </View>
            </View>
            <ButtonSheet onClose={() => triggerApproveMedReminder(false)}  dispatch={openApproveMedReminderDialog} height={normalize(250)}>
                {
                    <View style={{padding: normalize(24)}}>
                        <TouchableOpacity onPress={() => triggerApproveMedReminder(false)} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Typography style={{fontWeight: '700', width :'100%', fontSize: normalize(18), marginBottom: normalize(10), textAlign: 'center'}}>{
                                // @ts-ignore
                                notificationData?.title ?? ""}</Typography>
                        </TouchableOpacity>

                        <Typography style={{fontWeight: '700', width :'100%', fontSize: normalize(15), marginTop: normalize(10), textAlign: 'center'}}>{
                            // @ts-ignore
                            notificationData?.body ?? ""}</Typography>

                        <View style={styles.buttonsHolder}>
                            <View style={{flex :0.45}}>
                                <ButtonOutline onPress={() => triggerApproveMedReminder(false)} leftIcon={<Icon customStyles={{tintColor: 'red'}} icon={close} />} title="Reject" />
                            </View>
                            <View style={{flex :0.5}}>
                                <Button loading={approveLoading} disabled={approveLoading} onPress={() => approveMedReminder()} leftIcon={<Icon customStyles={{tintColor: 'white'}} icon={check} />} title="Approve" />
                            </View>
                        </View>
                        <View style={{height: normalize(24)}}></View>
                    </View>

                }

            </ButtonSheet>
        </WrapperNoScroll>
    );

}
