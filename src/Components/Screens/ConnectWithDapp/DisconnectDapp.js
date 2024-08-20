import { View, Text, Image, ScrollView} from 'react-native';
import React,{useEffect} from 'react';
import styles from './ConnectWithDappStyles';
import { Fonts, Images } from '../../../theme';
import moment from 'moment';
import { BasicButton, BorderLine, SimpleHeader } from '../../common';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import CurrencyCard from '../../common/CurrencyCard';
import Singleton from '../../../Singleton';
import { IS_PRODUCTION } from '../../../Endpoints';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import * as Constants from '../../../Constant';

const DisconnectDapp = ({
  setvisible,
  selectedDapp,
  onDisconnect,
  isPrivateKey
}) => {
  console.log("isPrivateKey:::::",isPrivateKey);
  // useEffect(()=>{
  //   Singleton.getInstance()
  //   .newGetData(Constants.IS_PRIVATE_WALLET)
  //   .then(isPrivateWallet => {
  //     if(isPrivateWallet=='stc' || isPrivateWallet=='matic' ||isPrivateWallet=='eth' || isPrivateWallet=='stc'){
  //       isPrivateKey=isPrivateWallet
  //     }
  //   });
  // },[selectedDapp])
  const getCurrencyFromChainId = chainId => {
    let currency = {
      coin_icon: '',
      coin_chain: '',
      coin_address: '',
      chainId: '',
    };
    global.alreadyCalled = false;
    if (chainId == 1 || chainId == 5) {
      currency = {
        coin_icon: require('../../../../assets/images/ETH.png'),
        coin_chain: 'Ethereum',
        coin_address: Singleton.getInstance().defaultEthAddress,
        chainId: IS_PRODUCTION == 0 ? 5 : 1,
      };
    } else if (chainId == 56 || chainId == 97) {
      currency = {
        coin_icon: ThemeManager.ImageIcons.bnb,
        coin_chain: 'Binance Smart Chain(BNB)',
        coin_address: Singleton.getInstance().defaultBnbAddress,
        chainId: IS_PRODUCTION == 0 ? 97 : 56,
      };
    } else if(chainId == 137){
      currency = {
        coin_icon: Images.polygon,
        coin_chain: 'Polygon',
        coin_address: Singleton.getInstance().defaultEthAddress,
        chainId: 137,
      };
    }else if(chainId == 1209){
      currency = {
        coin_icon: {uri:'https://s2.coinmarketcap.com/static/img/coins/64x64/20513.png'},
        coin_chain: 'Saitachain',
        coin_address: Singleton.getInstance().defaultStcAddress,
        chainId: 1209,
      };
    }
    currency={...currency,isAvailable:selectedDapp?.optionalNamespaces?.eip155?.chains?.includes(`eip155:${chainId}`) || selectedDapp?.requiredNamespaces?.eip155?.chains?.includes(`eip155:${chainId}`)}
    return currency;
  };
  let data = selectedDapp?.peer?.metadata;
  return (
    <View style={styles.modalViewStyle}>
      <SimpleHeader
        title={LanguageManager.WalletConnect}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          setvisible(false);
        }}
      />
       <BorderLine
                        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
                    />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>

        <Image
         source={{ uri: data?.icons[1] || data?.icons[0] }}
          style={{ height: areaDimen(81), width: areaDimen(81), marginTop: heightDimen(20), alignSelf: 'center' }}
          resizeMode="contain"
        />
        <Text
          allowFontScaling={false}
          style={[
            styles.appNameStyle,
            { color: ThemeManager.colors.textColor },
          ]}>
           {data?.name != "" ? data?.name : "Home" }
        </Text>
        <Text
          allowFontScaling={false}
          style={[
            {
              fontSize: areaDimen(14),
              paddingTop: heightDimen(12),
              textAlign: 'center',
              lineHeight: heightDimen(24),
              fontFamily: Fonts.regular,
              color: ThemeManager.colors.inActiveColor,
            },
          ]}>
          {data?.url}
        </Text>
        <View
          style={{
            backgroundColor: ThemeManager.colors.swapBg,
            borderRadius: 10,
            padding: 15,
            marginTop: heightDimen(55),
            marginHorizontal: widthDimen(22)
          }}>
          <Text
            allowFontScaling={false}
            style={[
              styles.appNameStyle,
              {
                color: ThemeManager.colors.textColor,
                fontSize: areaDimen(16),
                lineHeight: heightDimen(19),
                marginTop: 0,
                fontFamily: Fonts.medium,
              },
            ]}>
            Connected on {`${moment.unix(selectedDapp?.expiry).subtract(7, 'days').format('L')}` + ' at ' +
                        `${moment.unix(selectedDapp?.expiry).subtract(7, 'days').format('hh:mma')}`}
          </Text>
        </View>
        <View
          style={{
            borderRadius: areaDimen(12),
            marginTop: heightDimen(20),
            paddingBottom: 10,
            marginHorizontal: widthDimen(22)
          }}>
          {(isPrivateKey === Constants.COIN_SYMBOL.ETH || isPrivateKey == '0')  && getCurrencyFromChainId(1)?.isAvailable &&(
            <CurrencyCard
              disabled={true}
              styleNew={[styles.currencyCardStyle, { marginHorizontal: 0 }]}
              image={getCurrencyFromChainId(1)?.coin_icon}
              style={{
                height: areaDimen(35),
                width: areaDimen(35),
              }}
              blockChain={getCurrencyFromChainId(1)?.coin_chain}
              address={
                getCurrencyFromChainId(1)?.coin_address ||
                Singleton.getInstance().defaultEthAddress ||
                Singleton.getInstance().defaultBnbAddress
              }
              addStyle={{ color: ThemeManager.colors.textColor }}
              textStyle={{ color: ThemeManager.colors.inActiveColor }}
            />
          )}
          {(isPrivateKey == 'bnb' || isPrivateKey == '0') && getCurrencyFromChainId(56)?.isAvailable &&(
            <CurrencyCard
              disabled={true}
              styleNew={[styles.currencyCardStyle, { marginHorizontal: 0 }]}
              image={getCurrencyFromChainId(56)?.coin_icon}
              style={{
                height: areaDimen(35),
                width: areaDimen(35),
              }}
              blockChain={getCurrencyFromChainId(56)?.coin_chain}
              address={
                getCurrencyFromChainId(56)?.coin_address ||
                Singleton.getInstance().defaultEthAddress ||
                Singleton.getInstance().defaultBnbAddress
              }
              addStyle={{ color: ThemeManager.colors.textColor }}
              textStyle={{ color: ThemeManager.colors.inActiveColor }}
            />
          )}
          {(isPrivateKey == 'matic' || isPrivateKey == '0') && getCurrencyFromChainId(137)?.isAvailable && (
            <CurrencyCard
              disabled={true}
              styleNew={[styles.currencyCardStyle, { marginHorizontal: 0 }]}
              image={getCurrencyFromChainId(137)?.coin_icon}
              style={{
                height: areaDimen(35),
                width: areaDimen(35),
              }}
              blockChain={getCurrencyFromChainId(137)?.coin_chain}
              address={
                getCurrencyFromChainId(137)?.coin_address ||
                Singleton.getInstance().defaultEthAddress ||
                Singleton.getInstance().defaultBnbAddress
              }
              addStyle={{ color: ThemeManager.colors.textColor }}
              textStyle={{ color: ThemeManager.colors.inActiveColor }}
            />
          )}
           {(isPrivateKey == 'stc' || isPrivateKey == '0') && getCurrencyFromChainId(1209)?.isAvailable && (
            <CurrencyCard
              disabled={true}
              styleNew={[styles.currencyCardStyle, { marginHorizontal: 0 }]}
              image={getCurrencyFromChainId(1209)?.coin_icon}
              style={{
                height: areaDimen(35),
                width: areaDimen(35),
                borderRadius:areaDimen(70)
              }}
              blockChain={getCurrencyFromChainId(1209)?.coin_chain}
              address={
                getCurrencyFromChainId(1209)?.coin_address ||
                Singleton.getInstance().defaultEthAddress ||
                Singleton.getInstance().defaultBnbAddress
              }
              addStyle={{ color: ThemeManager.colors.textColor }}
              textStyle={{ color: ThemeManager.colors.inActiveColor }}
            />
          )}
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: heightDimen(10), paddingHorizontal: widthDimen(22), }}>
          <BasicButton
            btnstyle={styles.connect}
            onPress={() => {
              onDisconnect(selectedDapp);
            }}
            textStyle={{
              fontSize: 16,
              fontFamily: Fonts.medium,
              paddingVertical: 5,
            }}
            text="Disconnect"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DisconnectDapp;
