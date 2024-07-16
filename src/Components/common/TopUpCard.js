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
import { areaDimen, heightDimen } from '../../Utils/themeUtils';
import { Colors, Fonts, Images } from '../../theme';
import { Modal } from 'react-native';

const TopUpCard = ({
  data,
  onSelectValue = value => {},
  selectedValue = {},
  title,
  placeholder,
  value,
  onChangeText = () => {},
  walletBalance,
  onPressShowModal=()=>{}
}) => {
  console.log(data, 'datadatadatadata');
  const [showModal, setShowModal] = useState(false);

  const onPressCloseModal = item => {
    setShowModal(false);
    onSelectValue(item);
  };
  // const onPressShowModal = () => {
  //   if (data.length <= 0) {
  //     Alert.alert('Add data first');
  //     return;
  //   }
  //   // setShowModal(!showModal);
  // };
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
            <Text style={styles.lightColorStyle}>
              {LanguageManager.balance}: {walletBalance}
              {'  '}
              <Text style={{color: Colors.buttonColor1}}>
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
            {selectedValue?.coin_image ? (
              <FastImage
                source={
                  typeof selectedValue?.coin_image == 'string'
                    ? {uri: selectedValue?.coin_image}
                    : selectedValue?.coin_image
                }
                style={[styles.iconStyle]}
                resizeMode="contain"
              />
            ) : !!selectedValue?.coin_name ? (
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
                  {selectedValue?.coin_name?.charAt(0)}
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

                : 'Select account'}
            </Text>
            <FastImage
              source={Images.walletDownArrow}
              style={[styles.dropIconStyle]}
              tintColor={ThemeManager.colors.textColor}
              resizeMode="contain"
            />
          </TouchableOpacity>
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
          />
        </View>
      </View>
      {!!showModal && data.length > 0 ? (
        <FlatList
          data={data}
          nestedScrollEnabled
          style={{
            ...styles.modalStyle,
            backgroundColor: ThemeManager.colors.bg,
            borderColor: ThemeManager.colors.lightTextColor,
          }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={{
                  padding: areaDimen(8),
                  justifyContent: 'center',
                }}
                onPress={() => onPressCloseModal(item)}>
                <Text
                  style={[
                    styles.textStyle,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {item?.title}
                </Text>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: ThemeManager.colors.lightTextColor,
                width: '100%',
              }}
            />
          )}
        />
      ) : null}
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
