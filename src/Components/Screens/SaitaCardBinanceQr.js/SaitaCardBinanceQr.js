/* eslint-disable react-native/no-inline-styles */
import React, {useState, createRef, useEffect, useRef} from 'react';
import {
  Keyboard,
  Linking,
  Modal,
  ScrollView,
  Share,
  TextInput,
} from 'react-native';
import {BorderLine, Wrap} from '../../common/index';
import {MainStatusBar, SimpleHeader, BasicButton} from '../../common';
import {Colors, Fonts, Images} from '../../../theme';
import styles from './SaitaCardBinanceQrStyle';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Singleton from '../../../Singleton';
import QRCode from 'react-native-qrcode-image';
import Toast from 'react-native-easy-toast';
import Clipboard from '@react-native-community/clipboard';
import * as constants from '../../../Constant';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {Actions} from 'react-native-router-flux';
import SelectDropdown from 'react-native-select-dropdown';
import Loader from '../Loader/Loader';
import {APIClient} from '../../../Api';
import {LIMINAL_COIN_LIST, LIMINAL_PRICE_CONVERSION} from '../../../Endpoints';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

var qrBase64 = '';
const SaitaCardBinanceQr = prop => {
  // const [publicAddress, setPublicAddress] = useState(prop.myAddress);
  // const [walletData, setwalletData] = useState(prop.item);

  const toast = createRef();
  const [isButtonPresses, setIsButtonPresses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef();
  const [tokenFirst, setTokenFirst] = useState({
    coin_name: 'Ethereum',
    coin_symbol: 'eth',
    coin_image:
      'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    wallet_address: '',
    min_deposit: 20,
  });
  const [amount, setAmount] = useState('');
  const [coinList, setCoinList] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState();

  // useEffect(() => {
    
    //console.warn('MM',"????>>>>tokenListItem", prop.tokenListItem);
    // getCoinlist()
    // let blur = prop.navigation.addListener('didBlur' , () =>{
    //   console.warn('didBlur .... ');
    //   setIsButtonPresses(false)
    // })
    // return ()=>{
    //   blur?.remove()
    // }
  // }, []);

  const shareAction = () => {
    try {
      const result = Share.share({
        message: `Please open this url to make payment ${prop?.data?.data?.universalUrl}`,
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
    // console.warn('MM','---------', tokenFirst?.wallet_address);
    Clipboard.setString(prop?.data?.data?.universalUrl);
    toast.current.show(constants.COPIED);
  };

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.backgroundColor}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />

      <View
        style={{
          flex: 1,
          backgroundColor: ThemeManager.colors.backgroundColor,
        }}>
        <SimpleHeader
          title={'Binance Pay'}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle={{marginRight: 30}}
          imageShow
          back={false}
          backPressed={() => {
           Actions.currentScene != 'SaitaCardsInfo' && Actions.pop();
          //  Actions.currentScene != 'SaitaCardsInfo' && Actions.pop();
          }}
        />
        <BorderLine
          borderColor={{backgroundColor: ThemeManager.colors.chooseBorder}}
        />

        <View style={{flex: 1}}>
          <View style={[styles.innerContainer, {paddingHorizontal: 25}]}>
            <View style={[styles.qrCode_wrap, {alignItems: 'center'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    copyAction();
                  }}
                  style={[
                    styles.copyBtn,
                    //  { backgroundColor: ThemeManager.colors.btcBack, }
                  ]}>
                  <Image
                    style={styles.imgCopyInside}
                    source={Images.IconCopyInside}
                  />
                  <Text
                    style={[
                      styles.heading,
                      {
                        color: ThemeManager.colors.textColor,
                        fontFamily: Fonts.semibold,
                        marginStart: 6,
                      },
                    ]}>
                    {LanguageManager.copy}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    shareAction();
                  }}
                  style={[
                    styles.copyBtn,
                    //  { backgroundColor: ThemeManager.colors.btcBack, }
                  ]}>
                  <Image
                    style={[
                      {tintColor: Colors.buttonColor1, height: 20, width: 20},
                    ]}
                    source={Images.share}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.heading,
                      {
                        color: ThemeManager.colors.textColor,
                        fontFamily: Fonts.semibold,
                        marginStart: 6,
                      },
                    ]}>
                    Share
                  </Text>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.qrCode_holder}> */}
              {/* 
                <QRCode
                  getBase64={base64 => {
                    qrBase64 = base64;
                  }}
                  value={tokenFirst?.wallet_address}
                  size={160}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                /> 
                */}
              <View
                style={{
                  height: 166,
                  width: 166,
                  alignItems:'center',
                  justifyContent:'center',
                  borderWidth:1,
                  borderRadius:5,
                  marginTop:10,
                  borderColor:'#5552',
                  
                }}>
                <FastImage
                  onLoad={() => {
                    console.log('load');
                    setIsLoading(false)
                  }}
                  // onLoadEnd={() => {
                  //   console.log('e');
                  // }}
                  source={{uri: prop?.data?.data?.qrcodeLink}}
                  style={{
                    height: 156,
                    width: 156,
                  }}
                  resizeMode="contain"
                />
               {
               isLoading &&
               <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    heigth: '100%',
                    
                  }}>
                  <SkeletonPlaceholder borderRadius={5}
                  backgroundColor='#5555'
                  >
                    <SkeletonPlaceholder.Item height={166} width={166} />
                  </SkeletonPlaceholder>
                </View>}
              </View>
              {/* </View> */}
              <Text
                style={{
                  color: ThemeManager.colors.stakeColor,
                  fontSize: 12,
                  fontFamily: Fonts.regular,
                  marginTop: 10,
                  textAlign: 'center',
                }}>
                For Binance Pay only{'\n'}
              </Text>
            </View>
            {/* <View style={styles.buttonsWrap}> */}
            {/* <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => shareAction()}
            style={styles.button}>
            <Text style={styles.buttonText}>{LanguageManager.share}</Text>
          </TouchableOpacity> */}
            {/* <TouchableOpacity
            onPress={() => copyAction()}
            style={[styles.button, styles.midButton]}>
            <Text style={styles.buttonText}>{LanguageManager.copy}</Text>
          </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => alert('soon')} style={styles.button}>
                            <Text style={styles.buttonText}>Set amount</Text>
                        </TouchableOpacity> */}
            {/* </View> */}
            {/* <View style={{flexDirection:'row' , justifyContent:'space-between'}}> */}

            {/* <BasicButton
              onPress={() => {
                // setIsButtonPresses(true);
                // setAmount('')
                // setConvertedAmount()
                // shareAction();
              }}
              customColor={[
                ThemeManager.colors.backgroundColor,
                ThemeManager.colors.backgroundColor,
              ]}
              btnStyle={{
                ...styles.btnStyle,
                paddingHorizontal: 0,
                marginTop: '10%',
              }}
              textStyle={{
                fontSize: 16,
                fontFamily: Fonts.medium,
                color: ThemeManager.colors.textColor,
              }}
              customGradient={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: ThemeManager.colors.textColor,
              }}              // rightImage
              // icon={Images.share}
              text={'Cancel order'}
              /> */}
            <BasicButton
              onPress={() => {
                // setIsButtonPresses(true);
                // setAmount('')
                // setConvertedAmount()
                // shareAction();
                Linking.openURL(prop?.data?.data?.deeplink)
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => {
                    console.log(err);
                    Singleton.showAlert(
                      'Unable to found Binance app',
                    );
                  });
              }}
              textStyle={{
                fontSize: 16,
              }}
              btnStyle={{
                ...styles.btnStyle,
                paddingHorizontal: 0,
                marginTop: '10%',
              }}
              customGradient={[styles.customGrad]}
              // rightImage
              // icon={Images.share}
              text={'Open in Binance'}
            />
            {/* </View> */}
            <View style={{marginTop: 15}}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  marginTop: 15,
                  fontFamily: Fonts.medium,
                }}>
                Instructions
              </Text>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                }}></Text>

              <View style={{flexDirection: 'row'}}>
                <Image
                  style={{
                    height: 10,
                    width: 10,
                    transform: [
                      {
                        rotate: '270deg',
                      },
                    ],
                    top: 5,
                  }}
                  resizeMode="contain"
                  source={Images.DownArw}
                />
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.normal,
                    fontSize: 12,
                  }}>
                  This above shown calculation is an approx value. The
                  transaction will be executed at market value
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Image
                  style={{
                    height: 10,
                    width: 10,
                    transform: [
                      {
                        rotate: '270deg',
                      },
                    ],
                    top: 5,
                  }}
                  resizeMode="contain"
                  source={Images.DownArw}
                />
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    paddingHorizontal: 10,
                    fontFamily: Fonts.normal,
                    fontSize: 12,
                  }}>
                  The deposit into the card may take up 24 hours
                </Text>
              </View>
            </View>

            {/* <TouchableOpacity onPress={() => {
              setIsButtonPresses(true)
            }}>
              <Text
                style={[
                  {
                    color: ThemeManager.colors.textColor,
                    fontFamily: Fonts.medium,
                    textAlign: 'center',
                    marginTop: 10,
                  },
                ]}>
                Calculate Receiving Amount
              </Text>
            </TouchableOpacity> */}
          </View>
          <View style={{marginBottom: 30}}>
            {/* <Text style={[styles.NoteStyle, { color: Colors.buttonColor5, },]}>
          Note: Minimum Deposit value is : {prop.tokenListItem[0]?.min_deposit} {prop.tokenListItem[0]?.coin_symbol.toUpperCase()} ( ERC20 )
        </Text>
        <Text style={[styles.NoteStyle, { color: Colors.buttonColor5 },]}>
          Note: {prop?.fees?.toString() }% fee will be applied to each deposit.
        </Text> */}
          </View>
        </View>
      </View>

      {/* <Modal visible={isButtonPresses} onRequestClose={setIsButtonPresses}

      >
         <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
          <View style={{flex: 1}}>
            <SimpleHeader
              title={'Deposit'}
              backImage={ThemeManager.ImageIcons.iconBack}
              titleStyle={{marginRight: 30}}
              imageShow
              back={false}
              backPressed={() => {
                // Actions.pop();
                setIsButtonPresses(false);
              }}
            />
            <BorderLine
              borderColor={{backgroundColor: ThemeManager.colors.chooseBorder}}
            />
            <View style={[styles.innerContainer]}>
              <View style={[styles.qrCode_wrap, {paddingHorizontal: 25}]}>
              <Text
                    style={{
                      color: ThemeManager.colors.lightTextColor,
                      fontFamily: Fonts.regular,
                      fontSize:12,
                      marginBottom:10
                    }}>
                    Select currency to calculate top-up
                  </Text>
                <View
                  style={{
                    borderColor: ThemeManager.colors.inputBorderColor,
                    borderRadius: 12,
                    borderWidth: 1,
                    height: 50,
                    width: '100%',
                    alignItems: 'center',
                    // marginTop: 13,
                    // marginHorizontal: 30,
                    flexDirection: 'row',
                  }}>
                  <SelectDropdown
                    // statusBarTranslucent
                    dropdownOverlayColor="#0001"
                    data={coinList}
                    buttonStyle={{
                      // fontFamily: Fonts.regular,
                      backgroundColor: ThemeManager.colors.backgroundColor,
                      // backgroundColor: "green",
                      width: '100%',
                      height: 45,
                      borderRadius: 12,
                      paddingHorizontal: 10,
                    }}
                    buttonTextStyle={{
                      fontFamily: Fonts.regular,
                      fontSize: 16,
                      color: ThemeManager.colors.textColor,
                      textAlign: 'left',
                    }}
                    dropdownStyle={{
                      backgroundColor: ThemeManager.colors.backgroundColor,
                      borderRadius: 10,
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
                      <Image
                        source={ThemeManager.ImageIcons.dropIconDown}
                        style={{width: 10, height: 10, marginBottom: 2}}
                        resizeMode="contain"
                      />
                    )}
                    onSelect={(selectedItem, index) => {
                      setTokenFirst(selectedItem);
                      setConvertedAmount()
                      setAmount('')
                      //console.log('MM','checkDropDwonSelect', selectedItem, index);
                      // setTokenOneAmount(0);
                      // setTokenTwoAmount(0);
                      // setFromCoin(selectedItem);
                      // setTokenFirst(selectedItem);
                      // setTimeout(() => {
                      //   getUserBal(selectedItem);
                      // }, 1500);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      //   alert(selectedItem)
                      return selectedItem?.coin_symbol ;
                    }}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item?.coin_symbol ;
                    }}
                    renderCustomizedButtonChild={(item, index) => {
                      // let a = coinList;
                      //console.log('MM','checkA', a);
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={{uri: tokenFirst?.coin_image}}
                            style={{
                              borderRadius: 8,
                              width: 20,
                              height: 20,
                              marginRight: 10,
                            }}
                            resizeMode="contain"
                          />

                          <Text
                            style={{
                              fontFamily: Fonts.semibold,
                              fontSize: 16,
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
                      // let a =
                      //   coinList != undefined && index >= 0 ? coinList[index] : {};
                      // let a = coinList;

                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          {item ? (
                            <Image
                              source={{uri: item?.coin_image}}
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
                            {item?.is_token == '1' ? " ( "+ item?.token_type + " )" : "" }
                          </Text>

                        </View>
                      );
                    }}
                  />

                
                </View>
                <Text
                    style={{
                      color: ThemeManager.colors.lightTextColor,
                      fontFamily: Fonts.regular,
                      fontSize:12,
                      marginTop:15,
                      marginBottom:10
                    }}>
                    Enter amount to know how much deposit needs to be done to get the same deposit in card
                  </Text>
                <View
                  style={{
                    borderColor: ThemeManager.colors.inputBorderColor,
                    borderRadius: 12,
                    borderWidth: 1,
                    height: 50,
                    width: '100%',
                    
                    paddingHorizontal:15,
                    alignItems: 'center',
                    // marginTop: 13,
                    // marginHorizontal: 30,
                    flexDirection: 'row',
                    justifyContent:'space-between'
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
                      

                    }}
                    placeholderTextColor={ThemeManager.colors.lightTextColor}
                    placeholder={`Enter amount`}
                    keyboardType={'numeric'}
                    onChangeText={value => {
                      var expression = new RegExp('^\\d*\\.?\\d{0,' + '}$');
                      if (expression.test(value)) {
                        setAmount(value);
                        timerRef.current && clearTimeout(timerRef.current)
                        timerRef.current = setTimeout(() => {

                          value > 0 && value != "" &&  getPrice(value)
                        }, 500);
                        // getPrice(value)
                      }
                    }}
                  />
                   <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.semibold
                    }}>
                    USD
                  </Text>
                  </View>
                  <Text
                    style={{
                      color: ThemeManager.colors.lightTextColor,
                      fontFamily: Fonts.regular,
                      fontSize:12,
                      marginTop:15,
                      marginBottom:10
                    }}>
                    Top up value
                  </Text>
                <View
                  style={{
                    borderColor: ThemeManager.colors.inputBorderColor,
                    borderRadius: 12,
                    borderWidth: 1,
                    height: 50,
                    width: '100%',
                    // marginTop:15,
                    paddingHorizontal:15,
                    alignItems: 'center',
                    // marginTop: 13,
                    // marginHorizontal: 30,
                    flexDirection: 'row',
                    justifyContent:'space-between'
                  }}>
                <TextInput
                    value={convertedAmount?.toString()}
                    maxLength={8}
                    style={{
                      width: '80%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.regular,

                    }}
                    placeholderTextColor={ThemeManager.colors.lightTextColor}
                    placeholder={`Converted amount`}
                    keyboardType={'numeric'}
                    editable={false}
                    // onChangeText={value => {
                    //   var expression = new RegExp('^\\d*\\.?\\d{0,' + '}$');
                    //   if (expression.test(value)) {
                    //     setAmount(value);
                    //     timerRef.current && clearTimeout(timerRef.current)
                    //     timerRef.current = setTimeout(() => {
                    //         getPrice(value)
                    //     }, 200);
                    //     // getPrice(value)
                    //   }
                    // }}
                  />
                   <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.semibold
                    }}>
                    {tokenFirst?.coin_symbol?.toUpperCase()}
                  </Text>
                  </View>

              
              </View>
              
            </View>
            <View style={{marginBottom: 30}}>
              <View style={{paddingHorizontal: 25}}>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    marginTop: 15,
                    fontFamily: Fonts.medium,
                  }}>
                  Instructions
                </Text>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                  }}></Text>
                
                <View style={{flexDirection: 'row', marginTop: 15}}>
                  <Image
                    style={{
                      height: 10,
                      width: 10,
                      transform: [
                        {
                          rotate: '270deg',
                        },
                      ],
                      top: 5,
                    }}
                    resizeMode="contain"
                    source={Images.DownArw}
                  />
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      paddingHorizontal: 10,
                      fontFamily: Fonts.normal,
                      fontSize: 12,
                    }}>
                    This is strict instruction to invest as much as you can as
                    in future we will give you 20% cashback bonus.
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                  <Image
                    style={{
                      height: 10,
                      width: 10,
                      transform: [
                        {
                          rotate: '270deg',
                        },
                      ],
                      top: 5,
                    }}
                    resizeMode="contain"
                    source={Images.DownArw}
                  />
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      paddingHorizontal: 10,
                      fontFamily: Fonts.normal,
                      fontSize: 12,
                    }}>
                    This is strict instruction to invest as much as you can as
                    in future we will give you 20% cashback bonus.
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                  <Image
                    style={{
                      height: 10,
                      width: 10,
                      transform: [
                        {
                          rotate: '270deg',
                        },
                      ],
                      top: 5,
                    }}
                    resizeMode="contain"
                    source={Images.DownArw}
                  />
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      paddingHorizontal: 10,
                      fontFamily: Fonts.normal,
                      fontSize: 12,
                    }}>
                    This is strict instruction to invest as much as you can as
                    in future we will give you 20% cashback bonus.
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                  <Image
                    style={{
                      height: 10,
                      width: 10,
                      transform: [
                        {
                          rotate: '270deg',
                        },
                      ],
                      top: 5,
                    }}
                    resizeMode="contain"
                    source={Images.DownArw}
                  />
                  <Text
                    style={{
                      color: ThemeManager.colors.textColor,
                      paddingHorizontal: 10,
                      fontFamily: Fonts.normal,
                      fontSize: 12,
                    }}>
                    This is strict instruction to invest as much as you can as
                    in future we will give you 20% cashback bonus.
                  </Text>
                </View>
              </View>

              <BasicButton
                onPress={() => {
                  // shareAction();
                  // getPrice();
                  setIsButtonPresses(false);
                }}
                btnStyle={[styles.btnStyle, {marginTop: 40}]}
                customGradient={[styles.customGrad]}
                // rightImage
                icon={Images.share}
                text={'Get crypto address'}
              />
            </View>
          </View>
        </ScrollView>
        </Wrap>
      </Modal> */}
      <Toast ref={toast} />
      {/* {isLoading && <Loader />} */}
    </Wrap>
  );
};

export default SaitaCardBinanceQr;
