/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  ScrollView,
  View
} from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, goBack, navigate, reset } from '../../../navigationsService';
import {
  BorderLine,
  MainStatusBar,
  SimpleHeader
} from '../../common';
import { SettingBar } from '../../common/SettingBar';
import { Wrap } from '../../common/Wrap';
import Loader from '../Loader/Loader';
import styles from './CardSettingStyle';


const CardSetting = props => {
  const [isLoading, setisLoading] = useState(false);
useEffect(()=>{
let backHandle= BackHandler.addEventListener('hardwareBackPress',()=>{
goBack()
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
            reset(NavigationStrings.Main);
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
         goBack()
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
                getCurrentRouteName() != "SaitaCardNewPassword" && navigate(NavigationStrings.SaitaCardNewPassword)
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
