/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../../theme/Colors';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../theme/Fonts';
import Singleton from '../../Singleton';
import { ThemeManager } from '../../../ThemeManager';
import { Images } from '../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const ButtonPrimary = props => {
  return (
    <TouchableOpacity
      onPress={props.onpress}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: heightDimen(25)
        },
        props.btnstyle,
      ]}
      disabled={props.disabled}
    >
      <LinearGradient
        // start={{x: 0, y: 0}}
        // end={{x: 1, y: 0}}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={
          props.customColor
            ? props.customColor
            : props.colorGradient
              ? [ThemeManager.colors.swapBorder, ThemeManager.colors.swapBorder]
              : Singleton.getInstance().dynamicColor
                ? Singleton.getInstance().dynamicColor
                : [
                  Colors.buttonColor1,
                  Colors.buttonColor2,
                ]
        }

        style={[
          {
            width: '100%',
            height: heightDimen(60),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: heightDimen(30),
            flexDirection: 'row',
          },
          props.btnstyle,
        ]}>
        {props.rightImage && (
          <Image
            source={Images.addIcon}
            style={{
              height: widthDimen(20),
              width: widthDimen(20),
              marginRight: widthDimen(10),
              resizeMode: 'contain',
            }}
          />
        )}

        <Text style={[styles.buttonText, props.textStyle]}>{props.text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
const PercentBtn = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        {
          // alignItems: 'center',
          // justifyContent: 'center',
          // alignSelf: 'center',
          borderRadius: 12,
        },
        props.btnstyle,
      ]}>
      <LinearGradient
        style={{
          borderRadius: 12,
          height: 35,
          justifyContent: 'center',
          borderColor: props?.normal ? Colors.borderColorLang : null,
          borderWidth: 1,
        }}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={
          props?.normal
            ? [
              Colors.buttonColor1,
              Colors.buttonColor2,
              Colors.buttonColor3,
              Colors.buttonColor4,
            ]
            : [
              ThemeManager.colors.backgroundColor,
              ThemeManager.colors.backgroundColor,
            ]
        }>
        <Text
          style={[
            styles.buttonText,
            { color: props?.normal ? Colors.white : Colors.lightGrey2 },
            props.textStyle,
          ]}>
          {props.text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  buttonText: {
    color: Colors.white,
    fontSize: areaDimen(17),
    fontFamily: fonts.semibold,
  },
  buttonText1: {
    alignSelf: 'center',
    color: '#6E737E',
    fontSize: 16,
    fontFamily: fonts.regular,
  },
});

export { ButtonPrimary, PercentBtn };
