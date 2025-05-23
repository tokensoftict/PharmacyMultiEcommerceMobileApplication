import React from 'react';
import { View, Image, ScrollView, TouchableOpacity } from "react-native";
import Typography from '../typography';
import {_styles} from './styles';
import { CategoryDTO } from "../../DTO";
import useDarkMode from "../../hooks/useDarkMode.tsx";

interface CategoriesProps {
  categories: CategoryDTO[]
}
export default function Categories({categories}: CategoriesProps) {
  const {isDarkMode} = useDarkMode()
  const styles = _styles(isDarkMode)
  return (
    <View style={styles.listCategories}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => {
            return (
              <TouchableOpacity key={index} style={styles.parentContainer}>
                <View style={[styles.container, category.active && styles.containerActive ]}>
                  <Typography style={[styles.categoryName, category.active && styles.categoryNameActive]}>{category.name}</Typography>
                </View>
              </TouchableOpacity>
            )
          })}
      </ScrollView>
    </View>
  );
}
