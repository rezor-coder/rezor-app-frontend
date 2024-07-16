import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { confirmPhoneOtp, registerEmailAdded, resendPhoneOtp, sendPhoneOtp } from '../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../Singleton';
import { numberValidation, validatePassword } from '../../../Utils/Validation';
import { areaDimen } from '../../../Utils/themeUtils';
import { countryData } from '../../../countryCodes';
import { navigate } from '../../../navigationsService';
import { Colors, Images } from '../../../theme';
import { validateEmail } from '../../../utils';
import { SimpleHeader } from '../../common';
import GradientButton from '../../common/GradientButton';
import TextInputWithLabel from '../../common/TextInputWithLabel';
import WraperContainer from '../../common/WraperContainer';
import CountryCodes from '../CountryCodes/CountryCodes';
import styles from './styles';

const RegisterNow = ({navigation}) => {
  const intervalRef = useRef(null);

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
  const [token, setToken] = useState('');
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
      Singleton.showAlert('Enter Your Residence Country');
      return;
    }
    const fields = [
      {
        value: phoneNumber,
        message: 'Please enter your phone number',
        invalidMessage: 'Invalid phone number',
        validator: numberValidation,
      },
      {
        value: password,
        message: 'Please enter your password',
        invalidMessage:
          'Password must include uppercase, lowercase, numeric, and special character',
        validator: validatePassword,
      },
      {
        value: confirmPassword,
        message: 'Please confirm your password',
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
      Singleton.showAlert('Password and confirm password must match');
      return;
    }
    setIsLoading(true);
    let data = {
      phone: `${residenceCountry?.dial_code}${phoneNumber}`,
      password: password,
    };
    sendPhoneOtp({data})
      .then(res => {
        setOldNumber(phoneNumber);
        setIsLoading(false);
        setSeconds(40);
        setPhoneMatchOtp(res?.otp);
        setIsActive(true);
        setButtonDisable(false);
      })
      .catch(error => {
        Singleton.showAlert(error.message);
        setIsLoading(false);
        setSeconds(0);
      });
  };
  // -------------------------------------------------------------------

  const checkOtpStatus = () => {
    if (phoneOtp.length < 1) {
      Singleton.showAlert('Please enter otp');
      return;
    }
    if (Number(phoneOtp) !== Number(phoneMatchOtp)) {
      Singleton.showAlert('Please enter valid otp');
      return;
    }
    let data = {
      phone: `${residenceCountry?.dial_code}${phoneNumber}`,
      smsCode: Number(phoneOtp),
    };
    setIsActive(false);
    setIsLoading(true);
    confirmPhoneOtp({data})
      .then(res => {
        setToken(res.data?.access_token);
        setIsLoading(false);
        setButtonDisable(true);
        setStatus(1);
        setSeconds(0);
      })
      .catch(error => {
        Singleton.showAlert(error.message);
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
    setIsLoading(true);

    resendPhoneOtp({data})
      .then(res => {
        setIsLoading(false);
        setSeconds(40);
        setPhoneMatchOtp(res?.otp);
        setIsActive(true);
        setButtonDisable(false);
      })
      .catch(error => {
        Singleton.showAlert(error.message);
        setIsLoading(false);
      });
  };
  // -------------------------------------------------------------------

  const onPressSend = () => {
    // Validate if email is empty
    if (email.length < 1) {
      Singleton.showAlert('Please enter email');
      return;
    }
    // Validate email format
    if (!validateEmail(email)) {
      Singleton.showAlert('Invalid email format');
      return;
    }
    setIsLoading(true);
    let data = {
      email: email,
    };
    registerEmailAdded({data, token})
      .then(res => {
        console.log(res, 'resresresresres');
        setIsLoading(false);
        setEmailMatchOtp(true);
        setButtonDisable(false);
      })
      .catch(error => {
        Singleton.showAlert(error.message);
        setIsLoading(false);
      });
  };

  // -------------------------------------------------------------------

  const onPressSignUp = () => {
    // if (emailOtp.length < 1) {
    //   Singleton.showAlert('Please enter otp');
    //   return;
    // }
    // if (emailOtp !== emailMatchOtp) {
    //   Singleton.showAlert('Please enter valid otp');
    //   return;
    // }
    setStatus(2);
    let userData = {
      phone: phoneNumber,
      email: email,
      dial_code: residenceCountry?.dial_code,
      country_code: residenceCountry?.code,
      access_token: token,
    };
    navigate(NavigationStrings.UserDetail,{userData});
  };

  return (
    <WraperContainer isLoading={isLoading}>
      <SimpleHeader
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          navigation.goBack();
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
            {LanguageManager.createAnAccount}
          </Text>
          {/* <TextInputWithLabel
            label={LanguageManager.residenceCountry}
            placeHolder={`${LanguageManager.enterYour} ${LanguageManager.residenceCountry}`}
            value={residenceCountry?.name}
            labelStyle={{marginTop: areaDimen(16)}}
            rightIcon={Images.dropIconDownDark}
            rightIconStyle={styles.iconStyle}
            tintColor={ThemeManager.colors.dotLine}
            editable={false}
            onPress={() =>
              status == 0
                ? setCountryListModal(true)
                : setCountryListModal(false)
            }
          /> */}
          <TextInputWithLabel
            label={LanguageManager.phone}
            placeHolder={`${LanguageManager.enterYour} ${LanguageManager.phoneNo}`}
            value={phoneNumber}
            keyboardType={'numeric'}
            onChangeText={text => {
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
            <Text style={[styles.codeTextStyle, {color: Colors.buttonColor1}]}>
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
              maxLength={6}
              onChangeText={text => setPhoneOtp(text)}
              labelStyle={{marginTop: areaDimen(16)}}
              editable={status == 0 ? true : false}
            />
          ) : null}
          {status == 1 || status == 2 ? (
            <TextInputWithLabel
              label={'Email'}
              placeHolder={`${LanguageManager.enterYourEmail}`}
              value={email}
              onChangeText={text => setEmail(text)}
              labelStyle={{marginTop: areaDimen(16)}}
              editable={status == 1 ? true : false}
            />
          ) : null}
          {status == 1 || status == 2 ? (
            <TouchableOpacity style={styles.sendcodeView} onPress={onPressSend}>
              <Text
                style={[styles.codeTextStyle, {color: Colors.buttonColor1}]}>
                {LanguageManager.sendOtp}
              </Text>
            </TouchableOpacity>
          ) : null}
          {!!emailMatchOtp ? (
            <TextInputWithLabel
              label={LanguageManager.enterOtp}
              placeHolder={LanguageManager.enterOtp}
              value={emailOtp}
              keyboardType={'numeric'}
              maxLength={6}
              onChangeText={text => setEmailOtp(text)}
              labelStyle={{marginTop: areaDimen(16)}}
            />
          ) : null}
        </View>
      </KeyboardAwareScrollView>
      <GradientButton
        title={status == 0 ? LanguageManager.verifyOtp : LanguageManager.signUp}
        disabled={buttonDisable}
        buttonStyle={styles.buttonView}
        buttonColor={
          !!buttonDisable
            ? [ThemeManager.colors.lightGrey, ThemeManager.colors.lightGrey]
            : []
        }
        onPress={() => {
          !!phoneMatchOtp && status == 0 ? checkOtpStatus() : onPressSignUp();
        }}
      />
      <TouchableOpacity activeOpacity={1} onPress={() => goBack()}>
        <Text
          style={[styles.registerText, {color: ThemeManager.colors.textColor}]}>
          Already have an account?{' '}
          <Text style={{color: Colors.buttonColor1}}>LogIn</Text>
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={countryListModal}
        onRequestClose={() => setCountryListModal(false)}>
        <WraperContainer>
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
        </WraperContainer>
      </Modal>
    </WraperContainer>
  );
};;;;

export default RegisterNow;
