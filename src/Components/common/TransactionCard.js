import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {areaDimen, heightDimen, width} from '../../Utils/themeUtils';
import {Colors, Fonts, Images} from '../../theme';
import FastImage from 'react-native-fast-image';
import {ThemeManager} from '../../../ThemeManager';

const TransactionCard = ({item}) => {
  const getDataOBjectKey = () => {
    let dataKey = ''
    Object.keys(item).forEach(function (key, index) {
      if (key?.includes('Model') && item[`${key}`] != null) {
        dataKey = key

        
      }
    });
    return dataKey
  }
  console.log("getDataOBjectKey:::::::", getDataOBjectKey())
  const getAmountKey = () => {
    let key = ''
    if (getDataOBjectKey()?.includes('reap')) {
      key = 'billAmount'
    } else {
      key = 'amount'
    }
    return key
  }
    const key = item[`${getDataOBjectKey()}`]
console.log(item,'keykeykeykeykey');
    const getColorBg = operationStatus => {
      switch (operationStatus) {
        case 'DECLINED':
        case 'FAILED':
          return Colors.red;
        case 'CLEARED':
        case 'APPROVED':
          return Colors.darkGreen;
        case 'PENDING':
        case 'AUTHORIZED':
          return Colors.darkYellow;
        default:
          return null; // or any default color
      }
    };
    const isCardTransaction = item?.operationStatus == 'DECLINED' || item?.operationStatus == 'CLEARED' || item?.operationStatus == 'AUTHORIZED' || item?.operationStatus == 'VOID'
  return (
    <View
      style={{
        backgroundColor: ThemeManager.colors.lightBlue2,
        ...styles.mainContainer,
      }}>
      <Text style={styles.dateText}>
        {moment(item?.operationDate).format('DD-MM, HH:mm')}
      </Text>
      <View
        style={{
          backgroundColor: getColorBg(item?.operationStatus),
          position: 'absolute',
          ...styles.statusView,
        }}>
        <Text
          style={[styles.statusText, {color: ThemeManager.colors.textColor}]}>
          {item?.operationStatus}
        </Text>
      </View>

      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            ...styles.dollerView,
            backgroundColor: ThemeManager.colors.bg,
          }}>
          <FastImage
            source={Images.redDoller}
            style={
              !isCardTransaction
                ? {
                    height: areaDimen(24),
                    width: areaDimen(24),
                    transform: [{rotate: '180deg'}],
                  }
                : {height: areaDimen(24), width: areaDimen(24)}
            }
          />
        </View>
        <View style={{flex: 0.6, paddingLeft: areaDimen(8)}}>
          <Text
            style={[styles.titleText, {color: ThemeManager.colors.textColor}]}>
            {!!isCardTransaction ? 'Expense' : 'TopUp'}
          </Text>
          <Text style={styles.dateText}>
            {key?.merchantName || key?.walletFrom}
          </Text>
        </View>
        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
          <Text style={[styles.titleText, {color: Colors.red}]}>
            -{key?.fee?.value}{' '}
            <Text style={styles.lightColorStyle}>{key?.fee?.currency}</Text>
          </Text>
          <Text
            style={[styles.titleText, {color: ThemeManager.colors.textColor}]}>
            {key?.[`${getAmountKey()}`]?.value}{' '}
            <Text style={styles.lightColorStyle}>
              {key?.[`${getAmountKey()}`]?.currency}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: areaDimen(22),
    borderRadius: areaDimen(12),
    padding: areaDimen(9),
    overflow: 'hidden',
  },
  dollerView: {
    flex: 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: areaDimen(6),
    height: areaDimen(44),
    width: areaDimen(44),
  },
  statusView: {
    right: 0,
    paddingVertical: areaDimen(6),
    paddingHorizontal: areaDimen(12),
    borderBottomLeftRadius: areaDimen(12),
  },
  statusText: {
    lineHeight: heightDimen(13),
    fontFamily: Fonts.bold,
    fontSize: areaDimen(10),
    textTransform: 'capitalize',
  },
  dateText: {
    lineHeight: heightDimen(15),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
    color: Colors.languageItem,
    marginBottom: areaDimen(12),
  },
  titleText: {
    lineHeight: heightDimen(18),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(14),
    marginBottom: areaDimen(5),
  },
  lightColorStyle: {
    fontSize: areaDimen(12),
    color: Colors.languageItem,
  },
});
