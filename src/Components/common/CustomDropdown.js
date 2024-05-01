import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {ThemeManager} from '../../../ThemeManager';
import {Colors, Fonts, Images} from '../../theme';

const CustomDropdown = props => {
  return (
    <View>
      <SelectDropdown
        data={props?.data}
        label="Select Coin"
        buttonStyle={{
          borderWidth: 2,
          borderRadius: 12,
          justifyContent: 'flex-end',
          backgroundColor: ThemeManager.colors.btcBack,
          borderColor: ThemeManager.colors.btcBack,
          width: '100%',
          paddingHorizontal: 10,
          marginTop: 20,
        }}
        buttonTextStyle={{
          fontSize: 15,
          color: ThemeManager.colors.searchTextColor,
          textAlign: 'left',
        }}
        dropdownStyle={styles.dropDownStyle}
        rowTextStyle={styles.rowTextStyle}
        rowStyle={{
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.04)',
          paddingLeft: 20,
          backgroundColor: ThemeManager.colors.amountBorder,
        }}
        defaultButtonText={[0]}
        onSelect={(item, index) => {
          props.onItemSelect(item)
        }}
        renderDropdownIcon={() => (
          <Image
            source={ThemeManager.ImageIcons.dropIconDown}
            style={{width: 10, height: 10}}
          />
        )}
        renderCustomizedButtonChild={(item, index) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: props?.selectedItem?.coin_image}}
                style={{
                  borderRadius: 14,
                  width: 25,
                  height: 25,
                  resizeMode: 'contain',
                }}
              />

              <Text
                style={{
                  fontFamily: Fonts.semibold,
                  fontSize: 15,
                  color: ThemeManager.colors.textColor,
                  paddingStart: 5,
                  textTransform: 'uppercase',
                }}>
                {props?.selectedItem?.coin_symbol}
              </Text>
            </View>
          );
        }}
        renderCustomizedRowChild={(item, index) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: item?.coin_image}}
                style={{
                  borderRadius: 14,
                  width: 25,
                  height: 25,
                  resizeMode: 'contain',
                }}
              />

              <Text
                style={{
                  fontFamily: Fonts.semibold,
                  fontSize: 15,
                  color: ThemeManager.colors.textColor,
                  paddingStart: 5,
                  textTransform: 'uppercase',
                }}>
                {item?.coin_symbol}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  dropDownStyle: {
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '88%',
  },
  rowTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.White,
    textAlign: 'left',
  },
});

export {CustomDropdown};
