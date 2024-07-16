/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { changePasswordCard } from '../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../Singleton';
import { Fonts } from '../../../theme';
import {
  BasicButton,
  BasicInputBoxPassword,
  BorderLine,
  MainStatusBar,
  SimpleHeaderNew,
  Wrap
} from '../../common/index';
import Loader from '../Loader/Loader';
import styles from './SaitaCardNewPasswordStyle';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { goBack } from '../../../navigationsService';

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
      'Success',
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
      Singleton.showAlert('Old Password field is required.');
      return;
    }
    if (password == '') {
      Singleton.showAlert('New Password field is required.');
      return;
    }
    if (confirmpassword == '') {
      Singleton.showAlert('Confirm Password field is required.');
      return;
    }

    if (password.length < 6) {
      Singleton.showAlert('Password must be greater than 5 characters');
      return;
    }

    if (confirmpassword.length < 6) {
      Singleton.showAlert('New Password must be greater than 5 characters');
      return;
    }

    if (Constants.PASSWORD_REGEX.test(password) == false) {
      Singleton.showAlert(
        'Password must include a special character, upper and lower case letters and a number',
      );
      return;
    }
    if (confirmpassword != password) {
      Singleton.showAlert('Password mismatch.');
      return;
    }

    if (Constants.PASSWORD_REGEX.test(confirmpassword) == false) {
      Singleton.showAlert(
        'New Password must include a special character, upper and lower case letters and a number',
      );
      return;
    }

    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        //console.warn('MM',">>>>access_token", access_token);
        if (access_token) {
          setisLoading(true);
          let data = {
            oldPwd: oldpassword,
            newPwd: password,
            cnfrmPwd: confirmpassword,
          };
          dispatch(changePasswordCard({data, access_token}))
            .then(res => {
              setisLoading(false);
              //console.warn('MM',"proceedPassword res::::::::", res);
              if (res.status) {
                // Singleton.showAlert(res.message)
                redirect(res.message);
              }
            })
            .catch(err => {
              //console.warn('MM',"proceedPassword eerrr:::::::::", err);
              setisLoading(false);
              Singleton.showAlert(err.message);
            });
        }
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
        text="Submit"
      />
      {isLoading && <Loader />}
    </Wrap>
  );
};

export default SaitaCardNewPassword;
