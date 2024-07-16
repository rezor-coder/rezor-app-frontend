/* eslint-disable curly */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
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
import { connect } from 'react-redux';
import * as constants from '../../../Constant';
import Singleton from '../../../Singleton';
import { Colors, Fonts, Images } from '../../../theme/index';
import {
  BasicInputBox,
  BasicModal,
  BorderLine,
  ButtonPrimary,
  InputtextAddress,
  KeyboardDigit,
  PinInput,
  SimpleHeader,
  Wrap
} from '../../common';
import styles from './SendBTCStyle';

const bitcore = require('bitcore-lib');
// import { CameraScreen } from 'react-native-camera-kit';
import { EventRegister } from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { APIClient } from '../../../Api';
import * as Constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import {
  CheckIsContactExist,
  getBnbGasEstimate,
  getBnbGasPrice,
  getBnbNonce,
  getEthTokenRaw,
  sendBNB,
  walletFormUpdate
} from '../../../Redux/Actions';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import fonts from '../../../theme/Fonts';
import {
  CommaSeprator3,
  bigNumberSafeMath,
  exponentialToDecimalWithoutComma
} from '../../../utils';
import { DetailOption } from '../../common/DetailOption';
import QRReaderModal from '../../common/QRReaderModal';
import Loader from '../Loader/Loader';
const gwei_multi = 1000000000;
let fee = 0;
let inputs = [];
let inputCount = 0;
let outputCount = 2;
let totalAmountAvailable = 0;
let transactionSize = 0;
let btcTosatoshi = 100000000;
class SendBTC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockChain: 'btc',
      walletData: this.props.route?.params?.walletData,
      isLoading: false,
      gasPriceForTxn: 1000000000,
      gasPriceForTxnSlow: 1000000000,
      gasPriceForTxnMedium: 8000000000,
      gasPriceForTxnHigh: 10000000000,
      gaslimitForTxn: '',
      gasFeeMultiplier: 0.000000000000000001,
      totalFee: '0',
      balance: this.props.route?.params?.walletData?.balance || 0,
      modalVisible: false,
      advancedGasPrice: 0,
      advancedGasLimit: 0,
      advancedSet: false,
      to_Address: props?.qrCode ? props.qrCode : '',
      amount: '',
      Start_Scanner: false,
      maxClicked: false,
      showConfirmTxnModal: false,
      showTxnSuccessModal: false,
      MaxFee: 0,
      baseFee: 0,
      feeObj: {},
      bnbPvtKey: '',
      gas_price_eth: 0,
      pinModal: false,
      FaceID: false,
      pin: '',
      existingPin: '',
      showImage: false,
      selectedFee: 'medium',
      showTouch: false,
      showFace: false,
      BasicModall: false,
      PinModal: false,
      Pin: '',
      pinFromStorage: '',
      showAddContact: true,
      isContact: false
    };
  }
  componentDidMount() {
    // this.setState({BasicModall:true})
    console.log('walletData===', this.state.walletData);
    inputCount = 0;
    inputs = [];
    this.getGasPrice();
    Singleton.getInstance()
      .newGetData(this.state.walletData?.wallet_address + '_pk')
      .then(pvtKey => {
        //console.warn('MM','private key ', pvtKey);
        this.btcpvtKey = pvtKey;
      });
    //console.warn('MM','walletData-- ', this.props?.walletData);
    this.props.navigation.addListener('focus', this.onScreenFocus);
    this.props.navigation.addListener('blur', this.screenBlur);

    this.setState({
      isLoading: true,
    });
    this.getUnspent(this.props?.walletData?.wallet_address)
      .then(res => {
        //console.warn('MM','get unspend', res?.data);

        totalAmountAvailable = 0;

        res.data.forEach(async element => {
          let utxo = {};
          utxo.satoshis = Math.floor(Number(element.satoshis));
          utxo.script = element.scriptPubKey;
          utxo.address = element.address;
          utxo.txId = element.txid;
          utxo.outputIndex = element.vout;
          totalAmountAvailable += utxo.satoshis;
          inputCount += 1;
          inputs.push(utxo);
        });
        this.setState({ isLoading: false });
        //console.warn('MM','------input', JSON.stringify(inputs));
        //console.warn('MM','------inputCount', inputCount);
        //console.warn('MM','------outputCount', outputCount);
        transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
        ////console.log(
        // 'totalAmount',
        //   totalAmountAvailable,
        //   '------transactionSize',
        //   transactionSize,
        // );
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        //console.warn('MM','errrr in btc unspent', err);
      });

    Singleton.getInstance()
      .newGetData(`${this.props.route?.params?.walletData?.wallet_address}_pk`)
      .then(bnbPvtKey => {
        //console.warn('MM','chk btc  pvt key::::', bnbPvtKey);
        this.setState({ bnbPvtKey: bnbPvtKey });
      });

    // this.availableBalance();
    // this.getGasLimit();
    // ////console.log(
    //   'feees====',
    //   Singleton.getInstance().toFixed(
    //     this.state.gasPriceForTxnMedium *
    //       this.state.gaslimitForTxn *
    //       this.state.gasFeeMultiplier,
    //   ),
    // );
    // ////console.log(
    //   'this.state.gasPriceForTxnMedium',
    //   this.state.gasPriceForTxnMedium,
    // );
    // //console.warn('MM','oiuouoi', this.state.gaslimitForTxn);
  }

  // async getBtcSignedTxn() {
  //   //console.warn('MM','getBtcSignedTxn--- ');
  //   try {
  //     this.setState({ isLoading: true, });
  //     if (this.state.unSpentRes.length == 0) {
  //       Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
  //       this.setState({ isLoading: false, });
  //       return;
  //     } else {
  //       if (totalAmountAvailable - Math.round(this.state.amount * btcTosatoshi) - fee < 0) {
  //         Singleton.showAlert('Balance is too low for this transaction');
  //         this.setState({ isLoading: false })
  //         return;
  //       }
  //       const transaction = new bitcore.Transaction();
  //       transaction.from(this.state.inputs);
  //       transaction.to(this.state.to_Address, parseInt(Math.round(this.state.amount * btcTosatoshi)),);
  //       //console.warn('MM','--amount', parseInt(Math.round(this.state.amount * btcTosatoshi)),);
  //       var satoshis = 0;
  //       for (var i = 0; i < this.state.inputs.length; i++) {
  //         satoshis = this.state.inputs[i].satoshis + satoshis;
  //       }
  //       if (satoshis - (fee + parseInt(Math.round(this.state.amount * btcTosatoshi))) > 546) {
  //         transaction.change(Singleton.getInstance().defaultBTCAddress);
  //       }
  //       if (satoshis - (fee + parseInt(Math.round(this.state.amount * btcTosatoshi))) > 546) {
  //         transaction.fee(fee);
  //       } else {
  //         transaction.fee(fee + (satoshis - (fee + parseInt(Math.round(this.state.amount * btcTosatoshi)))),);
  //       }
  //       transaction.sign(this.state.btcPvtKey);
  //       let serializedTransaction;
  //       try {
  //         serializedTransaction = await transaction.serialize();
  //       } catch (error) {
  //         this.setState({ isLoading: false })
  //         Singleton.showAlert(constants.DUST_AMOUNT_ERROR)
  //       }
  //       await this.setState({ btcSignedTxn: serializedTransaction, isLoading: false });
  //     }
  //   }
  //   catch (err) {
  //     this.setState({ btcSignedTxnErr: true })
  //     //console.warn('MM','-----serializedTransaction err :::::::::', err)
  //   }
  // }
  getGasPrice = () =>
    APIClient.getInstance()
      .getGasPrice('https://api.blockchain.info/mempool/fees')
      .then(response => {
        let result = response;
        ////console.log(
        // 'Get BTC fees price Success **** ' + JSON.stringify(result),
        //   );
        this.setState({
          feeObj:
            Constants.network == 'testnet'
              ? { limits: { min: 1, max: 1 }, regular: 1, priority: 1 }
              : result,
        });
      })
      .catch(error => {
        let errorMessage = error.message;
        //console.warn('MM','Get BTC fees price  Error ****', error);
      });

  getUnspent = address => {
    return new Promise(async (resolve, reject) => {
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token,
      );
      APIClient.getInstance()
        .get(`bitcoin/unspent/${address}`, token)
        .then(response => {
          let result = response;
          //console.warn('MM','BTCUNSPENT Success **** ' + result);
          return resolve(result);
        })
        .catch(error => {
          let errorMessage = error.message;
          //console.warn('MM','BTCUNSPENT Error ****', error);
          return reject(errorMessage);
        });
    });
  };

  onScreenFocus = () => {

    global.firstLogin = true;
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this.eventListener  = EventRegister.addEventListener('downModal', () => {
      console.log('heree::::::::2');
      if (this.state.BasicModall) {
        this.setState({ BasicModall: false })
        getCurrentRouteName() != 'Wallet' && navigate(NavigationStrings.Wallet)
      }
    });
  };
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    EventRegister.removeEventListener(this.eventListener)
  };
  backAction = () => {
    if (this.state.Start_Scanner) {
      this.setState({ Start_Scanner: false });
      return true;
    } else {
      goBack();
      return true;
    }
  };
  availableBalance() {
    //console.warn('MM','ssss ', this.state.walletData.balance);
    let bal =
      this.state.walletData.balance != 0
        ? Singleton.getInstance().exponentialToDecimal(
          Singleton.getInstance().toFixed(
            Singleton.getInstance().exponentialToDecimal(
              this.state.walletData.balance,
            ),
            constants.CRYPTO_DECIMALS,
          ),
        )
        : this.state.walletData.balance;

    const balance =
      this.state.walletData.balance.toString().length < 5 ? bal : bal;
    this.setState({ balance: balance });
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

  getGasLimit() {
    this.setState({ isLoading: true });
    let data = {
      from: Singleton.getInstance().defaultBnbAddress,
      to: Singleton.getInstance().defaultBnbAddress,
      amount: this.state.amount,
    };
    let blockChain = this.state.blockChain;
    let access_token = Singleton.getInstance().access_token;
    let contractAddress =
      this.state.walletData.coin_symbol.toLowerCase() == 'bnb'
        ? 'bnb'
        : this.state.walletData.token_address;
    this.props
      .getBnbGasEstimate({ blockChain, data, contractAddress, access_token })
      .then(response => {
        //console.warn('MM','response GAS--bnb ', response);
        if (response.gas_estimate.status == true) {
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
          //console.warn('MM','feeIs---- ', feeIs);
          this.setState(
            {
              gasPriceForTxn: slowGasPrice,
              gaslimitForTxn: response.gas_estimate.gas_estimate,
              gasPriceForTxnSlow: slowGasPrice,
              gasPriceForTxnMedium: mediumGasPrice,
              gasPriceForTxnHigh: heightGasPrice,
              totalFee: Singleton.getInstance()
                .exponentialToDecimal(feeIs)
                .toString(),
              isLoading: false,
              selectedFee: 'medium',
            },
            () => {
              if (this.state.amount > 0) {
                this.findMaxSend();
              }
            },
          );
        } else {
          this.setState({ isLoading: false });
          Singleton.showAlert(response.gas_estimate.message);
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  }
  onSubmitGas() {
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
    this.setState(
      {
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
      },
      () => {
        if (this.state.amount > 0) {
          this.findMaxSend();
        }
      },
    );
  }
  resetAction() {
    this.setState(
      {
        gaslimitForTxn: this.state.gaslimitForTxn,
        advancedSet: false,
        maxClicked: true,
      },
      () => this.getGasLimit(),
    );
  }

  updatePin = item => {
    if (item == ' ' || this.state.Pin.length == 6) {
      return;
    }
    if (this.state.Pin.length != 6) {
      this.setState({ Pin: this.state.Pin + item });

      if (this.state.Pin.length == 5) {
        console.log('PINNNNN===', this.state.Pin + item);
        let pin = this.state.Pin + item;
        this.onProceed(pin);
      }
    }
  };
  deletePin = () => {
    if (this.state.Pin.length == 0) {
      return;
    }
    this.setState({ Pin: this.state.Pin.slice(0, this.state.Pin.length - 1) });
  };

  onProceed = text => {
    //console.warn('MM','-=-=-=-1==-=-=1=-=-=-=-=-', text);
    this.setState({ Pin: text });
    Singleton.getInstance()
      .newGetData(Constants.PIN)
      .then(pin => {
        //console.warn('MM','pin:::::', pin);
        if (text == pin) {
          if (global.disconnected) {
            Singleton.showAlert(constants.NO_NETWORK);
            return;
          }
          this.sendTransaction();
          this.setState({ PinModal: false });
        } else {
          Singleton.showAlert(LanguageManager.wrongPin);
          this.setState({ Pin: '' });
        }
      });
    return;
  };
  getAddress = address => {
    this.setState({ to_Address: address, showAddContact: false });
  };
  onSendAction() {
    if (global.disconnected) {
      Singleton.showAlert(constants.NO_NETWORK);
      return;
    }
    this.setState({ Pin: '' });
    if (this.state.to_Address.length == 0) {
      Singleton.showAlert(constants.ENTER_ADDRESS);
      return;
    }
    if (this.state.amount.length == 0) {
      Singleton.showAlert(constants.ENTER_AMOUNT);
      return;
    }
    if (this.state.amount.length == 0 || this.state.amount == 0) {
      Singleton.showAlert(constants.ENTER_AMOUNT);
      return;
    }
    if (isNaN(parseFloat(this.state.amount))) {
      Singleton.showAlert(constants.VALID_AMOUNT);
      return;
    }
    if (!constants.ONE_DECIMAL_REGEX.test(this.state.amount)) {
      Singleton.showAlert(constants.VALID_AMOUNT);
      return;
    }
    // //console.warn('MM','this.state.walletData ', this.state.walletData);

    // if (
    //   parseFloat(this.state.walletData?.balance) < parseFloat(this.state.amount)
    // ) {
    //   Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
    //   return;
    // } else {
    if (Singleton.getInstance().validateBTCAddress(this.state.to_Address)) {
      this.setState({ showConfirmTxnModal: true });
    } else {
      Singleton.showAlert(constants.VALID_ADDRESS);
    }
    // }
  }
  qrClose() {
    this.setState({ to_Address: '', Start_Scanner: false });
  }
  onQR_Code_Scan_Done = QR_Code => {
    this.setState({
      to_Address: QR_Code,
      Start_Scanner: false,
      maxClicked: false,
    });
  };
  findMaxSend() {
    if (this.state.maxClicked) {
      //console.warn('MM','feeeeeeeeee', this.state.feeObj);
      // if (this.state.walletData?.coin_symbol?.toLowerCase() == 'btc') {
      ////console.log(
      // (this.state.walletData.balance * btcTosatoshi -
      //   transactionSize * this.state.feeObj?.regular) /
      //   btcTosatoshi,
      //   totalAmountAvailable,
      //   );
      if (
        parseFloat(
          this.state.walletData.balance * btcTosatoshi -
          transactionSize * this.state.feeObj?.regular,
        ) <= 0
      ) {
        Singleton.showAlert(LanguageManager.lowBalanceAlert);
        this.setState({ maxClicked: false });
        return;
      }
      this.setState({
        amount: Singleton.getInstance()
          .toFixednew(
            exponentialToDecimalWithoutComma(
              (exponentialToDecimalWithoutComma(
                this.state.walletData?.balance,
              ) *
                btcTosatoshi -
                transactionSize * this.state.feeObj?.regular) /
              btcTosatoshi,
            ),
            8,
          )
          .toString(),
      });
      // } else {
      //   if (parseFloat(this.state.walletData.balance * btcTosatoshi) <= 0) {
      //     Singleton.showAlert(LanguageManager.lowBalanceAlert);
      //     this.setState({maxClicked: false});
      //     return;
      //   }
      //   this.setState({
      //     amount: Singleton.getInstance()
      //       .toFixed(this.state.walletData.balance, 8)
      //       .toString(),
      //   });
      // }
    }
  }

  sendTransaction() {
    if (this.state.to_Address.trim().length == 0)
      Singleton.showAlert('Please enter wallet address');
    else if (this.state.amount.trim().length == 0 || this.state.amount == 0)
      Singleton.showAlert('Please enter amount');
    else if (isNaN(parseFloat(this.state.amount)))
      Singleton.showAlert('Please enter valid amount');
    else if (!/^\d*\.?\d*$/.test(this.state.amount)) {
      Singleton.showAlert('You can enter only one decimal!');
    } else {
      fee = transactionSize * this.state.feeObj?.regular;
      // fee = transactionSize * this.state.SliderValue;
      console.warn('MM', '----fee', fee);

      //console.warn('MM','----totalAmountAvailable', totalAmountAvailable);
      ////console.log(
      // 'after fee',
      //   totalAmountAvailable - this.state.amount * btcTosatoshi - fee,
      //   );
      if (totalAmountAvailable - this.state.amount * btcTosatoshi - fee < 0) {
        Singleton.showAlert('Balance is too low for this transaction');
        return;
      }
      this.setState({ isLoading: true });
      setTimeout(() => {
        let serializedTransaction;
        try {
          //Set transaction input
          const transaction = new bitcore.Transaction();

          //console.warn('MM','check input ', inputs);
          // //console.warn('MM','check valueInCoinForm ', this.state.valueInCoinForm);
          // ////console.log(
          //   'check woundd ',
          //   Math.round(this.state.valueInCoinForm * btcTosatoshi),
          // );

          transaction.from(inputs);
          transaction.to(
            this.state.to_Address,
            Math.round(this.state.amount * btcTosatoshi),
          );

          // transaction.to("mxGV3qZNJAZ5KGBuCUVDSAstxoh8dzek69", Math.round(0.00002 * btcTosatoshi));
          // ////console.log(
          //   '--amount',
          //   Math.round(this.state.valueInCoinForm * btcTosatoshi),
          // );

          // Set change address - Address to receive the left over funds after transfer
          transaction.change(Singleton.getInstance().defaultBtcAddress);

          //manually set transaction fees: 20 satoshis per byte
          transaction.fee(fee);
          //console.warn('MM','----transaction', transaction);

          // Sign transaction with your private key

          transaction.sign(this.btcpvtKey);
          //console.warn('MM','-----this.btcpvtKey', this.btcpvtKey);

          // serialize Transactions
          serializedTransaction = transaction.serialize();
          //console.warn('MM','-----serializedTransaction', serializedTransaction);
        } catch (e) {
          //console.warn('MM',e);

          Singleton.showAlert('Failed to Initiate Transaction');

          this.setState({ isLoading: false });
          return;
        }
        console.log('serializedTransaction==', serializedTransaction);
        const {
          to_Address,
          // valueInCoinForm,
          // gasEstimate,
          // gas_gwei_price,
          selectedCoin,
        } = this.state;
        Singleton.getInstance()
          .newGetData(Constants.access_token)
          .then(token => {
            this.sendSerializedTxn(
              0,
              serializedTransaction,
              this.state.walletData?.wallet_address,
              to_Address,
              // valueInCoinForm,
              0,
              0,
              // gasEstimate,
              // gas_gwei_price,
              'BTC',
              token,
            );
          })
          .catch(err => {
            // this.setState({
            //   showAlertDialog: true,
            //   alertTxt: 'Failed to Initiate Transaction',
            // });
            Singleton.showAlert('Failed to Initiate Transaction');
            this.setState({ isLoading: false });
          });
      }, 200);
    }
  }

  sendSerializedTxn(
    nonce,
    tx_raw,
    myAddress,
    toAddress,
    // valueInCoinForm,
    gasEstimate,
    gas_gwei_price,
    coin_symbol,
    userToken,
  ) {
    const actualFee =
      (this.state.feeObj?.regular * transactionSize) / btcTosatoshi;
    console.log('Feeeeeee--actualFee==', actualFee);
    let sendCoinReq = {
      nonce: nonce,
      tx_raw: `${tx_raw}`,
      from: myAddress,
      to: toAddress,
      amount: this.state.amount,
      gas_estimate: gasEstimate,
      eth_gas_price: gas_gwei_price,
      tx_type: 'withdraw',
      transaction_fee: actualFee,
    };
    //console.warn('MM',sendCoinReq);
    APIClient.getInstance()
      .post(`bitcoin/${coin_symbol}/send`, sendCoinReq, userToken)
      .then(res => {
        this.setState({ isLoading: false });
        this.setState({
          isLoading: false,
          BasicModall: true,
          showConfirmTxnModal: false,
          pinModal: false,
        });
        // goBack();
        // Actions.TransactionHistory({selectedCoin: this.state.selectedCoin});
      })
      .catch(e => {
        this.setState({ isLoading: false });
        //console.warn('MM','eeerror', e);
        // this.setState({
        //   showAlertDialog: true,
        //   alertTxt: e || 'Failed to Initiate Transaction',
        // });
        Singleton.showAlert(e || 'Failed to Initiate Transaction');
      });
  }


  send(signedRaw, coinSymbol, nonce) {
    this.setState({ isLoading: true });
    let data = {
      from: Singleton.getInstance().defaultBnbAddress,
      to: this.state.to_Address,
      amount: this.state.amount,
      gas_price: this.state.gasPriceForTxn,
      gas_estimate: this.state.gaslimitForTxn,
      tx_raw: signedRaw,
      tx_type: 'WITHDRAW',
      nonce: nonce,
      chat: this.props.chat,
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain = this.state.blockChain;
    let coin_symbol = coinSymbol;
    this.props
      .sendBNB({ data, access_token, blockChain, coin_symbol })
      .then(res => {
        let req = {
          to: this.state.to_Address,
          coinFamily: 2
        }
        this.props.CheckIsContactExist({ data: req, access_token }).then(response => {
          this.setState({
            BasicModall: true,
            showConfirmTxnModal: false,
            pinModal: false,
            showAddContact: response.is_contact == 0 ? true : false
          });
          setTimeout(() => {
            this.setState({ isLoading: false });
          }, 150);
        }).catch(err => {
          this.setState({
            BasicModall: true,
            showConfirmTxnModal: false,
            pinModal: false,
          });
          setTimeout(() => {
            this.setState({ isLoading: false });
          }, 150);
        })
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
  open_QR_Code_Scanner = () => {
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
            that.setState({ to_Address: '', Start_Scanner: true });
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
      that.setState({ to_Address: '', Start_Scanner: true });
    }
  };
  qrClose() {
    this.setState({ to_Address: '', Start_Scanner: false });
  }
  onQR_Code_Scan_Done = QR_Code => {
    this.setState({
      to_Address: QR_Code,
      Start_Scanner: false,
      maxClicked: false,
    });
  };
  render() {
    const decim =
      this.state.walletData?.no_of_decimals > 8
        ? 8
        : this.state.walletData?.no_of_decimals;
    if (this.state.Start_Scanner)
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: ThemeManager.colors.bg,
            paddingTop: Platform.OS == 'ios' ? 20 : 0,
          }}>
          <QRReaderModal
            visible={this.state.Start_Scanner}
            setvisible={data => {
              this.setState({ Start_Scanner: data });
            }}
            onCodeRead={this.onQR_Code_Scan_Done}
          />
          {/* <TouchableOpacity
            onPress={() => this.qrClose()}
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
              this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
            }
          /> */}
        </SafeAreaView>
      );
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <SimpleHeader
            history={true}
            customIcon={Images.address}
            onPressHistory={() =>
              getCurrentRouteName() != 'SendCryptoContacts' &&
              navigate(NavigationStrings.SendCryptoContacts,{
                item: this.state.walletData,
                blockChain: this.state.blockChain,
                getAddress: this.getAddress,
              })
            }
            titleStyle={{ textTransform: 'none' }}
            title={`${LanguageManager.send
              } ${this.state.walletData.coin_symbol.toUpperCase()}`}
            backImage={ThemeManager.ImageIcons.iconBack}
          />
          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.roundView,
                {
                  opacity: this.state.BasicModall ? 0.5 : 1,
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
                    {this.state.walletData?.coin_image ? (
                      <Image
                        style={{
                          height: widthDimen(30),
                          width: widthDimen(30),
                          borderRadius: widthDimen(15),
                        }}
                        source={{
                          uri: this.state.walletData?.coin_image,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          height: widthDimen(30),
                          width: widthDimen(30),
                          borderRadius: widthDimen(15),
                          color: ThemeManager.colors.swapBg,
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
                          {this.state.walletData?.coin_symbol
                            ?.toUpperCase()
                            ?.charAt(0)}
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
                      {this.state.walletData?.coin_symbol.toUpperCase()}
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
                    label={LanguageManager.withdrawalAddress}
                    placeholder={LanguageManager.longPressToPaste}
                    value={this.state.to_Address}
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
                    inputStyle={{
                      width: '75%',
                      color: ThemeManager.colors.textColor,
                    }}
                    onChangeNumber={text => {
                      this.setState({ to_Address: text });
                    }}>
                    <View style={styles.addressOptionsCustom}>
                      <TouchableOpacity
                        onPress={() => this.open_QR_Code_Scanner()}
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
                            this.setState({ to_Address: res.replace(/\s/g, '') });
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
                    // mainContainerStyle={{ marginTop: -10 }}
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
                    keyboardType={'numeric'}
                    placeholder="0.00"
                    // titleStyle={{ fontFamily: Fonts.semibold }}
                    title={LanguageManager.amount}
                    width={'100%'}
                    text={this.state.amount}
                    onChangeText={text => {
                      var expression = new RegExp(
                        '^\\d*\\.?\\d{0,' + decim + '}$',
                      );
                      if (expression.test(text)) {
                        let splitValue = text.split('.')
                        if (splitValue[0]?.length <= 21) {
                          this.setState({ amount: text });
                        }
                      }
                    }}
                    pressMax={() => {
                      this.setState({ maxClicked: true }, () =>
                        this.findMaxSend(),
                      );
                    }}
                    max={`${this.state.walletData?.coin_symbol.toUpperCase()} `}
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
                        color: ThemeManager.colors.textColor,
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
                        } ${!isNaN(Singleton.getInstance().toFixed(
                          exponentialToDecimalWithoutComma(
                            this.state.amount *
                            this.state.walletData?.perPrice_in_fiat,
                          ),
                          2,
                        )) ? CommaSeprator3(
                          exponentialToDecimalWithoutComma(
                            this.state.amount *
                            this.state.walletData?.perPrice_in_fiat,
                          ),
                          2,
                        ) : 0}`}
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
                      }}>{`${this.state.balance
                        } ${this.state.walletData?.coin_symbol.toUpperCase()}`}</Text>
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 0, paddingHorizontal: widthDimen(5) }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
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
                </View>
                <BasicInputBox
                  mainStyle={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                    borderWidth: 1,
                    marginHorizontal: widthDimen(20),
                    marginTop: heightDimen(-20),
                  }}
                  style={{ fontSize: 15 }}
                  placeholder=""
                  title=""
                  text={Singleton.getInstance().toFixednew(exponentialToDecimalWithoutComma(parseFloat(
                    this.state.amount
                      ? this.state.feeObj?.regular
                        ? exponentialToDecimalWithoutComma(
                          parseFloat(
                            (this.state.feeObj?.regular * transactionSize) /
                            btcTosatoshi,
                          ))
                        : 0
                      : this.state.feeObj?.regular
                        ? exponentialToDecimalWithoutComma(parseFloat(
                          (this.state.feeObj?.regular * transactionSize) /
                          btcTosatoshi,
                        ))
                        : 0,
                  )), 8)
                    .toString()}
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
                      fontFamily: Fonts.medium,
                      paddingHorizontal: widthDimen(5)
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
                    right: widthDimen(20)
                  }}>
                  {Singleton.getInstance().toFixednew(exponentialToDecimalWithoutComma(
                    this.state.amount
                      ? this.state.feeObj?.regular
                        ?
                        bigNumberSafeMath(this.state.amount == '.' ? '0' : this.state.amount, '+',
                          ((this.state.feeObj?.regular * transactionSize) /
                            btcTosatoshi),
                        )
                        : 0
                      : this.state.feeObj?.regular
                        ? exponentialToDecimalWithoutComma(parseFloat(
                          (this.state.feeObj?.regular * transactionSize) /
                          btcTosatoshi,
                        ))
                        : 0,
                  ), 8)
                    .toString()} {this.state.walletData?.coin_symbol?.toUpperCase()}
                </Text>
                {/* parseFloat(this.state.amount)+
                        parseFloat(
                          (this.state.feeObj?.regular * transactionSize) /
                            btcTosatoshi,
                        ) */}
              </View>
              {/* <View>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    marginVertical: 15,
                    marginHorizontal: 15,
                    textAlign: 'right',
                  }}>{`${LanguageManager.available}: ${
                  this.state.balance
                } ${this.state.walletData?.coin_symbol.toUpperCase()}`}</Text>
              </View> */}

              {/* {this.state.isLoading && <Loader color="white" />} */}
            </View>
          </ScrollView>
          <View style={{ marginVertical: 20, marginHorizontal: widthDimen(22) }}>
            <ButtonPrimary
              onpress={() => this.onSendAction()}
              btnstyle={{
                height: heightDimen(60),
                width: '100%',
                borderRadius: heightDimen(30),
              }}
              text={LanguageManager.next}
            />
          </View>
          {/* **********************************MODAL FOR ADVANCED GAS PRICE*********************************************** */}
          <Modal
            animationType="slide"
            // transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { }}>
            <SafeAreaView
              style={[
                styles.centeredView,
                { backgroundColor: ThemeManager.colors.backgroundColor },
              ]}>
              <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false })}
                style={{
                  // flex: 1,
                  backgroundColor: ThemeManager.colors.backgroundColor,
                  //  backgroundColor:"green",
                  opacity: 0.85,
                }}>
                <Image
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    marginLeft: 12,
                    marginTop: 10,
                    // tintColor: Colors.pink,
                  }}
                  source={ThemeManager.ImageIcons.iconBack}
                />
              </TouchableOpacity>
              <View
                style={[
                  styles.viewGas,
                  { backgroundColor: ThemeManager.colors.backgroundColor },
                ]}>
                <KeyboardAwareScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="always"
                  // extraScrollHeight={20}
                  enableOnAndroid={true}
                  bounces={false}>
                  <InputtextAddress
                    label={LanguageManager.gasPrice}
                    placeholder={LanguageManager.pleaseEnterGasPrice}
                    keyboardType={'number-pad'}
                    labelStyle={[
                      styles.labelTextStyle,
                      { color: ThemeManager.colors.textColor },
                    ]}
                    inputViewCustomStyle={{
                      borderColor: ThemeManager.colors.importBorder,
                      borderWidth: 1,
                    }}
                    value={this.state.advancedGasPrice}
                    onChangeNumber={text => {
                      this.setState({ advancedGasPrice: parseFloat(text) });
                    }}
                  />
                  <InputtextAddress
                    label={LanguageManager.gasLimit}
                    placeholder={LanguageManager.pleaseEnterGasLimit}
                    labelStyle={[
                      styles.labelTextStyle,
                      { color: ThemeManager.colors.textColor },
                    ]}
                    inputViewCustomStyle={{
                      borderColor: ThemeManager.colors.importBorder,
                      borderWidth: 1,
                    }}
                    keyboardType={'number-pad'}
                    value={this.state.advancedGasLimit}
                    onChangeNumber={text => {
                      this.setState({ advancedGasLimit: parseFloat(text) });
                    }}
                  />
                  <View style={styles.buttonStylesSubmit}>
                    <ButtonPrimary
                      btnstyle={{ height: 50, width: '102%', borderRadius: 14 }}
                      text={LanguageManager.submit}
                      onpress={() => this.onSubmitGas()}
                    />
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </SafeAreaView>
          </Modal>

          {/* *********************************************************** MODAL FOR CONFIRM TRANSACTION ********************************************************************** */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.showConfirmTxnModal}
            onRequestClose={() => this.setState({ showConfirmTxnModal: false })}>
            <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
              {/* <SimpleHeader
                back={false}
                backPressed={() => this.setState({showConfirmTxnModal: false})}
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
                  this.setState({ showConfirmTxnModal: false });
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
                  value={this.state.amount}
                  fiatValue={Singleton.getInstance().toFixed(
                    exponentialToDecimalWithoutComma(
                      this.state.walletData?.perPrice_in_fiat *
                      this.state.amount,
                    ),
                    2,
                  )}
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={this.state.walletData?.coin_symbol.toUpperCase()}
                  bottomLine={true}
                />

                <DetailOption
                  type={'From'}
                  item={'From'}
                  value={this.state.walletData?.wallet_address}
                  bottomLine={true}
                />

                <DetailOption
                  type={'To'}
                  item={'To'}
                  value={this.state.to_Address}
                  bottomLine={true}
                />

                <DetailOption
                  type={'AmountWithSmallText'}
                  item={'Network Fee'}
                  value={parseFloat(
                    (this.state.feeObj?.regular * transactionSize) /
                    btcTosatoshi,
                  ).toFixed(8)}
                  // fiatValue={walletData?.currency_symbol + (parseFloat(totalFee)).toFixed(2)}
                  fiatValue={Singleton.getInstance().toFixed(
                    exponentialToDecimalWithoutComma(
                      parseFloat(
                        (this.state.feeObj?.regular * transactionSize) /
                        btcTosatoshi,
                      ) * this.state.walletData?.perPrice_in_fiat,
                    ),
                    2,
                  )}
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={this.state.walletData?.coin_symbol.toUpperCase()}
                  bottomLine={true}
                />

                <DetailOption
                  type={'AmountWithSmallText'}
                  item={'Total value'}
                  value={parseFloat(
                    this.state.amount
                      ? parseFloat(this.state.amount) +
                      parseFloat(
                        (this.state.feeObj?.regular * transactionSize) /
                        btcTosatoshi,
                      )
                      : parseFloat(
                        (this.state.feeObj?.regular * transactionSize) /
                        btcTosatoshi,
                      ),
                  )
                    .toFixed(8)
                    .toString()}
                  fiatValue={Singleton.getInstance().toFixed(
                    exponentialToDecimalWithoutComma(
                      parseFloat(
                        this.state.amount
                          ? parseFloat(this.state.amount) +
                          parseFloat(
                            (this.state.feeObj?.regular * transactionSize) /
                            btcTosatoshi,
                          )
                          : parseFloat(
                            (this.state.feeObj?.regular * transactionSize) /
                            btcTosatoshi,
                          ),
                      )
                        .toFixed(8)
                        .toString() * this.state.walletData?.perPrice_in_fiat,
                    ),
                    2,
                  )}
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={this.state.walletData?.coin_symbol.toUpperCase()}
                  bottomLine={false}
                />

                {/* <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    width: '99%',
                    marginLeft: 22,
                  }}>
                  <AddressBox
                    img={{
                      uri: this.state.walletData?.coin_image.includes('https')
                        ? this.state.walletData?.coin_image
                        : BASE_IMAGE + this.state.walletData?.coin_image,
                    }}
                    address={this.state.walletData?.wallet_address}
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
                      uri: this.state.walletData?.coin_image.includes('https')
                        ? this.state.walletData?.coin_image
                        : BASE_IMAGE + this.state.walletData?.coin_image,
                    }}
                    address={this.state.to_Address}
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
                    {this.state.walletData.coin_symbol.toLowerCase() ==
                      'btc' ? (
                      <Text style={styles.fee__totalAmountvalue}>
                        {parseFloat(
                          this.state.amount
                            ? parseFloat(this.state.amount) +
                            parseFloat(
                              (this.state.feeObj?.regular *
                                transactionSize) /
                              btcTosatoshi,
                            )
                            : parseFloat(
                              (this.state.feeObj?.regular * transactionSize) /
                              btcTosatoshi,
                            ),
                        )
                          .toFixed(8)
                          .toString()}{' '}
                        {this.state.walletData?.coin_symbol?.toUpperCase()}
                      </Text>
                    ) : (
                      <Text style={styles.fee__totalAmountvalue}>
                        {' '}
                        {parseFloat(this.state.amount)
                          ? `${Singleton.getInstance().exponentialToDecimal(
                            parseFloat(this.state.amount),
                          )} ${this.state.walletData?.coin_symbol?.toUpperCase()} + ${Singleton.getInstance().toFixed(
                            this.state.totalFee,
                            8,
                          )} BTC`
                          : `${0} ${this.state.walletData?.coin_symbol?.toUpperCase()} + ${Singleton.getInstance().toFixed(
                            this.state.totalFee,
                            8,
                          )} BTC`}{' '}
                      </Text>
                    )}
                  </Text>
                </View> */}
              </View>
              <View
                style={{
                  marginBottom: heightDimen(20),
                  paddingHorizontal: widthDimen(22),
                }}>
                <ButtonPrimary
                  onpress={() =>
                    this.setState({
                      showConfirmTxnModal: false,
                      PinModal: true,
                      Pin: '',
                    })
                  }
                  btnstyle={{ height: heightDimen(60), width: '100%' }}
                  text={LanguageManager.send}
                />
              </View>
              {this.state.isLoading && <Loader color="white" />}
            </Wrap>
          </Modal>
          {/* *********************************************************** MODAL FOR SUCCESSFUL TRANSACTION ********************************************************************** */}
          {this.state.BasicModall && (
            <BasicModal
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
              showBtn={this.state.showAddContact}
              toAddress={this.state.to_Address}
              amount={this.state.amount}
              contact={() => {
                this.setState({ BasicModall: false });
                navigate(NavigationStrings.AddNewContacts,{
                  address: this.state.to_Address,
                  coinFamily: this.state.walletData.coin_family,
                });
              }}
              coinSymbol={this.state.walletData.coin_symbol.toUpperCase()}
            />
          )}
          {/* *********************************************************** MODAL FOR PIN ********************************************************************** */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.PinModal}
            onRequestClose={() => this.setState({ PinModal: false })}>
            <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
              <SimpleHeader
                back={false}
                backPressed={() => this.setState({ PinModal: false })}
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
                            this.state.Pin.length == 0
                              ? index == 0
                                ? true
                                : false
                              : this.state.Pin.length == index + 1
                          }
                          digit={this.state.Pin.length > index ? '*' : ''}
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
          {this.state.isLoading && <Loader color="white" />}
        </Wrap>
        <SafeAreaView style={{ backgroundColor: Colors.black }} />
      </>
    );
  }
}

const mapStateToProp = state => {
  // const {} = state.ethReducer;
  return {
    // walletName,
    // selectedAddress,
  };
};

export default connect(mapStateToProp, {
  getBnbNonce,
  getBnbGasPrice,
  sendBNB,
  getBnbGasEstimate,
  getEthTokenRaw,
  walletFormUpdate,
  CheckIsContactExist
})(SendBTC);
