/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, StyleSheet, TouchableOpacity, Image, View} from 'react-native';
import {Colors, Fonts, Images} from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Singleton from '../../Singleton';
import {LanguageManager, ThemeManager} from '../../../ThemeManager';
import {BasicButton} from './BasicButton';
import fonts from '../../theme/Fonts';

const CustomSwitch = props => {
  const [stakeSelected, setStakeSelected] = React.useState(true);
  return props.isCustom ?
  (
    <View
      style={{
        backgroundColor: ThemeManager.colors.defiBgColor,
        marginHorizontal: 30,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
      }}>
      {props.value ? (
        <BasicButton
          // onPress={() => {
          //   setStakeSelected(true);
          // }}
          btnStyle={{flex: 1}}
          customGradient={{borderRadius: 10}}
          // colors={Singleton.getInstance().dynamicColor}
          text={props.firstText}
          textStyle={{fontSize: 14, fontFamily: fonts.regular}}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            setStakeSelected(true);
            props.onPress(true);
          }}
          style={{
            backgroundColor: ThemeManager.colors.defiBgColor,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: 50,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.regular,
              color: ThemeManager.colors.stakeColor,
            }}>
            {props.firstText}
          </Text>
        </TouchableOpacity>
      )}

      {props.value ? (
        <TouchableOpacity
          onPress={() => {
            setStakeSelected(false);
            props.onPress(false);
          }}
          style={{
            backgroundColor: ThemeManager.colors.defiBgColor,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: 50,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.regular,
              color: ThemeManager.colors.stakeColor,
            }}>
            {props.secondText}
          </Text>
        </TouchableOpacity>
      ) : (
        <BasicButton
          onPress={() => {
            //   setStakeSelected(false);
          }}
          btnStyle={{flex: 1}}
          customGradient={{borderRadius: 10}}
          // colors={Singleton.getInstance().dynamicColor}
          text={props.secondText}
          textStyle={{fontSize: 14, fontFamily: fonts.regular}}
        />
      )}
    </View>
  )
  :
  (
    <View
      style={{
        backgroundColor: ThemeManager.colors.defiBgColor,
        marginHorizontal: 30,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
      }}>
      {stakeSelected ? (
        <BasicButton
          // onPress={() => {
          //   setStakeSelected(true);
          // }}
          btnStyle={{flex: 1}}
          customGradient={{borderRadius: 10}}
          // colors={Singleton.getInstance().dynamicColor}
          text={props.firstText}
          textStyle={{fontSize: 14, fontFamily: fonts.regular}}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            setStakeSelected(true);
            props.onPress(true);
          }}
          style={{
            backgroundColor: ThemeManager.colors.defiBgColor,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: 50,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.regular,
              color: ThemeManager.colors.stakeColor,
            }}>
            {props.firstText}
          </Text>
        </TouchableOpacity>
      )}

      {stakeSelected ? (
        <TouchableOpacity
          onPress={() => {
            setStakeSelected(false);
            props.onPress(false);
          }}
          style={{
            backgroundColor: ThemeManager.colors.defiBgColor,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: 50,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.regular,
              color: ThemeManager.colors.stakeColor,
            }}>
            {props.secondText}
          </Text>
        </TouchableOpacity>
      ) : (
        <BasicButton
          onPress={() => {
            //   setStakeSelected(false);
          }}
          btnStyle={{flex: 1}}
          customGradient={{borderRadius: 10}}
          // colors={Singleton.getInstance().dynamicColor}
          text={props.secondText}
          textStyle={{fontSize: 14, fontFamily: fonts.regular}}
        />
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  gradientStyle: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.regular,
  },
});

export {CustomSwitch};
