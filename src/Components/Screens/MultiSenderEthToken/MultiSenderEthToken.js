import React, { Component } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { EventRegister } from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { connect } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import {
  getBnbGasEstimate,
  getBnbNonce,
  getEthGasEstimate,
  getSTCGasPrice,
  getStcGasEstimate,
  saveTxn,
  sendETH,
} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Colors, Fonts, Images } from '../../../theme';
import {
  bigNumberSafeMath,
  getEthBaseFee,
  getStcNonce,
  getTotalGasFee,
} from '../../../utils';
import {
  BasicButton,
  BorderLine,
  ButtonTransaction,
  Inputtext,
  KeyboardDigit,
  LightButton,
  PinInput,
  SimpleHeader,
  Wrap,
} from '../../common';
import Loader from '../Loader/Loader';
import styles from './MultiSenderEthTokenStyle';
const multiSenderBnbContractAddress =
  constants.network == 'testnet'
    ? '0xEF3Cc16FAC12431799ae4ECc3b87BE5e9AD076e4'
    : '0x8bB9752e8e405B8259E7BC191a96368cc0a46d83';

let csvData = [];
const gwei_multi = 1000000000;
class MultiSenderEthToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myNo: '',
      csvFile: '',
      csvName: '',
      amount: 0.0,
      amountNew: 0.0,
      toAddress: '',
      selectedCoin: this.props?.route?.params?.selectedCoin,
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
      blockChain:
        this.props.route?.params?.selectedCoin.coin_family == 1
          ? 'ethereum'
          : this.props.route?.params?.selectedCoin.coin_family == 6
            ? 'binancesmartchain'
            : this.props.route?.params?.selectedCoin.coin_family == 4
              ? 'saitachain'
              : 'polygon',
      ethPvtKey: '',
      bnbPvtKey: '',
      gasPriceForTxnSlow: 1000000000,
      gasPriceForTxnMedium: 8000000000,
      gasPriceForTxnHigh: 10000000000,
      selectedFee: 'slow',
      totalFee: '',
      showTouch: false,
      showFace: false,
      coinSymbol: this.props.route?.params?.selectedCoin.coin_family == 1 ? 'ETH' : this.props.route?.params?.selectedCoin.coin_family == 4 ? 'STC' : this.props.route?.params?.selectedCoin.coin_family == 6 ? 'BNB' : 'STC'
    };
  }

  componentDidMount() {
    EventRegister.addEventListener('downModal', () => {
      this.setState({ pinModal: false })
    })
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      .then(ethPvtKey => {
        console.warn('MM', 'ethPvtKey---MultiSenderEthToken-----', ethPvtKey);
        this.setState({ ethPvtKey: ethPvtKey });
      });
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultBnbAddress}_pk`)
      .then(bnbPvtKey => {
        //console.warn('MM','bnbPvtKey--------', bnbPvtKey);
        this.setState({ bnbPvtKey: bnbPvtKey });
      });
    Singleton.getInstance()
      .newGetData(constants.PIN)
      .then(pin => {
        this.setState({ existingPin: pin });
      });
    csvData = this.props?.route?.params?.csvArray;
    let valueInCoin = 0;
    let toAddressMulti = '';
    csvData.map((item, index) => {
      if (index < csvData.length - 1) toAddressMulti += item.address + ',';
      else toAddressMulti += item.address;
      valueInCoin += parseFloat(item.amount);
    });
    this.setState({
      amount: valueInCoin,
      toAddress: toAddressMulti,
      // amountNew: valueInCoin,
    });
    //console.warn('MM','toAddress', valueInCoin);
    if (this.props.route?.params?.selectedCoin.coin_family == 1) {
      this.getBaseFee();
      this.getGasLimit();
      this.getTotalFee();
    } else if (
      this.props.route?.params?.selectedCoin.coin_family == 6 ||
      this.props?.route?.params?.selectedCoin?.coin_family == 11
    ) {
      this.getbnbEstimate();
    } else if (
      this.props.route?.params?.selectedCoin.coin_family == 4
    ) {
      this.getStcEstimate();
    }
  }
  componentWillUnmount() {
    EventRegister.removeEventListener('downModal')
  }
  // getStcEstimateOrigional() {
  //   this.setState({ isLoading: true });
  //   let data = {
  //     from: Singleton.getInstance().defaultStcAddress,
  //     to: multiSenderSTCERC20ContractAddress,
  //     amount: this.state.amount,
  //   };
  //   let blockChain = 'saitachain';
  //   let access_token = Singleton.getInstance().access_token;
  //   let contractAddress = this.props.route?.params?.selectedCoin.token_address;
  //   this.props.getSTCGasPrice().then(gasPrices => {
  //     console.log("gasPrices:::::", gasPrices);
  //     let resultList = gasPrices.data
  //     this.props
  //       .getBnbGasEstimate({ blockChain, data, contractAddress, access_token })
  //       .then(response => {
  //         console.warn('MM', 'response GAS--stc ', response);
  //         let slowGasPrice =
  //           parseFloat(resultList[0].safe_gas_price) * gwei_multi;
  //         let mediumGasPrice =
  //           parseFloat(resultList[0].propose_gas_price) * gwei_multi;
  //         let heightGasPrice =
  //           parseFloat(resultList[0].fast_gas_price) * gwei_multi;
  //         let feeIs =
  //           slowGasPrice *
  //           response.gas_estimate *
  //           this.state.gasFeeMultiplier;
  //         console.warn('MM', 'feeIs---- ', feeIs);
  //         this.setState({
  //           gasPriceForTxn: slowGasPrice,
  //           gaslimitForTxn: response.gas_estimate,
  //           gasPriceForTxnSlow: slowGasPrice,
  //           gasPriceForTxnMedium: mediumGasPrice,
  //           gasPriceForTxnHigh: heightGasPrice,
  //           totalFee: Singleton.getInstance()
  //             .exponentialToDecimal(feeIs)
  //             .toString(),
  //           isLoading: false,
  //         });
  //       })
  //       .catch(error => {
  //         this.setState({ isLoading: false });
  //       });
  //   }).catch(err => {
  //     console.log(err);
  //     this.setState({ isLoading: false });
  //     Singleton.showAlert(err?.message || constants.SOMETHING_WRONG);
  //   })

  // }
  getbnbEstimate() {
    this.setState({ isLoading: true });
    let data = {
      from: Singleton.getInstance().defaultBnbAddress,
      to: Singleton.getInstance().defaultBnbAddress,
      amount: this.state.amount,
    };
    let blockChain = this.state.blockChain;
    let access_token = Singleton.getInstance().access_token;
    let contractAddress =
      this.props.route?.params?.selectedCoin.is_token != 1
        ? this.props.route?.params?.selectedCoin.coin_family == 6
          ? 'bnb'
          : 'matic'
        : this.props.route?.params?.selectedCoin.token_address;
    this.props
      .getBnbGasEstimate({ blockChain, data, contractAddress, access_token })
      .then(response => {
        console.warn('MM', 'response GAS--bnb ', response);
        let slowGasPrice =
          parseFloat(response.resultList[0].safe_gas_price) * gwei_multi;
        let mediumGasPrice =
          parseFloat(response.resultList[0].propose_gas_price) * gwei_multi;
        let heightGasPrice =
          parseFloat(response.resultList[0].fast_gas_price) * gwei_multi;
        let feeIs =
          slowGasPrice *
          response.gas_estimate.gas_estimate *
          this.state.gasFeeMultiplier;
        console.warn('MM', 'feeIs---- ', feeIs);
        this.setState({
          gasPriceForTxn: slowGasPrice,
          gaslimitForTxn: response.gas_estimate.gas_estimate,
          gasPriceForTxnSlow: slowGasPrice,
          gasPriceForTxnMedium: mediumGasPrice,
          gasPriceForTxnHigh: heightGasPrice,
          totalFee: Singleton.getInstance()
            .exponentialToDecimal(feeIs)
            .toString(),
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  }
  getStcEstimate() {
    this.setState({ isLoading: true });
    this.props.getSTCGasPrice().then(gasPrices => {
      console.log("gasPrices:::::", gasPrices);
      let data = {
        from: Singleton.getInstance().defaultBnbAddress,
        to: Singleton.getInstance().defaultBnbAddress,
        amount: this.state.amount,
      };
      let blockChain = this.state.blockChain;
      let access_token = Singleton.getInstance().access_token;
      let contractAddress = this.props.route?.params?.selectedCoin.token_address;
      this.props
        .getBnbGasEstimate({ blockChain, data, contractAddress, access_token })
        .then(response => {
          let  gasLimit  = response?.gas_estimate
          console.log("gasLimit:::::",gasLimit);
          let slowGasPrice =
            parseFloat(gasPrices?.data?.safeGasPrice) * gwei_multi;
          let mediumGasPrice =
            parseFloat(gasPrices?.data?.proposeGasPrice) * gwei_multi;
          let heightGasPrice =
            parseFloat(gasPrices?.data?.fastGasPrice) * gwei_multi;
          let feeIs =
            slowGasPrice *
            gasLimit *
            this.state.gasFeeMultiplier;
          console.warn('MM', 'feeIs---- ', feeIs);
          this.setState({
            gasPriceForTxn: slowGasPrice,
            gaslimitForTxn: gasLimit,
            gasPriceForTxnSlow: slowGasPrice,
            gasPriceForTxnMedium: mediumGasPrice,
            gasPriceForTxnHigh: heightGasPrice,
            totalFee: Singleton.getInstance()
              .exponentialToDecimal(feeIs)
              .toString(),
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
  getGasLimit() {
    this.setState({ isLoading: true });
    let data = {
      from: Singleton.getInstance().defaultEthAddress,
      to: Singleton.getInstance().defaultEthAddress,
      amount: '',
    };
    let blockChain = this.state.blockChain;
    let access_token = Singleton.getInstance().access_token;
    let contractAddress = this.props.route?.params?.selectedCoin.token_address;
    this.props
      .getEthGasEstimate({ blockChain, data, contractAddress, access_token })
      .then(res => {
        console.warn('MM', '----------------------GAS---------', res);
        this.setState(
          { isLoading: false, gaslimitForTxn: res.gas_estimate },
          () => {
            this.getTotalFee();
          },
        );
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }
  async getBaseFee() {
    const fee = await getEthBaseFee();
    this.setState({ baseFee: fee }, () => {
      console.warn('MM', 'chk fee:::::eth:::::::', this.state.baseFee)
    });
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
            this.generateRaw();
          });
        } else {
          //console.warn('MM','user cancelled biometric prompt');
        }
      })
      .catch(() => {
        //console.warn('MM','biometrics failed');
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
    //console.warn('MM','-=-=-=-1==-=-=1=-=-=-=-=-', text);
    this.setState({ pin: text });
    Singleton.getInstance()
      .newGetData(constants.PIN)
      .then(pin => {
        //console.warn('MM','pin:::::', pin);
        if (text == pin) {
          this.setState({ pinModal: false }, () => {
            this.generateRaw();
          });
        } else {
          Singleton.showAlert(LanguageManager.wrongPin);
          this.setState({ pin: '' });
        }
      });
    return;
  };
  async generateRaw() {
    this.setState({ isLoading: true });
    let contractAddress = this.props.route?.params?.selectedCoin.token_address;
    if (this.props.route?.params?.selectedCoin.coin_family == 1) {
      const Totalfee = await getTotalGasFee();
      Singleton.getInstance()
        .getsignRawTxnTokenApproval(
          this.state.ethPvtKey,
          this.props.route?.params?.selectedCoin.token_address,
          Totalfee,
          this.state.gaslimitForTxn,
          '',
          Singleton.getInstance().defaultEthAddress,
          this.props.route?.params?.selectedCoin.coin_family,
        )
        .then(tx_raw => {
          console.warn('MM', 'chk txn_raw:::::', tx_raw);
          this.setState({ isLoading: false });
          this.send(tx_raw.signedRaw, contractAddress, tx_raw.nonce); //TODO: - Uncomment this line
        })
        .catch(e => {
          console.warn('MM', e);
          this.setState({ isLoading: false });
        });
    } else if (
      this.props.route?.params?.selectedCoin.coin_family == 6 ||
      this.props.route?.params?.selectedCoin.coin_family == 11
    ) {
      let access_token = Singleton.getInstance().access_token;
      let blockChain = this.state.blockChain;
      let coin_symbol =
        this.props.route?.params?.selectedCoin.coin_family == 6 ? 'bnb' : 'matic';
      let wallet_address =
        this.props.route?.params?.selectedCoin.coin_family == 6
          ? Singleton.getInstance().defaultBnbAddress
          : Singleton.getInstance().defaultMaticAddress;
      this.props
        .getBnbNonce({ wallet_address, access_token, blockChain, coin_symbol })
        .then(nonce => {
          Singleton.getInstance()
            .getsignRawTxnTokenApproval(
              this.state.bnbPvtKey,
              this.props.route?.params?.selectedCoin.token_address,
              this.state.gasPriceForTxn,
              this.state.gaslimitForTxn,
              nonce,
              Singleton.getInstance().defaultBnbAddress,
              this.props.route?.params?.selectedCoin.coin_family,
            )
            .then(tx_raw => {
              // Singleton.getInstance().getsignRawTxnTokenApproval('0x23a481d208423edd51bcfd8ce634895857b94360c414ea7b28aec1d231971808', '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06', this.state.gasPriceForTxn, this.state.gaslimitForTxn, nonce, '0x75f2CdAa88EAC0Ca8ADB30f1eF14B85Ca2450eFa', 6).then((txn_hash) => {
              console.warn('MM', 'chk txn_raw bnb:::::', tx_raw);
              this.setState({ isLoading: false });
              this.saveTxn(tx_raw.transactionHash);
            })
            .catch(e => {
              if (e?.toString()?.includes('insufficient')) {
                Singleton.showAlert(`Insufficient ${this.props.route?.params?.selectedCoin.coin_family == 6 ? 'BNB' : this.props.route?.params?.selectedCoin.coin_family == 1 ? 'ETH' : 'MATIC'} Funds.`)
              }
              console.warn('MM', 'APPROVAL----------------', e);
              this.setState({ isLoading: false });
            });
        })
        .catch(e => {
          console.warn('MM', 'NONCE----------------', e);
          this.setState({ isLoading: false });
        });
    } else if (
      this.props.route?.params?.selectedCoin.coin_family == 4
    ) {
      let wallet_address = Singleton.getInstance().defaultStcAddress
      getStcNonce(wallet_address)
        .then(nonce => {
          Singleton.getInstance()
            .getsignRawTxnTokenApproval(
              this.state.bnbPvtKey,
              this.props.route?.params?.selectedCoin.token_address,
              this.state.gasPriceForTxn,
              this.state.gaslimitForTxn,
              nonce,
              Singleton.getInstance().defaultBnbAddress,
              this.props.route?.params?.selectedCoin.coin_family,
            )
            .then(tx_raw => {
              // Singleton.getInstance().getsignRawTxnTokenApproval('0x23a481d208423edd51bcfd8ce634895857b94360c414ea7b28aec1d231971808', '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06', this.state.gasPriceForTxn, this.state.gaslimitForTxn, nonce, '0x75f2CdAa88EAC0Ca8ADB30f1eF14B85Ca2450eFa', 6).then((txn_hash) => {
              console.warn('MM', 'chk txn_raw stc:::::', tx_raw);
              this.setState({ isLoading: false });
              this.saveTxn(tx_raw.transactionHash);
            })
            .catch(e => {
              if (e?.toString()?.includes('insufficient')) {
                Singleton.showAlert(`Insufficient ${this.props.route?.params?.selectedCoin.coin_family == 6 ? 'BNB' : this.props.route?.params?.selectedCoin.coin_family == 1 ? 'ETH' : 'MATIC'} Funds.`)
              }
              console.warn('MM', 'APPROVAL----------------', e);
              this.setState({ isLoading: false });
            });
        })
        .catch(e => {
          console.warn('MM', 'NONCE----------------', e);
          this.setState({ isLoading: false });
        });
    }
  }
  send(signedRaw, coinSymbol, nonce) {
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
                getCurrentRouteName() != 'Wallet' && navigate(NavigationStrings.Wallet)
              },
            },
          ],
          { cancelable: false },
        );
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          showConfirmTxnModal: false,
          pinModal: false,
        });
        Singleton.showAlert(err.message);
      });
  }
  saveTxn(hash) {
    let data = {
      from: Singleton.getInstance().defaultBnbAddress,
      to: multiSenderBnbContractAddress,
      amount: this.state.amountNew,
      gas_price: this.state.gasPriceForTxn,
      gas_estimate: this.state.gaslimitForTxn,
      tx_raw: '',
      tx_hash: hash,
      tx_type: 'WITHDRAW',
      chat: 0,
      is_smart: 1,
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain = this.state.blockChain;
    let coin_symbol =
      this.props.route?.params?.selectedCoin.is_token != 1
        ? this.props.route?.params?.selectedCoin.coin_family == 6
          ? 'bnb'
          : 'matic'
        : this.state.selectedCoin.token_address;
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
                getCurrentRouteName() != 'Wallet' && navigate(NavigationStrings.Wallet)
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
  onSendAction() {
    this.setState({ pinModal: true, pin: '' }, () =>
      this.checkBiometricAvailability(),
    );
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

  onSubmitGasBnb() {
    if (parseFloat(this.state.advancedGasPrice) == 0.0) {
      Singleton.showAlert(constants.VALID_GASPRICE);
      return;
    }
    if (parseFloat(this.state.advancedGasLimit) == 0.0) {
      Singleton.showAlert(constants.ENTER_GASLIMIT);
      return;
    }
    if (parseFloat(this.state.advancedGasLimit) < 21000) {
      Singleton.showAlert(constants.VALID_GASLIMIT);
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
      () => {
        this.props.route?.params?.selectedCoin.coin_family == 1
          ? this.getGasLimit()
          : this.getbnbEstimate();
      },
    );
  }
  async getTotalFee() {
    this.setState({ isLoading: true });
    const Totalfee = await getTotalGasFee();
    console.warn('MM', 'chk Totalfee:::::eth:::::::', Totalfee, this.state.gasFeeMultiplier, this.state.gaslimitForTxn);
    let feeIs = bigNumberSafeMath(Totalfee, '*', bigNumberSafeMath(this.state.gasFeeMultiplier, '*', this.state.gaslimitForTxn))
    console.log("feeIs:::::", feeIs);
    let fixedFee = await Singleton.getInstance().toFixed(feeIs, 8)
    console.log("fixedFee:::::", fixedFee);
    this.setState({
      gasPriceForTxn: Totalfee,
      totalFee: fixedFee?.toString(),
      isLoading: false,
    });
    console.log(":::::IIIIIIÌfeeIs", feeIs);
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
    //console.warn('MM','-----medium', this.state.gasPriceForTxnMedium);
    //console.warn('MM','-----medium', this.state.gaslimitForTxn);
    //console.warn('MM','-----medium', this.state.gasFeeMultiplier);
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
          <View style={{ flex: 1 }}>
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
                        { left: widthDimen(-20), width: widthDimen(105) },
                      ]}
                    />

                    <View style={{ alignItems: 'center' }}>
                      <View
                        style={[
                          styles.step_item_title_view,
                          {
                            backgroundColor: ThemeManager.colors.dotLine,
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
                          color: ThemeManager.colors.colorLight,
                        }}>
                        Bulk Transfer
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.transaction__options]}>
                  <Text
                    style={[
                      styles.transaction_textStye,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    Transaction Fees (
                    {this.state.coinSymbol}){' '}
                  </Text>
                </View>

                {/* *************************view for advanced********************************* */}
                {this.state.advancedSet && (
                  <Inputtext

                    value={this.state.totalFee}
                    editable={false}
                    labelStyle={styles.labelTextStyle1}></Inputtext>
                )}
                {/* *************************view for eth default********************************* */}
                {!this.state.advancedSet &&
                  this.props.route?.params?.selectedCoin.coin_family == 1 && (
                    <View>
                      <Inputtext
                        style={{
                          marginHorizontal: widthDimen(22),
                        }}
                        inputStyle={{
                          borderColor: ThemeManager.colors.viewBorderColor,
                          borderWidth: 1,
                          borderRadius: heightDimen(25),
                          paddingHorizontal: widthDimen(20),
                          color: ThemeManager.colors.textColor,
                        }}
                        label=""
                        placeholder="0"
                        labelStyle={
                          (styles.labelTextStyle1,
                            { color: ThemeManager.colors.textColor })
                        }
                        value={this.state.totalFee}
                        editable={false}
                      />
                    </View>
                  )}
                {/* *************************view for bnb default********************************* */}
                {!this.state.advancedSet &&
                  this.props.route?.params?.selectedCoin.coin_family == 6 || this.props.route?.params?.selectedCoin.coin_family == 4 && (
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
                          ).toFixed(8) + ' ' + this.state.coinSymbol
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
                        onPress={() => this.mediumAction()}
                        style={{
                          backgroundColor:
                            this.state.selectedFee == 'medium'
                              ? ThemeManager.colors.primary //Colors.buttonColor5
                              : ThemeManager.colors.swapBg, //Colors.lightGrey2,
                          marginHorizontal: widthDimen(4),
                        }}
                        label="Average"
                        transactionfee={
                          parseFloat(
                            this.state.gasPriceForTxnMedium *
                            this.state.gaslimitForTxn *
                            this.state.gasFeeMultiplier,
                          ).toFixed(8) + ' ' + this.state.coinSymbol
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
                        onPress={() => this.highAction()}
                        style={{
                          backgroundColor:
                            this.state.selectedFee == 'high'
                              ? ThemeManager.colors.primary //Colors.buttonColor5
                              : ThemeManager.colors.swapBg, //Colors.lightGrey2,
                          marginHorizontal: widthDimen(4),
                        }}
                        label="Fast"
                        // style={styles.noRightBorder}
                        transactionfee={
                          parseFloat(
                            this.state.gasPriceForTxnHigh *
                            this.state.gaslimitForTxn *
                            this.state.gasFeeMultiplier,
                          ).toFixed(8) + ' ' + this.state.coinSymbol
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
                {!this.state.advancedSet &&
                  this.props.route?.params?.selectedCoin.coin_family == 11 && (
                    <View style={styles.feeWrap}>
                      <ButtonTransaction
                        style={{
                          backgroundColor:
                            this.state.selectedFee == 'slow'
                              ? ThemeManager.colors.primary //Colors.buttonColor5
                              : ThemeManager.colors.mnemonicsView, //Colors.lightGrey2,
                          marginHorizontal: widthDimen(4),
                        }}
                        onPress={() => this.slowAction()}
                        label="Slow"
                        transactionfee={
                          parseFloat(
                            this.state.gasPriceForTxnSlow *
                            this.state.gaslimitForTxn *
                            this.state.gasFeeMultiplier,
                          ).toFixed(8) + ' MATIC'
                        }
                        isSelected={
                          this.state.selectedFee == 'slow' ? true : null
                        }
                      />
                      <ButtonTransaction
                        onPress={() => this.mediumAction()}
                        style={{
                          backgroundColor:
                            this.state.selectedFee == 'medium'
                              ? ThemeManager.colors.primary //Colors.buttonColor5
                              : ThemeManager.colors.mnemonicsView, //Colors.lightGrey2,
                          marginHorizontal: widthDimen(4),
                        }}
                        label="Average"
                        transactionfee={
                          parseFloat(
                            this.state.gasPriceForTxnMedium *
                            this.state.gaslimitForTxn *
                            this.state.gasFeeMultiplier,
                          ).toFixed(8) + ' MATIC'
                        }
                        isSelected={
                          this.state.selectedFee == 'medium' ? true : null
                        }
                      />
                      <ButtonTransaction
                        onPress={() => this.highAction()}
                        style={{
                          backgroundColor:
                            this.state.selectedFee == 'high'
                              ? ThemeManager.colors.primary //Colors.buttonColor5
                              : ThemeManager.colors.mnemonicsView, //Colors.lightGrey2,
                          marginHorizontal: widthDimen(4),
                        }}
                        label="Fast"
                        // style={styles.noRightBorder}
                        transactionfee={
                          parseFloat(
                            this.state.gasPriceForTxnHigh *
                            this.state.gaslimitForTxn *
                            this.state.gasFeeMultiplier,
                          ).toFixed(8) + ' MATIC'
                        }
                        isSelected={
                          this.state.selectedFee == 'high' ? true : null
                        }
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
                        source={{ uri: this.props.route?.params?.selectedCoin.coin_image }}
                        style={styles.iconImageStyle}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <Text
                        style={[
                          styles.balanceLabelStyle,
                          { color: ThemeManager.colors.lightTextColor },
                        ]}>
                        {this.props.route?.params?.selectedCoin.coin_symbol.toUpperCase() +
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
                        this.props.route?.params?.selectedCoin.balance,
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
                        source={{ uri: this.props.route?.params?.selectedCoin.coin_image }}
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

                    <Text
                      style={[
                        styles.balanceValueStyle,
                        { color: ThemeManager.colors.textColor },
                      ]}>
                      {
                        Singleton.getInstance().toFixed(this.state.amount, 7)
                      }
                    </Text>
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
                        getCurrentRouteName() != 'Recipient' &&
                        navigate(NavigationStrings.Recipient,{ csvData: csvData });
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
                  onPress={() => goBack()}
                  btnStyle={styles.cancelBtnStyle}
                  customGradient={styles.customGrad}
                  text="Cancel"
                />
              </View>
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
          {this.state.isLoading && <Loader color="white" />}
          {/* **********************************MODAL FOR ADVANCED GAS PRICE ETH*********************************************** */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={
              this.state.modalVisible &&
              this.props.route?.params?.selectedCoin.coin_family == 1
            }
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
                    label="Max Priority Fee (Gwei)"
                    placeholder="Please enter Max Priority Fee"
                    labelStyle={styles.labelTextStyle1}
                    value={this.state.priorityFee}
                    keyboardType={'number-pad'}
                    maxLength={10}
                    onChangeNumber={text => {
                      this.setState({ priorityFee: parseFloat(text) }, () =>
                        this.updatePriorityFee(text),
                      );
                    }}></Inputtext>
                  <Inputtext
                    label="Max Fee (Gwei)"
                    placeholder="Max Fee"
                    labelStyle={styles.labelTextStyle1}
                    value={this.state.MaxFee}
                    keyboardType={'numeric'}
                    editable={false}></Inputtext>
                  <View style={styles.buttonStylesSubmit}>
                    <BasicButton
                      text="Submit"
                      onPress={() => this.onSubmitGas()}
                    />
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </Modal>

          {/* ********************************** MODAL FOR ADVANCED GAS PRICE BNB *********************************************** */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={
              this.state.modalVisible &&
              this.props.route?.params?.selectedCoin.coin_family == 6
            }
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
                      this.setState({ advancedGasPrice: parseFloat(text) })
                    }></Inputtext>

                  <Inputtext
                    label="Gas Limit"
                    placeholder="Please enter Gas Limit"
                    value={this.state.advancedGasLimit}
                    labelStyle={styles.labelTextStyle}
                    keyboardType={'number-pad'}
                    onChangeNumber={text =>
                      this.setState({ advancedGasLimit: parseFloat(text) })
                    }></Inputtext>
                  <View style={styles.buttonStylesSubmit}>
                    <BasicButton
                      text="Submit"
                      onPress={() => this.onSubmitGasBnb()}
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
                    color: ThemeManager.colors.headingText,
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
  getEthGasEstimate,
  getBnbGasEstimate,
  getBnbNonce,
  saveTxn,
  sendETH,
  getSTCGasPrice,
  getStcGasEstimate
})(MultiSenderEthToken);
