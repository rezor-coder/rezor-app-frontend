import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { APIClient } from '../../../Api';
import * as Constants from '../../../Constant';
import { API_CARD_PHYSICAL_FORM } from '../../../Endpoints';
import { sendOtpCard, sendOtpCardMobile } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { countryData, countryWholeData } from '../../../countryCodes';
import { Colors, Images } from '../../../theme';
import fonts from '../../../theme/Fonts';
import {
  BasicButton,
  BasicInputBox,
  BasicInputBoxSelect,
  SimpleHeader,
  Wrap,
} from '../../common';
import CountryCodes from '../CountryCodes/CountryCodes';
import CountryWholeCurrency from '../CountryWholeCurrency/CountryWholeCurrency';
import Loader from '../Loader/Loader';
import { goBack } from '../../../navigationsService';
let DocumentList = [
  {
    title: 'Passport',
    id: 1,
  },
];
const ImgaeBelowText = ({text}) => {
  return (
    <View style={{flexDirection: 'row', marginTop: 5}}>
      <Image
        source={Images.tickWhite}
        style={{
          height: 12,
          width: 12,
          marginTop: 3,
          tintColor: ThemeManager.colors.lightTextColor,
        }}
      />
      <Text
        style={{
          color: ThemeManager.colors.lightTextColor,
          fontSize: 13,
          fontFamily: fonts.regular,
          lineHeight: 21,
          marginLeft: 9,
        }}>
        {text}
      </Text>
    </View>
  );
};
const SaitaCardApplyPhysicalCard = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countrycode, setCountryCode] = useState('+91');
  const [countrycode1, setCountryCode1] = useState('+91');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [emailOTP, setemailOTP] = useState('')
  const [countryListModal, setCountryListModal] = useState(false);
  const { selectedItem , cardDetails , userDetail } = props

  const [mobile, setmobile] = useState('');
  const [mobile1, setmobile1] = useState('');
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [gender, setGender] = useState('male');
  const [country, setCountry] = useState('India');
  const [currency, setcurrency] = useState('USD');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [postcode, setPostCode] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [countryModal, setCountryModal] = useState(false);
  const [countryModal1, setCountryModal1] = useState(false);
  const [time, setTime] = useState(60);
  const timerRef = useRef(time);
  const [showTime, setshowTime] = useState(false);

  const [timeEmail, setTimeEmail] = useState(60);
  const timerEmailRef = useRef(timeEmail);
  const [showTimeEmail, setshowTimeEmail] = useState(false);
 const [isOTPSended, setisOTPSended] = useState({mobile:false , email:false})

 const dispatch = useDispatch()

  useEffect(() => {
    
    console.log(props);
    // setFirstName(userDetail)
    setFirstName(userDetail?.first_name);
    setLastName(userDetail?.last_name);
    setCountryCode('+' + (userDetail?.country_code || '91'));
    setCountryCode1('+' + (userDetail?.country_code || '91'));
    setmobile(userDetail?.mobile_no);
    setmobile1(userDetail?.mobile_no);
 
    setCountry(userDetail?.country);
    setPostCode(userDetail?.zip_code);
    setEmail(userDetail?.email);


  
  }, [])
  


  const submit = async () => { 


    // if(!isOTPSended.mobile){
    //   Singleton.showAlert('Mobile OTP verification is required');
    //   return;
    // }
    // else if(phoneOTP.length != 6) {
    //   Singleton.showAlert('Please enter mobile OTP');
    //   return;
    // }
    // if(!isOTPSended.email){
    //   Singleton.showAlert('Email OTP verification is required');
    //   return;
    // }
    // else if(emailOTP.length != 6) {
    //   Singleton.showAlert('Please enter email OTP');
    //   return;
    // }
    if (firstName.trim() == '') {
      Singleton.showAlert('First Name field is required');
      return;
    }
    if (firstName.length < 3) {
      Singleton.showAlert('Name field must be greater than 3 characters');
      return;
    }
    if (lastName.trim() == '') {
      Singleton.showAlert('Last Name field is required');
      return;
    }


   if (mobile.trim() == '') {
    Singleton.showAlert('Phone Number field is required');
    return;
  } else if (mobile.length < 8) {
    Singleton.showAlert('Phone number should be between 8-12 numbers');
    return;
  } else if (mobile.length > 12) {
    Singleton.showAlert('Phone number should be between 8-12 numbers');
    return;
  }
   if (mobile1.trim() == '') {
    Singleton.showAlert('Confirm Phone Number field is required');
    return;
  } else if (mobile1.length < 8) {
    Singleton.showAlert('Confirm Phone number should be between 8-12 numbers');
    return;
  } else if (mobile1.length > 12) {
    Singleton.showAlert('Confirm Phone number should be between 8-12 numbers');
    return;
  }

  else if (countrycode != countrycode1 || mobile != mobile1){
    Singleton.showAlert('Phone number mismatched');
    return;
  }
   else if (province.length < 5) {
    Singleton.showAlert(
      'Province field must be greater than 5 characters.',
    );
    return;
  }
  else if (city.trim() == '') {
    Singleton.showAlert('City field is required');
    return;
  }else if (street.length < 5) {
    Singleton.showAlert(
      'Street Address field must be greater than 5 characters.',
    );
    return;
  }else if (postcode.trim() == '') {
    Singleton.showAlert('PostCode field is required');
    return;
  }
  // else if (state.trim() == '') {
  //   Singleton.showAlert('State field is required');
  //   return;
  // } else if (country.trim() == '') {
  //   Singleton.showAlert('Country field is required');
  //   return;
  // } else if (zipcode.trim() == '') {
  //   Singleton.showAlert('Zip Code field is required');
  //   return;
  // }



  let test = {
    "first_name":"Abhishek",
    "last_name":"wwww",
    "country_code":"91",
    "mobile_number" : "9876543211",
    "mobile_otp": "1",
    "email" : "mailto:abhi@yopmail.com",
    "email_otp": "1",
    "gender" : 1,
    "country" : "tre",
    "province":"erer",
    "city":"eerer",
    "street_address":"eerre",
    "post_code":"gegeeeg",
    "currency":"usd",
    "card_users_table_id" : 210
}
try {

let data = {
  "first_name":firstName?.trim(),
    "last_name":lastName?.trim(),
    "country_code":countrycode.replace('+',''),
    "mobile_number" : mobile,
    // "mobile_otp": phoneOTP,
    "email" : email,
    // "email_otp": emailOTP,
    // "gender" : gender == 'male' ? 1 : 2,
    "country" : country,
    "province":province?.trim(),
    "city":city?.trim(),
    "street_address":street?.trim(),
    "post_code":postcode?.trim(),
    "currency":currency,
    confirmed_country_code:countrycode1.replace('+',''),
    confirmed_mobile_number:mobile
    // "card_users_table_id" : 210
}

  console.log('req' , data);
  
  setisLoading(true)
  let token = await Singleton.getInstance().newGetData(Constants.access_token_cards)
  let res = await APIClient.getInstance().postTokenCards(API_CARD_PHYSICAL_FORM , data , token)
  console.log(res)
  setisLoading(false)
  Singleton.showAlert(res?.message || 'Your application is in review')
  goBack()
} catch (error) {
  setisLoading(false)
  console.log(error);
  Singleton.showAlert(error?.message || 'Unable to save details , please try again later')
}



}





  const sendOTPMobile = () => {

    if (mobile.trim() == '') {
      Singleton.showAlert('Phone Number field is required');
      return;
    } else if (mobile.length < 8) {
      Singleton.showAlert('Phone number should be between 8-12 numbers');
      return;
    } else if (mobile.length > 12) {
      Singleton.showAlert('Phone number should be between 8-12 numbers');
      return;
    }
    

    setisLoading(true);

    let data = {
      mobile: mobile,
      country_code: countrycode.replace('+', ''),
      card_category: selectedItem?.card_type?.toUpperCase()
    };
    dispatch(sendOtpCardMobile({data}))
      .then(res => {
        setisLoading(false);
        console.warn('MM', '>>>>>>', res);
        if (res.status) {
            setisOTPSended({...isOTPSended , mobile:true})
            setshowTime(true);
            startTimerMobile();
            setPhoneOTP('')

        } else {
          setisLoading(false);
          Singleton.showAlert(res.message);
        }
      })
      .catch(err => {
        console.warn('MM', err);
        setisLoading(false);
        Singleton.showAlert(err.message);
       
      });
  };
  const sendOTPEmail = () => {

    setisLoading(true);

    let data = {
      email: email,
      card_category: selectedItem?.card_type?.toUpperCase()
    };
    dispatch(sendOtpCard({data}))
      .then(res => {
        setisLoading(false);
        console.warn('MM', '>>>>>>', res);
        if (res.status) {
          setisOTPSended({...isOTPSended , email:true})
            setshowTimeEmail(true);
            startTimerEmail()
            setemailOTP('')

        } else {
          setisLoading(false);
          Singleton.showAlert(res.message);
        }
      })
      .catch(err => {
        console.warn('MM', err);
        setisLoading(false);
        Singleton.showAlert(err.message);
       
      });
  };
  const startTimerMobile = () => {

    const timerId = setInterval(() => {

      timerRef.current -= 1;
      if (timerRef.current < 0) {

        clearInterval(timerId);
        timerRef.current = 60;
        
      } else {

        if (timerRef.current == 0) {

          setshowTime(false);
          setTime(60);
        }
        setTime(timerRef.current);
      }
      console.warn('MM', 'startTimer6666', timerRef);
    }, 1000);
    
  };
  
  const startTimerEmail = () => {

    const timerId = setInterval(() => {

      timerEmailRef.current -= 1;
      if (timerEmailRef.current < 0) {

        clearInterval(timerId);
        timerEmailRef.current = 60;
        
      } else {

        if (timerEmailRef.current == 0) {

          setshowTimeEmail(false);
          setTimeEmail(60);
        }
        setTimeEmail(timerEmailRef.current);
      }
      console.warn('MM', 'startTimer6666', timerEmailRef);
    }, 1000);
  };

  return (
    <>
      <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
        <SimpleHeader
          back={false}
          backPressed={() => {
            goBack();
          }}
          title={'Physical Card Application'}
        />
        <KeyboardAwareScrollView style={{padding: 20, paddingBottom: 40}}>
          <View style={{flex: 1, marginBottom: 60}}>
            <BasicInputBox
              // editable={false}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={LanguageManager.firstName}
              maxLength={20}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              width="100%"
              text={firstName}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX_WITH_SPACE.test(text)) {
                  setFirstName(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicInputBox
              // editable={false}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={LanguageManager.lastName}
              maxLength={20}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              width="100%"
              text={lastName}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX_WITH_SPACE.test(text)) {
                  setLastName(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            {/* <BasicInputBox
              editable={true}
              phoneCode={'+91'}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              coinName='Get OTP  '
              coinStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.regular,
              }}
              title={LanguageManager.phoneNumber}
              maxLength={20}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              width="100%"
              text={mobile}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX.test(text)) {
                  setmobile(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox> */}
            <BasicInputBoxSelect
              disabled={false}
              pressPhone={() => setCountryModal(true)}
              countrycode={countrycode}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={LanguageManager.phoneNumber}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              keyboardType="number-pad"
              onChangeText={text => {
                if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                  setmobile(text);
                }
              }}
              // editable={false}
              text={mobile}
              maxLength={15}
              width={'60%'}
              // right={
              //   <TouchableOpacity
              //   onPress={()=>{
              //     !showTime && sendOTPMobile()
                 
              //   }}
              //     style={{
              //       flex: 1,
              //       alignItems: 'flex-end',
              //     }}>
              //     <Text
              //       style={{
              //         color: Colors.buttonColor5,
              //         fontFamily: Fonts.semibold,
              //         fontSize: 13,
              //       }}>
              //        { showTime ? `00: ${timerRef.current}` : isOTPSended.mobile ? 'Resend' : "Get OTP"}{'    '}
              //     </Text>
              //   </TouchableOpacity>
              // }
              placeholder={LanguageManager.enterhere}></BasicInputBoxSelect>
            <BasicInputBoxSelect
              disabled={false}
              pressPhone={() => setCountryModal1(true)}
              countrycode={countrycode1}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={'Confirm Phone Number'}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              keyboardType="number-pad"
              onChangeText={text => {
                if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                  setmobile1(text);
                }
              }}
              // editable={false}
              text={mobile1}
              maxLength={15}
              width={'60%'}
              // right={
              //   <TouchableOpacity
              //   onPress={()=>{
              //     !showTime && sendOTPMobile()
                 
              //   }}
              //     style={{
              //       flex: 1,
              //       alignItems: 'flex-end',
              //     }}>
              //     <Text
              //       style={{
              //         color: Colors.buttonColor5,
              //         fontFamily: Fonts.semibold,
              //         fontSize: 13,
              //       }}>
              //        { showTime ? `00: ${timerRef.current}` : isOTPSended.mobile ? 'Resend' : "Get OTP"}{'    '}
              //     </Text>
              //   </TouchableOpacity>
              // }
              placeholder={LanguageManager.enterhere}></BasicInputBoxSelect>
            {/* <View style={{marginTop: 20}}>
              <View
                style={[
                  {
                    alignSelf: 'flex-start',
                    marginHorizontal: 10,
                    marginBottom: 10,
                  },
                ]}>
                <Text
                  style={[
                    {color: ThemeManager.colors.textColor, left: 0},
                    {
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    },
                  ]}>
                  {'Enter Code'}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <SmoothPinCodeInput
                  autoFocus={false}
                  password
                  mask="﹡"
                  // cellSize={Dimensions.get('window').width / 7}
                  codeLength={6}
                  cellStyleFocused={{
                    borderColor: ThemeManager.colors.textColor,
                  }}
                  containerStyle={{}}
                  cellStyle={[
                    {
                      borderWidth: 1,
                      borderRadius: 8,
                      marginLeft: 5,
                      marginRight: 5,
                    },
                    {borderColor: ThemeManager.colors.inputBoxColor},
                  ]}
                  textStyle={[
                    {
                      fontSize: 20,
                      color: '#fff',
                    },
                    {color: ThemeManager.colors.textColor},
                  ]}
                  value={phoneOTP}
                  onTextChange={text => {
                    if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                      setPhoneOTP(text);
                    }
                  }}
                />
              </View>
            </View> */}
            <BasicInputBox
             
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={LanguageManager.emailid}
              // maxLength={20}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              width="100%"
              // coinName={ showTimeEmail ? `00:${timerEmailRef.current}` : isOTPSended.email ? 'Resend  ' : "Get OTP  "}
              // pressMax={()=>{
              //   !showTimeEmail &&  sendOTPEmail()
              // }}
              text={email}
              editable={false}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX.test(text)) {
                  setEmail(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            {/* <View style={{marginTop: 20}}>
              <View
                style={[
                  {
                    alignSelf: 'flex-start',
                    marginHorizontal: 10,
                    marginBottom: 10,
                  },
                ]}>
                <Text
                  style={[
                    {color: ThemeManager.colors.textColor, left: 0},
                    {
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    },
                  ]}>
                  {'Enter Code'}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <SmoothPinCodeInput
                  autoFocus={false}
                  password
                  mask="﹡"
                  // cellSize={Dimensions.get('window').width / 7}
                  codeLength={6}
                  cellStyleFocused={{
                    borderColor: ThemeManager.colors.textColor,
                  }}
                  containerStyle={{}}
                  cellStyle={[
                    {
                      borderWidth: 1,
                      borderRadius: 8,
                      marginLeft: 5,
                      marginRight: 5,
                    },
                    {borderColor: ThemeManager.colors.inputBoxColor},
                  ]}
                  textStyle={[
                    {
                      fontSize: 20,
                      color: '#fff',
                    },
                    {color: ThemeManager.colors.textColor},
                  ]}
                  value={emailCode}
                  onTextChange={text => {
                    if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                      setEmailCode(text);
                    }
                  }}
                />
              </View>
            </View> */}
            {/* <View style={{marginTop: 20}}>
              <View
                style={[
                  {
                    alignSelf: 'flex-start',
                    marginHorizontal: 10,
                    marginBottom: 10,
                  },
                ]}>
                <Text
                  style={[
                    {color: ThemeManager.colors.textColor, left: 0},
                    {
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    },
                  ]}>
                  {'Gender'}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginHorizontal: 10}}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setGender('male');
                  }}>
                  {gender == 'male' ? (
                    <LinearGradient
                      colors={[
                        Colors.buttonColor1,
                        Colors.buttonColor2,
                        Colors.buttonColor3,
                        Colors.buttonColor4,
                      ]}
                      style={styles.genderButtonContainer}>
                      <Image
                        source={Images.male}
                        style={[styles.genderImage, {tintColor: 'white'}]}
                        tintColor={'white'}
                      />
                      <Text style={styles.genderText}>Male</Text>
                    </LinearGradient>
                  ) : (
                    <View
                      style={[
                        styles.genderButtonContainer,
                        {borderWidth: 1, borderColor: Colors.languageItem},
                      ]}>
                      <Image
                        source={Images.male}
                        style={[
                          styles.genderImage,
                          {tintColor: Colors.languageItem},
                        ]}
                        tintColor={Colors.languageItem}
                      />
                      <Text
                        style={[
                          styles.genderText,
                          {color: Colors.languageItem},
                        ]}>
                        Male
                      </Text>
                    </View>
                  )}
                </TouchableWithoutFeedback>
                <View style={{flex: 0.1}} />
                <TouchableWithoutFeedback
                  onPress={() => {
                    setGender('female');
                  }}>
                  {gender == 'female' ? (
                    <LinearGradient
                      colors={[
                        Colors.buttonColor1,
                        Colors.buttonColor2,
                        Colors.buttonColor3,
                        Colors.buttonColor4,
                      ]}
                      style={styles.genderButtonContainer}>
                      <Image
                        source={Images.female}
                        style={[styles.genderImage, {tintColor: 'white'}]}
                      />
                      <Text style={styles.genderText}>Female</Text>
                    </LinearGradient>
                  ) : (
                    <View
                      style={[
                        styles.genderButtonContainer,
                        {borderWidth: 1, borderColor: Colors.languageItem},
                      ]}>
                      <Image
                        source={Images.female}
                        style={[
                          styles.genderImage,
                          {tintColor: Colors.languageItem},
                        ]}
                        tintColor={Colors.languageItem}
                      />
                      <Text
                        style={[
                          styles.genderText,
                          {color: Colors.languageItem},
                        ]}>
                        Female
                      </Text>
                    </View>
                  )}
                </TouchableWithoutFeedback>
              </View>
            </View> */}
            {/* <BasicInputBox
              editable={false}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={'Country'}
              maxLength={20}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              width="100%"
              text={country}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX.test(text)) {
                  setCountry(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox> */}
            <View style={{marginTop: 5}}>
              <BasicInputBox
                editable={true}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: fonts.semibold,
                }}
                title={LanguageManager.country}
                mainContainerStyle={{width: '100%'}}
                maxLength={40}
                text={country}
                onChangeText={text => {
                  if (Constants.ALPHABET_REGEX.test(text)) {
                    // setcountry(text);
                  }
                }}
                style={{flex: 1}}
                mainStyle={{
                  borderColor: ThemeManager.colors.inputBoxColor,
                }}
                placeholder={LanguageManager.enterhere}></BasicInputBox>
              <TouchableOpacity
                onPress={() => {
                  setCountryListModal(true);
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  // backgroundColor:'red'
                }}></TouchableOpacity>
            </View>
            <View>
              <BasicInputBox
                editable={false}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: fonts.semibold,
                }}
                title={'Currency'}
                mainContainerStyle={{width: '100%'}}
                maxLength={20}
                text={currency}
                onChangeText={text => {
                  if (Constants.ALPHABET_REGEX.test(text)) {
                    // setcountry(text);
                  }
                }}
                style={{flex: 1}}
                mainStyle={{
                  borderColor: ThemeManager.colors.inputBoxColor,
                }}
                placeholder={LanguageManager.enterhere}></BasicInputBox>
              <TouchableOpacity
                onPress={() => {
                  // setCountryListModal(true);
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  // backgroundColor:'red'
                }}></TouchableOpacity>
            </View>

            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={'Province'}
              maxLength={100}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              width="100%"
              text={province}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                // if (Constants.ALPHABET_REGEX.test(text)) {
                  setProvince(text);
                // }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={'City'}
              maxLength={100}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              width="100%"
              text={city}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX_WITH_SPACE.test(text)) {
                  setCity(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={'Street Address'}
              maxLength={256}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              width="100%"
              text={street}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                // if (Constants.ALPHABET_REGEX.test(text)) {
                  setStreet(text);
                // }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={'PostCode'}
              maxLength={20}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              width="100%"
              text={postcode}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (/^[a-zA-Z0-9- ]*$/.test(text)) {
                  setPostCode(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicButton
              onPress={() => {
                submit()
                // Actions.SaitaCardHyperKycForm();
              }}
              btnStyle={{
                marginTop: 50,
                marginHorizontal: 10,
                justifyContent: 'center',
                borderRadius: 10,
              }}
              customGradient={{borderRadius: 12, height: 55}}
              text={'Start Your KYC'}
              textStyle={{fontSize: 16, fontFamily: fonts.semibold}}
            />
          </View>
        </KeyboardAwareScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={countryModal}
          onRequestClose={() => setCountryModal(false)}>
          <SafeAreaView style={{backgroundColor: Colors.White, flex: 1}}>
            <CountryCodes
              List={countryData}
              twoItems={true}
              onPress={item => {
                console.log(
                  'MM',
                  '????',
                  item,
                  item.dial_code.replace('+', ''),
                );
                setCountryCode(item.dial_code);
                setCountryModal(false);
              }}
              closeModal={() => setCountryModal(false)}
            />
          </SafeAreaView>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={countryModal1}
          onRequestClose={() => setCountryModal1(false)}>
          <SafeAreaView style={{backgroundColor: Colors.White, flex: 1}}>
            <CountryCodes
              List={countryData}
              twoItems={true}
              onPress={item => {
                console.log(
                  'MM',
                  '????',
                  item,
                  item.dial_code.replace('+', ''),
                );
                setCountryCode1(item.dial_code);
                setCountryModal1(false);
              }}
              closeModal={() => setCountryModal1(false)}
            />
          </SafeAreaView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={countryListModal}
          onRequestClose={() => setCountryListModal(false)}>
          <SafeAreaView style={{backgroundColor: Colors.White, flex: 1}}>
            <CountryWholeCurrency
              List={countryWholeData}
              title={'Country'}
              twoItems={true}
              // hideCode={true}
              onPress={item => {
                console.log(item);
                //   console.log('MM', '????', item, item.dial_code.replace('+', ''));
                // setCountryCode(item.dial_code);
                setCountry(item?.name);
                // setcurrency(item?.currency?.code);
                setCountryListModal(false);
              }}
              closeModal={() => setCountryListModal(false)}
            />
          </SafeAreaView>
        </Modal>
        {isLoading && <Loader />}
      </Wrap>
    </>
  );
};

export default SaitaCardApplyPhysicalCard;
const styles = StyleSheet.create({
  genderButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 55,
    borderRadius: 10,
    flexDirection: 'row',
  },
  genderText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.white,
    left: 10,
  },
  genderImage: {
    height: 17,
    width: 11,
    resizeMode: 'stretch',
  },
});
