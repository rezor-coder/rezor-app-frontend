/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  Linking,
  BackHandler,
} from 'react-native';
import { Wrap } from '../../common/Wrap';
import {
  BasicButton,
  BasicInputBox,
  BorderLine,
  MainHeader,
  MainStatusBar,
  SimpleHeader,
  SubHeader,
} from '../../common';
import { Actions } from 'react-native-router-flux';
import images from '../../../theme/Images';
import styles from './SwapSettingsStyle';
import {
  logoutUser,
  enableDisableNoti,
  getEnableDisableNotiStatus,
  getSocialList,
  changeThemeAction,
} from '../../../Redux/Actions';
import { Colors, Fonts, Images } from '../../../theme';
import { SettingBar } from '../../common/SettingBar';
import fonts from '../../../theme/Fonts';
import * as constants from './../../../Constant';
import { ActionConst } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import { connect, useDispatch, useSelector } from 'react-redux';

import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { EventRegister } from 'react-native-event-listeners';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

let showLoader = true;
const SwapSettings = props => {
  const dispatch = useDispatch();
  const [tolerance, setTolerance] = useState(
    Singleton.getInstance().slipageTolerance?.toString(),
  );
  const [timeout, setTimeout] = useState(
    Singleton.getInstance().slipageTimeout,
  );
  const onScreenFocus = () => {
    console.log("onScreenFocus----------------------FOCUS")
    BackHandler.addEventListener('hardwareBackPress', backAction);
  };
  const onScreenBlur = () => {
    console.log("onScreenFocus----------------------BLUR")
    BackHandler.removeEventListener('hardwareBackPress', backAction);
  };
  useEffect(() => {
    props.navigation.addListener('didFocus', onScreenFocus);
    props.navigation.addListener('didBlur', onScreenBlur);
  }, []);
  const backAction = () => {
    let data = "";
    EventRegister.emit('swapData', data);
      Actions.pop(); 
      return true;
  };
  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <SimpleHeader
        title={LanguageManager.Settings}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle={{ textTransform: 'capitalize' }}
        imageShow
        back={false}
        backPressed={() => {
          // Actions.SwapNew()
          let data = "";
          EventRegister.emit('swapData', data);
          Actions.currentScene === 'SwapSettings' && Actions.pop();
          // Actions.currentScene === 'SwapSettings' && Actions.Trade({from:'Setting'});
        }}
      />

      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        contentContainerStyle={{ flex: 1 }}>
        <View style={[{ flex: 1 }]}>
          {/* 
          <SimpleHeader
          title={'SaitaPro Support'}
          rightImage={styles.rightImgStyle}
          />
         */}

          <View style={{ flex: 0.8, marginHorizontal: widthDimen(22) }}>
            <BasicInputBox
              maxLength={2}
              text={tolerance}
              titleStyle={{ color: ThemeManager.colors.textColor }}
              title={LanguageManager.slippageTolerance}
              onChangeText={text => {

                if (constants.NUMBER_ONLY_REGEX.test(text)) {
                  if (parseFloat(text) > 10) {
                    return
                  } else {
                    setTolerance(text);
                  }
                }


              }}
              width="100%"
              keyboardType={'numeric'}
              disabledRight={true}
              rightText={"%"}
              disableColor={ThemeManager.colors.textColor}
              mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
              placeholder={LanguageManager.enterValue}/>
            <BasicInputBox
              maxLength={2}
              keyboardType={'numeric'}
              text={timeout}
              titleStyle={{ color: ThemeManager.colors.textColor }}
              title={LanguageManager.transactionTimeout}
              onChangeText={text => {
                if (constants.NUMBER_ONLY_REGEX.test(text)){
                  if (parseFloat(text) > 10) {
                    return
                  } else {
                    setTimeout(text)
                  }
                }
              }}
              editable={false}
              width="100%"
              disabledRight={true}
              rightText={"Minutes"}
              disableColor={ThemeManager.colors.textColor}
              mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
              placeholder={LanguageManager.enterValue}/>
          </View>
          <View style={{ justifyContent: 'flex-end', flex: 0.2 }}>
            <BasicButton
              onPress={() => {
                // setStakeSelected(true);

                if (tolerance == undefined || tolerance == 0) {
                  Singleton.showAlert('Please enter Tolerance.');
                  return;
                }
                if (timeout == undefined || timeout == 0) {
                  Singleton.showAlert('Please enter Timeout.');
                  return;
                }

                Singleton.getInstance().slipageTimeout = timeout;
                Singleton.getInstance().slipageTolerance = tolerance;
                let data = { timeout: timeout, tolerance: tolerance };
                EventRegister.emit('swapData', data);
                Actions.currentScene === 'SwapSettings' && Actions.pop();
                // Actions.Trade({from:'Setting'});
                // Actions.currentScene === 'SwapSettings' && Actions.Trade({from:'Setting'});;
                // Actions.pop({refresh:{foo: 'bar'}})
              }}
              btnStyle={{
                flex: 1,
                marginHorizontal: widthDimen(22),
                height: heightDimen(60),
                justifyContent: 'center',
                borderRadius: 100,
              }}
              customGradient={{
                borderRadius: 100,
                height: heightDimen(60),
                position: 'absolute',
                bottom: 10,
              }}
              // colors={Singleton.getInstance().dynamicColor}
              text={LanguageManager.submit}
              textStyle={{ fontSize: areaDimen(16), fontFamily: Fonts.semibold }}
            />
          </View>
        </View>
      </ScrollView>
    </Wrap>
  );
};

export default SwapSettings;
