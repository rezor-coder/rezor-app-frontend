/* eslint-disable react-native/no-inline-styles */
import { Wallet } from 'ethers';
import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import WebView from 'react-native-webview';
import createInvoke from 'react-native-webview-invoke/native';
import { connect } from 'react-redux';
import web3 from 'web3';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { DAPP_IMG_URL, IS_PRODUCTION } from '../../../Endpoints';
import { getBnbGasEstimate, getBnbNonce, saveFromDapp, sendBNB } from '../../../Redux/Actions';
import { onWalletSwitch } from '../../../Redux/Actions/WallectConnectActions';
import Singleton from '../../../Singleton';
import { heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack } from '../../../navigationsService';
import { Colors, Fonts } from '../../../theme';
import { default as Images, default as images } from '../../../theme/Images';
import {
  getDappSignedTxn,
  getEthBaseFeeDapp,
  getNonceValueDapp,
  getPriorityDapp,
  getTotalGasFeeDapp,
  getsignRawTxnDappBnb,
  getsignRawTxnDappMatic,
} from '../../../utils';
import { ButtonPrimary, Inputtext } from '../../common';
import Loader from '../Loader/Loader';
import styles from './DappBrowserStyle';
var web3BscUrl =
  IS_PRODUCTION == 0
    ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    : 'https://bsc-dataseed1.binance.org:443';
const gasFeeMultiplier = 0.000000000000000001;
const gas = 1000000000;
const fullNode = 'https://api.trongrid.io/';
const solidityNode = 'https://api.trongrid.io/';
const eventServer = 'https://api.trongrid.io/';
var that = undefined;
let jsCode =
  "document.querySelector('#myContent').style.backgroundColor = 'blue';";
