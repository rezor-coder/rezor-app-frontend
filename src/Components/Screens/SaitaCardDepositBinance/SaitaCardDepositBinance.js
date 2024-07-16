/* eslint-disable react-native/no-inline-styles */
import Clipboard from '@react-native-community/clipboard';
import React, { createRef, useRef, useState } from 'react';
import {
  Image,
  Linking,
  Share,
  Text, TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-easy-toast';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { APIClient } from '../../../Api';
import * as constants from '../../../Constant';
import {
  BINANCE_PRICE_CONVERSION
} from '../../../Endpoints';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, goBack } from '../../../navigationsService';
import { Colors, Fonts, Images } from '../../../theme';
import images from '../../../theme/Images';
import { BasicButton, MainStatusBar, SimpleHeader } from '../../common';
import { BorderLine, Wrap } from '../../common/index';
import Loader from '../Loader/Loader';
import styles from './SaitaCardDepositBinanceStyle';

var qrBase64 = '';
const SaitaCardDepositBinance = prop => {
  // const [publicAddress, setPublicAddress] = useState(prop.myAddress);
  // const [walletData, setwalletData] = useState(prop.item);

  const [bpayData, setBpayData] = useState({});
  const toast = createRef();
  const [isButtonPresses, setIsButtonPresses] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef();
  const [showQR, setshowQR] = useState(false);

  const [amount, setAmount] = useState('0');
  const [coinList, setCoinList] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState();

  const getPrice = async val => {
    if (val == 0) {
      return;
    }
    setIsLoading(true);
    // let token = await Singleton.getInstance().newGetData(constants.black_access_token)
    let token = prop?.route?.params?.token;
    let req = { amount: val };
    console.log(req);
    // fetch('http://10.1.5.89:3000/api/v1/liminal/Calculator', {
    //   method: 'POST',
    //   body: JSON.stringify(req),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    APIClient.getInstance()
      .centralisedApi(BINANCE_PRICE_CONVERSION, req, token)
      // .then(res => res.json())
      .then(res => {
        console.log(res);

        if (res?.status) {
          setBpayData(res?.data?.data);
          setshowQR(true)
        } else {
          setIsLoading(false);
          Singleton.showAlert(res?.message || 'Unable to process your request');
        }
      })
      .catch(err => {
        setIsLoading(false);
        Singleton.showAlert(err?.message || constants.SOMETHING_WRONG);
        console.log(err);
      });
  };

  const throttleFn = (func, delay = 600) => {
    let isClicked = false
    return (val) => {
      if (!isClicked) {
        func(val)
        isClicked = true
        setTimeout(() => {
          isClicked = false
        }, delay);
      }
    }
  }

  const getGasOptimized = throttleFn(getPrice, 600)

  const shareAction = () => {
    try {
      const result = Share.share({
        message: `Please open this url to make payment ${bpayData?.universalUrl}`,
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

  const numPressed = num => {
    num = num?.toString();
    console.log('amount---', amount, amount?.length);
    if (num == '') return;
    if (num == 'Del') {
      if (amount?.length > 0) {
        let newAmount = amount?.slice(0, amount?.length - 1);
        console.log('new amm', newAmount);
        setAmount(newAmount ? newAmount : '0');
      }
      if (amount == undefined) {
        setAmount('0');
      }
      return;
    }
    if (amount?.includes('.')) {
      if (num == '.') return;
      console.log(
        '[1]',
        amount?.split('.')[1],
        amount?.split('.')[1]?.length,
      );
      if (
        amount?.split('.')[1]?.length != undefined &&
        amount?.split('.')[1]?.length >= (6)
      ) {
        console.log(
          '....',
          amount?.split('.')[1]?.length,
        );
        return;
      }
    } else {
      if (amount?.length > 11) {
        return
      }
    }

    setAmount(prev => {
      console.log('prev..', prev, 'num..', num);
      return prev == '0' ? (num == '.' ? '0.' : num) : prev + num;
    });
  }


  const MyButton = ({ num }) => {
    return (
      <TouchableOpacity
        onPress={() => numPressed(num)}
        style={{ width: '33%', alignSelf: 'center', alignItems: 'center' }}>
        <Text style={[styles.Number, { color: ThemeManager.colors.textColor }]}>{num}</Text>
      </TouchableOpacity>
    );
  };

  const copyAction = () => {
    // console.warn('MM','---------', tokenFirst?.wallet_address);
    Clipboard.setString(bpayData?.universalUrl);
    toast.current.show(constants.COPIED);
  };

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
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
          titleStyle={{ marginRight: 30 }}
          imageShow
          back={false}
          backPressed={() => {
            if (showQR) {
              setshowQR(false)
              setAmount('0')
              setBpayData({})
            } else
              getCurrentRouteName() != 'SaitaCardsInfo' && goBack();
          }}
          // rightIcon={images.infoBPay}
          onPressHistory={() => {

          }}
        />
        <BorderLine
          borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
        />
      <View style={{flex:1}}>
        {showQR ? (
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
                <View
                  style={{
                    height: 166,
                    width: 166,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderRadius: 5,
                    marginTop: 10,
                    borderColor: '#5552',
                  }}>
                  <FastImage
                    onLoad={() => {
                      console.log('load');
                      setIsLoading(false);
                    }}
                    source={{uri: bpayData?.qrcodeLink}}
                    style={{
                      height: 156,
                      width: 156,
                    }}
                    resizeMode="contain"
                  />
                  {isLoading && (
                    <View
                      style={{
                        position: 'absolute',
                        width: '100%',
                        heigth: '100%',
                      }}>
                      <SkeletonPlaceholder
                        borderRadius={5}
                        backgroundColor="#5555">
                        <SkeletonPlaceholder.Item height={166} width={166} />
                      </SkeletonPlaceholder>
                    </View>
                  )}
                </View>
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

              <BasicButton
                onPress={() => {
                  Linking.openURL(bpayData?.deeplink)
                    .then(res => {
                      console.log(res);
                    })
                    .catch(err => {
                      console.log(err);
                      Singleton.showAlert('Unable to found Binance app');
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
                text={'Open in Binance'}
              />
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

            
            </View>
            <View style={{marginBottom: 30}} />
          </View>)
          :<>
            <View style={{ paddingHorizontal: 14, paddingVertical: 10, marginTop: 90, alignSelf: 'center', borderRadius: 40, backgroundColor: ThemeManager.colors.bgLight, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <FastImage source={images.usdtRound} style={{ height: 22, width: 22 }} resizeMode='contain' />
          <Text style={{ color: ThemeManager.colors.textColor, marginLeft: 10, fontSize: 13, fontFamily: Fonts.semibold }}>USDT</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Text style={{
            color: ThemeManager.colors.textColor, fontSize: 40, fontFamily: Fonts.medium, textAlign: 'center'
          }}>USDT {amount}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ marginTop: 30 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 40,
              marginVertical: 20
            }}>
              <MyButton num={'1'} />
              <MyButton num={'2'} />
              <MyButton num={'3'} />
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 40,
              marginVertical: 20
            }}>
              <MyButton num={'4'} />
              <MyButton num={'5'} />
              <MyButton num={'6'} />
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 40,
              marginVertical: 20
            }}>
              <MyButton num={'7'} />
              <MyButton num={'8'} />
              <MyButton num={'9'} />
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 40,
              marginVertical: 20
            }}>
              <MyButton num={'.'} />
              <MyButton num={'0'} />
              <TouchableOpacity
                onPress={() => numPressed('Del')}
                style={{ width: '33%', alignSelf: 'center', alignItems: 'center' }}
              >
                <Image source={Images.del} style={{ width: 22, height: 22, tintColor: ThemeManager.colors.textColor }} resizeMode='contain' />
              </TouchableOpacity>

            </View>
          </View>

          <BasicButton
            onPress={() => {
              if (amount == 0) {

                Singleton.showAlert('Please enter amount')
              }
              else if (isNaN(amount)) {

                Singleton.showAlert('Please enter valid amount')
              }
              else {
                getGasOptimized(amount)
              }
            }}
            textStyle={{
              fontSize: 16,
            }}

            btnStyle={{ marginHorizontal: 20, marginVertical: 10, marginBottom:20 }}
            text={'Continue'}
            customGradient={{ borderRadius: 12 }}
          />
        </View>
          </>
        }
      </View>
      </View>

      <Toast ref={toast} />
      {isLoading && !bpayData?.totalFee && <Loader />}
    </Wrap>
  );
};

export default SaitaCardDepositBinance;
