import React from "react";
import {styles} from "./style"
import Icon from "../../../shared/component/icon";
import {filter, search} from "../../../assets/icons";
import Input from "../../../shared/component/input";
import {ImageBackground, View} from "react-native";
import {search_background} from "../../../assets/images";


interface SearchProps {
    onChange: (value: boolean) => void
    value: string |undefined,
    placeholder : string|undefined
}

export default function Search({onChange, value, placeholder}:SearchProps) {

    return (
        <View style={styles.container}>
            <ImageBackground style={styles.image} source={search_background} resizeMode="stretch">
                <View style={styles.containerSearch}>
                    <Input
                        leftIcon={<Icon icon={search} />}
                        rightIcon={<Icon icon={filter} />}
                        placeholder={placeholder}
                    />
                </View>
            </ImageBackground>
        </View>
    );
}
