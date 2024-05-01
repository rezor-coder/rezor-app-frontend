import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import styles from './MultiSenderBNBStyle';
import {
  BasicButton,
  BorderLine,
  ButtonPrimary,
  ButtonTransaction,
  Header,
  HeaderNew,
  IndicatorCreatePin,
  Inputtext,
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
import { Actions } from 'react-native-router-flux';
import Singleton, {
  bep20MultiSenderContractAddress,
  multiSenderBnbContractAddress,
} from '../../../Singleton';
import {
  getBnbNonce,
  getBnbGasPrice,
  sendBNB,
  getBnbGasEstimate,
  saveTxn,
} from '../../../Redux/Actions';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader';
import Web3 from 'web3';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ReactNativeBiometrics from 'react-native-biometrics';
import Toast, { DURATION } from 'react-native-easy-toast';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
import { EventRegister } from 'react-native-event-listeners';
// export const multiSenderBnbContractAddress =
//   constants.network == 'testnet'
//     ? '0xEF3Cc16FAC12431799ae4ECc3b87BE5e9AD076e4'
//     : '0x8bB9752e8e405B8259E7BC191a96368cc0a46d83';

let csvData = [];
const gwei_multi = 1000000000;
class MultiSenderBNB extends Component {
  constructor() {
    super();
    this.state = {
      isError:'',
      myNo: '',
      csvFile: '',
      csvName: '',
      amount: 0.0,
      amountNew: 0.0,
      blockChain: 'binancesmartchain',
      isLoading: false,
      gasPriceForTxn: 1000000000,
      gasPriceForTxnSlow: 1000000000,
      gasPriceForTxnMedium: 8000000000,
      gasPriceForTxnHigh: 10000000000,
      gaslimitForTxn: '',
      gasFeeMultiplier: 0.000000000000000001,
      totalFee: '',
      balance: 0,
      modalVisible: false,
      advancedGasPrice: 0,
      advancedGasLimit: 0,
      advancedSet: false,
      to_Address: '',
      maxClicked: false,
      bnbPvtKey: '',
      pinModal: false,
      pin: '',
      existingPin: '',
      showImage: false,
      selectedFee: 'medium',
      amountAfterCommission: 0,
      dataEncoded: '',
      valueBnb: '',
      showFace: false,
      showTouch: false,
      commissionAmt: 20000000000000,
    };
  }

  componentDidMount() {
    EventRegister.addEventListener('downModal',()=>{
      this.setState({pinModal:false})
    })
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultBnbAddress}_pk`)
      .then(bnbPvtKey => {
        //console.warn('MM','bnbPvtKey--------', bnbPvtKey);
        this.setState({ bnbPvtKey: bnbPvtKey });
      });
    Singleton.getInstance()
      .newGetData(constants.PIN)
      .then(pin => {
        this.setState({
          existingPin: pin,
          to_Address: this.props.selectedAddress,
        });
      });
    csvData = this.props.csvArray;
    let valueInCoin = 0;
    let toAddressMulti = '';
    csvData.map((item, index) => {
      if (index < csvData.length - 1)
        toAddressMulti += Web3.utils.toChecksumAddress(item.address) + ',';
      else toAddressMulti += Web3.utils.toChecksumAddress(item.address);
      valueInCoin += parseFloat(item.amount);
    });
    this.setState(
      { amount: valueInCoin, toAddress: toAddressMulti, amountNew: valueInCoin },
      () => {
        this.getbnbEstimate();
      },
    );

    //console.warn('MM','toAddress', valueInCoin);
  }
  componentWillUnmount(){
    EventRegister.removeEventListener('downModal')
  }
  getbnbEstimate() {
    this.setState({ isLoading: true });
    let addressArr = [];
    let amountArr = [];
    for (let i = 0; i < csvData.length; i++) {
      addressArr.push(Web3.utils.toChecksumAddress(csvData[i].address));
      amountArr.push(csvData[i].amount);
      //console.warn('MM',csvData[i].address);
    }
    if (this.props.selectedCoin.coin_symbol.toLowerCase() == 'bnb') {
      //console.warn('MM','hereeee');
      Singleton.getInstance()
        .getDataForMultiEth(
          addressArr,
          amountArr,
          this.props.selectedCoin.coin_family,
          this.state.amountNew,
          Singleton.getInstance().defaultBnbAddress,
          this.props.referralAddress,
        )
        .then(res => {
          //  console.warn('MM','chk res bnb::::', res);
          this.setState({
            isLoading: false,
            amount: res?.amountAfterCommission,
            amountAfterCommission: res?.amountAfterCommission,
            dataEncoded: res.data,
            gaslimitForTxn: res.gasLimit,
            advancedGasLimit: res.gasLimit,
            commissionAmt: res.commissionAmt,
          });
          this.getBnbGasLimit(res);
        })
        .catch(err => {
          console.log("err:::::getDataForMultiEth",err);
          if (err?.toString()?.toLowerCase()?.includes('insufficient')) {
            this.setState({ isError: 'Insufficient funds for Group transfer.' })
          }else if (err?.toString()?.toLowerCase()?.includes('internet connection')) {
            this.setState({ isError: constants.NO_NETWORK})
          }else{
            this.setState({ isError: null })
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
          Singleton.getInstance().defaultBnbAddress,
          this.props.referralAddress,
        )
        .then(res => {
          //console.warn('MM','chk data for token:::BNB:', res);
          this.setState({
            isLoading: false,
            dataEncoded: res.data,
            valueBnb: res.amountAfterCommission,
            gaslimitForTxn: res.gasLimit,
            advancedGasLimit: res.gasLimit,
            commissionAmt: res.commissionAmt,
          });
          this.getBnbGasLimit(res);
        })
        .catch(err => {
          if (err?.toString()?.toLowerCase()?.includes('insufficient')) {
            this.setState({ isError: 'Insufficient funds for Group transfer.' })
          }else{
            this.setState({ isError: null })
          }
          console.warn('MM', 'errrrrr', err);
          this.setState({ isLoading: false });
        });
    }
  }

  getBnbGasLimit(res) {
    let data = {
      from: Singleton.getInstance().defaultBnbAddress,
      to: Singleton.getInstance().defaultBnbAddress,
      amount: this.state.amount,
    };
    let blockChain = this.state.blockChain;
    let access_token = Singleton.getInstance().access_token;
    let contractAddress =
      this.props.selectedCoin.coin_symbol.toLowerCase() == 'bnb'
        ? 'bnb'
        : this.props.selectedCoin.token_address;
    this.props
      .getBnbGasEstimate({ blockChain, data, contractAddress, access_token })
      .then(response => {
        //  console.warn('MM','response GAS--bnb ', response);
        let slowGasPrice =
          parseFloat(response.resultList[0].safe_gas_price) * gwei_multi;
        let mediumGasPrice =
          parseFloat(response.resultList[0].propose_gas_price) * gwei_multi;
        let heightGasPrice =
          parseFloat(response.resultList[0].fast_gas_price) * gwei_multi;
        let feeIs = slowGasPrice * res.gasLimit * this.state.gasFeeMultiplier;
        //console.warn('MM','feeIs---- ', feeIs);
        this.setState({
          gasPriceForTxn: slowGasPrice,
          gaslimitForTxn: res.gasLimit,
          gasPriceForTxnSlow: slowGasPrice,
          gasPriceForTxnMedium: mediumGasPrice,
          gasPriceForTxnHigh: heightGasPrice,
          totalFee: Singleton.getInstance()
            .exponentialToDecimal(feeIs)
            .toString(),
          amountAfterCommission:
            this.props.selectedCoin.coin_symbol.toLowerCase() == 'bnb'
              ? res.amountAfterCommission
              : this.state.amountNew,
          amount:
            this.props.selectedCoin.coin_symbol.toLowerCase() == 'bnb'
              ? res.amountAfterCommission
              : this.state.amountNew,
          dataEncoded: res.data,
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  }
  onSendAction() {
    if (this.state.isError) {
      Singleton.showAlert(this.state.isError)
      return
    }
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      return;
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
            this.props.selectedCoin.coin_symbol.toLowerCase() == 'bnb'
              ? this.send_BNB()
              : this.send_BEP20();
          });
        } else {
          //console.warn('MM','user cancelled biometric prompt');
        }
      })
      .catch(() => {
        //console.warn('MM','biometrics failed');
      });
  }
  send_BNB() {
    this.setState({ isLoading: true });
    let access_token = Singleton.getInstance().access_token;
    let blockChain = this.state.blockChain;
    let contractAddress = this.props.selectedCoin.token_address;
    let chainID = constants.network == 'testnet' ? 97 : 56;
    let coin_symbol = 'bnb';
    let wallet_address = Singleton.getInstance().defaultBnbAddress;
    let cmsnAmt = parseFloat(this.state.commissionAmt).toFixed(8);

    //console.warn('MM','WALLET_ADDRESS===', wallet_address);
    this.props
      .getBnbNonce({ wallet_address, access_token, blockChain, coin_symbol })
      .then(nonce => {
        //console.warn('MM','Chk bnb nonce::::::::', nonce);
        Singleton.getInstance()
          .getsignRawTxnBnb(
            this.state.bnbPvtKey,
            multiSenderBnbContractAddress,
            this.state.amountAfterCommission,
            this.state.gasPriceForTxn,
            this.state.gaslimitForTxn,
            nonce,
            Singleton.getInstance().defaultEthAddress,
            this.state.dataEncoded,
          )
          .then(txn_raw => {
            //console.warn('MM','chk txn_raw_bnb:::', txn_raw);
            this.saveTxn(txn_raw.transactionHash, cmsnAmt);
          })
          .catch(err => {
            //console.warn('MM','chk signed raw err::::::::::::', err);
            this.setState({ isLoading: false });
          });
      })
      .catch(err => {
        //console.warn('MM','Chk bnb nonce err::::::::', err);
      });
  }

  send_BEP20() {
    this.setState({ isLoading: true });
    let access_token = Singleton.getInstance().access_token;
    let blockChain = this.state.blockChain;
    let contractAddress = this.props.selectedCoin.token_address;
    let chainID = constants.network == 'testnet' ? 97 : 56;
    let coin_symbol = 'bnb';
    let wallet_address = Singleton.getInstance().defaultBnbAddress;
    let cmsAmount = parseFloat(this.state.commissionAmt / 10 ** 18).toString();
    this.props
      .getBnbNonce({ wallet_address, access_token, blockChain, coin_symbol })
      .then(nonce => {
        //console.warn('MM','Chk bnb nonce::::::::', nonce);
        Singleton.getInstance()
          .getsignRawTxnBnb(
            this.state.bnbPvtKey,
            bep20MultiSenderContractAddress,
            cmsAmount,
            this.state.gasPriceForTxn,
            this.state.gaslimitForTxn,
            nonce,
            Singleton.getInstance().defaultBnbAddress,
            this.state.dataEncoded,
          )
          .then(txn_raw => {
            //console.warn('MM','chk txn_raw_bnb_token:::', txn_raw);
            this.saveTxn(txn_raw.transactionHash, cmsAmount);
          })
          .catch(err => {
            //console.warn('MM','chk signed raw err::::::::::::', err);
            this.setState({ isLoading: false });
          });
      })
      .catch(err => {
        //console.warn('MM','Chk bnb nonce err::::::::', err);
      });
  }
  saveTxn(hash, cmsnAmt) {
    let data = {
      from: Singleton.getInstance().defaultBnbAddress,
      to: multiSenderBnbContractAddress,
      amount: this.state.amount,
      gas_price: this.state.gasPriceForTxn,
      gas_estimate: this.state.gaslimitForTxn,
      tx_raw: '',
      tx_hash: hash,
      tx_type: 'WITHDRAW',
      chat: 0,
      is_smart: 1,
      multisender_reward: cmsnAmt,
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain = this.state.blockChain;
    let coin_symbol =
      this.props.selectedCoin.coin_symbol.toLowerCase() == 'bnb'
        ? 'bnb'
        : this.props.selectedCoin.token_address;
    this.props
      .saveTxn({ data, access_token, blockChain, coin_symbol })
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
        // this.checkPin(this.state.pin + item);
        // if (pin == this.state.existingPin) {
        //   this.setState({ pinModal: false }, () => {
        //     this.props.selectedCoin.coin_symbol.toLowerCase() == 'eth'
        //       ? this.send_ETH()
        //       : this.send_ERC20();
        //   });
        // } else {
        //   // this.refs.toast.show('Wrong PIN');
        //   Singleton.showAlert('Wrong PIN');
        //   this.setState({ pin: '' });
        // }
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
            this.props.selectedCoin.coin_symbol.toLowerCase() == 'bnb'
              ? this.send_BNB()
              : this.send_BEP20();
          });
        } else {
          Singleton.showAlert(LanguageManager.wrongPin);
          this.setState({ pin: '' });
        }
      });
    return;
  };
  // deletePin() {
  //   let pin = this.state.pin;
  //   if (pin.length > 0) {
  //     pin = pin.slice(0, -1);
  //     this.setState({ pin });
  //   }
  // }
  onSubmitGas() {
    if (parseFloat(this.state.advancedGasPrice) == 0.0) {
      Singleton.showAlert(constants.VALID_GASPRICE);
      return;
    }
    if (parseFloat(this.state.advancedGasLimit) == 0.0) {
      Singleton.showAlert(constants.ENTER_GASLIMIT);
      return;
    }
    if (parseFloat(this.state.advancedGasLimit) < this.state.gaslimitForTxn) {
      Singleton.showAlert(
        `Gas limit must be at least ${this.state.gaslimitForTxn}`,
      );
      return;
    }

    this.setState({
      gasPriceForTxn: this.state.advancedGasPrice * gwei_multi,
      gaslimitForTxn: this.state.advancedGasLimit,
      totalFee: (
        this.state.advancedGasPrice *
        this.state.advancedGasLimit *
        this.state.gasFeeMultiplier *
        gwei_multi
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
      () => this.getbnbEstimate(),
    );
  }
  slowAction() {
    this.setState({
      selectedFee: 'slow',
      gasPriceForTxn: this.state.gasPriceForTxnSlow,
      totalFee:
        this.state.gasPriceForTxnSlow *
        this.state.gaslimitForTxn *
        this.state.gasFeeMultiplier,
    });
  }
  mediumAction() {
    this.setState({
      selectedFee: 'medium',
      gasPriceForTxn: this.state.gasPriceForTxnMedium,
      totalFee:
        this.state.gasPriceForTxnMedium *
        this.state.gaslimitForTxn *
        this.state.gasFeeMultiplier,
    });
  }
  highAction() {
    this.setState({
      selectedFee: 'high',
      gasPriceForTxn: this.state.gasPriceForTxnHigh,
      totalFee:
        this.state.gasPriceForTxnHigh *
        this.state.gaslimitForTxn *
        this.state.gasFeeMultiplier,
    });
  }
  render() {
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

          <View style={{ flex: 1, backgroundColor: ThemeManager.colors.bg }}>
            <ScrollView
              bounces={false}
              keyboardShouldPersistTaps={'always'}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}>
              <Text
                style={[
                  styles.multiSendText,
                  { color: ThemeManager.colors.textColor },
                ]}>
                Send your crypto assets to multiple addresses
              </Text>
              <View style={{ flex: 1 }}>
                {/* <View style={[styles.step_list, { alignItems: 'center' }]}>
                  <View style={styles.step_Item}>
                    <Text
                      style={{
                        ...styles.step_item_title,
                        color: ThemeManager.colors.textColor,
                        fontSize: 26,
                      }}>
                      1
                    </Text>
                    <Text
                      style={{
                        ...styles.step_item_text,
                        color: ThemeManager.colors.textColor,
                        fontSize: 14,
                      }}>
                      Select
                    </Text>
                  </View>
                  <View style={styles.step_Item}>
                    <Text
                      style={{
                        ...styles.step_item_title,
                        color: ThemeManager.colors.textColor,
                        fontSize: 26,
                      }}>
                      2
                    </Text>
                    <Text
                      style={{
                        ...styles.step_item_text,
                        color: ThemeManager.colors.textColor,
                        fontSize: 14,
                      }}>
                      Approve
                    </Text>
                  </View>
                  <View style={styles.step_Item}>
                    <Text
                      style={{
                        ...styles.step_item_title,
                        color: ThemeManager.colors.textColor,
                        fontSize: 26,
                      }}>
                      3
                    </Text>
                    <Text
                      style={{
                        ...styles.step_item_text,
                        color: ThemeManager.colors.textColor,
                        fontSize: 14,
                      }}>
                      Bulk transfer
                    </Text>
                  </View>
                </View> */}
                <View style={[styles.step_list, { alignItems: 'flex-start' }]}>
                  <View style={[styles.step_Item, { alignItems: 'flex-start' }]}>
                    <View style={[styles.viewStatusStyle, { borderColor: ThemeManager.colors.dotLine }]} />

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
                    Transaction Fees (BNB){' '}
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
                    <Text style={styles.transaction_TextOptoin}>
                      {!this.state.advancedSet ? 'Advanced Options' : 'Reset'}
                    </Text>
                  </TouchableOpacity> */}
                </View>

                {/* *************************view for advanced********************************* */}
                {this.state.advancedSet && (
                  <Inputtext
                    value={this.state.totalFee}
                    editable={false}
                    labelStyle={styles.labelTextStyle1}
                  />
                )}
                {/* *************************view for default********************************* */}
                {!this.state.advancedSet && (
                  <View style={styles.feeWrap}>
                    <ButtonTransaction
                      style={{
                        backgroundColor:
                          this.state.selectedFee == 'slow'
                            ? ThemeManager.colors.primary //Colors.buttonColor5
                            : ThemeManager.colors.swapBg, //Colors.lightGrey2,
                        marginHorizontal: widthDimen(4),
                      }}
                      onPress={() => this.slowAction()}
                      label="Slow"
                      transactionfee={
                        parseFloat(
                          this.state.gasPriceForTxnSlow *
                          this.state.gaslimitForTxn *
                          this.state.gasFeeMultiplier,
                        ).toFixed(8) + ' BNB'
                      }
                      isSelected={
                        this.state.selectedFee == 'slow' ? true : null
                      }
                      labelStyle={{
                        color:
                          this.state.selectedFee == 'slow'
                            ? Colors.white
                            : ThemeManager.colors.textColor,
                      }}
                      transactionfeeTextStyle={{
                        color:
                          this.state.selectedFee == 'slow'
                            ? Colors.white
                            : ThemeManager.colors.textColor,
                      }}
                    />
                    <ButtonTransaction
                      style={{
                        backgroundColor:
                          this.state.selectedFee == 'medium'
                            ? ThemeManager.colors.primary //Colors.buttonColor5
                            : ThemeManager.colors.swapBg, //Colors.lightGrey2,
                        marginHorizontal: widthDimen(4),
                      }}
                      onPress={() => this.mediumAction()}
                      label="Average"
                      transactionfee={
                        parseFloat(
                          this.state.gasPriceForTxnMedium *
                          this.state.gaslimitForTxn *
                          this.state.gasFeeMultiplier,
                        ).toFixed(8) + ' BNB'
                      }
                      isSelected={
                        this.state.selectedFee == 'medium' ? true : null
                      }
                      labelStyle={{
                        color:
                          this.state.selectedFee == 'medium'
                            ? Colors.white
                            : ThemeManager.colors.textColor,
                      }}
                      transactionfeeTextStyle={{
                        color:
                          this.state.selectedFee == 'medium'
                            ? Colors.white
                            : ThemeManager.colors.textColor,
                      }}
                    />
                    <ButtonTransaction
                      style={{
                        backgroundColor:
                          this.state.selectedFee == 'high'
                            ? ThemeManager.colors.primary //Colors.buttonColor5
                            : ThemeManager.colors.swapBg, //Colors.lightGrey2,
                        marginHorizontal: widthDimen(4),
                      }}
                      onPress={() => this.highAction()}
                      label="Fast"
                      // style={styles.noRightBorder}
                      transactionfee={
                        parseFloat(
                          this.state.gasPriceForTxnHigh *
                          this.state.gaslimitForTxn *
                          this.state.gasFeeMultiplier,
                        ).toFixed(8) + ' BNB'
                      }
                      isSelected={
                        this.state.selectedFee == 'high' ? true : null
                      }
                      labelStyle={{
                        color:
                          this.state.selectedFee == 'high'
                            ? Colors.white
                            : ThemeManager.colors.textColor,
                      }}
                      transactionfeeTextStyle={{
                        color:
                          this.state.selectedFee == 'high'
                            ? Colors.white
                            : ThemeManager.colors.textColor,
                      }}
                    />
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    //  backgroundColor: 'red',
                    paddingHorizontal: widthDimen(22),
                    marginTop: heightDimen(20),
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
                      'BNB' && (
                        <Text
                          style={[
                            styles.balanceValueStyle,
                            { color: ThemeManager.colors.textColor },
                          ]}>
                          {
                            Singleton.getInstance().toFixed(this.state.amount, 8)
                            // +  ' ' +
                            //   this.props.selectedCoin.coin_symbol.toUpperCase()
                          }
                        </Text>
                      )}
                    {this.props.selectedCoin.coin_symbol.toUpperCase() !=
                      'BNB' && (
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
                            //  + ' BNB'
                          }
                        </Text>
                      )}
                  </View>
                </View>

                {/* <View style={{ marginTop: 10, marginHorizontal: 22 }}>
                  <Text
                    style={[
                      styles.balanceLabelStyle,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    Balance
                  </Text>
                  <Text
                    style={[
                      styles.balanceValueStyle,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    {Singleton.getInstance().toFixed(
                      this.props.selectedCoin.balance,
                      5,
                    ) +
                      ' ' +
                      this.props.selectedCoin.coin_symbol.toUpperCase()}
                  </Text>
                </View> */}

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
                          {csvData.length - 1} More{''}
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

                  {/* <Text
                    style={[
                      styles.recipients_title_style,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    List of Recipients
                  </Text>
                  <Text
                    style={[
                      styles.recipients_address_style,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    {csvData.length > 0 ? csvData[0].address : null}
                  </Text>
                  {csvData.length == 1 && (
                    <Text style={[styles.recipients_address_style]}>
                      {csvData.length > 0 ? csvData[0].amount : null}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      Actions.currentScene != 'Recipient' &&
                        Actions.Recipient({ csvData: csvData });
                    }}>
                    {csvData.length > 1 && (
                      <Text
                        style={[
                          styles.recipients_moreTextStyle,
                          { color: ThemeManager.colors.textColor },
                        ]}>
                        {csvData.length - 1} More
                      </Text>
                    )}
                  </TouchableOpacity> */}
                </View>

                {/* <View style={{ marginTop: 60, marginHorizontal: 22 }}>
                  <Text
                    style={[
                      styles.balanceLabelStyle,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    Total Amount
                  </Text>
                  {this.props.selectedCoin.coin_symbol.toUpperCase() ==
                    'BNB' && (
                      <Text
                        style={[
                          styles.balanceValueStyle,
                          { color: ThemeManager.colors.textColor },
                        ]}>
                        {Singleton.getInstance().toFixed(this.state.amount, 8) +
                          ' ' +
                          this.props.selectedCoin.coin_symbol.toUpperCase()}
                      </Text>
                    )}
                  {this.props.selectedCoin.coin_symbol.toUpperCase() !=
                    'BNB' && (
                      <Text
                        style={[
                          styles.balanceValueStyle,
                          { color: ThemeManager.colors.textColor },
                        ]}>
                        {Singleton.getInstance().toFixed(this.state.amount, 8) +
                          ' ' +
                          this.props.selectedCoin.coin_symbol.toUpperCase() +
                          ' + ' +
                          parseFloat(
                            this.state.commissionAmt / 10 ** 18,
                          ).toString() +
                          ' BNB'}
                      </Text>
                    )}
                </View> */}
              </View>
              <View style={[styles.buttonStyle]}>
                <BasicButton
                  text={LanguageManager.send}
                  onPress={() => this.onSendAction()}
                  btnStyle={styles.btnStyle}
                  customGradient={styles.customGrad}
                />
                <LightButton
                  onPress={() => Actions.pop()}
                  btnStyle={styles.cancelBtnStyle}
                  customGradient={styles.customGrad}
                  text="Cancel"
                />
              </View>
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
          {this.state.isLoading && <Loader color="white" />}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { }}>
            <View style={styles.centeredView}>
              <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                extraScrollHeight={50}
                enableOnAndroid={true}
                contentContainerStyle={{ margin: 0, flexGrow: 1 }}
                bounces={false}>
                <TouchableOpacity
                  onPress={() => this.setState({ modalVisible: false })}
                  style={{
                    flex: 0.5,
                    backgroundColor: Colors.screenBg,
                    opacity: 0.85,
                  }}></TouchableOpacity>
                <View style={styles.viewGas}>
                  <Inputtext
                    label="Gas Price"
                    placeholder="Please enter Gas Price"
                    value={this.state.advancedGasPrice}
                    labelStyle={styles.labelTextStyle}
                    keyboardType="decimal-pad"
                    maxLength={10}
                    onChangeNumber={text =>
                      this.setState({ advancedGasPrice: text })
                    }></Inputtext>

                  <Inputtext
                    label="Gas Limit"
                    placeholder="Please enter Gas Limit"
                    value={this.state.advancedGasLimit}
                    labelStyle={styles.labelTextStyle}
                    keyboardType={'number-pad'}
                    onChangeNumber={text =>
                      this.setState({ advancedGasLimit: text })
                    }></Inputtext>
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

              <View style={{ alignItems: 'center' }}>
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
                style={[{
                  justifyContent: 'flex-end',
                  flex: 1,
                  marginTop: heightDimen(102)
                }
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
            <>
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
                        thumbImage={
                          this.state.showImage == true
                            ? this.state.showFace == true
                              ? Images.face_iconn
                              : Images.ThumbImpression
                            : null
                        }
                        imgStyle={{height: 30, width: 30, marginBottom: 20}}
                        tintColor={Colors.pinTextColor}
                      />
                      <PinBtns
                        Numbers="0"
                        onPress={() => {
                          this.updatePin('0');
                        }}
                      />
                      <PinBtns
                        thumbImage={Images.pinDelete}
                        onPress={() => {
                          this.deletePin();
                        }}
                        imgStyle={{marginBottom: 20}}
                      />
                    </View>
                  </View>
                </View>
                <Toast positionValue={350} ref="toast" />
              </Wrap>
              <SafeAreaView style={{backgroundColor: Colors.screenBg}} />
            </>
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
export default connect(mapStateToProp, {
  getBnbNonce,
  getBnbGasPrice,
  sendBNB,
  getBnbGasEstimate,
  saveTxn,
})(MultiSenderBNB);
