/* eslint-disable react/self-closing-comp */
import React, { useEffect } from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { navigate, reset } from '../../../navigationsService';
import {
  BasicButton,
  MainStatusBar
} from '../../common';
import * as constants from './../../../Constant';
import { styles } from './CongratsStyle';
const windowHeight = Dimensions.get('window').height;

const Congrats = props => {
console.log(props,'aFSDDAGSF');
  const onProceed = () => {
    // Actions.jump('Congrats');
    Singleton.getInstance().newSaveData(constants.IS_LOGIN, '1');
    reset(NavigationStrings.Main);
  };
  useEffect(() => {
    //  console.warn('MM','****************i walletData.decimals', props.walletData.decimals , props.walletData);
    props.navigation.addListener('focus', onScreenFocus);
    props.navigation.addListener('blur', onScreenBlur);
  }, [props]);
  const onScreenFocus = () => {
    console.log("onScreenFocus----------------------FOCUS")
    BackHandler.addEventListener('hardwareBackPress', backAction);
  };
  const onScreenBlur = () => {
    console.log("onScreenFocus----------------------BLUR")
    BackHandler.removeEventListener('hardwareBackPress', backAction);
  };
  const backAction = () => {
  return true
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ThemeManager.colors.bg }}>
      {/* <MainStatusBar backgroundColor={colors.black} barStyle="light-content" /> */}
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      {/* <ImageBackground
        resizeMode="cover"
        style={{ height: windowHeight }}
        source={ThemeManager.ImageIcons.congIcon}> */}
      {/* <LottieView
        source={images.SplashAnimation}
        style={{width: '100%'}}
        autoPlay
        loop
      /> */}
      {/* <ScrollView keyboardShouldPersistTaps="always" bounces={false} style={{ flex: 1 }}> */}
      <View style={{ flex: 1 }}>
        <View style={[styles.viewContents, { flex: 0.9 }]}>
          <Image source={ThemeManager.ImageIcons.congratulationsIcon}
            style={{
              height: widthDimen(135),
              width: widthDimen(135),
              marginBottom: heightDimen(20),
              marginTop: heightDimen(60),
              resizeMode: 'contain'
            }}
          />
          <Text style={[styles.txtCongrats, { color: ThemeManager.colors.headingText }]}>Congratulations!</Text>
          <Text style={[styles.txtDesc, { color: ThemeManager.colors.lightTextColor }]}>
            {LanguageManager.congratulationsForCreateWallet}
          </Text>
        </View>

        <View style={[styles.alignCenter, {
          flex: 0.1,
          justifyContent: 'center',
        }]} >
          <BasicButton
            onPress={() => {
              onProceed();
            }}
            btnStyle={styles.btnStyle}
            customGradient={styles.customGrad}
            text={LanguageManager.lets} />
        </View>
      </View>
      {/* </ScrollView> */}
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};

export default Congrats;
