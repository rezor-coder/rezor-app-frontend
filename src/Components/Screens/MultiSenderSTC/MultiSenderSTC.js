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
import styles from './MultiSenderSTCStyle';
import {
  BasicButton,
  BorderLine,
  ButtonPrimary,
  ButtonTransaction,
  Inputtext,
  KeyboardDigit,
  LightButton,
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
  multiSenderSTCContractAddress,
  multiSenderSTCERC20ContractAddress,
} from '../../../Singleton';
import {
  getBnbNonce,
  getBnbGasPrice,
  sendBNB,
  saveTxn,
  getSTCGasPrice,
  getStcGasEstimate
} from '../../../Redux/Actions';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader';
import Web3 from 'web3';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ReactNativeBiometrics from 'react-native-biometrics';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
import { EventRegister } from 'react-native-event-listeners';
import { bigNumberSafeMath, getStcNonce } from '../../../utils';

let csvData = [];
const gwei_multi = 1000000000;
class MultiSenderSTC extends Component {
  constructor() {
    super();
    this.state = {
      isError: '',
      myNo: '',
      csvFile: '',
      csvName: '',
      amount: 0.0,
      amountNew: 0.0,
      blockChain: 'saitachain',
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
    EventRegister.addEventListener('downModal', () => {
      this.setState({ pinModal: false })
    })
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultStcAddress}_pk`)
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
      console.log("item.amount::::::::::",item.amount);
      if (index < csvData.length - 1)
        toAddressMulti += Web3.utils.toChecksumAddress(item.address) + ',';
      else toAddressMulti += Web3.utils.toChecksumAddress(item.address);
      valueInCoin += parseFloat(item.amount);
    });
    console.log("valueInCoinvalueInCoin:::::::::",valueInCoin);
    this.setState(
      { amount: Singleton.getInstance().toFixednew(valueInCoin,8), toAddress: toAddressMulti, amountNew: valueInCoin },
      () => {
        this.getbnbEstimate();
      },
    );

    //console.warn('MM','toAddress', valueInCoin);
  }
  componentWillUnmount() {
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
    if (this.props.selectedCoin.is_token == 0) {
      console.warn('MM', 'hereeee');
      Singleton.getInstance().getDataForMultiSTC(
        addressArr,
        amountArr,
        this.props.selectedCoin.coin_family,
        Singleton.getInstance().toFixednew(this.state.amountNew,8),
        Singleton.getInstance().defaultStcAddress,
        this.props.referralAddress,
      )
        .then(res => {
          console.warn('MM', 'chk res stc::::', res);
          this.setState({
            amount: res?.amountAfterCommission,
            amountAfterCommission: res?.amountAfterCommission,
            dataEncoded: res.data,
            // gaslimitForTxn: res.gasLimit,
            // advancedGasLimit: res.gasLimit,
            commissionAmt: res.commissionAmt,
          });
          this.getBnbGasLimit(res);
        })
        .catch(err => {
          console.log("err:::::getDataForMultiEth", err);
          if (err?.toString()?.toLowerCase()?.includes('insufficient')) {
            this.setState({ isError: 'Insufficient funds for Group transfer.' })
          } else if (err?.toString()?.toLowerCase()?.includes('internet connection')) {
            this.setState({ isError: constants.NO_NETWORK })
          } else {
            this.setState({ isError: null })
          }
          console.warn('MM', 'errrrrr', err);
          this.setState({ isLoading: false });
        });
    } else {
      Singleton.getInstance()
        .getDataForMultiSTCToken(
          addressArr,
          amountArr,
          this.props.selectedCoin.token_address,
          this.props.selectedCoin.decimals,
          Singleton.getInstance().defaultStcAddress,
          this.props.referralAddress,
        )
        .then(res => {
          console.warn('MM', 'chk data for token:::STC:', res);
          this.setState({
            dataEncoded: res.data,
            valueBnb: res.amountAfterCommission,
            advancedGasLimit: res.gasLimit,
            commissionAmt: res.commissionAmt,
            // gaslimitForTxn: res.gasLimit,
          });
          this.getBnbGasLimit(res);
        })
        .catch(err => {
          if (err?.toString()?.toLowerCase()?.includes('insufficient')) {
            this.setState({ isError: 'Insufficient funds for Group transfer.' })
          } else {
            this.setState({ isError: null })
          }
          console.warn('MM', 'errrrrr', err);
          this.setState({ isLoading: false });
        });
    }
  }

  getBnbGasLimit(res) {
    let access_token = Singleton.getInstance().access_token;
    this.props.getSTCGasPrice().then(gasPrices => {
      console.log("gasPrices:::::", gasPrices);
      this.props
        .getStcGasEstimate({ access_token })
        .then(response => {
          let { gasLimit } = response.data.find(item => item.name == 'bulkTransfer')
          console.warn('MM', 'response GAS--stc ', gasLimit);
          let slowGasPrice =
            parseFloat(gasPrices?.data?.safeGasPrice) * gwei_multi;
          let mediumGasPrice =
            parseFloat(gasPrices?.data?.proposeGasPrice) * gwei_multi;
          let heightGasPrice =
            parseFloat(gasPrices?.data?.fastGasPrice) * gwei_multi;
          let feeIs = mediumGasPrice *
            gasLimit *
            this.state.gasFeeMultiplier;
          this.setState({
            gasPriceForTxn: slowGasPrice,
            gaslimitForTxn: gasLimit,
            gasPriceForTxnSlow: slowGasPrice,
            gasPriceForTxnMedium: mediumGasPrice,
            gasPriceForTxnHigh: heightGasPrice,
            advancedGasLimit:gasLimit,
            totalFee: Singleton.getInstance()
              .exponentialToDecimal(feeIs)
              .toString(),
            amountAfterCommission:
              this.props.selectedCoin.coin_symbol.toLowerCase() == 'stc'
                ? res.amountAfterCommission
                : this.state.amountNew,
            amount:
              this.props.selectedCoin.coin_symbol.toLowerCase() == 'stc'
                ? res.amountAfterCommission
                : this.state.amountNew,
            dataEncoded: res.data,
            isLoading: false,
          });
        })
        .catch(error => {
          this.setState({ isLoading: false });
          Singleton.showAlert(error?.message || constants.SOMETHING_WRONG);
        });
    }).catch(err => {
      console.log(err);
      this.setState({ isLoading: false });
      Singleton.showAlert(err?.message || constants.SOMETHING_WRONG);
    })
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
      this.setState({ pinModal: true, pin: '' }, () => {
        Singleton.getInstance()
          .newGetData(constants.ENABLE_PIN)
          .then(enablePin => {
            // alert(enablePin);
            console.warn('MM', 'chk enablePin app lock::::security', enablePin, "enablePin == 'false' ?", enablePin == 'false');
            enablePin == 'false'
              ? null
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
            this.props.selectedCoin.coin_symbol.toLowerCase() == 'stc'
              ? this.send_STC()
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
  send_STC() {
    console.log("send_STC:::::");
    this.setState({ isLoading: true });
    let wallet_address = Singleton.getInstance().defaultStcAddress;
    let cmsnAmt = parseFloat(this.state.commissionAmt).toFixed(8);

    console.warn('MM', 'WALLET_ADDRESS===', wallet_address);
    getStcNonce(wallet_address)
      .then(nonce => {
        console.warn('MM', 'Chk stc nonce::::::::', nonce);
        Singleton.getInstance()
          .getsignRawTxnStc(
            this.state.bnbPvtKey,
            multiSenderSTCContractAddress,
            this.state.amountAfterCommission,
            this.state.gasPriceForTxn,
            this.state.gaslimitForTxn,
            nonce,
            Singleton.getInstance().defaultStcAddress,
            this.state.dataEncoded,
          )
          .then(txn_raw => {
            console.warn('MM', 'chk txn_raw_bnb_token:::', txn_raw);
            this.saveTxn(txn_raw.transactionHash, this.state.amountAfterCommission);
          })
          .catch(err => {
            console.warn('MM', 'chk signed raw err::::::::::::', err);
            this.setState({ isLoading: false });
            Singleton.showAlert(constants.SOMETHING_WRONG)
          });
      })
      .catch(err => {
        console.warn('MM', 'Chk bnb nonce err::::::::', err);
      });
  }

  send_ERC20() {
    console.log("send_ERC20:::::");
    this.setState({ isLoading: true });
    let wallet_address = Singleton.getInstance().defaultStcAddress;
    let cmsAmount = parseFloat(this.state.commissionAmt / 10 ** 18).toString();
    getStcNonce(wallet_address)
      .then(nonce => {
        console.warn('MM', 'Chk stc nonce::::::::', nonce);
        Singleton.getInstance()
          .getsignRawTxnStc(
            this.state.bnbPvtKey,
            multiSenderSTCERC20ContractAddress,
            cmsAmount,
            this.state.gasPriceForTxn,
            this.state.gaslimitForTxn,
            nonce,
            Singleton.getInstance().defaultStcAddress,
            this.state.dataEncoded,
          )
          .then(txn_raw => {
            console.warn('MM', 'chk txn_raw_bnb_token:::', txn_raw);
            this.saveTxn(txn_raw.transactionHash, cmsAmount);
          })
          .catch(err => {
            console.warn('MM', 'chk signed raw err::::::::::::', err);
            this.setState({ isLoading: false });
          });
      })
      .catch(err => {
        console.warn('MM', 'Chk stc nonce err::::::::', err);
        this.setState({ isLoading: false });
      });
  }
  saveTxn(hash, cmsnAmt) {
    
    let data = {
      from: Singleton.getInstance().defaultStcAddress,
      to: multiSenderBnbContractAddress,
      amount: Singleton.getInstance().toFixednew(this.state.amount,8),
      gas_price: this.state.gasPriceForTxn,
      gas_estimate: this.state.gaslimitForTxn,
      tx_raw: '',
      tx_hash: hash,
      tx_type: 'WITHDRAW',
      chat: 0,
      is_smart: 1,
      chainId: 1209,
      multisender_reward: cmsnAmt,
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain = this.state.blockChain;
    let coin_symbol =
      this.props.selectedCoin.coin_symbol.toLowerCase() == 'stc'
        ? 'stc'
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
                Actions.currentScene != 'Wallet' && Actions.Wallet()
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
    this.setState({ pin: text });
    Singleton.getInstance()
      .newGetData(constants.PIN)
      .then(pin => {
        if (text == pin) {
          if (global.disconnected) {
            Singleton.showAlert(constants.NO_NETWORK);
            return;
          }
          this.setState({ pinModal: false }, () => {
            this.props.selectedCoin.coin_symbol.toLowerCase() == 'stc'
              ? this.send_STC()
              : this.send_ERC20();
          });
        } else {
          Singleton.showAlert(LanguageManager.wrongPin);
          this.setState({ pin: '' });
        }
      });
    return;
  };
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
                        ).toFixed(8) + ' STC'
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
                        ).toFixed(8) + ' STC'
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
                        ).toFixed(8) + ' STC'
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
                      'STC' && (
                        <Text
                          style={[
                            styles.balanceValueStyle,
                            { color: ThemeManager.colors.textColor },
                          ]}>
                          {
                            Singleton.getInstance().toFixed(this.state.amount, 8)
                          }
                        </Text>
                      )}
                    {this.props.selectedCoin.coin_symbol.toUpperCase() !=
                      'STC' && (
                        <Text
                          style={[
                            styles.balanceValueStyle,
                            { color: ThemeManager.colors.textColor },
                          ]}>
                          {
                            Singleton.getInstance().toFixed(
                              this.state.amount,
                              8,
                            ) +" "+ this.props.selectedCoin?.coin_symbol?.toUpperCase()+
                            ' + ' +
                            bigNumberSafeMath(this.state.commissionAmt, '/', 10 ** 18)+' STC'
                            // parseFloat(
                            //   this.state.commissionAmt / 10 ** 18,
                            // ).toString()
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
                </View>
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
  getStcGasEstimate,
  saveTxn,
  getSTCGasPrice
})(MultiSenderSTC);
