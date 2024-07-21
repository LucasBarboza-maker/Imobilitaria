import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomCheckbox = ({ checked, onPress, borderColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.checkbox, { borderColor }]}>
      {checked && <Icon name="check" size={20} color={borderColor} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default CustomCheckbox;