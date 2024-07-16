/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { Component } from 'react';
import {
  BackHandler,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import WebView from 'react-native-webview';
import createInvoke from 'react-native-webview-invoke/native';
import { connect } from 'react-redux';
import { default as Web3, default as web3 } from 'web3';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { IS_PRODUCTION } from '../../../Endpoints';
import { getBnbGasEstimate, getBnbNonce, getSTCGasPrice, getStcGasEstimate, sendBNB } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { widthDimen } from '../../../Utils/themeUtils';
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
import { ButtonPrimary, Inputtext, SimpleHeader, Wrap } from '../../common';
import styles from '../DappBrowser/DappBrowserStyle';
import Loader from '../Loader/Loader';
import { goBack } from '../../../navigationsService';
const gasFeeMultiplier = 0.000000000000000001;
var that = undefined;
class DappBrowserSwap extends Component {
  constructor(props) {
    super(props);
    console.log('props:::::',this.props?.route?.params?.chain,  `${this.props.stakeUrl}?chainId=${this.props?.route?.params?.chain=='stc'?'sbc':this.props?.route?.params?.chain=='bnb'?'bsc':this.props?.route?.params?.chain}`,Singleton.getInstance().defaultEthAddress);
    this.state = {
      content: '',
      jsContent: '',
      address: Singleton.getInstance().defaultEthAddress,
      chainId:
        this.props?.route?.params?.chain == 'eth'
          ? IS_PRODUCTION == 0
            ? 5
            : 1
          : this.props?.route?.params?.chain == 'stc'
          ? IS_PRODUCTION==0 ? 129:1209
          : IS_PRODUCTION == 0
          ? 97
          : 56,
      rpcUrl:
        this.props?.route?.params?.chain == 'eth'
          ? IS_PRODUCTION == 0
            ? Constants.testnetEth
            : this.props.publicEthUrl
          :  this.props?.route?.params?.chain == 'stc'
          ? IS_PRODUCTION == 0
            ? Constants.testnetStc
            : this.props.publicStcUrl
          :IS_PRODUCTION == 0
          ? Constants.testnetBnb
          : this.props.publicBscUrl,
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
      selectedNetwork: this.props?.route?.params?.chain == 'eth' ? 'Ethereum' : this.props?.route?.params?.chain == 'stc' ? 'Saitachain' :'Binance',
      url: '',
      enteredURL: `${this.props.stakeUrl}?chainId=${this.props?.route?.params?.chain=='stc'?'sbc':this.props?.route?.params?.chain=='bnb'?'bsc':this.props?.route?.params?.chain}`,
      startUrl: `${this.props.stakeUrl}?chainId=${this.props?.route?.params?.chain=='stc'?'sbc':this.props?.route?.params?.chain=='bnb'?'bsc':this.props?.route?.params?.chain}`,

      // enteredURL: `${this.props.stakeUrl}staking-pool?chainId=${this.props?.route?.params?.chain=='stc'?'sbc':this.props?.route?.params?.chain=='bnb'?'bsc':this.props?.route?.params?.chain}`,
      // startUrl: `${this.props.stakeUrl}staking-pool?chainId=${this.props?.route?.params?.chain=='stc'?'sbc':this.props?.route?.params?.chain=='bnb'?'bsc':this.props?.route?.params?.chain}`,
      isNetworkModalVisible: false,
      advanceModalVisible: false,
      favoriteArray: [],
      isFavorite: false,
      urlTitle: '',
      showAlertDialog: false,
      alertTxt: '',
      currentUrl: '',
      currencyName: '',
      gasLimit:0,
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
      finished: false,
      txnTobeSigned: undefined,
      gotSigningRequest: false,
      rejected: false,
      tronAddress: 'TWnLSuJyjJFCsffuFWUMXtqTX2YfhtvbUT',
      tronPvtKey: '',
      modalVisibleBnb: false,
      ethPrice: 0,
    };
  }
  invoke = createInvoke(() => this.webview);
  componentDidMount() {
    console.log("this.state.enteredURL::::::::::",this.state.enteredURL);
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    that = this;
    EventRegister.addEventListener('downModal', data1 => {
      let js = `trustwallet.ethereum.sendError(${this.state.signingData?.id}, 'Cancelled')`;
      if (js) {
        this.webview?.injectJavaScript(js);
      }
      this.setState({isVisible: false});
    });
    var provider = new web3.providers.HttpProvider(this.state.rpcUrl);
    this.web3 = new web3(provider);
    console.log('addd', Singleton.getInstance().defaultEthAddress);
    Singleton.getInstance()
      .newGetData(Singleton.getInstance().defaultEthAddress)
      .then(mnemonics => {
        var address = this.state.address;
        this.setState({mnemonics: mnemonics, address: address});
        setTimeout(() => {
          this.webview?.reload();
        }, 800);
        if (this.state.jsContent === '') {
          if (Platform.OS === 'ios') {
            RNFS.readFile(`${RNFS.MainBundlePath}/trust-min.js`, 'utf8')
              .then(content => {
                console.log('content');
                this.setState({
                  jsContent: this.getJavascript(
                    this.state.chainId,
                    this.state.rpcUrl,
                    address,
                    content,
                  ),
                  content: content,
                });
              })
              .catch(err => {
                console.log('err readfile', err);
              });
          } else {
            RNFS.readFileAssets('trust-min.js', 'utf8').then(content => {
              this.setState({
                jsContent: this.getJavascript(
                  this.state.chainId,
                  this.state.rpcUrl,
                  address,
                  content,
                ),
                content: content,
              });
            });
          }
        }
      });
    this.getBaseFee();
  }

  getEthPriceinFiat() {
    this.props.myWallets.find(value => {
      if (value.coin_symbol.toLowerCase() == this.props?.route?.params?.chain) {
        let perPrice_in_fiat = parseFloat(value.perPrice_in_fiat);
        this.setState({ethPrice: perPrice_in_fiat});
        return;
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
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
  signTronTx(txn) {
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
    this.setState({isLoading: Platform.OS != 'ios' ? true : true});
  };
  onShouldStartLoadWithRequest = () => {
    return true;
  };
  onMessage = async ({nativeEvent}) => {
    let message = JSON.parse(nativeEvent.data);
    console.warn('MM', '---------message------', message);
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
          : 'stc',
        this.state.selectedNetwork == 'Ethereum' ? 'transaction' :this.state.selectedNetwork == 'Saitachain' ? 'saitachain' : 'binance',
        message?.object?.gas 
      );
    } else if (message.name == 'requestAccounts') {
      let js = `trustwallet.${message?.network}.setAddress('${this.state.address}');`;
      this.webview?.injectJavaScript(js);
      let mmid = message.id;
      let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, ['${this.state.address}'])`;
      this.webview?.injectJavaScript(js1);
    } else if (
      message.name == 'signPersonalMessage' ||
      message.name == 'signMessage'
    ) {
      let mmid = message.id;
      let pKey = await Singleton.getInstance().newGetData(
        this.state.address + '_pk',
      );
      let signedMessage = await signPersonalMessage(
        message?.object?.data,
        pKey,
        this.state.coin_family
      );
      let js = `trustwallet.${message?.network}.sendResponse(${mmid}, "${signedMessage}")`;
      this.webview?.injectJavaScript(js);
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
      console.log('---------newParams:::::', newParams);
      setTimeout(async () => {
        Singleton.getInstance()
          .newGetData(this.state.address + '_pk')
          .then(async privateKey => {
            let pvt_key = privateKey;
            Singleton.getInstance()
              .dappApprovalHash(pvt_key, newParams)
              .then(res => {
                console.log('res::::::::', res);
                let mmid = message.id;
                let js = `trustwallet.ethereum.sendResponse(${mmid}, "${res}")`;
                this.webview?.injectJavaScript(js);
                this.setState({isLoading: false});
              })
              .catch(err => {
                console.log('err::::::::', err);
              });
          });
      }, 200);
    } 
  };
  getJavascript = function (chainId, rpcUrl, address, jsContent) {
    let source = '';
    console.log('chainId:', chainId, 'rpcUrl:', rpcUrl, 'address:', address);
    source = `
        ${jsContent}
        (function() {
          var config = {
            ethereum: {
              address: '${address}',
              chainId: '${this.props.chainId}',
              rpcUrl: '${this.props?.route?.params?.chain == 'eth' ? this.props.publicEthUrl : this.props?.route?.params?.chain == 'stc' ? this.props.publicStcUrl :this.props.publicBscUrl}'
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
  async getNonceAndGas(amount, coinsym, coinType,gas) {
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
          this.props
            .getBnbGasEstimate({
              blockChain,
              data,
              contractAddress,
              access_token,
            })
            .then(response => {
              console.log('response::::::::::', response);
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
              this.setState({isLoading: false});
            });
        });
    }
    if (coinsym.toLowerCase() == 'stc') {
      console.log("gas:::::::::",gas);
      let access_token = Singleton.getInstance().access_token;
      this.props.getSTCGasPrice().then(gasPrices => {
        console.log("gasPrices:::::", gasPrices);
        console.log("gas:::::::::",gas);
       if(gas){
        let web3= new Web3(this.state.rpcUrl)
        let gasLimit = web3.utils.hexToNumber(gas)
        console.log("gasLimit::::::::",gasLimit);
        let standard = gasPrices?.data?.safeGasPrice * 1000000000;
        let initialValue =
          standard * web3.utils.hexToNumber(gasLimit);
        let fee = initialValue * gasFeeMultiplier;
        this.setState({
          isVisible: true,
          calculatedFee: fee.toFixed(5),
          gasPrice: standard,
          gasLimit: gasLimit
        });
       }else{
        this.props
        .getStcGasEstimate({
          access_token,
        })
        .then(response => {
          console.log("response::::::",response);
          let gasLimit = response.data.find(item => item.name == 'swap')
          let standard = gasPrices?.data?.safeGasPrice * 1000000000;
          let initialValue =
            standard *  web3.utils.hexToNumber(gasLimit);
          let fee = initialValue * gasFeeMultiplier;
          this.setState({
            isVisible: true,
            calculatedFee: fee.toFixed(5),
            gasPrice: standard,
            gasLimit: gasLimit
          });
        })
        .catch(err => {
          console.warn('MM', 'Error: getStcGasEstimate', err);
          this.setState({ isLoading: false });
        });
       }
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
    let gasGwei =
      parseFloat(2 * this.state.baseFee) +
      parseFloat(this.state.advancePriorityFee);
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
    console.log('++++++++++');
    if (this.props?.route?.params?.chain == 'eth') {
      Singleton.getInstance()
        .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
        .then(ethPvtKey => {
          console.warn('MM', 'ethPvtKey--------', ethPvtKey);
          var pKey = ethPvtKey;
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
              console.warn('MM', 'chk signed txn::::::eth:::::', serializedTxn);
              this.sendCoin(serializedTxn,currentNonce);
            });
          } catch (err) {
            console.warn('MM', 'rtt----', err);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else if (this.props?.route?.params?.chain == 'bnb') {
      Singleton.getInstance()
        .newGetData(`${Singleton.getInstance().defaultBnbAddress}_pk`)
        .then(pk => {
          console.log('pk:::::::', pk);
          var pKey = pk;
          let gasLimit = this.web3.utils.toHex(
            this.hex2dec(this.state.signingData.object.gas) * 3,
          ); // in hex
          let gasPrice = this.web3.utils.toHex(this.state.gasPrice); // in hex
          let amount = (
            this.hex2dec(
              this.state.signingData.object.value
                ? this.state.signingData.object.value
                : '0x0',
            ) /
            10 ** 18
          ).toString();
          console.log('gasLimit:::', gasLimit);
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
            this.sendCoin(serializedTx,this.nonce);
          });
        })
        .catch(err => {
          Singleton.showAlert('Unable to process transaction.');
        });
    }else if (this.props?.route?.params?.chain == 'stc') {
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
              this.sendCoin(serializedTx,nonce);
            });
          })
        })
        .catch(err => {
          Singleton.showAlert('Unable to process transaction.');
        });
    }
  }
  sendCoin(serializedTx,nonce) {
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
      nonce: nonce,
      chat: 0,
      is_smart: 1,
      typeMessage: 'swapDapp',
    };
    let access_token = Singleton.getInstance().access_token;
    let blockChain =
      this.state.selectedNetwork == 'Ethereum'
        ? 'ethereum'
        :   this.state.selectedNetwork == 'Saitachain'
        ? 'saitachain'
        :'binancesmartchain';
        let coin_symbol = this.state.selectedNetwork == 'Ethereum' ? 'eth' : this.state.selectedNetwork == 'Saitachain'?'stc': 'bnb';
    console.log('data:::::', data);
    this.props
      .sendBNB({data, access_token, blockChain, coin_symbol})
      .then(res => {
        this.setState({isVisible: false, isLoading: false});
        let mmid = this.state.signingData.id;
        let hash = res.tx_hash;
        let js = `trustwallet.ethereum.sendResponse(${mmid}, '${hash}')`;
        this.webview?.injectJavaScript(js);
      })
      .catch(err => {
        let js = `trustwallet.ethereum.sendError(${this.state.signingData.id}, '${err.message}')`;
        this.webview?.injectJavaScript(js);
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
    if (this.validURL(this.state.enteredURL)) {
      if (!this.state.enteredURL.startsWith('http')) {
        this.setState({url: 'https://' + this.state.enteredURL});
      } else {
        if (type == 1) {
          if (this.state.url == this.state.enteredURL) {
            this.setState({url: ''}, () => {
              this.setState({url: this.state.enteredURL});
            });
          }
        } else {
          this.setState({url: this.state.enteredURL});
        }
      }
    } else {
      let a = this.state.enteredURL.includes('about:blank')
        ? this.props.url
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
  onRefresh(type) {
    console.log('refresh:::::::::');
    setTimeout(() => {
      let script = `
            var config = {
               ethereum: {
                  address: "${this.state.address}",
                  chainId: ${this.state.chainId},
                  rpcUrl: "${
                    this.props?.route?.params?.chain == 'eth' ? this.props.publicEthUrl :  this.props?.route?.params?.chain == 'stc' ? this.props.publicStcUrl: this.props.publicBscUrl
                  }"
                }
            };
            ethereum.setConfig(config);`;
      console.log('script++++', script);
      this.webview?.injectJavaScript(script);
      const chainId = this.web3.utils.toHex(IS_PRODUCTION == 0 ? 97 : '56');
      const js = `trustwallet.ethereum.emitChainChanged('${chainId}')`;
      this.webview?.injectJavaScript(js);
    }, 1000);
  }
  onLoadEnd = event => {
    console.log('End::::::::::');

    this.onRefresh();

    // firstLoadEnd = true
    this.setState({isLoading: false});
  };
  render() {
    return (
      <>
        {/* <View style={{ flex: 1, backgroundColor: ThemeManager.colors.bg, }}> */}
        <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
          <SimpleHeader
            title={LanguageManager.stake}
            backImage={ThemeManager.ImageIcons.iconBack}
            back={false}
            backPressed={() => {
              this.props.navigation.goBack();
            }}
            containerStyle={{
              backgroundColor: ThemeManager.colors.bg,
              marginBottom: 5,
            }}
            plusIconStyle={{
              height: widthDimen(22),
              width: widthDimen(22),
              resizeMode: 'contain',
              tintColor: ThemeManager.colors.iconColor,
              paddingHorizontal: 20,
            }}
            rightIcon={Images.financeIcon}
            onPressHistory={() => this.webview?.reload()}
          />
          <View style={{flex: 1}}>
            {console.log(this.state.startUrl,'adsfasdfasd')}
            <WebView
              ref={ref => (this.webview = ref)}
              source={{uri: this.state.startUrl}}
              injectedJavaScriptBeforeContentLoaded={this.state.jsContent}
              style={{flex: 1}}
              onMessage={this.onMessage}
              onNavigationStateChange={navState => {
                console.log(
                  'navState',
                  navState,
                  'chainId:::::',
                  this.state.chainId,
                );
                this.setState({
                  canGoBack: navState.canGoBack,
                  canGoForward: navState.canGoForward,
                  enteredURL: navState.url,
                  urlTitle: navState.title,
                });
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
              originWhitelist={['http://*', 'https://*', 'intent://*']}
              onLoadEnd={this.onLoadEnd}
            />
          </View>
        </Wrap>

        <SafeAreaView style={{backgroundColor: ThemeManager.colors.bg}} />
        <Modal
          visible={this.state.isVisible}
          animationType="fade"
          transparent
          style={{margin: 0, justifyContent: 'flex-end'}}>
          {this.state.signingData != '' && (
            <>
              <View style={[styles.modalView]}>
                <View style={[styles.modalinner,{backgroundColor:ThemeManager.colors.bg}]}>
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
                        this.webview?.injectJavaScript(js);
                        this.setState({isVisible: false});
                      }}>
                      <FastImage
                        style={{width: 15, height: 15, marginRight: 10}}
                        resizeMode={FastImage.resizeMode.contain}
                        tintColor={ThemeManager.colors.textColor}
                        source={Images.cancel}
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
                        : 'STC'}
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
                        : 'STC'}
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
                }></Inputtext>

              <Inputtext
                label="Gas Limit"
                placeholder="Please enter Gas Limit"
                value={this.state.advancedGasLimit}
                labelStyle={styles.labelTextStyle}
                keyboardType={'number-pad'}
                onChangeNumber={text =>
                  this.setState({advancedGasLimit: parseFloat(text)})
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
              editable={false}></Inputtext>
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
      </>
    );
  }

  async getBaseFee() {
    const fee = await getEthBaseFeeDapp();
    const priorityFees = await getPriorityDapp();
    this.setState({baseFee: fee, priorityFees: priorityFees}, () => {});
  }
}

const mapStateToProp = state => {
  const {currentEthpriceInSelectedCurrency, myWallets} = state.walletReducer;
  const {stakeUrl, publicBscUrl, publicEthUrl,publicStcUrl} = state.walletReducer.dex_data;
  return {currentEthpriceInSelectedCurrency, myWallets,stakeUrl,publicBscUrl,publicEthUrl,publicStcUrl};
};
export default connect(mapStateToProp, {
  getBnbNonce,
  getBnbGasEstimate,
  sendBNB,
  getStcGasEstimate,
  getSTCGasPrice
})(DappBrowserSwap);
