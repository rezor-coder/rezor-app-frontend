/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, Dimensions, Platform } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import fonts from '../../theme/Fonts';

const PinInput = ({
  key,
  isActive,
  digit
}) => {

  console.log("digit==", digit)
  return (
    <View
      style={[
        styles.activeText,
        isActive
          ? { borderColor: ThemeManager.colors.primary }
          : { borderColor:ThemeManager.colors.borderColorNew },
        { alignItems: 'center', justifyContent: 'center', }
      ]}
    >
      <Text
        style={{
          fontSize: areaDimen(23),
          color: ThemeManager.colors.textColor,
          textAlign: 'center', // To center the text horizontally
          // backgroundColor: 'red',
          top:heightDimen(4)
          // height:   heightDimen(Platform.OS === 'ios' ? 17 : 22)
        }}
      >
        {digit}
      </Text>
    </View>
  );

};

const styles = StyleSheet.create({

  activeText: {
    borderWidth: 2,
    height: areaDimen(52),
    width: areaDimen(52),
    borderRadius: widthDimen(50),
    alignItems: "center",
    justifyContent: "center",
    margin: widthDimen(5),
  },

});

export { PinInput };
