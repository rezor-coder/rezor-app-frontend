/* eslint-disable jsx-quotes */
import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { Image, ImageBackground, View } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import images from '../../../theme/Images';
import { MainStatusBar, Wrap } from '../../common';
import { styles } from './SplashAppNameStyle';
const SplashAppName = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      getCurrentRouteName() != 'SelectLanguage' && navigate(NavigationStrings.SelectLanguage);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.backgroundColor}
        barStyle={ThemeManager.colors.themeColor === 'light' ? 'dark-content' : 'light-content'}
      />
      <ImageBackground
        source={images.backgroundd}
        style={{ flex: 1, backgroundColor: '#000000' }}>
        <Image source={images.AppNamebg} style={styles.AppNamebg} />
        <View style={styles.textContainor}>
          <LottieView
            source={images.newAnimation}
            style={styles.AppName}
            autoPlay
            loop
          />
        </View>
        <LottieView
          source={images.Textanimation}
          style={styles.BYsaita}
          autoPlay
          loop
        />
      </ImageBackground>
    </Wrap>
  );
};

export default SplashAppName;
