import notifee, {AndroidImportance, TimestampTrigger, TriggerType} from '@notifee/react-native';

export async function scheduleDrugAlarm(drugName : string, dosage : string , measurement : string, dateTime : string) {
    // Convert dateTime to timestamp
    const timestamp = new Date(dateTime).getTime();

    // Create trigger for future notification
    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: timestamp,
    };

    // Schedule the notification
    return await notifee.createTriggerNotification(
        {
            title: `Time to take ${drugName}`,
            body: `Dosage: ${dosage} ${measurement}`,
            android: {
                channelId: 'drug_alerts',
                importance: AndroidImportance.HIGH,
                // @ts-ignore
                fullScreenIntent: true,
                sound: 'default',
                vibrationPattern: [500, 1000, 500],
            },
        },
        trigger
    );
}


export async function deleteNotification(notificationId : string) {
    await notifee.cancelNotification(notificationId);
}
