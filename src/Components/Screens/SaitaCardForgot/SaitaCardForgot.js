/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { forgetCardOtp, forgetOtpConfirm, forgetOtpSend, forgetPasswordConfirm, verifyForgotOtpCard, } from '../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../Singleton';
import { numberValidation, validatePassword } from '../../../Utils/Validation';
import { areaDimen, heightDimen } from '../../../Utils/themeUtils';
import { countryData } from '../../../countryCodes';
import { goBack, navigate } from '../../../navigationsService';
import { Colors, Fonts, Images } from '../../../theme';
import GradientButton from '../../common/GradientButton';
import TextInputWithLabel from '../../common/TextInputWithLabel';
import WraperContainer from '../../common/WraperContainer';
import { BasicButton, BorderLine, MainStatusBar, SimpleHeader, SimpleHeaderNew, Wrap } from '../../common/index';
import CountryCodes from '../CountryCodes/CountryCodes';
import Loader from '../Loader/Loader';
import styles from './SaitaCardForgotStyle';
let hasNotch = DeviceInfo.hasNotch();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
//test
// let routerAddressCards = "0xBd5EB4F64C5c9D87e1a33B08AD3FFf8D821da48E";
//main
let routerAddressCards = "0x12f939E4FB9d9ccd955a1793A39D87672649706f";
const routerDecimals = Constants.ismainnet ? 6 : 6;

