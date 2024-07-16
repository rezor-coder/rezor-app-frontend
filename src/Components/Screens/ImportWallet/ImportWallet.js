/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Clipboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { createWallet } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { goBack, navigate } from '../../../navigationsService';
import colors from '../../../theme/Colors';
import fonts from '../../../theme/Fonts';
import {
  BasicButton,
  MainStatusBar,
} from '../../common';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import { Wrap } from '../../common/Wrap';
import Loader from '../Loader/Loader';
const ImportWallet = props => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [name, setName] = useState('');
  const [copiedText, setCopiedText] = useState('');

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    if (text?.split(' ')?.length <= 24) {
      setCopiedText(text);
    } else {
      Singleton.showAlert(
        "Please ensure that you've entered the correct Recovery Phrase.",
      );
      return;
    }
  };
  const onScreenFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
  };
  const onScreenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', backAction);
  };

  const backAction = () => {
    goBack();
    return true;
  };

  useEffect(() => {
    props.navigation.addListener('focus', onScreenFocus);
    props.navigation.addListener('blur', onScreenBlur);
  });

  const nextAction = async () => {
    console.log('nextAction::::', nextAction);
    if (props?.route?.params?.isFrom == 'multiWallet') {
      if (name.length < 3) {
        Singleton.showAlert(constants.VALID_NAME);
        return;
      }
      let multiWalletData = JSON.parse(
        await Singleton.getInstance().newGetData(constants.multi_wallet_array),
      );
      let isNameExist = multiWalletData.filter(
        item =>
          item?.walletName?.trim()?.toLowerCase() ==
          name?.trim()?.toLowerCase(),
      );

      if (isNameExist?.length > 0) {
        Singleton.showAlert(constants.wallet_name_already_exist);
        return;
      }
    }
    if (copiedText.length == 0) {
      Singleton.showAlert(constants.VALID_MNEMONICS);
      return;
    } else {
      if (props?.route?.params?.isFrom == 'multiWallet') {
        console.log('multiWallet');
        if (name.length < 3) {
          Singleton.showAlert(constants.VALID_NAME);
        } else {
          Singleton.getInstance()
            .newGetData(constants.multi_wallet_array)
            .then(res => {
              let data = JSON.parse(res);
              let b = data.filter(
                item => (item.mnemonics == copiedText.trim() && item?.blockChain=='all'),
              );
              console.log(copiedText, b);
              console.log('copiedText:::::', copiedText, b,res);
              setTimeout(() => {
                (b.length > 0 && b[0]?.blockChain=='all')
                  ? Singleton.showAlert(constants.WALLET_ALREADY_EXIST)
                  : importWallet(data);
              }, 100);
            });
        }
      } else {
        importWallet([]);
      }
    }
  };
  function importWallet(existingWallets) {
    setisLoading(true);
    const mnemonics = copiedText.replace(/ +(?= )/g, '');
    var mnemonicsArray = mnemonics.toLowerCase().trim();
    setTimeout(() => {
      Singleton.getInstance()
        .importWallet(mnemonicsArray)
        .then(res => {
          let wallet_addresses = [
            {
              coin_symbol: 'eth',
              wallet_address: res?.ethAddress,
            },
            {
            coin_symbol: 'bnb',
              wallet_address: res?.ethAddress,
            },
            {
              coin_symbol: 'stc',
              wallet_address: res?.ethAddress,
            },
            // {
            //   coin_symbol: 'btc',
            //  wallet_address: res?.btcAddress,
            //  },
            {
              coin_symbol: 'matic',
              wallet_address: res?.ethAddress,
            },
            {
              coin_symbol: 'trx',
              wallet_address: res?.trxAddress,
            },
          ];
          let address = res.ethAddress;
          let wallet_name = props?.route?.params?.isFrom == 'multiWallet' ? name : 'Basic';
          let device_token = Singleton.getInstance().device_token;
          dispatch(
            createWallet({
              address,
              wallet_addresses,
              wallet_name,
              device_token,
            }),
          )
            .then(response => {
              if (!response?.status) {
                setisLoading(false);
                Singleton.showAlert(
                  response?.message || constants.SOMETHING_WRONG,
                );
                return;
              }
              let data = {
                btcAddress: res.btcAddress,
                trxAddress: res.trxAddress,
                address: res.ethAddress,
                addresses: [res.ethAddress, res.btcAddress, res.trxAddress],
                // addresses: [res.ethAddress,  res.trxAddress],
                wallet_addresses: wallet_addresses,
                walletName: props?.route?.params?.isFrom == 'multiWallet' ? name : 'Basic',
                device_token: device_token,
              };
              let login_data = {
                access_token: response.data.token,
                defaultEthAddress: res.ethAddress,
                defaultBnbAddress: res.ethAddress,
                defaultMaticAddress: res.ethAddress,
                defaultStcAddress: res.ethAddress,
                defaultBtcAddress: res.btcAddress,
                defaultTrxAddress: res.trxAddress,
                walletName: props.route?.params?.isFrom == 'multiWallet' ? name : 'Basic',
              };
              let addrsListKeys = [
                res.ethAddress,
                res.btcAddress,
                res.trxAddress,
              ];
               let coinFamilyKeys = [1, 2, 6, 11, 3,4];
             // let coinFamilyKeys = [1,  6, 11, 3,4];
              let WalletData = {
                walletName: props.route?.params?.isFrom == 'multiWallet' ? name : 'Basic',
                mnemonics: res.mnemonics,
                loginRequest: data,
                defaultWallet: props.route?.params?.isFrom == 'multiWallet' ? false : true,
                user_jwtToken: response.data?.token,
                refreshToken: response?.data?.refreshToken,
                blockChain: 'all',
                login_data,
              };
              let Wallet_Array = existingWallets;
              if (props?.route?.params?.isFrom != 'multiWallet') {
                Singleton.getInstance().newSaveData(
                  constants.addresKeyList,
                  JSON.stringify(addrsListKeys),
                );
                Singleton.getInstance().newSaveData(
                  constants.login_data,
                  JSON.stringify(login_data),
                );
                Singleton.getInstance().newSaveData(
                  constants.coinFamilyKeys,
                  coinFamilyKeys,
                );
                Singleton.getInstance().newSaveData(
                  constants.access_token,
                  response.data.token,
                );
                Singleton.getInstance().newSaveData(
                  constants.refresh_token,
                  response.data?.refreshToken,
                );
                Singleton.getInstance().newSaveData(
                  constants.ACTIVE_WALLET,
                  JSON.stringify(WalletData),
                );
                Singleton.getInstance().newSaveData(
                  constants.IS_PRIVATE_WALLET,
                  '0',
                );
                Singleton.getInstance().access_token = response.data.token;
                Singleton.getInstance().defaultEthAddress = res.ethAddress;
                Singleton.getInstance().defaultMaticAddress = res.ethAddress;
                Singleton.getInstance().defaultBtcAddress = res.btcAddress;
                Singleton.getInstance().defaultBnbAddress = res.ethAddress;
                Singleton.getInstance().defaultTrxAddress = res.trxAddress;
                Singleton.getInstance().defaultStcAddress = res.ethAddress;
                Singleton.getInstance().walletName = 'Basic';
              }
              Singleton.getInstance().newSaveData(
                constants.UPDATE_ASYNC_KEY,
                'true',
              );
              Wallet_Array.push(WalletData);
              Singleton.getInstance().newSaveData(
                constants.multi_wallet_array,
                JSON.stringify(Wallet_Array),
              );

              setisLoading(false);
              if (props?.route?.params?.isFrom == 'multiWallet') {
                navigate(NavigationStrings.MultiWalletList);
              } else {
                navigate(NavigationStrings.Congrats);
              }
            })
            .catch(err => {
              setisLoading(false);
              Singleton.showAlert(
                err?.message || err || constants.SOMETHING_WRONG,
              );
            });
        })
        .catch(err => {
          //console.warn("MM",err);
          setisLoading(false);
          Singleton.showAlert('Invalid Mnemonics');
        });
      // })
      //   .catch(error => {
      //     setisLoading(false);
      //     Singleton.showAlert(error);
      //   });
    }, 200);
  }
  //console.warn('MM','-==========', props?.route?.params?.isFrom);
  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      {/* <ImageBackgroundComponent style={{ height: '100%' }}> */}
      <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        bounces={false}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
        style={{flex: 1}}>
        <View>
          {/* <SubHeader
            title={LanguageManager.Import}
            Subtitle={LanguageManager.Wallet}
            headerstyle={{ marginTop: 80 }}
          /> */}
          <Text
            style={[
              styles.styleLabelHeader,
              {color: ThemeManager.colors.headingText},
            ]}>
            {`${LanguageManager.Import}` + ' ' + `${LanguageManager.Wallet}`}
          </Text>
          <View style={styles.descriptionWrapStyle}>
            <Text
              style={[
                styles.descriptionTextStyle,
                {color: ThemeManager.colors.lightTextColor},
              ]}>
              {LanguageManager.pasteText}
            </Text>
          </View>

          {props?.route?.params?.isFrom == 'multiWallet' && (
            <>
              <Text style={[styles.txtNameWallet,{color:ThemeManager.colors.textColor}]}>{'Name your wallet'}</Text>
              <View
                style={[
                  styles.textInputView,
                  {
                    borderColor: ThemeManager.colors.viewBorderColor,
                    backgroundColor: 'transparent',
                  },
                ]}>
                <TextInput
                  style={[
                    styles.textInput,
                    {color: ThemeManager.colors.textColor},
                  ]}
                  placeholder={LanguageManager.NameWallet}
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  placeholderTextColor={colors.lightGrey3}
                  value={name}
                  maxLength={20}
                  onChangeText={text => {
                    if (text?.charAt(0) == ' ') {
                      return;
                    }
                    if (text != '') {
                      if (constants.NEW_NAME_REGX.test(text)) {
                        setName(text);
                      } else {
                        Singleton.showAlert(
                          'Please enter valid name. Only Alphabets, numbers and space are allowed',
                        );
                      }
                    } else {
                      setName(text);
                    }
                  }}
                />
              </View>
            </>
          )}

          <Text style={[styles.txtNameWallet,{color:ThemeManager.colors.textColor}]}>
            {LanguageManager.enterMnemonoics}
          </Text>
          <View
            style={{
              borderWidth: 1,
              // borderColor: colors.borderColorLang,
              borderColor: ThemeManager.colors.viewBorderColor,
              // backgroundColor: ThemeManager.colors.importView,
              height: heightDimen(130),
              width: '90%',
              marginHorizontal: widthDimen(22),
              alignSelf: 'center',
              marginTop:
                props?.route?.params?.isFrom == 'multiWallet' ? heightDimen(9) : heightDimen(8),
              borderRadius: heightDimen(6),
            }}>
            <TextInput
              style={{
                paddingTop: heightDimen(15),
                marginBottom: heightDimen(30),
                width: '88%',
                color: ThemeManager.colors.lightTextColor,
                alignSelf: 'center',
                fontSize: areaDimen(14),
                fontFamily: fonts.medium,
                // opacity: 0.8,
              }}
              multiline={true}
              placeholderTextColor={colors.lightGrey3}
              onChangeText={text => {

                if (text != '') {
                  if (constants.NEW_NAME_REGX.test(text)) {
                    if (text?.trim()?.split(' ')?.length <= 24) {
                      setCopiedText(text);
                      // dispatch(
                      //   walletFormUpdate({
                      //     prop: 'importMnemonics',
                      //     value: text,
                      //   }),
                      // );
                    } else {
                      Singleton.showAlert(
                        "Please ensure that you've entered the correct Recovery Phrase.",
                      );
                      return;
                    }
                  } else {
                    Singleton.showAlert(
                      'Please enter valid name. Only Alphabets, numbers and space are allowed',
                    );
                  }
                } else {
                  setCopiedText(text);
                }
              }}
              placeholder={LanguageManager.enterPhrase}
              value={copiedText}
            />

            <TouchableOpacity
              onPress={() => {
                fetchCopiedText();
              }}
              style={{
                position: 'absolute',
                bottom: heightDimen(15),
                alignSelf: 'flex-end',
                paddingHorizontal: widthDimen(24),
              }}>
              <Text
                style={{
                  fontSize: areaDimen(14),
                  fontFamily: fonts.semibold,
                  color: ThemeManager.colors.headingText,
                }}>
                Paste
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            {
              justifyContent: 'flex-end',
            },
          ]}>
          <BasicButton
            onPress={() => {
              nextAction();
            }}
            btnStyle={styles.btnStyle}
            customGradient={styles.customGrad}
            text={LanguageManager.proceed}></BasicButton>
        </View>
      </ScrollView>
      {isLoading && <Loader />}
    </Wrap>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    alignSelf: 'center',
    color: colors.fadetext,
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    // width: 300,
    alignSelf: 'center',
    paddingTop: 25,
  },
  textInputView: {
    borderWidth: 1,
    borderColor: colors.fadetext,
    marginTop: heightDimen(10),
    borderRadius: heightDimen(25),
    paddingHorizontal: widthDimen(24),
    fontFamily: fonts.regular,
    marginHorizontal: widthDimen(22),
  },
  textInput: {
    height: heightDimen(50),
    color: colors.white,
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    borderRadius: heightDimen(25),
  },
  textViewnew: {
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',
    paddingTop: 8,
    marginTop: 16,
  },

  styleLabelHeader: {
    // alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: areaDimen(30),
    fontFamily: fonts.semibold,
    color: ThemeManager.colors.textColor,
    marginTop: heightDimen(30),
    marginHorizontal: widthDimen(22),
  },
  descriptionWrapStyle: {
    alignItems: 'flex-start',
    marginHorizontal: widthDimen(22),
    marginTop: heightDimen(6),
  },
  descriptionTextStyle: {
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    textAlign: 'left',
    // opacity: 0.8,
    lineHeight: heightDimen(22),
  },

  txtNameWallet: {
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    marginTop: heightDimen(20),
    alignSelf: 'flex-start',
    paddingHorizontal: widthDimen(22),
  },

  btnStyle: {
    width: '100%',
    height: heightDimen(60),
    marginTop: heightDimen(35),
    paddingHorizontal: widthDimen(22),
    marginBottom: heightDimen(30),
  },

  customGrad: {
    borderRadius: heightDimen(30),
  },
});

export default ImportWallet;
