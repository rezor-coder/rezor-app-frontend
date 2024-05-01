/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts } from '../../theme';
import Colors from '../../theme/Colors';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import fonts from '../../theme/Fonts';

const BasicInputBox = props => {
  return (
    <View
      style={[{ paddingHorizontal: 0, justifyContent: 'center' }, props.mainContainerStyle,]}>
      <View style={[props.txtViewStyle, { alignSelf: 'flex-start' }]}>
        <Text
          style={[
            {
              color: ThemeManager.colors.textColor, left: 0, marginTop: heightDimen(16),
              fontFamily: fonts.medium,
              fontSize: areaDimen(14),
            },
            props.titleStyle,
          ]}>
          {props.title}
        </Text>
      </View>
      <View style={[styles.input, props.mainStyle]}>
        {props.phoneCode && (
          <TouchableOpacity
            style={{ left: -5 }}
            onPress={props.pressphoneCode}>
            <Text onPress={props.press} style={[{}, props.coinStyle]}>
              {props.phoneCode}
            </Text>
          </TouchableOpacity>
        )}
        <TextInput
          style={[{
            width: props.width, color: props.editable? ThemeManager.colors.textColor:(props.disableColor || ThemeManager.colors.inActiveColor) ,
            fontSize: areaDimen(14),
            fontFamily: fonts.medium,
            // height: '100%'
          }, props.style,]}
          onChangeText={text => props?.onChangeText(text)}
          value={props.text}
          placeholder={props.placeholder}
          placeholderTextColor={Colors.languageItem}
          secureTextEntry={props.secureTextEntry}
          editable={props.editable}
          keyboardType={props.keyboardType}
          ref={props.ref}
          maxLength={props.maxLength}
          numberOfLines={props.numberOfLines}
          multiline={props.multiline}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            marginRight: 10,
            // marginBottom: 15,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={props.pressMax}>
          <Text
            style={{
              color: ThemeManager.colors.headingText,
              fontFamily: Fonts.medium,
              fontSize: areaDimen(14),
            }}>
            {props.coinName}
          </Text>
        </TouchableOpacity>
        {props.max && (
          <View
            style={{
              height: heightDimen(15),
              backgroundColor: ThemeManager.colors.viewBorderColor,
              width: 2,
              position: 'absolute',
              right: widthDimen(45),
              bottom: heightDimen(16),
            }}
          />
        )}
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            marginRight: widthDimen(50),
            height: '100%',
            justifyContent: 'center'
          }}
        >
          <Text
            style={[{
              color: ThemeManager.colors.lightTextColor,
              fontFamily: Fonts.medium,
              fontSize: areaDimen(14)
            },
            props.coinStyle]}>
            {props.max}
          </Text>
        </View>
       {
        props.rightText && <TouchableOpacity
         style={{
           position: 'absolute',
           right: 0,
           bottom: 0,
           marginRight: widthDimen(20),
           height: '100%',
           justifyContent: 'center'
         }}
         onPress={props.onPressRightText}
         disabled={props.disabledRight}
       >
         <Text
           style={[{
             color: props.disabledRight?props.disableColor : ThemeManager.colors.textColor,
             fontFamily: Fonts.medium,
             fontSize: areaDimen(14),
             alignSelf:'flex-end'
           },
           props.coinStyle]}>
           {props.rightText}
         </Text>
       </TouchableOpacity>
       }
        <Image source={props.icon} style={props.iconStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    borderWidth: 1,
    height: heightDimen(50),
    marginTop: heightDimen(10),
    fontFamily: fonts.medium,
    fontSize: areaDimen(14),
    paddingLeft: widthDimen(24),
    borderRadius: heightDimen(25),
    alignItems: 'center',
    // overflow:"hidden"
  },
});

export { BasicInputBox };
