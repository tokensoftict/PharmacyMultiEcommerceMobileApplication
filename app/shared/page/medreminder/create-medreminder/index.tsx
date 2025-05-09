import React, {useEffect, useRef, useState} from 'react';
import {Animated, FlatList, ScrollView, TouchableOpacity, View,} from 'react-native';
import styles, {width} from './styles';
import HeaderWithIcon from "@/shared/component/headerBack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import Typography from "@/shared/component/typography";
import Input from "@/shared/component/input";
import {normalize} from "@/shared/helpers";
import Icon from "@/shared/component/icon";
import {browse} from "@/assets/icons";
import {palette} from "@/shared/constants/colors.ts";
import SearchDialog from "@/shared/component/product_search";
import _ from "lodash";
import CustomDatePicker from "@/shared/component/CustomDatePicker";
import ordinalSuffix from "@/shared/utils/OrdinalSuffix.tsx";
import ButtonSheet from "@/shared/component/buttonSheet";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import {scheduleNotification} from "@/shared/utils/ScheduleNotification.tsx";
import dayjs from "dayjs";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import {useNavigation} from "@react-navigation/native";

interface StepField {
    key: string;
    label?: string,
    type: 'notes' | 'dosage_form' | 'drug_name' | 'dosage' | 'frequency' | 'schedule' | 'total_dosage_in_package' | 'type' | 'startDateTime';
    placeholder?: string;
    options?: string[];
}

interface Step {
    title: string;
    description: string;
    fields: StepField[];
}

const steps: Step[] = [
    {
        title: 'Drug Info',
        description: 'Select the drug and its dosage form.',
        fields: [
            { key: 'Select Drug', type: 'drug_name', placeholder: 'Select drug name', label: 'Drug Name' },
            {
                key: 'Dosage Form',
                type: 'dosage_form',
                placeholder: 'Dosage Form',
                options: ['Tablet', 'Capsule', 'Syrup', 'Injection'],
            },
        ],
    },
    {
        title: 'Dosages & Frequencies',
        description: 'Enter the dosage and frequency.',
        fields: [
            { key: 'Dosage', type: 'dosage', label : 'Dosage per intake', placeholder: 'e.g., 500mg, 1 capsule, 2 mls' },
            { key: 'Frequency', type: 'frequency',  label : 'Frequency', placeholder: 'How Many Times Per Day...' },
        ],
    },
    {
        title: 'Schedules',
        description: 'Specify the time to take the medication.',
        fields: [{ key: 'Select Time', type: 'schedule', placeholder: 'e.g., 8:00 AM' }],
    },
    {
        title: 'Medication Details',
        description: 'Enter the number of dosages and medication type.',
        fields: [
            { key: 'Number of Dosage Bought', label: 'Number of Dosage Bought ?', type: 'total_dosage_in_package', placeholder: 'e.g., 30mg, 10 capsules' },
            { key: 'Type of Medication', label: 'Type of Medication', type: 'type', placeholder: 'e.g., One Time Medication or Continues Medication' },
            { key: 'Starting Date', label: 'When do you want to Start ?', type: 'startDateTime', placeholder: 'The exact date you want to start taking the this medication.' },
        ],
    },
    {
        title: 'Additional Info',
        description: 'Add any important notes.',
        fields: [
            { key: 'Notes', type: 'notes', placeholder: 'e.g., Take after meal in the morning', label: 'Additional Notes' },
        ],
    },
];

