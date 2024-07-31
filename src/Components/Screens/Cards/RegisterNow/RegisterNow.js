import { isEmpty, property } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LanguageManager, ThemeManager } from '../../../../../ThemeManager';
import { NavigationStrings } from '../../../../Navigation/NavigationStrings';
import { confirmPhoneOtp, addEmail, resendPhoneOtp, getSignUPPhoneCode } from '../../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../../Singleton';
import { numberValidation, validatePassword } from '../../../../Utils/Validation';
import { areaDimen } from '../../../../Utils/themeUtils';
import { countryData } from '../../../../countryCodes';
import { goBack, navigate, reset } from '../../../../navigationsService';
import { Colors, Images } from '../../../../theme';
import { validateEmail } from '../../../../utils';
import { SimpleHeader } from '../../../common';
import GradientButton from '../../../common/GradientButton';
import TextInputWithLabel from '../../../common/TextInputWithLabel';
import WrapperContainer from '../../../common/WrapperContainer';
import CountryCodes from '../../CountryCodes/CountryCodes';
import styles from './styles';
import { useDispatch } from 'react-redux';
import * as Constants from '../../../../Constant';

const RegisterNow = ({navigation,route}) => {
  const intervalRef = useRef(null);
  const dispatch = useDispatch()
  const [signInSuccess, setSignInSuccess] = useState(route?.params?.verifyEmail ? true : false)

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const [phoneMatchOtp, setPhoneMatchOtp] = useState('');
  const [emailMatchOtp, setEmailMatchOtp] = useState('');
  const [status, setStatus] = useState(0);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [countryListModal, setCountryListModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode,setCountryCode]= useState('+91')
  const [residenceCountry, setResidenceCountry] = useState(
    countryData.find(item => item.dial_code == countryCode),
  );
  const [oldNumber, setOldNumber] = useState(false);
  const [seconds, setSeconds] = useState(40);
  const [isActive, setIsActive] = useState(false);
  const [token, setToken] = useState();
  console.log('token:::::', token);
  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds]);

  // -------------------------------------------------------------------
  const onPressPhoneOtpSend = () => {
    // List of fields to validate with corresponding error messages
    if (isEmpty(residenceCountry)) {
      Singleton.showAlert(LanguageManager.enterYourResidenceCountry);
      return;
    }
    const fields = [
      {
        value: phoneNumber,
        message: LanguageManager.pleaseEnterPhoneNumber,
        invalidMessage: LanguageManager.invalidPhoneNumber,
        validator: numberValidation,
      },
      {
        value: password,
        message: LanguageManager.pleaseEnterYourPassword,
        invalidMessage:
         LanguageManager.passwordData,
        validator: validatePassword,
      },
      {
        value: confirmPassword,
        message: LanguageManager.pleaseConfirmYourPassword,
      },
    ];

    // Check if any field is empty or fails validation and show an alert if it does
    for (const field of fields) {
      if (field.value.length < 1) {
        Singleton.showAlert(field.message);
        return;
      }

      // Check if the field has a validator and if it fails validation
      if (field.validator && !field.validator(field.value)) {
        Singleton.showAlert(field.invalidMessage);
        return;
      }
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      Singleton.showAlert(LanguageManager.passwordAndConfirmPasswordMustMatch);
      return;
    }
    setIsLoading(true);
    let data = {
      phone: `${residenceCountry?.dial_code}${phoneNumber}`,
      password: password,
    };
    dispatch(getSignUPPhoneCode({data}))
      .then(res => {
        setOldNumber(phoneNumber);
        setIsLoading(false);
        setSeconds(40);
        setPhoneMatchOtp(true);
        setIsActive(true);
        setButtonDisable(false);
      })
      .catch(error => {
        Singleton.showAlert(error);
        setIsLoading(false);
        setSeconds(0);
      });
  };
  // -------------------------------------------------------------------

  const checkOtpStatus = () => {
    if (phoneOtp.length < 1) {
      Singleton.showAlert(LanguageManager.pleaseEnterOtp);
      return;
    }

    let data = {
      phone: `${residenceCountry?.dial_code}${phoneNumber}`,
      smsCode: `${phoneOtp}`,
    };
    setIsActive(false);
    setIsLoading(true);
   dispatch(confirmPhoneOtp({data}))
      .then(async(res) => {
        console.log('res.data?.access_token????',res.data?.access_token);
        setToken(res.data?.access_token)
        await Singleton.getInstance().newSaveData(Constants.CARD_TOKEN, res.data?.access_token)
        setSignInSuccess(true)
        setIsLoading(false);
        setButtonDisable(true);
        setStatus(1);
        setSeconds(0);
      })
      .catch(error => {
        Singleton.showAlert(error);
        setIsLoading(false);
        setSeconds(0);
      });
  };

  // -------------------------------------------------------------------

  const phoneResendOtp = () => {
    if (seconds > 0) {
      return;
    }
    let data = {
      phone: `${residenceCountry?.dial_code}${phoneNumber}`,
    };
    setPhoneOtp('')
    setIsLoading(true);

    dispatch(resendPhoneOtp({data}))
      .then(res => {
        setIsLoading(false);
        setSeconds(40);
        setPhoneMatchOtp(true);
        setIsActive(true);
        setButtonDisable(false);
      })
      .catch(error => {
        Singleton.showAlert(error);
        setIsLoading(false);
      });
  };
  // -------------------------------------------------------------------

  const onPressSend = () => {
    // Validate if email is empty
    if (email.length < 1) {
      Singleton.showAlert(LanguageManager.pleaseEnterEmail);
      return;
    }
    // Validate email format
    if (!validateEmail(email)) {
      Singleton.showAlert(LanguageManager.invalidEmailFormat);
      return;
    }
    setIsLoading(true);
    let data = {
      email: email,
    };
    dispatch(addEmail({data}))
      .then(res => {
        console.log(res, 'resresresresres');
        setIsLoading(false);
        setEmailMatchOtp(true);
        setButtonDisable(false);
        onPressSignUp()
      })
      .catch(error => {
        Singleton.showAlert(error);
        setIsLoading(false);
      });
  };

  // -------------------------------------------------------------------

  const onPressSignUp = async () => {

    navigate(NavigationStrings.UserDetail)
  };

  return (
    <WrapperContainer isLoading={isLoading}>
      <SimpleHeader
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          if (signInSuccess) {
            navigation.navigate(NavigationStrings.SaitaCardDashBoard);
          } else {
          goBack()
          }
        }}
      />
      <KeyboardAwareScrollView
        automaticallyAdjustKeyboardInsets={true}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.loginTextView}>
            <Image source={Images.splashLogo} style={styles.logoStyle} />
            <Text style={[styles.straproStyle]}>
              {LanguageManager.saitaPro}
            </Text>
          </View>
          <Text
            style={[
              {
                color: ThemeManager.colors.textColor,
                ...styles.signUpTitle,
              },
            ]}>
            {!signInSuccess
              ? LanguageManager.createAnAccount
              : 'Add Email to Your Account'}
          </Text>
          {!signInSuccess ? (
            <>
              <TextInputWithLabel
                label={LanguageManager.phone}
                placeHolder={`${LanguageManager.enterYour} ${LanguageManager.phoneNo}`}
                value={phoneNumber}
                keyboardType={'numeric'}
                onChangeText={text => {
                  if (text.length == 0) {
                    setPhoneMatchOtp(false);
                  }
                  if (numberValidation(text) || text.length < 1) {
                    setPhoneNumber(text.trimStart());
                  }
                }}
                maxLength={10}
                labelStyle={{marginTop: areaDimen(24)}}
                editable={status == 0 ? true : false}
                customLeftIcon={() => (
                  <TouchableOpacity
                    style={styles.dialCodeView}
                    onPress={() =>
                      status == 0
                        ? setCountryListModal(true)
                        : setCountryListModal(false)
                    }>
                    <Text
                      style={[
                        styles.inputTextStyle,
                        {color: ThemeManager.colors.textColor},
                      ]}>
                      {countryCode}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TextInputWithLabel
                label={LanguageManager.password}
                placeHolder={LanguageManager.enterPassword}
                value={password}
                onChangeText={text => {
                  setPassword(text.trimStart());
                }}
                labelStyle={{marginTop: areaDimen(16)}}
                onPressRightIcon={() => setShowPassword(!showPassword)}
                rightIcon={!!showPassword ? Images.eyeOpened : Images.eyeClosed}
                secureTextEntry={!showPassword}
                editable={status == 0 ? true : false}
              />
              <TextInputWithLabel
                label={LanguageManager.confirmpassword}
                placeHolder={`${LanguageManager.enter} ${LanguageManager.confirmpassword}`}
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text.trimStart());
                }}
                labelStyle={{marginTop: areaDimen(16)}}
                onPressRightIcon={() =>
                  setConfirmShowPassword(!showConfirmPassword)
                }
                rightIcon={
                  !!showConfirmPassword ? Images.eyeOpened : Images.eyeClosed
                }
                secureTextEntry={!showConfirmPassword}
                editable={status == 0 ? true : false}
              />
              <TouchableOpacity
                disabled={status == 1 ? true : false}
                style={styles.sendcodeView}
                onPress={
                  oldNumber == phoneNumber && !!phoneMatchOtp
                    ? phoneResendOtp
                    : onPressPhoneOtpSend
                }>
                <Text
                  style={[styles.codeTextStyle, {color: Colors.buttonColor1}]}>
                  {oldNumber == phoneNumber && !!phoneMatchOtp
                    ? seconds < 1
                      ? 'Resend OTP'
                      : `Resend OTP(00:${seconds})`
                    : 'Send OTP'}
                </Text>
              </TouchableOpacity>
              {!!phoneMatchOtp ? (
                <TextInputWithLabel
                  label={LanguageManager.enterOtp}
                  placeHolder={LanguageManager.enterOtp}
                  value={phoneOtp}
                  keyboardType={'numeric'}
                  maxLength={4}
                  onChangeText={text => setPhoneOtp(text)}
                  labelStyle={{marginTop: areaDimen(16)}}
                  editable={status == 0 ? true : false}
                />
              ) : null}
            </>
          ) : (
            <TextInputWithLabel
              label={'Email'}
              placeHolder={`${LanguageManager.enterYourEmail}`}
              value={email}
              onChangeText={text => setEmail(text)}
              labelStyle={{marginTop: areaDimen(16)}}
              editable={signInSuccess ? true : false}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
      {!signInSuccess && (
        <GradientButton
          buttonStyle={styles.buttonView}
          title={LanguageManager.signUp}
          onPress={() => {
            checkOtpStatus();
          }}
          buttonColor={
            !!buttonDisable
              ? [ThemeManager.colors.lightGrey, ThemeManager.colors.lightGrey]
              : []
          }
          // disabled={!phoneMatchOtp}
        />
      )}

      {!signInSuccess && (
        <TouchableOpacity activeOpacity={1} onPress={() => goBack()}>
          <Text
            style={[
              styles.registerText,
              {color: ThemeManager.colors.textColor},
            ]}>
            Already have an account?{' '}
            <Text style={{color: Colors.buttonColor1}}>LogIn</Text>
          </Text>
        </TouchableOpacity>
      )}
      {signInSuccess && (
        <GradientButton
          buttonStyle={styles.buttonView}
          title={LanguageManager.addEmail}
          onPress={() => {
            onPressSend();
          }}
          // disabled={buttonDisable}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={countryListModal}
        onRequestClose={() => setCountryListModal(false)}>
        <WrapperContainer>
          <CountryCodes
            List={countryData}
            twoItems={true}
            hideCode={true}
            onPress={item => {
              setResidenceCountry(item);
              setCountryCode(item?.dial_code);
              setCountryListModal(false);
            }}
            closeModal={() => setCountryListModal(false)}
          />
        </WrapperContainer>
      </Modal>
    </WrapperContainer>
  );
};;;;

export default RegisterNow;
