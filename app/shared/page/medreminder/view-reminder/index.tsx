import React, {useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {MedReminderSchedules} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import LinearGradient from "react-native-linear-gradient";
import {styles} from "./styles"
import * as Animatable from "react-native-animatable";
import {TouchableOpacity, View, Text, Alert, FlatList} from "react-native";
import Icon from "@/shared/component/icon";
import {arrowBack} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";
import ButtonSheet from "@/shared/component/buttonSheet";
import {normalize} from "@/shared/helpers";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

export default function ViewReminder() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const [medication, setMedication] = useState<MedReminderSchedules>();
    const [taken, setTaken] = useState(false);
    const pendingGradient = ["#FF5722", "#E64A19"];
    const completedGradient =["#4CAF50", "#2E7D32"];
    const {showLoading, hideLoading} = useLoading();
    const [openIntervalDialog, setOpenIntervalDialog] = useState(false);
    const [interval, setInterval] = useState("");
    const [useNotification, setUseNotification] = useState<boolean>(false);

    function goBack() {
        if(navigation.canGoBack()) {
            navigation.goBack();
        } else {
            setTimeout(() =>{
                navigation.replace(new AuthSessionService().getEnvironment())
            }, 1200);
        }

    }


    useEffectOnce(function(){
        const authService = new AuthSessionService();
        // @ts-ignore
        let med = route.params?.schedule;
        if(!med) {
            const startUpPage = JSON.parse(authService.getLaunchPage());
            med = startUpPage['extraData'];
            med.allowTaken = true;
            setUseNotification(true);
        }
        setTaken(!(med.status !== "Pending" && med.status !== "Cancelled"))
        setMedication(med);
    },[]);

    const intervalList = [
        {
            name : "10 Minutes",
            id : "10 minutes"
        },
        {
            name : "20 Minutes",
            id : "20 minutes"
        },
        {
            name : "30 Minutes",
            id : "30 minutes"
        },
        {
            name : "1 Hour",
            id : "1 hour"
        },
        {
            name : "2 Hours",
            id : "2 hour"
        },
    ]

    const snoozeNotification = function(item: any) {
        Alert.alert('PS GDC', 'Are you sure you want to snooze this schedule for '+item.name+' ?', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {text: 'Yes', onPress: () => {
                    const updateData = {
                        snoozed_at : item.id
                    };
                    showLoading("Updating Med Schedule, please wait...");
                    // @ts-ignore
                    (new MedReminderService()).updateHistoryStatus(medication?.id, updateData).then((response) => {
                        if(response.data.status === true){
                            hideLoading();
                            Toastss("Med Schedule has been updated successfully.");
                            goBack();
                        }
                    })
                }}
        ])
        setInterval(item.name);
        triggerIntervalDialog(false);
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
                            goBack();
                        }
                    })
                }}
        ])
    }
    function triggerIntervalDialog(status : boolean){
        setOpenIntervalDialog(status);
    }
    return (
        <WrapperNoScrollNoDialogNoSafeArea>
            <LinearGradient colors={taken ? pendingGradient  : completedGradient} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={goBack}>
                        <Icon  icon={arrowBack} tintColor={'white'} />
                    </TouchableOpacity>
                    <Typography style={styles.title}></Typography>
                </View>
            </LinearGradient>
            <LinearGradient colors={taken ? pendingGradient  : completedGradient} style={styles.container}>
                {/* Animated Glowing Circle */}
                <Animatable.View animation="pulse" iterationCount="infinite" style={styles.pulseCircle}>
                    <Animatable.Text animation="fadeIn" iterationCount="infinite" style={styles.drugName}>
                        {medication?.drugName}
                    </Animatable.Text>
                </Animatable.View>

                <View style={styles.infoBox}>
                    <Typography style={styles.dosage}>Dosage: {medication?.dosage}</Typography>
                    <Typography style={styles.time}>⏰ Time: {medication?.scheduled_at}</Typography>
                    <Typography style={styles.titleMed}>{medication?.title}</Typography>
                    <Typography style={styles.notes}>{medication?.med_reminder.notes}</Typography>
                </View>

                {
                    (taken && medication?.allowTaken) ?
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.snoozeButton} onPress={() => triggerIntervalDialog(true)}>
                                <Typography style={styles.buttonText}>Snooze</Typography>
                            </TouchableOpacity>

                            <Animatable.View animation="bounce" iterationCount="infinite" duration={2000}>
                                <TouchableOpacity style={styles.takeButton} onPress={() => {makeScheduleHasTaken(medication?.id)}}>
                                    <Typography style={styles.buttonText}>Take Medicine</Typography>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                        : <></>
                }
            </LinearGradient>
            <ButtonSheet onClose={() => triggerIntervalDialog(false)} dispatch={openIntervalDialog} height={normalize(300)}>
                {
                    <View style={{padding: normalize(24)}}>
                        <TouchableOpacity onPress={() => triggerIntervalDialog(false)} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Typography style={{fontWeight: '700', width :'100%', fontSize: normalize(18), marginBottom: normalize(10), textAlign: 'center'}}>{"Snooze Durations"}</Typography>
                        </TouchableOpacity>
                        <FlatList
                            style={{height:normalize(320)}}
                            data={intervalList}
                            renderItem={({item, index}) =>
                                <TouchableOpacity onPress={function() {
                                    snoozeNotification(item);
                                }}>
                                    <Typography style={styles.item}>{item.name}</Typography>
                                </TouchableOpacity>
                            }
                        />
                        <View style={{height: normalize(24)}}></View>
                    </View>

                }

            </ButtonSheet>
        </WrapperNoScrollNoDialogNoSafeArea>
    );
};

