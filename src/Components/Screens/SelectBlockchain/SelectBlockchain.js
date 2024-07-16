import * as shape from 'd3-shape';
import React, { Component } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AreaChart, Path } from 'react-native-svg-charts';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { BASE_IMAGE } from '../../../Endpoints';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import { Colors, Images } from '../../../theme';
import { BorderLine, SearchBar, SimpleHeader, Wrap } from '../../common';
import styles from './SelectBlockchainStyle';
const GreenGraph = ({ line }) => (
  <Path key={'line'} d={line} stroke={'green'} fill={'none'} />
);

const RedGraph = ({ line }) => (
  <Path key={'line'} d={line} stroke={'red'} fill={'none'} />
);

class SelectBlockchain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchData: [],
      coinData: props.blockChainsList,
    };
  }

  onItemSelect(item) {
    // //console.warn('MM','item', item);
    getCurrentRouteName() != 'ScanQr' && navigate(NavigationStrings.ScanQr,{ item: item });
  }

  searchBlockchain = text => {
    let coinsData = this.props.blockChainsList;

    coinsData = coinsData.filter(item => {
      return item.coin_name.includes(text);
    });

    this.setState({ coinData: coinsData });
  };

  render() {
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
          <SimpleHeader
            title={LanguageManager.select}
            history={true}
            onpress={() =>
              getCurrentRouteName() != 'History' && navigate(NavigationStrings.History)
            }
          />

          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
          />
          <View style={{ paddingHorizontal: 15 }}>
            <SearchBar
              onChangeText={this.searchBlockchain}
              width="100%"
              placeholder={LanguageManager.searchBlock}
              icon={Images.searchIcon}
              iconStyle={styles.searchIcon}></SearchBar>
          </View>
          <View
            style={{
              flex: 1,
              paddingTop: 25,
              backgroundColor: Colors.screenBg,
              paddingHorizontal: 17,
            }}>
            <FlatList
              contentContainerStyle={{
                marginTop: 15,
                paddingBottom: 70,
                flexGrow: 1,
              }}
              data={this.state.coinData}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => this.onItemSelect(item)}
                  style={styles.coinsListStyle}>
                  <View style={{ flexDirection: 'row', width: '44%' }}>
                    <Image
                      source={{
                        uri: item.coin_image.includes('https')
                          ? item.coin_image
                          : BASE_IMAGE + item.coin_image,
                      }}
                      style={styles.coinStyle}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={{ color: Colors.fadetext }}>
                        {item.coin_name.toString().length > 13
                          ? item.coin_name.substring(0, 13) + '...'
                          : item.coin_name}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Colors.pink }}>
                          {Singleton.getInstance().CurrencySymbol}
                          {Singleton.getInstance().exponentialToDecimal(
                            Singleton.getInstance().toFixed(
                              item.perPrice_in_fiat,
                              4,
                            ),
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      width: '25%',
                      mcurrencyarginRight: 10,
                      alignSelf: 'flex-start',
                    }}>
                    <AreaChart
                      style={{ height: 50 }}
                      data={item.graphData}
                      contentInset={{ top: 20, bottom: 20 }}
                      curve={shape.curveNatural}
                      svg={{
                        strokeWidth: 0.01,
                        fill:
                          item.price_change_percentage < 0 ? 'red' : 'green',
                        fillOpacity: 0.05,
                      }}>
                      {item.price_change_percentage > 0 ? (
                        <GreenGraph />
                      ) : (
                        <RedGraph />
                      )}
                    </AreaChart>
                  </View>

                  <View style={styles.balanceViewStyle}>
                    <Text style={styles.balanceText}>
                      {' '}
                      {item.balance != 0
                        ? Singleton.getInstance().exponentialToDecimal(
                          Singleton.getInstance().toFixed(
                            Singleton.getInstance().exponentialToDecimal(
                              item.balance,
                            ),
                            Constants.CRYPTO_DECIMALS,
                          ),
                        )
                        : item.balance}{' '}
                      {item.coin_symbol.toUpperCase()}
                    </Text>
                    <Text style={styles.coinPriceStyle}>
                      {Singleton.getInstance().CurrencySymbol}
                      {Singleton.getInstance().toFixed(
                        item.perPrice_in_fiat * item.balance,
                        2,
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Wrap>
        <SafeAreaView style={{ backgroundColor: Colors.black }}></SafeAreaView>
      </>
    );
  }
}

export default SelectBlockchain;