const SaitaCardForgot = props => {
console.log("hasNotch",hasNotch);
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  const [email, setEmail] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [PinModal, setPinModal] = useState(false);
  const [Pin, setPin] = useState('');

  const [time, setTime] = React.useState(props.initialValue || 60);
  const timerRef = React.useRef(time);
  const [showTime, setshowTime] = useState(false);
  const [countryCode,setCountryCode]= useState('+91')
  const [countryListModal, setCountryListModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [oldNumber, setOldNumber] = useState(false);
  const [seconds, setSeconds] = useState(40);
  const [isActive, setIsActive] = useState(false);
  const [phoneMatchOtp, setPhoneMatchOtp] = useState('');
  const [status, setStatus] = useState(0);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

// console.log( 'MM','PinModal' , PinModal);
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

  // useEffect(() => {

  //   let focus = props.navigation.addListener('focus' , ()=>{
  //     console.log('focus' , isPinGenerated);
  //     if(isPinGenerated){
  //       setPinModal(true)
  //     }
  //   })
  //   let blur = props.navigation.addListener('blur' , ()=>{
  //     console.log('blur' , isPinGenerated);
  //     setPinModal(false)
  //   })

  //   return ()=>{
  //     console.log('unmount...');
  //     focus()
  //     blur()
  //   }


  // }, []);

  const proceedForgot = () => {
    if (email == "") {
      Singleton.showAlert('Email field is required.');
      return
    }
    if (Constants.EMAIL_REGEX.test(email) == false) {
      Singleton.showAlert("Please provide valid email.")
      return
    }

    setisLoading(true);
    let data = {
      email: email,
    };
    dispatch(forgetCardOtp({ data })).then(res => {
      setisLoading(false);
      //console.warn('MM',"proceedForgot res::::::::", res);
      if (res.status) {
        setshowTime(true)
        startTimer()
        setPin('');
        setPinModal(true)
      }

    }).catch(err => {
      //console.warn('MM',"proceedForgot eerrr:::::::::", err);
      setisLoading(false);
      Singleton.showAlert(err.message)
    });
  }

  const resendOtp = () => {

    setisLoading(true);
    let data = {
      email: email,
    };
    dispatch(forgetCardOtp({ data })).then(res => {
      setisLoading(false);
      //console.warn('MM',"resendOtp res::::::::", res);
      if (res.status) {
        setshowTime(true)
        startTimer()
      }

    }).catch(err => {
      //console.warn('MM',"resendOtp eerrr:::::::::", err);
      setisLoading(false);
      Singleton.showAlert(err.message)
    });
  }
  const verifyOtpCard = () => {
    if (Pin.length < 6) {
      Singleton.showAlert('Enter valid Pin.');
      return
    }
    setisLoading(true);
    let data = {
      email: email,
      otp: Pin,
      otp_type: "forget_pwd"
    };
    dispatch(verifyForgotOtpCard({ data })).then(res => {
      setisLoading(false);
      //console.warn('MM',"verifyOtpCard res::::::::", res);
      if (res.status) {
        setPinModal(false)
        let dataObjee = {
          email: email,
          otp: Pin,
        };
        // alert('ddddddwwww')
        navigate(NavigationStrings.SaitaCardChangePassword,{ dataObj: dataObjee })


      }

    }).catch(err => {
      //console.warn('MM',"verifyOtpCard eerrr:::::::::", err);
      setisLoading(false);
      Singleton.showAlert(err.message)
    });
  }


  const startTimer = () => {
    //console.warn('MM',"startTimer1111", timerRef);
    const timerId = setInterval(() => {
      //console.warn('MM',"startTimer222", timerRef);
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        //console.warn('MM',"startTimer333", timerRef);
        clearInterval(timerId);
        setTime(60)
        timerRef.current = 60
      }
      else {
        //console.warn('MM',"startTimer4444", timerRef);
        if (timerRef.current == 0) {
          //console.warn('MM',"startTimer5555", timerRef);
          setshowTime(false)
          setTime(60)
        }
        //console.warn('MM',"startTimer6666", timerRef);
        setTime(timerRef.current);
      }
    }, 1000);

  }

  const onPressPhoneOtpSend = () => {
    const fields = [
      {
        value: phoneNumber,
        message: 'Please enter your phone number',
        invalidMessage: 'Invalid phone number',
        validator: numberValidation,
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
    let data ={
      phone:`${countryCode}${phoneNumber}`
    }
    
    setisLoading(true);
    forgetOtpSend({data})
      .then(res => {
        console.log('res:::1',res);
        setOldNumber(phoneNumber);
        setisLoading(false);
        setSeconds(40);
        setPhoneMatchOtp(res?.data?.otp);
        setIsActive(true);
        setButtonDisable(false);
      })
      .catch(error => {
        Singleton.showAlert(error.message);
        setisLoading(false);
        setSeconds(0);
      });
  };

  const checkOtpStatus = () => {
    if (phoneOtp.length < 1) {
      Singleton.showAlert('Please enter otp');
      return;
    }
    if (Number(phoneOtp) !== Number(phoneMatchOtp)) {
      Singleton.showAlert('Please enter valid otp');
      return;
    }
    let data ={
      phone:`${countryCode}${phoneNumber}`,
      code:phoneOtp
    }
    
    setIsActive(false);
    setisLoading(true);
    forgetOtpConfirm({data})
      .then(res => {
        setisLoading(false);
        setButtonDisable(true);
        setStatus(1);
        setSeconds(0);
      })
      .catch(error => {
        Singleton.showAlert(error.message);
        setisLoading(false);
        setSeconds(0);
      });
  };
  const onPressSubmit = () => {
    const fields = [
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
    if (password !== confirmPassword) {
      Singleton.showAlert('Password and confirm password must match');
      return;
    }
    setisLoading(true);

    let data ={
      phone:`${countryCode}${phoneNumber}`,
      password: password,
    }
    forgetPasswordConfirm({data})
      .then(res => {
        console.log('res::::11', res);
        setisLoading(false);
        goBack()
      })
      .catch(error => {
        console.log('res::::11', error);
        setisLoading(false);
        Singleton.showAlert(error.message);
      });
  };

  if(PinModal){
    return (
      <Wrap
      style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <SimpleHeader
        back={false}
        backPressed={() => {
          setPinModal(false)
          // Singleton.getInstance().isOtpModal = false;
        }}
        title={LanguageManager.otp}

      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
      />
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: Fonts.semibold,
            color: ThemeManager.colors.textColor,
          }}>
          {LanguageManager.otptext}
        </Text>
      </View>
      <View style={{ alignItems: 'center', marginTop: 20, flex: 1, }}>
        <SmoothPinCodeInput
          autoFocus={true}
          cellSize={42}
          codeLength={6}
          cellStyleFocused={{ borderColor: ThemeManager.colors.textColor, }}
          cellStyle={[styles.cellStyle, { borderColor: ThemeManager.colors.inputBoxColor },]}
          textStyle={[styles.inputText, { color: ThemeManager.colors.textColor },]}
          value={Pin}
          onTextChange={text => {
            if (Constants.NUMBER_ONLY_REGEX.test(text)) {
              setPin(text);

            }
          }}
        />



        {showTime == false && <TouchableOpacity
          onPress={() => {
            resendOtp();
          }}>
          <Text
            style={[
              styles.numbertitleStyle,
              { color: Colors.red_dark },
            ]}>
            {' '}
            Resend Code
          </Text>
        </TouchableOpacity>}
        {showTime && <View
        >
          <Text
            style={[
              styles.numbertitleStyle,
              { color: Colors.red_dark },
            ]}>
            {' '}
            {`00:${time}`}
          </Text>
        </View>}



      </View>

      <View style={{ alignItems: 'center' }}>
        <BasicButton
          btnStyle={{
            marginVertical: 20,
            height:heightDimen(60),
            width: '84%',
            borderRadius: areaDimen(100),
          }}
          onPress={() => verifyOtpCard()}
          customGradient={{ borderRadius: 12, height: heightDimen(60),borderRadius: areaDimen(100) }}
          text={LanguageManager.proceed}
          textStyle={{ fontSize: 16, fontFamily: Fonts.semibold }}
        />
      </View>
      {isLoading && <Loader />}
    </Wrap>
    )
  }

  return (
    <WraperContainer>
        {/* <KeyboardAwareScrollView style={{ height: windowHeight }} showsVerticalScrollIndicator={false} enableOnAndroid={true} keyboardShouldPersistTaps={'always'} bounces={false}> */}

            <MainStatusBar
              backgroundColor={ThemeManager.colors.backgroundColor}
              barStyle={
                ThemeManager.colors.themeColor === 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
            />

            {/* <Text style={[styles.lablePrefLang, { color: ThemeManager.colors.lightTextColor },]}>Visual form of a document or a typeface{'\n'} without relying on meaningful content. </Text> */}
            <SimpleHeaderNew
              title={LanguageManager.forgot}
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
            <KeyboardAwareScrollView
              automaticallyAdjustKeyboardInsets={true}
              enableOnAndroid={true}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginHorizontal: 25,
                  flex: 1,
                }}>
                {/* <BasicInputBox
                titleStyle={{ color: ThemeManager.colors.textColor, fontSize: 13, fontFamily: Fonts.semibold }}
                title={LanguageManager.emailid}
                width="100%"
                maxLength={64}
                mainStyle={{ borderColor: ThemeManager.colors.inputBoxColor }}
                keyboardType={Platform.OS == 'ios' ? "ascii-capable": "visible-password"}
                onChangeText={text =>{
                  if(text)
                  text = text?.trim()
                  setEmail(text)}}
                placeholder={LanguageManager.enterhere}></BasicInputBox> */}
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
                      onPress={() => setCountryListModal(true)}>
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
                <TouchableOpacity
                  disabled={status == 1 ? true : false}
                  style={styles.sendcodeView}
                  onPress={onPressPhoneOtpSend}>
                  <Text
                    style={[
                      styles.codeTextStyle,
                      {color: Colors.buttonColor1},
                    ]}>
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
                {status == 1 && (
                  <TextInputWithLabel
                    label={LanguageManager.password}
                    placeHolder={LanguageManager.enterPassword}
                    value={password}
                    onChangeText={text => {
                      setPassword(text.trimStart());
                    }}
                    labelStyle={{marginTop: areaDimen(16)}}
                    onPressRightIcon={() => setShowPassword(!showPassword)}
                    rightIcon={
                      !!showPassword ? Images.eyeOpened : Images.eyeClosed
                    }
                    secureTextEntry={!showPassword}
                    editable={true}
                  />
                )}
                {status == 1 && (
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
                      !!showConfirmPassword
                        ? Images.eyeOpened
                        : Images.eyeClosed
                    }
                    secureTextEntry={!showConfirmPassword}
                    editable={true}
                  />
                )}
              </View>
              
            </KeyboardAwareScrollView>
            <GradientButton
              title={
                status == 0 ? LanguageManager.verifyOtp : LanguageManager.submit
              }
              disabled={buttonDisable}
              buttonStyle={styles.buttonView}
              buttonColor={
                !!buttonDisable
                  ? [
                      ThemeManager.colors.lightGrey,
                      ThemeManager.colors.lightGrey,
                    ]
                  : []
              }
              onPress={() => {
                !!phoneMatchOtp && status == 0
                  ? checkOtpStatus()
                  : onPressSubmit();
              }}
            />
            {/* <BasicButton
              onPress={() => proceedForgot()}
              btnStyle={[
                styles.btnStyle,
                {
                  marginBottom:
                    Platform.OS == 'ios' ? (hasNotch ? 80 : 20) : 20,
                },
              ]}
              customGradient={[styles.customGrad]}
              text="Submit"
            /> */}
            
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
                setCountryCode(item?.dial_code);
                setCountryListModal(false);
              }}
              closeModal={() => setCountryListModal(false)}
            />
          </WraperContainer>
        </Modal>
        {isLoading && <Loader />}

        {/* </KeyboardAwareScrollView> */}
        {/* *********************************************************** MODAL FOR PIN ********************************************************************** */}
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={PinModal}
          onRequestClose={() => {
            setPinModal(false)
            // Singleton.getInstance().isOtpModal = false;
          }
          }
          >
          <Wrap
            style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
            <SimpleHeader
              back={false}
              backPressed={() => {
                setPinModal(false)
                // Singleton.getInstance().isOtpModal = false;
              }}
              title={LanguageManager.otp}

            />
            <BorderLine
              borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
            />
            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: Fonts.semibold,
                  color: ThemeManager.colors.textColor,
                }}>
                {LanguageManager.otptext}
              </Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20, flex: 1, }}>
              <SmoothPinCodeInput
                autoFocus={true}
                cellSize={42}
                codeLength={6}
                cellStyleFocused={{ borderColor: ThemeManager.colors.textColor, }}
                cellStyle={[styles.cellStyle, { borderColor: ThemeManager.colors.inputBoxColor },]}
                textStyle={[styles.inputText, { color: ThemeManager.colors.textColor },]}
                value={Pin}
                onTextChange={text => {
                  if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                    setPin(text);

                  }
                }}
              />



              {showTime == false && <TouchableOpacity
                onPress={() => {
                  resendOtp();
                }}>
                <Text
                  style={[
                    styles.numbertitleStyle,
                    { color: Colors.red_dark },
                  ]}>
                  {' '}
                  Resend Code
                </Text>
              </TouchableOpacity>}
              {showTime && <View
              >
                <Text
                  style={[
                    styles.numbertitleStyle,
                    { color: Colors.red_dark },
                  ]}>
                  {' '}
                  {`00:${time}`}
                </Text>
              </View>}



            </View>

            <View style={{ alignItems: 'center' }}>
              <BasicButton
                btnStyle={{
                  marginVertical: 20,
                  height: 50,
                  width: '84%',
                  borderRadius: 10,
                }}
                onPress={() => verifyOtpCard()}
                customGradient={{ borderRadius: 12, height: 50, }}
                text={LanguageManager.proceed}
                textStyle={{ fontSize: 16, fontFamily: Fonts.semibold }}
              />
            </View>
          </Wrap>
          {isLoading && <Loader />}
        </Modal> */}
    </WraperContainer>
  );
};

export default SaitaCardForgot;
