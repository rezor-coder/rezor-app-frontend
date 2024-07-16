import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {ThemeManager} from '../../../../ThemeManager';
import {BASE_IMAGE} from '../../../Endpoints';
import {Colors} from '../../../theme';
import fonts from '../../../theme/Fonts';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import styles from './WalletStyle';
import FastImage from 'react-native-fast-image';
import {CommaSeprator3, exponentialToDecimalWithoutComma} from '../../../utils';
const WalletCard = props => {
  const {item, onPress,showBalance=true} = props;

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[
        styles.mainCardContainer,
        {backgroundColor: ThemeManager.colors.iconBg,
        shadowColor:ThemeManager.colors.shadowColor
        },
      ]}>
      {item?.coin_image ? (
        <FastImage
          source={{
            uri: item.coin_image.includes('https')
              ? item.coin_image
              : BASE_IMAGE + item.coin_image,
          }}
          style={styles.cardIconImage}
        />
      ) : (
        <View style={styles.notIConContainer}>
          <Text style={{color: 'white', textTransform: 'capitalize'}}>
            {item.coin_symbol.charAt(0)}
          </Text>
        </View>
      )}
      <View
        style={{
          marginLeft: widthDimen(12),
          flex: 0.5,
        }}>
        <Text style={[styles.coinName,{color: ThemeManager.colors.textColor}]}>
          {item.coin_name.toString().length > 8
            ? item.coin_name.substring(0, 8) + '...'
            : item.coin_name}
          <Text
            style={{
              fontSize: areaDimen(11),
              lineHeight: areaDimen(19),
              textTransform: 'none',
              color: ThemeManager.colors.inActiveColor,
            }}>
            {item?.is_token == 1
              ? item?.coin_family == 1
                ? ' (ERC20)'
                : item?.coin_family == 6
                ? ' (BEP20)'
                : item?.coin_family == 3
                ? ' (TRC20)'
                : item?.coin_family == 11
                ? ' (MATIC ERC20)'
                : item?.coin_family == 4
                ? ' (SBC24)'
                : ''
              : ''}
          </Text>
        </Text>
        <Text
          style={[
            {
              color: ThemeManager.colors.inActiveColor,
              fontFamily: fonts.medium,
              fontSize: areaDimen(14),
              lineHeight: areaDimen(18),
            },
          ]}
          numberOfLines={1}>
          {`${Singleton.getInstance().CurrencySymbol}`}{' '}
          {item.perPrice_in_fiat==0?'0.00':CommaSeprator3(item.perPrice_in_fiat,2)}{' '}
          <Text
            style={[
              styles.coinPriceStyle,
              {
                color:
                  item?.price_change_percentage < 0
                    ? ThemeManager.colors.sell
                    : ThemeManager.colors.buy,
              },
            ]}>
            {item?.price_change_percentage?.toFixed(2)} %
          </Text>
        </Text>
      </View>
      <View style={{flex: 0.5}}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <View style={{ flex:1,justifyContent:'center'}}>
          <Text
            style={[
              styles.coinBalanceFiat,
              {
                color: ThemeManager.colors.textColor,
                bottom: showBalance ? 0 :heightDimen(2),
                fontSize: showBalance ? areaDimen(15) : areaDimen(24),
              },
            ]}>
              {/* {'00000000000000000000'?.length>8?'00000000000000000000'?.slice(0,7)+'...':'00000000000000000000'}  */}
           {showBalance
              ? item.balance != 0
                ? Singleton.getInstance().exponentialToDecimal(
                    Singleton.getInstance().toFixednew(
                      Singleton.getInstance().exponentialToDecimal(
                        item.balance,
                      ),
                      Constants.CRYPTO_DECIMALS,
                    ),
                  )?.length>7?
                    Singleton.getInstance().toFixednew(
                      Singleton.getInstance().exponentialToDecimal(
                        item.balance,
                      ),
                      Constants.CRYPTO_DECIMALS,
                    )?.slice(0,7)+'...':
                    Singleton.getInstance().toFixednew(
                      Singleton.getInstance().exponentialToDecimal(
                        item.balance,
                      ),
                      Constants.CRYPTO_DECIMALS,
                    )
                : '0'
             : '...'}
          </Text>
          </View>
          <Text
            style={[
              styles.coinBalanceFiat,
              {color: ThemeManager.colors.textColor},
            ]}>
            {' '}
            {item.coin_symbol?.length>4?item.coin_symbol?.toUpperCase()?.slice(0,3)+'...':item.coin_symbol?.toUpperCase()}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Text
            style={[
              styles.coinPriceStyle,
              {
                color: ThemeManager.colors.textColor,
              },
            ]}>
            {Singleton.getInstance().CurrencySymbol}{' '}
          </Text>
          <Text
            style={[
              styles.coinPriceStyle,
              {color: ThemeManager.colors.textColor,
                bottom: showBalance ? heightDimen(-1) : heightDimen(2),
                fontSize: showBalance ? areaDimen(16) : areaDimen(24),
            },
            ]}>
            {showBalance
              ? Singleton.getInstance().toFixednew(
                  exponentialToDecimalWithoutComma(
                    item.perPrice_in_fiat * item.balance,
                  ),
                  2,
                )
              : '...'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WalletCard;
