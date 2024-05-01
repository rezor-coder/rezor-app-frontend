import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { heightDimen } from '../../Utils/themeUtils';

const BorderLine = ({ borderColor }) => {
  return <View style={[styles.borderStyle, borderColor,{backgroundColor:ThemeManager.colors.borderLineBorder}]} />;
};

const styles = StyleSheet.create({
  borderStyle: {
    height: ThemeManager.colors.themeColor=='dark'?heightDimen(1): heightDimen(0.5),
    width: '100%',
    backgroundColor: ThemeManager.colors.chooseBorder,
    marginTop: heightDimen(10),
  },
});

export { BorderLine };