export default function MedReminderWizard() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<Record<string, string | Array<any>>>({});
    const translateX = useRef(new Animated.Value(0)).current;
    const [medReminder, setMedReminder] = useState({});
    const [stock_id, setStockId] = useState("");
    const [drugName, setDrugName] = useState("");
    const [loading, setLoading] = useState(false);
    const [frequency, setFrequency] = useState(0);
    const [schedules, setSchedules] = useState<Date[]>([]);
    const [type, setType] = useState("");
    const [realType, setRealType] = useState("");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

    const navigation = useNavigation();

    function goBack() {
        navigation.goBack();
    }

    useEffect(() => {
        const newSchedules = _.range(frequency).map(() =>
            new Date(new Date().setHours(8, 0, 0, 0))
        );
        setSchedules(newSchedules);
        handleChange('schedule', newSchedules);
        handleChange('startDateTime', new Date())
    }, [frequency]);

    const handleChange = (key: string, value: any) => {
        if(typeof value === 'string') {
            // @ts-ignore
            if(steps[0].fields[1].options.includes(key)) {
                setFormData((prev) => ({...prev, ['dosage_form']: value}));
            } else {
                setFormData((prev) => ({...prev, [key]: value}));
            }
            if(key === "frequency") {
                setFrequency(parseInt(value));
            }
        } else {
            setFormData((prev) => ({...prev, [key]: value}));
        }

    };
    const [openMedicationTypeDialog, setOpenMedicationTypeDialog] = useState(false);
    function triggerOpenMedicationTypeDialog(status :any){
        setOpenMedicationTypeDialog(status);
    }

    const goToStep = (index: number) => {
        Animated.spring(translateX, {
            toValue: -width * index,
            useNativeDriver: true,
        }).start();
        setCurrentStep(index);
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                goToStep(currentStep + 1);
            } else {
                const formDataKeys = Object.keys(formData);
                let formToSubmit  = new FormData();
                formDataKeys.map((item, index) => {
                    if(item === 'schedule') {
                        let formattedSchedule : any = [];
                        // @ts-ignore
                        formData[`schedule`].map((item, index) => {
                            if(typeof item !== 'string') {
                                const number : number = index + 1;
                                const key = ordinalSuffix(number)+ " Does Time";
                                let object : any = {};
                                object[key] = item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                formattedSchedule.push(object)
                            }
                        });
                        formToSubmit.append(item, formattedSchedule)
                    }else if(item === 'startDateTime') {
                        // @ts-ignore
                        formToSubmit.append(item, formData[item].toISOString().slice(0, 10))
                    }
                    else {
                        formToSubmit.append(item, formData[item])
                    }
                });
                console.log('Submitting form:', formToSubmit);
                handleSubmit();
            }
        }
    };

    const handleSubmit = () => {
        setLoading(true);
        (new MedReminderService()).create(formData).then(async (response) => {
            if (response.data.status === true) {
                setMedReminder(response.data.data.medReminder);
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



    const handlePrev = () => {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    };

    const [isVisible, setIsVisible] = useState(false);

    const openSearchDialog = () => {
        setIsVisible(!isVisible);
    }

    const onItemDrugSelected = (item : any) => {
        setStockId(item.id);
        setDrugName(item.name);
        openSearchDialog();
        handleChange('stock_id', item.id);
        handleChange('drug_name', item.name);
    }

    const setTime = (index: number, selectedTime: any) => {
        let cacheSchedules : Date[] = schedules;
        cacheSchedules[index] = selectedTime;
        setSchedules(cacheSchedules);
        handleChange('schedule', cacheSchedules);
    };

    const validateCurrentStep = (): boolean => {
        const currentFields = steps[currentStep].fields;
        const newErrors: Record<string, string> = {};
        currentFields.forEach(({ type, key }) => {
            const value : any = formData[type];

            if(type === 'notes') return true;

            if (
                (typeof value === 'string' && value.trim() === '') ||
                (Array.isArray(value) && value.length === 0) || value === undefined
            ) {
                newErrors[type] = `${key} is required`;
            }

            if(type === "schedule") {
                const selectedSchedules : any[] = value;
                let validatedSchedules : string[] = [];
                selectedSchedules.map((item: any) => {
                    if(validatedSchedules.includes(""+item)) {
                        newErrors[type] = `You have a duplicate does time, please check and correct.`;
                    } else {
                        validatedSchedules.push(item+"");
                    }
                });
            }

        });


        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const renderField = ({ key, type, placeholder, options, label }: StepField) => {
        let content;
        if (type === 'dosage_form') {
            content =
                <View  style={{ flex: 1, flexDirection: "column"}}>
                    <Typography style={styles.label}>{key}</Typography>
                    <View style={styles.tagGroup}>
                        {options?.map((option) => {
                            const selected = formData[type] === option;
                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.tag, selected && styles.tagSelected]}
                                    onPress={() => handleChange(type, option)}
                                >
                                    <Typography
                                        style={[
                                            styles.tagText,
                                            selected && styles.tagTextSelected,
                                        ]}
                                    >
                                        {option}
                                    </Typography>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {formErrors[type] && (
                        <Typography style={{ color: "red" }}>{formErrors[type]}</Typography>
                    )}
                </View>
        }
        else if (type === 'drug_name') {
            content =
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <Input
                        editable={false}
                        label={label}
                        placeholder={placeholder}
                        // @ts-ignore
                        value={formData[type] || ''}
                        rightIcon={<Icon icon={browse} onPress={() => {  openSearchDialog() }} tintColor={palette.main.p500} />}
                    />

                    <View style={{ alignItems: "flex-end", marginTop: normalize(5) }}>
                        <TouchableOpacity
                            style={{   borderRadius: 5 }}
                            onPress={() => { openSearchDialog()}}
                        >
                            <Typography style={{ color: "red" }}>Browse Drugs</Typography>
                        </TouchableOpacity>
                    </View>

                    {formErrors[type] && (
                        <Typography style={{ color: "red" }}>{formErrors[type]}</Typography>
                    )}
                </View>

        }
        else if (type === 'dosage' || type === 'frequency' || type === 'total_dosage_in_package') {
            content =
                <View style={{flex: 1, flexDirection: "column"}}>
                    <Input
                        label={label}
                        placeholder={placeholder}
                        // @ts-ignore
                        value={formData[type] || ''}
                        keyboardType="numeric"
                        onChangeText={(text) => handleChange(type, text)}
                    />
                    {formErrors[type] && (
                        <Typography style={{ color: "red" }}>{formErrors[type]}</Typography>
                    )}
                </View>
        }
        else if (type === 'schedule') {
            content = (
                <View style={{flex: 1, flexDirection: "column"}}>
                    {schedules.map((schedule, index) => (
                        <View style={{flex: 1, flexDirection: "column", marginBottom : normalize(10)}}>
                            <Typography style={styles.label}>{ordinalSuffix(index+1)} Dose Time</Typography>
                            <CustomDatePicker
                                key={index}
                                style={{ width: '100%', marginTop: normalize(-30) }}
                                value={schedules[index]}
                                mode="time"
                                time={schedule}
                                display="default"
                                label=""
                                onChange={(selectedTime : any) =>setTime(index, selectedTime)} // Replace with real logic to update schedule[index]
                            />
                        </View>
                    ))}
                    {formErrors[type] && (
                        <Typography style={{ color: "red" }}>{formErrors[type]}</Typography>
                    )}
                </View>
            );
        } else if (type === "type") {
            content = <View style={{ flex: 1, flexDirection: "column" }}>
                <Input
                    editable={false}
                    label={label}
                    placeholder={placeholder}
                    // @ts-ignore
                    value={realType}
                    rightIcon={<Icon icon={browse} onPress={() => {  triggerOpenMedicationTypeDialog(true) }} tintColor={palette.main.p500} />}
                />

                <View style={{ alignItems: "flex-end", marginTop: normalize(5) }}>
                    <TouchableOpacity
                        style={{   borderRadius: 5 }}
                        onPress={() => {triggerOpenMedicationTypeDialog(true)}}
                    >
                        <Typography style={{ color: "red" }}>Select Medication Type</Typography>
                    </TouchableOpacity>
                </View>

                {formErrors[type] && (
                    <Typography style={{ color: "red" }}>{formErrors[type]}</Typography>
                )}
            </View>
        } else if(type === "notes") {
            content =      <View style={{ marginBottom: normalize(24)}}>
                <Input
                    label={label}
                    multiline={true}
                    // @ts-ignore
                    value={formData[type] || ''}
                    placeholder={placeholder}
                    onChangeText={(notes) => handleChange(type, notes)}
                />
                {formErrors[type] && (
                    <Typography style={{ color: "red" }}>{formErrors[type]}</Typography>
                )}
            </View>
        } else if(type === "startDateTime") {
            content = <View style={{ marginBottom: normalize(24)}}>
                <Typography style={styles.label}>{label}</Typography>
                <CustomDatePicker
                    label={label}
                    style={{ alignSelf: 'left' }}
                    value={formData[type] ||  new Date()}
                    mode="date"
                    time={new Date()}
                    display="compact"
                    onChange={(selectedTime : any) =>  handleChange(type, selectedTime)}
                />
                {formErrors[type] && (
                    <Typography style={{ color: "red" }}>{formErrors[type]}</Typography>
                )}
            </View>
        }

        return (
            <View key={key} style={styles.fieldWrapper}>
                {content}
            </View>
        );
    };

    return (
        <WrapperNoScroll>
            <HeaderWithIcon  title={"CREATE REMINDER"} />
            <View style={styles.container}>
                <View style={{ width, overflow: 'hidden' }}>

                    <Animated.View
                        style={[styles.slider, {width, transform: [{ translateX }] }]}
                    >
                        {steps.map((step, index) => (
                            <View key={index} style={styles.slide}>
                                <Typography style={styles.stepTitle}>{step.title}</Typography>
                                <Typography style={styles.stepDescription}>{step.description}</Typography>
                                <ScrollView style={{width : '100%', height : '100%'}}  showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                                    {step.fields.map(renderField)}
                                </ScrollView>
                            </View>
                        ))}
                    </Animated.View>
                </View>
                <View style={styles.nav}>
                    <TouchableOpacity
                        onPress={handlePrev}
                        disabled={currentStep === 0}
                        style={[
                            styles.button,
                            currentStep === 0 && styles.buttonDisabled,
                        ]}
                    >
                        <Typography
                            style={[
                                styles.buttonText,
                                currentStep === 0 && styles.buttonTextDisabled,
                            ]}
                        >
                            Previous
                        </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext} style={styles.button}>
                        <Typography style={styles.buttonText}>
                            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>
            <SearchDialog visible={isVisible} onClose={openSearchDialog} onItemSelected={onItemDrugSelected}/>
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
                                    setRealType(item.name)
                                    handleChange('type', item.id)
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
        </WrapperNoScroll>
    );
}
