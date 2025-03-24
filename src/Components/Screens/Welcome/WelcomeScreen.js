/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {Header, MainStatusBar} from '../../common/index';
import styles from './WelcomeScreenStyle';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts, Images} from '../../../theme';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import {areaDimen, widthDimen} from '../../../Utils/themeUtils';
import {getCurrentRouteName, navigate} from '../../../navigationsService';

const WelcomeScreen = props => {
  const textColor =
    ThemeManager.colors.themeColor === 'light'
      ? ThemeManager.colors.darkTextColor
      : ThemeManager.colors.textColor;

  const descriptionTextColor =
    ThemeManager.colors.themeColor === 'light'
      ? ThemeManager.colors.descriptionTextColor
      : ThemeManager.colors.textColor;

  const renderGetStarted = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          getCurrentRouteName() != 'SelectLanguage' &&
            navigate(NavigationStrings.SelectLanguage);
        }}
        activeOpacity={1}
        style={[
          styles.languageItemWrapStyle,
          {
            borderColor: textColor,
            backgroundColor: 'transparent',
          },
        ]}>
        <Text
          style={[
            styles.languageItemStyle,
            {
              color: textColor,
            },
          ]}>
          {LanguageManager.getStarted}
        </Text>
        <Image
          source={Images.fullArrow}
          style={{
            width: widthDimen(16),
            height: widthDimen(14),
            tintColor: textColor,
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderView = () => {
    return (
      <View style={{flex: 1}}>
        <MainStatusBar
          backgroundColor={
            ThemeManager.colors.themeColor === 'light'
              ? ThemeManager.colors.wcbackground
              : ThemeManager.colors.linearGradient3
          }
          barStyle={
            ThemeManager.colors.themeColor === 'light'
              ? 'dark-content'
              : 'light-content'
          }
        />
        <View style={styles.container}>
          <Image
            source={
              ThemeManager.colors.themeColor === 'light'
                ? Images.welcomeLightbg
                : Images.welcomebg
            }
            style={styles.bgImageStyle}
          />
          <Image source={Images.security1} style={styles.securityIconStyle} />
          <Image source={Images.welcomeIcon} style={styles.welcomeIconStyle} />
          <Image source={Images.biometric} style={styles.biometricIconStyle} />
          <View style={{flex: 1, alignItems: 'center'}}>
            <Header
              headerStyle={[
                styles.headerStyle,
                {
                  color:
                    ThemeManager.colors.themeColor === 'light'
                      ? ThemeManager.colors.textColor
                      : ThemeManager.colors.titleColor,
                },
              ]}
              title={LanguageManager.useCryptoEasier}
            />
            <Text style={[styles.lablePrefLang, {color: descriptionTextColor}]}>
              {LanguageManager.limitlessWorld}
            </Text>
            {renderGetStarted()}
            <Text
              style={{
                color: descriptionTextColor,
                fontSize: areaDimen(16),
                fontFamily: Fonts.medium,
                alignSelf: 'center',
                position: 'absolute',
                bottom: '7.5%',
              }}>
              by Rezor
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <LinearGradient
      colors={
        ThemeManager.colors.themeColor === 'light'
          ? ['#FAFAFA', '#EEF4FF']
          : ['#171717', '#1A212D']
      }
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={{
        flex: 1,
        position: 'relative', // Keep this if you need positioning for nested elements
      }}>
      <View style={styles.bgViewStyle}>
        <View style={styles.gradientStyle}>{renderView()}</View>
      </View>
    </LinearGradient>
  );
};

export default WelcomeScreen;
