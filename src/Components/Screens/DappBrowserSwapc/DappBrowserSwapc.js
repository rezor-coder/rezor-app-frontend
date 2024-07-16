/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import { Wallet } from 'ethers';
import React, { Component } from 'react';
import {
  BackHandler,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import WebView from 'react-native-webview';
import createInvoke from 'react-native-webview-invoke/native';
import { connect } from 'react-redux';
import web3 from 'web3';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { DAPP_IMG_URL, IS_PRODUCTION } from '../../../Endpoints';
import { getBnbGasEstimate, getBnbNonce, sendBNB } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { Colors, Fonts } from '../../../theme';
import Images from '../../../theme/Images';
import {
  getDappSignedTxn,
  getEthBaseFeeDapp,
  getNonceValueDapp,
  getPriorityDapp,
  getTotalGasFeeDapp,
  getsignRawTxnDappBnb,
} from '../../../utils';
import { ButtonPrimary, Inputtext, SimpleHeader } from '../../common';
import Loader from '../Loader/Loader';
import styles from './DappBrowserSwapStylec';
import { goBack } from '../../../navigationsService';
var web3BscUrl =
  IS_PRODUCTION == 0
    ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    : 'https://bsc-dataseed1.binance.org:443';
const gasFeeMultiplier = 0.000000000000000001;
const gas = 1000000000;

class DappBrowserSwapc extends Component {
  constructor(props) {
    //console.warn('MM','===>>>> ccc', props.url, props.typeofAction);
    super(props);
    // this.timer = null;
    // this.timer2 = null;
    // this.timer3 = null;
    //console.warn('MM','this.props.item.blockChainType:::::', this.props.item);
    ////console.log(
    // 'Constants.mainnetInfuraLink:::::',
    //   Constants.mainnetInfuraLink,
    // );
    this.state = {
      content: '',
      jsContent: '',
      address: this.props.item
        ? this.props.item?.coin_family == 6
          ? Singleton.getInstance().defaultBnbAddress
          : Singleton.getInstance().defaultEthAddress
        : Singleton.getInstance().defaultEthAddress,
      chainId: IS_PRODUCTION == 0 ? '4' : '1',
      rpcUrl:
        IS_PRODUCTION == 0
          ? 'https://rinkeby.infura.io/v3/ef700abe941041fe8556c43d40f131ab'
          :Singleton.getInstance().ethLink,
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
          : 'Ethereum'
        : 'Ethereum',
      selectedNetworkImageUri: this.props.item
        ? this.props.item?.coin_family == 6
          ? `${DAPP_IMG_URL}/images/bnb.png`
          : `${DAPP_IMG_URL}/images/eth.png`
        : `${DAPP_IMG_URL}/images/eth.png`,
      url: '',
      enteredURL: this.props.url
        ? this.props.url
        : 'https://app.compound.finance',
      startUrl: this.props.url.includes('https://')
        ? this.props.url
        : 'https://www.google.com/search?q=' + this.props.url,
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
          ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
          : 'https://bsc-dataseed1.binance.org:443',
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
    // //console.warn('MM',">>>>>myWallets.", this.props.myWallets);
    // //console.warn('MM','address:::::', this.state.address)
    this.getEthPriceinFiat();
    this.props.navigation.addListener('blur', this.screenBlur);
    this.props.navigation.addListener('focus', this.screenFocus);

    var provider = new web3.providers.HttpProvider(this.state.rpcUrl);
    this.web3 = new web3(provider);

    if (this.state.jsContent === '') {
      var address = this.state.address;

      if (Platform.OS === 'ios') {
        RNFS.readFile(`${RNFS.MainBundlePath}/trust-min.js`, 'utf8').then(
          content => {
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
        );
        // this.setUrl(2);
      } else {
        ////console.log(
        // 'chk platform::::',
        //   Platform.OS,
        //   this.state.chainId,
        //   this.state.rpcUrl,
        //   address,
        // );
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

      setTimeout(() => {
        this.webview?.reload();
      }, 500);
    }
    this.getBaseFee();
  }

  getEthPriceinFiat() {
    this.props.myWallets.find(value => {
      if ('eth' == value.coin_symbol.toLowerCase()) {
        let perPrice_in_fiat = parseFloat(value.perPrice_in_fiat);
        this.setState({ ethPrice: perPrice_in_fiat });
        //console.warn('MM','-----value.perPrice_in_fiat', perPrice_in_fiat);
        return;
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
    // if (this.timer) {
    //   clearTimeout(this.timer);
    // }
    // if (this.timer1) {
    //   clearTimeout(this.timer1);
    // }
    // if (this.timer2) {
    //   clearTimeout(this.timer2);
    // }
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

  onLoadStart = event => {
    this.setState({ isLoading: Platform.OS != 'ios' ? true : true });
  };
  checkForSigned() {
    return new Promise((resolve, reject) => { });
  }
  onShouldStartLoadWithRequest = () => {
    return true;
  };
  onMessage = async ({ nativeEvent }) => {
    let message = JSON.parse(nativeEvent.data);
    //console.warn('MM','---------message------', JSON.parse(nativeEvent.data));
    //console.warn('MM','---------selectedNetwork------', this.state.selectedNetwork);
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
        this.state.selectedNetwork == 'Ethereum' ? 'eth' : 'bnb',
        this.state.selectedNetwork == 'Ethereum' ? 'transaction' : 'binance',
      );
    } else if (message.name == 'requestAccounts') {
      let js = `window.ethereum.setAddress('${this.state.address}');`;
      this.webview.injectJavaScript(js);
      let mmid = message.id;
      let js1 = `window.ethereum.sendResponse(${mmid}, ['${this.state.address}'])`;
      this.webview.injectJavaScript(js1);
    } else if (
      message.name == 'signPersonalMessage' ||
      message.name == 'signMessage'
    ) {
      let mmid = message.id;
      const wallet = Wallet.fromMnemonic(this.state.mnemonics);
      var pKey = wallet.privateKey;
      let signedMessage = await Singleton.getInstance().signPersonalMessage(
        message.object.data,
        pKey,
      );
      let js = `window.ethereum.sendResponse(${mmid}, "${signedMessage}")`;
      this.webview.injectJavaScript(js);
    }
  };
  getJavascript = function (chainId, rpcUrl, address, jsContent) {
    let source = '';
    //console.warn('MM','chainId:', chainId, 'rpcUrl:', rpcUrl, 'address:', address);
    if (this.state.privacyMode) {
      source = `
      ${jsContent}
          var config = {
              chainId: ${chainId}},
              rpcUrl: ${rpcUrl}
          };
          const provider = new window.Trust(config);
          window.ethereum = provider;
          window.chrome = {webstore: {}};        
      `;
    } else {
      source = `
      ${jsContent}
      var config = {
        address: '${address}',
        chainId: '${chainId}',
        rpcUrl: '${rpcUrl}'
      };
      const provider = new window.Trust(config);
      provider.isDebug = true;
      window.ethereum = provider;
      window.web3 = new window.Web3(provider);
      window.web3.eth.defaultAccount = config.address;
      window.chrome = {webstore: {}};
      `;
      return source;
    }
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
        gasFees * this.hex2dec(this.state.signingData.object.gas);
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
              this.setState({ isLoading: false });
            });
        });
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
    ////console.log(
    // 'gas gwei price----',
    //   2 * this.state.baseFee + parseInt(this.state.advancePriorityFee),
    // );
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
    // );
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
    //   this.props.item,
    // );
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
        : 'binancesmartchain';
    let coin_symbol = this.state.selectedNetwork == 'Ethereum' ? 'eth' : 'bnb';
    this.props
      .sendBNB({ data, access_token, blockChain, coin_symbol })
      .then(res => {
        ////console.log(
        // '-----------------------Response------------',
        //   res.tx_hash,
        //   this.state.signingData.id,
        // );
        this.setState({ isVisible: false, isLoading: false });
        let mmid = this.state.signingData.id;
        let hash = res.tx_hash;
        let js = `window.ethereum.sendResponse(${mmid}, '${hash}')`;
        // if(props.typeofAction=="stake"){
        //   Singleton.showAlert("Stake successful, waiting for Blockchain confirmation.")
        // }else{
        //   Singleton.showAlert(res.message)
        // }

        this.webview.injectJavaScript(js);
      })
      .catch(err => {
        //console.warn('MM','Error: ', err);
        let js = `window.ethereum.sendError(${this.state.signingData.id
          }, '${JSON.stringify(err.message)}')`;
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
        //console.warn('MM','true ==>>> ', 'https://' + this.state.enteredURL);
        this.setState({ url: 'https://' + this.state.enteredURL });
      } else {
        //console.warn('MM','2true ==>>> ', 'https://' + this.state.enteredURL);
        // 1 is reload
        if (type == 1) {
          //console.warn('MM','check type 1 part=====>', this.state.enteredURL);
          if (this.state.url == this.state.enteredURL) {
            this.setState({ url: '' }, () => {
              this.setState({ url: this.state.enteredURL });
            });
          }
        } else {
          //console.warn('MM','3true ==>>> ', 'https://' + this.state.enteredURL);
          this.setState({ startUrl: this.state.enteredURL });
        }
      }
    } else {
      //console.warn('MM','check else part=====>', this.state.enteredURL);
      //console.warn('MM','4true ==>>> ', 'https://' + this.state.enteredURL);
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
    return (
      <>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.headerBg }}>
          <View style={{ flex: 1 }}>
            <SimpleHeader title={''} />

            <View
              style={{
                height: 2,
                width: '100%',
                backgroundColor: ThemeManager.colors.chooseBorder,
                marginTop: 10,
                opacity: 0.6,
              }}
            />
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
              onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
              onNavigationStateChange={navState => {
                //console.warn('MM',' navState ==>>>', navState);

                this.setState({
                  canGoBack: navState.canGoBack,
                  canGoForward: navState.canGoForward,
                  enteredURL: navState.url,
                  urlTitle: navState.title,
                });
                ////console.log(
                //     'check entered url---------->',
                //       this.state.enteredURL,
                //       );
                //       ////console.log(
                //         'check this.state.startUrl ---------->',
                // this.state.startUrl,
                // );
                if (this.state.startUrl != this.state.enteredURL) {
                  ////console.log(
                  // 'check this.state.startUrl ---------->',
                  // this.state.startUrl,
                  //       );
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
              originWhitelist={['*']}
              onLoadStart={this.onLoadStart}
              onLoadEnd={this.onLoadEnd}
              onError={err => {
                //console.warn('MM','chk err', err);
                this.webview?.reload();
              }}
              cacheEnabled={false}
            />
            {this.state.isLoading && <Loader />}
            {this.state.isNetworkModalVisible && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => {
                    var provider = new web3.providers.HttpProvider(
                      IS_PRODUCTION == 0
                        ? 'https://rinkeby.infura.io/v3/ef700abe941041fe8556c43d40f131ab'
                        : Singleton.getInstance().ethLink,
                    );
                    this.web3 = new web3(provider);
                    this.setState({
                      isNetworkModalVisible: false,
                      selectedNetwork: 'Ethereum',
                      selectedNetworkImageUri: DAPP_IMG_URL + '/images/eth.png',
                      chainId: Constants.network == 'testnet' ? '4' : '1',
                      rpcUrl:
                        IS_PRODUCTION == 0
                          ? 'https://rinkeby.infura.io/v3/ef700abe941041fe8556c43d40f131ab'
                          : Singleton.getInstance().ethLink,
                      jsContent: this.getJavascript(
                        IS_PRODUCTION == 0 ? '3' : '1',
                        IS_PRODUCTION == 0
                          ? 'https://rinkeby.infura.io/v3/ef700abe941041fe8556c43d40f131ab'
                          : Singleton.getInstance().ethLink,
                        this.state.address,
                        this.state.content,
                      ),
                    });
                    setTimeout(() => {
                      this.webview?.reload();
                    }, 2000);
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    <FastImage
                      style={{ marginRight: 10, width: 20, height: 20 }}
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
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => {
                    var provider = new web3.providers.HttpProvider(web3BscUrl);
                    this.web3 = new web3(provider);
                    this.setState({
                      isNetworkModalVisible: false,
                      selectedNetwork: 'Binance',
                      selectedNetworkImageUri: DAPP_IMG_URL + '/images/bnb.png',
                      chainId: '4',
                      rpcUrl: web3BscUrl,
                      jsContent: this.getJavascript(
                        IS_PRODUCTION == 0 ? '97' : '56',
                        web3BscUrl,
                        this.state.address,
                        this.state.content,
                      ),
                    });
                    setTimeout(() => {
                      this.webview?.reload();
                    }, 2000);
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    <FastImage
                      style={{ marginRight: 10, width: 20, height: 20 }}
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
              </View>
            )}
          </View>
          {/* <View style={{ width: '100%', height: 44, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.white }}>
            <View style={{ width: 100, height: 44, flexDirection: 'row', justifyContent: 'space-between', elevation: 2, }}>
              <TouchableOpacity style={{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center', }}
                onPress={() => {
                  //console.warn('MM','print enter url===----->', this.state.enteredURL);
                  if (this.state.enteredURL === 'about:blank') {
                    this.setState({ canGoBack: false, });
                  } else {
                    this.webview.goBack();
                  }
                }}
                disabled={!this.state.canGoBack}>
                <FastImage style={[{ width: 25, height: 25, transform: [{ rotateY: '180deg' }] }, this.state.canGoBack ? { opacity: 1 } : { opacity: 0.2 }]}
                  tintColor={'blue'} resizeMode={'contain'} source={images.rightArrow}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center', }}
                onPress={() => this.webview.goForward()}
                disabled={!this.state.canGoForward}>
                <FastImage style={[{ width: 25, height: 25, tintColor: 'blue' }, this.state.canGoForward ? { opacity: 1 } : { opacity: 0.2 },]}
                  tintColor={'blue'} resizeMode={'contain'} source={Images.rightArrow}
                />
              </TouchableOpacity>
            </View>
            <View style={{ width: 50, height: 44, flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => this.webview.reload()}>
                <FastImage
                  style={{ width: 25, height: 25, tintColor: 'blue' }}
                  resizeMode={'contain'} tintColor={'blue'}
                  source={Images.financeIcon}
                />
              </TouchableOpacity>
            </View>
          </View> */}
          {/* {this.state.isLoading && <Loader color="white" />} */}
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
                        let js = `window.ethereum.sendError(${this.state.signingData.id}, 'Cancelled')`;
                        //console.warn('MM','----------------js-----------', js);
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
                      {this.state.selectedNetwork == 'Ethereum' ? 'ETH' : 'BNB'}
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
                      {/* {////console.log(
                      'signingData',
                      this.hex2dec(this.state.signingData.object.value) /
                      10 ** 18,
                      this.state.calculatedFee,
                      this.state.ethPrice,
                      parseFloat(
                        this.hex2dec(this.state.signingData.object.value) /
                        10 ** 18,
                      ) + parseFloat(this.state.calculatedFee),
                      parseFloat(this.state.ethPrice),
                      )} */}
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
                      {this.state.selectedNetwork == 'Ethereum' ? 'ETH' : 'BNB'}
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
    this.setState({ baseFee: fee, priorityFees: priorityFees }, () =>{

   //  console.warn('MM',' Base Fee chk fee:::::eth:::::::', this.state.baseFee)
    }
    );
    ////console.log(
    // ' Priority Fee chk fee:::::eth:::::::',
    //   this.hex2dec(priorityFees) / 100000000,
    //   );
  }
}

const mapStateToProp = state => {
  const { currentEthpriceInSelectedCurrency, myWallets } = state.walletReducer;
  return { currentEthpriceInSelectedCurrency, myWallets };
};
export default connect(mapStateToProp, {
  getBnbNonce,
  getBnbGasEstimate,
  sendBNB,
})(DappBrowserSwapc);
