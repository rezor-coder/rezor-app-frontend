import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Colors, Images } from '../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const Inputtext = props => {
  return (
    <View style={[styles.inputWrapStyle, props.style]}>
      {props.label ? (
        <Text style={[styles.labelTextStyle, props.labelStyle]}>
          {props.label}
        </Text>
      ) : null}
      <TextInput
        style={[styles.inputStyle, props.inputStyle]}
        placeholder={props.placeholder}
        onChangeText={props.onChangeNumber}
        placeholderTextColor={Colors.darkFade || props.placeholderTextColor}
        value={props.value}
        keyboardType={props.keyboardType}
        onBlur={props.onBlur}
        maxLength={props.maxLength}
        editable={props.editable}
        defaultValue={props.defaultValue}
        onSubmitEditing={props.onSubmitEditing}
        returnKeyType={props.returnKeyType}
        enablesReturnKeyAutomatically={true}
      />
      <View style={props.rightStyle}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapStyle: {
    // paddingHorizontal: 16,
    marginBottom: heightDimen(20),
    position: 'relative',
  },
  labelTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    color: Colors.mnemonicTextStyle,
    marginBottom: heightDimen(10),
  },
  inputStyle: {
    height: heightDimen(50),
    borderRadius: heightDimen(30),
    paddingHorizontal: widthDimen(20),
    borderWidth: 1,
    borderColor: ThemeManager.colors.viewBorderColor,
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
  },
});

export { Inputtext };
