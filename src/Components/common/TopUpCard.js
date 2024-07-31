import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { LanguageManager, ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import { Colors, Fonts, Images } from '../../theme';
import { Modal } from 'react-native';
import ShimmerLoader from './ShimmerLoader';

const TopUpCard = ({
  data,
  onSelectValue = value => {},
  selectedValue = {},
  title,
  placeholder,
  value,
  onChangeText = () => {},
  walletBalance,
  onPressShowModal=()=>{},
  maxLength,
  editable=true,
  showLoader=false


}) => {
  console.log(data, 'datadatadatadata');

  return (
    <>
      <View
        style={{
          backgroundColor: ThemeManager.colors.lightBlue2,
          ...styles.mainViewStyle,
        }}>
        <View style={styles.wallePayView}>
          <Text style={styles.lightColorStyle}>{title}</Text>
          {Number(walletBalance) >= 0 ? (
            <Text style={[styles.lightColorStyle,{color:ThemeManager.colors.textColor}]} numberOfLines={2}>
              {LanguageManager.balance}: {selectedValue?.availableBalance}
              {'  '}
              <Text style={{color: ThemeManager.colors.buttonColor1}}>
                {LanguageManager.all}
              </Text>
            </Text>
          ) : null}
        </View>
        <View
          style={[styles.flexRowCenter, {paddingHorizontal: areaDimen(10)}]}>
          <TouchableOpacity
            style={{...styles.flexRowCenter, flex: 0.4}}
            onPress={onPressShowModal}>
            {selectedValue?.coin_image|| selectedValue?.iconUrl  ? (
              <FastImage
                source={
                  typeof selectedValue?.coin_image == 'string'|| typeof selectedValue?.iconUrl == 'string' 
                    ? {uri: selectedValue?.coin_image || selectedValue?.iconUrl }
                    : selectedValue?.coin_image || selectedValue?.iconUrl 
                }
                style={[styles.iconStyle]}
                resizeMode="contain"
              />
            ) : !!selectedValue?.coin_name || selectedValue?.currency? (
              <View
                style={[
                  styles.iconStyle,
                  {backgroundColor: ThemeManager.colors.primary},
                ]}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.semibold,
                    fontSize: areaDimen(15),
                    lineHeight: heightDimen(18),
                  }}>
                  {selectedValue?.coin_name?.charAt(0) || selectedValue?.currency?.charAt(0) }
                </Text>
              </View>
            ) : null}
            <Text
              style={[
                styles.dropDownTitle,
                {
                  color: ThemeManager.colors.textColor,
                  marginLeft: !selectedValue ? areaDimen(8) : 0,
                  opacity: !selectedValue ? areaDimen(0.5) : 1,
                },
              ]}>
              {!!selectedValue?.coin_name
                ? selectedValue?.coin_name
                : selectedValue?.currency
                ? selectedValue.currency
                : 'Select account'}
            </Text>
            <FastImage
              source={Images.walletDownArrow}
              style={[styles.dropIconStyle]}
              tintColor={ThemeManager.colors.textColor}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {showLoader ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <ShimmerLoader
                style={{
                  height: heightDimen(30),
                  width: widthDimen(100),
                  borderRadius: 10,
                }}
              />
            </View>
          ) : (
            <TextInput
              style={{
                flex: 0.6,
                ...styles.textInputStyle,
                color: ThemeManager.colors.textColor,
              }}
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              keyboardType="numeric"
              placeholderTextColor={Colors.languageItem}
              maxLength={maxLength}
              editable={editable}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default TopUpCard;

const styles = StyleSheet.create({
  iconStyle: {
    height: areaDimen(30),
    width: areaDimen(30),
    marginRight: areaDimen(14),
    marginLeft: areaDimen(6),
    alignItems: 'center',justifyContent:'center',

    borderRadius:100
  },
  dropIconStyle: {
    height: areaDimen(18),
    width: areaDimen(18),
    marginLeft: areaDimen(8),
  },
  mainViewStyle: {
    // padding: areaDimen(16),
    height:areaDimen(100),
    // paddingVertical: areaDimen(16),
    justifyContent:Platform.OS =='ios'?'center':'flex-end',
    borderRadius: areaDimen(25),
    marginBottom: areaDimen(12),
  },
  wallePayView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal:areaDimen(16),
    marginBottom: Platform.OS =='ios'? areaDimen((12)):0
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightColorStyle: {
    fontSize: areaDimen(14),
    color: Colors.languageItem,
    lineHeight: heightDimen(18),
    fontFamily: Fonts.medium,
  },
  textInputStyle: {
    fontSize: areaDimen(30),
    color: Colors.languageItem,
    lineHeight: heightDimen(37),
    fontFamily: Fonts.semibold,
    textAlign: 'right',
  },
  dropDownTitle: {
    fontSize: areaDimen(16),
    lineHeight: heightDimen(19),
    fontFamily: Fonts.semibold,
  },
  textStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    marginLeft: areaDimen(12),
    maxWidth: '96%',
  },
  modalStyle: {
    borderWidth: 1,
    borderRadius: areaDimen(12),
    marginVertical: areaDimen(10),
  },
});
