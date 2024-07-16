import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ThemeManager } from '../../../ThemeManager';
import Singleton from '../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import { Images } from '../../theme';
import fonts from '../../theme/Fonts';
import { CommaSeprator3 } from '../../utils';
import { BorderLine } from './BorderLine';

const HistoryItem = ({item, onPress}) => {
  const getMarketPrice = (itemData , from) => {
    let selectedPrice = itemData?.fiat_price_per_unit?.find(item => {
      return (
        item.fiat_type == Singleton.getInstance().CurrencySelected.toLowerCase()
      );
    });
    return selectedPrice?.value;
  };

  return (
   <>
    <View
      style={{
        // borderBottomWidth: 1,
        // borderBottomColor: ThemeManager.colors.viewBorderColor,
      }}>
      <TouchableOpacity
        style={{
          marginHorizontal: widthDimen(16),
          marginTop: heightDimen(19),
          marginBottom:heightDimen(9)
        }}
        onPress={onPress}>
        <View style={styles.viewStyle}>
          <View
            style={{
              height: widthDimen(32),
              width: widthDimen(32),
              borderRadius: widthDimen(16),
              backgroundColor: ThemeManager.colors.mnemonicsView,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: ThemeManager.colors.swapBg,
              borderWidth:ThemeManager.colors.themeColor=='dark'?0:0.5,
              borderColor:ThemeManager.colors.primary
            }}>
            <FastImage
              source={
                item?.type == 'deposit' ? Images.icon_receive : Images.icon_send
              }
              style={{
                height: widthDimen(13),
                width: widthDimen(10),
                alignSelf: 'center',
                resizeMode: 'contain',
                tintColor: ThemeManager.colors.textColor,
              }}
              tintColor={ThemeManager.colors.headingText}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>

          <View style={{flexDirection: 'row', width: '92%'}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
                marginHorizontal: widthDimen(8),
              }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: areaDimen(16),
                  fontFamily: fonts.medium,
                }}
                numberOfLines={1}>
                {item.is_smart
                  ? 'Smart Contract Interaction'
                  : item.type == 'deposit'
                  ? 'Receive'
                  : 'Send'}
                {!item.is_smart && '/'}
                <Text
                  style={{
                    color: ThemeManager.colors.lightTextColor,
                    fontSize: areaDimen(16),
                    fontFamily: fonts.medium,
                    textTransform: 'capitalize',
                  }}>
                  {!item.is_smart && item?.coin_symbol}
                </Text>
              </Text>
              <Text
                style={{
                  color: ThemeManager.colors.lightTextColor,
                  marginTop: heightDimen(2),
                  fontSize: areaDimen(12),
                  fontFamily: fonts.medium,
                }}
                numberOfLines={1}>
                {'From - ' + item.from_adrs}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: widthDimen(165),
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: areaDimen(14),
                  fontFamily: fonts.medium,
                }}>
                {item?.amount
                  ? item?.amount != undefined
                    ? item?.amount.toString().includes('e')
                      ? Singleton.getInstance().exponentialToDecimal(
                          parseFloat(item?.amount).toFixed(8),
                        ) +
                        ' ' +
                        item.coin_symbol.toUpperCase()
                      : // ? Singleton.getInstance().toFixednew(8)(exponentialToDecimal(
                        //   parseFloat(this.state.txnDetail?.amount)
                        // ),8)

                        Singleton.getInstance().toFixednew(item?.amount, 6) +
                        ' ' +
                        item.coin_symbol.toUpperCase()
                    : 0 + ' ' + item.coin_symbol.toUpperCase()
                  : // ? Singleton.getInstance().toFixednew(exponentialToDecimalWithoutComma(
                    //   item.amount),8)

                    // ? Singleton.getInstance().exponentialToDecimal(
                    //     Singleton.getInstance().toFixednew(item.amount, 6),
                    //   ) +
                    // ' ' +
                    // item.coin_symbol.toUpperCase()

                    '0.00' + ' ' + item.coin_symbol.toUpperCase()}
              </Text>

              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: areaDimen(12),
                  fontFamily: fonts.medium,
                  marginTop: heightDimen(3),
                }}
                numberOfLines={1}>
                {Singleton.getInstance().CurrencySymbol}
                {item?.amount != ''
                  ? getMarketPrice(item, "First")
                    ?
                    (
                     item?.amount != undefined
                      ? item?.amount.toString().includes('e')
                        ? CommaSeprator3( getMarketPrice(item, "Second") * Singleton.getInstance().exponentialToDecimal(
                            parseFloat(item?.amount).toFixed(8),),2)
                        :CommaSeprator3(getMarketPrice(item, "Second") * Singleton.getInstance().toFixednew(item?.amount, 6),2)
                      : 0 
                    )
                    : '0.00'
                  : '0.00'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
    <BorderLine/>
   </>
  );
};

export default HistoryItem;
const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
