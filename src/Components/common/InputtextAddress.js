import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Colors, Images } from '../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const InputtextAddress = props => {
  return (
    <View style={[styles.inputWrapStyle, props.style]}>
      {props.label ? (
        <Text style={[styles.labelTextStyle, props.labelStyle]}>
          {props.label}
        </Text>
      ) : null}
      <View style={[styles.inputViewStyle, props.inputViewCustomStyle]}>
        <TextInput
          style={[styles.inputStyle, props.inputStyle]}
          placeholder={props.placeholder}
          onChangeText={props.onChangeNumber}
          placeholderTextColor={
            Colors.languageItem || props.placeholderTextColor
          }
          value={props.value}
          keyboardType={props.keyboardType}
          onBlur={props.onBlur}
          editable={props.editable}
          secureTextEntry={props.secureTextEntry}
          maxLength={props.maxLength}
        />
        <View style={props.rightStyle}>{props.children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapStyle: {
    // marginBottom: heightDimen(16),
    // width:"100%",
    position: 'relative',
  },
  labelTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    marginBottom: heightDimen(14),
  },
  inputStyle: {
    height: heightDimen(50),
    width: '100%',
    borderRadius: heightDimen(25),
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
  },

  inputViewStyle: {
    height: heightDimen(50),
    paddingHorizontal: widthDimen(24),
    color: ThemeManager.colors.textColor,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: heightDimen(25),
  },
});

export { InputtextAddress };
