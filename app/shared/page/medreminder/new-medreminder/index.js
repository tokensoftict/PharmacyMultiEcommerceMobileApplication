import React, {useState} from 'react';
import {FlatList, ScrollView, Switch, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import HeaderWithIcon from "@/shared/component/headerBack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {palette, semantic} from "@/shared/constants/colors";
import {normalize} from "@/shared/helpers";
import Input from "@/shared/component/input";
import {Button} from "@/shared/component/buttons";
import Typography from "@/shared/component/typography";
import {styles} from "./styles"
import ButtonSheet from "@/shared/component/buttonSheet";
import {browse} from "@/assets/icons";
import Icon from "@/shared/component/icon";
import SearchDialog from "@/shared/component/product_search";
import MedReminderService from "@/service/medReminder/MedReminderService";
import {useNavigation} from "@react-navigation/native";
import {scheduleNotification} from "@/shared/utils/ScheduleNotification";
import Toastss from "@/shared/utils/Toast";
import dayjs from "dayjs";

const MedReminderForm = () => {

    const [stock_id, setStockId] = useState("");
    const [drugName, setDrugName] = useState("");
    const [drugNameError, setDrugNameError] = useState("");
    const [loading, setLoading] = useState(false);
    const [medReminder, setMedReminder] = useState({});
    const navigation = useNavigation();

    function goBack() {
        navigation.goBack();
    }
    const [normalSchedule, setNormalSchedule] = useState({
        Morning: { selected: false, time: new Date(new Date().setHours(8, 0, 0, 0)) },
        Afternoon: { selected: false, time: new Date(new Date().setHours(12, 0, 0, 0)) },
        Evening: { selected: false, time: new Date(new Date().setHours(20, 0, 0, 0)) },
        'Mid-Night': { selected: false, time: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const [normalScheduleError, setNormalScheduleError] = useState("");

    const [dosage, setDosage] = useState("")
    const [dosageError, setDosageError] = useState("")

    const [totalDosageInPackage, setTotalDosageInPackage] = useState("")
    const [totalDosageInPackageError, setTotalDosageInPackageError] = useState("")

    const [type, setType] = useState("");
    const [realType, setRealType] = useState("");
    const [typeError, setTypeError] = useState("");

    const [interval, setInterval] = useState("");
    const [intervalError, setIntervalError] = useState("");

    const [every, setEvery] = useState("");
    const [everyError, setEveryError] = useState("");

    const [startDateTime, setStartDateTime] = useState(new Date());
    const [startDateTimeError, setStartDateTimeError] = useState("");

    const [notes, setNotes] = useState("");

    const [useInterval, setUseInterval] = useState(false);

    const setTime = (time, event, selectedTime) => {
        setNormalSchedule((prevState) => ({
            ...prevState,
            [time]: {
                ...prevState[time],
                time: selectedTime,
            },
        }));

    };

    const toggleTimeSelection = (time) => {

        setNormalSchedule((prevState) => ({
            ...prevState,
            [time]: {
                ...prevState[time],
                selected: !prevState[time].selected,
            },
        }));
    };


    const [openMedicationTypeDialog, setOpenMedicationTypeDialog] = useState(false);
    const [openIntervalDialog, setOpenIntervalDialog] = useState(false);

    const medicationTypes = [
        {
            name : "One-Time Use Medication",
            id : "ONE-TIME"
        },
        {
            name : "Long-Term Medication",
            id : "CONTINUES"
        }
    ]

    const intervalList = [
        {
            name : "Hours",
            id : "hours"
        },
        {
            name : "Days",
            id : "days"
        },
        {
            name : "Weeks",
            id : "weeks"
        },
        {
            name : "Months",
            id : "months"
        },
    ]


    function triggerOpenMedicationTypeDialog(status){
        setOpenMedicationTypeDialog(status);
    }

    function triggerIntervalDialog(status){
        setOpenIntervalDialog(status);
    }

    const [isVisible, setIsVisible] = useState(false);

    const openSearchDialog = () => {
        setIsVisible(!isVisible);
    }

    const onItemDrugSelected = (item) => {
        setStockId(item.id);
        setDrugName(item.name);
        openSearchDialog();
    }

    async function createNotification() {
        const date = new Date(Date.now());
        date.setHours(0);
        date.setMinutes(32);


        await scheduleNotification(12, "Hello Yusuf", "20", "mg", date.getTime(), {"hello" : "wworld"})
    }


    function onFormSubmit() {
        let error = false;

        const formData = new FormData();

        formData.append("use_interval", (useInterval ? 1 : 0));

        if(drugName === "") {
            error = true;
            setDrugNameError("Drug Name is required");
        } else {
            if(stock_id !== "") {
                formData.append("stock_id", stock_id);
            }
            formData.append("drug_name", drugName);
            setDrugNameError("");
        }

        if(dosage === "") {
            error = true;
            setDosageError("Dosage is required");
        } else {
            formData.append("dosage", dosage)
            setDosageError("");
        }

        if(totalDosageInPackage === "") {
            error = true;
            setTotalDosageInPackageError("Total Dosage in Package is required");
        } else {
            formData.append("total_dosage_in_package", totalDosageInPackage)
            setTotalDosageInPackageError("");
        }

        if(type === "") {
            error = true;
            setTypeError("Medication Type is required");
        } else {
            formData.append("type", realType)
            setTypeError("");
        }


        if(useInterval === false) {
            let slots = {};
            let  selectedSlots = Object.keys(normalSchedule).map(function(item) {
                if(normalSchedule[item].selected === true) {
                    slots[item] =  normalSchedule[item].time.toLocaleString('en-US', { hour: 'numeric', minute : 'numeric',hour12: true });
                    return {[item] : normalSchedule[item].time.toLocaleString('en-US', { hour: 'numeric', minute : 'numeric',hour12: true })};
                }
                return false;
            }).filter(function(item) {
                return item !== false;
            })

            if(Object.keys(selectedSlots).length === 0) {
                error = true;
                setNormalScheduleError("Please select at least One time slots");
            } else {
                setNormalScheduleError("");
                formData.append("normal_schedules", JSON.stringify(slots));
            }
        } else  {
            if(every === "") {
                error = true;
                setEveryError("This field is required");
            } else {
                formData.append("interval", every)
                setEveryError("");
            }

            if(interval === "") {
                error = true;
                setIntervalError("This is required");
            } else {
                formData.append("every", interval)
                setIntervalError("");
            }
        }

        if(startDateTime === "") {
            setStartDateTimeError("Start DateTime is required");
        } else {
            formData.append("start_date_time", startDateTime.toTimeString())
        }
        //check if error is still false

        formData.append("notes", notes);

        if(error === false) {
            setLoading(true);
            (new MedReminderService()).create(formData).then(async (response) => {
                if (response.data.status === true) {
                    setMedReminder(response.data.data.medReminder);
                    // Extract schedules
                    const schedules = response.data.data.schedules;
                    // Schedule notifications and store their IDs
                    Promise.all(
                        schedules.map(async (schedule) => {
                          const  notificationId =  await scheduleNotification(
                                schedule.id,
                                schedule.drugName,
                                schedule.dosage,
                                "mg",
                                new Date(dayjs(schedule.js_date)).getTime(),
                                {
                                    id: schedule.id,
                                    drugName: schedule.drugName,
                                    med_reminder_id: schedule.med_reminder_id,
                                    dosage: schedule.dosage,
                                    title: schedule.title,
                                    scheduled_at: schedule.scheduled_at,
                                    scheduled_at_full: schedule.scheduled_at_full,
                                }
                            );
                            return { [schedule.id]: notificationId };
                        })
                    ).then((schedules) => {
                        console.log(schedules);
                        setLoading(false);
                        Toastss("Med Reminder has been created successfully.");
                        // Navigate back
                        goBack();
                    }).finally(() => {
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            });
        }

    }

    return (
        <WrapperNoScroll>
            <View style={{
                backgroundColor : semantic.background.white.w101,
                paddingHorizontal: normalize(15),
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <HeaderWithIcon  title={"NEW MED REMINDER"} /></View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20, backgroundColor: semantic.background.white.w300 }}>

                <View style={{ flex: 1, flexDirection: "column", marginBottom: normalize(10) }}>
                    <Input
                        editable={false}
                        label={"Drug Name"}
                        placeholder="e.g., Paracetamol"
                        value={drugName}
                        rightIcon={<Icon icon={browse} onPress={() => {  openSearchDialog() }} tintColor={palette.main.p500} />}
                    />

                    <View style={{ alignItems: "flex-end", marginTop: normalize(5) }}>
                        <TouchableOpacity
                            style={{   borderRadius: 5 }}
                            onPress={() => { openSearchDialog()}}
                        >
                            <Text style={{ color: "red" }}>Browse Drugs</Text>
                        </TouchableOpacity>
                    </View>

                    {drugNameError !== "" && <Text style={{ color: "red" }}>{drugNameError}</Text>}
                </View>

                <View style={{ marginBottom: normalize(24)}}>
                    <Input
                        label={"Dosage per Intake"}
                        placeholder="e.g., 500mg"
                        value={dosage}
                        keyboardType="numeric"
                        onChangeText={(dosage) => setDosage(dosage)}
                    />
                    {dosageError !== "" && <Text style={{ color: "red" }}>{dosageError}</Text>}
                </View>

                <View style={{ marginBottom: normalize(24)}}>
                    <Input
                        label={"Total Dosage in Package"}
                        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
                        placeholder="e.g., 23 tablets, 20mg, 20mls"
                        keyboardType="numeric"
                        value={totalDosageInPackage}
                        onChangeText={(total) => setTotalDosageInPackage(total)}
                    />
                    {totalDosageInPackageError !== "" && <Text style={{ color: "red" }}>{totalDosageInPackageError}</Text>}
                </View>


                <View style={{ marginBottom: normalize(24)}}>
                    <Input
                        label={"Medication Type"}
                        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
                        placeholder="e.g One-time"
                        keyboardType="default"
                        value={type}
                        onChangeText={(type) => setType(type)}
                        editable={false}
                        onPressIn={() => triggerOpenMedicationTypeDialog(true)}
                    />

                    {typeError !== "" && <Text style={{ color: "red" }}>{typeError}</Text>}

                </View>

                <View style={{ fontSize: normalize(16),
                    fontWeight: '500', color:  semantic.text.black, width : '100%', marginBottom: normalize(24), display: "flex", flexDirection : "row", alignItems : "center", justifyContent: "space-between" }}>
                    <Typography style={styles.label}>Use Interval ?</Typography>
                    <Switch
                        label={"Use Interval?"}
                        value={useInterval}
                        onValueChange={(value) => setUseInterval(value)}
                    />
                </View>


                {useInterval ? (
                    <>
                        <View style={{ flex : 1, flexDirection : "row", justifyContent: "space-between" }}>
                            <View style={{flex : 0.4, marginBottom: normalize(24)}}>
                                <Input
                                    label={"Every"}
                                    placeholder="e.g., 6"
                                    keyboardType="numeric"
                                    value={every}
                                    onChangeText={(every) => setEvery(every)}
                                />
                                {everyError!=="" && <Text style={{ color: "red" }}>{everyError}</Text>}
                            </View>
                            <View style={{flex : 0.4, marginBottom: normalize(24)}}>
                                <Input
                                    label={"Interval"}
                                    style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
                                    placeholder="e.g hours"
                                    keyboardType="default"
                                    value={interval}
                                    onChangeText={(interval) => setInterval(interval)}
                                    editable={false}
                                    onPressIn={() => triggerIntervalDialog(true)}
                                />
                                {intervalError!=="" && <Text style={{ color: "red" }}>{intervalError}</Text>}
                            </View>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={{ marginBottom: normalize(24)}}>
                            <Text style={styles.label}>Select Time Slots</Text>
                            {Object.keys(normalSchedule).map((time) => (
                                <View key={time} style={{ display : 'flex', justifyContent : 'space-between', flexDirection :'row', marginBottom: 10 }}>

                                    <TouchableOpacity
                                        key={time}
                                        style={[styles.timeSlot, normalSchedule[time].selected && styles.selectedTimeSlot]}
                                        onPress={() => toggleTimeSelection(time)}
                                    >
                                        <Text style={[{  fontSize: 16, color: '#d32f2f'}, normalSchedule[time].selected && {color:semantic.background.white.w500, fontWeight : 'bold',}]}>{time}</Text>
                                    </TouchableOpacity>

                                    {normalSchedule[time].selected && (
                                        <DateTimePicker
                                            style={{flex: 1, marginBottom:normalize(10)}}
                                            value={normalSchedule[time].time}
                                            mode="time"
                                            display="default"
                                            onChange={(event, selectedTime) => setTime(time, event, selectedTime)}
                                        />
                                    )}
                                </View>
                            ))}
                            {normalScheduleError !== "" && <Text style={{ color: "red" }}>{normalScheduleError}</Text>}
                        </View>
                    </>
                )}


                <View style={{ marginBottom: normalize(24)}}>
                    <Typography style={styles.label}>Start Date And Time</Typography>
                    <DateTimePicker
                        style={{ alignSelf: 'left' }} // This helps on Android
                        value={startDateTime}
                        mode="datetime"
                        display="compact"
                        onChange={(event, selectedTime) => setStartDateTime(selectedTime)}
                    />
                    {startDateTimeError !=="" && <Text style={{ color: "red" }}>{startDateTimeError}</Text>}
                </View>


                <View style={{ marginBottom: normalize(24)}}>
                    <Input
                        label={"Notes"}
                        multiline={true}
                        value={notes}
                        placeholder="e.g., Take after meal in the morning"
                        onChangeText={(notes) => setNotes(notes)}
                    />
                </View>

                <View style={{ marginBottom: normalize(24) }}></View>
                <Button loadingText="Saving..." loading={loading} disabled={loading}  onPress={onFormSubmit} title="Save Reminder" />
                {<View style={{height: normalize(30)}}/>}
            </ScrollView>
            <ButtonSheet onClose={() => triggerOpenMedicationTypeDialog(false)} dispatch={openMedicationTypeDialog} height={normalize(220)}>
                {
                    <View style={{padding: normalize(24)}}>
                        <TouchableOpacity onPress={() => triggerOpenMedicationTypeDialog(false)} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Typography style={{fontWeight: '700', width :'100%', fontSize: normalize(18), marginBottom: normalize(10), textAlign: 'center'}}>{"Select Medication Type"}</Typography>
                        </TouchableOpacity>
                        <FlatList
                            style={{height:normalize(420)}}
                            data={medicationTypes}
                            renderItem={({item, index}) =>
                                <TouchableOpacity onPress={function() {
                                    setType(item.name)
                                    setRealType(item.id)
                                    triggerOpenMedicationTypeDialog(false)
                                }}>
                                    <Typography style={styles.item}>{item.name}</Typography>
                                </TouchableOpacity>
                            }
                        />
                        <View style={{height: normalize(24)}}></View>
                    </View>

                }

            </ButtonSheet>
            <ButtonSheet onClose={() => triggerIntervalDialog(false)} dispatch={openIntervalDialog} height={normalize(300)}>
                {
                    <View style={{padding: normalize(24)}}>
                        <TouchableOpacity onPress={() => triggerIntervalDialog(false)} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Typography style={{fontWeight: '700', width :'100%', fontSize: normalize(18), marginBottom: normalize(10), textAlign: 'center'}}>{"Select Interval"}</Typography>
                        </TouchableOpacity>
                        <FlatList
                            style={{height:normalize(420)}}
                            data={intervalList}
                            renderItem={({item, index}) =>
                                <TouchableOpacity onPress={function() {
                                    setInterval(item.name)
                                    triggerIntervalDialog(false)
                                }}>
                                    <Typography style={styles.item}>{item.name}</Typography>
                                </TouchableOpacity>
                            }
                        />
                        <View style={{height: normalize(24)}}></View>
                    </View>

                }

            </ButtonSheet>
            <SearchDialog visible={isVisible} onClose={openSearchDialog} onItemSelected={onItemDrugSelected}/>
        </WrapperNoScroll>
    );
}

export default MedReminderForm;
