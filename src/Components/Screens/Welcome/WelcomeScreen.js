/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import {
  Header,
  MainStatusBar
} from '../../common/index';
import styles from './WelcomeScreenStyle';

import { Fonts, Images } from '../../../theme';
// import {ScrollView} from 'react-native-gesture-handler';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { areaDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WelcomeScreen = props => {


  const renderGetStarted = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          getCurrentRouteName() != 'SelectLanguage' && navigate(NavigationStrings.SelectLanguage);
        }}
        activeOpacity={1}
        style={[
          styles.languageItemWrapStyle,
          {
            borderColor: ThemeManager.colors.textColor,
            backgroundColor: 'transparent',
          },
        ]}>
        <Text
          style={[
            styles.languageItemStyle,
            {
              color: ThemeManager.colors.textColor,
            },
          ]}>
          {LanguageManager.getStarted}
        </Text>
        <Image
          source={Images.fullArrow}
          style={{
            width: widthDimen(16),
            height: widthDimen(14),
            tintColor: ThemeManager.colors.textColor,
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderView = () => {
    return (
      <View style={{flex: 1}}>
        <MainStatusBar
          backgroundColor={ThemeManager.colors.linearGradient1}
          barStyle={
            ThemeManager.colors.themeColor === 'light'
              ? 'dark-content'
              : 'light-content'
          }
        />
        <View style={styles.container}>
          <Image source={Images.welcomebg} style={styles.bgImageStyle} />
          <Image source={Images.welcomeIcon} style={styles.welcomeIconStyle} />
          <View style={{flex: 1, alignItems: 'center',}}>
            <Header
              headerStyle={[
                styles.headerStyle,
                {color: ThemeManager.colors.titleColor},
              ]}
              title={LanguageManager.useCryptoEasier}
            />
            <Text
              style={[
                styles.lablePrefLang,
                {color: ThemeManager.colors.textColor},
              ]}>
              {LanguageManager.limitlessWorld}
            </Text>

            {/* <View style={{top:'-5%'}}> */}
            {renderGetStarted()}
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontSize: areaDimen(16),
                fontFamily: Fonts.medium,
                alignSelf: 'center',
                position: 'absolute',
                bottom: '7.5%',
              }}>
              by SaitaChain
            </Text>
          </View>
          {/* </View> */}
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: ThemeManager.colors.linearGradient1,
        position: 'relative',
        flex:1
      }}>
      <View style={styles.bgViewStyle}>
        <ImageBackground
          source={ThemeManager.ImageIcons.splashBg}
          style={styles.gradientStyle}>
          {renderView()}
        </ImageBackground>
      </View>
    </View>
  );
};

export default WelcomeScreen;
