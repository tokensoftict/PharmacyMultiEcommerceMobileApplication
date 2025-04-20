import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import {styles} from './styles';
import Typography from "@/shared/component/typography";

export const StoreProfile = ({ navigation } : any) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Store Header */}
            <View style={styles.header}>
                <Text style={styles.storeName}>Supreme Mart</Text>
                <Text style={styles.storeTagline}>Wholesale & Retail</Text>
            </View>

            {/* Store Info Card */}
            <View style={styles.card}>
                <ProfileRow label="Business Phone" value="+123 456 7890" />
                <ProfileRow label="Business Certification" value="✅ Verified" />
                <ProfileRow label="Premises License" value="✔️ Approved" />
                <ProfileRow label="Customer Type" value="Wholesale Buyer" />
                <ProfileRow label="Default Order Address" value="123 Market Street, NY" />
            </View>

            {/* Call to Action */}
            <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaText}>🛒 Start Wholesale Shopping</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// Reusable Component for Profile Rows
// @ts-ignore
const ProfileRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

