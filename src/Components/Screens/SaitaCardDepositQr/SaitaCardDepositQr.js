/* eslint-disable react-native/no-inline-styles */
import React, { useState, createRef, useEffect, useRef } from 'react';
import { Keyboard, ScrollView, Share, TextInput, BackHandler } from 'react-native';
import { BorderLine, Wrap } from '../../common/index';
import { MainStatusBar, SimpleHeader, BasicButton } from '../../common';
import { Colors, Fonts, Images } from '../../../theme';
import styles from './SaitaCardDepositQrStyle';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import Singleton from '../../../Singleton';
import QRCode from 'react-native-qrcode-image';
import Toast from 'react-native-easy-toast';
import Clipboard from '@react-native-community/clipboard';
import * as constants from '../../../Constant';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { Actions } from 'react-native-router-flux';
import SelectDropdown from 'react-native-select-dropdown';
import Loader from '../Loader/Loader';
import { APIClient } from '../../../Api';
import { LIMINAL_COIN_LIST, LIMINAL_PRICE_CONVERSION } from '../../../Endpoints';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
let buttonPressed = false
const QrCode = prop => {
  const toast = createRef();
  const [isButtonPresses, setIsButtonPresses] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef();
  const [tokenFirst, setTokenFirst] = useState({
    coin_name: 'Ethereum',
    coin_symbol: 'eth',
    coin_image:
      'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    wallet_address: '',
    min_deposit: 0,
  });
  const [amount, setAmount] = useState('');
  const [coinList, setCoinList] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState();

  useEffect(() => {
    let backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
      if (buttonPressed) {
        setIsButtonPresses(false)
        buttonPressed = false
      } else {
        Actions.pop()
      }
      return true
    })
    getCoinlist();
    let blur = prop.navigation.addListener('didBlur', () => {
      console.warn('didBlur .... ');
      setIsButtonPresses(false);
      buttonPressed = false
    });
    return () => {
      blur?.remove();
      backHandle?.remove()
    };
  }, []);
  const getCoinlist = async () => {
    setIsLoading(true);
    let token = await Singleton.getInstance().newGetData(
      constants.black_access_token,
    );
    APIClient.getInstance()
      .centralisedApiget(LIMINAL_COIN_LIST, null, token)
      .then(res => {
        console.warn('resssss ', res);
        setIsLoading(false);
        setCoinList(res.data);
        setTokenFirst(res.data[0]);
      })
      .catch(err => {
        console.warn(err);
        setIsLoading(false);
        Singleton.showAlert(err?.message || err);
      });
  };

  const getPrice = async val => {
    Keyboard.dismiss();
    setIsLoading(true);
    let token = await Singleton.getInstance().newGetData(
      constants.black_access_token,
    );
    let req = {
      amount: val,
      address: tokenFirst?.wallet_address,
      coinId: tokenFirst?.coin_id,
    };
    console.log(req);
    APIClient.getInstance()
      .centralisedApi(LIMINAL_PRICE_CONVERSION, req, token)
      .then(res => {
        setIsLoading(false);
        console.log(res);
        setConvertedAmount(
          Singleton.getInstance().toFixed(res?.data?.finalAmountInCrypto, 8),
        );
      })
      .catch(err => {
        setIsLoading(false);
        Singleton.showAlert(err?.message || constants.SOMETHING_WRONG);
        console.log(err);
      });
  };

  const shareAction = () => {
    try {
      const result = Share.share({
        message: `Please send USDT on ${tokenFirst?.wallet_address}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Singleton.showAlert(error.message);
    }
  };
  const copyAction = () => {
    console.warn('MM', '---------', tokenFirst?.wallet_address);
    Clipboard.setString(tokenFirst?.wallet_address);
    toast.current.show(constants.COPIED);
  };
  if (isButtonPresses) {
    return (
      <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <SimpleHeader
              title={'Deposit'}
              backImage={ThemeManager.ImageIcons.iconBack}
              titleStyle={{ marginRight: 30 }}
              imageShow
              back={false}
              backPressed={() => {
                setIsButtonPresses(false);
                buttonPressed = false
              }}
            />
            <BorderLine
              borderColor={{
                backgroundColor: ThemeManager.colors.viewBorderColor,
              }}
            />
            <View style={[styles.innerContainer]}>
              <View style={[styles.qrCode_wrap, { paddingHorizontal: 25 }]}>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontFamily: Fonts.medium,
                    fontSize: areaDimen(14),
                    lineHeight: heightDimen(18),
                    marginBottom: 10,
                  }}>
                  Select currency to calculate Top Up
                </Text>
                <View
                  style={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                    borderRadius: 100,
                    borderWidth: 1,
                    height: heightDimen(50),
                    width: '100%',
                    flexDirection: 'row',
                    backgroundColor: ThemeManager.colors.backgroundColor,
                  }}>
                  <SelectDropdown
                    disabled={coinList?.length > 0 ? false : true}
                    dropdownOverlayColor="#0001"
                    data={coinList}
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      width: '98%',
                      height: heightDimen(45),
                      borderRadius: 12,
                      alignSelf: 'center'
                    }}
                    buttonTextStyle={{
                      fontFamily: Fonts.regular,
                      fontSize: areaDimen(14),
                      lineHeight: heightDimen(18),
                      color: ThemeManager.colors.inActiveColor,
                      textAlign: 'left',

                    }}
                    dropdownStyle={{
                      backgroundColor: ThemeManager.colors.backgroundColor,
                      borderRadius: 25,
                      shadowColor: '#fff',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                      width: '88%',
                    }}
                    rowTextStyle={{
                      fontFamily: Fonts.regular,
                      fontSize: 14,
                      color: '#000',
                      textAlign: 'left',
                    }}
                    rowStyle={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(255,255,255,0.04)',
                      paddingLeft: 20,
                      backgroundColor: ThemeManager.colors.backgroundColor,
                    }}
                    defaultButtonText={tokenFirst?.coin_symbol}
                    renderDropdownIcon={() => (
                      <FastImage
                        source={ThemeManager.ImageIcons.dropIconDown}
                        style={{
                          width: areaDimen(10),
                          height: areaDimen(10),
                          marginBottom: 2,
                          tintColor: ThemeManager.colors.inActiveColor,
                        }}
                        tintColor={ThemeManager.colors.inActiveColor}
                        resizeMode="contain"
                      />
                    )}
                    onSelect={(selectedItem, index) => {
                      setTokenFirst(selectedItem);
                      setConvertedAmount();
                      setAmount('');
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem?.coin_symbol;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item?.coin_symbol;
                    }}
                    renderCustomizedButtonChild={(item, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={{ uri: tokenFirst?.coin_image }}
                            style={{
                              borderRadius: 100,
                              width: areaDimen(35),
                              height: areaDimen(35),
                              marginRight: 10,
                            }}
                            resizeMode="contain"
                          />

                          <Text
                            style={{
                              fontFamily: Fonts.semibold,
                              fontSize: areaDimen(16),
                              color: ThemeManager.colors.textColor,
                              paddingStart: 2,
                              marginTop: 2,
                            }}>
                            {tokenFirst?.coin_symbol.toUpperCase()}
                          </Text>
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          {item ? (
                            <Image
                              source={{ uri: item?.coin_image }}
                              style={{
                                borderRadius: 14,
                                width: 25,
                                height: 25,
                                resizeMode: 'contain',
                              }}
                            />
                          ) : (
                            <Image
                              source={{
                                uri: item?.coin_image,
                              }}
                              style={{
                                borderRadius: 14,
                                width: 25,
                                height: 25,
                                resizeMode: 'contain',
                              }}
                            />
                          )}

                          <Text
                            style={{
                              fontFamily: Fonts.semibold,
                              fontSize: 15,
                              color: ThemeManager.colors.textColor,
                              paddingStart: 15,
                            }}>
                            {item?.coin_symbol.toUpperCase() ||
                              item?.coin_symbol.toUpperCase()}
                          </Text>

                          <Text
                            style={{
                              fontFamily: Fonts.regular,
                              fontSize: 12,
                              color: ThemeManager.colors.textColor,
                              paddingStart: 10,
                            }}>
                            {item?.is_token == '1'
                              ? ' ( ' + item?.token_type + ' )'
                              : ''}
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontFamily: Fonts.medium,
                    fontSize: areaDimen(14),
                    lineHeight: heightDimen(18),
                    marginBottom: heightDimen(10),
                    marginTop: heightDimen(16),
                  }}>
                  How much balance would you like to load in your SaitaCard?
                </Text>
                <View
                  style={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                    borderRadius: 100,
                    borderWidth: 1,
                    height: heightDimen(50),
                    width: '100%',
                    paddingHorizontal: 15,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    value={amount}
                    maxLength={8}
                    style={{
                      width: '80%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.regular,
                      height: '100%',
                      fontSize: areaDimen(14)
                    }}
                    placeholderTextColor={ThemeManager.colors.lightTextColor}
                    placeholder={'Enter amount'}
                    keyboardType={'numeric'}
                    onChangeText={value => {
                      var expression = new RegExp('^\\d*\\.?\\d{0,' + '}$');
                      if (expression.test(value)) {
                        setAmount(value);
                        timerRef.current && clearTimeout(timerRef.current);
                        timerRef.current = setTimeout(() => {
                          if (value > 0 && value != '') {
                            getPrice(value);
                          } else {
                            setConvertedAmount();
                          }
                        }, 500);
                      }
                    }}
                  />
                  <Text
                    style={{
                      color: ThemeManager.colors.headingText,
                      fontFamily: Fonts.semibold,
                      fontSize: areaDimen(13)
                    }}>
                    USD
                  </Text>
                </View>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontFamily: Fonts.medium,
                    fontSize: areaDimen(14),
                    lineHeight: heightDimen(18),
                    marginBottom: heightDimen(10),
                    marginTop: heightDimen(16),
                  }}>
                  You need to deposit
                </Text>
                <View
                  style={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                    borderRadius: 100,
                    borderWidth: 1,
                    height: heightDimen(50),
                    width: '100%',
                    paddingHorizontal: 15,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    value={convertedAmount?.toString()}
                    style={{
                      maxWidth: '75%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.regular,
                      fontSize: areaDimen(14),
                      flex: 1,
                    }}
                    numberOfLines={1}
                    placeholderTextColor={ThemeManager.colors.lightTextColor}
                    placeholder={'Converted amount'}
                    keyboardType={'numeric'}
                    editable={false}
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={{
                        color: ThemeManager.colors.headingText,
                        fontFamily: Fonts.semibold,
                        marginRight: 15,
                        fontSize: areaDimen(13)
                      }}>
                      {tokenFirst?.coin_symbol?.toUpperCase()}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (convertedAmount > 0) {
                          Clipboard.setString(convertedAmount?.toString());
                          toast.current.show(constants.COPIED);
                        }
                      }}>
                      <Image
                        source={Images.IconCopyInside}
                        style={{ height: areaDimen(20), width: areaDimen(20), tintColor: ThemeManager.colors.iconColor }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ marginBottom: 30 }}>
                <View style={{ paddingHorizontal: widthDimen(22) }}>
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      marginTop: heightDimen(30),
                      fontFamily: Fonts.medium,
                      fontSize: areaDimen(18),
                      lineHeight: heightDimen(22),
                    }}>
                    Instructions
                  </Text>
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                    }}
                  />

                  <View style={{ flexDirection: 'row' }}>
                    <FastImage
                      style={{
                        height: 7,
                        width: 7,
                        transform: [
                          {
                            rotate: '270deg',
                          },
                        ],
                        top: 5,
                      }}
                      resizeMode="contain"
                      tintColor={ThemeManager.colors.headingText}
                      source={Images.dot}
                    />
                    <Text
                      style={{
                        color: ThemeManager.colors.inActiveColor,
                        paddingHorizontal: 10,
                        fontFamily: Fonts.normal,
                        fontSize: areaDimen(14),
                        lineHeight: heightDimen(24),
                        top: -2,
                      }}>
                      This above shown calculation is an approx value. The
                      transaction will be executed at market value
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <FastImage
                      style={{
                        height: 7,
                        width: 7,
                        transform: [
                          {
                            rotate: '270deg',
                          },
                        ],
                        top: 5,
                      }}
                      resizeMode="contain"
                      tintColor={ThemeManager.colors.headingText}
                      source={Images.dot}
                    />
                    <Text
                      style={{
                        color: ThemeManager.colors.inActiveColor,
                        paddingHorizontal: 10,
                        fontFamily: Fonts.normal,
                        fontSize: areaDimen(14),
                        lineHeight: heightDimen(24),
                        top: -2,
                      }}>
                      The deposit into the card may take up 24 hours
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <BasicButton
              onPress={() => {
                // shareAction();
                // getPrice();
                setIsButtonPresses(false);
                buttonPressed = false
              }}
              btnStyle={[styles.btnStyle, { marginTop: heightDimen(30), marginBottom: heightDimen(20) }]}
              customGradient={[styles.customGrad]}
              // rightImage
              icon={Images.share}
              text={'Deposit Wallet Address'}
            />
          </View>
        </ScrollView>
        {isLoading && <Loader />}
        <Toast ref={toast} />
      </Wrap>
    );
  }

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <SimpleHeader
        title={'Deposit'}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle={{ marginRight: 30 }}
        imageShow
        back={false}
        backPressed={() => {
          Actions.pop();
        }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: ThemeManager.colors.bg,
        }}>

        <View style={{ flex: 1 }}>
          <View style={[styles.innerContainer, { paddingHorizontal: widthDimen(22) }]}>
            <View style={[styles.qrCode_wrap, { alignItems: 'center' }]}>
              <View
                style={{
                  borderColor: ThemeManager.colors.viewBorderColor,
                  borderRadius: 100,
                  borderWidth: 1,
                  height: heightDimen(50),
                  width: '100%',
                  flexDirection: 'row',
                  backgroundColor: ThemeManager.colors.backgroundColor,
                }}>
                <SelectDropdown
                  disabled={coinList?.length > 0 ? false : true}
                  dropdownOverlayColor="#0001"
                  data={coinList}
                  buttonStyle={{
                    backgroundColor: 'transparent',
                    width: '98%',
                    height: heightDimen(45),
                    borderRadius: 100,
                    alignSelf: 'center'
                  }}
                  buttonTextStyle={{
                    fontFamily: Fonts.regular,
                    fontSize: areaDimen(14),
                    lineHeight: heightDimen(18),
                    color: ThemeManager.colors.inActiveColor,
                    textAlign: 'left',
                  }}
                  dropdownStyle={{
                    backgroundColor: ThemeManager.colors.backgroundColor,
                    borderRadius: 25,
                    shadowColor: '#fff',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: '88%',
                  }}
                  rowTextStyle={{
                    fontFamily: Fonts.regular,
                    fontSize: 14,
                    color: '#000',
                    textAlign: 'left',
                  }}
                  rowStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255,255,255,0.04)',
                    paddingLeft: 20,
                    backgroundColor: ThemeManager.colors.backgroundColor,
                  }}
                  defaultButtonText={tokenFirst?.coin_symbol}
                  renderDropdownIcon={() => (
                    <FastImage
                      source={ThemeManager.ImageIcons.dropIconDown}
                      style={{
                        width: 10,
                        height: 10,
                        marginBottom: 2,
                        tintColor: ThemeManager.colors.inActiveColor,
                      }}
                      tintColor={ThemeManager.colors.inActiveColor}
                      resizeMode="contain"
                    />
                  )}
                  onSelect={(selectedItem, index) => {
                    setTokenFirst(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem?.coin_symbol;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item?.coin_symbol;
                  }}
                  renderCustomizedButtonChild={(item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={{ uri: tokenFirst?.coin_image }}
                          style={{
                            borderRadius: 8,
                            width: areaDimen(30),
                            height: areaDimen(30),
                            marginRight: widthDimen(10),
                          }}
                          resizeMode="contain"
                        />

                        <Text
                          style={{
                            fontFamily: Fonts.medium,
                            fontSize: areaDimen(16),
                            color: ThemeManager.colors.inActiveColor,
                            lineHeight: heightDimen(19),
                          }}>
                          {tokenFirst?.coin_symbol.toUpperCase()}
                        </Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        {item ? (
                          <Image
                            source={{ uri: item?.coin_image }}
                            style={{
                              borderRadius: 14,
                              width: 25,
                              height: 25,
                              resizeMode: 'contain',
                            }}
                          />
                        ) : (
                          <Image
                            source={{
                              uri: item?.coin_image,
                            }}
                            style={{
                              borderRadius: 14,
                              width: 25,
                              height: 25,
                              resizeMode: 'contain',
                            }}
                          />
                        )}
                        <Text
                          style={{
                            fontFamily: Fonts.semibold,
                            fontSize: 15,
                            color: ThemeManager.colors.textColor,
                            paddingStart: 15,
                          }}>
                          {item?.coin_symbol.toUpperCase() ||
                            item?.coin_symbol.toUpperCase()}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.regular,
                            fontSize: 12,
                            color: ThemeManager.colors.textColor,
                            paddingStart: 10,
                          }}>
                          {item?.is_token == '1'
                            ? ' ( ' + item?.token_type + ' )'
                            : ''}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>

              <View style={styles.qrCode_holder}>
                <FastImage
                  source={{ uri: tokenFirst?.coin_image }}
                  style={{
                    position: 'absolute',
                    height: areaDimen(50),
                    width: areaDimen(50),
                    backgroundColor: ThemeManager.colors.bg,
                    borderRadius: 100,
                    borderWidth: 5,
                    borderColor: ThemeManager.colors.bg,
                    zIndex: 9999,
                    top: -areaDimen(45 / 2),
                  }}
                />
                <QRCode
                  getBase64={base64 => {
                    qrBase64 = base64;
                  }}
                  value={tokenFirst?.wallet_address}
                  size={areaDimen(200)}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </View>

              <View style={styles.publicAddressWrapStyle}>
                <Text
                  style={[
                    styles.publicAddressText,
                    { color: ThemeManager.colors.textColor },
                  ]}>
                  {LanguageManager.publicAddress}
                </Text>
                <Text
                  style={[
                    styles.publicAddressStyle,
                    { color: ThemeManager.colors.inActiveColor },
                  ]}>
                  {tokenFirst?.wallet_address}
                </Text>
              </View>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 12,
                  fontFamily: Fonts.regular,
                  marginTop: 10,
                  textAlign: 'center',
                }}>
                For {tokenFirst?.coin_symbol?.toUpperCase()}{' '}
                {tokenFirst?.is_token == '1'
                  ? '( ' + tokenFirst?.token_type + ' )'
                  : ''}{' '}
                deposit only
              </Text>
              <Text
                style={{
                  color: ThemeManager.colors.inActiveColor,
                  fontSize: areaDimen(12),
                  fontFamily: Fonts.regular,
                  marginTop: heightDimen(10),
                  textAlign: 'center',
                  lineHeight: heightDimen(15),
                }}>
                Note: Minimum Deposit value is
              </Text>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: areaDimen(12),
                  fontFamily: Fonts.semibold,
                  marginTop: heightDimen(5),
                  textAlign: 'center',
                  lineHeight: heightDimen(15),
                }}>
                {tokenFirst?.min_deposit} USD
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: heightDimen(15),

              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: widthDimen(120),
                }}>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      shareAction();
                    }}
                    style={[
                      styles.copyBtn,
                      {
                        backgroundColor: ThemeManager.colors.primary,
                      },
                    ]}>
                    <Image
                      style={[styles.imgCopyInside, { tintColor: Colors.white }]}
                      source={Images.share}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.heading,
                      {
                        color: ThemeManager.colors.inActiveColor,
                        fontFamily: Fonts.semibold,
                        marginStart: 6,
                        marginTop: heightDimen(5),
                        fontSize: areaDimen(12),
                      },
                    ]}>
                    Share
                  </Text>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() => {
                      copyAction();
                    }}
                    style={[
                      styles.copyBtn,
                      {
                        backgroundColor: ThemeManager.colors.primary,
                      },
                    ]}>
                    <Image
                      style={[styles.imgCopyInside, { tintColor: Colors.white }]}
                      source={Images.IconCopyInside}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.heading,
                      {
                        color: ThemeManager.colors.inActiveColor,
                        fontFamily: Fonts.semibold,
                        marginStart: 6,
                        marginTop: heightDimen(5),
                        fontSize: areaDimen(12),
                      },
                    ]}>
                    {LanguageManager.copy}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.lightTextColor,
                textAlign: 'center',
                alignSelf: 'center',
                fontSize: areaDimen(14),
                lineHeight: heightDimen(16),
                paddingHorizontal: widthDimen(16),
                marginTop: heightDimen(14),
              }}>
              Click on the button to get the calculations for the top up value
              for the card.
            </Text>
            <BasicButton
              onPress={() => {
                setIsButtonPresses(true);
                buttonPressed = true
                setAmount('');
                setConvertedAmount();
              }}
              btnStyle={{
                ...styles.btnStyle,
                paddingHorizontal: 0,
              }}
              customGradient={[styles.customGrad]}
              text={'Calculate Your Top Up'}
            />
          </View>
          <View style={{ marginBottom: 30 }} />
        </View>
      </ScrollView>
      <Toast ref={toast} />
      {isLoading && <Loader />}
    </Wrap>
  );
};

export default QrCode;
