import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {areaDimen, heightDimen} from '../../Utils/themeUtils';
import {Colors, Fonts, Images} from '../../theme';
import {ThemeManager} from '../../../ThemeManager';
import {styles} from '../Screens/SaitaCardBlack/SaitaCardBlackStyle';
import Singleton from '../../Singleton';
import moment from 'moment';
import { BorderLine } from './BorderLine';
const CardHistoryItem = ({item, list, onPress, currency}) => {
  let date = new Date((item?.item?.transaction_date - 12600) * 1000);
  console.log('index:::::', list?.length - 1, item.index);
  return (
   <>
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.coinsListStyle,
        {
          flex: 1,
          borderBottomWidth:1,
          borderColor:ThemeManager.colors.borderLineBorder,
          // borderBottomWidth:item.index==list?.length-1?0:0.5,
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          minWidth: '50%',
          maxWidth: '70%',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: areaDimen(32),
            width: areaDimen(32),
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: ThemeManager.colors.swapBg,
            borderWidth:ThemeManager.colors.themeColor=='dark'?0:0.5,
            borderColor:ThemeManager.colors.primary
          }}>
          {+item?.item?.debit == 0 ? (
            <Image
              source={Images.icon_receive}
              style={[styles.coinStyle,{tintColor:ThemeManager.colors.headingText}]}
              resizeMode="stretch"
            />
          ) : (
            <Image
              source={Images.icon_send}
              style={[styles.coinStyle,{tintColor:ThemeManager.colors.headingText}]}
              resizeMode="stretch"
            />
          )}
        </View>
        <View style={{marginLeft: 10}}>
          <Text
            style={{
              color: ThemeManager.colors.textColor,
              fontFamily: Fonts.semibold,
              fontSize: areaDimen(16),
              lineHeight: heightDimen(19),
              maxWidth: '95%',
            }}
            lineBreakMode="tail"
            numberOfLines={1}>
            {item?.item?.description
              ? item?.item?.description
              : Singleton.getInstance().gettxStatus(item.item.type)}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                styles.fiatText,
                {color: ThemeManager.colors.inActiveColor},
              ]}>
              {item?.item?.status == 2
                ? 'Transaction Failed'
                : item?.item?.status == 1
                ? 'Transaction Completed'
                : 'Transaction Pending'}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.balanceViewStylehistory, {maxWidth: '45%'}]}>
        <Text
          style={[
            styles.balanceTexthistory,
            {color: ThemeManager.colors.textColor},
          ]}>
          {Singleton.getInstance().toFixednew(
            item.item?.debit > 0 ? item?.item?.debit : item?.item?.credit,
            2,
          )}{' '}
          {currency}
        </Text>
        <Text
          style={[
            styles.coinPriceStylehistory,
            {color: Colors.lightGrey2, marginTop: heightDimen(6)},
          ]}>
          {moment(date).format('DD-MM-YYYY')}
        </Text>
      </View>
    </TouchableOpacity>
    {/* <BorderLine/> */}
   </>
  );
};

export default CardHistoryItem;
