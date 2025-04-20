import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import Typography from '../typography';
import Icon from "../icon";
import {Minus, Plus} from '../../../assets/icons';

export enum TypeChange {
  minus = 0,
  plus = 1,
}

interface CounterProps {
  onChange: (value: number, typeOperation: number | string) => void
  cant?: number
}

export default function Counter({onChange, cant = 1}: CounterProps) {
  const [count, setCounter] = useState(cant);
  function handleChange(type: number) {
    if (type === TypeChange.minus) {
      if (count > 1) {
        onChange(count - 1, TypeChange.minus)
        setCounter(prevState => prevState - 1);
      }
      return;
    }
    onChange(count + 1, TypeChange.plus)
    setCounter(prevState => prevState + 1);
  }

  function onChangeText(number : string) {
      if(number == "") {
          number = "1";
      }

      setCounter(parseInt(number));
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleChange(TypeChange.minus)}
        style={styles.btnReduce}>
        <Icon customStyles={styles.minus} icon={Minus} />
      </TouchableOpacity>
      <TextInput
          keyboardType="numeric"
          onChangeText={value => onChangeText(value)}
          value={count+""}
          style={styles.input}
      />
      <TouchableOpacity
        onPress={() => handleChange(TypeChange.plus)}
        style={styles.btnAument}>
        <Icon customStyles={styles.plus} icon={Plus} />
      </TouchableOpacity>
    </View>
  );
}
