/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Platform,
  PermissionsAndroid,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import styles from './MultiSenderEthStyle';
import {
  BasicButton,
  BorderLine,
  ButtonPrimary,
  Header,
  HeaderNew,
  IndicatorCreatePin,
  Inputtext,
  InputtextAddress,
  InputtextSearch,
  KeyboardDigit,
  LightButton,
  MainHeader,
  PinBtns,
  PinInput,
  SimpleHeader,
  Wrap,
} from '../../common';
import { Fonts, Images, Colors } from '../../../theme';
import * as constants from '../../../Constant';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Actions } from 'react-native-router-flux';
import Singleton, {
  multiSenderContractAddress,
  erc20MultiSenderContractAddress,
} from '../../../Singleton';
import { sendETH } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader';
import FastImage from 'react-native-fast-image';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { getEthBaseFee, getTotalGasFee } from '../../../utils';
import ReactNativeBiometrics from 'react-native-biometrics';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Web3 from 'web3';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { EventRegister } from 'react-native-event-listeners';
// export const multiSenderContractAddress =
//   constants.network == 'testnet'
//     ?"0x34fd17651CC48C7e3A0C31E5ea3152de075C4529"
//     : "0xFf3de9977a7240a697758f539DFf7C466d8C7D36";
// export const erc20MultiSenderContractAddress =
//   constants.network == 'testnet'
//     ? '0x65a864EcCFd4D67a43A00A3DE5585849eCE98Fc8' : '0x81f50b01D65A795B0d3a3369956d77878C7ea771'

let csvData = [];
const gwei_multi = 1000000000;
class MultiSenderEth extends Component {
  constructor(props) {
    super();
    this.state = {
      myNo: '',
      csvFile: '',
      csvName: '',
      amount: 0.0,
      isError: null,
      amountNew: 0.0,
      toAddress: '',
      selectedCoin: props?.selectedCoin,
      isLoading: false,
      gasPriceForTxn: 1000000000,
      gaslimitForTxn: 21000,
      gasFeeMultiplier: 0.000000000000000001,
      modalVisible: false,
      advancedGasPrice: 0,
      priorityFee: 0,
      advancedGasLimit: 0,
      advancedSet: false,
      MaxFee: 0,
      baseFee: 0,
      pinModal: false,
      FaceID: false,
      pin: '',
      existingPin: '',
      showImage: false,
      maxClicked: false,
      amountAfterCommission: 0,
      blockChain: 'ethereum',
      dataEncoded: '',
      gas_price_eth: '',
      totalFee: '',
      valueEth: 0,
      showTouch: false,
      showFace: false,
      commissionAmt: 20000000000000,
    };
  }

