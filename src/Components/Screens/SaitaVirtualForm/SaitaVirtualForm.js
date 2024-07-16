/* eslint-disable react/self-closing-comp */
/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  Keyboard,
  Linking,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import {
  VirtualForm,
  getUserCardDetail
} from '../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../Singleton';
import { countryData } from '../../../countryCodes';
import { Colors } from '../../../theme';
import fonts from '../../../theme/Fonts';
import {
  BasicButton,
  BasicInputBox,
  BasicInputBoxPassword,
  BasicInputBoxSelect,
  BorderLine,
  CheckBox,
  SimpleHeader,
  Wrap
} from '../../common';
import CountryCodes from '../CountryCodes/CountryCodes';
import Loader from '../Loader/Loader';
import styles from './SaitaVirtualFormStyle';
//main
import SmartCardAbi from '../../../../ABI/SmartCardAbi.json';
import tokenCardAbi from '../../../../ABI/tokenCardAbi.json';
// test
// import SmartCardAbi from '../../../../ABI/SmartCardAbitest.json';
// import tokenCardAbi from '../../../../ABI/tokenCardAbitest.json';
import { BigNumber } from 'bignumber.js';
import { Platform } from 'react-native';
import Web3 from 'web3';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
// //test
// let routerAddressCards = '0xBd5EB4F64C5c9D87e1a33B08AD3FFf8D821da48E';
// //main
let routerAddressCards =
  Constants.network == 'testnet'
    ? '0xBd5EB4F64C5c9D87e1a33B08AD3FFf8D821da48E'
    : '0x12f939E4FB9d9ccd955a1793A39D87672649706f';

let toAddress = '0x17F72CF26042Cf58a43fEe2250b49Dd2B3bb1C05';

