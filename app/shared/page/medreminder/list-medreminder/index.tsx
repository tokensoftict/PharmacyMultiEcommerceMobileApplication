import React, {useCallback, useEffect, useState} from 'react';
import {styles} from "./styles"
import {RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import {palette} from "@/shared/constants/colors.ts";
import LinearGradient from "react-native-linear-gradient";
import Icon from "@/shared/component/icon";
import {arrowBack, drug, history, medica} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import {MedReminderInterface} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import {normalize} from "@/shared/helpers";


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
        <WrapperNoScrollNoDialogNoSafeArea loading={loading}>
            <LinearGradient colors={[palette.main.p500, palette.main.p100]} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={goBack}>
                        <Icon  icon={arrowBack} tintColor={'white'} />
                    </TouchableOpacity>
                    <Typography style={styles.title}>REMINDER LIST</Typography>
                </View>
            </LinearGradient>
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshLoading} onRefresh={refreshLoadingTrigger} />
                    }
                >
                    {
                        medReminder.length === 0 ? (
                            <></>
                        ) : (
                            medReminder.map(function(med){
                                return (
                                    <TouchableOpacity key={med.id} style={{flex : 1}} onPress={function() {
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
                                                    <Text style={styles.medName}>{med.drug_name}</Text>
                                                    <View style={{flex : 1, flexDirection : 'row', justifyContent : 'space-around', marginTop: normalize(5), marginBottom:normalize(5)}}>
                                                        <Text style={styles.reminderInfoPrimary}>{med.total_dosage_in_package}mg in Package</Text>
                                                        <Text style={styles.reminderInfoSuccess}>{med.total_dosage_taken}mg Taken</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.medTime}>
                                                    <Icon icon={history} width={24} height={24} tintColor="#666" />
                                                    <Text style={styles.dateCreated}>{med.date_create}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        )
                    }
                </ScrollView>
            </View>
        </WrapperNoScrollNoDialogNoSafeArea>
    );

}
