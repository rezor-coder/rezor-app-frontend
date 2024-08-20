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
import { connect } from 'react-redux';
import { API_TRON_FEE } from '../../../Endpoints';
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
  BorderLine,
  InputtextAddress,
  KeyboardDigit,
  PinInput,
  Wrap,
} from '../../common/index';
import Loader from '../Loader/Loader';
import * as constants from './../../../Constant';
import styles from './SendTRXStyle';
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
  exponentialToDecimalWithoutComma
} from '../../../utils';
import { DetailOption } from '../../common/DetailOption';
import QRReaderModal from '../../common/QRReaderModal';
let scanner = false
let maxClicked = false;
let totalFee = '';
const gwei_multi = 1000000000;
let gaslimitForTxn = 0;
let api_gas_fee = 0;
let basicModal = false
let isContact = false
let eventListener
const SendTRX = props => {
  let timer = createRef();
  const [PinModal, setPinModal] = useState(false);
  const [Pin, setPin] = useState('');

  const [showAddContact, setShowAddContact] = useState(true);
  const [Visible, setVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [toAddress, settoAddress] = useState('');
  const [amount, setAmount] = useState('');

  // ========Ancrypto =============
  const [walletData, setwalletData] = useState(props.route?.params?.walletData);
  const decim =
    props.route?.params?.walletData?.no_of_decimals > 8 ? 8 : props.route?.params?.walletData?.no_of_decimals;
  const [gasPriceForTxn, setgasPriceForTxn] = useState(1000000000);

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
  const [gasFee, setGasFee] = useState({});

  const [showConfirmTxnModal, setshowConfirmTxnModal] = useState(false);
  const [BasicModall, setBasicModal] = useState(false);
  const [Start_Scanner, setStart_Scanner] = useState(false);
  const [blockChain, setblockChain] = useState('tron');
  const [trxData, setTrxData] = useState({});

  useEffect(() => {
    basicModal = false
    // console.warn('MM','****************i walletData', props.route?.params?.walletData);
    console.log('walletData===', walletData);

    props.navigation.addListener('focus', onScreenFocus);
    props.navigation.addListener('blur', onScreenBlur);
  }, [props]);

  const onScreenFocus = () => {
    basicModal = false
    BackHandler.addEventListener('hardwareBackPress', backAction);
    eventListener = EventRegister.addEventListener('downModal', () => {
      console.log('heree::::::::6');
      if (basicModal) {
        setBasicModal(false)
        basicModal = false
        getCurrentRouteName() != 'Wallet' && navigate(NavigationStrings.Wallet)
      }
    });
  };
  const onScreenBlur = () => {
    basicModal = false
    //console.warn('MM','****************i confirmPin');
    BackHandler.removeEventListener('hardwareBackPress', backAction);
    EventRegister.removeEventListener(eventListener)
  };

  const backAction = () => {
    if (scanner) {
      setStart_Scanner(false);
      scanner = false
      return true;
    } else {
      goBack();
      return true;
    }
  };

  useEffect(() => {
    // //console.warn('MM','props', props);
    let address = props?.qrCode ? props?.qrCode : '';
    settoAddress(address);
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultTrxAddress}_pk`)
      .then(ethPvtKey => {
        // console.warn('MM','ethPvtKey--------', ethPvtKey);
        setethPvtKey(ethPvtKey);

        // createSignedNewMaticTransaction(
        //   Singleton.getInstance().defaultTrxAddress,
        //   '0xaCDD13B864e13e761eab0fd88536273856B2ff20',
        //   ethPvtKey,
        //   '0.00001',
        // )
        //   .then(res => {
        //     //console.warn('MM','resssss', res);
        //   })
        //   .catch(err => {
        //     //console.warn('MM','errrrrr', err);
        //   });
      });
    availableBalance();
    // gasFeeFn();
    // gaslimitForTxn = 21000;

    // getGasLimit()
    return;
  }, []);
  const availableBalance = () => {
    let bal =
      walletData?.balance != 0
        ? Singleton.getInstance().exponentialToDecimal(
          Singleton.getInstance().toFixednew(
            Singleton.getInstance().exponentialToDecimal(walletData?.balance),
            constants.CRYPTO_DECIMALS,
          ),
        )
        : walletData?.balance;
    const balance = walletData?.balance.toString().length < 5 ? bal : bal;
    setbalance(balance);
  };
  const gas_estimate_tron = async data => {
    try {
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token,
      );
      let res = await APIClient.getInstance().post(API_TRON_FEE, data, token);
      return Promise.resolve(res);
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }

    //     const fee = await getMaticBaseFee();
    //     setbaseFee(fee);
    //  //  console.warn('MM','chk fee:::::eth:::::::', fee, baseFee);
  };

  const gasFeeFn = async trxRaw => {
    try {
      let data = {
        toAddress: toAddress,
        raw: trxRaw?.raw_data_hex,
        isToken: walletData.is_token,
        contractAddress: walletData.token_address,
        tokenType: 'TRX20',
      };
      // console.log('gasFeeFn params' , data );
      let res = await gas_estimate_tron(data);
      // console.log('gasFeeFn' , res);
      setGasFee(res.data);
      return Promise.resolve(res);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  };

  // const getTotalFee = async (fees) => {
  //   let Totalfee;
  //   if(fees){
  //     api_gas_fee = fees;
  //     Totalfee = fees;
  //   }
  //   else{
  //     Totalfee = await getTotalGasFeeMatic()
  //     api_gas_fee = Totalfee
  //   }
  //   // setisLoading(true);
  //   // const Totalfee = await getTotalGasFeeMatic();

  //   // setgas_price_eth(Totalfee);
  //   //console.warn('MM','-----feeeee', Totalfee, gaslimitForTxn);
  //   totalFee = (Totalfee * gasFeeMultiplier * gaslimitForTxn).toFixed(8);
  //   // settotalFee((Totalfee * gasFeeMultiplier * gaslimitForTxn).toFixed(8));
  //   // //console.log(
  //   // Totalfee * gasFeeMultiplier * gaslimitForTxn,
  //   //   '(Totalfee * gasFeeMultiplier * gaslimitForTxn).toFixed(8)',
  //   // );
  //   {
  //     amount ? findMaxSend() : null;
  //   }
  //   setTimeout(() => {
  //     setisLoading(false);
  //   }, 200);
  //   setisLoading(false);
  // };
  const findMaxSend = () => {
    //console.warn('MM','tlhis.state.totaFee:::::::::', maxClicked, totalFee);
    if (maxClicked) {
      if (walletData?.coin_symbol?.toLowerCase() == 'trx') {
        if (parseFloat(walletData?.balance - 0.3) <= 0) {
          Singleton.showAlert(LanguageManager.lowBalanceAlert);
          maxClicked = false;
          // setmaxClicked(false);
          return;
        }
        setAmount(
          Singleton.getInstance().toFixednew(
            exponentialToDecimalWithoutComma(walletData?.balance - 0.3),
            6,
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
            6,
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


  const onSendAction = async () => {
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      return;
    }
    setPin('');
    if (toAddress.length == 0) {
      Singleton.showAlert(constants.ENTER_ADDRESS);
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
    if (toAddress?.toLowerCase() == walletData?.wallet_address?.toLowerCase()) {
      Singleton.showAlert(constants.SAME_ADDRESS_ERROR);
      return;
    }
    if (parseFloat(balance) < parseFloat(amount)) {
      //console.warn('MM','>>>', balance, amount);
      Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
      return;
    } else {
      if (Singleton.getInstance().validateTronAddress(toAddress)) {
        // setshowConfirmTxnModal(true);

        let value = Singleton.getInstance().exponentialToDecimal(amount);
        console.log('value', value);
        let leftAmount = walletData.balance - value;
        console.log('left Amount ', leftAmount);
        if (leftAmount < 0) {
          Singleton.showAlert(Constants.INSUFFICIENT_BALANCE);
          setisLoading(false);
          return;
        }

        try {
          setisLoading(true);
          let pvtKey = await Singleton.getInstance().newGetData(
            `${Singleton.getInstance().defaultTrxAddress}_pk`,
          );
          console.log('pvtKey::::::Tron', pvtKey);

          if (walletData.is_token == '1') {
            value = value * walletData.decimals;
            value = Singleton.getInstance().exponentialToDecimal(value);
            console.log("amount==>>>", amount, value, walletData?.decimals);
          }
          console.log('here..........');
          let trxRaw =
            walletData.is_token == '0'
              ? await Singleton.getInstance().tronwebSendTRX(
                walletData.wallet_address,
                toAddress,
                value,
                pvtKey,
              )
              : await Singleton.getInstance().tronwebSendTRX20(
                walletData.wallet_address,
                toAddress,
                value,
                walletData.token_address,
                pvtKey,
                40000000,
              );

          console.log('trxRaw==>>>>', trxRaw);
          setTrxData(trxRaw);

          gasFeeFn(trxRaw)
            .then(async res => {
              console.log('gasFeeFn--res------->', res);
              setisLoading(false);

              console.log('left amount after gas - ', leftAmount);
              if (walletData.is_token == '1') {
                let trxBalance;
                try {
                  let tronWeb = Singleton.getInstance().tronWebObject(pvtKey);
                  trxBalance =
                    (await tronWeb.trx.getBalance(walletData.wallet_address)) ||
                    0;
                } catch (error) {
                  console.log('error in trxBalance fetch', error);
                  setshowConfirmTxnModal(true);
                  return;
                }
                console.log('trxBalance >>>>>>', trxBalance);

                let leftTrxAmount = trxBalance / 10 ** 6 - res?.data?.total;
                console.log('leftTrxAmount -->> ', leftTrxAmount);
                if (leftTrxAmount < 0) {
                  console.log('insufficient gas fee');
                  Singleton.showAlert(Constants.INSUFFICIENT_BALANCE_TRX);
                } else {
                  setshowConfirmTxnModal(true);
                }
              } else if (leftAmount - res.data.total > 0) {
                setshowConfirmTxnModal(true);
              } else {
                Singleton.showAlert(Constants.INSUFFICIENT_BALANCE_TRX);
                setshowConfirmTxnModal(false);
              }
            })
            .catch(err => {
              console.log('e->', err);
              setisLoading(false);
              if (showConfirmTxnModal) {
                setshowConfirmTxnModal(false);
              }
            });
        } catch (error) {
          console.log(error);
          setisLoading(false);
          if (showConfirmTxnModal) {
            setshowConfirmTxnModal(false);
          }
          Singleton.showAlert(error?.message || Constants.SOMETHING_WRONG);
        }
      } else {
        Singleton.showAlert(constants.VALID_ADDRESS);
      }
    }
  };

  const send = (signedRaw, coinSymbol, nonce) => {
    setisLoading(true);
    let data = {
      from: Singleton.getInstance().defaultTrxAddress,
      to: toAddress,
      amount: amount,
      gas_price: 0,
      gas_estimate: 0,
      tx_raw: signedRaw,
      tx_type: 'WITHDRAW',
      nonce: nonce,
      transaction_fee: gasFee?.total,
      // chat: this.props.chat
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain = Constants.NETWORK.TRON;
    let coin_symbol = coinSymbol;
    console.log('DATA======', data);
    props
      .sendETH({ data, access_token, blockChain, coin_symbol })
      .then(res => {
        let req = {
          to: toAddress,
          coinFamily: 3
        }
        props.CheckIsContactExist({ data: req, access_token }).then(response => {
          setBasicModal(true);
          basicModal = true
          setisLoading(false);
          isContact = response.is_contact == 0 ? true : false
        }).catch(err => {
          setBasicModal(true);
          basicModal = true
          setisLoading(false);
        })
      })
      .catch(err => {
        setisLoading(false);
        Singleton.showAlert(err.message);
      });
  };

  const qrClose = () => {
    settoAddress('');
    setStart_Scanner(false);
  };
  const onQR_Code_Scan_Done = QR_Code => {
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
          global.stop_pin = true;
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
          // console.warn(err);
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
        //console.warn('MM','pin:::::', pin);
        if (text == pin) {
          if (global.disconnected) {
            Singleton.showAlert(constants.NO_NETWORK);
            return;
          }
          // walletData?.is_token == 1 ? send_ERC20() : send_ETH();
          send(
            trxData,
            walletData?.is_token == 1
              ? walletData?.token_address
              : walletData?.coin_symbol,
            0,
          );
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
            setvisible={data => {
              setStart_Scanner(data);
              scanner = data;
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
                          {walletData.coin_symbol?.toUpperCase().charAt(0)}
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

                  {/* <Image
                    style={{
                      height: 17,
                      width: 10,
                      alignSelf: 'center',
                      marginEnd: 16,
                    }}
                    source={Images.rightArrow}
                  /> */}
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
                          // tintColor={ThemeManager.colors.textColor}
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
                          // tintColor={ThemeManager.colors.textColor}
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
                        // backgroundColor: Colors.inputDarkbg,
                        // borderWidth: 0,
                        // fontSize: 15,
                      }
                    }
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
                        setAmount(text);
                      }
                    }}
                    pressMax={() => {
                      maxClicked = true;
                      findMaxSend();
                    }}
                    max={`${walletData?.coin_symbol.toUpperCase()} `}
                    coinName={' Max'}
                    maxLength={25}
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
                      }}>{`${balance} ${walletData?.coin_symbol.toUpperCase()}`}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={{ marginVertical: 20, marginHorizontal: widthDimen(22) }}>
            <ButtonPrimary
              onpress={() => onSendAction()}
              btnstyle={{
                height: heightDimen(60),
                width: '100%',
                borderRadius: heightDimen(30),
              }}
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
            <Wrap
              style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
              {/* <SimpleHeader
                back={true}
                title={LanguageManager.confirmTransaction}
              /> */}
              <SimpleHeader
                title={LanguageManager.confirm}
                // rightImage={[styles.rightImgStyle]}
                backImage={ThemeManager.ImageIcons.iconBack}
                titleStyle
                imageShow
                back={false}
                backPressed={() => {
                  // props.navigation.state.params.onGoBack();
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
                      walletData?.perPrice_in_fiat * amount,
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
                  value={Singleton.getInstance().defaultTrxAddress}
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
                  value={parseFloat(gasFee?.total)}
                  fiatValue={Singleton.getInstance().toFixednew(
                    exponentialToDecimalWithoutComma(
                      parseFloat(gasFee?.total) *
                      walletData?.native_perPrice_in_fiat,
                    ),
                    2,
                  )}
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={
                    walletData?.is_token == 1
                      ? 'TRX'
                      : walletData?.coin_symbol.toUpperCase()
                  }
                  bottomLine={true}
                />

                <DetailOption
                  type={'AmountWithSmallText'}
                  item={'Total value'}
                  value={
                    walletData?.is_token == 1
                      ? `${parseFloat(
                        amount,
                      )} ${walletData?.coin_symbol.toUpperCase()} + ${parseFloat(
                        gasFee?.total,
                      )} `
                      : Singleton.getInstance().toFixed(
                        exponentialToDecimalWithoutComma(
                          parseFloat(amount) + parseFloat(gasFee?.total),
                        ),
                        2,
                      )
                  }
                  // fiatValue={walletData?.currency_symbol + (parseFloat(totalFee)).toFixed(2)}
                  fiatValue={
                    walletData?.is_token == 1
                      ? Singleton.getInstance().toFixednew(
                        exponentialToDecimalWithoutComma(
                          parseFloat(amount) * walletData?.perPrice_in_fiat +
                          parseFloat(gasFee?.total) *
                          walletData?.native_perPrice_in_fiat,
                        ),
                        2,
                      )
                      : Singleton.getInstance().toFixednew(
                        exponentialToDecimalWithoutComma(
                          (parseFloat(amount) + parseFloat(gasFee?.total)) *
                          walletData?.perPrice_in_fiat,
                        ),
                        2,
                      )
                  }
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={
                    walletData?.is_token == 1
                      ? 'TRX'
                      : walletData?.coin_symbol.toUpperCase()
                  }
                  bottomLine={false}
                />
                {/* <DetailOption
                  type={"AmountWithSmallText"}
                  item={"Network Fee"}
                  value={(parseFloat(gasFee?.total)).toFixed(8)}

                  fiatValue={((parseFloat(gasFee?.total)).toFixed(8) * walletData?.native_perPrice_in_fiat)}
                  fiatSymbol={walletData?.currency_symbol}
                  symbol={walletData?.is_token == 1 ? 'TRX' : walletData?.coin_symbol.toUpperCase()}
                  bottomLine={true}
                />

                <DetailOption
                  type={"AmountWithSmallText"}
                  item={"Total value"}
                  value={walletData?.is_token == 1
                    ? `${parseFloat(
                      amount,
                    )} ${walletData?.coin_symbol.toUpperCase()} + ${parseFloat(
                      gasFee?.total,
                    )} TRX`
                    : (parseFloat(amount) + parseFloat(gasFee?.total)).toFixed(8)}
                  // fiatValue={walletData?.currency_symbol + (parseFloat(totalFee)).toFixed(2)}
                  fiatValue={walletData?.is_token == 1 ?
                    (parseFloat(amount) * walletData?.perPrice_in_fiat) + (parseFloat(gasFee?.total) * walletData?.native_perPrice_in_fiat)
                    : ((parseFloat(amount) + parseFloat(gasFee?.total)).toFixed(8) * walletData?.perPrice_in_fiat)}
                  fiatSymbol={walletData?.currency_symbol}
                  symbol={walletData?.is_token == 1 ? '' : walletData?.coin_symbol.toUpperCase()}
                  bottomLine={false}
                /> */}
                {/* <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    width: '99%',
                    marginLeft: 22,
                  }}>
                  <AddressBox
                    img={{
                      uri: walletData?.coin_image.includes('https')
                        ? walletData?.coin_image
                        : BASE_IMAGE + walletData?.coin_image,
                    }}
                    // boxStyle={{}}
                    address={Singleton.getInstance().defaultTrxAddress}
                    title="From:"
                    walletName={Singleton.getInstance().walletName}
                  />
                  <Image
                    source={Images.roundArw}
                    style={{
                      height: 30,
                      marginTop: 22,
                      width: 30,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                  />
                  <AddressBox
                    img={{
                      uri: walletData?.coin_image.includes('https')
                        ? walletData?.coin_image
                        : BASE_IMAGE + walletData?.coin_image,
                    }}
                    address={toAddress}
                    title="To:"
                    walletName={''}
                  />
                </View> */}
                {/* <View style={styles.amountView}>
                  <Text
                    style={[
                      styles.textStyle,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    {LanguageManager.totalAmount}
                  </Text>
                  <Text
                    style={[
                      styles.amount,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    {walletData?.is_token == 1
                      ? `${parseFloat(
                        amount,
                      )} ${walletData?.coin_symbol.toUpperCase()} + ${gasFee?.total} TRX`
                      : ` ${(parseFloat(amount) + gasFee?.total)} TRX`
                    }
                  </Text>
                </View>  */}
              </View>
              <View
                style={{
                  marginBottom: heightDimen(20),
                  paddingHorizontal: widthDimen(22),
                }}>
                <ButtonPrimary
                  onpress={() => {
                    setshowConfirmTxnModal(false);
                    setTimeout(() => {
                      setPinModal(true);
                    }, 500);
                  }}
                  btnstyle={{ height: heightDimen(60), width: '100%' }}
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
})(SendTRX);
