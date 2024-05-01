/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, TouchableOpacity, Text, Alert, BackHandler } from 'react-native';
import { BasicButton, BorderLine, SimpleHeader, Wrap } from '../../common';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import { multi_wallet_array } from '../../../Constant';
import { Colors, Images } from '../../../theme';
import styles from './StyleCommon';
import { Actions } from 'react-native-router-flux';
import * as constants from '../../../Constant';
import { useDispatch, useSelector } from 'react-redux';
import {
  MultiWallet_create,
  coinListEmpty,
  createWallet,
  getMyWallets,
  refreshWallet,
  logoutUser,
} from '../../../Redux/Actions';
import Loader from '../Loader/Loader';
import { View } from 'native-base';
import fonts from '../../../theme/Fonts';
import { onWalletSwitch } from '../../../Redux/Actions/WallectConnectActions';
import { areaDimen, widthDimen } from '../../../Utils/themeUtils';
import { EventRegister } from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import images from '../../../theme/Images';
import WalletConnect from '../../../Utils/WalletConnect';
function MultiWalletList(props) {
  const [walletArr, setWalletArr] = useState([]);
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const walletName = useSelector(
    state => state?.createWalletReducer?.walletName,
  );
  const [disabled,setDisabled]=useState(false)
  const { walletData } = useSelector(state => state?.createWalletReducer);
  let timer = useRef(null);
  let deleteTimer = useRef();
  let isSwitchInProgress = useRef(false);
  ////console.warn('MM','walletData=-=-=-=>>>', walletData);
  function getWalletData() {
    // setLoader(true);
    Singleton.getInstance()
      .newGetData(multi_wallet_array)
      .then(res => {
        if (res) {
          let data = JSON.parse(res);
          console.warn('MM', 'walletData=-------', data);
          setWalletArr(data);
        }
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
      });
  }
  useEffect(() => {
    // Singleton.getInstance().saveWalletList();
    isSwitchInProgress.current = false;
    props.navigation.addListener('didFocus', () => {
      getWalletData();
      // //console.warn('MM','------------__NEW-------');
      Singleton.getInstance().saveWalletList();
    });
  }, []);

  async function setDefault(item, index) {
    console.log('##################### SET DEFAULT');

    if (deleteTimer.current) {
      clearTimeout(deleteTimer.current);
    }

    // console.log(item);
    if (!item?.defaultWallet) {
      if (global.disconnected) {
        Singleton.showAlert(constants.NO_NETWORK);
        return;
      }

      if (item?.loginRequest?.addresses?.length > 0) {
        Singleton.coinListCaching = { bnb: [], eth: [], all: [] ,stc:[]};
        // this means the user is already using the latest version
        setDefaultWithoutCreate(item, index);
        return;
      }
      setLoader(true);

      if (item?.blockChain == 'all') {
        // create

        let mnemonics = await Singleton.getInstance().newGetData(
          item?.loginRequest?.address,
        );

        Singleton.getInstance()
          .importWallet(mnemonics, true)
          .then(res1 => {
            let res = {
              ...res1,
              ethAddress: item?.loginRequest?.address,
            };
            //  console.warn('MM', 'response updateWalletAfterUpdate -- ', res);
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
                coin_symbol: 'btc',
                wallet_address: res?.btcAddress,
              },
              {
                coin_symbol: 'matic',
                wallet_address: res?.ethAddress,
              },
              {
                coin_symbol: 'trx',
                wallet_address: res?.trxAddress,
              },
              {
                coin_symbol: 'stc',
                wallet_address: res?.ethAddress,
              },
            ];
            let address = res.ethAddress;
            let wallet_name = item?.walletName;
            let device_token = item?.loginRequest?.device_token;
            dispatch(
              createWallet({
                address,
                wallet_addresses,
                wallet_name,
                device_token,
              }),
            )
              .then(response => {
                Singleton.coinListCaching = { bnb: [], eth: [], all: [] ,stc:[]};
                //  console.warn('MM', 'response---wallet--- ', response);
                // global.firstLogin = true
                // if (props.isFrom != 'multiWallet') {
                // }
                let data = {
                  btcAddress: res.btcAddress,
                  trxAddress: res.trxAddress,
                  address: res.ethAddress,
                  addresses: [res.ethAddress, res.btcAddress, res.trxAddress],
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
                  defaultStcAddress: res.ethAddress,
                  walletName: wallet_name,
                };
                let addrsListKeys = [
                  res.ethAddress,
                  res.btcAddress,
                  res.trxAddress,
                ];
                let coinFamilyKeys = [1, 2, 6, 11, 3,4];
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
                for (let i = 0; i < walletArr.length; i++) {
                  let element = walletArr[i];
                  if (i == index) {
                    element = WalletData;
                  } else {
                    element['defaultWallet'] = false;
                  }
                  Wallet_Array.push(element);
                }
                // Wallet_Array.push(WalletData);
                // if (props.isFrom != 'multiWallet') {
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

                // 0 means all blockchain
                Singleton.getInstance().newSaveData(
                  constants.IS_PRIVATE_WALLET,
                  '0',
                );
                Singleton.getInstance().access_token = response.data.token;
                Singleton.getInstance().defaultEthAddress = res.ethAddress;
                Singleton.getInstance().defaultMaticAddress = res.ethAddress;
                Singleton.getInstance().defaultBtcAddress = res.btcAddress;
                Singleton.getInstance().defaultBnbAddress = res.ethAddress;
                Singleton.getInstance().defaultStcAddress = res.ethAddress;
                Singleton.getInstance().walletName = wallet_name;
                // }

                Singleton.getInstance().newSaveData(
                  constants.multi_wallet_array,
                  JSON.stringify(Wallet_Array),
                );
                setWalletArr(Wallet_Array);
                setTimeout(() => {
                  setLoader(false);
                }, 3000);

                // setisLoading(false);
                // Singleton.showAlert('Wallet imported successfully.');

                // if (props.isFrom == 'multiWallet') {
                //   Actions.jump('MultiWalletList');
                // } else {
                //   Actions.Main({ type: ActionConst.RESET });
                //   Actions.jump('Wallet');
                // }
              })
              .catch(err => {
                setTimeout(() => {
                  setLoader(false);
                }, 3000);
                // setisLoading(false);
                Singleton.showAlert(err.message);
              });
          });
      } else {
        // for single coin

        // let wallet_addresses = item?.loginRequest?.wallet_addresses;

        let data = item?.loginRequest;

        // this.setState({isLoading: true});
        dispatch(MultiWallet_create({ data }))
          .then(async response => {
            Singleton.coinListCaching = { bnb: [], eth: [], all: [],stc:[] };
            //  console.warn('MM','wallet imported response--- ', response);
            let newData = {};

            newData = {
              ...data,
              addresses: [item?.loginRequest?.address],
            };

            let WalletData = {
              ...item,
              user_jwtToken: response.data?.token,
              refreshToken: response.data?.refreshToken,
              loginRequest: newData,
            };
            let multiWalletArray = [];
            let oldWalletArr = await Singleton.getInstance().newGetData(
              multi_wallet_array,
            );
            oldWalletArr = JSON.parse(oldWalletArr);
            multiWalletArray = oldWalletArr.map((value, ind) => {
              if (ind == index) {
                return WalletData;
              } else {
                return value;
              }
            });

            await Singleton.getInstance().newSaveData(
              constants.multi_wallet_array,
              JSON.stringify(multiWalletArray),
            );
            setDefaultWithoutCreate(WalletData, index);

            // Actions.jump('MultiWalletList');
            setTimeout(() => {
              setLoader(false);
            }, 3000);
            // this.setState({ isLoading: false });
          })
          .catch(error => {
            setTimeout(() => {
              setLoader(false);
            }, 3000);
            //  console.warn('MM', ' errr ', error);
            // this.setState({ isLoading: false });
            Singleton.showAlert(error?.message);
          });
      }
    }
  }

  async function setDefaultWithoutCreate(item, index) {
    console.warn('MM', 'ITEM-------------', item?.loginRequest);
    // return
    let coinFamilyKeys = [];
    // return;
    // //console.warn('MM','>>>>>>>item', item);

    if (!item.defaultWallet) {
      try {
        isSwitchInProgress.current = true;
        setLoader(true);
        if (deleteTimer.current) {
          clearTimeout(deleteTimer.current);
        }
        dispatch(coinListEmpty());
        console.log("Empty swap List::::::");
        Singleton.coinListCaching = {
          bnb: [],
          eth: [],
          all: [],
          stc:[]
        };
        console.log('--------c');
        let login_data = {};
        let isPrivateWallet = '0';
        if (item.blockChain == 'all') {
          coinFamilyKeys = [1, 2, 6, 11, 3,4];
          login_data = {
            access_token: item.user_jwtToken,
            defaultEthAddress: item?.loginRequest.address,
            defaultBnbAddress: item?.loginRequest.address,
            defaultMaticAddress: item?.loginRequest.address,
            defaultStcAddress: item?.loginRequest.address,
            defaultBtcAddress: item?.loginRequest.btcAddress,
            defaultTrxAddress: item?.loginRequest.trxAddress,
            walletName: item.walletName,
          };
          Singleton.getInstance().defaultEthAddress =
            login_data?.defaultEthAddress;
          Singleton.getInstance().defaultBnbAddress =
            login_data?.defaultEthAddress;
          Singleton.getInstance().defaultMaticAddress =
            login_data?.defaultEthAddress;
            Singleton.getInstance().defaultStcAddress =
            login_data?.defaultStcAddress;
          Singleton.getInstance().defaultBtcAddress =
            login_data?.defaultBtcAddress;
          Singleton.getInstance().defaultTrxAddress =
            login_data?.defaultTrxAddress;
        } else if (item.blockChain == 'eth') {
          isPrivateWallet = 'eth';
          coinFamilyKeys = [1];
          login_data = {
            access_token: item.user_jwtToken,
            defaultEthAddress: item?.loginRequest.address,
            defaultBnbAddress: item?.loginRequest.address,
            walletName: item.walletName,
          };
          Singleton.getInstance().defaultEthAddress =
            login_data.defaultEthAddress;
          Singleton.getInstance().defaultBnbAddress = // may be the app wont work .... !
            login_data.defaultEthAddress;
          Singleton.getInstance().defaultMaticAddress =
            login_data.defaultEthAddress;
          // Singleton.getInstance().defaultBtcAddress =
          //   login_data.defaultBtcAddress;
        } else if (item.blockChain == 'bnb') {
          isPrivateWallet = 'bnb';
          coinFamilyKeys = [6];
          login_data = {
            access_token: item.user_jwtToken,
            defaultMaticAddress: item?.loginRequest.address,
            defaultEthAddress: item?.loginRequest.address,
            defaultBnbAddress: item?.loginRequest.address,
            walletName: item.walletName,
          };
          Singleton.getInstance().defaultEthAddress = // may be the app wont work .... !
            login_data.defaultBnbAddress;
          Singleton.getInstance().defaultBnbAddress =
            login_data.defaultBnbAddress;
          Singleton.getInstance().defaultMaticAddress =
            login_data.defaultBnbAddress;
          // Singleton.getInstance().defaultBtcAddress =
          //   login_data.defaultBtcAddress;
        } else if (item.blockChain == 'stc') {
          isPrivateWallet = 'stc';
          coinFamilyKeys = [4];
          login_data = {
            access_token: item.user_jwtToken,
            defaultMaticAddress: item?.loginRequest.address,
            defaultEthAddress: item?.loginRequest.address,
            defaultBnbAddress: item?.loginRequest.address,
            defaultStcAddress:item?.loginRequest.address,
            walletName: item.walletName,
          };
          Singleton.getInstance().defaultStcAddress = 
            login_data.defaultStcAddress;
          Singleton.getInstance().defaultBnbAddress =
            login_data.defaultBnbAddress;
          Singleton.getInstance().defaultMaticAddress =
            login_data.defaultBnbAddress;
            Singleton.getInstance().defaultEthAddress = 
            login_data.defaultEthAddress;
          // Singleton.getInstance().defaultBtcAddress =
          //   login_data.defaultBtcAddress;
        }else if (item.blockChain == 'btc') {
          isPrivateWallet = 'btc';
          login_data = {
            access_token: item.user_jwtToken,
            defaultBtcAddress: item?.loginRequest.address,
            walletName: item.walletName,
          };
          coinFamilyKeys = [2];
          // Singleton.getInstance().defaultEthAddress =
          //   login_data.defaultEthAddress;
          // Singleton.getInstance().defaultBnbAddress =
          //   login_data.defaultBnbAddress;
          Singleton.getInstance().defaultBtcAddress =
            login_data.defaultBtcAddress;
        } else if (item.blockChain == 'matic') {
          isPrivateWallet = 'matic';
          coinFamilyKeys = [11];
          login_data = {
            access_token: item.user_jwtToken,
            defaultMaticAddress: item?.loginRequest.address,
            defaultEthAddress: item?.loginRequest.address,
            defaultBnbAddress: item?.loginRequest.address,
            walletName: item.walletName,
          };
          Singleton.getInstance().defaultEthAddress =
            login_data.defaultMaticAddress;
          Singleton.getInstance().defaultBnbAddress =
            login_data.defaultMaticAddress;
          Singleton.getInstance().defaultMaticAddress =
            login_data.defaultMaticAddress;
          // Singleton.getInstance().defaultBtcAddress =
          //   login_data.defaultBtcAddress;
        } else if (item.blockChain == 'trx') {
          isPrivateWallet = 'trx';
          coinFamilyKeys = [3];
          login_data = {
            access_token: item.user_jwtToken,
            defaultTrxAddress: item?.loginRequest.address,
            walletName: item.walletName,
          };
          Singleton.getInstance().defaultTrxAddress =
            login_data.defaultTrxAddress;
        }

        // setLoader(true);
        // //console.warn('MM','ITEM-------------coinFamilyKeys', coinFamilyKeys);
        let addrsListKeys = item.loginRequest.addresses;
        await Singleton.getInstance().newSaveData(
          constants.addresKeyList,
          JSON.stringify(addrsListKeys),
        );
        await Singleton.getInstance().newSaveData(
          constants.login_data,
          JSON.stringify(login_data),
        );
        await Singleton.getInstance().newSaveData(
          constants.coinFamilyKeys,
          coinFamilyKeys,
        );
        await Singleton.getInstance().newSaveData(
          constants.access_token,
          item.user_jwtToken,
        );
        await Singleton.getInstance().newSaveData(
          constants.refresh_token,
          item?.refreshToken,
        );
        await Singleton.getInstance().newSaveData(
          constants.IS_PRIVATE_WALLET,
          isPrivateWallet,
        );
        Singleton.getInstance().access_token = item.user_jwtToken;
        Singleton.getInstance().walletName = item.walletName;

        let oldWalletArr = await Singleton.getInstance().newGetData(
          multi_wallet_array,
        );
        oldWalletArr = JSON.parse(oldWalletArr);
        let newArr = oldWalletArr.map((res, idx) => {
          if (index == idx) {
            return {
              ...res,
              login_data,
              defaultWallet: true,
            };
          } else {
            return { ...res, defaultWallet: false };
          }
        });
        setWalletArr(newArr);
        await Singleton.getInstance().newSaveData(
          constants.multi_wallet_array,
          JSON.stringify(newArr),
        );
        await Singleton.getInstance().newSaveData(
          constants.ACTIVE_WALLET,
          JSON.stringify(newArr[index]),
        );

        if (deleteTimer.current) {
          clearTimeout(deleteTimer.current);
        }

        console.log('cccccccc');
        let page = 1;
        let limit = 80;
        let access_token = item.user_jwtToken;
        isSwitchInProgress.current = false;
        dispatch(
          getMyWallets({
            page,
            limit,
            addrsListKeys,
            coinFamilyKeys,
            access_token,
          }),
        )
          .then(async response => {
            setDisabled(true)
            setLoader(false);
            Actions.currentScene != 'Wallet' && Actions.Wallet()
            isSwitchInProgress.current = false;
            await WalletConnect.getInstance().deleteAllSessions()
          })
          .catch(err => {
            setLoader(false);
            isSwitchInProgress.current = false;
            //console.warn('MM','err', err);
            // setLoader(false);
          });
        dispatch(refreshWallet());
        // Actions.currentScene!='Wallet' && Actions.Wallet()
      } catch (error) {
        isSwitchInProgress.current = false;
        console.log('default errr', error);
        Singleton.showAlert(
          'Something went wrong while changing default wallet',
        );
        setTimeout(() => {
          setLoader(false);
        }, 3000);
      }
      // setTimeout(() => {

      // dispatch(onWalletSwitch());
      // setLoader(false);
      // }, 300);
      // if (timer.current) {
      //   clearTimeout(timer.current);
      // }

      // dispatch(refreshWallet());
    }
  }
  function deleteAlert(pos, item) {
    Alert.alert(constants.APP_NAME, constants.DELETE_WALLET_CHECK, [
      {
        text: 'NO',
        onPress: () => {
          //  console.warn('MM', 'Cancel Pressed');
        },
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          deleteWallet(pos, item);
        },
      },
    ]);
  }
  function deleteWallet(position, listitem) {
    console.log("listitem::::", listitem);
    setLoader(true);
    let data = { deviceToken: listitem.loginRequest.device_token };
    let access_token = listitem.user_jwtToken;
    let wallet_arr = walletArr;
    if (wallet_arr?.length < position) {
      Singleton.showAlert('Default wallet changed, please try again');
      return;
    }
    if (wallet_arr[position]?.defaultWallet) {
      Singleton.showAlert('Default wallet changed, please try again');
      return;
    }
    dispatch(logoutUser({ data, access_token }))
      .then(res => {

        wallet_arr.splice(position, 1);
        setWalletArr(wallet_arr);
        //   }
        // }
        setLoader(false);
        Singleton.getInstance().newSaveData(
          constants.multi_wallet_array,
          JSON.stringify(walletArr),
        );
      })
      .catch(err => {
        setLoader(false);
        Singleton.showAlert(err);
        //console.warn('MM','err logout devicetoken:::::::::', err);
      });
    // for (let i = 0; i < walletArr.length; i++) {
    //   const element = walletArr[i];
    //console.warn('MM','response--- element  ', element);
    //console.warn('MM','response--- listitem  ', listitem);
    // if (element.loginRequest.address == listitem.loginRequest.address) {

    //console.warn('MM','response---this.state.multi_wallet_Array ', walletArr);
    //  Actions.replace('WalletOptions');
  }

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      {/* <SimpleHeader title={LanguageManager.MultiWallet} /> */}
      <SimpleHeader
        title={LanguageManager.MultiWallet}
        // rightImage={[styles.rightImgStyle]}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          // props.navigation.state.params.onGoBack();
          props.navigation.goBack();
        }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />

      <FlatList
        bounces={false}
        data={walletArr}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => {
          return <BorderLine />
        }}
        ItemSeparatorComponent={() => {
          return <BorderLine />
        }}
        renderItem={({ item, index }) => {
          console.log('---------item', item)
          return (
            <TouchableOpacity
            disabled={disabled}
              onPress={() => {
                if (timer.current) {
                  clearTimeout(timer.current);
                }
                if (deleteTimer.current) {
                  clearTimeout(deleteTimer.current);
                }

                timer.current = setTimeout(() => {
                  setDefault(item, index);
                  EventRegister.emit('walletAPIEvent', '');
                }, 300);
              }}
              style={[
                styles.itemStyle,
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '70%',
                }}>
                <View
                  style={[
                    styles.imgViewStyle,
                    // {backgroundColor: ThemeManager.colors.primary},
                  ]}>
                  <FastImage
                    style={styles.shadowImageStyle}
                    resizeMode={FastImage.resizeMode.contain}
                    source={images.viewWithShadow}
                  />
                  <FastImage
                    style={styles.imgStyle}
                    resizeMode={FastImage.resizeMode.contain}
                    source={Images.walletIcon}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.labelTextStyle,
                      { marginLeft: 10, color: ThemeManager.colors.textColor },
                    ]}>
                    {item?.loginRequest?.wallet_name || item?.loginRequest?.walletName}{' '}
                  </Text>
                  <Text
                    style={{
                      color: item?.defaultWallet
                        ? ThemeManager.colors.primary
                        : ThemeManager.colors.lightTextColor,
                      fontFamily: fonts.medium,
                      fontSize: areaDimen(12),
                      marginLeft: item?.defaultWallet ? 8 : 10,
                      marginTop: areaDimen(4),
                    }}>
                    {item?.defaultWallet
                      ? ' Default Wallet'
                      : item?.blockChain == 'eth'
                        ? 'Ethereum Wallet'
                        : item?.blockChain == 'bnb'
                          ? 'Binance Wallet'
                          : item?.blockChain == 'matic'
                            ? 'Matic Wallet'
                            : item?.blockChain == 'btc'
                              ? 'Bitcoin Wallet'
                              : item?.blockChain == 'trx'
                                ? 'Tron Wallet'
                                : 'Multicoin Wallet'}
                  </Text>
                </View>
              </View>

              {item?.defaultWallet ? (
                <TouchableOpacity
                disabled={disabled}
                  onPress={() => {
                    //  Actions.replace('SecureWallet', {isFrom: props.isFrom});
                    Actions.currentScene != 'EditWallet' &&
                      Actions.EditWallet({ walletData: item, index });
                  }}
                  style={styles.imgStyledlt}>
                  <Image
                    style={[
                      styles.infoIconStyle,
                      { tintColor: ThemeManager.colors.lightTextColor },
                    ]}
                    source={Images.iconInfo}
                  />
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                  disabled={disabled}
                    style={{ alignSelf: 'flex-end' }}
                    onPress={() => {
                      if (timer.current) {
                        clearTimeout(timer.current);
                      }
                      if (deleteTimer.current) {
                        clearTimeout(deleteTimer.current);
                      }
                      console.log('value', isSwitchInProgress.current);
                      if (isSwitchInProgress.current) {
                        console.log('##################### NOT ADDED DELETE');
                      } else {
                        console.log('##################### ADDED DELETE');
                        deleteTimer.current = setTimeout(() => {
                          console.log('##################### DELETE');
                          deleteAlert(index, item);
                        }, 500);
                      }
                    }}>
                    <View style={styles.imgStyledlt}>
                      <Image
                        style={[
                          styles.deleteIconStyle,
                          {
                            tintColor: ThemeManager.colors.lightTextColor,
                          },
                        ]}
                        source={Images.delete}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                  disabled={disabled}
                    onPress={() => {
                      //  Actions.replace('SecureWallet', {isFrom: props.isFrom});
                      Actions.currentScene != 'EditWallet' &&
                        Actions.EditWallet({ walletData: item, index });
                    }}
                    style={styles.imgStyledlt}>
                    <Image
                      style={[
                        styles.infoIconStyle,
                        { tintColor: ThemeManager.colors.lightTextColor },
                      ]}
                      source={Images.iconInfo}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
      <BasicButton
      disabled={disabled}
        onPress={() => {
          console.log("walletArr?.length:::::",walletArr?.length);
          if (walletArr?.length >= 20) {
            Singleton.showAlert("Wallet limit exceeded. Please delete an existing wallet.")
          } else {
            Actions.currentScene != 'CreateOrImportWallet' &&
              Actions.CreateOrImportWallet({ isFrom: 'multiWallet' });
          }

        }}
        btnStyle={styles.btnStyle}
        customGradient={styles.customGrad}
        rightImage
        text={LanguageManager.addNewWallet}
      />
      {loader && <Loader />}
    </Wrap>
  );
}
export { MultiWalletList };
