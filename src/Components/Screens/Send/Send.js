/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {Path} from 'react-native-svg-charts';
import {connect} from 'react-redux';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import {
  changeThemeAction,
  getDashboardWallets,
  getMyWallets,
  myWalletListSuccess,
  walletDataUpdate,
} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {
  getCurrentRouteName,
  goBack,
  navigate,
} from '../../../navigationsService';
import {Fonts} from '../../../theme';
import {BorderLine, SearchBar, SimpleHeaderNew, Wrap} from '../../common';
import WalletCard from '../Wallet/WalletCard';
import styles from './SendStyle';
import * as constants from '../../../Constant';
import Loader from '../Loader/Loader';

const Line = ({line}) => (
  <Path key={'line'} d={line} stroke={'green'} fill={'none'} />
);
const Line1 = ({line}) => (
  <Path key={'line'} d={line} stroke={'red'} fill={'none'} />
);

class Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchData: [],
      coinData: this.props.coinData,
      Page: 1,
      Limit: 30,
      totalLength: this?.props?.coinData?.[0]?.totalRecords,
      isLoading: true,
    };
  }
  componentDidMount() {
    Singleton.getInstance()
    .newGetData(constants.DASHBOARD_WALLET_LIST)
      .then(wallet_list => {
        this.setState({ isLoading: wallet_list == null ? true : false });
        this.getMyWalletsData();
      })

    AppState.addEventListener('change', state => {
      if (state === 'inactive' || state === 'background') {
        this.setState({
          Page: 1,
          bottomLoading: false,
          isLoading: false,
        });
      }
    });
    this.backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    this.props.navigation.addListener('focus', () => {
      this.setState({Page: 1, bottomLoading: false,});
      
      this.backHandle = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          goBack();
          return true;
        },
      );
    });
    this.props.navigation.addListener('blur', () => {
      this.backHandle?.remove();
    });
  }
  componentWillUnmount() {
    this.backHandle?.remove();
  }
  onItemSelect(item) {
    // console.log("item===", item)
    Singleton.getInstance().updateBalance(item?.coin_id, item?.wallet_address);
    if (this.props?.route?.params?.from == 'Receive') {
      getCurrentRouteName() != 'QrCode' &&
        navigate(NavigationStrings.QrCode, {item: item});
    } else {
      if (item.coin_family == 1) {
        getCurrentRouteName() != 'SendETH' &&
          navigate(NavigationStrings.SendETH, {walletData: item});
      } else if (item.coin_family == 6) {
        getCurrentRouteName() != 'SendBNB' &&
          navigate(NavigationStrings.SendBNB, {walletData: item});
      } else if (item.coin_family == 11) {
        getCurrentRouteName() != 'SendMATIC' &&
          navigate(NavigationStrings.SendMATIC, {walletData: item});
      } else if (item.coin_family == 2) {
        getCurrentRouteName() != 'SendBTC' &&
          navigate(NavigationStrings.SendBTC, {walletData: item});
      } else if (item.coin_family == 3) {
        getCurrentRouteName() != 'SendTRX' &&
          navigate(NavigationStrings.SendTRX, {walletData: item}); //Pending
      } else if (item.coin_family == 4) {
        getCurrentRouteName() != 'SendSTC' &&
          navigate(NavigationStrings.SendSTC, {walletData: item}); //Pending
      }
    }
  }

  searchCurrency = text => {
    let coinsData = this.state.coinData;
    let lowerCaseText = text.toLowerCase();
  
    if (text === '') {
      this.setState({ searchData: [] });
      return;
    }
  
    let filteredData = coinsData.filter(item => {
      return item.coin_name.toLowerCase().includes(lowerCaseText);
    });
  
    this.setState({ searchData: filteredData });
  };
  getMyWalletsData() {
    let page = this.state.Page;
    let limit = this.state.Limit;
    let access_token = Singleton.getInstance().access_token;
    Singleton.getInstance()
      .newGetData(constants.addresKeyList)
      .then(addresKeyList => {
        Singleton.getInstance()
          .newGetData(constants.coinFamilyKeys)
          .then(coinFamilyKey => {
            let addrsListKeys = JSON.parse(addresKeyList);
            let coinFamilyKeys = coinFamilyKey?.split(',');

            this.props
              .getMyWallets({
                page,
                limit,
                addrsListKeys,
                coinFamilyKeys,
                access_token,
              })
              .then(response => {
                let data =
                  page == 1 ? response : [...this.state.coinData, ...response];
                this.setState({
                  isLoading: false,
                  totalLength: data[0]?.totalRecords,
                  bottomLoading: false,
                  coinData: data,
                });
              })
              .catch(error => {
                this.setState({isLoading: false, bottomLoading: false});
              });
          })
          .catch(err => {
            this.setState({isLoading: false, bottomLoading: false});
          });
      });
  }
  render() {
    console.log(
      'MM',
      'this.state.coinDat0000000-----------',
      this.state.coinData.length
    );

    return (
      <>
        <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
          <SimpleHeaderNew
            title={
              'Select Assets'
              // this.props?.route?.params?.from == 'Receive' ? 'Receive' : LanguageManager.send
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
            //   getCurrentRouteName() != 'Setting' && Actions.Setting();
            // }}
          />

          <BorderLine
            borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
          />

          <View
            style={{
              paddingHorizontal: widthDimen(17),
              marginTop: heightDimen(24),
            }}>
            <SearchBar
              onChangeText={this.searchCurrency}
              width="100%"
              placeholder={LanguageManager.search}
              icon={ThemeManager.ImageIcons.searchIcon}
              ImageStyle={{tintColor: ThemeManager.colors.iconColor}}
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
              data={
                this.state.searchData.length > 0
                  ? this.state.searchData
                  : this.state.coinData
              }
              renderItem={({item, index}) => (
                <WalletCard
                  item={item}
                  onPress={item => this.onItemSelect(item)}
                />
              )}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      height: '80%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
                        fontSize: areaDimen(16),
                        color: ThemeManager.colors.lightTextColor,
                      }}>
                      No search results
                    </Text>
                  </View>
                );
              }}
              ListFooterComponent={() => {
                if (this.state.bottomLoading) {
                  return (
                    <View
                      style={{
                        padding: areaDimen(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: areaDimen(30),
                      }}>
                      <ActivityIndicator
                        color={ThemeManager.colors.headingText}
                      />
                    </View>
                  );
                } else {
                  return null;
                }
              }}
              onEndReached={() => {
                if (
                  this.state.totalLength > this.state.coinData?.length &&
                  !this.state.bottomLoading
                ) {
                  this.setState({
                    Page: this.state.Page + 1,
                    bottomLoading: true,
                  });
                  this.getMyWalletsData();
                }
              }}
            />
          </View>
          {this.state.isLoading && <Loader loader={this.state.isLoading} />}
        </Wrap>
      </>
    );
  }
}

// export default Send;
const mapStateToProp = state => {
  const {currentTheme} = state.mnemonicreateReducer;
  const coinData = state?.walletReducer?.dashboardWallets;
  return {currentTheme, coinData};
};
export default connect(mapStateToProp, {
  changeThemeAction,
  getDashboardWallets,
  walletDataUpdate,
  getMyWallets,
  myWalletListSuccess,
})(Send);
