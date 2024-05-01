/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Wrap} from '../../common/Wrap';
import styles from './GainerStyle';
import {Actions} from 'react-native-router-flux';
import {getGraphData} from '../../../Redux/Actions';
import {Fonts, Colors, Images} from '../../../theme';
import * as constants from '../../../Constant';
import Singleton from '../../../Singleton';
import Loader from '../Loader/Loader';
import {connect, useDispatch, useSelector} from 'react-redux';
import {Graph} from '../../common';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import fonts from '../../../theme/Fonts';
import FastImage from 'react-native-fast-image';
let TimePeriod = '24h';
let coinSymbol = 'saitama';
let graphData = [];
const List = ['1D', '1W', '1M', '1Y'];
const Gainer = props => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [coinList, setCoinList] = useState(props.gainerData);
  // useEffect(() => {
  //   TimePeriod = '24h';
  //   coinSymbol = 'saitama';
  //   getGraph();
  // }, []);
  // const getGraph = () => {
  //   setisLoading(true);
  //   let fiatType = Singleton.getInstance().CurrencySelected;
  //   let coinType = coinSymbol;
  //   let access_token = Singleton.getInstance().access_token;
  //   let timePeriod = TimePeriod;
  //   dispatch(getGraphData({ coinType, fiatType, timePeriod, access_token })).then(
  //     res => {
  //       // //console.warn('MM','chk res gra::::hot', res);
  //       graphData = res;
  //       setisLoading(false);
  //     },
  //   ).catch = err => {
  //     setisLoading(false);
  //   };
  // };
  // const updateGraphItem = item => {
  //   //console.warn('MM','item:::::', item);
  //   coinSymbol = item.coin_type;
  //   setisLoading(true);
  //   let fiatType = Singleton.getInstance().CurrencySelected;
  //   let coinType = item.coin_type;
  //   let access_token = Singleton.getInstance().access_token;
  //   let timePeriod = TimePeriod;
  //   dispatch(getGraphData({ coinType, fiatType, timePeriod, access_token })).then(
  //     res => {
  //       // //console.warn('MM','chk res gra::::hot item', res);
  //       graphData = res;
  //       setisLoading(false);
  //     },
  //   ).catch = err => {
  //     setisLoading(false);
  //   };
  // };
  // const updateGraph = item => {
  //   //console.warn('MM','chk time priod::::', item);
  //   setisLoading(true);
  //   TimePeriod =
  //     item == '1W'
  //       ? '7d'
  //       : item == '1M'
  //         ? '30d'
  //         : item == '1Y'
  //           ? '1y'
  //           : TimePeriod;
  //   let fiatType = Singleton.getInstance().CurrencySelected;
  //   let coinType = coinSymbol;
  //   let access_token = Singleton.getInstance().access_token;
  //   let timePeriod =
  //     item == '1D'
  //       ? '24h'
  //       : item == '1W'
  //         ? '7d'
  //         : item == '1M'
  //           ? '30d'
  //           : item == '1Y'
  //             ? '1y'
  //             : TimePeriod;
  //   dispatch(getGraphData({ coinType, fiatType, timePeriod, access_token })).then(
  //     res => {
  //       graphData = res;
  //       //console.warn('MM','chk res gra::::', res);
  //       setisLoading(false);
  //     },
  //   ).catch = err => {
  //     setisLoading(false);
  //   };
  // };
  return (
    <Wrap style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: ThemeManager.colors.backgroundColor,

          paddingBottom: 10,
          paddingHorizontal: 3,
        }}>
        <FlatList
          style={{flex: 1}}
          contentContainerStyle={{
            overflow: 'hidden',
            flexGrow: 1,
            // paddingHorizontal: 8,
          }}
          showsVerticalScrollIndicator={false}
          data={coinList}
          keyExtractor={(item, index) => index + ''}
          ListHeaderComponent={() => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  marginTop: 5,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.textStyle}>Pair <Image source={Images.sort} style={{width:14 , height:14}} resizeMode='contain'/> / Vol <Image source={Images.sort} style={{width:14 , height:14}} resizeMode='contain'/></Text>
                </View>
                <Text style={[styles.textStyle, {marginLeft: 60}]}>
                  Price (USDT)<Image source={Images.sort} style={{width:14 , height:14}} resizeMode='contain'/>
                </Text>
                <Text style={styles.textStyle}>Change <Image source={Images.sort} style={{width:14 , height:14}} resizeMode='contain'/></Text>
              </View>
            );
          }}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => {
                Actions.currentScene != 'TradeSwap' && Actions.TradeSwap()
                //updateGraphItem(item);
              }}
              style={{
                flexDirection: 'row',
                // justifyContent: 'space-between',
                paddingVertical: 8,
                paddingHorizontal: 10,
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '50%',
                }}>
                  
                      <FastImage
                      resizeMode="contain"
                      style={{
                        width: 15,
                        height: 15,
                        marginRight:8
                      }}
                      source={Images.checkStar}
                    />

                {item?.coin_image ? (
                  <FastImage
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      marginEnd: 10,
                      borderRadius: 12,
                    }}
                    source={{uri: item?.coin_image}}
                  />
                ) : (
                  <View
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 16,
                      backgroundColor: 'pink',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginEnd: 7,
                    }}>
                    <Text
                      style={{
                        color: ThemeManager.colors.textColor,
                        fontFamily: Fonts.medium,
                      }}>
                      {item.coin_type.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View>
                  <Text
                    style={[
                      {
                        color: ThemeManager.colors.textColor,
                        fontFamily: Fonts.regular,
                        fontSize:11
                      },
                    ]}>
                    {item.coin_type.toUpperCase()}/USDT
                  </Text>
                  <Text
                    style={[
                      {
                        color: ThemeManager.colors.textColor,
                        fontFamily: Fonts.light,
                        fontSize: 9,
                      },
                    ]}>
                    $2.87M
                  </Text>
                </View>
              </View>

              <View style={{ width:'28%'}}>
                <Text
                  style={[
                    {
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.regular,
                      fontSize:10
                    },
                  ]}>
                  {Singleton.getInstance().CurrencySymbol}{' '}
                  {item.value >= 0.01
                    ? Singleton.getInstance().toFixednew(item.value, 2)
                    : Singleton.getInstance().toFixednew(
                        Singleton.getInstance().exponentialToDecimal(
                          item.value,
                        ),
                        8,
                      )}
                </Text>
                <Text
                  style={[
                    {
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.light,
                      fontSize:9
                    },
                  ]}>
                  {Singleton.getInstance().CurrencySymbol}{' '}
                  {item.value >= 0.01
                    ? Singleton.getInstance().toFixednew(item.value, 2)
                    : Singleton.getInstance().toFixednew(
                        Singleton.getInstance().exponentialToDecimal(
                          item.value,
                        ),
                        8,
                      )}
                </Text>
              </View>
              <Text
                style={[
                  {
                    backgroundColor:
                      item.price_change_24h < 0 ? '#F6465D' : '#0ECB81',
                    minWidth: 58,
                    fontSize: 11,
                    fontFamily: fonts.regular,
                    color: Colors.white,
                    textAlign: 'center',
                    height: 24,
                    paddingTop: 4,
                    borderRadius: 3,
                    width: '22%',
                  },
                ]}>
                {item.price_change_24h?.toFixed(2)}%
              </Text>
            </TouchableOpacity>
          )}
        />
        {isLoading && <Loader smallLoader={true} />}
      </View>
    </Wrap>
  );
};

export default Gainer;
