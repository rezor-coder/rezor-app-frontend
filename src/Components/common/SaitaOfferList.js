

import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { ThemeManager } from '../../../ThemeManager'
import { Image, Text, View } from 'react-native'
import { FlatList } from 'react-native'
import { Fonts, Images } from '../../theme'
import FastImage from 'react-native-fast-image'
const Des_data = [
  {
    text: '$ 50,000 Daily Spend Limit',
  },
  {
    text: '3 Easy installments using Binance Pay',
  },
  {
    text: 'Crypto Deposit Fee: 3.5%',
  },
  {
    text: '24/7 Customer Support',
  },
  {
    text: '$ 50,000 Daily Spend Limit',
  },
];
export const SaitaOfferList = ({card}) => {
  return (
    <LinearGradient 
    colors={[ThemeManager.colors.saitaOfferbackground1,  ThemeManager.colors.saitaOfferbackground2]}
    style={{
      borderRadius:20,
      marginTop:15

    }}
    >
            <View  style={{
              paddingHorizontal:15, 
              paddingVertical:8,
              borderBottomWidth:1, 
              borderBottomColor:ThemeManager.colors.saitaOfferBorderColor,
              flexDirection:'row',
              alignItems:'center'
            }}>
              <View style={{
                height:4 , width:4 , borderRadius:2 , backgroundColor:ThemeManager.colors.textColor , marginRight:5
              }} />
              <Text
              style={{
                color:ThemeManager.colors.textColor,
                fontFamily:Fonts.regular,
                fontSize:13
              }}
              >$ {card?.daily_spend_limit || '50,000'} Daily Spend Limit</Text>
            </View>
            <View  style={{
              paddingHorizontal:15, 
              paddingVertical:8,
              borderBottomWidth:1, 
              borderBottomColor:ThemeManager.colors.saitaOfferBorderColor,
              flexDirection:'row',
              alignItems:'center'
            }}>
              <View style={{
                height:4 , width:4 , borderRadius:2 , backgroundColor:ThemeManager.colors.textColor , marginRight:5
              }} />
              <Text
              style={{
                color:ThemeManager.colors.textColor,
                fontFamily:Fonts.regular,
                fontSize:13
              }}
              >3 Easy installments using  </Text>
              <Image
              source={
                  ThemeManager.ImageIcons.binance_pay
              }
              style={{
                height: 20,
                width:100
              }}
              resizeMode="contain"
            />
            </View>
            <View  style={{
              paddingHorizontal:15, 
              paddingVertical:8,
              borderBottomWidth:1, 
              borderBottomColor:ThemeManager.colors.saitaOfferBorderColor,
              flexDirection:'row',
              alignItems:'center'
            }}>
              <View style={{
                height:4 , width:4 , borderRadius:2 , backgroundColor:ThemeManager.colors.textColor , marginRight:5
              }} />
              <FastImage source={Images.apple_pay} 
              tintColor={ThemeManager.colors.textColor}
              resizeMode='contain'
               style={{
                width:15 , height:15 , marginHorizontal:4
              }}
              />
              <Text
              style={{
                color:ThemeManager.colors.textColor,
                fontFamily:Fonts.regular,
                fontSize:13
              }}
              >Pay & </Text>
              <FastImage source={Images.google_pay} 
              resizeMode='contain'
               style={{
                width:15 , height:15 , marginHorizontal:4
              }}
              />
              <Text
              style={{
                color:ThemeManager.colors.textColor,
                fontFamily:Fonts.regular,
                fontSize:13
              }}
              >Pay supported</Text>
            </View>
            <View  style={{
              paddingHorizontal:15, 
              paddingVertical:8,
              borderBottomWidth:1, 
              borderBottomColor:ThemeManager.colors.saitaOfferBorderColor,
              flexDirection:'row',
              alignItems:'center'
            }}>
              <View style={{
                height:4 , width:4 , borderRadius:2 , backgroundColor:ThemeManager.colors.textColor , marginRight:5
              }} />
              <Text
              style={{
                color:ThemeManager.colors.textColor,
                fontFamily:Fonts.regular,
                fontSize:13
              }}
              >Crypto Deposit Fee: {card?.card_fee && card?.card_fee?.toString() || '3.5'}%</Text>
            </View>
            <View  style={{
              paddingHorizontal:15, 
              paddingVertical:8,
              borderBottomWidth:0, 
              borderBottomColor:ThemeManager.colors.saitaOfferBorderColor,
              flexDirection:'row',
              alignItems:'center'
            }}>
              <View style={{
                height:4 , width:4 , borderRadius:2 , backgroundColor:ThemeManager.colors.textColor , marginRight:5
              }} />
              <Text
              style={{
                color:ThemeManager.colors.textColor,
                fontFamily:Fonts.regular,
                fontSize:13
              }}
              >{Des_data[3].text}</Text>
            </View>
      </LinearGradient>
  )
}