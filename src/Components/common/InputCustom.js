import React from 'react';
import {
  TextInput,
  StyleSheet,
} from 'react-native';
import {Fonts, Colors, Images} from '../../theme';

const InputCustom = props => {
  return (
    <TextInput
      // secureTextEntry={props.secureTextEntry}
      value={props.value}
      placeholder={props.placeHolder}
      onChangeText={props.onChangeText}
      style={[styles.inputStyle, props.customInputStyle]}
      autoCorrect={false}
      // keyboardType={props.keyboardType}
      editable={props.editable}
      maxLength={props.maxLength}
      placeholderTextColor={props.placeholderTextColor}
      autoCapitalize={props.autoCapitalize}
      onBlur={props.onBlur}
      onEndEditing={props.onEndEditing}
    />
  );
};
const styles = StyleSheet.create({
  inputStyle: {
    color: Colors.inputTextColor,
    paddingHorizontal: 22,
    fontSize: 14,
    // borderWidth: 1,
    // borderColor: "red",
    backgroundColor: Colors.White,
    height: 52,
    borderRadius: 26,
    fontFamily: Fonts.medium,
  },
});
export {InputCustom};
