/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import { Wallet } from 'ethers';
import React, { Component, } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import WebView from 'react-native-webview';
import createInvoke from 'react-native-webview-invoke/native';
import { connect } from 'react-redux';
import web3 from 'web3';
import * as Constants from '../../../Constant';
import { DAPP_IMG_URL, IS_PRODUCTION } from '../../../Endpoints';
import { getBnbGasEstimate, getBnbNonce, getSTCGasPrice, getStcGasEstimate, sendBNB } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { Colors } from '../../../theme';
import Images from '../../../theme/Images';
import {
  getDappSignedTxn,
  getEthBaseFeeDapp,
  getNonceValueDapp,
  getPriorityDapp,
  getStcNonce,
  getTotalGasFeeDapp,
  getsignRawTxnDappBnb,
  getsignRawTxnDappStc,
  signPersonalMessage,
} from '../../../utils';
import { ButtonPrimary, Inputtext, } from '../../common';
import Loader from '../Loader/Loader';
import styles from './DappBrowserSwapStyle';
import { goBack } from '../../../navigationsService';
var web3BscUrl =
  IS_PRODUCTION == 0
    ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    : 'https://bsc-dataseed1.binance.org:443';
const gasFeeMultiplier = 0.000000000000000001;
var that = undefined;
let isLoadAlert = false
class DappBrowserSwap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      jsContent: '',
      address: this.props.item
        ? this.props.item?.coin_family == 6
          ? Singleton.getInstance().defaultBnbAddress
          : this.props.item?.coin_family == 4
            ? Singleton.getInstance().defaultStcAddress
            : Singleton.getInstance().defaultEthAddress
        : Singleton.getInstance().defaultEthAddress,
      chainId: this.props.item?.coin_family == 6 ? 56 : this.props.coin_family == 1 ? 1 : 1209,

      rpcUrl:
        this.props.item?.coin_family == 6 ? Singleton.getInstance().bnbLink : this.props.coin_family == 1 ? this.props.publicEthUrl : this.props.publicStcUrl,
      privacyMode: false,
      isVisible: false,
      signingData: '',
      calculatedFee: '',
      gasPrice: '',
      gas: '',
      feeIndex: 1,
      canGoBack: false,
      gasFeeMultiplier: 0.000000000000000001,
      canGoForward: false,
      isLoading: false,
      mnemonics: '',
      selectedNetwork: this.props.item
        ? this.props.item?.coin_family == 6
          ? 'Binance'
          : this.props.item?.coin_family == 4
            ? 'Saitachain'
            : 'Ethereum'
        : 'Ethereum',
      selectedNetworkImageUri: this.props.item
        ? this.props.item?.coin_family == 6
          ? `${DAPP_IMG_URL}/images/bnb.png`
          : this.props.item?.coin_family == 6
            ? `${DAPP_IMG_URL}/images/stc.png`
            : `${DAPP_IMG_URL}/images/eth.png`
        : `${DAPP_IMG_URL}/images/eth.png`,
      url: '',
      enteredURL: this.props.url
        ? this.props.url
        : 'https://app.compound.finance',
      startUrl: this.props.url,
      isNetworkModalVisible: false,
      advanceModalVisible: false,
      favoriteArray: [],
      isFavorite: false,
      urlTitle: '',
      showAlertDialog: false,
      alertTxt: '',
      currentUrl: '',
      currencyName: '',
      gasLimit: 0,
      dialogGasPrice: 0,
      dialogGasLimit: 0,
      dialogNonce: 0,
      advanceGasFees: 0,
      advanceGasPrice: 0,
      advanceMode: false,
      advancedGasLimit: 0,
      advancePriorityFee: 0,
      baseFee: 0,
      MaxFee: 0,
      advancedSet: false,
      priorityFees: 0,
      web3BscUrl: this.props.item?.coin_family == 6 ? Singleton.getInstance().bnbLink : this.props.coin_family == 1 ? this.props.publicEthUrl : this.props.publicStcUrl,
      finished: false,
      txnTobeSigned: undefined,
      gotSigningRequest: false,
      rejected: false,
      tronAddress: 'TWnLSuJyjJFCsffuFWUMXtqTX2YfhtvbUT',
      tronPvtKey: '',
      modalVisibleBnb: false,
      ethPrice: 0,
      coin_family: this.props.item?.coin_family
    };
  }
  invoke = createInvoke(() => this.webview);
  componentDidMount() {
    this.getEthPriceinFiat();
    that = this;
    if (this.state.selectedNetwork != 'Tron') {
      var provider = new web3.providers.HttpProvider(this.state.rpcUrl);
      this.web3 = new web3(provider);
      console.log('addd', Singleton.getInstance().defaultEthAddress);
      Singleton.getInstance()
        .newGetData(Singleton.getInstance().defaultEthAddress)
        .then(mnemonics => {
          var address = this.state.address;
          this.setState({ mnemonics: mnemonics, address: address });
          setTimeout(() => {
            this.webview?.reload();
          }, 800);
          if (this.state.jsContent === '') {
            if (Platform.OS === 'ios') {
              RNFS.readFile(`${RNFS.MainBundlePath}/trust-min.js`, 'utf8').then(
                content => {
                  console.log('content');
                  this.setState(
                    {
                      jsContent: this.getJavascript(
                        this.state.chainId,
                        this.state.rpcUrl,
                        address,
                        content,
                      ),
                      content: content,
                    },
                    () => {
                      this.setUrl(2);
                    },
                  );
                },
              ).catch(err => {
                console.log('err readfile', err);
              })
            } else {
              RNFS.readFileAssets(`trust-min.js`, 'utf8').then(content => {
                this.setState(
                  {
                    jsContent: this.getJavascript(
                      this.state.chainId,
                      this.state.rpcUrl,
                      address,
                      content,
                    ),
                    content: content,
                  },
                  () => {
                    this.setUrl(2);
                  },
                );
              });
            }
          }
        });
      this.getBaseFee();
    } else {
      Singleton.getInstance()
        .newGetData(`${Singleton.getInstance().defaultTRXAddress}_pk`)
        .then(trnPvKey => {
          this.setState({ tronPvtKey: trnPvKey });
        });
    }
  }

  getEthPriceinFiat() {
    let chain = this.props.chain=='sbc'?'stc':this.props.chain=='bsc'?'bnb':'eth'
    console.log("::::::::::::",chain);
    this.props.myWallets.find(value => {
      if (chain == value.coin_symbol.toLowerCase() && this.props.item?.coin_family == value?.coin_family) {
        let perPrice_in_fiat = parseFloat(value.perPrice_in_fiat);
        this.setState({ ethPrice: perPrice_in_fiat });
        console.warn('MM', '-----value.perPrice_in_fiat', perPrice_in_fiat);
        return;
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
  }

  screenFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
    goBack();
    return true;
  };
  onLoadStart = event => {
    this.setState({ isLoading: Platform.OS != 'ios' ? true : true });
  };
  onShouldStartLoadWithRequest = () => {
    return true;
  };
  changeNetwork = network => {
    console.log(":::::changeNetwork::::",network, this.state.rpcUrl);
    if (network == 'Saitachain') {
      let provider = new web3.providers.HttpProvider(this.props.publicStcUrl);
      this.web3 = new web3(provider);
      this.setState({
        isNetworkModalVisible: false,
        selectedNetwork: 'Saitachain',
        selectedNetworkImageUri: DAPP_IMG_URL + '/images/stc.png',
        chainId: IS_PRODUCTION == 0 ? 129 : 1209,
        rpcUrl: this.props.publicStcUrl,
        jsContent: this.getJavascript(
          IS_PRODUCTION == 0 ? 129 : 1209,
          this.props.publicStcUrl,
          this.state.address,
          this.state.content,
        ),
      });

      let script = `
  var config = {
      ethereum: {
          address: "${this.state.address}",
          chainId: ${this.web3.utils.toHex(IS_PRODUCTION == 0 ? '129' : '1209')},
          rpcUrl: "${this.props.publicStcUrl}"
      }
  };
  ethereum.setConfig(config);
  `;
      console.log('script++++', script);
      this.webview.injectJavaScript(script);
      let chainId = this.web3.utils.toHex(IS_PRODUCTION == 0 ? '129' : '1209');
      let js = `trustwallet.ethereum.emitChainChanged('${chainId}');`;
      this.webview.injectJavaScript(js);
    } else if (network == 'Ethereum') {
      let provider = new web3.providers.HttpProvider(
        IS_PRODUCTION == 0 ? Constants.testnetEth : this.props.publicEthUrl,
      );
      this.web3 = new web3(provider);
      this.setState({
        isNetworkModalVisible: false,
        selectedNetwork: 'Ethereum',
        selectedNetworkImageUri: DAPP_IMG_URL + '/images/eth.png',
        chainId: IS_PRODUCTION == 0 ? '5' : '1',
        rpcUrl:
          IS_PRODUCTION == 0
            ? Constants.testnetEth
            : this.props.publicEthUrl,
        jsContent: this.getJavascript(
          IS_PRODUCTION == 0 ? '5' : '1',
          IS_PRODUCTION == 0
            ? Constants.testnetEth
            : this.props.publicEthUrl,
          this.state.address,
          this.state.content,
        ),
      });

      let script = `
     var config = {
         ethereum: {
             address: "${this.state.address}",
             chainId: ${this.web3.utils.toHex(IS_PRODUCTION == 0 ? 5 : 1)},
             rpcUrl: "${IS_PRODUCTION == 0
          ? Constants.testnetEth
          : this.props.publicEthUrl
        }"
         }
     };
     ethereum.setConfig(config);
     `;
      console.log('script++++', script);
      this.webview.injectJavaScript(script);
      let chainId = this.web3.utils.toHex(IS_PRODUCTION == 0 ? '5' : '1');
      let js = `trustwallet.ethereum.emitChainChanged('${chainId}');`;
      console.log('---------js', js);
      this.webview.injectJavaScript(js);

      // setTimeout(() => {
      //   console.log('reload called');
      //   this.webview.reload();
      //  }, 2000);
    } else if (network == 'Binance') {
      console.log("Binance:::::::::::");
      let provider = new web3.providers.HttpProvider(web3BscUrl);
      this.web3 = new web3(provider);
      this.setState({
        isNetworkModalVisible: false,
        selectedNetwork: 'Binance',
        selectedNetworkImageUri: DAPP_IMG_URL + '/images/bnb.png',
        chainId: IS_PRODUCTION == 0 ? 97 : 56,
        rpcUrl: web3BscUrl,
        jsContent: this.getJavascript(
          IS_PRODUCTION == 0 ? 97 : 56,
          web3BscUrl,
          this.state.address,
          this.state.content,
        ),
      });

      let script = `
  var config = {
      ethereum: {
          address: "${this.state.address}",
          chainId: ${this.web3.utils.toHex(IS_PRODUCTION == 0 ? '97' : '56')},
          rpcUrl: "${web3BscUrl}"
      }
  };
  ethereum.setConfig(config);
  `;
      console.log('script++++', script);
      this.webview.injectJavaScript(script);
      let chainId = this.web3.utils.toHex(IS_PRODUCTION == 0 ? '97' : '56');
      let js = `trustwallet.ethereum.emitChainChanged('${chainId}');`;
      this.webview.injectJavaScript(js);
    }
  };
  onMessage = async ({ nativeEvent }) => {
    let message = JSON.parse(nativeEvent.data);
    console.warn('MM', '---------message------', JSON.parse(nativeEvent.data));
    console.warn('MM', '---------selectedNetwork------', this.state.selectedNetwork);
    if (message.name == 'signTransaction') {
      if (!message.object.value) {
        message.object.value = '0x0';
      }
      if (!message.object.gas) {
        message.object.gas = '0x238ec';
      }
      this.setState({ signingData: message });
      this.getNonceAndGas(
        this.hex2dec(message.object.value),
        this.state.selectedNetwork == 'Ethereum' ? 'eth' : this.state.selectedNetwork == 'Saitachain' ? 'stc' : 'bnb',
        this.state.selectedNetwork == 'Ethereum' ? 'transaction' : 'binance',
        message
      );
    } else if (message.name == 'requestAccounts') {
      let js = `trustwallet.${message?.network}.setAddress('${this.state.address}');`;

      this.webview.injectJavaScript(js);
      let mmid = message.id;
      let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, ['${this.state.address}'])`;
      this.webview.injectJavaScript(js1);
    } else if (
      message.name == 'signPersonalMessage' ||
      message.name == 'signMessage'
    ) {
      let mmid = message.id;
      let pKey = await Singleton.getInstance().newGetData(
        this.state.address + '_pk',
      );
      let signedMessage = await signPersonalMessage(
        message.object.data,
        pKey,
        this.state.coin_family
      );
      let js = `trustwallet.${message?.network}.sendResponse(${mmid}, "${signedMessage}")`;
      this.webview.injectJavaScript(js);
    } else if (message.name == 'switchEthereumChain') {
      let chainId = this.hex2dec(message?.object?.chainId);
      console.log('chainId:', chainId);
      let mmid = message.id;
      if ((chainId == 56 || chainId == 97) && (this.props.chain == 'bsc' || this.props.chain == '')) {
        this.changeNetwork('Binance');
        let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, null)`;
        this.webview.injectJavaScript(js1);
      } else if ((chainId == 1 || chainId == 5) && (this.props.chain == 'eth' || this.props.chain == '')) {
        this.changeNetwork('Ethereum');
        let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, null)`;
        this.webview.injectJavaScript(js1);
      } else if ((chainId == 129 || chainId == 1209) && (this.props.chain == 'sbc' || this.props.chain == '')) {
        this.changeNetwork('Saitachain');
        let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, null)`;
        this.webview.injectJavaScript(js1);
      } else {
        console.log('in error ...');
        let mmid = message.id;
        let js = `trustwallet.${message?.network}.sendError(${mmid}, "Network not supported")`;
        this.webview.injectJavaScript(js);
      }
    }
  };
  getJavascript = function (chainId, rpcUrl, address, jsContent) {
    console.log("chainId::::::", chainId, "rpcUrl:::::", rpcUrl, "address::", address);
    let source = '';
    source = `
      ${jsContent}
      (function() {
       var config = {
        ethereum: {
          address: '${address}',
          chainId: '${chainId}',
          rpcUrl: '${rpcUrl}'
       }
       };
       trustwallet.ethereum = new trustwallet.Provider(config);
       trustwallet.postMessage = (jsonString) => {
        window.ReactNativeWebView?.postMessage(JSON.stringify(jsonString))
       };
       window.ethereum = trustwallet.ethereum;
    })();
      `;
    return source;
  };

  ConvertBase(num) {
    return {
      from: function (baseFrom) {
        return {
          to: function (baseTo) {
            return parseInt(num, baseFrom).toString(baseTo);
          },
        };
      },
    };
  }
  hex2dec(num) {
    return this.ConvertBase(num).from(16).to(10);
  }
  async getNonceAndGas(amount, coinsym, coinType,signingData) {
    console.log("coinsym:::::",coinsym);
    //  alert(coinsym)
    if (coinsym.toLowerCase() == 'eth') {
      var gasFees = await getTotalGasFeeDapp();
      var currentNonce = await getNonceValueDapp(this.state.address);
      ////console.log(
      // 'GAS_FEES-----',
      //   gasFees,
      //   'this.hex2dec(this.state.signingData.object.gas):::',
      //   this.hex2dec(this.state.signingData.object.gas),
      // );
      //console.warn('MM','NONCE_VALUE-----', currentNonce);
      this.nonce = currentNonce;
      var initialValue =
        gasFees * this.hex2dec(signingData.object.gas);
      var fee = initialValue * gasFeeMultiplier;
      //console.warn('MM','Calculate gasFees 123333--- ', gasFees);
      //console.warn('MM','Calculate fees total 123333--- ', fee);
      //console.warn('MM','Calculate signingData --- ', this.state.signingData);
      this.setState({
        isVisible: true,
        calculatedFee: fee.toFixed(5),
        gasPrice: gasFees,
      });
    }
    if (coinsym.toLowerCase() == 'bnb') {
      let data = {
        from: Singleton.getInstance().defaultBnbAddress,
        to: Singleton.getInstance().defaultBnbAddress,
        amount: 0,
      };
      let wallet_address = Singleton.getInstance().defaultBnbAddress;
      let access_token = Singleton.getInstance().access_token;
      let blockChain = 'binancesmartchain';
      let coin_symbol = 'bnb';
      let contractAddress = 'bnb';
      this.props
        .getBnbNonce({ wallet_address, access_token, blockChain, coin_symbol })
        .then(nonce => {
          //console.warn('MM','Chk bnb nonce::::::::', nonce);
          this.props
            .getBnbGasEstimate({
              blockChain,
              data,
              contractAddress,
              access_token,
            })
            .then(response => {
              //console.warn('MM','response GAS--bnb ', response);
              var standard = response.resultList[0].safe_gas_price * 1000000000;
              var initialValue =
                standard * this.hex2dec(signingData.object.gas);
              var fee = initialValue * gasFeeMultiplier;
              this.setState({
                isVisible: true,
                calculatedFee: fee.toFixed(5),
                gasPrice: standard,
              });
            })
            .catch(err => {
              //console.warn('MM','Error: ', err);
              this.setState({ isLoading: false });
            });
        });
    }
    if (coinsym.toLowerCase() == 'stc') {
      let access_token = Singleton.getInstance().access_token;
      console.log("access_token:::::",access_token,signingData);
      let gas =signingData.object.gas? this.hex2dec(signingData.object.gas):0
      console.log("gas:::::",gas);
      this.props.getSTCGasPrice().then(gasPrices => {
        console.log("gasPrices:::::", gasPrices);
        this.props
          .getStcGasEstimate({
            access_token,
          })
          .then(response => {
            let gasLimit = response.data.find(item => item.name == 'swap')
            let standard = gasPrices?.data?.safeGasPrice * 1000000000;
            let initialValue =
              standard * (gas>0?gas:gasLimit.gasLimit);
            let fee = initialValue * gasFeeMultiplier;
            console.log("calculatedFee::::", fee.toFixed(5), "gasPrice:::::", standard, "gasLimit:::", gasLimit,gas);
            this.setState({
              isVisible: true,
              calculatedFee: fee.toFixed(5),
              gasPrice: standard,
              gasLimit: gas>0?gas:gasLimit.gasLimit
            });
          })
          .catch(err => {
            console.warn('MM', 'Error: getBnbGasEstimate', err);
            this.setState({ isLoading: false });
          });
      }).catch(err => {
        console.warn('MM', 'Error: getSTCGasPrice', err);
        this.setState({ isLoading: false });
      })
    }
  }

  getTotalUsd(value, fee, ethprice) {
    let data = ethprice * (value + fee);
    return Singleton.getInstance().toFixed(data, 2);
  }
  onSubmitGas() {
    if (parseFloat(this.state.advancedGasLimit) == 0.0) {
      Singleton.showAlert(Constants.ENTER_GASLIMIT);
      return;
    }
    if (parseFloat(this.state.advancedGasLimit) < 21000) {
      Singleton.showAlert(Constants.VALID_GASLIMIT);
      return;
    }
    if (parseFloat(this.state.advancePriorityFee) == 0.0) {
      Singleton.showAlert(Constants.VALID_PRIORITY_FEE);
      return;
    }
    console.log(
      'gas gwei price----',
      2 * this.state.baseFee + parseInt(this.state.advancePriorityFee),
    );
    console.warn('MM', 'gas limit----', this.state.advancedGasLimit);
    let gasGwei =
      parseFloat(2 * this.state.baseFee) +
      parseFloat(this.state.advancePriorityFee);
    console.log(
      'T_GAS_FEES----',
      (
        gasGwei *
        this.state.advancedGasLimit *
        this.state.gasFeeMultiplier
      ).toFixed(8),
    );
    this.setState({
      advanceGasPrice: gasGwei,
      advanceGasFees: (
        gasGwei *
        this.state.advancedGasLimit *
        this.state.gasFeeMultiplier
      ).toFixed(8),
      advanceMode: true,
      advanceModalVisible: false,
      isVisible: true,
    });
  }

  onSubmitGasbnb() {
    if (parseFloat(this.state.advanceGasPrice) == 0.0) {
      Singleton.showAlert(Constants.VALID_GASPRICE);
      return;
    }
    if (parseFloat(this.state.advancedGasLimit) == 0.0) {
      Singleton.showAlert(Constants.ENTER_GASLIMIT);
      return;
    }
    if (parseFloat(this.state.advancedGasLimit) < 21000) {
      Singleton.showAlert(Constants.VALID_GASLIMIT);
      return;
    }
    const price = this.state.advanceGasPrice * 10 ** 9;
    this.setState({
      advanceGasPrice: price,
      advanceGasFees: (
        price *
        this.state.advancedGasLimit *
        this.state.gasFeeMultiplier
      ).toFixed(8),
      advanceMode: true,
      advanceModalVisible: false,
      modalVisibleBnb: false,
      isVisible: true,
    });
  }
  async makeRaxTxn() {
    if (this.props.item?.coin_family == 1) {
      const wallet = await Wallet.fromMnemonic(this.state.mnemonics);
      var pKey = wallet.privateKey;
      //console.warn('MM','here-------pKey', pKey);
      var gasPrice = this.state.gasPrice;
      var priorityFees = this.state.priorityFees;
      let gasLimit = this.state.signingData.object.gas; //convert in hex
      var currentNonce = this.nonce;
      let amount = this.state.signingData.object.value;
      if (this.state.advanceMode) {
        gasLimit = this.web3.utils.toHex(this.state.advancedGasLimit); //convert in hex
        gasPrice = this.state.advanceGasPrice * 1000000000;
        priorityFees = this.web3.utils.toHex(this.state.advancePriorityFee);
      }
      //console.warn('MM','GAS_PRICE----', gasPrice);
      //console.warn('MM','GAS_LIMIT----', gasLimit);
      //console.warn('MM','NONCE_VALUE----', amount);
      var hexedAmount = this.web3.utils.toHex(amount); // convert in hex
      var hexedGasPrice = this.web3.utils.toHex(gasPrice); //convert in hex
      var hexedPriorityPrice = this.web3.utils.toHex(priorityFees); //convert in hex
      try {
        getDappSignedTxn(
          pKey,
          hexedAmount,
          hexedGasPrice,
          gasLimit,
          currentNonce,
          this.state.signingData.object.to,
          this.state.signingData.object.from,
          this.state.signingData.object.data,
          'eth',
          hexedPriorityPrice,
        ).then(serializedTxn => {
          //console.warn('MM','chk signed txn::::::eth:::::', serializedTxn);
          this.sendCoin(serializedTxn);
        });
      } catch (err) {
        //console.warn('MM','rtt----', err);
      }
    } else if (this.props.item?.coin_family == 6) {
      Singleton.getInstance()
        .newGetData(`${Singleton.getInstance().defaultBnbAddress}_pk`)
        .then(pk => {
          var pKey = pk;
          let gasLimit = this.state.signingData.object.gas; // in hex
          let gasPrice = this.web3.utils.toHex(this.state.gasPrice); // in hex
          let amount = (
            this.hex2dec(
              this.state.signingData.object.value
                ? this.state.signingData.object.value
                : '0x0',
            ) /
            10 ** 18
          ).toString();
          getsignRawTxnDappBnb(
            pKey,
            amount,
            gasPrice,
            gasLimit,
            this.nonce,
            this.state.signingData.object.to,
            this.state.signingData.object.from,
            this.state.signingData.object.data,
            parseInt(this.state.chainId),
          ).then(serializedTx => {
            //console.warn('MM','this.serializedTx-------', serializedTx);
            this.sendCoin(serializedTx);
          });
        })
        .catch(err => {
          Singleton.showAlert('Unable to process transaction.');
        });
    } else if (this.props.item?.coin_family == 4) {
      Singleton.getInstance()
        .newGetData(`${Singleton.getInstance().defaultStcAddress}_pk`)
        .then(pk => {
          let pKey = pk;
          let gasLimit = this.state.gasLimit; // in hex
          let gasPrice = this.web3.utils.toHex(this.state.gasPrice); // in hex
          let amount = (
            this.hex2dec(
              this.state.signingData.object.value
                ? this.state.signingData.object.value
                : '0x0',
            ) /
            10 ** 18
          ).toString();
          getStcNonce(Singleton.getInstance().defaultStcAddress).then(nonce => {
            getsignRawTxnDappStc(
              pKey,
              amount,
              gasPrice,
              gasLimit,
              nonce,
              this.state.signingData.object.to,
              this.state.signingData.object.from,
              this.state.signingData.object.data,
              parseInt(this.state.chainId),
            ).then(serializedTx => {
              console.warn('MM', 'this.serializedTx-------', serializedTx);
              this.sendCoin(serializedTx);
            });
          })
        })
        .catch(err => {
          Singleton.showAlert('Unable to process transaction.');
        });
    }
  }
  sendCoin(serializedTx) {
    let amountt = Singleton.getInstance().exponentialToDecimal(
      this.state.signingData.object.value,
    );
    let data = {
      from: this.state.signingData.object.from,
      to: this.state.signingData.object.to,
      amount: (this.hex2dec(amountt) / 10 ** 18).toString(),
      gas_price: this.state.gasPrice,
      gas_estimate: this.hex2dec(this.state.signingData.object.gas),
      tx_raw: serializedTx,
      tx_type: 'WITHDRAW',
      nonce: this.nonce,
      chat: 0,
      is_smart: 1,
      typeMessage: 'swapDapp',
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain =
      this.state.selectedNetwork == 'Ethereum'
        ? 'ethereum'
        : this.state.selectedNetwork == 'Saitachain'
          ? 'saitachain'
          : 'binancesmartchain';
    let coin_symbol = this.state.selectedNetwork == 'Ethereum' ? 'eth' : this.state.selectedNetwork == 'Saitachain' ? 'stc' : 'bnb';
    console.log('data:::::', data);
    this.props
      .sendBNB({ data, access_token, blockChain, coin_symbol })
      .then(res => {
        console.log(
          '-----------------------Response------------',
          res.tx_hash,
          this.state.signingData.id,
        );
        this.setState({ isVisible: false, isLoading: false });
        let mmid = this.state.signingData.id;
        let hash = res.tx_hash;
        let js = `trustwallet.ethereum.sendResponse(${mmid}, '${hash}')`;
        this.webview.injectJavaScript(js);
      })
      .catch(err => {
        console.warn('MM', 'Error: ', err);
        let js = `trustwallet.ethereum.sendError(${this.state.signingData.id}, '${err.message}')`;
        this.webview.injectJavaScript(js);
        this.setState({ isVisible: false, isLoading: false });
        Singleton.showAlert(err.message);
      });
  }
  validURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(str);
  }
  setUrl(type) {
    if (this.validURL(this.state.enteredURL)) {
      if (!this.state.enteredURL.startsWith('http')) {
        console.warn('MM', 'true ==>>> ', 'https://' + this.state.enteredURL);
        this.setState({ url: 'https://' + this.state.enteredURL });
      } else {
        console.warn('MM', '2true ==>>> ', 'https://' + this.state.enteredURL);
        // 1 is reload
        if (type == 1) {
          console.warn('MM', 'check type 1 part=====>', this.state.enteredURL);
          if (this.state.url == this.state.enteredURL) {
            this.setState({ url: '' }, () => {
              this.setState({ url: this.state.enteredURL });
            });
          }
        } else {
          console.warn('MM', '3true ==>>> ', 'https://' + this.state.enteredURL);
          this.setState({ url: this.state.enteredURL });
        }
      }
    } else {
      console.warn('MM', 'check else part=====>', this.state.enteredURL);
      console.warn('MM', '4true ==>>> ', 'https://' + this.state.enteredURL);
      let a = this.state.enteredURL.includes('about:blank')
        ? this.props.url
        : this.state.enteredURL;
      if (!this.state.enteredURL.includes('https://')) {
        this.setState({
          startUrl: 'https://www.google.com/search?q=' + this.state.enteredURL,
        });
      }
      this.setState({ url: 'https://www.google.com/search?q=' + a });
    }
  }
  advanceModeDialogOpen() {
    this.setState({
      advanceModalVisible:
        this.state.selectedNetwork == 'Ethereum' ? true : false,
      modalVisibleBnb: this.state.selectedNetwork == 'Binance' ? true : false,
      isVisible: false,
    });
  }

  onLoadEnd = event => {
    this.setState({ isLoading: false });
  };
  render() {
    //console.warn('MM',"?????url",this.state.startUrl);
    return (
      <>
        <SafeAreaView style={{ flex: 1, }}>
          <View style={{ flex: 1, marginTop: -12 }}>
            {/* <SimpleHeader title={''} /> */}
            <WebView
              ref={ref => (this.webview = ref)}
              source={{ uri: this.state.startUrl }}
              injectedJavaScriptBeforeContentLoaded={this.state.jsContent}
              style={{ flex: 1 }}
              onMessage={
                this.state.selectedNetwork != 'Tron'
                  ? this.onMessage
                  : this.invoke.listener
              }
              clearCache={true}
              onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
              onNavigationStateChange={navState => {
                console.warn('MM', ' navState ==>>>', navState);
                this.setState({
                  canGoBack: navState.canGoBack,
                  canGoForward: navState.canGoForward,
                  enteredURL: navState.url,
                  urlTitle: navState.title,
                });
                if (this.state.startUrl != this.state.enteredURL) {
                } else {
                  this.setState({ canGoBack: false });
                }
              }}
              startInLoadingState={true}
              sendCookies
              javascriptEnabled
              allowsInlineMediaPlayback
              useWebkit
              testID={'browser-webview'}
              originWhitelist={["http://*", "https://*", "intent://*"]}
              onLoadStart={this.onLoadStart}
              onLoadEnd={this.onLoadEnd}
              onError={err => {

                if (!isLoadAlert) {
                  isLoadAlert = true
                  Alert.alert('Alert', 'Unable to load, please try again later.', [{
                    text: 'Try Again',
                    onPress: () => {
                      isLoadAlert = false
                      this.webview?.reload()
                    }
                  }, {
                    text: 'Cancel',
                    onPress: () => {
                      isLoadAlert = false
                    }
                  }], {
                    cancelable: true,

                  })
                }
                console.warn('MM', 'chk err', err);
              }}
            />
          </View>
        </SafeAreaView>
        <SafeAreaView style={{ backgroundColor: Colors.white }} />
        <Modal
          visible={this.state.isVisible}
          animationType="fade"
          style={{ margin: 0, justifyContent: 'flex-end' }}>
          {this.state.signingData != '' && (
            <>
              <View style={styles.modalView}>
                <View style={styles.modalinner}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 30,
                    }}>
                    <Text style={styles.titleSign}>Confirm Transaction</Text>
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        height: 40,
                        width: 40,
                        alignItems: 'flex-end',
                      }}
                      onPress={() => {
                        let js = `trustwallet.ethereum.sendError(${this.state.signingData.id}, 'Cancelled')`;
                        this.webview.injectJavaScript(js);
                        this.setState({ isVisible: false });
                      }}>
                      <FastImage
                        style={{ width: 15, height: 15, marginRight: 10 }}
                        resizeMode={FastImage.resizeMode.contain}
                        source={Images.cancel}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.vwSignTransaction}>
                    <Text style={styles.textLbl}>To</Text>
                    <Text style={styles.txtValue}>
                      {this.state.signingData.object.to}
                    </Text>
                  </View>
                  <View style={styles.vwSignTransaction}>
                    <Text style={styles.textLbl}>From</Text>
                    <Text style={styles.txtValue}>
                      {this.state.signingData.object.from}
                    </Text>
                  </View>
                  {/* {this.state.advanceMode == false && this.renderSlowStandardFast()} */}
                  <View style={styles.vwSignTransaction}>
                    <Text style={styles.textLbl}>Gas Fee</Text>
                    <Text style={styles.txtValue}>
                      {this.state.advanceMode
                        ? this.state.advanceGasFees
                        : this.state.calculatedFee}{' '}
                      {this.state.selectedNetwork == 'Ethereum' ? 'ETH' :this.state.selectedNetwork == 'Saitachain' ? 'STC' : 'BNB'}
                      {' ('}
                      {Singleton.getInstance().CurrencySymbol}
                      {Singleton.getInstance().toFixed(
                        this.state.ethPrice * this.state.calculatedFee,
                        2,
                      )}
                      {')'}
                    </Text>
                  </View>
                  <View style={styles.vwSignTransaction}>
                    <Text style={styles.textLbl}>Total </Text>
                    <Text style={styles.txtValue}>
                      {parseFloat(
                        parseFloat(
                          this.hex2dec(this.state.signingData.object.value) /
                          10 ** 18,
                        ) +
                        parseFloat(
                          this.state.advanceMode
                            ? this.state.advanceGasFees
                            : this.state.calculatedFee,
                        ),
                      ).toFixed(8)}{' '}
                      {this.state.selectedNetwork == 'Ethereum' ? 'ETH' :this.state.selectedNetwork == 'Saitachain' ? 'STC' : 'BNB'}
                      {' ('}
                      {Singleton.getInstance().CurrencySymbol}
                      {this.getTotalUsd(
                        parseFloat(
                          this.hex2dec(this.state.signingData.object.value) /
                          10 ** 18,
                        ),
                        parseFloat(this.state.calculatedFee),
                        parseFloat(this.state.ethPrice),
                      )}
                      {')'}
                    </Text>
                  </View>

                  <ButtonPrimary
                    text="Submit"
                    onpress={() => {
                      this.setState({ isLoading: true });
                      setTimeout(() => {
                        this.makeRaxTxn();
                      }, 1000);
                    }}
                    btnstyle={{ width: '80%', padding: 10 }}
                  />
                  {/* <TouchableOpacity
                    onPress={() => { this.advanceModeDialogOpen(); }}>
                    <Text style={styles.modalTitle}>Advance Mode</Text>
                  </TouchableOpacity>
                  {this.state.advanceMode && (
                    <TouchableOpacity
                      onPress={() => { this.setState({ advanceMode: false }); }}>
                      <Text style={styles.modalTitle}>Reset</Text>
                    </TouchableOpacity>
                  )} */}
                </View>
              </View>
            </>
          )}
          {this.state.isLoading && <Loader />}
        </Modal>

        {/* **********************************MODAL FOR ADVANCED BNB GAS PRICE*********************************************** */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisibleBnb}
          onRequestClose={() => { }}>
          <View style={styles.viewGas}>
            <TouchableOpacity
              onPress={() =>
                this.setState({ modalVisibleBnb: false, isVisible: true })
              }
              style={{ flex: 0.1, marginBottom: 40 }}>
              <FastImage
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 10,
                  alignSelf: 'flex-end',
                }}
                resizeMode={FastImage.resizeMode.contain}
                source={Images.cancel}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
                onPress={() => this.setState({ modalVisibleBnb: false })}
                style={{ flex: 0.5, backgroundColor: Colors.screenBg, opacity: 0.85 }}>
              </TouchableOpacity> */}
            <View style={styles.viewGas}>
              <Inputtext
                label="Gas Price"
                placeholder="Please enter Gas Price"
                value={this.state.advanceGasPrice}
                labelStyle={styles.labelTextStyle}
                keyboardType="decimal-pad"
                maxLength={10}
                onChangeNumber={text =>
                  this.setState({ advanceGasPrice: parseFloat(text) })
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
                <ButtonPrimary
                  title="Submit"
                  onPress={() => this.onSubmitGasbnb()}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* **********************************MODAL FOR ADVANCED GAS PRICE*********************************************** */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.advanceModalVisible}
          onRequestClose={() => { }}>
          <View style={styles.viewGas}>
            <TouchableOpacity
              onPress={() =>
                this.setState({ advanceModalVisible: false, isVisible: true })
              }
              style={{ flex: 0.1, marginBottom: 40 }}>
              <FastImage
                tintColor={'white'}
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 10,
                  alignSelf: 'flex-end',
                }}
                resizeMode={FastImage.resizeMode.contain}
                source={Images.cancel}
              />
            </TouchableOpacity>
            <Inputtext
              label="Gas Limit"
              placeholder="Please enter Gas Limit"
              placeholderTextColor={Colors.fadeDot}
              value={this.state.advancedGasLimit}
              labelStyle={styles.labelTextStyle}
              keyboardType={'numeric'}
              inputStyle={styles.inputstyle}
              onChangeNumber={text =>
                this.setState({ advancedGasLimit: parseFloat(text) })
              }
            />

            <Inputtext
              label="Max Priority Fee (Gwei)"
              placeholder="Please enter Max Priority Fee"
              labelStyle={styles.labelTextStyle}
              placeholderTextColor={Colors.fadeDot}
              value={this.state.advancePriorityFee}
              keyboardType={'numeric'}
              inputStyle={styles.inputstyle}
              onChangeNumber={text => {
                //console.warn('MM',' this.state.baseFee', this.state.baseFee);
                this.setState({
                  advancePriorityFee: parseFloat(text),
                  MaxFee:
                    text == ''
                      ? ''
                      : (
                        parseFloat(2 * this.state.baseFee) + parseFloat(text)
                      ).toString(),
                });
              }}
            />
            <Inputtext
              label="Max Fee (Gwei)"
              placeholder="Max Fee"
              placeholderTextColor={Colors.fadeDot}
              labelStyle={styles.labelTextStyle}
              value={this.state.MaxFee}
              inputStyle={styles.inputstyle}
              keyboardType={'numeric'}
              editable={false}></Inputtext>
            <View style={styles.buttonStylesSubmit}>
              <ButtonPrimary
                text="Submit"
                onpress={() => this.onSubmitGas()}
                btnstyle={{ width: '80%', padding: 10 }}
              />
            </View>
          </View>
          {this.state.isLoading && <Loader />}
        </Modal>

        {/* **********************************MODAL FOR TRON  *********************************************** */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.gotSigningRequest}
          onRequestClose={() => { }}>
          <View style={styles.tronModal}>
            <TouchableOpacity
              onPress={() => this.setState({ gotSigningRequest: false })}
              style={{ flex: 0.1, alignItems: 'flex-end' }}>
              <FastImage
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode={FastImage.resizeMode.contain}
                source={Images.cancel}
              />
            </TouchableOpacity>
            <View style={styles.tronModal1}>
              <View style={styles.tronViewStyle}>
                <ButtonPrimary
                  title="Confirm Swap"
                  style={{ marginBottom: 20 }}
                  onPress={() => this.sendTron()}
                />
                <ButtonPrimary
                  title="Cancel"
                  onPress={() =>
                    this.setState({ rejected: true, gotSigningRequest: false })
                  }
                />
              </View>
            </View>
          </View>
          {/* {this.state.isLoading && <Loader color="white" />} */}
        </Modal>
      </>
    );
  }

  async getBaseFee() {
    const fee = await getEthBaseFeeDapp();
    const priorityFees = await getPriorityDapp();
    this.setState({ baseFee: fee, priorityFees: priorityFees }, () => {

      //  console.warn('MM',' Base Fee chk fee:::::eth:::::::', this.state.baseFee)
    }
    );
    // ////console.log(
    // ' Priority Fee chk fee:::::eth:::::::',
    //   this.hex2dec(priorityFees) / 100000000,
    //   );
  }
}

const mapStateToProp = state => {
  const { currentEthpriceInSelectedCurrency, myWallets } = state.walletReducer;
  const { stakeUrl, publicBscUrl, publicEthUrl, publicStcUrl } = state.walletReducer.dex_data;
  return { currentEthpriceInSelectedCurrency, myWallets, stakeUrl, publicBscUrl, publicEthUrl, publicStcUrl };
};
export default connect(mapStateToProp, {
  getBnbNonce,
  getBnbGasEstimate,
  sendBNB,
  getSTCGasPrice,
  getStcGasEstimate
})(DappBrowserSwap);
