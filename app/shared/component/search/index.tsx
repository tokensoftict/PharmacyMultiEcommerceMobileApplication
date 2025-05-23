import React, {useState} from "react";
import {styles} from "./style"
import Icon from "@/shared/component/icon";
import {filter, search} from "@/assets/icons";
import Input from "@/shared/component/input";
import {TouchableOpacity, View} from "react-native";
import SearchDialog from "@/shared/component/product_search";


interface SearchProps {
    onChange: (value: boolean) => void
    value: string |undefined,
    placeholder : string|undefined
}

export default function Search({onChange, value, placeholder}:SearchProps) {
    const [isVisible, setIsVisible] = useState(false);

    const openSearchDialog = () => {
        setIsVisible(!isVisible);
    }

    return (
        <View style={styles.container}>
                <TouchableOpacity onPress={openSearchDialog}>
                    <Input
                        leftIcon={<Icon icon={search} onPress={openSearchDialog} />}
                        rightIcon={<Icon icon={filter} onPress={openSearchDialog} />}
                        editable={false}
                        onPressIn={openSearchDialog}
                        placeholder={placeholder}
                    />
                </TouchableOpacity>
            <SearchDialog visible={isVisible} onClose={openSearchDialog}/>
        </View>
    );
}
