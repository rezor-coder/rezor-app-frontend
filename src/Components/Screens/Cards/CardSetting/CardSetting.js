import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, ScrollView, View} from 'react-native';
import {LanguageManager, ThemeManager} from '../../../../../ThemeManager';
import * as Constants from '../../../../Constant';
import {NavigationStrings} from '../../../../Navigation/NavigationStrings';
import {logOut} from '../../../../Redux/Actions';
import {
  getCurrentRouteName,
  goBack,
  navigate,
} from '../../../../navigationsService';
import {BorderLine, MainStatusBar, SimpleHeader} from '../../../common';
import {SettingBar} from '../../../common/SettingBar';
import {Wrap} from '../../../common/Wrap';
import Loader from '../../Loader/Loader';
import styles from './CardSettingStyle';
import Singleton from '../../../../Singleton';
import {Images} from '../../../../theme';

const CardSetting = props => {
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    let backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => {
      backHandle.remove();
    };
  }, []);
  const onPressLogout = () => {
    setisLoading(true);
    logOut({})
      .then( async res => {
        console.log('res:::::::::logOut', res);
        console.log('res:::::::::logOut', res);
        await Singleton.getInstance().removeItemNew(Constants.CARD_TOKEN);
        goBack();
        setisLoading(false);
      })
      .catch(err => {
        console.log('err:::::::::logOut', err);
        setisLoading(false);
      });
  };
  const logoutPressed = () => {
    Alert.alert(Constants.APP_NAME, Constants.USER_LOGOUT_CARD, [
      {
        text: 'NO',
        onPress: () => {
          //  console.warn('MM','Cancel Pressed')
        },
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: onPressLogout,
      },
    ]);
  };

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
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
          goBack();
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <View style={{flex: 1, padding: 10}}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <SettingBar
            iconImage={ThemeManager.ImageIcons.lockpassword}
            title={LanguageManager.cardpassword}
            titleStyle={{color: ThemeManager.colors.textColor}}
            onPress={() => {
              getCurrentRouteName() != LanguageManager.saitaCardNewPassword &&
                navigate(NavigationStrings.SaitaCardNewPassword);
            }}
            style={{borderBottomWidth: 0}}
            imgStyle={[styles.img]}
            arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
          />
          <BorderLine />
          {props.route.params?.userCards?.length > 0 ? (
            <>
              <SettingBar
                iconImage={Images.deposit2}
                title={LanguageManager.deposit}
                titleStyle={{color: ThemeManager.colors.textColor}}
                onPress={() => navigate(NavigationStrings.DepositScreen)}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
                tintColor={ThemeManager.colors.textColor}
              />
              <BorderLine />
            </>
          ) : null}
          <SettingBar
            iconImage={ThemeManager.ImageIcons.card_logout}
            title={LanguageManager.cardlogout}
            titleStyle={{color: ThemeManager.colors.textColor}}
            onPress={logoutPressed}
            style={{borderBottomWidth: 0}}
            imgStyle={[styles.img]}
            arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
          />
          <BorderLine />
        </ScrollView>
        {isLoading && <Loader />}
      </View>
    </Wrap>
  );
};

export default CardSetting;
