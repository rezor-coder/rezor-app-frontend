import React, { Component } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Text,
} from 'react-native';
import styles from './SelectBlockchainStyle';
import { Wrap, SimpleHeader, SearchBar, BorderLine } from '../../common';
import { Images, Colors } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import { BASE_IMAGE } from '../../../Endpoints';
import Singleton from '../../../Singleton';
import { AreaChart, Path } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
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
    Actions.currentScene != 'ScanQr' && Actions.ScanQr({ item: item });
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
              Actions.currentScene != 'History' && Actions.History()
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