const routerDecimals = Constants.ismainnet ? 6 : 6;
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const SaitaVirtualForm = props => {
  console.log(props);
  const dispatch = useDispatch();
  const cardDetail = props?.cardDetail;
  const [editable, setEditable] = useState(true);

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBoxtwo, setToggleCheckBoxTwo] = useState(false);
  const [PinModal, setPinModal] = useState(false);
  const [countryModal, setCountryModal] = useState(false);
  const [countryListModal, setCountryListModal] = useState(false);
  const [Pin, setPin] = useState('');
  const [countrycode, setCountryCode] = useState('+91');
  const [swapModal, setSwapModal] = useState(false);
  const [email, setEmail] = useState('');
  const [cardFee, setCardFee] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(true);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [address1, setAddress1] = useState('');
  const [state, setstate] = useState('');
  const [country, setcountry] = useState('');
  const [zipcode, setzipcode] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [rawTxnObj, setRawTxnObj] = useState();
  const [userCardType, setUserCardType] = useState(0);
  const GAS_FEE_MULTIPLIER = 0.000000000000000001;
  const GAS_BUFFER = 35000;
  const [privateKey, setPrivateKey] = useState('');
  const [applyModal, setApplyModal] = useState(false);
  const [tokenResultAddress, setTokenResultAddress] = useState('');

  const [shouldEdit, setShouldEdit] = useState(true);

  const [userId, setuserId] = useState('');

  const [time, setTime] = React.useState(props.initialValue || 60);
  const timerRef = React.useRef(time);
  const [showTime, setshowTime] = useState(false);

  let userAddress = Singleton.getInstance().defaultEthAddress;
  let allowance_timer;

  let pvtKey;
  let purchaseAbi;

  useEffect(() => {
    // MyThemeTester()
    console.log('lll', props);

    //  console.warn('MM',"cardType>>", props.cardType);
    console.warn('MM', 'selected Item::::::>>', props.selectedItem);

    checkStatus(true);
  }, []);

  const checkStatus = isFirst => {
    setisLoading(true);
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        setAccessToken(access_token);
        console.warn('MM', '>>>>access_token', access_token);
        checkuserDetail(access_token, isFirst);
      });
  };

  const getWeb3Object = () => {
    //    let network = new Web3("https://eth-goerli.g.alchemy.com/v2/aZnKYk2iGEX6eD_Fm2WbdphfiG7EPA4V");
    let network = new Web3(Singleton.getInstance().ethLink);
    console.warn('MM', 'network');
    return network;
  };

  const getContractObject = async (address, abi) => {
    //  console.warn('MM','tokenAddress:::getContractObject', address);
    try {
      const web3Object = getWeb3Object();
      console.warn('MM', '>>>>fees111');
      let tokenContractObject;
      try {
        tokenContractObject = await new web3Object.eth.Contract(abi, address);
      } catch (error) {
        console.warn('MM', '>>>>errorerror', error);
      }

      console.warn('MM', '>>>>fees222');
      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
    }
  };

  const purChaseCardFee = async cardType => {
    //  console.warn('MM',"purChaseCard 11");
    setisLoading(true);
    let selectedCardType = cardType ? cardType : userCardType;
    // let cardType = props?.cardType - 1
    //  console.warn('MM' , 'cardType_________' , userCardType);
    let cardNum = Math.floor(Math.random() * 10000 + 1);
    let routerContractObject = await getContractObject(
      routerAddressCards,
      SmartCardAbi,
    );
    let purchaseAbi = await routerContractObject.methods.purchaseCard(
      userAddress,
      selectedCardType,
      cardNum,
    );
    purchaseAbi
      .estimateGas({from: userAddress})
      .then(gasEstimate => {
        //  console.warn('MM',"purChaseCard 33", gasEstimate);
        setGasEstimate(gasEstimate + GAS_BUFFER);

        setisLoading(false);
        //  console.warn('MM','______');
        setRawTxnObj(purchaseAbi.encodeABI());
        setSwapModal(true);
        Singleton.getInstance().istxnModal = true;
        //  console.warn('MM','here______');
        //  let gasPurchase = gasEstimate + GAS_BUFFER
      })
      .catch(err => {
        //  console.warn('MM',"purChaseCard err 11 " + err?.message);
        setisLoading(false);
        Singleton.showAlert(err.message);
      });
  };

  const allowanceLoop = () => {
    console.warn('MM', 'allowanceLoop');
    allowance_timer = setTimeout(() => {
      let result = chekAllowance();
      //  console.warn('MM','achekAllowance response ==>>', result);
      if (result) {
        Alert.alert(
          Constants.APP_NAME,
          'Transaction sent to Blockchain for Approval',
          [
            {
              text: 'OK',
              onPress: () => {
                purChaseCardFee();
              },
            },
          ],
          {cancelable: false},
        );
        setisLoading(false);
        clearTimeout(allowance_timer);
      } else {
        allowanceLoop();
      }
    }, 2000);
  };

  const chekAllowance = async () => {
    let tokenContractObject = await getContractObject(
      tokenResultAddress,
      tokenCardAbi,
    );
    console.warn('MM', 'tokenContractObject ==>>>');
    let allowance = await tokenContractObject.methods
      .allowance(userAddress, routerAddressCards)
      .call();
    //  console.warn('MM','allowance ==>>> 222', allowance);

    if (BigNumber(allowance).toFixed(0) <= 0) {
      console.warn('MM', 'allowance ==>>>false');
      return false;
    } else {
      console.warn('MM', 'allowance ==>>>true');
      return true;
    }
  };

  const onProceed = () => {
    Keyboard.dismiss();
    // if (editable) {
    //   if (firstname.trim() == '') {
    //     Singleton.showAlert('First Name field is required');
    //     return;
    //   } else if (lastname.trim() == '') {
    //     Singleton.showAlert('Last Name field is required');
    //     return;
    //   } else if (firstname.length < 3) {
    //     Singleton.showAlert('Name field must be greater than 3 characters');
    //     return;
    //   }
    //   else if (number.trim() == '') {
    //     Singleton.showAlert('Phone Number field is required');
    //     return;
    //   } else if (number.length < 8) {
    //     Singleton.showAlert('Phone number should be between 8-12 numbers');
    //     return;
    //   } else if (number.length > 12) {
    //     Singleton.showAlert('Phone number should be between 8-12 numbers');
    //     return;
    //   }
    if (address.trim() == '') {
      Singleton.showAlert('Address 01 field is required');
      return;
    } else if (address.length < 5) {
      Singleton.showAlert(
        'Address 01 field must be greater than 5 characters.',
      );
      return;
    } else if (state.trim() == '') {
      Singleton.showAlert('State field is required');
      return;
    } else if (country.trim() == '') {
      Singleton.showAlert('Country field is required');
      return;
    } else if (zipcode.trim() == '') {
      Singleton.showAlert('Zip Code field is required');
      return;
    }
    //   else if (email.trim() == '') {
    //     Singleton.showAlert('Email field is required');
    //     return;
    //   }
    //    else if (password == '') {
    //     Singleton.showAlert('Password field is required.');
    //     return;
    //   } else if (password.length < 6) {
    //     Singleton.showAlert('Password must be greater than 5 characters');
    //     return;
    //   } else if (Constants.PASSWORD_REGEX.test(password) == false) {
    //     Singleton.showAlert(
    //       'Password must include a special character, upper and lower case letters and a number',
    //     );
    //     return;
    //   } else if (Constants.EMAIL_REGEX.test(email) == false) {
    //     Singleton.showAlert('Please provide valid email.');
    //     return;
    //   }
    else if (!toggleCheckBox) {
      Singleton.showAlert('Accept Terms & Conditions');
      return;
    } else if (!toggleCheckBoxtwo) {
      Singleton.showAlert('Accept Email & SMS Communication');
      return;
    }
    SignUpUser();
    // } else {

    //   const selectedItem = props.selectedItem;
    //   console.warn('MM', 'selectedItem::::::::::', selectedItem);

    //     if (selectedItem.kyc_status == 0) {
    //       setApplyModal(true);
    //     } else if (
    //       selectedItem.kyc_status == 2 &&
    //       selectedItem.card_applied == null
    //     ) {
    //       applyCard();
    //     }

    // }
  };

  const SignUpUser = () => {
    console.warn('MM', '>>>>>SignUpUser,');
    // if (Pin.length < 6) {
    //   Singleton.showAlert('Enter valid OTP');
    //   return;
    // } else if (userId) {
    //   setEditable(false);
    //   setPinModal(false);
    //   console.warn('MM', '>>>>>SignUpUser222,');
    //   setPaymentMethodModal(true);
    //   // fees();
    //   return;
    // }
    setisLoading(true);
    let data = {
      //   first_name: firstname,
      //   last_name: lastname,
      //   country_code: countrycode.replace('+', ''),
      //   mobile_no: number,
      address_01: address?.trim(),
      address_02: address1?.trim(),
      state: state?.trim(),
      country: country,
      zip_code: zipcode?.trim(),
      //   email: email,
      //   password: password,
      //   card_type_id: props.selectedItem.card_type_id,
      //   card_table_id: props.cardType,
      //   card_category:props.selectedItem.card_type,
      //   otp: Pin,
      //   card_name: props.selectedItem.name, // props.cardType == 1 ? "black" : props.cardType == 2 ? "Diamond" : props.cardType == 3 ? "Gold" : "Black"
      //   device_token: Singleton.getInstance().device_token,
    };
    console.log(data);

    dispatch(VirtualForm({data, access_token: accessToken}))
      .then(res => {
        setisLoading(false);
        console.warn('MM', '>>>>>>virutal form', res);
        if (res.status) {
          setShouldEdit(false);
          //   Singleton.getInstance().newSaveData(
          //     Constants.access_token_cards,
          //     res.data.jwt,
          //   );
          //   setuserId(res.data.userId);
          //   setPinModal(false);
          //   setPaymentMethodModal(true);
          // fees();
          setApplyModal(true);
        } else {
          Singleton.showAlert(res.message);
        }
      })
      .catch(err => {
        setisLoading(false);
        Singleton.showAlert(err.message);
      });
  };

  const checkuserDetail = (access_token, isFirst) => {
    dispatch(getUserCardDetail({access_token}))
      .then(res => {
        console.warn('MM', 'MM', 'getUserCardDetail ::::::: ApplyForm', res);
        setisLoading(false);
        // console.log('test', {
        //   selectedItem: props?.cardDetail,
        //   cardDetail: props?.selectedItem,
        //   userDetail: res,
        // });

        if (res.country) {
          setShouldEdit(false);
          setApplyModal(false);

          // getCurrentRouteName() != 'KycShufti' &&
          //   Actions.replace("KycShufti",{email: email});
          getCurrentRouteName() != 'SaitaCardHyperKycForm' &&
          navigate(NavigationStrings.SaitaCardHyperKycForm,{
            selectedItem: props?.cardDetail,
            cardDetail: props?.selectedItem,
            userDetail: res,
          });
        } else {
          setFirstName(res.first_name);
          setLastName(res.last_name);
          setCountryCode('+' + res.country_code);
          setNumber(res.mobile_no);
          setAddress(res.address_01);
          setAddress1(res.address_02);
          setstate(res.state);
          setcountry(res.country);
          setzipcode(res.zip_code);
          setEmail(res.email);
          setuserId(res.user_id);
          setEditable(false);
        }
      })
      .catch(err => {
        console.log(err);
        setisLoading(false);
        setEditable(true);
      });
  };

  console.log(isLoading);

  return (
    <>
      <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
        <SimpleHeader
          title={`SaitaCard ${
            props.selectedItem.name?.toLowerCase() == 'black'
              ? 'Black'
              : props.selectedItem.name?.toLowerCase() == 'diamond'
              ? 'Diamond'
              : props.selectedItem.name?.toLowerCase() == 'gold'
              ? 'Gold'
              : 'Black'
          }`}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle={{marginRight: 30}}
          imageShow
          back={false}
          backPressed={() => {
            goBack();
          }}
        />
        <BorderLine
          borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
        />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          keyboardShouldPersistTaps={'always'}
          bounces={false}>
          <View style={[styles.container]}>
            <View style={{flex: 1, paddingHorizontal: widthDimen(22)}}>
              <BasicInputBox
                editable={editable}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: fonts.semibold,
                }}
                title={LanguageManager.firstName}
                maxLength={20}
                mainStyle={{borderColor: ThemeManager.colors.viewBorderColor}}
                width="100%"
                text={firstname}
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
                editable={editable}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: fonts.semibold,
                }}
                title={LanguageManager.lastName}
                maxLength={20}
                mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
                width="100%"
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                text={lastname}
                onChangeText={text => {
                  if (Constants.ALPHABET_REGEX_WITH_SPACE.test(text)) {
                    setLastName(text);
                  }
                }}
                placeholder={LanguageManager.enterhere}></BasicInputBox>

              <BasicInputBoxSelect
                disabled={editable ? false : true}
                pressPhone={() => setCountryModal(true)}
                countrycode={countrycode}
                arrowStyle={{tintColor:ThemeManager.colors.inActiveColor}}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: areaDimen(14),
                  lineHeight: heightDimen(18),
                  fontFamily: fonts.medium,
                }}
                title={LanguageManager.phoneNumber}
                mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor,
                  borderRadius: 100,}}
                keyboardType="number-pad"
                onChangeText={text => {
                  if (Constants.NUMBER_ONLY_REGEX.test(text)) {
                    setNumber(text);
                  }
                }}
                editable={editable}
                text={number}
                maxLength={15}
                width={'80%'}
                mainContainerStyle={{
                  marginTop: heightDimen(5),
                  paddingHorizontal: 0,
                }}
                placeholder={LanguageManager.enterhere}></BasicInputBoxSelect>

              {
                <View>
                  <BasicInputBox
                    editable={shouldEdit}
                    titleStyle={{
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    }}
                    title={LanguageManager.address1}
                    maxLength={30}
                    keyboardType={
                      Platform.OS == 'ios'
                        ? 'ascii-capable'
                        : 'visible-password'
                    }
                    onChangeText={text => setAddress(text)}
                    mainStyle={{
                      borderColor: ThemeManager.colors.inputBoxColor,
                    }}
                    width="100%"
                    text={address}
                    placeholder={LanguageManager.enterhere}></BasicInputBox>

                  <BasicInputBox
                    editable={shouldEdit}
                    titleStyle={{
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    }}
                    title={LanguageManager.address2}
                    width="100%"
                    maxLength={30}
                    text={address1}
                    keyboardType={
                      Platform.OS == 'ios'
                        ? 'ascii-capable'
                        : 'visible-password'
                    }
                    onChangeText={text => setAddress1(text)}
                    mainStyle={{
                      borderColor: ThemeManager.colors.inputBoxColor,
                    }}
                    placeholder={LanguageManager.enterhere}></BasicInputBox>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <BasicInputBox
                      editable={shouldEdit}
                      titleStyle={{
                        color: ThemeManager.colors.textColor,
                        fontSize: 13,
                        fontFamily: fonts.semibold,
                      }}
                      title={LanguageManager.state}
                      mainContainerStyle={{width: '50%'}}
                      keyboardType={
                        Platform.OS == 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      maxLength={20}
                      text={state}
                      onChangeText={text => {
                        if (Constants.ALPHABET_REGEX_WITH_SPACE.test(text)) {
                          setstate(text);
                        }
                      }}
                      style={{flex: 1}}
                      mainStyle={{
                        borderColor: ThemeManager.colors.inputBoxColor,
                      }}
                      placeholder={LanguageManager.enterhere}></BasicInputBox>

                    <View style={{width: '50%'}}>
                      <BasicInputBox
                        editable={shouldEdit}
                        titleStyle={{
                          color: ThemeManager.colors.textColor,
                          fontSize: 13,
                          fontFamily: fonts.semibold,
                        }}
                        title={LanguageManager.country}
                        mainContainerStyle={{width: '100%'}}
                        maxLength={20}
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
                          if (shouldEdit) {
                            setCountryListModal(true);
                          }
                          // } else {
                          // }
                        }}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          // backgroundColor:'red'
                        }}></TouchableOpacity>
                    </View>
                  </View>

                  <BasicInputBox
                    editable={shouldEdit}
                    titleStyle={{
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    }}
                    title={LanguageManager.zipcode}
                    width="100%"
                    maxLength={20}
                    keyboardType={
                      Platform.OS == 'ios'
                        ? 'ascii-capable'
                        : 'visible-password'
                    }
                    text={zipcode}
                    onChangeText={text => {
                      if (/^[a-zA-Z0-9- ]*$/.test(text)) {
                        setzipcode(text);
                      }
                    }}
                    // keyboardType="number-pad"
                    mainStyle={{
                      borderColor: ThemeManager.colors.inputBoxColor,
                    }}
                    placeholder={LanguageManager.enterhere}></BasicInputBox>
                </View>
              }
              <BasicInputBox
                editable={editable}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: fonts.semibold,
                }}
                title={LanguageManager.emailid}
                width="100%"
                maxLength={40}
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                text={email}
                onChangeText={text => {
                  if (text) text = text?.trim();
                  setEmail(text);
                }}
                mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
                placeholder={LanguageManager.enterhere}
              />

              {editable && (
                <BasicInputBoxPassword
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: fonts.semibold,
                  }}
                  title={LanguageManager.password}
                  width="85%"
                  maxLength={20}
                  onPress={() => setShowPassword(!showPassword)}
                  // keyboardType={Platform.OS == 'ios' ? "ascii-capable": "visible-password"}
                  secureTextEntry={showPassword}
                  onChangeText={text => {
                    setPassword(text);
                  }}
                  mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
                  placeholder={
                    LanguageManager.enterhere
                  }></BasicInputBoxPassword>
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                marginTop: 30,
                alignItems: 'center',
              }}>
              <CheckBox
                checkBoxLeft={5}
                checkboxstyle={{width: 16, height: 16}}
                checkboxColor={ThemeManager.colors.checkBoxColor}
                isStored={toggleCheckBox}
                onHandleCheckBox={() => {
                  setToggleCheckBox(!toggleCheckBox);
                }}
              />
              <View style={{flexDirection: 'row', marginHorizontal: 20}}>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 15,
                    color: ThemeManager.colors.textColor,
                  }}>
                  {'I agree to the '}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://d18zkqei0yjvv8.cloudfront.net/T&C.pdf',
                    )
                  }
                  style={{}}>
                  <Text
                    style={{
                      color: Colors.buttonColor1,
                      fontFamily: fonts.regular,
                      fontSize: 15,
                    }}>
                    {'Terms & Conditions '}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{flexDirection: 'row', width: '90%', marginTop: 10}}>
              <CheckBox
                checkBoxLeft={5}
                checkboxstyle={{width: 16, height: 16}}
                checkboxColor={ThemeManager.colors.checkBoxColor}
                isStored={toggleCheckBoxtwo}
                onHandleCheckBox={() => {
                  setToggleCheckBoxTwo(!toggleCheckBoxtwo);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  flexWrap: 'wrap',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 15,
                    color: ThemeManager.colors.textColor,
                  }}>
                  I want to receive email and SMS communication from{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.saitacard.io/')}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 15,
                      color: Colors.buttonColor1,
                    }}>
                    SaitaCard,{' '}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('https://www.saitamatoken.com/')
                  }>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 15,
                      color: Colors.buttonColor1,
                    }}>
                    Saitama{' '}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 15,
                    color: ThemeManager.colors.textColor,
                  }}>
                  and{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://epay.me/')}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 15,
                      color: Colors.buttonColor1,
                    }}>
                    ePay.me
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <BasicButton
              onPress={() => {
                if (shouldEdit) {
                  onProceed();
                } else {
                  setApplyModal(true);
                }
              }}
              btnStyle={{
                width: '85%',
                marginVertical: 20,
                justifyContent: 'center',
                borderRadius: 10,
              }}
              customGradient={{borderRadius: 12, height: 55}}
              text={'Start Your KYC'}
              textStyle={{fontSize: 16, fontFamily: fonts.semibold}}
            />
          </View>
        </KeyboardAwareScrollView>
      </Wrap>

      {/* *********************************************************** MODAL FOR Country dial ********************************************************************** */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={countryListModal}
        onRequestClose={() => setCountryListModal(false)}>
        <SafeAreaView style={{backgroundColor: ThemeManager.colors.bg,
            flex: 1,
            width: '100%',}}>
          <CountryCodes
            List={countryData}
            twoItems={true}
            hideCode={true}
            onPress={item => {
              // console.log(item);
              console.log('MM', '????', item, item.dial_code.replace('+', ''));
              // setCountryCode(item.dial_code);
              setcountry(item?.name);
              setCountryListModal(false);
            }}
            closeModal={() => setCountryListModal(false)}
          />
        </SafeAreaView>
      </Modal>

      {/* *********************************************************** MODAL FOR Country ********************************************************************** */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={countryModal}
        onRequestClose={() => setCountryModal(false)}>
        <SafeAreaView style={{backgroundColor: ThemeManager.colors.bg,
            flex: 1,
            width: '100%',}}>
          <CountryCodes
            List={countryData}
            twoItems={true}
            onPress={item => {
              console.log('MM', '????', item, item.dial_code.replace('+', ''));
              setCountryCode(item.dial_code);
              setCountryModal(false);
            }}
            closeModal={() => setCountryModal(false)}
          />
        </SafeAreaView>
      </Modal>

      {/* *********************************************************** MODAL FOR Apply ********************************************************************** */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={applyModal}
        onRequestClose={() => setApplyModal(false)}>
        <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
          <View style={{height: windowHeight}}>
            <SimpleHeader
              back={false}
              backPressed={() => setApplyModal(false)}
            />
            <View
              style={{
                marginTop: 45,
                height: '50%',
                width: '90%',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <ImageBackground
                resizeMode="contain"
                style={[styles.imgcards,{backgroundColor:ThemeManager.colors.bg}]}
                source={{uri: props.selectedItem.card_new_image}}>
                <View
                  style={{
                    backgroundColor: 'rgba(57, 57, 57, 0.7)',
                    borderRadius: 17,
                    height: '30%',
                    width: '50%',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  <Text style={styles.txtone}>Application Fee:</Text>
                  <Text style={styles.txttwo}>USD 249</Text>
                  <Text style={styles.txtthree}>Only USD 199*</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={{height: '20%'}}>
              <Text
                style={[
                  styles.txtWelcome,
                  {color: ThemeManager.colors.textColor, marginTop: 15},
                ]}>
                Thank you for applying for{'\n'}SaitaCard{' '}
                <Text
                  style={[
                    styles.txtWelcome,
                    {
                      color: ThemeManager.colors.textColor,
                      marginTop: 15,
                      textTransform: 'capitalize',
                    },
                  ]}>
                  {props.selectedItem.name}
                </Text>
              </Text>
              <Text style={[styles.txtkyc]}>
                Now you need to complete your{'\n'}identification process (KYC)
                to start{'\n'}using SaitaCard
              </Text>
            </View>

            <View style={{alignItems: 'center', height: '30%'}}>
              <BasicButton
                onPress={() => {
                  checkStatus(false);
                }}
                btnStyle={styles.btnStyle}
                customGradient={styles.customGrad}
                text={'Start KYC Process'}
                textStyle={{fontSize: 16, fontFamily: fonts.medium}}
              />
            </View>
          </View>
        </Wrap>
        {isLoading && <Loader />}
      </Modal>
      {isLoading && <Loader />}
    </>
  );
};

export default SaitaVirtualForm;
