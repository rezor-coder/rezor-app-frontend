/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
  Image,
  Text,
} from 'react-native';
import styles from './SendStyle';
import { Wrap, SimpleHeader, SearchBar, SimpleHeaderNew, BorderLine } from '../../common';
import { Fonts, Images, Colors } from '../../../theme';
import { connect } from 'react-redux';
import images from '../../../theme/Images';
import { Actions } from 'react-native-router-flux';
import { BASE_IMAGE } from '../../../Endpoints';
import Singleton from '../../../Singleton';
import { AreaChart, Grid, YAxis, Path, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { constants } from 'buffer';
import * as Constants from '../../../Constant';
import { changeThemeAction } from '../../../Redux/Actions';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import WalletCard from '../Wallet/WalletCard';

const Line = ({ line }) => (
  <Path key={'line'} d={line} stroke={'green'} fill={'none'} />
);
const Line1 = ({ line }) => (
  <Path key={'line'} d={line} stroke={'red'} fill={'none'} />
);

class Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchData: [],
      coinData: props.walletList,
    };
  }
  componentDidMount() {
    this.backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
      Actions.pop()
      return true
    })
    this.props.navigation.addListener('didFocus', () => {
      this.backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
        Actions.pop()
        return true
      })
    })
    this.props.navigation.addListener('didBlur',()=>{
      this.backHandle?.remove()
    })
  }
  componentWillUnmount() {
    this.backHandle?.remove()
  }
  onItemSelect(item) {
    // console.log("item===", item)
    Singleton.getInstance().updateBalance(item?.coin_id, item?.wallet_address)
    if (this.props.from == 'Receive') {
      Actions.currentScene != 'QrCode' && Actions.QrCode({ item: item });
    } else {
      if (item.coin_family == 1) {
        Actions.currentScene != 'SendETH' &&
          Actions.SendETH({ walletData: item });
      } else if (item.coin_family == 6) {
        Actions.currentScene != 'SendBNB' &&
          Actions.SendBNB({ walletData: item });
      } else if (item.coin_family == 11) {
        Actions.currentScene != 'SendMATIC' &&
          Actions.SendMATIC({ walletData: item });
      } else if (item.coin_family == 2) {
        Actions.currentScene != 'SendBTC' &&
          Actions.SendBTC({ walletData: item });
      } else if (item.coin_family == 3) {
        Actions.currentScene != 'SendTRX' &&
          Actions.SendTRX({ walletData: item });//Pending
      } else if (item.coin_family == 4) {
        Actions.currentScene != 'SendSTC' &&
          Actions.SendSTC({ walletData: item });//Pending
      }
    }

  }

  searchCurrency = text => {
    console.log("aaaa=", this.props.from)
    let coinsData = this.props.walletList;
    let lowerCaseText = text.toLowerCase();
    //console.warn('MM','checkTextLower---->', lowerCaseText);
    coinsData = coinsData.filter(item => {
      return item.coin_name.toLowerCase().includes(text.toLowerCase());
    });

    this.setState({ coinData: coinsData });
  };

  render() {
    console.warn('MM', 'this.state.coinDat0000000-----------', this.state.coinData);

    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <SimpleHeaderNew
            title={
              'Select Assets'
              // this.props.from == 'Receive' ? 'Receive' : LanguageManager.send
            }
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            back={false}
            backPressed={() => {
              this.props.navigation.goBack();
            }}
          // img3={ThemeManager.ImageIcons.setting}//TODO: - Hide Setting button as per new design
          // onPress3={() => {
          //   Actions.currentScene != 'Setting' && Actions.Setting();
          // }}
          />

          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />

          <View style={{
            paddingHorizontal: widthDimen(17),
            marginTop: heightDimen(24)
          }}>
            <SearchBar
              onChangeText={this.searchCurrency}
              width="100%"
              placeholder={LanguageManager.search}
              icon={ThemeManager.ImageIcons.searchIcon}
              ImageStyle={{tintColor:ThemeManager.colors.iconColor}}
            />
          </View>
          <View style={styles.listView}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                marginTop: heightDimen(12),
                paddingBottom: heightDimen(70),
                flexGrow: 1,
              }}
              data={this.state.coinData}
              renderItem={({ item, index }) => (
                <WalletCard item={item} onPress={(item) => this.onItemSelect(item)} />
              )}
              ListEmptyComponent={() => {
                return (
                  <View style={{ width: '100%', alignItems: 'center', height:"80%", alignItems:'center', justifyContent:'center'}}>
                    <Text style={{ fontFamily: Fonts.medium, fontSize: areaDimen(16), color: ThemeManager.colors.lightTextColor, }}>
                      No search results
                    </Text>
                  </View>
                )
              }}
            />

            {/* <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                marginTop: heightDimen(12),
                paddingBottom: heightDimen(70),
                flexGrow: 1,
              }}
              data={this.state.coinData}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => this.onItemSelect(item)}
                  style={[
                    styles.coinsListStyle,
                    { backgroundColor: ThemeManager.colors.mnemonicsView },
                  ]}>
                  <View style={{ flexDirection: 'row', width: '44%', alignItems: 'center' }}>
                    {item.coin_image ? (
                      <Image
                        source={{
                          uri: item.coin_image.includes('https')
                            ? item.coin_image
                            : BASE_IMAGE + item.coin_image,
                        }}
                        style={styles.coinStyle}
                      />
                    ) : (
                      <View style={[styles.charAtimg]}>
                        <Text style={styles.charIconTextStyle}>
                          {item.coin_name.charAt(0)}
                        </Text>
                      </View>
                    )}

                    <View style={{ marginLeft: widthDimen(12) }}>
                      <Text style={[styles.nameTextStyle, { color: ThemeManager.colors.textColor }]}>
                        {item.coin_name.toString().length > 13
                          ? item.coin_name.substring(0, 13) + '...'
                          : item.coin_name}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.fiatValueTextStyle, { color: ThemeManager.colors.lightTextColor }]}>
                          {Singleton.getInstance().CurrencySymbol}{' '}
                          {Singleton.getInstance().exponentialToDecimal(
                            Singleton.getInstance().toFixed(
                              item.perPrice_in_fiat,
                              4,
                            ),
                          )
                            || '0.0'
                          }
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.balanceViewStyle}>
                    <Text
                      style={[
                        styles.balanceText,
                        { color: ThemeManager.colors.textColor },
                      ]}
                      numberOfLines={1}
                    >
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
                    <Text style={[styles.coinGrowthStyle, {}]}>
                      {Singleton.getInstance().CurrencySymbol}{' '}
                      {Singleton.getInstance().toFixed(
                        item.perPrice_in_fiat * item.balance,
                        2,
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => {
                return (
                  <View style={{ width: '100%', alignItems: 'center', padding: 15, }}>
                    <Text style={{ fontFamily: Fonts.medium, fontSize: areaDimen(16), color: ThemeManager.colors.lightTextColor, }}>
                      No Coin found
                    </Text>
                  </View>
                )
              }}
            /> */}
          </View>
        </Wrap>
        <SafeAreaView
          style={{
            backgroundColor: ThemeManager.colors.bg,
          }}></SafeAreaView>
      </>
    );
  }
}

// export default Send;
const mapStateToProp = state => {
  const { currentTheme } = state.mnemonicreateReducer;
  return { currentTheme };
};
export default connect(mapStateToProp, { changeThemeAction })(Send);
