/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { getGraphData } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { Wrap } from '../../common/Wrap';
import Loader from '../Loader/Loader';
import styles from './HotStyle';
let TimePeriod = '24h';
let coinSymbol = 'saitama';
let graphData = [];
const List = ['1D', '1W', '1M', '1Y'];
const Hot = props => {
  const dispatch = useDispatch();
  const [selectedIndx, setselectedIndx] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [coinList, setCoinList] = useState(props.hotData);
  const [graphChange, setGraphChange] = useState(false);
  // //console.warn('MM','coooode--HOT---', props.hotData);
  // useEffect(() => {
  //   TimePeriod = '24h';
  //   coinSymbol = 'saitama';
  //   getGraph();
  // }, []);

  useEffect(() => {
    setCoinList(props.hotData);
  }, [props.hotData]);

  // const getGraph = () => {
  //   let fiatType = Singleton.getInstance().CurrencySelected;
  //   let coinType = coinSymbol;
  //   let access_token = Singleton.getInstance().access_token;
  //   let timePeriod = TimePeriod;
  //   dispatch(getGraphData({ coinType, fiatType, timePeriod, access_token })).then(
  //     res => {
  //       // //console.warn('MM','chk res gra::::hot', res);
  //       setisLoading(false);
  //       graphData = res;
  //     },
  //   ).catch = err => {
  //     setisLoading(false);
  //   };
  // };
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
          backgroundColor: ThemeManager.colors.backgroundColor,

          paddingBottom: 10,
          paddingHorizontal: 3,
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
              onPress={() => {
                //updateGraphItem(item);
              }}
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
                {Singleton.getInstance().CurrencySymbol} {item.value >= 0.01 ? Singleton.getInstance().toFixednew(item.value, 2) :
                  Singleton.getInstance().toFixednew(Singleton.getInstance().exponentialToDecimal(item.value), 8)}
              </Text>
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

export default Hot;
