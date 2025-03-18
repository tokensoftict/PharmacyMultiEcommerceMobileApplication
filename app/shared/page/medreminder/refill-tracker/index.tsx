import React, {useEffect, useRef, useState} from 'react';
import {styles} from "./styles"
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import LinearGradient from "react-native-linear-gradient";
import {palette, semantic} from "@/shared/constants/colors.ts";
import {RefreshControl,Animated, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Icon from "@/shared/component/icon";
import {arrowBack, drug, history} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import {MedReminderInterface} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import {normalize} from "@/shared/helpers";



export default function RefillTracker() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);
    // @ts-ignore
    const [medReminder, setMedReminder] = useState<MedReminderInterface[]>([]);

    function goBack() {
        navigation.goBack();
    }

    const refreshLoadingTrigger = function(){
        setRefreshLoading(true);
        loadMedication();
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

    const RefillButton = ({ onPress } : any) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        useEffect(() => {
            const pulse = Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]);
            Animated.loop(pulse).start();
        }, [scaleAnim]);

        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <LinearGradient
                        colors={['#ff7eb3', '#ff758c']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <Text style={styles.text}>💊 Refill Now & Save!</Text>
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <WrapperNoScrollNoDialogNoSafeArea loading={loading}>
            <LinearGradient colors={[palette.main.p500, palette.main.p100]} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={goBack}>
                        <Icon  icon={arrowBack} tintColor={'white'} />
                    </TouchableOpacity>
                    <Typography style={styles.title}>Refill Tracker</Typography>
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
                                    <TouchableOpacity key={med.id} style={{flex : 1}} onPress={() => () => {}}>
                                        <View style={styles.cardHolder}>
                                            <View style={styles.medCard}>
                                                <View style={[styles.medBadge, { backgroundColor: `${palette.main.p300}15` },]}>
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
                                            <View style={styles.supplyContainer}>
                                                <View style={styles.supplyInfo}>
                                                    <Text style={styles.supplyLabel}>Progress</Text>
                                                    <Text style={styles.supplyValue}>
                                                        {med.total_dosage_taken} mg
                                                    </Text>
                                                </View>
                                                <View style={styles.progressBarContainer}>
                                                    <View style={styles.progressBarBackground}>
                                                        <View
                                                            style={[
                                                                styles.progressBar,
                                                                {
                                                                    width: `${med.percentageTaken}%`,
                                                                    backgroundColor: 'red',
                                                                },
                                                            ]}
                                                        />
                                                    </View>
                                                    <Text style={styles.progressText}>
                                                        {med.percentageTaken}%
                                                    </Text>
                                                </View>
                                            </View>
                                            {
                                                med.allowRefill ?  <RefillButton onPress={() => {}}></RefillButton> : <></>
                                            }
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
