/* eslint-disable react-native/no-inline-styles */
import React, { Component, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Wrap } from '../../common/Wrap';
import { MainHeader, SubHeader } from '../../common';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import styles from './HourChangesStyle';
import { Fonts, Colors, Images } from '../../../theme';
import * as constants from '../../../Constant';
import Singleton from '../../../Singleton';
import Loader from '../Loader/Loader';
import { getGraphData } from '../../../Redux/Actions';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Graph } from '../../common';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import fonts from '../../../theme/Fonts';
import FastImage from 'react-native-fast-image';
let TimePeriod = '24h';
let coinSymbol = 'saitama';
let graphData = [];
const List = ['1D', '1W', '1M', '1Y'];
const HourChanges = props => {
  const dispatch = useDispatch();
  const [selectedIndx, setselectedIndx] = useState(0);
  const [coinList, setCoinList] = useState(props.hourlyData);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    TimePeriod = '24h';
    coinSymbol = 'saitama';
    // getGraph();
  }, []);
  const getGraph = () => {
    setisLoading(true);
    let fiatType = Singleton.getInstance().CurrencySelected;
    let coinType = coinSymbol;
    let access_token = Singleton.getInstance().access_token;
    let timePeriod = TimePeriod;
    dispatch(getGraphData({ coinType, fiatType, timePeriod, access_token })).then(
      res => {
        // //console.warn('MM','chk res gra::::hot', res);
        graphData = res;
        setisLoading(false);
      },
    ).catch = err => {
      setisLoading(false);
    };
  };
  const updateGraphItem = item => {
    //console.warn('MM','item:::::', item);
    coinSymbol = item.coin_type;
    setisLoading(true);
    let fiatType = Singleton.getInstance().CurrencySelected;
    let coinType = item.coin_type;
    let access_token = Singleton.getInstance().access_token;
    let timePeriod = TimePeriod;
    dispatch(getGraphData({ coinType, fiatType, timePeriod, access_token })).then(
      res => {
        // //console.warn('MM','chk res gra::::hot item', res);
        graphData = res;
        setisLoading(false);
      },
    ).catch = err => {
      setisLoading(false);
    };
  };
  const updateGraph = item => {
    //console.warn('MM','chk time priod::::', item);
    setisLoading(true);
    TimePeriod =
      item == '1W'
        ? '7d'
        : item == '1M'
          ? '30d'
          : item == '1Y'
            ? '1y'
            : TimePeriod;
    let fiatType = Singleton.getInstance().CurrencySelected;
    let coinType = coinSymbol;
    let access_token = Singleton.getInstance().access_token;
    let timePeriod =
      item == '1D'
        ? '24h'
        : item == '1W'
          ? '7d'
          : item == '1M'
            ? '30d'
            : item == '1Y'
              ? '1y'
              : TimePeriod;
    dispatch(getGraphData({ coinType, fiatType, timePeriod, access_token })).then(
      res => {
        graphData = res;
        //console.warn('MM','chk res gra::::', res);
        setisLoading(false);
      },
    ).catch = err => {
      setisLoading(false);
    };
  };
  return (
    <Wrap style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          // backgroundColor: Colors.Darkbg,
          // borderBottomLeftRadius: 20,
          // borderBottomRightRadius: 20,
          paddingBottom: 10,
          // paddingHorizontal: 15,
        }}>
        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{
            overflow: 'hidden',
            flexGrow: 1,
            paddingHorizontal: 8,
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
                <Text style={styles.textStyle}>{LanguageManager.Coin}</Text>
                <Text style={[styles.textStyle, { marginLeft: 60 }]}>
                  {LanguageManager.price}
                </Text>
                <Text style={styles.textStyle}>{LanguageManager.HrChange}</Text>
              </View>
            );
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={1.0}
              // onPress={() => updateGraphItem(item)}
              style={{
                flexDirection: 'row',
                // justifyContent: 'space-between',
                paddingVertical: 8,
                paddingHorizontal: 12,
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '50%',
                }}>
                {item?.coin_image ? (
                  <FastImage
                    resizeMode="contain"
                    style={{ width: 25, height: 25, marginEnd: 10, borderRadius: 12 }}
                    source={{ uri: item?.coin_image }}
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
                <Text
                  style={[
                    styles.coinStyle,
                    {
                      color: ThemeManager.colors.textColor,
                      fontFamily: Fonts.regular,
                    },
                  ]}>
                  {item.coin_type.toUpperCase()}
                </Text>
              </View>
              <Text
                style={[
                  styles.coinStyle,
                  {
                    width: '28%',
                    color: ThemeManager.colors.textColor,
                    fontFamily: Fonts.regular,
                  },
                ]}>
                {/* {props.symbol} {item?.value.toFixed(5)} */}
                {Singleton.getInstance().CurrencySymbol} {item.value >= 0.01 ? Singleton.getInstance().toFixednew(item.value, 2) :
                  Singleton.getInstance().toFixednew(Singleton.getInstance().exponentialToDecimal(item.value), 8)}
              </Text>
              <Text
                style={[
                  styles.coinStyle,
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
                {item?.price_change_24h
                  ? item.price_change_24h.toFixed(2)
                  : item?.price_change_24h}{' '}
                %
              </Text>
            </TouchableOpacity>
          )}
        // ListFooterComponent={() => {
        //   return (
        //     <>
        //       <View
        //         style={{
        //           height: 50,
        //           width: '100%',
        //           marginTop: 20,
        //           borderRadius: 10,
        //           justifyContent: 'center',
        //         }}>
        //         <View
        //           style={{
        //             flexDirection: 'row',
        //             justifyContent: 'space-between',
        //             paddingHorizontal: 15,
        //           }}>
        //           <Text style={[styles.lastStyle]}>
        //             {graphData.length > 0
        //               ? graphData[0]?.name
        //               : LanguageManager.SaitamaInu}
        //           </Text>
        //           <Text style={[styles.coinStyle, {color: Colors.fadetext}]}>
        //             {Singleton.getInstance().CurrencySymbol}
        //             {graphData.length > 0
        //               ? graphData[0]?.name == 'saitama'
        //                 ? Singleton.getInstance().exponentialToDecimal(
        //                     graphData[0]?.y,
        //                   )
        //                 : Singleton.getInstance().exponentialToDecimal(
        //                     Singleton.getInstance().toFixed(
        //                       graphData[0]?.y,
        //                       8,
        //                     ),
        //                   )
        //               : '0.000000'}
        //           </Text>
        //         </View>
        //       </View>
        //       <View
        //         style={{
        //           width: '100%',
        //           height: 150,
        //           alignSelf: 'center',
        //           marginTop: 10,
        //           marginBottom: 20,
        //         }}>
        //         {graphData?.length >= 5 ? (
        //           <Graph graphData={graphData} />
        //         ) : (
        //           <View
        //             style={{
        //               width: '100%',
        //               justifyContent: 'center',
        //               height: 150,
        //               alignSelf: 'center',
        //               marginTop: 10,
        //               marginBottom: 20,
        //             }}>
        //             <Text
        //               style={{
        //                 justifyContent: 'center',
        //                 color: Colors.fadeDot,
        //                 textAlign: 'center',
        //               }}>
        //               {LanguageManager.noGraphFound}
        //             </Text>
        //           </View>
        //         )}
        //       </View>
        //       <FlatList
        //         style={{height: 30}}
        //         keyExtractor={(item, index) => index + ''}
        //         data={List}
        //         horizontal
        //         contentContainerStyle={{
        //           justifyContent: 'space-evenly',
        //           width: '100%',
        //         }}
        //         renderItem={(item, index) => {
        //           return (
        //             <View style={{height: 30}}>
        //               <TouchableOpacity
        //                 style={{
        //                   borderRadius: 20,
        //                   width: 45,
        //                   paddingVertical: 3,
        //                   backgroundColor:
        //                     selectedIndx == item.index
        //                       ? Colors.fiatPrice
        //                       : 'transparent',
        //                   paddingHorizontal: 10,
        //                 }}
        //                 onPress={() => {
        //                   setselectedIndx(item.index);
        //                   updateGraph(item.item);
        //                 }}>
        //                 <Text
        //                   style={{
        //                     textAlign: 'center',
        //                     color:
        //                       selectedIndx == item.index
        //                         ? Colors.lightWhite
        //                         : Colors.fadeDot,
        //                     fontFamily: Fonts.regular,
        //                   }}>
        //                   {item.item}
        //                 </Text>
        //               </TouchableOpacity>
        //             </View>
        //           );
        //         }}
        //       />
        //     </>
        //   );
        // }}
        />
        {isLoading && <Loader smallLoader={true} />}
      </View>
    </Wrap>
  );
};

export default HourChanges;
