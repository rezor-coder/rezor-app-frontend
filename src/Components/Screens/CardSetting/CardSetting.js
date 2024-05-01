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
  BackHandler
} from 'react-native';
import { Wrap } from '../../common/Wrap';
import {
  BasicButton,
  BorderLine,
  MainHeader,
  MainStatusBar,
  SimpleHeader,
  SubHeader,
} from '../../common';
import { Actions } from 'react-native-router-flux';
import images from '../../../theme/Images';
import styles from './CardSettingStyle';
import {
  logoutUser,
  enableDisableNoti,
  getEnableDisableNotiStatus,
  getSocialList,
  changeThemeAction,
} from '../../../Redux/Actions';
import { Colors } from '../../../theme';
import { SettingBar } from '../../common/SettingBar';
import fonts from '../../../theme/Fonts';
import * as constants from '../../../Constant';
import { ActionConst } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import { connect, useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';


const CardSetting = props => {
  const [isLoading, setisLoading] = useState(false);
useEffect(()=>{
let backHandle= BackHandler.addEventListener('hardwareBackPress',()=>{
Actions.pop()
return true
})
return()=>{
  backHandle.remove()
}
},[])
 

  const logoutPressed = () => {
    Alert.alert(constants.APP_NAME, constants.USER_LOGOUT_CARD, [
      {
        text: 'NO',
        onPress: () => {
   //  console.warn('MM','Cancel Pressed')
        },
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          // Singleton.getInstance().removeItemNew(constants.CARD_CREDENTIALS);
          Singleton.getInstance().removeItemNew(constants.access_token_cards).then(res=>{
             Actions.Main({ type: ActionConst.RESET });
          })

        },
      },
    ]);
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
        title={LanguageManager.cardsetting}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          Actions.pop()
        }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />
      <View style={{ flex: 1, padding: 10 }}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

          {/* <View style={[styles.card, { marginVertical: 2,borderBottomColor:ThemeManager.colors.viewBorderColor }]}> */}
            <SettingBar
              iconImage={ThemeManager.ImageIcons.lockpassword}
              title={LanguageManager.cardpassword}
              titleStyle={{ color: ThemeManager.colors.textColor }}
              onPress={() => {
                Actions.currentScene != "SaitaCardNewPassword" && Actions.SaitaCardNewPassword()
              }}
              style={{ borderBottomWidth: 0 }}
              imgStyle={[styles.img]}
              arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
            />
          {/* </View> */}
          <BorderLine/>
          {/* <View style={[styles.card, {borderBottomColor:ThemeManager.colors.viewBorderColor }]}> */}
            <SettingBar
              iconImage={ThemeManager.ImageIcons.card_logout}
              title={LanguageManager.cardlogout}
              titleStyle={{ color: ThemeManager.colors.textColor }}
              onPress={() => {
                logoutPressed();
              }}
              style={{ borderBottomWidth: 0 }}
              imgStyle={[styles.img]}
              arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
            />
            <BorderLine/>
          {/* </View> */}



        </ScrollView>
        {isLoading && <Loader />}
      </View>
    </Wrap>
  );
};



export default CardSetting;
