/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, FlatList, Dimensions } from 'react-native';
import { Colors, Fonts, Images } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Singleton from '../../Singleton';
import { LanguageManager, ThemeManager } from '../../../ThemeManager';
import { BasicButton } from './BasicButton';
import fonts from '../../theme/Fonts';

const CustomSwitchCards = props => {

  const myDataArray = ["Black", "Diamond", "Gold"]

  //console.warn('MM',">>>>>blackSelected", selectedIndex, props.dataArray.length, blackSelected, diamondSelected, goldSelected);

  return (
   
      <FlatList
        horizontal
        data={ props.dataArray || myDataArray }
        style={{
          backgroundColor: ThemeManager.colors.defiBgColor,
          width: '90%',
          alignSelf: 'center',
          marginVertical: 15,
          borderRadius: 10,
        }}
        keyExtractor={(item, index) => item.card_table_id}
        renderItem={({ item, index }) => {
          return (
            <View style={{ flexDirection: 'row', width: Dimensions.get('screen').width / 3.35 }}>
              {props.index == index ?
                <BasicButton
                  btnStyle={{ flex: 1 }}
                  customGradient={{ borderRadius: 10 }}
                  text={item.name}
                  textStyle={{ fontSize: 14, fontFamily: fonts.regular, textTransform: 'capitalize' }}
                  onPress={() => {
                    props.onPressIndex(index);
                    // setIndex(index);
                  }}
                />
                :
                <TouchableOpacity
                  onPress={() => {
                    //console.warn('MM','here 2::::::');
                    // setIndex(index);
                    props.onPress(item, index);
                  }}
                  style={{
                    backgroundColor: ThemeManager.colors.defiBgColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    height: 50,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.regular,
                      color: ThemeManager.colors.stakeColor,
                      textTransform: 'capitalize'
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              }
            </View>
          )
        }}
      />
     


   
  );
};



export { CustomSwitchCards };
