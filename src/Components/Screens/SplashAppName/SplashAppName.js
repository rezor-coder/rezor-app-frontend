/* eslint-disable jsx-quotes */
import React, { useEffect } from 'react';
import { View, Image, ImageBackground } from 'react-native';
import images from '../../../theme/Images';
import colors from '../../../theme/Colors';
import { styles } from './SplashAppNameStyle';
import LottieView from 'lottie-react-native';
import { MainStatusBar, Wrap } from '../../common';
import { ActionConst, Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
const SplashAppName = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      Actions.currentScene != 'SelectLanguage' && Actions.SelectLanguage({ type: ActionConst.RESET });
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
