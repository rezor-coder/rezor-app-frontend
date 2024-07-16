import {View, Text, Image, Dimensions} from 'react-native';
import React from 'react';
import styles from './ConnectWithDappStyles';
// import { SimpleBackHeader } from '../../common/SimpleBackHeader';
import {Colors, Fonts, Images} from '../../../theme';
import CurrencyCard from '../../common/CurrencyCard';
import {
  BasicButton,
  BorderLine,
  ButtonPrimary as Button,
  LightButton,
  SimpleHeader,
} from '../../common';
import {IS_PRODUCTION} from '../../../Endpoints';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import {ScrollView} from 'react-native-gesture-handler';
import images from '../../../theme/Images';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
import { useEffect } from 'react';
import * as Constants from '../../../Constant';
// let isPrivateKey = null
const ApproveConnection = ({
  sessionRequestPayload,
  onConnectionConfirm,
  onRejectSession,
  chainList,
  isPrivateKey
}) => {
  console.log("isPrivateKey",isPrivateKey);
  // useEffect(()=>{
  //  if(!isPrivateKey){
  //   setTimeout(() => {
  //     Singleton.getInstance()
  //   .newGetData(Constants.IS_PRIVATE_WALLET)
  //   .then(isPrivateWallet => {
  //     if(isPrivateWallet=='stc' || isPrivateWallet=='matic' ||isPrivateWallet=='eth' || isPrivateWallet=='stc'){
  //       isPrivateKey=isPrivateWallet
  //     }else{
  //       isPrivateKey='0'
  //     }
  //   });
  //   }, 500);
  //  }
  // },[sessionRequestPayload,isPrivateKey])
  console.log("isPrivateKey:::::,isPrivateKey",isPrivateKey);
  const getCurrencyFromChainId = chainId => {
    let currency = {
      coin_icon: '',
      coin_chain: '',
      coin_address: '',
      chainId: '',
    };
    console.log("includes",chainId,sessionRequestPayload?.params?.optionalNamespaces?.eip155?.chains?.includes(`eip155:${chainId}`));
    global.alreadyCalled = false;
     if (chainId == 56 || chainId == 97) {
      currency = {
        coin_icon: ThemeManager.ImageIcons.bnb,
        coin_chain: 'Binance Smart Chain(BNB)',
        coin_address: Singleton.getInstance().defaultBnbAddress,
        chainId: IS_PRODUCTION == 0 ? 97 : 56,
      };
    } else if (chainId == 137){
      currency = {
        coin_icon: Images.polygon,
        coin_chain: 'Polygon',
        coin_address: Singleton.getInstance().defaultEthAddress,
        chainId: 137,
      };
    } else if (chainId == 1209){
      currency = {
        coin_icon: {uri:'https://s2.coinmarketcap.com/static/img/coins/64x64/20513.png'},
        coin_chain: 'Saitachain',
        coin_address: Singleton.getInstance().defaultStcAddress,
        chainId: 1209,
      };
    }else if (chainId == 1 || chainId == 5) {
      currency = {
        coin_icon: require('../../../../assets/images/ETH.png'),
        coin_chain: 'Ethereum',
        coin_address: Singleton.getInstance().defaultEthAddress,
        chainId: IS_PRODUCTION == 0 ? 5 : 1,
      };
    }
    currency={...currency,isAvailable:sessionRequestPayload?.params?.optionalNamespaces?.eip155?.chains?.includes(`eip155:${chainId}`) || sessionRequestPayload?.params?.requiredNamespaces?.eip155?.chains?.includes(`eip155:${chainId}`)}
    return currency;
  };
  const renderVerifyView = () => {
    const validation = sessionRequestPayload.verifyContext.verified.validation; // can be VALID, INVALID or UNKNOWN
    const origin = sessionRequestPayload.verifyContext.verified.origin; // the actual verified origin of the request
    const isScam = sessionRequestPayload.verifyContext.verified.isScam; // true if the domain is flagged as malicious
    console.log('validation', validation, 'origin', origin, 'isScam', isScam);
    // if the domain is flagged as malicious, you should warn the user as they may lose their funds - check the `Threat` case for more info
    if (isScam) {
      return (
        <View
          style={{
            flexDirection: 'row',
            marginTop: heightDimen(10),
            padding: areaDimen(8),
            backgroundColor: '#FDEDED',
            marginHorizontal: widthDimen(22),
            borderRadius: areaDimen(12),
          }}>
          <View
            style={{paddingRight: widthDimen(10), justifyContent: 'center'}}>
            <FastImage
              source={images.wcAlert}
              style={{height: areaDimen(30), width: areaDimen(30)}}
              resizeMode="contain"
              tintColor={'red'}
            />
          </View>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: 'red',
                fontFamily: Fonts.semibold,
                fontSize: areaDimen(14),
              }}>
              Known Security Risk
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: Fonts.medium,
                fontSize: areaDimen(12),
                marginTop: heightDimen(5),
              }}
              // numberOfLines={3}
            >
              This domain has flagged as unsafe by multiple security providers.
              Leave immediately to protect your assets.
            </Text>
          </View>
        </View>
      );
    }

    switch (validation) {
      case 'VALID': // proceed with the request - check the `Domain match` case for more info
      return (
        <View
          style={{
            flexDirection: 'row',
            marginTop: heightDimen(15),
            padding: areaDimen(10),
            backgroundColor: '#FDEDED',
            marginHorizontal: widthDimen(22),
            borderRadius: areaDimen(12),
            alignItems:'center'
          }}>
          <View
            style={{paddingRight: widthDimen(10), justifyContent: 'center'}}>
            <FastImage
              source={images.wcAlert}
              style={{height: areaDimen(30), width: areaDimen(30)}}
              resizeMode="contain"
              tintColor={'orange'}
            />
          </View>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: 'orange',
                fontFamily: Fonts.semibold,
                fontSize: areaDimen(14),
              }}>
              Domain verified
            </Text>
          </View>
        </View>
      );
        break;
      case 'INVALID':
        // show a warning dialog to the user - check the `Mismatch` case for more info
        // and proceed only if the user accepts the risk
        return (
          <View
            style={{
              flexDirection: 'row',
              marginTop: heightDimen(15),
              padding: areaDimen(10),
              backgroundColor: '#FDEDED',
              marginHorizontal: widthDimen(22),
              borderRadius: areaDimen(12),
            }}>
            <View
              style={{paddingRight: widthDimen(10), justifyContent: 'center'}}>
              <FastImage
                source={images.wcAlert}
                style={{height: areaDimen(30), width: areaDimen(30)}}
                resizeMode="contain"
                tintColor={'red'}
              />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'red',
                  fontFamily: Fonts.semibold,
                  fontSize: areaDimen(14),
                }}>
                Domain mismatch
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontFamily: Fonts.medium,
                  fontSize: areaDimen(12),
                  marginTop: heightDimen(5),
                }}
                // numberOfLines={3}
              >
                This website has a domain that does not match the sender of this
                request. Approving may lead to loss of funds.
              </Text>
            </View>
          </View>
        );
        break;
      case 'UNKNOWN':
        // show a warning dialog to the user - check the `Unverified` case for more info
        // and proceed only if the user accepts the risk
        return (
          <View
            style={{
              flexDirection: 'row',
              marginTop: heightDimen(15),
              padding: areaDimen(10),
              backgroundColor: '#FFF2E6',
              marginHorizontal: widthDimen(22),
              borderRadius: areaDimen(12),
            }}>
            <View
              style={{paddingRight: widthDimen(10), justifyContent: 'center'}}>
              <FastImage
                source={images.wcAlert}
                style={{height: areaDimen(30), width: areaDimen(30)}}
                resizeMode="contain"
                tintColor={'orange'}
              />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'orange',
                  fontFamily: Fonts.semibold,
                  fontSize: areaDimen(14),
                }}>
                Unknown domain
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontFamily: Fonts.medium,
                  fontSize: areaDimen(12),
                  marginTop: heightDimen(5),
                }}>
                This domain cannot be verified. Check the request carefully
                before approving.
              </Text>
            </View>
          </View>
        );
        break;
    }
  };
  return (
    <View style={styles.modalViewStyle}>
      <SimpleHeader
        title={LanguageManager.WalletConnect}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          onRejectSession(sessionRequestPayload);
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <ScrollView style={{flex: 1,paddingBottom:heightDimen(20)}} contentContainerStyle={{flexGrow: 1}}>
        <Image
          source={
            sessionRequestPayload?.params?.proposer?.metadata?.icons?.[0]
              ? {
                  uri: sessionRequestPayload?.params?.proposer?.metadata?.icons[
                    sessionRequestPayload?.params?.proposer?.metadata?.icons
                      ?.length - 1
                  ],
                }
              : images.icon_walletConnect
          }
          style={{
            height: areaDimen(81),
            width: areaDimen(81),
            marginTop: heightDimen(20),
            alignSelf: 'center',
          }}
        />
        <Text
          allowFontScaling={false}
          style={[
            styles.appNameStyle,
            {
              color: ThemeManager.colors.textColor,
              paddingHorizontal: widthDimen(22),
            },
          ]}>
          {/* {sessionRequestPayload?.params[0]?.peerMeta?.name} */}
          {sessionRequestPayload?.params?.proposer?.metadata?.name || 'Home'}
        </Text>
        <Text
          allowFontScaling={false}
          style={[
            styles.walletListingTextStyle,
            {
              fontFamily: Fonts.regular,
              fontSize: areaDimen(14),
              paddingTop: heightDimen(10),
              textAlign: 'center',
              paddingHorizontal: widthDimen(22),
              // lineHeight:heightDimen(24),
              color: ThemeManager.colors.inActiveColor,
            },
          ]}>
          Interface wants to connect to your Wallet.
        </Text>
        <View
          style={[
            styles.walletListingStyle,
            {backgroundColor: Colors.screenWhite},
          ]}>
          <Text
            allowFontScaling={false}
            style={[
              styles.walletListingTextStyle,
              {
                fontSize: areaDimen(16),
                paddingTop: heightDimen(28),
                fontFamily: Fonts.semibold,
                color: ThemeManager.colors.textColor,
                lineHeight: heightDimen(19),
                paddingBottom: heightDimen(5),
              },
            ]}>
            Wallet Name
          </Text>
          <View>
            {(isPrivateKey == 'eth' || isPrivateKey == '0') && getCurrencyFromChainId(1)?.isAvailable && (
              <CurrencyCard
                disabled={true}
                styleNew={styles.currencyCardStyle}
                image={getCurrencyFromChainId(1)?.coin_icon}
                onPress={() => onPressWalletConnect()}
                style={{
                  height: areaDimen(35),
                  width: areaDimen(35),
                }}
                blockChain={getCurrencyFromChainId(1)?.coin_chain}
                address={getCurrencyFromChainId(1)?.coin_address}
              />
            )}
            {(isPrivateKey == 'bnb' || isPrivateKey == '0') && getCurrencyFromChainId(56)?.isAvailable && (
              <CurrencyCard
                disabled={true}
                styleNew={styles.currencyCardStyle}
                image={getCurrencyFromChainId(56)?.coin_icon}
                onPress={() => onPressWalletConnect()}
                style={{
                  height: areaDimen(35),
                  width: areaDimen(35),
                }}
                blockChain={getCurrencyFromChainId(56)?.coin_chain}
                address={getCurrencyFromChainId(56)?.coin_address}
              />
            )}
            {(isPrivateKey == 'matic' || isPrivateKey == '0') &&  getCurrencyFromChainId(137)?.isAvailable &&(
              <CurrencyCard
                disabled={true}
                styleNew={styles.currencyCardStyle}
                image={getCurrencyFromChainId(137)?.coin_icon}
                onPress={() => onPressWalletConnect()}
                style={{
                  height: areaDimen(35),
                  width: areaDimen(35),
                }}
                blockChain={getCurrencyFromChainId(137)?.coin_chain}
                address={getCurrencyFromChainId(137)?.coin_address}
              />
            )}
             {(isPrivateKey == 'stc' || isPrivateKey == '0')  && getCurrencyFromChainId(1209)?.isAvailable &&(
              <CurrencyCard
                disabled={true}
                styleNew={styles.currencyCardStyle}
                image={getCurrencyFromChainId(1209)?.coin_icon}
                onPress={() => onPressWalletConnect()}
                style={{
                  height: areaDimen(35),
                  width: areaDimen(35),
                  borderRadius:areaDimen(70)
                }}
                blockChain={getCurrencyFromChainId(1209)?.coin_chain}
                address={getCurrencyFromChainId(1209)?.coin_address}
              />
            )}
            {/* </>} */}
          </View>
          <Text
            allowFontScaling={false}
            style={[
              styles.appNameStyle,
              {
                fontSize: areaDimen(14),
                marginTop: heightDimen(10),
                fontFamily: Fonts.medium,
                color: ThemeManager.colors.inActiveColor,
                alignSelf: 'flex-start',
                paddingHorizontal: widthDimen(22),
              },
            ]}>
            View the balance and activities in your wallet.
          </Text>
          {renderVerifyView()}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: heightDimen(12),
            paddingHorizontal: widthDimen(22),
            marginTop: heightDimen(20),
          }}>
          <BasicButton
            btnstyle={styles.connect}
            onPress={() => {
              onConnectionConfirm(
                getCurrencyFromChainId(
                  sessionRequestPayload?.params?.requiredNamespaces.eip155?.chains[0]?.substr(
                    7,
                    sessionRequestPayload?.params?.requiredNamespaces.eip155
                      ?.chains[0]?.length - 1,
                  ) ||
                    sessionRequestPayload?.params?.optionalNamespaces.eip155?.chains[0]?.substr(
                      7,
                      sessionRequestPayload?.params?.optionalNamespaces.eip155
                        ?.chains[0]?.length - 1,
                    ),
                ),
                sessionRequestPayload,
              );
            }}
            cus
            textStyle={{
              fontSize: 16,
              fontFamily: Fonts.medium,
              paddingVertical: 5,
            }}
            text="Connect"
          />
          <LightButton
            onPress={() => {
              onRejectSession(sessionRequestPayload);
            }}
            btnStyle={{
              width: '100%',
              height: heightDimen(60),
            }}
            customGradient={[styles.customGrad, {marginTop: heightDimen(10), borderRadius: heightDimen(30),}]}
            text={LanguageManager.cancel}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ApproveConnection;
