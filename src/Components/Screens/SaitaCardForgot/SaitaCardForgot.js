/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Linking, Dimensions, Modal, ImageBackground, SafeAreaView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { MainStatusBar, BasicButton, Header, Wrap, CheckBox, ImageBackgroundComponent, BasicInputBox, SimpleHeader, SimpleHeaderNew, BorderLine } from '../../common/index';
import styles from './SaitaCardForgotStyle';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import { Fonts, Images, Colors } from '../../../theme';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import * as Constants from '../../../Constant';
import { useDispatch } from 'react-redux';
import Loader from '../Loader/Loader';
import { forgetCardOtp, verifyForgotOtpCard, } from '../../../Redux/Actions/SaitaCardAction'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
let hasNotch = DeviceInfo.hasNotch();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
//test
// let routerAddressCards = "0xBd5EB4F64C5c9D87e1a33B08AD3FFf8D821da48E";
//main
let routerAddressCards = "0x12f939E4FB9d9ccd955a1793A39D87672649706f";
const routerDecimals = Constants.ismainnet ? 6 : 6;
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { areaDimen, heightDimen } from '../../../Utils/themeUtils';

const SaitaCardForgot = props => {
console.log("hasNotch",hasNotch);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [PinModal, setPinModal] = useState(false);
  const [Pin, setPin] = useState('');

  const [time, setTime] = React.useState(props.initialValue || 60);
  const timerRef = React.useRef(time);
  const [showTime, setshowTime] = useState(false);
// console.log( 'MM','PinModal' , PinModal);


  // useEffect(() => {

  //   let focus = props.navigation.addListener('didFocus' , ()=>{
  //     console.log('didFocus' , isPinGenerated);
  //     if(isPinGenerated){
  //       setPinModal(true)
  //     }
  //   })
  //   let blur = props.navigation.addListener('didBlur' , ()=>{
  //     console.log('didBlur' , isPinGenerated);
  //     setPinModal(false)
  //   })

  //   return ()=>{
  //     console.log('unmount...');
  //     focus?.remove()
  //     blur?.remove()
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
        Actions.SaitaCardChangePassword({ dataObj: dataObjee })


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
    <SafeAreaView style={{flex:1, backgroundColor: ThemeManager.colors.bg }}>
      <Wrap style={{ backgroundColor: ThemeManager.colors.bg  , }}>
      {/* <KeyboardAwareScrollView style={{ height: windowHeight }} showsVerticalScrollIndicator={false} enableOnAndroid={true} keyboardShouldPersistTaps={'always'} bounces={false}> */}

        <View style={{ height: windowHeight }}>
          <View style={styles.container}>
            <MainStatusBar
              backgroundColor={ThemeManager.colors.backgroundColor}
              barStyle={ThemeManager.colors.themeColor === 'light' ? 'dark-content' : 'light-content'} />

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
            <BorderLine borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor}}/>
            <View style={{ justifyContent: 'flex-start', marginTop: 20, marginHorizontal: 25,flex:1 }}>
              <BasicInputBox
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
                placeholder={LanguageManager.enterhere}></BasicInputBox>
             
            </View>

            <BasicButton
                onPress={() => proceedForgot()}
                btnStyle={[styles.btnStyle,{marginBottom:Platform.OS=='ios'?hasNotch?80:20:20}]}
                customGradient={[styles.customGrad,]}
                text="Submit"
              />
          </View>
        </View>
       

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
    </Wrap>
    </SafeAreaView>

  );
};

export default SaitaCardForgot;
