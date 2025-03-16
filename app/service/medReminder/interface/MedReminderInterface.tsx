export interface MedReminderInterface {
    id: number
    drug_name: string
    dosage: number
    total_dosage_in_package: number
    total_dosage_taken: number
    normal_schedules: any
    type: string
    use_interval: boolean
    interval: number
    every: string
    start_date_time: string
    date_create: string
    notes: any,
    med_reminder_schedules : MedReminderSchedules[]
}

export interface MedReminderSchedules {
    id: number
    med_reminder_id: number
    title: string
    drugName:string,
    dosage:string,
    status: string
    snoozed_at: any,
    scheduled_at: any
}
