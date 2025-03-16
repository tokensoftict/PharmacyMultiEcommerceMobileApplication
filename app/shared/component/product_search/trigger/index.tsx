import React, { useState } from "react";
import {Text, TouchableOpacity, Animated, Modal } from "react-native";
import { Search } from "lucide-react-native";

// @ts-ignore
export function SearchTrigger({ onOpen }) {
    return (
        <TouchableOpacity onPress={onOpen} style={{ flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 10, borderWidth: 2, borderColor: "red", backgroundColor: "#fff" }}>
            <Search color="red" size={20} />
            <Text style={{ marginLeft: 10, fontSize: 16, color: "#555" }}>Search products...</Text>
        </TouchableOpacity>
    );
}
