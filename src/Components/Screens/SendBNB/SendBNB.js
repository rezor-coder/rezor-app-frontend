/* eslint-disable curly */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import styles from './SendBNBStyle';
import {
  Wrap,
  ButtonTransaction,
  ButtonPrimary,
  SimpleHeader,
  BasicInputBox,
  InputtextAddress,
  BasicModal,
  BorderLine,
  BasicButton,
  PinInput,
  KeyboardDigit,
} from '../../common';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { Images, Colors, Fonts } from '../../../theme/index';
import { Actions } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import { connect } from 'react-redux';
import * as constants from '../../../Constant';
import { CameraScreen } from 'react-native-camera-kit';
import Loader from '../Loader/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  getBnbNonce,
  getBnbGasPrice,
  getBnbGasEstimate,
  getEthTokenRaw,
  walletFormUpdate,
  sendBNB,
  CheckIsContactExist
} from '../../../Redux/Actions';
import { BASE_IMAGE } from '../../../Endpoints';
import moment from 'moment';
import {
  bnbDataEncode,
  sendTokenBNB,
  getBnbRaw,
  exponentialToDecimalWithoutComma,
  CommaSeprator3,
  bigNumberSafeMath,
} from '../../../utils';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { AddressBox } from '../../common/AddressBox';
import * as Constants from '../../../Constant';
import fonts from '../../../theme/Fonts';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { Clipboard } from 'react-native';
import { DetailOption } from '../../common/DetailOption';
import QRReaderModal from '../../common/QRReaderModal';
import { EventRegister } from 'react-native-event-listeners';
const gwei_multi = 1000000000;
class SendBNB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockChain: 'binancesmartchain',
      walletData: this.props.walletData,
      isLoading: false,
      gasPriceForTxn: 1000000000,
      gasPriceForTxnSlow: 1000000000,
      gasPriceForTxnMedium: 8000000000,
      gasPriceForTxnHigh: 10000000000,
      gaslimitForTxn: '',
      gasFeeMultiplier: 0.000000000000000001,
      totalFee: '0',
      balance: 0,
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
    };
  }
  componentDidMount() {
    // this.setState({BasicModall:true})
    // console.warn('MM','walletData-- ', this.state.walletData?.coin_image);
    console.log('walletData===', this.state.walletData);
    this.props.navigation.addListener('didFocus', this.onScreenFocus);
    this.props.navigation.addListener('didBlur', this.screenBlur);
    Singleton.getInstance()
      .newGetData(`${Singleton.getInstance().defaultBnbAddress}_pk`)
      .then(bnbPvtKey => {
        //  console.warn('MM','chk bnb  pvt key::::', Singleton.getInstance().defaultBnbAddress, bnbPvtKey);
        this.setState({ bnbPvtKey: bnbPvtKey });
      });
    this.availableBalance();
    this.getGasLimit();
    ////console.log(
    // 'feees====',
    //   Singleton.getInstance().toFixed(
    //     this.state.gasPriceForTxnMedium *
    //     this.state.gaslimitForTxn *
    //     this.state.gasFeeMultiplier,
    //   ),
    // );
    // ////console.log(
    // 'this.state.gasPriceForTxnMedium',
    //   this.state.gasPriceForTxnMedium,
    // );
    //console.warn('MM','oiuouoi', this.state.gaslimitForTxn);
  }
  onScreenFocus = () => {
    global.firstLogin = true;
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    EventRegister.addEventListener('downModal', () => {
      if (this.state.BasicModall) {
        this.setState({ BasicModall: false })
        Actions.currentScene != 'Wallet' && Actions.Wallet()
      }
    });
  };
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    EventRegister.removeEventListener('downModal')
  };
  backAction = () => {
    if (this.state.Start_Scanner) {
      this.setState({ Start_Scanner: false });
      return true;
    } else {
      Actions.pop();
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
        console.warn('MM', 'response GAS--bnb ', response);
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
        console.log(error);
        this.setState({ isLoading: false });
        Singleton.showAlert(error?.message || Constants.SOMETHING_WRONG);
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
          this.state.walletData.is_token == 1
            ? this.send_BEP20()
            : this.send_BNB();
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
    if (
      this.state.to_Address?.toLowerCase() ==
      this.state.walletData?.wallet_address?.toLowerCase()
    ) {
      Singleton.showAlert(constants.SAME_ADDRESS_ERROR);
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
    //console.warn('MM','this.state.walletData ', this.state.walletData);

    if (
      parseFloat(this.state.walletData?.balance) < parseFloat(this.state.amount)
    ) {
      Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
      return;
    } else {
      if (Singleton.getInstance().validateEthAddress(this.state.to_Address)) {
        this.setState({ showConfirmTxnModal: true });
      } else {
        Singleton.showAlert(constants.VALID_ADDRESS);
      }
    }
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
      //console.warn('MM','this.state.totalFee', this.state.totalFee);
      if (this.state.walletData?.coin_symbol?.toLowerCase() == 'bnb') {
        if (
          parseFloat(this.state.walletData.balance - this.state.totalFee) <= 0
        ) {
          Singleton.showAlert(LanguageManager.lowBalanceAlert);
          this.setState({ maxClicked: false });
          return;
        }
        this.setState({
          amount: Singleton.getInstance()
            .toFixednew(
              this.state.walletData?.balance - this.state.totalFee - 0.00002,
              8,
            )
            .toString(),
        });
      } else {
        if (parseFloat(this.state.walletData.balance) <= 0) {
          Singleton.showAlert(LanguageManager.lowBalanceAlert);
          this.setState({ maxClicked: false });
          return;
        }
        this.setState({
          amount: Singleton.getInstance()
            .toFixednew(
              exponentialToDecimalWithoutComma(this.state.walletData.balance),
              8,
            )
            .toString(),
        });
      }
    }
  }
  send_BNB() {
    this.setState({ isLoading: true });
    let wallet_address = Singleton.getInstance().defaultBnbAddress;
    let access_token = Singleton.getInstance().access_token;
    let blockChain = this.state.blockChain;
    let coin_symbol = this.state.walletData?.coin_symbol?.toLowerCase();
    let chainId = constants.network == 'testnet' ? 97 : 56;

    this.props
      .getBnbNonce({ wallet_address, access_token, blockChain, coin_symbol })
      .then(nonce => {
        //console.warn('MM','Chk bnb nonce::::::::', nonce);
        getBnbRaw(
          this.state.amount,
          this.state.to_Address,
          nonce,
          this.state.gasPriceForTxn,
          this.state.gaslimitForTxn,
          chainId,
          this.state.bnbPvtKey,
        )
          .then(bnbSignedRaw => {
            console.warn('MM', 'Chk bnbSignedRaw::::::::', bnbSignedRaw);
            this.send(
              bnbSignedRaw,
              this.state.walletData.coin_symbol.toLowerCase(),
              nonce,
            );
          })
          .catch(err => {
            this.setState({ isLoading: false });
            //console.warn('MM','Chk bnbSignedRaw err::::::::', err);
          });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        //console.warn('MM','Chk bnb nonce err::::::::', err);
      });
  }
  send_BEP20() {
    this.setState({ isLoading: true });
    let access_token = Singleton.getInstance().access_token;
    let blockChain = this.state.blockChain;
    let contractAddress = this.state.walletData.token_address;
    let chainID = constants.network == 'testnet' ? 97 : 56;
    let coin_symbol = 'bnb';
    let wallet_address = Singleton.getInstance().defaultBnbAddress;
    console.warn('MM', 'chk bep encoded Data::::::', this.state.amount * this.state.walletData.decimals, this.state.amount, this.state.walletData.decimals);
    bnbDataEncode(
      contractAddress,
      this.state.to_Address,
      exponentialToDecimalWithoutComma(this.state.amount * this.state.walletData.decimals),
    )
      .then(encodedData => {
        console.warn('MM', 'chk bep encoded Data::::::', encodedData);
        this.props
          .getBnbNonce({ wallet_address, access_token, blockChain, coin_symbol })
          .then(nonce => {
            console.warn('MM', 'chk bep-20 nonce::::::', nonce);
            sendTokenBNB(
              contractAddress,
              encodedData,
              nonce,
              this.state.gasPriceForTxn,
              this.state.gaslimitForTxn,
              chainID,
              this.state.bnbPvtKey,
            )
              .then(signedRaw => {

                console.warn('MM', 'chk bep signedRaw::::::', signedRaw);
                this.send(
                  signedRaw,
                  this.state.walletData.token_address,
                  nonce,
                );
              })
              .catch(err => {
                this.setState({ isLoading: false });
                Singleton.showAlert(err.message);
              });
          })
          .catch(err => {
            this.setState({ isLoading: false });
            Singleton.showAlert(err.message);
          });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        Singleton.showAlert(err.message);
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
        console.log('res::::::::::::sendBNB::::::', res);
        let req = {
          to: this.state.to_Address,
          coinFamily: 6
        }
        this.props.CheckIsContactExist({ data: req, access_token }).then(response => {
          this.setState({
            isLoading: false,
            showConfirmTxnModal: false,
            pinModal: false,
            BasicModall: true,
            showAddContact:response?.is_contact==0?true:false
          });
          setTimeout(() => {
            this.setState({ isLoading: false });
          }, 150);
        }).catch(err => {
          this.setState({
            isLoading: false,
            showConfirmTxnModal: false,
            pinModal: false,
            BasicModall: true,
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
        Singleton.showAlert(err?.message || 'Something went wrong');
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
            style={[styles.addressIcon, { padding: 15, alignSelf: 'flex-end' }]}>
            <FastImage
              style={{ width: 30, height: 30, marginRight: 10 }}
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
            {
              console.log("event:::::",event);
              this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
            }
            }
          /> */}
        </SafeAreaView>
      );
    return (
      <>
        {/* {//console.warn('MM','selectedFee', this.state.selectedFee)} */}
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <SimpleHeader
            history={true}
            customIcon={Images.address}
            onPressHistory={() =>
              Actions.currentScene != 'SendCryptoContacts' &&
              Actions.SendCryptoContacts({
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
                      <FastImage
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
                          backgroundColor: ThemeManager.colors.swapBg,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: ThemeManager.colors.titleColor,
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
                    style={
                      {
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
                    title={LanguageManager.amount}
                    width={'80%'}
                    text={exponentialToDecimalWithoutComma(this.state.amount)}
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
                        color: ThemeManager.colors.headingText,
                        fontFamily: Fonts.semibold,
                        fontSize: areaDimen(14),
                      }}>
                      <Text
                        style={{
                          color: ThemeManager.colors.lightTextColor,
                          fontFamily: Fonts.semibold,
                          fontSize: areaDimen(14),
                        }}>≈</Text>
                      {' '}
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
                      }}>{`${Singleton.getInstance().toFixednew(exponentialToDecimalWithoutComma(this.state.walletData?.balance), decim)
                        } ${this.state.walletData?.coin_symbol.toUpperCase()}`}</Text>
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: heightDimen(15) }}>
                <View style={styles.transaction__options}>
                  <Text
                    style={[
                      styles.transaction_textStye,
                      {
                        paddingHorizontal: 3,
                        color: ThemeManager.colors.textColor,
                        fontFamily: fonts.medium,
                        fontSize: areaDimen(14),
                      },
                    ]}>
                    {LanguageManager.transactionFeesBNB}{' '}
                  </Text>
                </View>
                {this.state.advancedSet && (
                  <InputtextAddress
                    value={this.state.totalFee}
                    editable={false}
                    labelStyle={styles.labelTextStyle}
                  />
                )}
                {!this.state.advancedSet && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                      marginVertical: heightDimen(10),
                    }}>
                    <ButtonTransaction
                      style={{
                        backgroundColor:
                          this.state.selectedFee == 'slow'
                            ? ThemeManager.colors.primary
                            : ThemeManager.colors.swapBg,
                        marginHorizontal: 10,
                      }}
                      onPress={() => this.slowAction()}
                      label="Slow"
                      transactionfee={
                        Singleton.getInstance().toFixed(
                          this.state.gasPriceForTxnSlow *
                          this.state.gaslimitForTxn *
                          this.state.gasFeeMultiplier,
                          8,
                        ) + ' BNB'
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
                            ? ThemeManager.colors.primary
                            : ThemeManager.colors.swapBg,
                        marginHorizontal: 10,
                      }}
                      onPress={() => this.mediumAction()}
                      label="Average "
                      transactionfee={
                        Singleton.getInstance().toFixed(
                          this.state.gasPriceForTxnMedium *
                          this.state.gaslimitForTxn *
                          this.state.gasFeeMultiplier,
                          8,
                        ) + ' BNB'
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
                            ? ThemeManager.colors.primary
                            : ThemeManager.colors.swapBg,
                        marginHorizontal: 10,
                      }}
                      onPress={() => this.highAction()}
                      label="Fast"
                      transactionfee={
                        Singleton.getInstance().toFixed(
                          this.state.gasPriceForTxnHigh *
                          this.state.gaslimitForTxn *
                          this.state.gasFeeMultiplier,
                          8,
                        ) + ' BNB'
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
              </View>
              <View style={{ alignSelf: 'flex-end' }}>
                <Text
                  style={[
                    styles.textStyle,
                    { color: ThemeManager.colors.lightTextColor },
                  ]}>
                  {LanguageManager.totalAmount}
                </Text>
                <Text
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    // color: Colors.white,
                    color: ThemeManager.colors.headingText,
                  }}>
                  {this.state.walletData.coin_symbol.toLowerCase() == 'bnb' ? (
                    <Text
                      style={[
                        styles.fee__totalAmountvalue,
                        { color: ThemeManager.colors.textColor },
                      ]}>
                      {
                        this.state.amount
                          ? Singleton.getInstance().toFixednew(exponentialToDecimalWithoutComma(bigNumberSafeMath(this.state.amount == '.' ? '0' : this.state.amount, '+', this.state.totalFee)), decim)
                          : parseFloat(this.state.totalFee)}{' '}
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
                        )} BNB`
                        : `${0} ${this.state.walletData?.coin_symbol?.toUpperCase()} + ${Singleton.getInstance().toFixed(
                          this.state.totalFee,
                          8,
                        )} BNB`}{' '}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          </ScrollView>
          <View style={{ marginVertical: 20, marginHorizontal: widthDimen(22) }}>
            {/* <ButtonPrimary
              onpress={() => this.onSendAction()}
              btnstyle={{ height: 50, width: '95%', borderRadius: 14 }}
              text={LanguageManager.send}
            /> */}
            <BasicButton
              onPress={() => this.onSendAction()}
              btnStyle={{ height: heightDimen(60), width: '100%' }}
              customGradient={{ borderRadius: heightDimen(100) }}
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
                      borderColor: ThemeManager.colors.viewBorderColor,
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
                      borderColor: ThemeManager.colors.viewBorderColor,
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
                      this.state.amount *
                      this.state.walletData?.perPrice_in_fiat,
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
                  value={Singleton.getInstance().defaultBnbAddress}
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
                  value={`${parseFloat(this.state.totalFee).toFixed(8)} ${this.state.walletData?.is_token == 1
                    ? 'BNB'
                    : this.state.walletData?.coin_symbol.toUpperCase()}`}
                  // fiatValue={walletData?.currency_symbol + (parseFloat(totalFee)).toFixed(2)}
                  fiatValue={Singleton.getInstance().toFixed(
                    exponentialToDecimalWithoutComma(
                      parseFloat(this.state.totalFee) *
                      this.state.walletData?.native_perPrice_in_fiat,
                    ),
                    2,
                  )}
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={''}
                  bottomLine={true}
                />

                <DetailOption
                  type={'AmountWithSmallText'}
                  item={'Total value'}
                  value={
                    this.state.walletData?.is_token == 1
                      ? `${exponentialToDecimalWithoutComma(parseFloat(
                        this.state.amount,
                      ))} ${this.state.walletData?.coin_symbol.toUpperCase()} + ${parseFloat(
                        this.state.totalFee,
                      )} BNB`
                      : (
                        parseFloat(this.state.amount) +
                        parseFloat(this.state.totalFee)
                      ).toFixed(8)
                  }
                  // fiatValue={walletData?.currency_symbol + (parseFloat(totalFee)).toFixed(2)}
                  // fiatValue={((parseFloat(this.state.amount) + parseFloat(this.state.totalFee)).toFixed(8) * this.state.walletData?.perPrice_in_fiat)}
                  fiatValue={
                    this.state.walletData?.is_token == 1
                      ? Singleton.getInstance().toFixed(
                        exponentialToDecimalWithoutComma(
                          parseFloat(this.state.amount) *
                          this.state.walletData?.perPrice_in_fiat +
                          parseFloat(this.state.totalFee) *
                          this.state.walletData?.native_perPrice_in_fiat,
                        ),
                        2,
                      )
                      : Singleton.getInstance().toFixed(
                        exponentialToDecimalWithoutComma(
                          (parseFloat(this.state.amount) +
                            parseFloat(this.state.totalFee)) *
                          this.state.walletData?.perPrice_in_fiat,
                        ),
                        2,
                      )
                  }
                  fiatSymbol={Singleton.getInstance().CurrencySymbol}
                  symbol={
                    this.state.walletData?.is_token == 1
                      ? ''
                      : this.state.walletData?.coin_symbol.toUpperCase()
                  }
                  bottomLine={false}
                />
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
                Actions.AddNewContacts({
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
})(SendBNB);
