import JailMonkey from 'jail-monkey';
import React, { useEffect } from 'react';
import { Alert, BackHandler, Image, SafeAreaView, Text, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { EventRegister } from 'react-native-event-listeners';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { createWallet, } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, navigate, reset } from '../../../navigationsService';
import { Fonts } from '../../../theme';
import images from '../../../theme/Images';
import { storageKeys } from '../../../utils';
import { MainStatusBar } from '../../common';

let buildNumber = DeviceInfo.getVersion();
const Splash = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTheme()
    updateKeys();
    updateSTCKeys();
  }, []);
  const setTheme = async () => {
    console.log("settheme called");
    Singleton.getInstance()
      .newGetData(Constants.CURRENT_THEME_MODE)
      .then(async res => {
        console.log("res::::", res);
        var val = 'theme1';
        let themeMode = '1'
        if (!res) {
          val = 'theme1'
          themeMode = '1'
        } else if (res == '0') {
          val = 'theme2';
          themeMode = '0'
        } else if (res == '1') {
          val = 'theme1';
          themeMode = '1'
        }
        global.bgColor=val=='theme2'? '#fff' :'#212121';
        EventRegister.emit('themeChanged',val)
        ThemeManager.setLanguage(val);
        if (JailMonkey.isJailBroken() && !__DEV__) {
          return showAlert(LanguageManager.youCantProceed);
        }

      });
  }
  const updateKeys = () => {
    let getData = Singleton.getInstance().getData;
    let newGetData = Singleton.getInstance().newGetData;
    let newSaveData = Singleton.getInstance().newSaveData;

    getData(Constants.access_token).then(access_token => {
      if (access_token) {
        newGetData(Constants.UPDATE_ASYNC_KEY).then(async update_async => {
          if (update_async != 'true') {
            getData(Constants.multi_wallet_array)
              .then(async res => {
                let multiWalletData = JSON.parse(res);
                let newMultiWalletData = [];
                let activeWallet = {};
                for (let i = 0; i < multiWalletData.length; i++) {
                  let element = multiWalletData[i];
                  let loginRequest = element?.loginRequest;
                  //console.warn("MM",'loginRequest ', element);

                  getData(loginRequest?.address).then(mnemo => {
                    if (mnemo != null)
                      newSaveData(loginRequest?.address?.toString(), mnemo);
                  });
                  getData(loginRequest?.address + '_pk').then(priv =>
                    newSaveData(loginRequest?.address + '_pk', priv),
                  );
                  // element['addresses'] = [loginRequest?.address];
                  newMultiWalletData.push(element);
                  if (element?.defaultWallet) {
                    activeWallet = element;
                  }
                }
                await newSaveData(
                  Constants.multi_wallet_array,
                  JSON.stringify(newMultiWalletData),
                );
                await newSaveData(
                  Constants.ACTIVE_WALLET,
                  JSON.stringify(activeWallet),
                );

                storageKeys.map((item, index) => {
                  getData(item).then(res => {
                    newSaveData(item, res?.toString());
                  });
                });
                importWallet();
                // done... data transfer
              })
              .catch(err => {
                console.warn('MM', 'error ', err);
              });
          } else {

            let refreshToken = await newGetData(Constants.refresh_token)
            if (!refreshToken) {
              importWallet()
            } else {
              loginCheckNew();
            }
          }
        });
      } else {
        Singleton.getInstance().newSaveData(Constants.UPDATE_ASYNC_KEY, 'true');
        loginCheckNew();
      }
    });
  };
  const updateSTCKeys = () => {
    let newGetData = Singleton.getInstance().newGetData;
    let newSaveData = Singleton.getInstance().newSaveData;
    newGetData(Constants.UPDATE_STC_ASYNC_KEY).then(async update_async => {
      // Alert.alert('update_async'+update_async+buildNumber)
      if (update_async != 'true') {
        // Alert.alert('update_async logged'+buildNumber)
        newGetData(Constants.coinFamilyKeys).then(async res => {
          console.log("JSON", res,typeof res );
          // let coinFamilyKeys = res?.split(',')
       
          let coinFamilyKeys =  ["1", "2", "6", "11", "3"]
          console.log("coinFamilyKeys", coinFamilyKeys ,coinFamilyKeys?.length);
          console.log("coinFamilyKeys  1",coinFamilyKeys);
          // Alert.alert('coinFamilyKeys'+coinFamilyKeys)
          if (coinFamilyKeys?.length > 1) {
            if (!coinFamilyKeys?.toString()?.includes('4')) {
              coinFamilyKeys = [1, 2, 6, 11, 3, 4]
            }
          }
          console.log("coinFamilyKeys  11",coinFamilyKeys,typeof coinFamilyKeys);
         await newSaveData(Constants.coinFamilyKeys,coinFamilyKeys)
        //  Alert.alert('Update'+coinFamilyKeys)
         await newSaveData(Constants.UPDATE_STC_ASYNC_KEY,'true')
        })
      }
    });
  };
  const importWallet = async () => {
    let activeWallet = JSON.parse(await Singleton.getInstance().newGetData(
      Constants.ACTIVE_WALLET,
    ))
    let newMultiWalletData = JSON.parse(await Singleton.getInstance().newGetData(
      Constants.multi_wallet_array,
    ))
    if (activeWallet?.loginRequest?.addresses) {
      loginCheckNew();
      return;
    }

    // started creating wallet here....
    let mnemonics = '';
    let privateKey = '';
    let blockChain = activeWallet?.blockChain;

    if (activeWallet?.privateKey) {
      privateKey = activeWallet?.privateKey;
    } else {
      mnemonics = await Singleton.getInstance().getData(activeWallet?.loginRequest?.address);
    }
    if (blockChain == 'all') {

      // create btc and api hit

      Singleton.getInstance()
        .importWallet(mnemonics, true)
        .then(res1 => {
          let res = {
            ...res1,
            ethAddress: activeWallet?.loginRequest?.address
          }
          let wallet_addresses = [
            {
              coin_symbol: Constants.COIN_SYMBOL.ETH,
              wallet_address: res?.ethAddress,
            },
            {
              coin_symbol: Constants.COIN_SYMBOL.STC,
              wallet_address: res?.ethAddress,
            },
            {
              coin_symbol: Constants.COIN_SYMBOL.BNB,
              wallet_address: res?.ethAddress,
            },
            {
              coin_symbol: Constants.COIN_SYMBOL.BTC,
              wallet_address: res?.btcAddress,
            },
            {
              coin_symbol: Constants.COIN_SYMBOL.MATIC,
              wallet_address: res?.ethAddress,
            },
            {
              coin_symbol: Constants.COIN_SYMBOL.TRX,
              wallet_address: res?.trxAddress,
            },
            {
              coin_symbol: Constants.COIN_SYMBOL.SOL,
              wallet_address: res?.solAddress,
            },
          ];
          let address = res.ethAddress;
          let wallet_name = activeWallet?.walletName;
          let device_token = activeWallet?.loginRequest?.device_token;
          dispatch(
            createWallet({
              address,
              wallet_addresses,
              wallet_name,
              device_token,
            }),
          )
            .then(response => {
              let data = {
                btcAddress: res.btcAddress,
                trxAddress: res.trxAddress,
                address: res.ethAddress,
                solAddress: res.solAddress,
                addresses: [
                  res.ethAddress,
                  res.btcAddress,
                  res.trxAddress,
                  res.solAddress,
                ],
                wallet_addresses: wallet_addresses,
                walletName: wallet_name,
                device_token: device_token,
              };
              let login_data = {
                access_token: response.data.token,
                defaultEthAddress: res.ethAddress,
                defaultBnbAddress: res.ethAddress,
                defaultMaticAddress: res.ethAddress,
                defaultBtcAddress: res.btcAddress,
                defaultTrxAddress: res.trxAddress,
                defaultSolAddress: res.solAddress,
                walletName: wallet_name,
              };
              let addrsListKeys = [
                res.ethAddress,
                res.btcAddress,
                res.trxAddress,
                res.solAddress,
              ];
              let coinFamilyKeys = [1, 2, 6, 11, 3, 4, 8];
              let WalletData = {
                walletName: wallet_name,
                mnemonics: res.mnemonics,
                loginRequest: data,
                defaultWallet: true,
                user_jwtToken: response.data?.token,
                refreshToken: response?.data?.refreshToken,
                blockChain: 'all',
                login_data,
              };
              let Wallet_Array = [];
              for (let i = 0; i < newMultiWalletData.length; i++) {
                let element = newMultiWalletData[i];
                if (element?.defaultWallet) {
                  element = WalletData;
                }
                Wallet_Array.push(element);
              }
              Singleton.getInstance().newSaveData(
                Constants.addresKeyList,
                JSON.stringify(addrsListKeys),
              );
              Singleton.getInstance().newSaveData(
                Constants.login_data,
                JSON.stringify(login_data),
              );
              Singleton.getInstance().newSaveData(
                Constants.coinFamilyKeys,
                coinFamilyKeys,
              );
              Singleton.getInstance().newSaveData(
                Constants.access_token,
                response.data.token,
              );
              Singleton.getInstance().newSaveData(
                Constants.refresh_token,
                response.data?.refreshToken,
              );
              Singleton.getInstance().newSaveData(
                Constants.ACTIVE_WALLET,
                JSON.stringify(WalletData),
              );

              Singleton.getInstance().newSaveData(
                Constants.IS_PRIVATE_WALLET,
                '0',
              );
              Singleton.getInstance().access_token = response.data.token;
              Singleton.getInstance().defaultEthAddress = res.ethAddress;
              Singleton.getInstance().defaultMaticAddress = res.ethAddress;
              Singleton.getInstance().defaultBtcAddress = res.btcAddress;
              Singleton.getInstance().defaultBnbAddress = res.ethAddress;
              Singleton.getInstance().defaultStcAddress = res.ethAddress;
              Singleton.getInstance().defaultTrxAddress = res.trxAddress;
              Singleton.getInstance().defaultSolAddress = res.solAddress;
              Singleton.getInstance().walletName = wallet_name;
              // }
              Singleton.getInstance().newSaveData(
                Constants.UPDATE_ASYNC_KEY,
                'true',
              );

              Singleton.getInstance().newSaveData(
                Constants.multi_wallet_array,
                JSON.stringify(Wallet_Array),
              );
              loginCheckNew();
            })
            .catch(err => {
              Singleton.showAlert(err.message);
            });
        })
        .catch(err => {
          Singleton.showAlert(err);
        });

      return

    } else {
      let loginRequest = activeWallet?.loginRequest
      dispatch(
        createWallet(loginRequest),
      )
        .then(response => {
          let data = {
            ...loginRequest,
            addresses: [loginRequest?.address],

          };

          let login_data = {
            access_token: response.data.token,
            defaultEthAddress: loginRequest?.address,
            defaultBnbAddress: loginRequest?.address,
            walletName: loginRequest?.walletName,
            defaultStcAddress: loginRequest?.address,
            defaultSolAddress: loginRequest?.address,
          };
          let addrsListKeys = [loginRequest?.address];
          let coinFamilyKeys
          if (blockChain == Constants.COIN_SYMBOL.ETH) {
            coinFamilyKeys = [1]
          } else if (blockChain == 'bsc') {
            coinFamilyKeys = [6]
          }
          let WalletData = {

            ...activeWallet,
            loginRequest: data,
            user_jwtToken: response.data?.token,
            refreshToken: response?.data?.refreshToken,
            login_data,

          };
          let Wallet_Array = [];
          for (let i = 0; i < newMultiWalletData.length; i++) {
            let element = newMultiWalletData[i];
            if (element?.defaultWallet) {
              element = WalletData;
            }
            Wallet_Array.push(element);
          }
          Singleton.getInstance().newSaveData(
            Constants.addresKeyList,
            JSON.stringify(addrsListKeys),
          );
          Singleton.getInstance().newSaveData(
            Constants.login_data,
            JSON.stringify(login_data),
          );
          Singleton.getInstance().newSaveData(
            Constants.coinFamilyKeys,
            coinFamilyKeys,
          );
          Singleton.getInstance().newSaveData(
            Constants.access_token,
            response.data.token,
          );
          Singleton.getInstance().newSaveData(
            Constants.refresh_token,
            response.data?.refreshToken,
          );
          Singleton.getInstance().newSaveData(
            Constants.ACTIVE_WALLET,
            JSON.stringify(WalletData),
          );
          Singleton.getInstance().newSaveData(
            Constants.IS_PRIVATE_WALLET,
            blockChain,
          );

          Singleton.getInstance().access_token = response.data.token;
          Singleton.getInstance().defaultEthAddress = login_data?.defaultEthAddress;
          Singleton.getInstance().defaultBnbAddress = login_data?.defaultEthAddress;
          Singleton.getInstance().defaultStcAddress = login_data?.defaultStcAddress;
          Singleton.getInstance().defaultSolAddress = login_data?.defaultSolAddress;
          Singleton.getInstance().walletName = login_data?.walletName;
          Singleton.getInstance().newSaveData(
            Constants.UPDATE_ASYNC_KEY,
            'true',
          );
          Singleton.getInstance().newSaveData(
            Constants.multi_wallet_array,
            JSON.stringify(Wallet_Array),
          );
          loginCheckNew();
        })
        .catch(err => {
          Singleton.showAlert(err?.message);
        });
    }
  };

  const loginCheckNew = () => {
    Singleton.getInstance()
      .newGetData(Constants.IS_LOGIN)
      .then(res => {
        Singleton.getInstance()
          .newGetData(Constants.PIN)
          .then(enablePin => {
            Singleton.getInstance().isLogin = res;
            if (res == '1') {
              Singleton.getInstance()
                .newGetData(Constants.Langauage)
                .then(res => {
                  signInData();
                  LanguageManager.setLanguage(res == null ? 'English' : res);
                });

              update_private_key()

            }
            setTimeout(() => {
              if (res == 1) {
                if (!enablePin) {
                  reset(NavigationStrings.Main);
                  return;
                } else {
                  navigate(NavigationStrings.ConfirmPin, { isFrom: 'splash' });
                  return;
                }
              } else {
                Singleton.getInstance().newSaveData(Constants.UPDATE_PRIVATE_KEY, '1')
                getCurrentRouteName() != 'WelcomeScreen' &&  reset(NavigationStrings.WelcomeScreen);
              }
            }, 2000);
          })
          .catch(err => {
          })
          .catch(err => {
          });
      });
  };
  const update_private_key = () => {
    Singleton.getInstance().newGetData(Constants.UPDATE_PRIVATE_KEY)
      .then(async is_updated => {
        console.log('~~~~~~~~~', is_updated);
        if (is_updated != '1') {

          try {

            let multiwalletData = JSON.parse(await Singleton.getInstance().newGetData(Constants.multi_wallet_array))
            console.log(multiwalletData);

            for (let i = 0; i < multiwalletData.length; i++) {
              const element = multiwalletData[i];


              if (element?.blockChain == 'all' || element?.blockChain == Constants.COIN_SYMBOL.ETH || element?.blockChain == Constants.COIN_SYMBOL.BNB || element?.blockChain == Constants.COIN_SYMBOL.MATIC) {

                let address = element?.loginRequest?.address

                let pvtKey = await Singleton.getInstance().newGetData(address + '_pk')
                if (pvtKey?.length < 66) {
                  console.log('####### MATCHED', pvtKey);
                  let suffix = '0x' + '0'.repeat(66 - pvtKey?.length)
                  pvtKey = suffix + pvtKey.substring(2)
                  await Singleton.getInstance().newSaveData(address + '_pk', pvtKey)
                  console.log('####### fixed', pvtKey);
                }
              }

            }
            Singleton.getInstance().newSaveData(Constants.UPDATE_PRIVATE_KEY, '1')
          } catch (error) {
            console.log('EERRRROROROR', error);
          }

        }
      })

  }



  const signInData = () => {
    Singleton.getInstance()
      .newGetData(Constants.BUTTON_THEME)
      .then(res => {
        console.log("JSON.parse(res)===", JSON.parse(res))
        if (res != null) {
          Singleton.getInstance().dynamicColor = ["#0057FF", "#0057FF"] //TODO: - Updated Button Code
        }
      });
    Singleton.getInstance()
      .newGetData(Constants.login_data)
      .then(res => {
        let response = JSON.parse(res);
        global.firstLogin = true;
        Singleton.getInstance().access_token = response.access_token;
        Singleton.getInstance().newSaveData(
          Constants.access_token,
          response.access_token,
        );
        Singleton.getInstance().defaultEthAddress = response?.defaultEthAddress;
        Singleton.getInstance().defaultStcAddress = response?.defaultEthAddress;
        Singleton.getInstance().defaultBnbAddress = response?.defaultBnbAddress;
        Singleton.getInstance().defaultBtcAddress = response?.defaultBtcAddress;
        Singleton.getInstance().defaultSolAddress = response?.defaultSolAddress;
        Singleton.getInstance().defaultMaticAddress =
          response?.defaultMaticAddress;
        Singleton.getInstance().walletName = response.walletName;
      })
      .catch(error => {
        //  console.warn('MM', '>>>>', error);
      });
  };
  const showAlert = message => {
    Alert.alert(
      Constants.APP_NAME,
      message,
      [{ text: 'OK', onPress: () => BackHandler.exitApp() }],
      {
        cancelable: false,
      },
    );
  };
  return (
    <>
      <SafeAreaView style={{ backgroundColor: '#000' }}>
        <MainStatusBar
          backgroundColor={'#000'}
          barStyle={'light-content'}
        />
      </SafeAreaView>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <LinearGradient style={{ flex: 1, position: 'relative', justifyContent: 'flex-end' }} colors={['#000', '#000']}>
          <View style={{ flex: 1, height: '100%', width: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={images.SaitaPro_H5} style={{ height: widthDimen(400), width: widthDimen(400), alignSelf: 'center' }} resizeMode={'contain'} />
          </View>
          {/* <Text style={{
            color: '#ffff',
            fontSize: areaDimen(16),
            fontFamily: Fonts.medium,
            alignSelf: 'center',
            position: 'absolute',
            bottom: heightDimen(36)
          }}>{buildNumber}</Text> */}
          <Text style={{
            color: '#ffff',
            fontSize: areaDimen(16),
            fontFamily: Fonts.medium,
            alignSelf: 'center',
            position: 'absolute',
            bottom: heightDimen(36)
          }}>by SaitaChain</Text>
        </LinearGradient>
      </SafeAreaView>
    </>

  );
};

export default Splash;
