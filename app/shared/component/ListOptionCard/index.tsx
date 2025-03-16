import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { _styles } from "./styles";
import useDarkMode from "../../hooks/useDarkMode.tsx";
import Icon from "../icon";
import Radio from "../radio";
import { activeOpacity, currencyType } from "../../constants/global";

export interface OptionCardOptions {
  id: string;
  icon: any;
  title: string;
  description: string;
  active: boolean,
  price?: string,
  code?:string
  extra?:any
}
interface ListOptionCardProps {
  value: OptionCardOptions | undefined;
  options: OptionCardOptions[];
  onChange?: (value: OptionCardOptions) => void
}
export default function ListOptionCard({options, onChange, value}: ListOptionCardProps) {
  const [currentOptions, setCurrentOptions] = useState(options);
  function handleChange(optionSelected: OptionCardOptions) {
    if (onChange) {
      onChange(optionSelected)
    }
    setCurrentOptions(currentOptions.map(option => ({
      ...option,
      active: option.id === optionSelected.id
    })));
  }
  useEffect(() => {
    if (value?.id) {
      setCurrentOptions(currentOptions.map(option => ({
        ...option,
        active: option.id === value.id
      })))
    }
  }, [value?.id])

  return (
    <View>
      {currentOptions.map(option => {
        return (
          <Option callback={handleChange} key={option.id} option={option} />
        )
      })}
    </View>
  )
}

interface OptionProps {
  option: OptionCardOptions;
  callback?: (option: OptionCardOptions) => void
}
export function Option({option, callback}: OptionProps) {
  const {isDarkMode} = useDarkMode()
  const styles = _styles(isDarkMode, option.active)
  return (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={() => callback ? callback(option) : null} style={styles.container}>
      <View style={styles.containerInfo}>
        <View style={styles.containerIcon}>
          <Icon customStyles={styles.icon} icon={option.icon} />
        </View>
        <View style={{flex: 0.9}}>
          <Typography style={styles.title}>{option.title}</Typography>
          <Typography style={styles.address}>{option.description}</Typography>
        </View>
      </View>
      <View style={styles.row}>
        {option?.price && (
          <Typography style={styles.price}>{currencyType}{option?.price || ''}</Typography>
        )}
        <Radio active={option.active} />
      </View>
    </TouchableOpacity>
  )
}
