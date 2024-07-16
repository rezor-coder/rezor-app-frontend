import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {areaDimen, heightDimen, width} from '../../Utils/themeUtils';
import {Colors, Fonts, Images} from '../../theme';
import FastImage from 'react-native-fast-image';
import {ThemeManager} from '../../../ThemeManager';

const TransactionCard = ({item}) => {
  return (
    <View
      style={{
        backgroundColor: ThemeManager.colors.lightBlue2,
        ...styles.mainContainer,
      }}>
      <Text style={styles.dateText}>
        {moment(item?.date).format('DD-MM, HH:mm')}
      </Text>
      <View
        style={{
          backgroundColor:
            item?.status === 'pending'
              ? Colors.darkYellow
              : item?.status === 'declined'
              ? Colors.red
              : Colors.darkGreen,
          position: 'absolute',
          ...styles.statusView,
        }}>
        <Text
          style={[styles.statusText, {color: ThemeManager.colors.textColor}]}>
          {item?.status}
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
            style={{height: areaDimen(24), width: areaDimen(24)}}
          />
        </View>
        <View style={{flex: 0.6, paddingLeft: areaDimen(8)}}>
          <Text style={[styles.titleText,{color: ThemeManager.colors.textColor}]}>{item?.title}</Text>
          <Text style={styles.dateText}>{item?.discription}</Text>
        </View>
        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
          <Text style={[styles.titleText,{color:Colors.red}]}>
            {item?.inUsdt} <Text style={styles.lightColorStyle}>USDT</Text>
          </Text>
          <Text style={[styles.titleText,{color: ThemeManager.colors.textColor}]}>
            {item?.inINR} <Text style={styles.lightColorStyle}>INR</Text>
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
