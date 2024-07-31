/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../../ThemeManager';
import * as Constants from '../../../../Constant';
import { changePassword, changePasswordCard } from '../../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../../Singleton';
import { Fonts } from '../../../../theme';
import {
  BasicButton,
  BasicInputBoxPassword,
  BorderLine,
  MainStatusBar,
  SimpleHeaderNew,
  Wrap
} from '../../../common/index';
import Loader from '../../Loader/Loader';
import styles from './SaitaCardNewPasswordStyle';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightDimen, widthDimen } from '../../../../Utils/themeUtils';
import { goBack, navigate } from '../../../../navigationsService';
import { NavigationStrings } from '../../../../Navigation/NavigationStrings';

const SaitaCardNewPassword = props => {
  const dispatch = useDispatch();
  const [oldpassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const [showoldPassword, setShowOldPassword] = useState(true);
  const [shownewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  useEffect(() => {}, []);

  const redirect = msg => {
    // setPassword('')
    // setConfirmPassword('')
    // setOldPassword('')
    goBack();
    Alert.alert(
     LanguageManager.success,
      msg,
      [
        {
          text: 'Ok',
          onPress: () => {
            // getCurrentRouteName() != 'ConfirmPin' && goBack()
          },
        },
      ],
      {cancelable: false},
    );
  };
  const proceedPassword = () => {
    if (oldpassword == '') {
      Singleton.showAlert(LanguageManager.oldPasswordRequired);
      return;
    }
    if (password == '') {
      Singleton.showAlert(LanguageManager.newPasswordRequired);
      return;
    }
    if (confirmpassword == '') {
      Singleton.showAlert(LanguageManager.confirmPasswordRequired);
      return;
    }

    if (password.length < 6) {
      Singleton.showAlert(LanguageManager.passwordCharacters);
      return;
    }

    if (confirmpassword.length < 6) {
      Singleton.showAlert(LanguageManager.newPasswordCharacters);
      return;
    }

    if (Constants.PASSWORD_REGEX.test(password) == false) {
      Singleton.showAlert(
        LanguageManager.passwordWithSpecialCharacter
      );
      return;
    }
    if (confirmpassword != password) {
      Singleton.showAlert(LanguageManager.passwordMismatch);
      return;
    }

    if (Constants.PASSWORD_REGEX.test(confirmpassword) == false) {
      Singleton.showAlert(
        LanguageManager.newPasswordWithSpecialCharacter
      );
      return;
    }
    setisLoading(true);
    let data = {
      newPassword: password,
      currentPassword: oldpassword,
    }; 
    changePassword({data})
    .then(res => {
      console.log('res:::::::::logOut', res);
      setisLoading(false);
      navigate(NavigationStrings.SaitaCardDashBoard)
    })
    .catch(err => {
      console.log('err:::::::::logOut', err);
      Singleton.showAlert(err || LanguageManager.somethingWrong);
      setisLoading(false);
    });
   };

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      <KeyboardAwareScrollView
        style={{height: windowHeight}}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'always'}
        bounces={false}>
        <View style={{height: windowHeight}}>
          <View style={styles.container}>
            <MainStatusBar
              backgroundColor={ThemeManager.colors.backgroundColor}
              barStyle={
                ThemeManager.colors.themeColor === 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
            />
            <SimpleHeaderNew
              title={LanguageManager.newpassword}
              backImage={ThemeManager.ImageIcons.iconBack}
              titleStyle
              back={false}
              backPressed={() => {
                props.navigation.goBack();
              }}
            />
            <BorderLine
              borderColor={{
                backgroundColor: ThemeManager.colors.viewBorderColor,
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                marginTop: heightDimen(30),
              marginHorizontal: widthDimen(12),
              }}>
              <BasicInputBoxPassword
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: Fonts.semibold,
                }}
                title={LanguageManager.oldpassword}
                width="85%"
                maxLength={20}
                text={oldpassword}
                onPress={() => setShowOldPassword(!showoldPassword)}
                keyboardType="ascii-capable"
                secureTextEntry={showoldPassword}
                onChangeText={text => setOldPassword(text)}
                mainStyle={{borderColor: ThemeManager.colors.viewBorderColor}}
                placeholder={LanguageManager.enterhere}
              />

              <BasicInputBoxPassword
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: Fonts.semibold,
                }}
                title={LanguageManager.enternewpassword}
                width="85%"
                maxLength={20}
                onPress={() => setShowNewPassword(!shownewPassword)}
                keyboardType="ascii-capable"
                text={password}
                secureTextEntry={shownewPassword}
                onChangeText={text => setPassword(text)}
                mainContainerStyle={{marginTop: 10}}
                mainStyle={{borderColor: ThemeManager.colors.viewBorderColor}}
                placeholder={LanguageManager.enterhere}
              />

              <BasicInputBoxPassword
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: Fonts.semibold,
                }}
                title={LanguageManager.confirmpassword}
                width="85%"
                maxLength={20}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                keyboardType="ascii-capable"
                text={confirmpassword}
                secureTextEntry={showConfirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                mainContainerStyle={{marginTop: 10}}
                mainStyle={{borderColor: ThemeManager.colors.viewBorderColor}}
                placeholder={LanguageManager.enterhere}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <BasicButton
        onPress={() => proceedPassword()}
        btnStyle={styles.btnStyle}
        customGradient={styles.customGrad}
        text={LanguageManager.submit}
      />
      {isLoading && <Loader />}
    </Wrap>
  );
};

export default SaitaCardNewPassword;