class DappBrowser extends Component {
  constructor(props) {
    //console.warn('MM','===>>>>', props.url);
    super(props);
    console.warn('MM','this.props?.route?.params?.item.blockChainType:::::', this.props?.route?.params?.item, this.props?.route?.params?.chain);
    this.state = {
      content: '',
      jsContent: '',
      address: this.props?.route?.params?.item
        ? this.props?.route?.params?.item?.coin_family == 6
          ? Singleton.getInstance().defaultBnbAddress
          : Singleton.getInstance().defaultEthAddress
        : Singleton.getInstance().defaultEthAddress,
      chainId: this.props?.route?.params?.item
        ? this.props?.route?.params?.item?.coin_family == 6
          ? IS_PRODUCTION == 0
            ? '97'
            : '56'
          : this.props?.route?.params?.item?.coin_family == 1
          ? IS_PRODUCTION == 0
            ? '5'
            : '1'
          : IS_PRODUCTION == 0
          ? 80001
          : 137
        : '1',
      rpcUrl: this.props?.route?.params?.item
        ? this.props?.route?.params?.item?.coin_family == 6
          ? IS_PRODUCTION == 0
            ? Constants.testnetBnb
            : Singleton.getInstance().bnbLink
          : this.props?.route?.params?.item?.coin_family == 1
          ? IS_PRODUCTION == 0
            ? Constants.testnetEth
            : Singleton.getInstance().ethLink
          : IS_PRODUCTION == 0
          ? Constants.testnetMatic
          : Singleton.getInstance().maticLink
        : '',
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
      selectedNetwork: this.props?.route?.params?.item
        ? this.props?.route?.params?.item?.coin_family == 6
          ? 'Binance'
          : this.props?.route?.params?.item?.coin_family == 1
          ? 'Ethereum'
          : 'Polygon'
        : 'Ethereum',
      selectedNetworkImageUri: this.props?.route?.params?.item
        ? this.props?.route?.params?.item?.coin_family == 6
          ? `${DAPP_IMG_URL}/images/bnb.png`
          : this.props?.route?.params?.item?.coin_family == 1
          ? `${DAPP_IMG_URL}/images/eth.png`
          : `${DAPP_IMG_URL}/images/matic.png`
        : `${DAPP_IMG_URL}/images/eth.png`,
      url: '',
      enteredURL: this.props?.route?.params?.url
        ? this.props?.route?.params?.url
        : 'https://app.compound.finance',
      startUrl: this.props?.route?.params?.url.includes('https://')
        ? this.props?.route?.params?.url
        : 'https://www.google.com/search?q=' + this.props?.route?.params?.url,
      isNetworkModalVisible: false,
      advanceModalVisible: false,
      favoriteArray: [],
      isFavorite: false,
      urlTitle: '',
      showAlertDialog: false,
      alertTxt: '',
      currentUrl: '',
      currencyName: '',
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
      web3BscUrl:
        Constants.network == 'testnet'
          ? Constants.testnetBnb
          : Singleton.getInstance().bnbLink,
      finished: false,
      txnTobeSigned: undefined,
      gotSigningRequest: false,
      rejected: false,
      tronAddress: 'TWnLSuJyjJFCsffuFWUMXtqTX2YfhtvbUT',
      tronPvtKey: '',
      modalVisibleBnb: false,
    };
  }
  invoke = createInvoke(() => this.webview);
  checkFavorite() {
    Singleton.getInstance()
      .getData(Constants.FAVORITE)
      .then(res => {
        if (res != null) {
          let favArray = JSON.parse(res);
          this.setState({favoriteArray: favArray});
          const selectedData =
            Array.isArray(favArray) &&
            favArray.find(el => {
              let newStr = el.url.slice(8, el.url.indexOf('/', 8));
              if (this.state.enteredURL.includes('google.com')) {
                return this.state.enteredURL == el.url;
              } else {
                return this.state.enteredURL?.includes(newStr);
              }
            });
          if (selectedData != null) {
            this.setState({isFavorite: true});
          } else {
            this.setState({isFavorite: false});
          }
        }
      });
  }
  componentDidMount() {
    this.props.navigation.addListener('blur', this.screenBlur);
    this.props.navigation.addListener('focus', this.screenFocus);
    that = this;
    EventRegister.addEventListener('downModal', data1 => {
      if(this.state.isVisible){
        let js = `trustwallet.ethereum.sendError(${this.state.signingData.id}, 'Cancelled')`;
        //console.log('----------------js-----------', js);
        this.webview.injectJavaScript(js);
        this.setState({isVisible: false});
      }
      this.setState({
        advanceModalVisible: false,
        modalVisibleBnb: false,
        gotSigningRequest: false,
        isVisible: false,
      });
    
    });
    if (
      this.props.activeSessions.filter(
        item => item.coinChain !== '' && item.connector !== null,
      )?.length > 0
    ) {
      Alert.alert(
        Constants.APP_NAME,
        'You already have an existing wallet connection on wallet connect, disconnect the existing connection.',
        [
          {
            text: 'Yes, disconnect',
            onPress: () => {
              try {
                this.props.onWalletSwitch();
              } catch (error) {
                console.log('err switch', error);
              }
            },
          },
          {
            text: 'No, Proceed',
          },
        ],
      );
    }
    this.invoke.define('signTronTx', this.signTronTx);
    if (this.state.selectedNetwork != 'Tron') {
      var provider = new web3.providers.HttpProvider(this.state.rpcUrl);
      this.web3 = new web3(provider);
      Singleton.getInstance()
        .newGetData(Singleton.getInstance().defaultEthAddress)
        .then(mnemonics => {
          ////console.log(
          // 'chk address::::::::::::::',
          //   Singleton.getInstance().defaultEthAddress,
          // );
          //console.warn('MM','chk mnemonics::::::::::::::', mnemonics);
          var address = this.state.address;
          this.setState({mnemonics: mnemonics, address: address});
          //console.warn('MM','-------------------------', this.state.address);
          setTimeout(() => {
            this.webview.reload();
          }, 500);
          if (this.state.jsContent === '') {
            //console.warn('MM','chk platform::::', Platform.OS);
            if (Platform.OS === 'ios') {
              RNFS.readFile(`${RNFS.MainBundlePath}/trust-min.js`, 'utf8').then(
                content => {
                  this.setState({
                    jsContent: this.getJavascript(
                      this.state.chainId,
                      this.state.rpcUrl,
                      address,
                      content,
                    ),
                    content: content,
                  });
                },
              );
              this.setUrl(2);
            } else {
              RNFS.readFileAssets('trust-min.js', 'utf8').then(content => {
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
          this.setState({tronPvtKey: trnPvKey});
        });
    }
    this.checkFavorite();
  }
  screenFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
    //console.warn('MM','i dapp browser');
    goBack();
    return true;
  };
  signTronTx(txn) {
    //console.warn('MM','chk trn txn:::::::', txn);
    return new Promise((resolve, reject) => {
      try {
        that.setState(
          {txnTobeSigned: txn, gotSigningRequest: true, rejected: false},
          () => {
            var timer = setInterval(() => {
              if (!that.state.gotSigningRequest) {
                clearInterval(timer);
                resolve(that.state.txnTobeSigned);
              }
              if (that.state.rejected) {
                clearInterval(timer);
                that.setState({
                  txnTobeSigned: undefined,
                  gotSigningRequest: false,
                  rejected: false,
                });
                reject('user rejected');
              }
            }, 1000);
          },
        );
      } catch (err) {
        Singleton.showAlert(err);
        reject(err);
      }
    });
  }
  onLoadStart = event => {
    console.log('onLoadStart');
    this.setState({isLoading: Platform.OS != 'ios' ? true : false});
    this.checkFavorite()
  };
  checkForSigned() {
    return new Promise((resolve, reject) => {});
  }
  onShouldStartLoadWithRequest = (data) => {
    // console.log("res=>>>>>>", data.url, data.url?.startsWith("wc:"));

    // if (data.url?.startsWith("wc:")) {
    //   Singleton.getInstance().isCamera=true
    //   global.stop_pin=true
    //   global.isCamera=true
    //   this.props.saveFromDapp(true)
    //   getCurrentRouteName() !== 'ConnectWithDapp' &&
    //   Actions.ConnectWithDapp({ url: data.url });
    // }

    return true;
  };
  onMessage = async ({nativeEvent}) => {
    let message = JSON.parse(nativeEvent.data);
    console.warn('MM', '---------message------onMessage', JSON.stringify(message));
    //console.warn('MM','---------selectedNetwork------', this.state.selectedNetwork);
    if (message.name == 'signTransaction') {
      if (!message.object.value) {
        message.object.value = '0x0';
      }
      if (!message.object.gas) {
        message.object.gas = '0x238ec';
      }
      this.setState({signingData: message});
      this.getNonceAndGas(
        this.hex2dec(message.object.value),
        this.state.selectedNetwork == 'Ethereum'
          ? 'eth'
          : this.state.selectedNetwork == 'Binance'
          ? 'bnb'
          : 'matic',
        this.state.selectedNetwork == 'Ethereum' ? 'transaction' : 'binance',
      );
    } else if (message.name == 'requestAccounts') {
      let js = `trustwallet.${message?.network}.setAddress('${this.state.address}');`;
      this.webview.injectJavaScript(js);
      let mmid = message.id;
      let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, ['${this.state.address}'])`;
      this.webview.injectJavaScript(js1);

      // let js = `window.ethereum.setAddress('${this.state.address}');`;
      // this.webview.injectJavaScript(js);
      // let mmid = message.id;
      // let js1 = `window.ethereum.sendResponse(${mmid}, ['${this.state.address}'])`;
      // this.webview.injectJavaScript(js1);
    } else if (
      message.name == 'signPersonalMessage' ||
      message.name == 'signMessage'
    ) {
      // let mmid = message.id;
      // const wallet = Wallet.fromMnemonic(this.state.mnemonics);
      // var pKey = wallet.privateKey;
      // let signedMessage = await Singleton.getInstance().signPersonalMessage(
      //   message.object.data,
      //   pKey,
      // );
      // let js = `window.ethereum.sendResponse(${mmid}, "${signedMessage}")`;
      // this.webview.injectJavaScript(js);

      let mmid = message.id;
      let pKey = await Singleton.getInstance().newGetData(
        this.state.address + '_pk',
      );
      let signedMessage = await Singleton.getInstance().signPersonalMessage(
        message?.object?.data,
        pKey,
      );
      let js = `trustwallet.${message?.network}.sendResponse(${mmid}, "${signedMessage}")`;
      this.webview.injectJavaScript(js);
    } else if (message.name == 'signTypedMessage') {
      let approvalParam = JSON.parse(message?.object?.raw);
      let permitDetails = approvalParam.types.PermitDetails;
      let permitSingle = approvalParam.types.PermitSingle;

      let newParams = {
        domain: approvalParam.domain,
        types: {
          PermitSingle: permitSingle,
          PermitDetails: permitDetails,
        },
        message: approvalParam.message,
      };
      //console.log('---------newParams:::::', newParams);
      setTimeout(async () => {
        Singleton.getInstance()
          .newGetData(this.state.address + '_pk')
          .then(async privateKey => {
            let pvt_key = privateKey;
            Singleton.getInstance()
              .dappApprovalHash(pvt_key, newParams)
              .then(res => {
                //console.log('res::::::::', res);
                let mmid = message.id;
                let js = `trustwallet.ethereum.sendResponse(${mmid}, "${res}")`;
                this.webview.injectJavaScript(js);
                this.setState({isLoading: false});
              })
              .catch(err => {
                //console.log('err::::::::', err);
              });
          });
      }, 200);
    } else if (message.name == 'switchEthereumChain') {
      let chainId = this.hex2dec(message?.object?.chainId);
      console.log('chainId:', chainId);
      let mmid = message.id;
      // if(IS_PRODUCTION == 1){
      // console.log(this.webview.);
      if ((chainId == 137 || chainId == 80001) && (this.props?.route?.params?.chain == 'matic' || this.props?.route?.params?.chain == '') ) {
        // console.log('in 137 ...');
        // let js = `var config = {
        // 	ethereum: {
        // 	  address: '${this.state.address}',
        // 	  chainId: ${chainId},
        // 	  rpcUrl: '${Constants.mainnetInfuraLinkMatic}'
        //  }
        //  };
        //  trustwallet.ethereum = new trustwallet.Provider(config);
        //  trustwallet.postMessage = (jsonString) => {
        // 	window.ReactNativeWebView?.postMessage(JSON.stringify(jsonString))
        //  };
        //  window.ethereum = trustwallet.ethereum;`
        //  this.webview.injectJavaScript(js);
        this.changeNetwork('Polygon');
        let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, null)`;
        this.webview.injectJavaScript(js1);
      } else if ((chainId == 56 || chainId == 97) && (this.props?.route?.params?.chain == 'bnb' || this.props?.route?.params?.chain == '')) {
        this.changeNetwork('Binance');
        let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, null)`;
        this.webview.injectJavaScript(js1);
      } else if ((chainId == 1 || chainId == 5) && (this.props?.route?.params?.chain == 'eth' || this.props?.route?.params?.chain == '')) {
        this.changeNetwork('Ethereum');
        let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, null)`;
        this.webview.injectJavaScript(js1);
      } else {
        console.log('in error ...');
        let mmid = message.id;
        let js = `trustwallet.${message?.network}.sendError(${mmid}, "Network not supported")`;
        this.webview.injectJavaScript(js);
      }
    }
    // else
    // {
    // 	if(chainId == 80001){
    // 		this.changeNetwork('Polygon')
    // 	}else if(chainId == 97){
    // 		this.changeNetwork('Binance')
    // 	}else if(chainId == 5){
    // 		this.changeNetwork('Ethereum')
    // 	}else{
    // 		let mmid = message.id;
    // 		let js = `trustwallet.ethereum.sendResponse(${mmid}, "Network not supported")`;
    // 		this.webview.injectJavaScript(js);
    // 	}
    // }

    //  }
  };
  getJavascript = function (chainId, rpcUrl, address, jsContent) {
    // console.log('chainId:', chainId, 'rpcUrl:', rpcUrl, 'address:', address);
    let source = '';
    source = `
	  ${jsContent}
	  (function() {
		 var config = {
			ethereum: {
			  address: '${address}',
			  chainId: ${chainId},
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
  async getNonceAndGas(amount, coinsym, coinType) {
    if (coinsym.toLowerCase() == 'eth') {
      var gasFees = await getTotalGasFeeDapp();
      var currentNonce = await getNonceValueDapp(this.state.address);
      this.nonce = currentNonce;
      var initialValue =
        gasFees * this.hex2dec(this.state.signingData.object.gas);
      var fee = initialValue * gasFeeMultiplier;
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
        .getBnbNonce({wallet_address, access_token, blockChain, coin_symbol})
        .then(nonce => {
          //  MMconsole.log('Chk bnb nonce::::::::', nonce);
          this.nonce = nonce;
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
                standard * this.hex2dec(this.state.signingData.object.gas);
              var fee = initialValue * gasFeeMultiplier;
              this.setState({
                isVisible: true,
                calculatedFee: fee.toFixed(5),
                gasPrice: standard,
              });
            })
            .catch(err => {
              //console.warn('MM','Error: ', err);
              this.setState({isLoading: false});
            });
        });
    }
    if (coinsym.toLowerCase() == 'matic') {
      let data = {
        from: Singleton.getInstance().defaultBnbAddress,
        to: Singleton.getInstance().defaultBnbAddress,
        amount: 0,
      };
      let wallet_address = Singleton.getInstance().defaultBnbAddress;
      let access_token = Singleton.getInstance().access_token;
      let blockChain = 'polygon';
      let coin_symbol = 'matic';
      let contractAddress = 'matic';
      this.props
        .getBnbNonce({wallet_address, access_token, blockChain, coin_symbol})
        .then(nonce => {
          //  console.log('Chk bnb nonce::::::::', nonce );
          this.nonce = nonce;
          this.props
            .getBnbGasEstimate({
              blockChain,
              data,
              contractAddress,
              access_token,
            })
            .then(response => {
              //   console.log('response GAS--matic ', response);
              var standard = response.resultList[0].safe_gas_price * 1000000000;
              var initialValue =
                standard * this.hex2dec(this.state.signingData.object.gas);
              var fee = initialValue * gasFeeMultiplier;
              this.setState({
                isVisible: true,
                calculatedFee: fee.toFixed(5),
                gasPrice: standard,
              });
            })
            .catch(err => {
              //   console.log('Error: ', err);
              this.setState({isLoading: false});
            });
        });
    }
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
    ////console.log(
    // 'gas gwei price----',
    //   2 * this.state.baseFee + parseInt(this.state.advancePriorityFee),
    //   );
    //console.warn('MM','gas limit----', this.state.advancedGasLimit);
    let gasGwei =
      parseFloat(2 * this.state.baseFee) +
      parseFloat(this.state.advancePriorityFee);
    ////console.log(
    // 'T_GAS_FEES----',
    //   (
    //     gasGwei *
    //     this.state.advancedGasLimit *
    //     this.state.gasFeeMultiplier
    //   ).toFixed(8),
    //   );
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
    ////console.log(
    // 'here-------',
    //   this.state.gasPrice,
    //   ';;;;',
    //   this.state.priorityFees,
    //   this.props?.route?.params?.item,
    //   );
    if (this.state.selectedNetwork == 'Ethereum') {
      const wallet = await Wallet.fromMnemonic(this.state.mnemonics);
      var pKey = wallet.privateKey;
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
    } else if (this.state.selectedNetwork == 'Binance') {
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
    } else if (this.state.selectedNetwork == 'Polygon') {
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
          getsignRawTxnDappMatic(
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
            //console.log('this.serializedTx-------', serializedTx);
            this.sendCoin(serializedTx);
          });
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
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain =
      this.state.selectedNetwork == 'Ethereum'
        ? 'ethereum'
        : this.state.selectedNetwork == 'Binance'
        ? 'binancesmartchain'
        : 'polygon';

    let coin_symbol =
      this.state.selectedNetwork == 'Ethereum'
        ? 'eth'
        : this.state.selectedNetwork == 'Binance'
        ? 'bnb'
        : 'matic';
    this.props
      .sendBNB({data, access_token, blockChain, coin_symbol})
      .then(res => {

        this.setState({isVisible: false, isLoading: false});
        let mmid = this.state.signingData.id;
        let hash = res.tx_hash;
        //   let js = `window.ethereum.sendResponse(${mmid}, '${hash}')`;
        let js = `trustwallet.ethereum.sendResponse(${mmid}, '${hash}')`;
        Singleton.showAlert(res.message);
        this.webview.injectJavaScript(js);
      })
      .catch(err => {
        let js = `trustwallet.ethereum.sendError(${this.state.signingData.id}, '${err.message}')`;
        this.webview.injectJavaScript(js);
        this.setState({isVisible: false, isLoading: false});
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
    console.log('---- type', type);
    if (this.validURL(this.state.enteredURL)) {
      if (!this.state.enteredURL.startsWith('http')) {
        //console.warn('MM','true ==>>> ', 'https://' + this.state.enteredURL);
        this.setState({
          url: 'https://' + this.state.enteredURL,
          startUrl: 'https://' + this.state.enteredURL,
        });
      } else {
        console.warn('MM', '2true ==>>> ', type, this.state.enteredURL);
        // 1 is reload
        if (type == 1) {
          console.warn(
            'MM',
            'check type 1 part=====>',
            this.state.enteredURL,
            this.state.url,
          );
          if (this.state.url != this.state.enteredURL) {
            this.setState({url: ''}, () => {
              this.setState({
                url: this.state.enteredURL,
                startUrl: this.state.enteredURL,
              });
            });
          }
        } else {
          //console.warn('MM','3true ==>>> ', 'https://' + this.state.enteredURL);
          this.setState({
            url: this.state.enteredURL,
            startUrl: this.state.enteredURL,
          });
        }
      }
    } else {
      //console.warn('MM','check else part=====>', this.state.enteredURL);
      //console.warn('MM','4true ==>>> ', 'https://' + this.state.enteredURL);
      let a = this.state.enteredURL.includes('about:blank')
        ? this.props.urlf
        : this.state.enteredURL;
      if (!this.state.enteredURL.includes('https://')) {
        this.setState({
          startUrl: 'https://www.google.com/search?q=' + this.state.enteredURL,
        });
      }
      this.setState({url: 'https://www.google.com/search?q=' + a});
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

  changeNetwork = network => {
    console.log(network);
    if (network == 'Polygon') {
      let provider = new web3.providers.HttpProvider(
        IS_PRODUCTION == 0
          ? Constants.testnetMatic
          : Singleton.getInstance().maticLink,
      );
      this.web3 = new web3(provider);
      this.setState({
        isNetworkModalVisible: false,
        selectedNetwork: 'Polygon',
        selectedNetworkImageUri: DAPP_IMG_URL + '/images/matic.png',
        chainId: IS_PRODUCTION == 0 ? 80001 : 137,
        rpcUrl:
          IS_PRODUCTION == 0
            ? Constants.testnetMatic
            : Singleton.getInstance().maticLink,
        jsContent: this.getJavascript(
          IS_PRODUCTION == 0 ? 80001 : 137,
          IS_PRODUCTION == 0
            ? Constants.testnetMatic
            : Singleton.getInstance().maticLink,
          this.state.address,
          this.state.content,
        ),
      });

      let script = `
    var config = {
        ethereum: {
            address: "${this.state.address}",
            chainId: ${IS_PRODUCTION == 0 ?this.web3.utils.toHex(80001) : web3.utils.toHex(137)},
            rpcUrl: "${
              IS_PRODUCTION == 0
                ? Constants.testnetMatic
                :Singleton.getInstance().maticLink
            }"
        }
    };
    ethereum.setConfig(config);
    `;
      console.log('script++++', script);
      this.webview.injectJavaScript(script);
      let chainId = this.web3.utils.toHex(IS_PRODUCTION == 0 ? '80001' : '137');
      let js = `trustwallet.ethereum.emitChainChanged('${chainId}');`;
      this.webview.injectJavaScript(js);

      // setTimeout(() => {
      //   this.webview.reload();
      // }, 2000);
    } else if (network == 'Ethereum') {
      let provider = new web3.providers.HttpProvider(
        IS_PRODUCTION == 0 ? Constants.testnetEth : Singleton.getInstance().ethLink,
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
            : Singleton.getInstance().ethLink,
        jsContent: this.getJavascript(
          IS_PRODUCTION == 0 ? '5' : '1',
          IS_PRODUCTION == 0
            ? Constants.testnetEth
            : Singleton.getInstance().ethLink,
          this.state.address,
          this.state.content,
        ),
      });

      let script = `
     var config = {
         ethereum: {
             address: "${this.state.address}",
             chainId: ${this.web3.utils.toHex(IS_PRODUCTION == 0 ? 5 : 1)},
             rpcUrl: "${
               IS_PRODUCTION == 0
                 ? Constants.testnetEth
                 : Singleton.getInstance().ethLink
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

      // setTimeout(() => {
      //   this.webview.reload();
      // }, 2000);
    }
  };
  getIconUrl(url) {
    const imageBaseURl =
      'https://besticon-demo.herokuapp.com/allicons.json?url=';
    let newStr = url.slice(0, url.indexOf('/', 8));
    return new Promise((resolve, reject) => {
      fetch(`${imageBaseURl}${newStr}`, {
        method: 'GET',
      })
        .then(async res => {
          let jsonVal = await res.json();
          if (jsonVal?.icons?.length > 0) {
            resolve({
              icon: jsonVal.icons[0].url,
            });
          } else {
            resolve({
              icon: '',
            });
          }
        })
        .catch(err => {
          resolve({
            icon: '',
          });
        });
    });
  }
  onLoadEnd = event => {
    console.log('onLoadEnd');
    this.setState({isLoading: false});
  };
  render() {
    console.log(this.state.jsContent != '' ? 'yes' : 'no');
    return (
      <>
        <SafeAreaView style={{flex: 1, backgroundColor: ThemeManager.colors.bg}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              backgroundColor: ThemeManager.colors.bg
            }}>
            <View style={styles.headerView}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={{width: '8%', marginLeft: 10}}
                  onPress={() => {
                    goBack();
                  }}>
                  <FastImage
                    style={{height: 15, width: 15}}
                    resizeMode={'contain'}
                    source={images.cancel}
                    tintColor={ThemeManager.colors.iconColor}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: Colors.tabBgColor,
                    borderRadius: 25,
                    width: '75%',
                  }}>
                  <Inputtext
                    inputStyle={{
                      color: Colors.white,
                      // borderColor: Colors.balanceBoxColor3,
                      // marginHorizontal: -15,
                    }}
                    placeholder="https://"
                    value={this.state.enteredURL}
                    onChangeNumber={text => {
                      //console.warn('MM','==== this ');
                      this.setState({enteredURL: text});
                    }}
                    onBlur={() => {}}
                    autoCorrect={false}
                    autoCapitalize={false}
                    textAlign={'left'}
                    style={{width: '83%', marginBottom: 0}}
                    onSubmitEditing={text => {
                      this.setUrl(2);
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '15%',
                      right: 1,
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={styles.searchBtn}
                      onPress={() => {
                        this.setUrl(1);
                        Keyboard.dismiss();
                      }}>
                      <FastImage
                        source={images.Search}
                        style={{height: 15, width: 15}}
                        
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={async () => {
                    let favouriteData = await Singleton.getInstance().getData(
                      Constants.FAVORITE,
                    );
                    console.log('favouriteData', favouriteData);
                    if (favouriteData !== null) {
                      favouriteData = JSON.parse(favouriteData);
                      let isPresent = favouriteData?.find(url => {
                        let newUrl = url.url.slice(0, url.url.indexOf('/', 8));
                        if (this.state.enteredURL.includes('google.com')) {
                          if (this.state.enteredURL == url.url) {
                            return url;
                          }
                        } else {
                          if (this.state.enteredURL?.includes(newUrl)) {
                            return url;
                          }
                        }
                      });
                      if (isPresent) {
                        let newfilteredData = favouriteData.filter(url => {
                          let newUrl = url.url.slice(
                            0,
                            url.url.indexOf('/', 8),
                          );
                          if (this.state.enteredURL.includes('google.com')) {
                            if (!(this.state.enteredURL == url.url)) {
                              return url;
                            }
                          } else {
                            if (!this.state.enteredURL?.includes(newUrl)) {
                              return url;
                            }
                          }
                        });
                        Singleton.getInstance().saveData(
                          Constants.FAVORITE,
                          JSON.stringify(newfilteredData),
                        );
                        this.setState({
                          isFavorite: false,
                        });

                        return;
                      } else {
                        let iconUrl = await this.getIconUrl(
                          this.state.enteredURL,
                        );
                        console.log('iconUrl', iconUrl);
                        favouriteData.push({
                          url: this.state.enteredURL,
                          title: this.state.urlTitle,
                          iconUrl: iconUrl,
                        });
                        Singleton.getInstance().saveData(
                          Constants.FAVORITE,
                          JSON.stringify(favouriteData),
                        );
                        this.setState({isFavorite: true});
                      }
                    } else {
                      let favData = [];

                      let iconUrl = await this.getIconUrl(
                        this.state.enteredURL,
                      );
                      console.log('iconUrl', iconUrl);
                      favData.push({
                        url: this.state.enteredURL,
                        title: this.state.urlTitle,
                        iconUrl: iconUrl,
                      });
                      Singleton.getInstance().saveData(
                        Constants.FAVORITE,
                        JSON.stringify(favData),
                      );
                      this.setState({isFavorite: true});
                    }
                  }}>
                  <FastImage
                    source={
                      this.state.isFavorite
                        ? Images.bookmarkActive
                        : Images.bookmark
                    }
                    resizeMode="contain"
                    style={{
                      height: heightDimen(25),
                      width: widthDimen(25),
                      resizeMode: 'contain',
                      marginLeft: widthDimen(15),
                    }}
                    tintColor={ThemeManager.colors.iconColor}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{
                  // marginTop: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}
                onPress={() => {
                  this.setState({
                    isNetworkModalVisible:
                      this.state.selectedNetwork != 'Tron' && true,
                  });
                }}>
                <FastImage
                  style={{marginRight: 4, width: 20, height: 20}}
                  source={{
                    uri: this.state.selectedNetworkImageUri,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text
                  style={{
                    marginRight: 8,
                    fontFamily: Fonts.bold,
                    color: '#d01961',
                  }}>
                  {this.state.selectedNetwork}
                </Text>
                {this.state.selectedNetwork != 'Tron' && (
                  <FastImage
                    style={{
                      height: 10,
                      width: 10,
                    }}
                    resizeMode={'contain'}
                    source={Images.downIcon}
                    tintColor={ThemeManager.colors.iconColor}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: ThemeManager.colors.backgroundColor,
            }}>
            {this.state.jsContent != '' ? (
              <WebView
                ref={ref => (this.webview = ref)}
                source={{uri: this.state.startUrl}}
                injectedJavaScriptBeforeContentLoaded={this.state.jsContent}
                style={{flex: 1}}
                onMessage={
                  this.state.selectedNetwork != 'Tron'
                    ? this.onMessage
                    : this.invoke.listener
                }
                setSupportMultipleWindows={false}

                onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                onNavigationStateChange={navState => {
                  //console.warn('MM',' navState ==>>>', navState);
                  //console.warn('MM',' navState uri==>>>', this.state.url);
                  this.setState({
                    canGoBack: navState.canGoBack,
                    canGoForward: navState.canGoForward,
                    enteredURL: navState.url,
                    urlTitle: navState.title,
                  });
                  ////console.log(
                  //   'check entered url---------->',
                  //   this.state.enteredURL,
                  // );
                  ////console.log(
                  //   'check this.state.startUrl ---------->',
                  //   this.state.startUrl,
                  // );
                  if (this.state.startUrl != this.state.enteredURL) {
                  } else {
                    this.setState({canGoBack: false});
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
                  console.log('errrrrrr');
                  getCurrentRouteName() == 'DappBrowser' &&
                    Singleton.showAlert('Unable to load');
                  console.warn('MM', 'chk err in webview');
                  // this.webview.reload();
                }}
              />
            ) : null}
            {this.state.isNetworkModalVisible && (
              <View style={styles.dropdown}>
                  {
               (this.props?.route?.params?.chain=='eth' || this.props?.route?.params?.chain=='') &&   <TouchableOpacity
                  style={{padding: 10}}
                  onPress={() => {
                    this.changeNetwork('Ethereum');
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <FastImage
                      style={{marginRight: 10, width: 20, height: 20}}
                      source={{
                        uri: DAPP_IMG_URL + '/images/eth.png',
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: 15,
                        color: '#d01961',
                      }}>
                      Ethereum
                    </Text>
                  </View>
                </TouchableOpacity>}
              {
               (this.props?.route?.params?.chain=='bnb' || this.props?.route?.params?.chain=='') && <TouchableOpacity
                  style={{padding: 10}}
                  onPress={() => {
                    this.changeNetwork('Binance');
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <FastImage
                      style={{marginRight: 10, width: 20, height: 20}}
                      source={{
                        uri: DAPP_IMG_URL + '/images/bnb.png',
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: 15,
                        color: '#d01961',
                      }}>
                      Binance
                    </Text>
                  </View>
                </TouchableOpacity>
              }
                {
               (this.props?.route?.params?.chain=='matic' || this.props?.route?.params?.chain=='') &&  <TouchableOpacity
                  style={{padding: 10}}
                  onPress={() => {
                    this.changeNetwork('Polygon');
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <FastImage
                      style={{marginRight: 10, width: 20, height: 20}}
                      source={{
                        uri: DAPP_IMG_URL + '/images/matic.png',
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: 15,
                        color: '#d01961',
                      }}>
                      Polygon
                    </Text>
                  </View>
                </TouchableOpacity>}
              </View>
            )}
          </View>
          <View
            style={{
              width: '100%',
              height: 44,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor:ThemeManager.colors.bg
            }}>
            <View
              style={{
                width: 100,
                height: 44,
                flexDirection: 'row',
                justifyContent: 'space-between',
                elevation: 2,
              }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  ////console.log(
                  //   'print enter url===----->',
                  //   this.state.enteredURL,
                  // );
                  if (this.state.enteredURL === 'about:blank') {
                    this.setState({canGoBack: false});
                  } else {
                    this.webview.goBack();
                  }
                }}
                disabled={!this.state.canGoBack}>
                <FastImage
                  style={[
                    {width: 25, height: 25, transform: [{rotateY: '180deg'}]},
                    this.state.canGoBack ? {opacity: 1} : {opacity: 0.2},
                  ]}
                  tintColor={ThemeManager.colors.iconColor}
                  resizeMode={'contain'}
                  source={images.rightArrow}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.webview.goForward()}
                disabled={!this.state.canGoForward}>
                <FastImage
                  style={[
                    {width: 25, height: 25, tintColor: 'blue'},
                    this.state.canGoForward ? {opacity: 1} : {opacity: 0.2},
                  ]}
                  tintColor={ThemeManager.colors.iconColor}
                  resizeMode={'contain'}
                  source={Images.rightArrow}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: 50,
                height: 44,
                flexDirection: 'row',
                justifyContent: 'space-between',
                
              }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  // this.webview.reload()
                  this.setState({
                    jsContent: '',
                  });

                  if (Platform.OS === 'ios') {
                    RNFS.readFile(
                      `${RNFS.MainBundlePath}/trust-min.js`,
                      'utf8',
                    ).then(content => {
                      let js = this.getJavascript(
                        this.state.chainId,
                        this.state.rpcUrl,
                        this.state.address,
                        content,
                      );
                      this.setState(
                        {
                          jsContent: js,
                          content: content,
                        },
                        () => {
                          this.setUrl(2);
                        },
                      );
                    });
                  } else {
                    RNFS.readFileAssets('trust-min.js', 'utf8').then(
                      content => {
                        console.log('android');
                        let js = this.getJavascript(
                          this.state.chainId,
                          this.state.rpcUrl,
                          this.state.address,
                          content,
                        );
                        this.setState(
                          {
                            jsContent: js,
                            content: content,
                          },
                          () => {
                            this.setUrl(2);
                          },
                        );
                      },
                    );
                  }

                  setTimeout(() => {
                    this.webview?.reload();
                  }, 2000);
                }}>
                <FastImage
                  style={{width: 25, height: 25, tintColor: 'blue'}}
                  resizeMode={'contain'}
                  tintColor={ThemeManager.colors.iconColor}
                  source={Images.financeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* {this.state.isLoading && <Loader color="white" />} */}
        </SafeAreaView>
        <SafeAreaView style={{backgroundColor: ThemeManager.colors.bg}} />
        <Modal
          visible={this.state.isVisible}
          animationType="fade"
          transparent
          style={{margin: 0, justifyContent: 'flex-end'}}>
          {this.state.signingData != '' && (
            <>
              <View style={styles.modalView}>
                <View style={[styles.modalinner,{backgroundColor:ThemeManager.colors.bg,borderColor:ThemeManager.colors.bg}]}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 30,
                    }}>
                    <Text style={[styles.titleSign,{color:ThemeManager.colors.textColor}]}>Confirm Transaction</Text>
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
                        // let js = `window.ethereum.sendError(${this.state.signingData.id}, 'Cancelled')`;
                        let js = `trustwallet.ethereum.sendError(${this.state.signingData.id}, 'Cancelled')`;
                        //console.log('----------------js-----------', js);
                        this.webview.injectJavaScript(js);
                        this.setState({isVisible: false});
                      }}>
                      <FastImage
                        style={{width: 15, height: 15, marginRight: 10}}
                        resizeMode={FastImage.resizeMode.contain}
                        source={Images.cancel}
                        tintColor={ThemeManager.colors.iconColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.vwSignTransaction}>
                    <Text style={[styles.textLbl,{color:ThemeManager.colors.textColor}]}>To</Text>
                    <Text style={[styles.txtValue,{color:ThemeManager.colors.textColor}]}>
                      {this.state.signingData.object.to}
                    </Text>
                  </View>
                  <View style={styles.vwSignTransaction}>
                  <Text style={[styles.textLbl,{color:ThemeManager.colors.textColor}]}>From</Text>
                  <Text style={[styles.txtValue,{color:ThemeManager.colors.textColor}]}>
                      {this.state.signingData.object.from}
                    </Text>
                  </View>
                  {/* {this.state.advanceMode == false && this.renderSlowStandardFast()} */}
                  <View style={styles.vwSignTransaction}>
                  <Text style={[styles.textLbl,{color:ThemeManager.colors.textColor}]}>Gas Fee</Text>
                  <Text style={[styles.txtValue,{color:ThemeManager.colors.textColor}]}>
                      {this.state.advanceMode
                        ? this.state.advanceGasFees
                        : this.state.calculatedFee}{' '}
                      {this.state.selectedNetwork == 'Ethereum'
                        ? 'ETH'
                        : this.state.selectedNetwork == 'Binance'
                        ? 'BNB'
                        : 'MATIC'}
                    </Text>
                  </View>
                  <View style={styles.vwSignTransaction}>
                  <Text style={[styles.textLbl,{color:ThemeManager.colors.textColor}]}>Total</Text>
                    <Text style={[styles.txtValue,{color:ThemeManager.colors.textColor}]}>
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
                      {this.state.selectedNetwork == 'Ethereum'
                        ? 'ETH'
                        : this.state.selectedNetwork == 'Binance'
                        ? 'BNB'
                        : 'MATIC'}
                    </Text>
                  </View>

                  <ButtonPrimary
                    text="Submit"
                    onpress={() => {
                      this.setState({isLoading: true});
                      setTimeout(() => {
                        this.makeRaxTxn();
                      }, 1000);
                    }}
                    btnstyle={{width: '80%', padding: 10}}
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
          onRequestClose={() => {}}>
          <View style={styles.viewGas}>
            <TouchableOpacity
              onPress={() =>
                this.setState({modalVisibleBnb: false, isVisible: true})
              }
              style={{flex: 0.1, marginBottom: 40}}>
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
                  this.setState({advanceGasPrice: parseFloat(text)})
                }
              />

              <Inputtext
                label="Gas Limit"
                placeholder="Please enter Gas Limit"
                value={this.state.advancedGasLimit}
                labelStyle={styles.labelTextStyle}
                keyboardType={'number-pad'}
                onChangeNumber={text =>
                  this.setState({advancedGasLimit: parseFloat(text)})
                }
              />
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
          onRequestClose={() => {}}>
          <View style={styles.viewGas}>
            <TouchableOpacity
              onPress={() =>
                this.setState({advanceModalVisible: false, isVisible: true})
              }
              style={{flex: 0.1, marginBottom: 40}}>
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
                this.setState({advancedGasLimit: parseFloat(text)})
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
              editable={false}
            />
            <View style={styles.buttonStylesSubmit}>
              <ButtonPrimary
                text="Submit"
                onpress={() => this.onSubmitGas()}
                btnstyle={{width: '80%', padding: 10}}
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
          onRequestClose={() => {}}>
          <View style={styles.tronModal}>
            <TouchableOpacity
              onPress={() => this.setState({gotSigningRequest: false})}
              style={{flex: 0.1, alignItems: 'flex-end'}}>
              <FastImage
                style={{width: 30, height: 30, marginRight: 10}}
                resizeMode={FastImage.resizeMode.contain}
                source={Images.cancel}
              />
            </TouchableOpacity>
            <View style={styles.tronModal1}>
              <View style={styles.tronViewStyle}>
                <ButtonPrimary
                  title="Confirm Swap"
                  style={{marginBottom: 20}}
                  onPress={() => this.sendTron()}
                />
                <ButtonPrimary
                  title="Cancel"
                  onPress={() =>
                    this.setState({rejected: true, gotSigningRequest: false})
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
    this.setState({baseFee: fee, priorityFees: priorityFees}, () => {
      //  console.warn('MM',' Base Fee chk fee:::::eth:::::::', this.state.baseFee)
    });
    ////console.log(
    // ' Priority Fee chk fee:::::eth:::::::',
    //   this.hex2dec(priorityFees) / 100000000,
    //   );
  }
}

const mapStateToProp = state => {
  const {currentEthpriceInSelectedCurrency} = state.walletReducer;
  let activeSessions = state.walletConnectReducer.activeSessions;
  return {currentEthpriceInSelectedCurrency, activeSessions};
};
export default connect(mapStateToProp, {
  getBnbNonce,
  getBnbGasEstimate,
  sendBNB,
  onWalletSwitch,
  saveFromDapp
})(DappBrowser);
