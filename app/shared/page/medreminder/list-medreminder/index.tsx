import React, {useEffect, useState} from 'react';
import {styles} from "./styles"
import {RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {palette} from "@/shared/constants/colors.ts";
import Icon from "@/shared/component/icon";
import {arrowBack, drug, history, medica} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import {MedReminderInterface} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import {normalize} from "@/shared/helpers";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";


export default function ListMedReminder() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);
    // @ts-ignore
    const [medReminder, setMedReminder] = useState<MedReminderInterface[]>([]);

    const refreshLoadingTrigger = function(){
        setRefreshLoading(true);
        loadMedication();
    }

    function goBack() {
        navigation.goBack();
    }

    useEffect(function(){
        loadMedication();
    },[]);


    function loadMedication() {
        setLoading(true);
        (new MedReminderService()).list().then((response) => {
            setLoading(false);
            setRefreshLoading(false);
            if(response.data.status === true) {
                setMedReminder(response.data.data);
            }
        })
    }

    return (
        <WrapperNoScroll loading={loading}>
            <HeaderWithIcon title={"REMINDER LIST"}/>
            <View style={styles.container}>
                {
                    medReminder.length === 0 ?

                        <View style={{ justifyContent : 'center', alignItems : 'center', flex: 1, height : '100%', width :'100%'}}>
                            <Typography style={{fontSize : normalize(18)}}>No Medication Reminder Found !</Typography>
                            <TouchableOpacity onPress={() => navigation.navigate('medReminderForm')} style={styles.addMedicationButton}>
                                <Typography style={styles.addMedicationButtonText}>
                                    Create New Reminder
                                </Typography>
                            </TouchableOpacity>
                        </View>

                        :      <ScrollView
                        style={{height : '100%'}}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshLoading} onRefresh={refreshLoadingTrigger} />}
                    >
                        {
                            medReminder.map(function(med){
                                return (
                                    <TouchableOpacity activeOpacity={0} key={med.id} style={{flex : 1, backgroundColor : 'white'}} onPress={function() {
                                        // @ts-ignore
                                        navigation.navigate("viewLogs", {medReminder : med})
                                    }}>
                                        <View  style={styles.medCard}>
                                            <View
                                                style={[
                                                    styles.medBadge,
                                                    { backgroundColor: `${palette.main.p300}15` },
                                                ]}
                                            >
                                                <Icon icon={drug} width={24} height={24} tintColor="red" />
                                            </View>
                                            <View style={styles.medInfo}>
                                                <View>
                                                    <Typography style={styles.medName}>{med.drug_name}</Typography>
                                                    <View style={{flex : 1, flexDirection : 'row', justifyContent : 'space-around', marginTop: normalize(5), marginBottom:normalize(5)}}>
                                                        <Typography style={styles.reminderInfoPrimary}>{med.total_dosage_in_package}mg in Package</Typography>
                                                        <Typography style={styles.reminderInfoSuccess}>{med.total_dosage_taken}mg Taken</Typography>
                                                    </View>
                                                </View>
                                                <View style={styles.medTime}>
                                                    <Icon icon={history} width={24} height={24} tintColor="#666" />
                                                    <Typography style={styles.dateCreated}>{med.date_create}</Typography>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                }
            </View>
        </WrapperNoScroll>
    );

}
