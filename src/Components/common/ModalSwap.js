/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Alert,
  Modal,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {BasicButton} from '.';
import {LanguageManager, ThemeManager} from '../../../ThemeManager';
import {SimpleHeaderNew} from './SimpleHeaderNew';
import {Fonts, Colors, Images} from '../../theme';
import {Actions} from 'react-native-router-flux';
import {areaDimen, heightDimen, widthDimen} from '../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
import images from '../../theme/Images';
import fonts from '../../theme/Fonts';
import {Item} from 'native-base';
import {exponentialToDecimalWithoutComma} from '../../utils';
import Singleton from '../../Singleton';
import {BorderLine} from './BorderLine'
const ModalSwap = props => {
  const {
    toCoinName,
    toCoinSymbol,
    fromCoinName,
    fromCoinSymbol,
    toValue,
    fromValue,
    txnFee,
    onPress,
    onCancel,
    symbol,
    toCoin,
    fromCoin,
    address,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  console.log('props:::::', props);
  const getnativeFiatPrice = () => {
    let price;
    if (
      fromCoinSymbol?.toLowerCase() == 'eth' ||
      fromCoinSymbol?.toLowerCase() == 'bnb'
    ) {
      price = fromCoin?.fiat_price;
    } else {
      price = toCoin?.fiat_price;
    }
    console.log("price:::::",parseFloat(txnFee)*price);
    return price;
  };
  return (
    <Modal
      style={[styles.centeredView,{ backgroundColor: ThemeManager.colors.bg}]}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        onCancel();
      }}
      visible={true}
      >
      <SafeAreaView style={[styles.centeredView,{ backgroundColor: ThemeManager.colors.bg}]}>
        <SimpleHeaderNew
          title={LanguageManager.swap}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle
          imageShow
          back={false}
          backPressed={onCancel}
          containerStyle={{
            // borderBottomWidth: 1,
            // borderColor: ThemeManager.colors.backgroundColor,
          }}
        />
        <BorderLine/>
        <View style={{flex: 1, margin: areaDimen(22)}}>
          <View style={styles.fromToView}>
            <View style={[styles.fromCoin,{backgroundColor:ThemeManager.colors.swapBg}]}>
             {fromCoin?.coin_image ? <FastImage
                source={{uri: fromCoin?.coin_image}}
                style={styles.coinImage}
                resizeMode="contain"
              />:<View style={[styles.coinImage,{backgroundColor:ThemeManager.colors.primary}]}>
                <Text style={styles.coinSymbolText}>{fromCoinName?.charAt(0)}</Text>
                </View>}
              <View style={{flexDirection: 'column'}}>
                <Text style={[styles.coinNAme,{ color: ThemeManager.colors.textColor}]}>{fromCoinName}</Text>
                <Text style={[styles.coinValue,{   color: ThemeManager.colors.inActiveColor}]}>
                  {'1 ' +
                    fromCoinSymbol +
                    ' = ' +
                    Singleton.getInstance().CurrencySymbol +
                    ' ' +
                    Singleton.getInstance().toFixednew(
                      exponentialToDecimalWithoutComma(
                        isNaN( fromCoin?.fiat_price)
                          ? 0
                          : fromCoin?.fiat_price,
                      ),
                      fromCoin?.fiat_price_decimal || 2,
                    )
                    // fromCoin?.fiat_price?.toFixed(fromCoin?.fiat_price_decimal)
                    }
                </Text>
              </View>
            </View>
            <View style={[styles.toCoin,{backgroundColor:ThemeManager.colors.swapBg}]}>
               {toCoin?.coin_image ? <FastImage
                source={{uri: toCoin?.coin_image}}
                style={styles.coinImage}
                resizeMode="contain"
              />:<View style={[styles.coinImage,{backgroundColor:ThemeManager.colors.primary}]}>
                <Text style={styles.coinSymbolText}>{toCoinName?.charAt(0)}</Text>
                </View>}
              <View>
                <Text style={[styles.coinNAme,{ color: ThemeManager.colors.textColor}]}>{toCoinName}</Text>
                <Text style={[styles.coinValue,{   color: ThemeManager.colors.inActiveColor}]}>
                  {'1 ' +
                    toCoinSymbol +
                    ' = ' +
                    Singleton.getInstance().CurrencySymbol +
                    ' ' +
                    // toCoin?.fiat_price?.toFixed(toCoin?.fiat_price_decimal)
                    Singleton.getInstance().toFixednew(
                      exponentialToDecimalWithoutComma(
                        isNaN( toCoin?.fiat_price)
                          ? 0
                          : toCoin?.fiat_price,
                      ),
                      toCoin?.fiat_price_decimal || 2,
                    )
                    }
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.absoluteView,{ backgroundColor: ThemeManager.colors.primary,borderColor: ThemeManager.colors.bg}]}>
              <FastImage
                style={{
                  alignSelf: 'center',
                  height: areaDimen(20),
                  width: areaDimen(20),
                }}
                source={images.iconColoredRefresh}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={[styles.leftText,{ color: ThemeManager.colors.inActiveColor,}]}>From</Text>
            <Text style={[styles.rightText,{color:ThemeManager.colors.headingText}]}>
              {fromValue} {fromCoinSymbol.toUpperCase()}
            </Text>
          </View>
          <BorderLine/>
          <View style={styles.row}>
          <Text style={[styles.leftText,{ color: ThemeManager.colors.inActiveColor,}]}>To</Text>
            <Text style={[styles.rightText,{color:ThemeManager.colors.headingText}]}>
              {toValue} {toCoinSymbol.toUpperCase()}
            </Text>
          </View>
          <BorderLine/>
          <View style={[styles.row, {borderBottomWidth: 0}]}>
          <Text style={[styles.leftText,{ color: ThemeManager.colors.inActiveColor,}]}>Network Fee</Text>
            <Text style={[styles.rightText,{color:ThemeManager.colors.headingText}]}>
              {txnFee} {symbol}({' '}
              {Singleton.getInstance().CurrencySymbol +
                ' ' +
                Singleton.getInstance().toFixednew(
                  exponentialToDecimalWithoutComma(
                    parseFloat(txnFee) * getnativeFiatPrice(),
                  ),
                  2,
                )}{' '}
              )
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginHorizontal: areaDimen(22),
            marginBottom: 10,
          }}>
          <BasicButton onPress={onPress} text={'Confirm'} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  leftText: {
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    color: ThemeManager.colors.inActiveColor,
    lineHeight: heightDimen(18),
  },
  rightText: {
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    color: ThemeManager.colors.textColor,
    lineHeight: heightDimen(18),
    flex: 1,
    paddingLeft: widthDimen(40),
    textAlign: 'right',
  },
  absoluteView: {
    backgroundColor: ThemeManager.colors.primary,
    height: 46,
    width: 46,
    alignSelf: 'center',
    position: 'absolute',
    borderWidth: heightDimen(6),
    borderRadius: 100,
    borderColor: ThemeManager.colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    // marginTop: 22,
    backgroundColor: ThemeManager.colors.bg,
  },
  row: {
    // borderBottomWidth: 1,
    // borderBottomColor: ThemeManager.colors.backgroundColor,
    paddingTop: heightDimen(16),
    paddingBottom:heightDimen(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fromToView: {
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: heightDimen(6),
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    height: 81,
    backgroundColor: Colors.bgSuccessCard,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingLeft: 10,
  },
  successMessageWrap: {
    paddingLeft: 20,
    flex: 1,
  },
  coinNAme: {
    fontSize: areaDimen(16),
    fontFamily: fonts.semibold,
    color: ThemeManager.colors.textColor,
    lineHeight: heightDimen(19),
  },
  coinValue: {
    marginTop: heightDimen(5),
    fontSize: areaDimen(14),
    fontFamily: fonts.semibold,
    color: ThemeManager.colors.inActiveColor,
    lineHeight: heightDimen(19),
  },
  coinImage: {
    left: widthDimen(-19),
    height: areaDimen(38),
    width: widthDimen(38),
    borderRadius:areaDimen(38),
    justifyContent:'center',
    alignItems:'center'
  },
  toCoin: {
    flexDirection: 'row',
    marginTop: heightDimen(10),
    backgroundColor: ThemeManager.colors.backgroundColor,
    marginLeft: widthDimen(19),
    alignItems: 'center',
    height: heightDimen(90),
    borderRadius: areaDimen(25),
  },
  fromCoin: {
    flexDirection: 'row',
    backgroundColor: ThemeManager.colors.backgroundColor,
    marginLeft: widthDimen(19),
    alignItems: 'center',
    height: heightDimen(90),
    borderRadius: areaDimen(25),
  },
  coinSymbolText: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    color: Colors.white,
  },
});

export {ModalSwap};