  componentDidMount() {
    EventRegister.addEventListener('downModal',()=>{
      this.setState({pinModal:false})
    })
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        //console.warn('MM','ethPvtKey--------', ethPvtKey);
        this.setState({ ethPvtKey: ethPvtKey });
      });
    Singleton.getInstance()
      .newGetData(constants.PIN)
      .then(pin => {
        this.setState({ existingPin: pin });
      });
    csvData = this.props.csvArray;
    let valueInCoin = 0;
    let toAddressMulti = '';
    csvData.map((item, index) => {
      if (index < csvData.length - 1)
        toAddressMulti += Web3.utils.toChecksumAddress(item.address) + ',';
      else toAddressMulti += Web3.utils.toChecksumAddress(item.address);
      valueInCoin += parseFloat(item.amount);
      //console.warn("MM",index , parseFloat(item?.amount) , valueInCoin);
    });

    this.setState({
      amount: valueInCoin,
      amountNew: valueInCoin,
      toAddress: toAddressMulti,
    });
    //  console.warn('MM','toAddress', toAddressMulti);
    this.getBaseFee();
    this.getTotalFee();
  }
  componentWillUnmount(){
    EventRegister.removeEventListener('downModal')
  }

  async getBaseFee() {
    const fee = await getEthBaseFee();
    console.log("fee:::", fee);
    this.setState({ baseFee: fee }, () => {
      console.warn('MM', 'chk fee:::::eth:::::::', this.state.baseFee)
    });
  }
  onSendAction() {
    if (this.state.isError) {
      Singleton.showAlert(this.state.isError)
      return
    }
    if (Singleton.getInstance().validateEthAddress(csvData[0].address)) {
      this.setState({ pinModal: true, pin: '' }, () =>{
        Singleton.getInstance()
        .newGetData(constants.ENABLE_PIN)
        .then(enablePin => {
          // alert(enablePin);
          console.warn('MM', 'chk enablePin app lock::::security', enablePin, "enablePin == 'false' ?", enablePin == 'false');
          enablePin == 'false'
            ?null
            : this.checkBiometricAvailability()
        });
      }
      );
    } else {
      Singleton.showAlert(
        `Enter valid ${this.props.selectedCoin.coin_symbol.toUpperCase()} address`,
      );
    }
  }

  checkBiometricAvailability() {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        this.enableBiometrics();
        this.setState({ showImage: true, showTouch: true, showFace: false });
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        this.enableBiometrics();
        this.setState({ showImage: true, showTouch: false, showFace: true });
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        this.enableBiometrics();
        this.setState({ showImage: true, showTouch: true, showFace: false });
      } else {
        global.showFingerPrint = false;
        //console.warn('MM','Biometrics not supported');
        this.setState({ showImage: false, showTouch: false, showFace: false });
      }
    });
  }
  enableBiometrics() {
    ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
      .then(resultObject => {
        const { success } = resultObject;
        if (success) {
          //console.warn('MM','successful biometrics provided');
          this.setState({ pinModal: false }, () => {
            this.props.selectedCoin.coin_symbol.toLowerCase() == 'eth'
              ? this.send_ETH()
              : this.send_ERC20();
          });
        } else {
          //console.warn('MM','user cancelled biometric prompt');
        }
      })
      .catch(() => {
        //console.warn('MM','biometrics failed');
      });
  }
  // async updatePin(text) {
  //   if (this.state.pin.length == 4) {
  //     return;
  //   }
  //   let pin = this.state.pin + text;
  //   await this.setState({ pin });
  //   if (pin.length == 4) {
  //     if (pin == this.state.existingPin) {
  //       this.setState({ pinModal: false }, () => {
  //         this.props.selectedCoin.coin_symbol.toLowerCase() == 'eth'
  //           ? this.send_ETH()
  //           : this.send_ERC20();
  //       });
  //     } else {
  //       this.refs.toast.show('Wrong PIN');
  //       this.setState({ pin: '' });
  //     }
  //   }
  // }
  updatePin = item => {
    if (item == ' ' || this.state.pin.length == 6) {
      return;
    }
    if (this.state.pin.length != 6) {
      this.setState({ pin: this.state.pin + item });

      if (this.state.pin.length == 5) {
        console.log('PINNNNN===', this.state.pin + item);
        let pin = this.state.pin + item;
        this.onProceed(pin);
      }
    }
  };
  deletePin = () => {
    if (this.state.pin.length == 0) {
      return;
    }
    this.setState({ pin: this.state.pin.slice(0, this.state.pin.length - 1) });
  };

  onProceed = text => {
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      return;
    }
    //console.warn('MM','-=-=-=-1==-=-=1=-=-=-=-=-', text);
    this.setState({ pin: text });
    Singleton.getInstance()
      .newGetData(constants.PIN)
      .then(pin => {
        //console.warn('MM','pin:::::', pin);
        if (text == pin) {
          if (global.disconnected) {
            Singleton.showAlert(constants.NO_NETWORK);
            return;
          }
          //   this.state.walletData.is_token == 1
          //     ? this.send_BEP20()
          //     : this.send_BNB();
          //   this.setState({pinModal: false});
          this.setState({ pinModal: false }, () => {
            this.props.selectedCoin.coin_symbol.toLowerCase() == 'eth'
              ? this.send_ETH()
              : this.send_ERC20();
          });
        } else {
          Singleton.showAlert(LanguageManager.wrongPin);
          this.setState({ pin: '' });
        }
      });
    return;
  };

  send_ETH() {
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      return;
    }
    console.log('Start Send');
    this.setState({ isLoading: true });
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      this.setState({ isLoading: false });
      return;
    }
    Singleton.getInstance()
      .getsignRawTxnEth(
        this.state.ethPvtKey,
        multiSenderContractAddress,
        this.state.amountAfterCommission,
        this.state.gaslimitForTxn,
        Singleton.getInstance().defaultEthAddress,
        this.state.dataEncoded,
        this.state.gasPriceForTxn,
      )
      .then(txn_raw => {
        if (global.disconnected) {
          Singleton.showAlert(constants.NO_NETWORK);
          this.setState({ isLoading: false });
          return;
        }
        //console.warn('MM','chk txn_raw_eth:::', txn_raw);
        this.send(
          txn_raw.signedRaw,
          this.props.selectedCoin.coin_symbol.toLowerCase(),
          txn_raw.nonce,
        );
      })
      .catch(err => {

        console.warn('MM', 'chk signed raw err::::::::::::', err);
        this.setState({ isLoading: false });
        if (err?.toString()?.includes("Couldn't connect")) {
          Singleton.showAlert(constants.NO_NETWORK);
          return;
        }
      });
  }

  send_ERC20() {
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      return;
    }
    this.setState({ isLoading: true });
    let contractAddress = this.props.selectedCoin.token_address;
    Singleton.getInstance()
      .getsignRawTxnEthToken(
        this.state.ethPvtKey,
        erc20MultiSenderContractAddress,
        this.state.gaslimitForTxn,
        Singleton.getInstance().defaultEthAddress,
        this.state.dataEncoded,
        this.state.valueEth,
        this.state.gasPriceForTxn,
      )
      .then(txn_raw => {
        //console.warn('MM','chk txn_raw_eth_token:::', txn_raw);
        this.send(txn_raw.signedRaw, contractAddress, txn_raw.nonce);
      })
      .catch(err => {
        if (err?.toString()?.includes("Couldn't connect")) {
          Singleton.showAlert(constants.NO_NETWORK);
          return;
        }
        //console.warn('MM','chk signed raw err::::::::::::', err);
        this.setState({ isLoading: false });
      });
  }
  send(signedRaw, coinSymbol, nonce) {
    this.setState({ isLoading: true });
    let data = {
      from: Singleton.getInstance().defaultEthAddress,
      to: this.state.toAddress,
      amount: this.state.amount,
      gas_price: this.state.gasPriceForTxn,
      gas_estimate: this.state.gaslimitForTxn,
      tx_raw: signedRaw,
      tx_type: 'WITHDRAW',
      nonce: nonce,
      chat: 0,
      multisender_reward:
        this.props.selectedCoin.coin_symbol.toLowerCase() == 'eth'
          ? parseFloat(this.state.commissionAmt).toFixed(8)
          : parseFloat(this.state.commissionAmt / 10 ** 18).toFixed(8),
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain = this.state.blockChain;
    let coin_symbol = coinSymbol;
    this.props
      .sendETH({ data, access_token, blockChain, coin_symbol })
      .then(res => {
        this.setState({ isLoading: false });
        Alert.alert(
          constants.APP_NAME,
          res.message,
          [
            {
              text: 'OK',
              onPress: () => {
                Actions.currentScene != 'Main' && Actions.replace('Main');
              },
            },
          ],
          { cancelable: false },
        );
      })
      .catch(err => {
        this.setState({ isLoading: false });
        Singleton.showAlert(err.message);
      });
  }
  deletePin() {
    let pin = this.state.pin;
    if (pin.length > 0) {
      pin = pin.slice(0, -1);
      this.setState({ pin });
    }
  }

  updatePriorityFee(text) {
    if (this.timer != undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getMaxFeee(text);
    }, 1000);
  }
  getMaxFeee(text) {
    this.setState({
      MaxFee: (parseFloat(this.state.baseFee) + parseFloat(text)).toString(),
    });
  }
  onSubmitGas() {
    if (parseFloat(this.state.advancedGasLimit) == 0.0) {
      Singleton.showAlert(constants.ENTER_GASLIMIT);
      return;
    }
    if (parseFloat(this.state.advancedGasLimit) < 21000) {
      Singleton.showAlert(constants.VALID_GASLIMIT);
      return;
    }

    if (parseFloat(this.state.priorityFee) == 0.0) {
      Singleton.showAlert(constants.VALID_PRIORITY_FEE);
      return;
    }

    this.setState({
      gasPriceForTxn: this.state.advancedGasPrice * gwei_multi,
      gaslimitForTxn: this.state.advancedGasLimit,
      totalFee: (
        (2 * this.state.baseFee + parseInt(this.state.priorityFee)) *
        this.state.gasFeeMultiplier *
        this.state.gaslimitForTxn
      ).toFixed(8),
      advancedSet: true,
      modalVisible: false,
      maxClicked: true,
    });
  }
  resetAction() {
    this.setState(
      {
        gaslimitForTxn: this.state.gaslimitForTxn,
        advancedSet: false,
        maxClicked: true,
      },
      () => {
        this.getTotalFee();
      },
    );
  }
  async getTotalFee() {
    this.setState({ isLoading: true });
    let addressArr = [];
    let amountArr = [];
    for (let i = 0; i < csvData.length; i++) {
      addressArr.push(Web3.utils.toChecksumAddress(csvData[i].address));
      amountArr.push(csvData[i].amount);
      console.warn('MM', csvData[i].address);
    }
    const Totalfee = await getTotalGasFee();
    console.warn('MM', 'Totalfee', Totalfee);
    if (this.props.selectedCoin.coin_symbol.toLowerCase() == 'eth') {
      //  console.warn('MM','address arr' , addressArr);
      //  console.warn('MM','this.props.referralAddress' , this.props.referralAddress);
      //  console.warn('MM','amount' , this.state.amount);
      //  console.warn('MM','amountArr' , amountArr);

      Singleton.getInstance()
        .getDataForMultiEth(
          addressArr,
          amountArr,
          this.props.selectedCoin.coin_family,
          this.state.amount,
          Singleton.getInstance().defaultEthAddress,
          this.props.referralAddress,
        )
        .then(res => {
          //0x0000000000000000000000000000000000000000  0x69DADB732E09994964B92256308Bd8204Aec7354
          console.warn('MM', 'chk res::::', res);
          console.warn('MM', 'chk Totalfee:::::eth:::::::', Totalfee);
          this.setState({
            gasPriceForTxn: Totalfee,
            amount: res.amountAfterCommission,
            totalFee: (
              Totalfee *
              this.state.gasFeeMultiplier *
              res.gasLimit
            ).toFixed(8),
            isLoading: false,
            gaslimitForTxn: res.gasLimit,
            amountAfterCommission: res.amountAfterCommission,
            dataEncoded: res.data,
            commissionAmt: res.commissionAmt,
          });
        })
        .catch(err => {
          if (err?.toString()?.toLowerCase()?.includes('insufficient')) {
            this.setState({ isError: 'Insufficient funds for Group transfer.' })
          }else{
            this.setState({ isError: 'Unable to send. Please try again later' })
          }
          console.warn('MM', 'errrrrr', err);
          this.setState({ isLoading: false });
        });
    } else {
      Singleton.getInstance()
        .getDataForMultiEthToken(
          addressArr,
          amountArr,
          this.props.selectedCoin.token_address,
          this.props.selectedCoin.decimals,
          this.props.selectedCoin.coin_family,
          this.state.amountNew,
          Singleton.getInstance().defaultEthAddress,
          this.props.referralAddress,
        )
        .then(res => {
          ////console.log(
          // 'chk data for token::::',
          //   res,
          //   'Totalfee',
          //   Totalfee,
          //   Totalfee * this.state.gasFeeMultiplier * res.gasLimit,
          // );
          const fee = Totalfee * this.state.gasFeeMultiplier * res.gasLimit;

          //console.warn('MM','fee--- ', fee);
          this.setState({
            gasPriceForTxn: Totalfee,
            amount: this.state.amount,
            totalFee: parseFloat(fee).toFixed(8).toString(),
            isLoading: false,
            gaslimitForTxn: res.gasLimit,
            amountAfterCommission: this.state.amount,
            dataEncoded: res.data,
            valueEth: res.amountAfterCommission,
            commissionAmt: res.commissionAmt,
          });
        })
        .catch(err => {
          if (err?.toString()?.toLowerCase()?.includes('insufficient')) {
            this.setState({ isError: 'Insufficient funds for Group transfer.' })
          }else{
            this.setState({ isError: 'Unable to send. Please try again later' })
          }
          console.warn('MM', 'errrrrr', err);
          this.setState({ isLoading: false });
        });
    }
  }
  render() {
    //  console.warn('MM','____' , this.state.amount);
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          {/* <MainHeader
            onpress2={() => alert('soon')}
            onpress3={() => alert('soon')}
            styleImg3={{tintColor: '#B1B1B1'}}
            // firstImg={Images.Bell}
            // secondImg={Images.scan}
            // thridImg={Images.hamburger}
            onChangedText={text => {
              // alert(text)
            }}
          /> */}

          <SimpleHeader
            title={LanguageManager.bulkTransfer}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            back
          />

          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />
          <View style={{ flex: 1 }}>
            <ScrollView
              bounces={false}
              keyboardShouldPersistTaps={'always'}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}>
              <Text
                style={[
                  styles.multiSendText,
                  {
                    color: ThemeManager.colors.textColor,
                  },
                ]}>
                Send your crypto assets to multiple addresses
              </Text>
              <View style={{ flex: 1 }}>
                <View style={[styles.step_list, { alignItems: 'flex-start' }]}>
                  <View style={[styles.step_Item, { alignItems: 'flex-start' }]}>
                    <View style={[styles.viewStatusStyle]} />

                    <View style={{ alignItems: 'center' }}>
                      <View
                        style={[
                          styles.step_item_title_view,
                          {
                            backgroundColor: ThemeManager.colors.primary,
                          },
                        ]}>
                        <Text
                          style={{
                            ...styles.step_item_title,
                            color: Colors.white,
                          }}>
                          1
                        </Text>
                      </View>
                      <Text
                        style={{
                          ...styles.step_item_text,
                          color: ThemeManager.colors.headingText,
                        }}>
                        Select
                      </Text>
                    </View>
                  </View>

                  <View style={styles.step_Item}>
                    <View
                      style={[
                        styles.viewStatusStyle,
                        { left: widthDimen(-20), width: widthDimen(80), borderColor: ThemeManager.colors.dotLine },
                      ]}
                    />
                    <View
                      style={[
                        styles.viewStatusStyle,
                        { left: widthDimen(60), width: widthDimen(105), borderColor: ThemeManager.colors.dotLine },
                      ]}
                    />


                    <View
                      style={[
                        styles.step_item_title_view,
                        {
                          backgroundColor: ThemeManager.colors.primary,
                        },
                      ]}>
                      <Text
                        style={{
                          ...styles.step_item_title,
                          color: Colors.white,
                        }}>
                        2
                      </Text>
                    </View>
                    <Text
                      style={{
                        ...styles.step_item_text,
                        color: ThemeManager.colors.headingText,
                      }}>
                      Approve
                    </Text>
                  </View>

                  <View style={[styles.step_Item, { alignItems: 'flex-end' }]}>
                    <View
                      style={[
                        styles.viewStatusStyle,
                        { left: widthDimen(-20), width: widthDimen(105), borderColor: ThemeManager.colors.dotLine },
                      ]}
                    />

                    <View style={{ alignItems: 'center' }}>
                      <View
                        style={[
                          styles.step_item_title_view,
                          {
                            backgroundColor: ThemeManager.colors.primary,
                          },
                        ]}>
                        <Text
                          style={{
                            ...styles.step_item_title,
                            color: Colors.white,
                          }}>
                          3
                        </Text>
                      </View>
                      <Text
                        style={{
                          ...styles.step_item_text,
                          color: ThemeManager.colors.headingText,
                        }}>
                        Bulk Transfer
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.transaction__options}>
                  <Text
                    style={[
                      styles.transaction_textStye,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    Transaction Fees (ETH){' '}
                  </Text>
                  {/* <TouchableOpacity
                    onPress={() => {
                      if (this.state.advancedSet) {
                        this.resetAction();
                      } else {
                        this.setState({modalVisible: true, MaxFee: ''});
                      }
                    }}
                    style={styles.transaction_adoptoin}>
                    <Text
                      style={[
                        styles.transaction_TextOptoin,
                        {color: ThemeManager.colors.textColor},
                      ]}>
                      {!this.state.advancedSet ? 'Advanced Options' : 'Reset'}
                    </Text>
                  </TouchableOpacity> */}
                </View>

                {/* *************************view for advanced********************************* */}
                {this.state.advancedSet && (
                  <Inputtext
                    value={this.state.totalFee}
                    style={[
                      styles.transactionFeeTextFieldStyle,
                      {
                        borderColor: ThemeManager.colors.viewBorderColor,
                        color: ThemeManager.colors.textColor,
                      },
                    ]}
                    editable={false}
                    labelStyle={[
                      styles.labelTextStyle1,
                      { color: ThemeManager.colors.textColor },
                    ]}
                  />
                )}
                {/* *************************view for default********************************* */}
                {!this.state.advancedSet && (
                  <View>
                    <Inputtext
                      style={[
                        styles.transactionFeeTextFieldStyle,
                        {
                          borderColor: ThemeManager.colors.viewBorderColor + 50,
                          color: ThemeManager.colors.textColor,
                          borderWidth: 1
                        },
                      ]}
                      placeholder="0"
                      labelStyle={[
                        styles.labelTextStyle1,
                        { color: ThemeManager.colors.textColor },
                      ]}
                      value={`${this.state.totalFee}`}
                      //   value={"dsda"}
                      editable={false}
                    />
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    shadowColor: ThemeManager.colors.shadowColor,
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.05,
                    elevation: 4,
                    //  backgroundColor: 'red',
                    paddingHorizontal: widthDimen(22),
                  }}>
                  <View
                    style={{
                      marginRight: '2%',
                      backgroundColor: ThemeManager.colors.mnemonicsView,
                      width: '48%',
                      padding: widthDimen(16),
                      borderRadius: widthDimen(17),
                      shadowColor: ThemeManager.colors.shadowColor,
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 3.05,
                      elevation: 4,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start', // Horizontal direction
                        alignItems: 'center', // Vertical direction
                      }}>
                      <FastImage
                        source={{ uri: this.props.selectedCoin.coin_image }}
                        style={styles.iconImageStyle}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <Text
                        style={[
                          styles.balanceLabelStyle,
                          { color: ThemeManager.colors.lightTextColor },
                        ]}>
                        {this.props.selectedCoin.coin_symbol.toUpperCase() +
                          ' ' +
                          'Balance'}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.balanceValueStyle,
                        { color: ThemeManager.colors.textColor },
                      ]}>
                      {Singleton.getInstance().toFixed(
                        this.props.selectedCoin.balance,
                        5,
                      )}
                    </Text>
                  </View>

                  <View
                    style={{
                      marginLeft: '2%',
                      backgroundColor: ThemeManager.colors.mnemonicsView,
                      width: '48%',
                      padding: widthDimen(16),
                      borderRadius: widthDimen(17),
                      shadowColor: ThemeManager.colors.shadowColor,
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 3.05,
                      elevation: 4,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start', // Horizontal direction
                        alignItems: 'center', // Vertical direction
                      }}>
                      <FastImage
                        source={{ uri: this.props.selectedCoin.coin_image }}
                        style={styles.iconImageStyle}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <Text
                        style={[
                          styles.balanceLabelStyle,
                          { color: ThemeManager.colors.lightTextColor },
                        ]}>
                        Total Amount
                      </Text>
                    </View>

                    {this.props.selectedCoin.coin_symbol.toUpperCase() ==
                      'ETH' && (
                        <Text
                          style={[
                            styles.balanceValueStyle,
                            { color: ThemeManager.colors.textColor },
                          ]}>
                          {
                            Singleton.getInstance().toFixed(this.state.amount, 8)
                            // + ' ' +
                            //   this.props.selectedCoin.coin_symbol.toUpperCase()
                          }
                        </Text>
                      )}
                    {this.props.selectedCoin.coin_symbol.toUpperCase() !=
                      'ETH' && (
                        <Text
                          style={[
                            styles.balanceValueStyle,
                            { color: ThemeManager.colors.textColor },
                          ]}>
                          {
                            Singleton.getInstance().toFixed(
                              this.state.amount,
                              8,
                            ) +
                            // ' ' +
                            // this.props.selectedCoin.coin_symbol.toUpperCase() +
                            ' + ' +
                            parseFloat(
                              this.state.commissionAmt / 10 ** 18,
                            ).toString()
                            // + ' ETH'
                          }
                        </Text>
                      )}
                  </View>
                </View>

                <View
                  style={{
                    marginTop: heightDimen(16),
                    marginHorizontal: widthDimen(22),
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                    paddingHorizontal: widthDimen(16),
                    paddingVertical: heightDimen(24),
                    borderRadius: widthDimen(17),
                    shadowColor: ThemeManager.colors.shadowColor,
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.05,
                    elevation: 4,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={[
                        styles.recipients_title_style,
                        { color: ThemeManager.colors.textColor },
                      ]}>
                      List of Recipients
                    </Text>

                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        Actions.currentScene != 'Recipient' &&
                          Actions.Recipient({ csvData: csvData });
                      }}>
                      {csvData.length > 1 && (
                        <Text
                          style={[
                            styles.recipients_moreTextStyle,
                            { color: ThemeManager.colors.primary },
                          ]}>
                          {csvData.length - 1} More {''}
                        </Text>
                      )}
                      <Image
                        source={Images.rightArrow}
                        style={{
                          tintColor: ThemeManager.colors.textColor,
                          width: widthDimen(10),
                          height: heightDimen(12),
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    style={[
                      styles.recipients_address_style,
                      { color: ThemeManager.colors.lightTextColor },
                    ]}>
                    {csvData.length > 0 ? csvData[0].address : null}
                  </Text>
                  {csvData.length == 1 && (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      style={[
                        styles.recipients_address_style,
                        { color: ThemeManager.colors.lightTextColor },
                      ]}>
                      {csvData.length > 0 ? csvData[0].amount : null}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.buttonStyle}>
                <BasicButton
                  text={LanguageManager.send}
                  onPress={() => this.onSendAction()}
                  btnStyle={styles.btnStyle}
                  customGradient={styles.customGrad}
                />
                <LightButton
                  onPress={() => {
                    Actions.pop()
                  }}
                  btnStyle={styles.cancelBtnStyle}
                  customGradient={styles.customGrad}
                  text="Cancel"
                />
              </View>
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
          {this.state.isLoading && <Loader color="white" />}
          {/* **********************************MODAL FOR ADVANCED GAS PRICE*********************************************** */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { }}>
            <View
              style={[
                styles.centeredView,
                { backgroundColor: ThemeManager.colors.backgroundColor },
              ]}>
              <SimpleHeader
                back={false}
                backPressed={() => this.setState({ modalVisible: false })}
                title={'Advanced Options'}
              />

              <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                extraScrollHeight={50}
                enableOnAndroid={true}
                contentContainerStyle={{ margin: 0, flexGrow: 1 }}
                bounces={false}>
                <View
                  style={[
                    styles.viewGas,
                    { backgroundColor: ThemeManager.colors.backgroundColor },
                  ]}>
                  <Inputtext
                    inputStyle={{
                      borderColor: ThemeManager.colors.importBorder,
                      borderWidth: 1,
                      borderRadius: 12,
                      color: ThemeManager.colors.textColor,
                    }}
                    label="Gas Limit"
                    placeholder="Please enter Gas Limit"
                    value={this.state.advancedGasLimit}
                    labelStyle={styles.labelTextStyle1}
                    keyboardType={'numeric'}
                    maxLength={10}
                    onChangeNumber={text =>
                      this.setState({ advancedGasLimit: parseFloat(text) })
                    }></Inputtext>

                  <Inputtext
                    inputStyle={{
                      borderColor: ThemeManager.colors.importBorder,
                      borderWidth: 1,
                      borderRadius: 12,
                      color: ThemeManager.colors.textColor,
                    }}
                    label="Max Priority Fee (Gwei)"
                    placeholder="Please enter Max Priority Fee"
                    labelStyle={[
                      styles.labelTextStyle1,
                      { color: ThemeManager.colors.textColor },
                    ]}
                    value={this.state.priorityFee}
                    keyboardType={'number-pad'}
                    maxLength={10}
                    onChangeNumber={text => {
                      this.setState({ priorityFee: parseFloat(text) }, () =>
                        this.updatePriorityFee(text),
                      );
                    }}></Inputtext>
                  <Inputtext
                    inputStyle={{
                      borderColor: ThemeManager.colors.importBorder,
                      borderWidth: 1,
                      borderRadius: 12,
                      color: ThemeManager.colors.textColor,
                    }}
                    label="Max Fee (Gwei)"
                    placeholder="Max Fee"
                    labelStyle={[
                      styles.labelTextStyle1,
                      { color: ThemeManager.colors.textColor },
                    ]}
                    value={this.state.MaxFee}
                    keyboardType={'numeric'}
                    editable={false}></Inputtext>
                  <View style={styles.buttonStylesSubmit}>
                    <ButtonPrimary
                      title="Submit"
                      onPress={() => this.onSubmitGas()}
                    />
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </Modal>

          {/* *********************************************************** MODAL FOR PIN ********************************************************************** */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.pinModal}
            onRequestClose={() => this.setState({ pinModal: false })}>
            {/* <Wrap
              style={{ backgroundColor: ThemeManager.colors.bg }}>
              <SimpleHeader
                back={false}
                backPressed={() => this.setState({ pinModal: false })}
                title={LanguageManager.ConfirmPin}
              />

              <BorderLine
                borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
              />

              <View style={{ alignItems: 'center', marginTop: 30 }}>
                <Text
                  style={{
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.lightTextColor,
                    fontSize: areaDimen(14),
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: heightDimen(160),
                    paddingHorizontal: widthDimen(22),
                    lineHeight: heightDimen(20),
                  }}>
                  {LanguageManager.enterSixDigitPin}
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: heightDimen(30),
                  flexDirection: 'row'
                }}>
             

                {[0, 1, 2, 3, 4, 5].map((item, index) => {
                  return (
                    <PinInput
                      key={item}
                      isActive={this.state.pin.length == 0 ? index == 0 ? true : false : this.state.pin.length == index + 1}
                      digit={this.state.pin.length > index ? "*" : ""}
                    />
                  );
                })}
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
                  updatePin={(item) => this.updatePin(item)}
                  deletePin={() => this.deletePin()}
                />
              </View>

            </Wrap> */}
            <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
              <SimpleHeader
                back={false}
                backPressed={() => this.setState({ pinModal: false })}
                title={''}
              />
              <View style={{ paddingHorizontal: widthDimen(22) }}>
                <Text
                  style={{
                    fontFamily: Fonts.semibold,
                    alignSelf: 'flex-start',
                    fontSize: areaDimen(30),
                    lineHeight: areaDimen(37),
                    marginTop: heightDimen(30),
                    color: ThemeManager.colors.textColor,
                  }}>
                  {LanguageManager.ConfirmPin}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.regular,
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
                            this.state.pin.length == 0
                              ? index == 0
                                ? true
                                : false
                              : this.state.pin.length == index + 1
                          }
                          digit={this.state.pin.length > index ? '*' : ''}
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
                  updatePin={item => this.updatePin(item)}
                  deletePin={() => this.deletePin()}
                />
              </View>
            </Wrap>
          </Modal>
          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.pinModal}
            onRequestClose={() => {
              this.setState({pinModal: false});
            }}>
            <Wrap>
              <Header
                openModal={true}
                onPressRight={() => this.setState({pinModal: false})}
                righticon={Images.modal_close_icon}
                title={'Enter PIN'}
              />
              <View
                style={{
                  paddingTop: 25,
                  flex: 1,
                  backgroundColor: Colors.screenBg,
                }}>
                <View style={styles.indicatorWrapStyle}>
                  <IndicatorCreatePin isActive={this.state.pin.length >= 1} />
                  <IndicatorCreatePin isActive={this.state.pin.length >= 2} />
                  <IndicatorCreatePin isActive={this.state.pin.length >= 3} />
                  <IndicatorCreatePin isActive={this.state.pin.length == 4} />
                </View>
                <View style={styles.enterPinWrap}>
                  <Text style={styles.enterPinTextStyle}>
                    Enter 4 Digit PIN
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <View style={styles.pinRow}>
                    <PinBtns
                      Numbers="1"
                      onPress={() => {
                        this.updatePin('1');
                      }}
                    />
                    <PinBtns
                      Numbers="2"
                      onPress={() => {
                        this.updatePin('2');
                      }}
                    />
                    <PinBtns
                      Numbers="3"
                      onPress={() => {
                        this.updatePin('3');
                      }}
                    />
                  </View>
                  <View style={styles.pinRow}>
                    <PinBtns
                      Numbers="4"
                      onPress={() => {
                        this.updatePin('4');
                      }}
                    />
                    <PinBtns
                      Numbers="5"
                      onPress={() => {
                        this.updatePin('5');
                      }}
                    />
                    <PinBtns
                      Numbers="6"
                      onPress={() => {
                        this.updatePin('6');
                      }}
                    />
                  </View>

                  <View style={styles.pinRow}>
                    <PinBtns
                      Numbers="7"
                      onPress={() => {
                        this.updatePin('7');
                      }}
                    />
                    <PinBtns
                      Numbers="8"
                      onPress={() => {
                        this.updatePin('8');
                      }}
                    />
                    <PinBtns
                      Numbers="9"
                      onPress={() => {
                        this.updatePin('9');
                      }}
                    />
                  </View>
                  <View style={styles.pinRow}>
                    <PinBtns
                      onPress={() => this.enableBiometrics()}
                      //   thumbImage={
                      //     this.state.showImage == true
                      //       ? this.state.showFace == true
                      //         ? Images.face_iconn
                      //         : Images.ThumbImpression
                      //       : null
                      //   }
                      //   imgStyle={{height: 30, width: 30, marginBottom: 20}}
                      //   tintColor={Colors.pinTextColor}
                      Numbers="BIO"
                    />
                    <PinBtns
                      Numbers="0"
                      onPress={() => {
                        this.updatePin('0');
                      }}
                    />
                    <PinBtns
                      //   thumbImage={Images.pinDelete}
                      onPress={() => {
                        this.deletePin();
                      }}
                      //   imgStyle={{marginBottom: 20}}
                      Numbers="<"
                    />
                  </View>
                </View>
              </View>
              <Toast positionValue={350} ref="toast" />
            </Wrap>
          </Modal> */}
        </Wrap>
        <SafeAreaView style={{ backgroundColor: Colors.screenBg }} />
      </>
    );
  }
}
const mapStateToProp = state => {
  return {};
};
export default connect(mapStateToProp, { sendETH })(MultiSenderEth);
