/* eslint-disable react-native/no-inline-styles */
import React, { createRef, useEffect, useState } from 'react';
import {
  BackHandler,
  Clipboard,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect, useDispatch } from 'react-redux';
import { API_ETH_GAS_PRICE } from '../../../Endpoints';
import {
  CheckIsContactExist,
  getEthGasEstimate,
  getEthGasPrice,
  getEthNonce,
  getEthTokenRaw,
  sendETH,
  walletFormUpdate
} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { Colors, Fonts, Images } from '../../../theme/index';
import { BasicModal, SimpleHeader } from '../../common';
import { BasicInputBox } from '../../common/BasicInputBox';
import { ButtonPrimary } from '../../common/ButtonPrimary';
import {
  BasicButton,
  BorderLine,
  InputtextAddress,
  KeyboardDigit,
  PinInput,
  Wrap,
} from '../../common/index';
import Loader from '../Loader/Loader';
import * as constants from './../../../Constant';
import styles from './SendETHStyle';
// import { CameraScreen } from 'react-native-camera-kit';
import { EventRegister } from 'react-native-event-listeners';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { APIClient } from '../../../Api';
import * as Constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import fonts from '../../../theme/Fonts';
import {
  CommaSeprator3,
  bigNumberSafeMath,
  createSignedNewEthTokenTransaction,
  createSignedNewEthTransaction,
  exponentialToDecimalWithoutComma
} from '../../../utils';
import { DetailOption } from '../../common/DetailOption';
import QRReaderModal from '../../common/QRReaderModal';
let maxClicked = false;
let totalFee = 0;
const gwei_multi = 1000000000;
let gaslimitForTxn = 0;
let scanner = true
let basicModal = false
let isContact = false
let eventListener
const SendETH = props => {
  const dispatch = useDispatch();
  let timer = createRef();
  const [selected, setselected] = useState('slow');
  const [PinModal, setPinModal] = useState(false);
  const [Pin, setPin] = useState('');
  const [sucessModall, setsucessModall] = useState(false);
  const [showAddContact, setShowAddContact] = useState(true);
  const [Visible, setVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [toAddress, settoAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [pvtKey, setpvtKey] = useState('');

  // ========Ancrypto =============
  const [walletData, setwalletData] = useState(props.route?.params?.walletData);
  const decim =
    props.route?.params?.walletData?.no_of_decimals > 8 ? 8 : props.route?.params?.walletData?.no_of_decimals;
  const [gasPriceForTxn, setgasPriceForTxn] = useState(1000000000);
  // const [gaslimitForTxn, setgaslimitForTxn] = useState(21000);
  const [gasFeeMultiplier, setgasFeeMultiplier] =
    useState(0.000000000000000001);
  // const [totalFee, settotalFee] = useState('');
  const [balance, setbalance] = useState(0);
  const [advancedGasPrice, setadvancedGasPrice] = useState('');
  const [priorityFee, setpriorityFee] = useState(0);
  const [advancedGasLimit, setadvancedGasLimit] = useState(0);
  const [advancedSet, setadvancedSet] = useState(false);
  // const [maxClicked, setmaxClicked] = useState(false);
  const [MaxFee, setMaxFee] = useState(0);
  const [baseFee, setbaseFee] = useState(0);
  const [ethPvtKey, setethPvtKey] = useState('');
  const [gas_price_eth, setgas_price_eth] = useState(0);
  const [showConfirmTxnModal, setshowConfirmTxnModal] = useState(false);
  const [BasicModall, setBasicModal] = useState(false);
  const [Start_Scanner, setStart_Scanner] = useState(false);
  const [blockChain, setblockChain] = useState('ethereum');
  const [pinFromStorage, setpinFromStorage] = useState('');

  useEffect(() => {
    basicModal = false
    //  console.warn('MM','****************i walletData.decimals', props.route?.params?.walletData.decimals , props.route?.params?.walletData);
    props.navigation.addListener('focus', onScreenFocus);
    props.navigation.addListener('blur', onScreenBlur);
  }, [props]);

  const onScreenFocus = () => {
    basicModal = false
    console.log("onScreenFocus----------------------FOCUS")
    BackHandler.addEventListener('hardwareBackPress', backAction);
    eventListener = EventRegister.addEventListener('downModal', () => {
      console.log('heree::::::::3');
      if (basicModal) {
        setBasicModal(false)
        basicModal = false
        getCurrentRouteName() != 'Wallet' && navigate(NavigationStrings.Wallet)
      }
    });
  };
  const onScreenBlur = () => {
    basicModal = false
    console.log("onScreenFocus----------------------BLUR")
    BackHandler.removeEventListener('hardwareBackPress', backAction);
    EventRegister.removeEventListener(eventListener)
  };

  const backAction = () => {
    console.log("Start_Scanner::::", scanner);
    if (scanner) {
      setStart_Scanner(false)
      scanner = false
      return true;
    } else {
      goBack();
      return true;
    }
  };

  useEffect(() => {
    // console.warn('MM', 'props---SendEthClass');
    console.log('walletData===', walletData);
    let address = props?.route?.params?.qrCode ? props?.route?.params?.qrCode : '';
    settoAddress(address);
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        console.warn('MM', 'ethPvtKey--------', ethPvtKey);
        setethPvtKey(ethPvtKey);
        // let a = Buffer.from(ethPvtKey.substring(2) , 'hex')
        // console.log(a);
      })
      .catch(err => {
        console.log(err);
      });
    availableBalance();
    // getBaseFee();
    gaslimitForTxn = 21000;
    walletData?.is_token == 1 ? getGasLimit() : getTotalFee();
    return;
  }, []);
  const availableBalance = () => {
    let bal =
      walletData?.balance != 0
        ? Singleton.getInstance().exponentialToDecimal(
          Singleton.getInstance().toFixed(
            Singleton.getInstance().exponentialToDecimal(walletData?.balance),
            decim,
          ),
        )
        : walletData?.balance;

    const balance = bal == undefined ? '0' : bal;
    setbalance(balance);
  };
  // const getBaseFee = async () => {
  //   const fee = await getEthBaseFee();
  //   setbaseFee(fee);
  //   console.warn('MM','chk fee:::::eth:::::::', fee, baseFee);
  // };
  const getTotalFee = async () => {
    try {
      // setisLoading(true);
      // const Totalfee = await getTotalGasFee();
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token,
      );
      let res = await APIClient.getInstance().get(API_ETH_GAS_PRICE, token);
      console.log('response .... ', res);
      let Totalfee = res?.data?.FastGasPrice * 10 ** 9;
      setbaseFee(Totalfee);
      // console.log('response .... ' , res);
      setgas_price_eth(Totalfee);
      // console.warn('MM','-----feeeee', Totalfee, gaslimitForTxn);
      totalFee = (Totalfee * gasFeeMultiplier * gaslimitForTxn).toFixed(8);

      // settotalFee((Totalfee * gasFeeMultiplier * gaslimitForTxn).toFixed(8));
      ////console.log(
      // Totalfee * gasFeeMultiplier * gaslimitForTxn,
      //   '(Totalfee * gasFeeMultiplier * gaslimitForTxn).toFixed(8)',
      //   );
      {
        amount ? findMaxSend() : null;
      }
      setisLoading(false);
    } catch (error) {
      console.warn('MM', error);
      // Singleton.showAlert(error?.message || Constants.SOMETHING_WRONG)
      setisLoading(false);
    }
  };
  const findMaxSend = () => {
    //console.warn('MM','tlhis.state.totaFee:::::::::', maxClicked, totalFee);
    if (maxClicked) {
      if (walletData?.coin_symbol?.toLowerCase() == 'eth') {
        if (parseFloat(walletData?.balance - totalFee) <= 0) {
          Singleton.showAlert(LanguageManager.lowBalanceAlert);
          maxClicked = false;
          // setmaxClicked(false);
          return;
        }
        setAmount(
          Singleton.getInstance().toFixed(
            exponentialToDecimalWithoutComma(walletData?.balance - totalFee - 0.00002),
            decim,
          ),
        );
      } else {
        if (parseFloat(walletData?.balance) <= 0) {
          Singleton.showAlert(LanguageManager.lowBalanceAlert);
          maxClicked = false;
          // setmaxClicked(false);
          return;
        }
        setAmount(
          Singleton.getInstance().toFixednew(
            exponentialToDecimalWithoutComma(walletData?.balance),
            decim,
          ),
        );
      }
    }
  };
  const updatePriorityFee = text => {
    if (timer != undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      getMaxFeee(text);
    }, 1000);
  };
  const getMaxFeee = text => {
    //console.warn('MM','chk text length::::', text, text.length);

    text.length > 0
      ? setMaxFee(parseFloat(baseFee) + parseFloat(text).toString())
      : setMaxFee('');
  };
  const onSubmitGas = () => {
    if (parseFloat(advancedGasLimit) == 0.0) {
      Singleton.showAlert(constants.ENTER_GASLIMIT);
      return;
    }
    if (parseFloat(advancedGasLimit) < 21000) {
      Singleton.showAlert(constants.VALID_GASLIMIT);
      return;
    }

    if (priorityFee.length == 0) {
      Singleton.showAlert(constants.VALID_PRIORITY_FEE);
      return;
    }
    if (parseFloat(priorityFee) == 0.0) {
      Singleton.showAlert(constants.VALID_PRIORITY_FEE);
      return;
    }
    totalFee = (
      (2 * baseFee + parseInt(priorityFee)) *
      gasFeeMultiplier *
      gaslimitForTxn
    ).toFixed(8);
    setVisible(false);
    setgasPriceForTxn(advancedGasPrice * gwei_multi),
      setgasPriceForTxn(advancedGasLimit),
      // settotalFee(((2 * baseFee + parseInt(priorityFee)) * gasFeeMultiplier * gaslimitForTxn).toFixed(8)),
      setadvancedSet(true),
      setMaxFee(true),
      setTimeout(() => {
        amount ? findMaxSend() : null;
      }, 250);
  };

  const onSendAction = () => {
    console.warn('MM', 'chk address::::', toAddress);

    setPin('');
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      return;
    }

    if (toAddress.length == 0) {
      Singleton.showAlert(constants.ENTER_ADDRESS);
      return;
    }
    if (toAddress?.toLowerCase() == walletData?.wallet_address?.toLowerCase()) {
      Singleton.showAlert(constants.SAME_ADDRESS_ERROR);
      return;
    }

    if (amount.length == 0 || amount == '' || amount == 0) {
      Singleton.showAlert(constants.ENTER_AMOUNT);
      return;
    }
    if (isNaN(parseFloat(amount))) {
      Singleton.showAlert(constants.VALID_AMOUNT);
      return;
    }

    if (!constants.ONE_DECIMAL_REGEX.test(amount)) {
      Singleton.showAlert(constants.VALID_AMOUNT);
      return;
    }
    if (parseFloat(balance) < parseFloat(amount)) {
      console.warn('MM', ">>>", balance, amount);
      Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
      return;
    } else {
      if (Singleton.getInstance().validateEthAddress(toAddress)) {
        setshowConfirmTxnModal(true);
      } else {
        Singleton.showAlert(constants.VALID_ADDRESS);
      }
    }
  };

  const getGasLimit = () => {
    setisLoading(true);
    let data = {
      from: Singleton.getInstance().defaultEthAddress,
      to: Singleton.getInstance().defaultEthAddress,
      amount: amount,
    };
    let blockChain = 'ethereum';
    let access_token = Singleton.getInstance().access_token;
    let contractAddress = walletData?.token_address;
    props
      .getEthGasEstimate({ blockChain, data, contractAddress, access_token })
      .then(res => {
        console.warn('MM', 'chk res gas estimate:::::', res);
        gaslimitForTxn = res.gas_estimate;
        setisLoading(false);
        getTotalFee();
        // setisLoading(false), setgaslimitForTxn(res.gas_estimate), getTotalFee();
      })
      .catch(err => {
        setisLoading(false);
      });
  };
  const send_ETH = () => {
    setshowConfirmTxnModal(false);
    setisLoading(true);
    //  console.warn('MM','in Send ETH');
    createSignedNewEthTransaction(
      Singleton.getInstance().defaultEthAddress,
      toAddress,
      ethPvtKey,
      amount,
      baseFee,
    )
      .then(ethSignedRaw => {
        send(
          ethSignedRaw.signedRaw,
          walletData?.coin_symbol.toLowerCase(),
          ethSignedRaw.nonce,
        );
      })
      .catch(err => {
        //  console.warn('MM','chk signed raw err::::::::::::=====>', err);
        setisLoading(false);
      });
  };
  const send = (signedRaw, coinSymbol, nonce) => {
    setisLoading(true);
    let data = {
      from: Singleton.getInstance().defaultEthAddress,
      to: toAddress,
      amount: amount,
      gas_price: 0,
      gas_estimate: 21000,
      tx_raw: signedRaw,
      tx_type: 'WITHDRAW',
      nonce: nonce,
      // chat: this.props.chat
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain = 'ethereum';
    let coin_symbol = coinSymbol;
    props
      .sendETH({ data, access_token, blockChain, coin_symbol })
      .then(res => {
        let req = {
          to: toAddress,
          coinFamily: 1
        }
        props.CheckIsContactExist({ data: req, access_token }).then(response => {
          console.log("response::::", response);
          isContact = response.is_contact == 0 ? true : false
          basicModal = true
          setisLoading(false);
          setBasicModal(true);
        }).catch(err => {
          setisLoading(false);
          setBasicModal(true);
          basicModal = true
        })
      })
      .catch(err => {
        setisLoading(false);
        if (err?.message?.includes('insufficient')) {
          Singleton.showAlert('Insufficient Balance');
        } else {
          Singleton.showAlert(err?.message);
        }
      });
  };
  const send_ERC20 = () => {
    setshowConfirmTxnModal(false);
    setisLoading(true);
    let amountcheck = amount * walletData?.decimals;
    // if (amountcheck.toString().includes('.')) {
    //   let intPart = amountcheck.toString().split('.')[0];
    //   amountcheck = intPart;
    // }

    //  console.warn('MM', 'amount' , amount , amount * walletData?.decimals , amountcheck , amountcheck , exponentialToDecimalWithoutComma(amountcheck));
    let data = {
      my_address: Singleton.getInstance().defaultEthAddress,
      dest_address: toAddress,
      amount: amountcheck,
    };

    let access_token = Singleton.getInstance().access_token;
    let blockChain = 'ethereum';
    let contractAddress = walletData?.token_address;
    props
      .getEthTokenRaw({ blockChain, data, contractAddress, access_token })
      .then(raw => {
        console.warn('MM', 'chk eth token signed raw res::::::::::::', raw);
        createSignedNewEthTokenTransaction(
          Singleton.getInstance().defaultEthAddress,
          contractAddress,
          ethPvtKey,
          amount,
          gaslimitForTxn,
          raw.data,
          baseFee,
        )
          .then(token_raw => {
            console.warn('MM', 'chk erc20 signed raw res::::::::::::', token_raw);
            send(token_raw.signedRaw, contractAddress, token_raw.nonce);
          })
          .catch(err => {
            console.warn('MM', 'chk erc20 signed raw err::::::::::::', err);
            setisLoading(false);
          });
        // setisLoading(false);
      })
      .catch(err => {
        //  console.warn('MM','chk eth token signed raw err::::::::::::', err);
        Singleton.showAlert(constants.SOMETHING_WRONG);
        setisLoading(false);
      });
  };
  const qrClose = () => {
    settoAddress('');
    setStart_Scanner(false);
    scanner = false
  };
  const onQR_Code_Scan_Done = QR_Code => {
    console.log("QR_Code:::::", QR_Code);
    settoAddress(QR_Code);
    setStart_Scanner(false);
    scanner = false
    maxClicked = false;
    // setmaxClicked(false);
  };

  const open_QR_Code_Scanner = () => {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          global.stop_pin = true
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: LanguageManager.cameraAppPermission,
              message: LanguageManager.needAccessToCamera,
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            settoAddress('');
            setStart_Scanner(true);
            scanner = true
            setTimeout(() => {
              global.stop_pin = false;
            }, 1000);

          } else {
            Singleton.showAlert(LanguageManager.cameraPermissionDenied);
            setTimeout(() => {
              global.stop_pin = false;
            }, 1000);
          }
        } catch (err) {
          Singleton.showAlert(LanguageManager.cameraPermissionError, err);
          console.warn(err);
          setTimeout(() => {
            global.stop_pin = false;
          }, 1000);
        }
      }
      requestCameraPermission();
    } else {
      settoAddress('');
      setStart_Scanner(true);
      scanner = true
    }
  };

  const updatePin = item => {
    if (item == ' ' || Pin.length == 6) {
      return;
    }
    if (Pin.length != 6) {
      setPin(prev => {
        return prev + item;
      });

      if (Pin.length == 5) {
        console.log('PINNNNN===', Pin + item);
        let pin = Pin + item;
        onProceed(pin);
      }
    }
  };
  const deletePin = () => {
    if (Pin.length == 0) {
      return;
    }
    setPin(prev => prev.slice(0, prev.length - 1));
  };

  const onProceed = text => {
    Singleton.getInstance()
      .newGetData(Constants.PIN)
      .then(pin => {
        console.warn('MM','pin:::::', walletData?.is_token);
        if (text == pin) {
          if (global.disconnected) {
            Singleton.showAlert(constants.NO_NETWORK);
            return;
          }
          walletData?.is_token == 1 ? send_ERC20() : send_ETH();
          setPinModal(false);
        } else {
          Singleton.showAlert(LanguageManager.wrongPin);
          setPin('');
        }
      });
    return;
  };
  const getAddress = address => {
    setShowAddContact(false);
    settoAddress(address);
  };
  const resetAction = () => {
    gaslimitForTxn = gaslimitForTxn;
    setadvancedSet(false);
    maxClicked = true;
    setTimeout(() => {
      getTotalFee();
    }, 250);
  };
  return (
    <>
      {Start_Scanner && (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: ThemeManager.colors.bg,
            paddingTop: Platform.OS == 'ios' ? 20 : 0,
          }}>
          <QRReaderModal
            visible={Start_Scanner}
            setvisible={(data) => {
              setStart_Scanner(data);
              scanner = data
            }}
            onCodeRead={onQR_Code_Scan_Done}
          />
          {/* <TouchableOpacity
            onPress={() => qrClose()}
            style={[styles.addressIcon, {padding: 15, alignSelf: 'flex-end'}]}>
            <FastImage
              style={{width: 30, height: 30, marginRight: 10}}
              resizeMode={FastImage.resizeMode.contain}
              source={Images.modal_close_icon}
            />
          </TouchableOpacity>
          <CameraScreen
            showFrame={true}
            scanBarcode={true}
            laserColor={'#FF3D00'}
            frameColor={'#00C853'}
            colorForScannerFrame={'black'}
            onReadCode={event =>
              onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
            }
          /> */}
        </SafeAreaView>
      )}
      {!Start_Scanner && (
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <SimpleHeader
            history={true}
            customIcon={Images.address}
            onPressHistory={() =>
              getCurrentRouteName() != 'SendCryptoContacts' &&
              navigate(NavigationStrings.SendCryptoContacts,{
                item: walletData,
                blockChain: blockChain,
                getAddress,
              })
            }
            onpress={() =>
              getCurrentRouteName() != 'CoinHistory' &&
              navigate(NavigationStrings.CoinHistory,{ Data: walletData })
            }
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle={{ textTransform: 'none' }}
            title={`Send ${walletData?.coin_symbol.toUpperCase()}`}
          />
          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.roundView,
                {
                  opacity: Visible || basicModal ? 0.5 : 1,
                  backgroundColor: ThemeManager.colors.bg,
                },
              ]}>
              <View style={{ marginHorizontal: widthDimen(22) }}>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    marginTop: heightDimen(24),
                    textAlign: 'left',
                    fontFamily: Fonts.medium,
                    fontSize: areaDimen(14),
                  }}>
                  {LanguageManager.selectNetwork}
                </Text>

                <View
                  style={{
                    backgroundColor: ThemeManager.colors.bg,
                    height: heightDimen(50),
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: heightDimen(25),
                    borderWidth: 1,
                    borderColor: ThemeManager.colors.viewBorderColor,
                    marginTop: heightDimen(10),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: widthDimen(10),
                    }}>
                    {walletData?.coin_image ? (
                      <Image
                        style={{
                          height: widthDimen(30),
                          width: widthDimen(30),
                          borderRadius: widthDimen(15),
                        }}
                        source={{
                          uri: walletData?.coin_image,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          height: widthDimen(30),
                          width: widthDimen(30),
                          borderRadius: widthDimen(15),
                          backgroundColor: ThemeManager.colors.swapBg,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: ThemeManager.colors.headingText,
                            fontFamily: Fonts.semibold,
                            fontSize: areaDimen(16),
                            lineHeight: heightDimen(16),
                          }}>
                          {walletData?.coin_symbol?.toUpperCase().charAt(0)}
                        </Text>
                      </View>
                    )}

                    <Text
                      style={{
                        color: ThemeManager.colors.lightTextColor,
                        fontFamily: Fonts.medium,
                        fontSize: areaDimen(14),
                        marginLeft: widthDimen(16),
                      }}>
                      {walletData?.coin_symbol.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: heightDimen(16) }}>
                  <InputtextAddress
                    label={LanguageManager.withDrawlAddress}
                    placeholder={LanguageManager.longPressToPaste}
                    labelStyle={{
                      fontSize: areaDimen(14),
                      color: ThemeManager.colors.textColor,
                      fontFamily: fonts.medium,
                    }}
                    inputViewCustomStyle={{
                      borderColor: ThemeManager.colors.viewBorderColor,
                      borderWidth: 1,
                    }}
                    placeholderTextColor={ThemeManager.colors.lightTextColor}
                    value={toAddress}
                    inputStyle={{
                      width: '75%',
                      color: ThemeManager.colors.textColor,
                    }}
                    onChangeNumber={text => {
                      settoAddress(text.replace(/\s/g, ''));
                    }}>
                    <View style={styles.addressOptionsCustom}>
                      <TouchableOpacity
                        onPress={() => open_QR_Code_Scanner()}
                        style={styles.addressIcon}>
                        <FastImage
                          style={{
                            width: widthDimen(20),
                            height: widthDimen(20),
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                          source={Images.scanner}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.addressIcon}
                        onPress={() =>
                          Clipboard.getString().then(res => {
                            settoAddress(res.replace(/\s/g, ''));
                          })
                        }>
                        <FastImage
                          style={{
                            width: widthDimen(18),
                            height: widthDimen(18),
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                          source={Images.icon_paste}
                        />
                      </TouchableOpacity>
                    </View>
                  </InputtextAddress>
                </View>
                <View>
                  <BasicInputBox
                    style={
                      {
                        // backgroundColor: 'red',
                      }
                    }
                    // coinStyle={{color:ThemeManager.colors.textColor}}
                    inputTextStyle={{
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.semibold,
                      fontSize: areaDimen(13),
                    }}
                    mainStyle={{
                      borderColor: ThemeManager.colors.viewBorderColor,
                      borderWidth: 1,
                    }}
                    // titleStyle={{ fontFamily: Fonts.semibold }}
                    keyboardType={'numeric'}
                    placeholder="0.00"
                    title="Amount"
                    width={'80%'}
                    text={exponentialToDecimalWithoutComma(amount)}
                    onChangeText={text => {
                      var expression = new RegExp(
                        '^\\d*\\.?\\d{0,' + decim + '}$',
                      );
                      if (expression.test(text)) {
                        let splitValue = text.split('.')
                        if (splitValue[0]?.length <= 21) {
                          setAmount(text);
                        }
                      }
                    }}
                    pressMax={() => {
                      maxClicked = true;
                      findMaxSend();
                    }}
                    max={`${walletData?.coin_symbol.toUpperCase()} `}
                    coinName={' Max'}
                    coinStyle={{
                      color: ThemeManager.colors.lightTextColor,
                      fontFamily: Fonts.medium,
                      fontSize: areaDimen(14),
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: ThemeManager.colors.lightTextColor,
                      marginVertical: heightDimen(14),
                      textAlign: 'left',
                      fontFamily: Fonts.medium,
                      fontSize: areaDimen(14),
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        color: ThemeManager.colors.headingText,
                        fontFamily: Fonts.semibold,
                        fontSize: areaDimen(14),
                      }}>
                      <Text
                        style={{
                          color: ThemeManager.colors.lightTextColor,
                          fontFamily: Fonts.semibold,
                          fontSize: areaDimen(14),
                        }}>≈</Text>{' '}
                      {`${Singleton.getInstance().CurrencySymbol
                        } ${isNaN(Singleton.getInstance().toFixed(
                          exponentialToDecimalWithoutComma(
                            amount * walletData?.perPrice_in_fiat,
                          ),
                          2,
                        )) ? 0 : CommaSeprator3(
                          exponentialToDecimalWithoutComma(
                            amount * walletData?.perPrice_in_fiat,
                          ),
                          2,
                        )}`}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      color: ThemeManager.colors.lightTextColor,
                      marginVertical: heightDimen(14),
                      textAlign: 'right',
                      fontFamily: Fonts.medium,
                      fontSize: areaDimen(14),
                      flex: 1,
                    }}>
                    {LanguageManager.available}:{' '}
                    <Text
                      style={{
                        color: ThemeManager.colors.headingText,
                        fontFamily: Fonts.semibold,
                        fontSize: areaDimen(14),
                      }}>{`${Singleton.getInstance().toFixednew(exponentialToDecimalWithoutComma(balance), decim)} ${walletData?.coin_symbol.toUpperCase()}`}</Text>
                  </Text>
                </View>
                <View style={{ marginTop: 0 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      // backgroundColor:'red'
                    }}>
                    <Text
                      style={[
                        styles.textStyle,
                        {
                          color: ThemeManager.colors.textColor,
                          left: 0,
                          fontFamily: fonts.medium,
                          fontSize: areaDimen(14),
                        },
                      ]}>
                      {LanguageManager.transactionFees}
                    </Text>
                    {/* <TouchableOpacity
                        onPress={() => {
                          if (advancedSet) {
                            resetAction();
                          } else {
                            setVisible(true);
                            setadvancedGasLimit('');
                            setpriorityFee('');
                            setMaxFee('');
                          }
                        }}
                        style={styles.transaction_adoptoin}>
                        <Text style={styles.transaction_TextOptoin}>
                          {!advancedSet
                            ? LanguageManager.advancedOptions
                            : LanguageManager.reset}
                        </Text>
                      </TouchableOpacity> */}
                  </View>
                  <BasicInputBox
                    mainStyle={{
                      borderColor: ThemeManager.colors.viewBorderColor,
                      borderWidth: 1,
                      marginTop: heightDimen(-20)
                    }}
                    style={{ fontSize: 15 }}
                    placeholder=""
                    title=""
                    text={totalFee}
                    editable={false}
                    width={'100%'}
                  />
                </View>
                <View style={{ alignSelf: 'flex-end' }}>
                  <Text
                    style={[
                      styles.textStyle,
                      {
                        color: ThemeManager.colors.lightTextColor,
                        marginTop: heightDimen(10),
                        fontSize: areaDimen(14),
                      },
                    ]}>
                    {LanguageManager.totalAmount}
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'flex-end',
                      marginTop: heightDimen(10),
                      fontFamily: Fonts.medium,
                      color: ThemeManager.colors.headingText,
                      fontSize: areaDimen(14),
                    }}>
                    {walletData?.is_token == 1
                      ? amount
                        ? `${Singleton.getInstance().toFixednew(exponentialToDecimalWithoutComma(
                          amount,
                        ), decim)} ${walletData?.coin_symbol.toUpperCase()} + ${parseFloat(
                          totalFee,
                        )} ETH`
                        : `${0} ${walletData?.coin_symbol.toUpperCase()} + ${parseFloat(
                          totalFee,
                        )} ETH`
                      : amount
                        ? Singleton.getInstance().toFixednew(exponentialToDecimalWithoutComma(bigNumberSafeMath(amount == '.' ? '0' : amount, '+', totalFee)), decim) +
                        ' ETH'
                        : totalFee
                          ? parseFloat(totalFee).toFixed(8) + ' ETH'
                          : '0.00 ETH'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={{ marginVertical: 20, marginHorizontal: widthDimen(22) }}>
            <BasicButton
              onPress={() => onSendAction()}
              btnStyle={{ height: heightDimen(60), width: '100%' }}
              customGradient={{ borderRadius: heightDimen(30) }}
              text={LanguageManager.next}
            />
          </View>
          {basicModal && (
            <BasicModal
              onClose={() => {
                basicModal = false
                getCurrentRouteName() != 'Wallet' && navigate(NavigationStrings.Wallet)
              }}
              showBtn={isContact}
              containerStyle={{
                backgroundColor: ThemeManager.colors.bg,
              }}
              coinSymbolStyle={{ color: ThemeManager.colors.textColor }}
              textStyle={{ color: ThemeManager.colors.textColor }}
              CoinSymbolStyle={{
                fontSize: areaDimen(28),
                fontFamily: Fonts.regular,
                // color: Colors.white
                color: ThemeManager.colors.textColor,
              }}
              bottomBtn={{
                color: ThemeManager.colors.textColor,
                borderColor: ThemeManager.colors.textColor,
              }}
              toAddress={toAddress}
              amount={amount}
              contact={() => {
                setBasicModal(false);
                basicModal = false
                getCurrentRouteName() != 'AddNewContacts' &&
                navigate(NavigationStrings.AddNewContacts,{
                    address: toAddress,
                    coinFamily: walletData.coin_family,
                  });
              }}
              coinSymbol={walletData?.coin_symbol.toUpperCase()}
            />
          )}
          {/* {Visible && <AdvanceOptions setVisible={setVisible} />} */}
          {isLoading && <Loader />}

          {/* **********************************MODAL FOR ADVANCED GAS PRICE*********************************************** */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={Visible}
            onRequestClose={() => { }}>
            <View style={styles.centeredView}>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{
                  flex: 0.5,
                  backgroundColor: Colors.black,
                  opacity: 0.85,
                }}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    padding: 15,
                    resizeMode: 'contain',
                    marginTop: 60,
                    marginLeft: 12,
                    tintColor: Colors.pink,
                  }}
                  source={Images.back}
                />
              </TouchableOpacity>
              <View style={styles.viewGas}>
                <KeyboardAwareScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="always"
                  enableOnAndroid={true}
                  bounces={false}>
                  <InputtextAddress
                    label={LanguageManager.gasLimit}
                    placeholder={LanguageManager.pleaseEnterGasLimit}
                    keyboardType={'number-pad'}
                    labelStyle={styles.labelTextStyle}
                    value={advancedGasLimit}
                    maxLength={10}
                    onChangeNumber={text => {
                      setadvancedGasLimit(text);
                    }}
                  />
                  <InputtextAddress
                    label={LanguageManager.maxPriorityFeeGwei}
                    placeholder={LanguageManager.enterMaxPriorityFee}
                    keyboardType={'number-pad'}
                    labelStyle={styles.labelTextStyle}
                    value={priorityFee}
                    onChangeNumber={text => {
                      setpriorityFee(text);
                      updatePriorityFee(text);
                    }}
                  />
                  <InputtextAddress
                    label={LanguageManager.maxFeeGwei}
                    placeholder={LanguageManager.maxFee}
                    labelStyle={styles.labelTextStyle}
                    value={MaxFee}
                    keyboardType={'numeric'}
                    editable={false}
                  />
                  <View style={styles.buttonStylesSubmit}>
                    <ButtonPrimary
                      btnstyle={{
                        height: 50,
                        paddingHorizontal: 20,
                        width: 120,
                        borderRadius: 14,
                      }}
                      text={LanguageManager.submit}
                      onpress={() => onSubmitGas()}
                    />
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </View>
          </Modal>
          {/* *********************************************************** MODAL FOR CONFIRM TRANSACTION ********************************************************************** */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmTxnModal}
            onRequestClose={() => setshowConfirmTxnModal(false)}>
            <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
              <SimpleHeader
                title={LanguageManager.confirm}
                backImage={ThemeManager.ImageIcons.iconBack}
                titleStyle
                imageShow
                back={false}
                backPressed={() => {
                  setshowConfirmTxnModal(false);
                }}
              />
              <BorderLine
                borderColor={{
                  backgroundColor: ThemeManager.colors.viewBorderColor,
                }}
              />
              <View style={{ flex: 1, marginHorizontal: widthDimen(22) }}>
                <DetailOption
                  type={'AmountWithLargeText'}
                  item={'Amount'}
                  value={amount}
                  fiatValue={Singleton.getInstance().toFixed(
                    exponentialToDecimalWithoutComma(
                      amount * walletData?.perPrice_in_fiat,
                    ),
                    2,
                  )}
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={walletData?.coin_symbol.toUpperCase()}
                  bottomLine={true}
                />

                <DetailOption
                  type={'From'}
                  item={'From'}
                  value={Singleton.getInstance().defaultEthAddress}
                  bottomLine={true}
                />

                <DetailOption
                  type={'To'}
                  item={'To'}
                  value={toAddress}
                  bottomLine={true}
                />

                <DetailOption
                  type={'AmountWithSmallText'}
                  item={'Network Fee'}
                  value={parseFloat(totalFee).toFixed(8)}
                  fiatValue={Singleton.getInstance().toFixed(
                    exponentialToDecimalWithoutComma(
                      parseFloat(totalFee) *
                      walletData?.native_perPrice_in_fiat,
                    ),
                    2,
                  )}
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={
                    walletData?.is_token == 1
                      ? 'ETH'
                      : walletData?.coin_symbol.toUpperCase()
                  }
                  bottomLine={true}
                />

                <DetailOption
                  type={'AmountWithSmallText'}
                  item={'Total value'}
                  value={
                    walletData?.is_token == 1
                      ? `${exponentialToDecimalWithoutComma(parseFloat(
                        amount,
                      ))} ${walletData?.coin_symbol.toUpperCase()} + ${parseFloat(
                        totalFee,
                      )} ETH`
                      : (parseFloat(amount) + parseFloat(totalFee)).toFixed(8)
                  }
                  fiatValue={
                    walletData?.is_token == 1
                      ? Singleton.getInstance().toFixed(
                        exponentialToDecimalWithoutComma(
                          parseFloat(amount) * walletData?.perPrice_in_fiat +
                          parseFloat(totalFee) *
                          walletData?.native_perPrice_in_fiat,
                        ),
                        2,
                      )
                      : Singleton.getInstance().toFixed(
                        exponentialToDecimalWithoutComma(
                          (parseFloat(amount) + parseFloat(totalFee)) *
                          walletData?.perPrice_in_fiat,
                        ),
                        2,
                      )
                  }
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={
                    walletData?.is_token == 1
                      ? ''
                      : walletData?.coin_symbol.toUpperCase()
                  }
                  bottomLine={false}
                />
              </View>
              <View
                style={{
                  marginBottom: heightDimen(20),
                  paddingHorizontal: widthDimen(22),
                }}>
                <BasicButton
                  onPress={() => {
                    setshowConfirmTxnModal(false);
                    setTimeout(() => {
                      setPinModal(true);
                    }, 500);
                  }}
                  btnStyle={{ height: heightDimen(60), width: '100%' }}
                  customGradient={{ borderRadius: heightDimen(30) }}
                  text={LanguageManager.send}
                />
              </View>
              {isLoading && <Loader color="white" />}
            </Wrap>
          </Modal>
          {/* *********************************************************** MODAL FOR PIN ********************************************************************** */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={PinModal}
            onRequestClose={() => setPinModal(false)}>
            <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
              <SimpleHeader
                back={false}
                backPressed={() => setPinModal(false)}
                title={''}
              />
              <View style={{ paddingHorizontal: widthDimen(22) }}>
                <Text
                  style={{
                    fontFamily: fonts.semibold,
                    alignSelf: 'flex-start',
                    fontSize: areaDimen(30),
                    lineHeight: areaDimen(37),
                    marginTop: heightDimen(30),
                    color: ThemeManager.colors.headingText,
                  }}>
                  Confirm Pin
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: areaDimen(14),
                    textAlign: 'left',
                    lineHeight: heightDimen(28),
                    color: ThemeManager.colors.inActiveColor,
                  }}>
                  {LanguageManager.enterSixDigitPin}
                </Text>
                <View style={{}}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: heightDimen(30),
                      flexDirection: 'row',
                    }}>
                    {[0, 1, 2, 3, 4, 5].map((item, index) => {
                      return (
                        <PinInput
                          key={item}
                          isActive={
                            Pin.length == 0
                              ? index == 0
                                ? true
                                : false
                              : Pin.length == index + 1
                          }
                          digit={Pin.length > index ? '*' : ''}
                        />
                      );
                    })}
                  </View>
                </View>
              </View>
              <View
                style={[
                  {
                    justifyContent: 'flex-end',
                    flex: 1,
                    marginTop: heightDimen(102),
                  },
                ]}>
                <KeyboardDigit
                  updatePin={item => updatePin(item)}
                  deletePin={() => deletePin()}
                />
              </View>
            </Wrap>
          </Modal>
        </Wrap>
      )}
    </>
  );
};

const mapStateToProp = state => {
  return {};
};
export default connect(mapStateToProp, {
  walletFormUpdate,
  getEthNonce,
  getEthGasPrice,
  sendETH,
  getEthGasEstimate,
  getEthTokenRaw,
  CheckIsContactExist
})(SendETH);
