import { StyleSheet } from "react-native";
import {normalize} from "@/shared/helpers";
import {semantic} from "@/shared/constants/colors.ts";

export const styles = StyleSheet.create({

    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    timeSlot: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d32f2f',
        marginBottom: 10,
        alignItems: 'center',
        flex: 0.5,
    },
    selectedTimeSlot: {
        backgroundColor: '#d32f2f',
        flex: 1,
    },
    timeSlotText: {
        fontSize: 16,
        color: '#d32f2f',
    },
    item: {
        paddingVertical: normalize(12),
        fontSize: 18,
        borderBottomWidth : normalize(1),
        borderStyle : 'solid',
        borderColor : semantic.text.borderColor
    },
})
