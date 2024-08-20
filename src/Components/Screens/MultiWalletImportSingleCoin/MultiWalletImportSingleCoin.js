/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import Clipboard from '@react-native-community/clipboard';
import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import {
  MultiWallet_create,
  multiWalletFormUpdate,
} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import { Colors, Fonts } from '../../../theme';
import {
  // ImageBackgroundComponent,
  BasicButton,
  MainStatusBar,
  Wrap
} from '../../common';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import Loader from '../Loader/Loader';
import styles from './MultiWalletImportSingleCoinStyle';
import * as Constants from '../../../Constant';
const windowHeight = Dimensions.get('window').height;

class MultiWalletImportSingleCoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonicsEnable: true,
      pvtKeyEnable: false,
      pvtKey: '',
    };
  }
  componentDidMount() {
    //console.warn('MM','ppppp coin_symbol', this.props.route?.params.coin_symbol);
    this.props.multiWalletFormUpdate({ prop: 'multiWalletName', value: '' });
    this.props.multiWalletFormUpdate({ prop: 'importMnemonics', value: '' });
  }

  async nextAction() {
    if (this.props.multiWalletName.length == 0) {
      Singleton.showAlert(constants.VALID_WALLET_NAME);
      this.setState({ isLoading: false });
      return;
    }
    if (
      this.props.multiWalletName.trim().length < 3 &&
      this.props.multiWalletName.length != 0
    ) {
      Singleton.showAlert(constants.VALID_NAME);
      this.setState({ isLoading: false });
      return;
    }
    let multiWalletData = JSON.parse(
      await Singleton.getInstance().newGetData(constants.multi_wallet_array),
    );
    let isNameExist = multiWalletData.filter(
      item =>
        item?.walletName?.trim()?.toLowerCase() ==
        this.props.multiWalletName?.trim()?.toLowerCase(),
    );

    if (isNameExist?.length > 0) {
      Singleton.showAlert(constants.wallet_name_already_exist);
      this.setState({ isLoading: false });
      return;
    }

    if (
      this.props.importMnemonics.trim() == '' &&
      this.state.mnemonicsEnable == true
    ) {
      Singleton.showAlert(constants.VALID_MNEMONICS);
      this.setState({ isLoading: false });
      return;
    }
    if (this.state.pvtKey.trim() == '' && this.state.mnemonicsEnable == false) {
      Singleton.showAlert(constants.VALID_PVTKEY);
      this.setState({ isLoading: false });
      return;
    } else {
      if (this.state.mnemonicsEnable == true) {
        const mnemonics = this.props.importMnemonics.replace(/ +(?= )/g, '');
        var mnemonicsArray = mnemonics.toLowerCase().trim();
        setTimeout(() => {
          // Singleton.getInstance().validateMnemonics(mnemonicsArray).then(res => {
          Singleton.getInstance()
            .importWallet(mnemonicsArray)
            .then(res => {
              console.warn('MM', 'response import wallet-- imp', res);
              Singleton.getInstance()
                .newGetData(constants.multi_wallet_array)
                .then(multiWalletArray => {
                  var array = JSON.parse(multiWalletArray);
                  let addressToCheck = this.props.route?.params.coin_symbol.toLowerCase() == (Constants.COIN_SYMBOL.ETH || 'matic' || 'bnb' || 'stc') ? res.ethAddress : this.props.route?.params.coin_symbol.toLowerCase() == ('btc') ? res.btcAddress : res.trxAddress
                  const isExistArray = array.filter(item => {
                    console.log("addressToCheck::", addressToCheck);
                   let isExistInside =  item.loginRequest.wallet_addresses.find(
                      o => {
                        if ((o.wallet_address == addressToCheck &&
                          this.props.route?.params.coin_symbol.toLowerCase() == o.coin_symbol)) {
                          console.log("item:::", item);
                          return item
                        }
                      }
                    );
                    return isExistInside
                  });
                  console.log("isExistArray::::", isExistArray);
                  const isExist = isExistArray.find(item => {
                    return this.props.route?.params.coin_symbol.toLowerCase() == item.blockChain

                  });
                  console.log("isExist::", isExist);
                  // const isExist = array.find(itemAddress => array.find(item => item.loginRequest.wallet_addresses.find(item1 => item1.wallet_address == itemAddress.wallet_address && this.props.route?.params.coin_symbol.toLowerCase() == item1.coin_symbol)))
                  if (isExist) {
                    console.log("isExist::", isExist);
                    Singleton.showAlert(constants.wallet_already_exist);
                    this.setState({ isLoading: false });
                    return;
                  } else if (!isExist) {
                    this.props.multiWalletFormUpdate({
                      prop: 'multiWalletData',
                      value: res,
                    });
                    let wallet_addresses = [
                      {
                        coin_symbol: this.props.route?.params.coin_symbol,
                        wallet_address:
                          this.props.route?.params.coin_symbol == Constants.COIN_SYMBOL.ETH
                            ? res.ethAddress
                            : this.props.route?.params.coin_symbol == 'trx'
                              ? res.trxAddress
                              : this.props.route?.params.coin_symbol == 'sol'
                                ? res.solAddress
                                : this.props.route?.params.coin_symbol == 'bnb'
                                  ? res.ethAddress
                                  : this.props.route?.params.coin_symbol == 'btc'
                                    ? res.btcAddress
                                    : this.props.route?.params.coin_symbol == 'stc'
                                    ? res.ethAddress
                                    : res.ethAddress,
                      },
                    ];
                    let data = {
                      address:
                        this.props.route?.params.coin_symbol == Constants.COIN_SYMBOL.ETH
                          ? res.ethAddress
                          : this.props.route?.params.coin_symbol == 'trx'
                            ? res.trxAddress
                            : this.props.route?.params.coin_symbol == 'sol'
                              ? res.solAddress
                              : this.props.route?.params.coin_symbol == 'bnb'
                                ? res.ethAddress
                                : this.props.route?.params.coin_symbol == 'btc'
                                  ? res.btcAddress
                                  : this.props.route?.params.coin_symbol == 'stc'
                                  ? res.ethAddress
                                  : res.ethAddress,
                      addresses: [
                        this.props.route?.params.coin_symbol == Constants.COIN_SYMBOL.ETH
                          ? res.ethAddress
                          : this.props.route?.params.coin_symbol == 'trx'
                            ? res.trxAddress
                            : this.props.route?.params.coin_symbol == 'sol'
                              ? res.solAddress
                              : this.props.route?.params.coin_symbol == 'bnb'
                                ? res.ethAddress
                                : this.props.route?.params.coin_symbol == 'btc'
                                  ? res.btcAddress
                                  : this.props.route?.params.coin_symbol == 'stc'
                                  ? res.ethAddress
                                  : res.ethAddress,
                      ],
                      btcAddress:
                        this.props.route?.params.coin_symbol == 'btc' ? res.btcAddress : '',
                      trxAddress:
                        this.props.route?.params.coin_symbol == 'trx' ? res.trxAddress : '',
                      wallet_addresses: wallet_addresses,
                      wallet_name: this.props.multiWalletName,
                      walletName: this.props.multiWalletName,
                      device_token: Singleton.getInstance().device_token,
                    };
                    this.setState({ isLoading: true });
                    this.props
                      .MultiWallet_create({ data })
                      .then(response => {
                        let WalletData = {
                          walletName: this.props.multiWalletName,
                          mnemonics: res.mnemonics,
                          loginRequest: data,
                          defaultWallet: false,
                          user_jwtToken: response.data?.token,
                          blockChain: this.props.route?.params.coin_symbol,
                          refreshToken: response?.data?.refreshToken,
                        };
                        let multiWalletArray = [];
                        Singleton.getInstance()
                          .newGetData(constants.multi_wallet_array)
                          .then(multi_wallet_array => {
                            multiWalletArray = JSON.parse(multi_wallet_array);
                            multiWalletArray.push(WalletData);
                            Singleton.getInstance().newSaveData(
                              constants.multi_wallet_array,
                              JSON.stringify(multiWalletArray),
                            );
                            getCurrentRouteName() != 'MultiWalletList' &&
                            navigate(NavigationStrings.MultiWalletList);
                            this.setState({ isLoading: false });
                          })
                          .catch(err => {
                            Singleton.showAlert(err);
                          });
                      })
                      .catch(error => {
                        this.setState({ isLoading: false });
                        Singleton.showAlert(error.message);
                      });
                  }
                })
                .catch(error => {
                  this.setState({ isLoading: false });
                  Singleton.showAlert(error);
                });
            })
            .catch(error => {
              this.setState({ isLoading: false });
              Singleton.showAlert('Invalid Mnemonics');
            });
        }, 200);
      } else if (this.state.mnemonicsEnable == false) {
        this.setState({ pvtKey: this.state.pvtKey.trim() });
        if (this.props.route?.params.coin_symbol.toLowerCase() == Constants.COIN_SYMBOL.ETH) {
          const { address, error } =
            Singleton.getInstance().getEthAddressFromPrivateKey(
              this.state.pvtKey,
            );
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
        if (this.props.route?.params.coin_symbol.toLowerCase() == 'matic') {
          const { address, error } =
            Singleton.getInstance().getEthAddressFromPrivateKey(
              this.state.pvtKey,
            );
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
        if (this.props.route?.params.coin_symbol.toLowerCase() == 'stc') {
          const { address, error } =
            Singleton.getInstance().getEthAddressFromPrivateKey(
              this.state.pvtKey,
            );
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
        if (this.props.route?.params.coin_symbol.toLowerCase() == 'btc') {
          const { address, error } =
            Singleton.getInstance().getBtcAddressFromPrivateKey(
              this.state.pvtKey,
            );
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
        if (this.props.route?.params.coin_symbol.toLowerCase() == 'trx') {
          const { address, error } =
            Singleton.getInstance().getTronAddressFromPvtKey(this.state.pvtKey);
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
        if (this.props.route?.params.coin_symbol.toLowerCase() == 'bch') {
          const { address, error } =
            Singleton.getInstance().getBchAddressFromPrivateKey(
              this.state.pvtKey,
            );
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
        if (this.props.route?.params.coin_symbol.toLowerCase() == 'ltc') {
          const { address, error } =
            Singleton.getInstance().getLtcAddressFromPrivateKey(
              this.state.pvtKey,
            );
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
        if (this.props.route?.params.coin_symbol.toLowerCase() == 'bnb') {
          const { address, error } =
            Singleton.getInstance().getEthAddressFromPrivateKey(
              this.state.pvtKey,
            );
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
        if (this.props.route?.params.coin_symbol.toLowerCase() == 'xtz') {
          const { address, error } =
            await Singleton.getInstance().getXtzAddressFromPrivateKey(
              this.state.pvtKey,
            );
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
        if (this.props.route?.params.coin_symbol.toLowerCase() == 'doge') {
          const { address, error } =
            Singleton.getInstance().getDogeAddressFromPrivateKey(
              this.state.pvtKey,
            );
          if (error != '') {
            Singleton.showAlert(error);
            this.setState({ isLoading: false });
            return;
          } else {
            this.importUsingPvtKey(
              this.props.route?.params.coin_symbol.toLowerCase(),
              address,
            );
          }
        }
      }
    }
  }

  importUsingPvtKey(coinSymbol, address) {
    if (!address) {
      Singleton.showAlert('Invalid Private Key');
      this.setState({ isLoading: false });
      return;
    }

    Singleton.getInstance()
      .newGetData(constants.multi_wallet_array)
      .then(multiWalletArray => {
        var array = JSON.parse(multiWalletArray);

        //   const isExist = array.find(item => item.loginRequest.address == address,);
        const isExist = array.find(
          item =>
            item?.blockChain != 'all' &&
            item.loginRequest.wallet_addresses.find(o => {
              return (
                o.wallet_address?.toLowerCase() == address?.toLowerCase() &&
                coinSymbol.toLowerCase() == o.coin_symbol
              );
            }),
        );

        if (isExist) {
          Singleton.showAlert(constants.wallet_already_exist);
          this.setState({ isLoading: false });
          return;
        } else if (!isExist) {
          let wallet_addresses = [
            {
              coin_symbol: coinSymbol,
              wallet_address: address,
            },
          ];

          let data = {
            address: address,
            wallet_addresses: wallet_addresses,
            wallet_name: this.props.multiWalletName,
            device_token: Singleton.getInstance().device_token,
          };

          this.setState({ isLoading: true });
          this.props
            .MultiWallet_create({ data })
            .then(response => {
              console.warn('MM', 'wallet imported response--- ', response);
              let newData = {};
              // if (coinSymbol == 'btc') {
              newData = {
                address: address,
                btcAddress: coinSymbol == 'btc' ? address : '',
                trxAddress: coinSymbol == 'trx' ? address : '',
                addresses: [address],
                wallet_addresses: wallet_addresses,
                wallet_name: this.props.multiWalletName,
                walletName: this.props.multiWalletName,
                device_token: Singleton.getInstance().device_token,
              };
              // } else {
              // newData = {
              // address: address,
              // addresses: [address],
              // wallet_addresses: wallet_addresses,
              // wallet_name: this.props.multiWalletName,
              // device_token: Singleton.getInstance().device_token,
              // };
              // }

              let WalletData = {
                walletName: this.props.multiWalletName,
                // mnemonics: this.state.pvtKey,
                mnemonics: '',
                loginRequest: newData,
                defaultWallet: false,
                user_jwtToken: response.data?.token,
                refreshToken: response.data?.refreshToken,
                privateKey: this.state.pvtKey,
                blockChain: this.props.route?.params.coin_symbol,
              };
              let multiWalletArray = [];
              Singleton.getInstance()
                .newGetData(constants.multi_wallet_array)
                .then(multi_wallet_array => {
                  multiWalletArray = JSON.parse(multi_wallet_array);
                  multiWalletArray.push(WalletData);
                  Singleton.getInstance().newSaveData(
                    constants.multi_wallet_array,
                    JSON.stringify(multiWalletArray),
                  );
                  navigate(NavigationStrings.MultiWalletList);
                  this.setState({ isLoading: false });
                })
                .catch(err => {
                  Singleton.showAlert(err);
                });
            })
            .catch(error => {
              this.setState({ isLoading: false });
              Singleton.showAlert(error.message);
            });
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        Singleton.showAlert(error);
      });
  }

  async fetchCopiedText() {
    const text = await Clipboard.getString();
    //console.warn('MM','copiedText', text);
    if (this.state.mnemonicsEnable) {
      this.props.multiWalletFormUpdate({
        prop: 'importMnemonics',
        value: text,
      });
    } else {
      if (text.includes?.(' ')) {
        Singleton.showAlert('Please enter valid private key.');
      } else {
        this.setState({ pvtKey: text });
      }
    }
    // this.state.mnemonicsEnable == true
    //   ? this.props.multiWalletFormUpdate({
    //       prop: 'importMnemonics',
    //       value: text,
    //     })
    //   : this.setState({pvtKey: text});
  }

  render() {
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <MainStatusBar
            backgroundColor={ThemeManager.colors.bg}
            barStyle={
              ThemeManager.colors.themeColor === 'light'
                ? 'dark-content'
                : 'light-content'
            }
          />
          {/* <ImageBackgroundComponent
            style={{ height: '100%' }}> */}
          <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />

          <ScrollView
            keyboardShouldPersistTaps="always"
            bounces={false}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
            }}>
            <View style={{}}>
              <Text
                style={[
                  styles.styleLabelHeader,
                  { color: ThemeManager.colors.headingText },
                ]}>
                {`${LanguageManager.Import}` +
                  ' ' +
                  `${LanguageManager.Wallet}`}
              </Text>
              <View style={styles.descriptionWrapStyle}>
                <Text
                  style={[
                    styles.descriptionTextStyle,
                    { color: ThemeManager.colors.lightTextColor },
                  ]}>
                  {LanguageManager.pasteText}
                </Text>
              </View>
              <View
                style={[
                  styles.textInputView,
                  {
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                    borderColor: ThemeManager.colors.borderColorNew,
                    borderWidth: ThemeManager.colors.themeColor == 'dark' ? 0 : 1,
                  },
                ]}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      color: ThemeManager.colors.textColor,

                    },
                  ]}
                  placeholder={'Enter a name for your wallet'}
                  placeholderTextColor={Colors.lightGrey3}
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  value={this.props.multiWalletName}
                  maxLength={20}
                  onChangeText={text => {
                    if (text?.charAt(0) == ' ') {
                      return;
                    }
                    if (text != '') {
                      if (constants.NEW_NAME_REGX.test(text)) {
                        this.props.multiWalletFormUpdate({
                          prop: 'multiWalletName',
                          value: text,
                        });
                      } else {
                        Singleton.showAlert(
                          'Please enter valid name. Only Alphabets, numbers and spaces are allowed',
                        );
                      }
                    } else {
                      this.props.multiWalletFormUpdate({
                        prop: 'multiWalletName',
                        value: text,
                      });
                    }
                  }}
                />
              </View>

              <Text
                style={[
                  styles.headerRow__title,
                  { color: ThemeManager.colors.textColor },
                ]}>
                Import your wallet using
              </Text>
              <View style={styles.viewStyle}>
                {this.props.route?.params.coin_symbol.toLowerCase() != 'dot' &&
                  this.props.route?.params.coin_symbol.toLowerCase() != 'ksm' && (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          mnemonicsEnable: true,
                          pvtKeyEnable: false,
                        })
                      }
                      style={
                        this.state.pvtKeyEnable == false &&
                          this.state.mnemonicsEnable == true
                          ? styles.enableStyle
                          : [styles.disableStyle]
                      }>
                      <LinearGradient
                        colors={
                          this.state.pvtKeyEnable == false &&
                            this.state.mnemonicsEnable == true
                            ? [Colors.buttonColor1, Colors.buttonColor2]
                            : [ThemeManager.colors.lightButton, ThemeManager.colors.lightButton]
                        }
                        style={{
                          // width: '80%',
                          height: heightDimen(50),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: heightDimen(25),
                          flexDirection: 'row',
                        }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <Text
                          style={
                            this.state.mnemonicsEnable == true &&
                              this.state.pvtKeyEnable == false
                              ? styles.textStyleEnable
                              : [styles.textStyleDisable, { color: ThemeManager.colors.textColor }]
                          }>
                          Mnemonics
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                {this.props.route?.params.coin_symbol.toLowerCase() != 'dot' &&
                  this.props.route?.params.coin_symbol.toLowerCase() != 'ksm' && (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          mnemonicsEnable: false,
                          pvtKeyEnable: true,
                        })
                      }
                      style={
                        this.state.pvtKeyEnable == true &&
                          this.state.mnemonicsEnable == false
                          ? styles.enableStyle
                          : [styles.disableStyle]
                      }>
                      <LinearGradient
                        colors={
                          this.state.pvtKeyEnable == true &&
                            this.state.mnemonicsEnable == false
                            ? [Colors.buttonColor1, Colors.buttonColor2]
                            : [ThemeManager.colors.lightButton, ThemeManager.colors.lightButton]
                        }
                        style={{
                          // width: '80%',
                          height: heightDimen(50),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: heightDimen(25),
                          flexDirection: 'row',
                        }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <Text
                          style={
                            this.state.pvtKeyEnable == true &&
                              this.state.mnemonicsEnable == false
                              ? styles.textStyleEnable
                              : [styles.textStyleDisable, { color: ThemeManager.colors.textColor }]
                          }>
                          Private Key
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
              </View>

              <View
                style={{
                  borderWidth: 1,
                  // borderColor: colors.borderColorLang,
                  borderColor: ThemeManager.colors.viewBorderColor,
                  minHeight: heightDimen(126),
                  width: '88%',
                  alignSelf: 'center',
                  marginTop:
                    this.props.isFrom == 'multiWallet'
                      ? heightDimen(15)
                      : heightDimen(20),
                  borderRadius: heightDimen(6),
                }}>
                <TextInput
                  style={{
                    paddingTop: heightDimen(16),
                    width: '90%',
                    color: ThemeManager.colors.textColor,
                    alignSelf: 'center',
                    fontSize: areaDimen(14),
                    fontFamily: Fonts.medium,
                    // opacity: 0.8,
                  }}
                  multiline={true}
                  placeholderTextColor={Colors.lightGrey3}
                  onChangeText={text => {
                    if (this.state.mnemonicsEnable == true) {
                      console.log('text==', text);
                      if (text != '') {
                        if (!constants.NEW_NAME_REGX.test(text)) {
                          Singleton.showAlert('Only Alphabets are allowed');
                          return;
                        } else {
                          if (text?.trim()?.split(' ')?.length > 24) {
                            Singleton.showAlert(
                              "Please ensure that you've entered the correct Recovery Phrase.",
                            );
                            return;
                          }
                        }
                      }
                    } else {
                      if (!/^[a-zA-Z0-9]*$/.test(text)) {
                        Singleton.showAlert('Please enter valid private key.');
                        return;
                      }
                    }

                    this.state.mnemonicsEnable == true
                      ? this.props.multiWalletFormUpdate({
                        prop: 'importMnemonics',
                        value: text,
                      })
                      : this.setState({ pvtKey: text });
                  }}
                  placeholder={
                    this.state.mnemonicsEnable == true
                      ? LanguageManager.enterPhrase
                      : 'Enter Private Key here'
                  }
                  value={
                    this.state.mnemonicsEnable == true
                      ? this.props.importMnemonics
                      : this.state.pvtKey
                  }
                />

                <Text
                  onPress={() => this.fetchCopiedText()}
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    alignSelf: 'flex-end',
                    paddingHorizontal: 15,
                    zIndex: 1,
                    fontSize: areaDimen(14),
                    fontFamily: Fonts.semibold,
                    color: ThemeManager.colors.headingText,
                  }}>
                  Paste
                </Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    this.fetchCopiedText();
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    alignSelf: 'flex-end',
                    paddingHorizontal: 15,
                    backgroundColor: 'red', width: 15, height: 15,
                    zIndex: 100000
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: Fonts.semibold,
                      color: ThemeManager.colors.mnemonicsSelectedText,
                    }}>
                    Paste
                  </Text>
                </TouchableOpacity> */}
              </View>

              {/* <View>
                <TextInput
                  style={styles.inputStyle}
                  placeholder={
                    this.state.mnemonicsEnable == true
                      ? 'Enter Recovery Phrase here'
                      : 'Enter Private Key here'
                  }
                  value={
                    this.state.mnemonicsEnable == true
                      ? this.props.importMnemonics
                      : this.state.pvtKey
                  }
                  onChangeText={text => {
                    this.state.mnemonicsEnable == true
                      ? this.props.multiWalletFormUpdate({
                          prop: 'importMnemonics',
                          value: text,
                        })
                      : this.setState({pvtKey: text});
                  }}
                  placeholderTextColor={Colors.darkFade}
                  multiline
                />
              </View> */}
            </View>
            <View
              style={[
                {
                  justifyContent: 'flex-end',
                  // flex: 1,
                  // ...ifIphoneX(
                  //   {
                  //     marginTop: -120,
                  //   },
                  //   {
                  //     marginBottom: 40,
                  //   },
                  // ),
                },
              ]}>
              <BasicButton
                onPress={() => {
                  this.setState({ isLoading: true }, () => {
                    setTimeout(() => {
                      this.nextAction();
                    }, 200);
                  });
                }}
                btnStyle={styles.btnStyle}
                customGradient={styles.customGrad}
                text={LanguageManager.proceed}
              />
            </View>
          </ScrollView>

          {this.state.isLoading && (
            <Loader text={'Generating Wallet Addresses...'} color="white" />
          )}
          {/* </ImageBackgroundComponent> */}
        </Wrap>
        {/* <SafeAreaView style={{ backgroundColor: Colors.screenBg }}></SafeAreaView> */}
      </>
    );
  }
}

const mapStateToProp = state => {
  const { importMnemonics, multiWalletName, multiWalletData } =
    state.MultiWalletCreateWalletReducer;
  return { importMnemonics, multiWalletName, multiWalletData };
};

export default connect(mapStateToProp, {
  multiWalletFormUpdate,
  MultiWallet_create,
})(MultiWalletImportSingleCoin);
