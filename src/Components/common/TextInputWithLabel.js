import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import { Colors, Fonts } from '../../theme';

const TextInputWithLabel = ({
  value,
  label,
  placeHolder,
  onChangeText = vlaue => {},
  keyboardType,
  leftIcon,
  onPressLeftIcon = () => {},
  labelStyle,
  leftIconStyle,
  rightIconStyle,
  rightIcon,
  onPressRightIcon = () => {},
  maxLength,
  placeholderTextColor,
  secureTextEntry,
  tintColor = ThemeManager.colors.primary,
  editable=true,
  mainContainerStyle,
  onPress= () => {},
  customLeftIcon=()=>{},
  customInputStyle,
  onEndEditing
}) => {
  return (
    <View style={{...mainContainerStyle}}>
      <Text
        style={[
          styles.labelStyle,
          {color: ThemeManager.colors.textColor},
          labelStyle,
        ]}>
        {label}
      </Text>
      <TouchableOpacity
        style={[styles.inputStyle,customInputStyle]}
        activeOpacity={1}
        hitSlop={{bottom:15,left:15,top:15,right:15}}
        onPress={onPress}>
        {!!leftIcon ? (
          <View style={styles.iconViewStyle}>
            <TouchableOpacity onPress={onPressLeftIcon}>
              <FastImage
                source={leftIcon}
                style={[styles.iconStyle, leftIconStyle]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : !!customLeftIcon() ? (
          customLeftIcon()
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          style={[
            styles.inputTextStyle,
            {color: ThemeManager.colors.textColor},
          ]}
          placeholder={placeHolder}
          placeholderTextColor={
            !!placeholderTextColor
              ? placeholderTextColor
              : ThemeManager.colors.lightTextColor
          }
          maxLength={maxLength}
          keyboardAppearance={ThemeManager.colors.themeColor == 'dark'?'dark':'light'}
          secureTextEntry={secureTextEntry}
          onEndEditing={onEndEditing}
        />
        {rightIcon ? (
          <View style={styles.iconViewStyle}>
            <TouchableOpacity onPress={onPressRightIcon}>
              <FastImage
                source={rightIcon}
                style={[styles.iconStyle, rightIconStyle]}
                resizeMode="contain"
                tintColor={tintColor}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default TextInputWithLabel;

const styles = StyleSheet.create({
  labelStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
   
    marginBottom: areaDimen(10),
    lineHeight: heightDimen(18),
  },
  inputStyle: {
    height: heightDimen(50),
    borderRadius: heightDimen(30),
    paddingHorizontal: widthDimen(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderColor,
 
    flexDirection: 'row',
    alignItems:'center'
  },
  inputTextStyle: {
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.medium,

    fontSize: areaDimen(14),
    flexGrow: 0.96,
  },

  iconViewStyle: {
    flexGrow: 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    height: areaDimen(16),
    width: areaDimen(16),
  },
});
