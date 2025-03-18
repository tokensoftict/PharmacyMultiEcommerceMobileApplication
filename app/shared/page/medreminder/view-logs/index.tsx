import React, {useCallback, useState} from 'react';
import {styles} from "./styles"
import LinearGradient from "react-native-linear-gradient";
import {palette} from "@/shared/constants/colors.ts";
import {Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Icon from "@/shared/component/icon";
import {arrowBack, checkIcon, drug, history, medica} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {MedReminderInterface, MedReminderSchedules} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import formatDate from "@/shared/utils/DateFormatter.ts";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";


export default function ViewLogs() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
    const [medication, setMedication] = useState<MedReminderInterface>();
    const [medicationHistory, setMedicationHistory] = useState<MedReminderSchedules[]>([]);
    const {showLoading, hideLoading} = useLoading();
    const route = useRoute();
    function goBack() {
        navigation.goBack();
    }


    function navigate(path : string, params = {})
    {
        // @ts-ignore
        navigation.navigate(path, params);
    }

    const loadTodayHistory = useCallback((medication : MedReminderInterface) => {
        console.log(medication);
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
            // @ts-ignore
            const medReminder = route.params?.medReminder;
            setMedication(medReminder);
            loadTodayHistory(medReminder);
        }, [])
    );


    function refreshLoadingTrigger()
    {  // @ts-ignore
        const medReminder = route.params?.medReminder;
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
                            const medReminder = route.params?.medReminder;
                            loadTodayHistory(medReminder);
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
                    <Typography style={styles.title}>{medication?.drug_name}</Typography>
                </View>
            </LinearGradient>
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
                                                        <Icon icon={checkIcon} width={15} height={15}  />
                                                        <Text style={styles.takenText}>Taken</Text>
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
                                                            <Text style={styles.takeDoseText}>Take</Text>
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
        </WrapperNoScrollNoDialogNoSafeArea>
    );

}
