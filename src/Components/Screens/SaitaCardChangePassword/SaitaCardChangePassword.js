/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { setNewPasswordCard } from '../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../Singleton';
import { Fonts } from '../../../theme';
import { BasicButton, BasicInputBoxPassword, BorderLine, MainStatusBar, SimpleHeaderNew, Wrap } from '../../common/index';
import Loader from '../Loader/Loader';
import styles from './SaitaCardChangePasswordStyle';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { navigate } from '../../../navigationsService';

const SaitaCardChangePassword = props => {

  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);



  useEffect(() => {

  }, []);

  const redirect = (msg) => {
    Alert.alert(
      'Success',
      msg,
      [
        {
          text: 'Ok',
          onPress: () => {
            navigate(NavigationStrings.SaitaCardLogin)
          },
        },

      ],
      { cancelable: false },
    );
  }

  const proceedPassword = () => {
    if (password == "") {
      Singleton.showAlert('New Password field is required.');
      return
    }
    if (confirmpassword == "") {
      Singleton.showAlert('Confirm Password field is required.');
      return
    }

    if (password.length < 6) {
      Singleton.showAlert('Password must be greater than 5 characters');
      return
    }


    if (confirmpassword.length < 6) {
      Singleton.showAlert('Confirm Password must be greater than 5 characters');
      return
    }
    if (Constants.PASSWORD_REGEX.test(password) == false) {
      Singleton.showAlert("Password must include a special character, upper and lower case letters and a number")
      return
    }
    if (confirmpassword != password) {
      Singleton.showAlert('Password mismatch.');
      return
    }


    if (Constants.PASSWORD_REGEX.test(confirmpassword) == false) {
      Singleton.showAlert("Confirm Password must include a special character, upper and lower case letters and a number")
      return
    }

    







    setisLoading(true);
    let data = {
      email: props?.route?.params?.dataObj.email,
      otp: props?.route?.params?.dataObj.otp,
      newPwd: password,
      cnfrmPwd: confirmpassword,
      otp_type: "forget_pwd"
    };
    dispatch(setNewPasswordCard({ data })).then(res => {
      setisLoading(false);
      ////MM//MMconsole.warn('MM',"proceedPassword res::::::::", res);
      if (res.status) {
        redirect(res.message)
        //Actions.jump("SaitaCardLogin")
        //  Singleton.showAlert(res.message)
      }
    }).catch(err => {
      //console.warn('MM',"proceedPassword eerrr:::::::::", err);
      setisLoading(false);
      Singleton.showAlert(err.message)
    });
  }



  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <KeyboardAwareScrollView style={{ height: windowHeight }} showsVerticalScrollIndicator={false} enableOnAndroid={true} keyboardShouldPersistTaps={'always'} bounces={false}>

        <View style={{ height: windowHeight }}>
          <View style={styles.container}>
            <MainStatusBar
              backgroundColor={ThemeManager.colors.backgroundColor}
              barStyle={ThemeManager.colors.themeColor === 'light' ? 'dark-content' : 'light-content'} />

            {/* <Text style={[styles.lablePrefLang, { color: ThemeManager.colors.lightTextColor },]}>Visual form of a document or a typeface{'\n'} without relying on meaningful content. </Text> */}
            <SimpleHeaderNew
              title={LanguageManager.newpassword}
              backImage={ThemeManager.ImageIcons.iconBack}
              titleStyle
              back={false}
              backPressed={() => {
                props.navigation.goBack();
              }}

            />
            <BorderLine/>
            <View style={{ justifyContent: 'center', marginTop: 80, marginHorizontal: 25, }}>
              <BasicInputBoxPassword
                titleStyle={{ color: ThemeManager.colors.textColor, fontSize: 13, fontFamily: Fonts.semibold }}
                title={LanguageManager.password}
                width="85%"
                maxLength={20}
                onPress={() => setShowPassword(!showPassword)}
                secureTextEntry={showPassword}
                keyboardType='ascii-capable'
                // keyboardType={Platform.OS == 'ios' ? "ascii-capable": "visible-password"}
                onChangeText={text => setPassword(text)}
                mainStyle={{ borderColor: ThemeManager.colors.inputBoxColor }}
                placeholder={LanguageManager.enterhere}>

              </BasicInputBoxPassword>

              <BasicInputBoxPassword
                titleStyle={{ color: ThemeManager.colors.textColor, fontSize: 13, fontFamily: Fonts.semibold }}
                title={LanguageManager.confirmpassword}
                width="85%"
                maxLength={20}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                secureTextEntry={showConfirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                keyboardType='ascii-capable'
                // keyboardType={Platform.OS == 'ios' ? "ascii-capable": "visible-password"}
                mainContainerStyle={{ marginTop: 10 }}
                mainStyle={{ borderColor: ThemeManager.colors.inputBoxColor }}
                placeholder={LanguageManager.enterhere}>

              </BasicInputBoxPassword>

              <BasicButton
                onPress={() => proceedPassword()}
                btnStyle={styles.btnStyle}
                customGradient={styles.customGrad}
                text="Submit"
              />
            </View>


          </View>
        </View>


        {isLoading && <Loader />}

      </KeyboardAwareScrollView>
    </Wrap>

  );
};

export default SaitaCardChangePassword;
