/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Fonts, Images } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Singleton from '../../Singleton';
import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const BasicButton = props => {

  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={props.btnStyle}
      onPress={props.onPress}>

      <LinearGradient

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
        style={[styles.gradientStyle, props.customGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        {props.rightImage && (
          <Image
            source={props.icon ? props.icon : Images.addIcon}
            style={[
              {
                height: widthDimen(20),
                width: widthDimen(20),
                marginRight: widthDimen(10),
                resizeMode: 'contain',
              },
              props.iconStyle,
            ]}
          />
        )}

        <Text style={[styles.buttonText, props.textStyle]}>{props.text}</Text>
        {
          props.rightImage1 && (
            <Image
              source={props.icon1 ? props.icon1 : Images.addIcon}
              style={[
                {
                  height: widthDimen(20),
                  width: widthDimen(20),
                  marginRight: widthDimen(10),
                  resizeMode: 'contain',
                },
                props.iconStyle1,
              ]}
            />
          )
        }
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientStyle: {
    width: '100%',
    height: heightDimen(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: heightDimen(30),
    flexDirection: 'row',
  },
  buttonText: {
    color: Colors.white,
    fontSize: areaDimen(17),
    fontFamily: Fonts.semibold,
  },
});

export { BasicButton };
