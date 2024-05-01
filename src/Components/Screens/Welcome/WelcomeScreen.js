/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {
  MainStatusBar,
  BasicButton,
  Header,
  Wrap,
  CheckBox,
  SecurityLink,
  ImageBackgroundComponent,
} from '../../common/index';
import styles from './WelcomeScreenStyle';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import LottieView from 'lottie-react-native';

import {Fonts, Images, Colors} from '../../../theme';
// import {ScrollView} from 'react-native-gesture-handler';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WelcomeScreen = props => {


  const renderGetStarted = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.currentScene != 'SelectLanguage' && Actions.SelectLanguage();
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
