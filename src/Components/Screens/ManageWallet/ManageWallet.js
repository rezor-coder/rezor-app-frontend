/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { connect, useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { coinActiveInactive, getCoinList } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Images } from '../../../theme';
import fonts from '../../../theme/Fonts';
import {
  BasicButton,
  BorderLine,
  MainStatusBar,
  SearchBar,
  SimpleHeaderNew,
} from '../../common';
import { Wrap } from '../../common/Wrap';
import Loader from '../Loader/Loader';
import * as constants from './../../../Constant';
import styles from './ManageWalletStyle';
var debounce = require('lodash.debounce');
let Search = '';
const ManageWallet = props => {
  const [enabledStatus, setenabledStatus] = useState(false);
  const [Page, setpage] = useState(1);
  const [Limit, setlimit] = useState(25);
  const [isLoading, setisLoading] = useState(false);
  const [loadList, setloadList] = useState(false);
  const [totalRecords, settotalRecords] = useState(0);
  const [searchSet, setsearchSet] = useState(false);
  const [coinList, setcoinList] = useState([]);
  const [showSearch, setshowSearch] = useState(true);
  const [SearchText, setSearchText] = useState(false);
  const dispatch = useDispatch();
  let timer = useRef();
  const [isBtcWallet, setIsBtcWallet] = useState(false);

  useEffect(() => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (isPrivate == 'btc') {
          setIsBtcWallet(true);
        } else {
          setIsBtcWallet(false);
        }
      });
    let backHandle = null;
    backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
    EventRegister.addEventListener('downModal', () => {
      setisLoading(false);
    });
    props.navigation.addListener('focus', () => {
      backHandle = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    });
    props.navigation.addListener('blur', () => {
      backHandle?.remove();
    });
    getcoinList();

    return () => {
      Search = '';
    };
  }, []);

  const backAction = () => {
    goBack();
    return true;
  };
  const debounceLoadData = useCallback(
    debounce(text => {
      getcoinList();
    }, 1000),
    [],
  );
  const onChangeText = text => {
    Search = text?.trimStart();
    setsearchSet(!searchSet);
    setpage(1);
    debounceLoadData(text);
  };

  const getcoinList = () => {
    setSearchText(Search?.trim());
    Search = Search?.trim();
    setisLoading(true);
    let page = 1;
    let limit = Limit;
    let search = Search;
    let access_token = Singleton.getInstance().access_token;
    console.warn(
      'MM',
      'eth adrs----',
      Singleton.getInstance().defaultEthAddress,
    );
    Singleton.getInstance()
      .newGetData(constants.addresKeyList)
      .then(addresKeyList => {
        Singleton.getInstance()
          .newGetData(constants.coinFamilyKeys)
          .then(coinFamilyKey => {
            let addrsListKeys = JSON.parse(addresKeyList);
            let coinFamilyKeys = coinFamilyKey?.split(',');
            dispatch(
              getCoinList({
                page,
                limit,
                search: search?.trim(),
                addrsListKeys,
                coinFamilyKeys,
                access_token,
              }),
            )
              .then(response => {
                console.warn('MM', 'response coin list view--- ', response);
                setisLoading(false);
                setcoinList(response?.data);
                setloadList(true);
                settotalRecords(response?.meta?.total);
                console.warn('MM', 'coinList--- ', coinList);
              })
              .catch(error => {
                console.warn('MM', '===error====error====', error);
                setisLoading(false);
              });
          });
      })
      .catch(error => {
        setisLoading(false);
      });
  };
  const coinActivityAction = async (coin, index, status) => {
    let data = await Singleton.getInstance().newGetData(constants.ACTIVE_WALLET,)
   
    let walletData = JSON.parse(data)
    console.log("walletData",walletData);
    let coinId = coin.coin_id;
    var walletAddress = '';
    if (coin.coin_family == 1) {
      walletAddress = Singleton.getInstance().defaultEthAddress;
    } else if (coin.coin_family == 6) {
      walletAddress = Singleton.getInstance().defaultBnbAddress;
    } else if (coin.coin_family == 11) {
      walletAddress = Singleton.getInstance().defaultBnbAddress;
    } else if (coin.coin_family == 4) {
      walletAddress =  walletData.loginRequest.address;
    } else if (coin.coin_family == 2) {
      walletAddress = walletData.loginRequest.btcAddress;
    } else if (coin.coin_family == 3) {
      walletAddress = walletData.loginRequest.trxAddress;
    } else if (coin.coin_family == 8) {
      walletAddress = walletData.loginRequest.solAddress;
    } else {
      Singleton.showAlert(constants.COMING_SOON);
      setisLoading(false);
      return;
    }
    let isActive = status;
    let access_token = Singleton.getInstance().access_token;
    console.log("walletAddress",walletAddress);
    setisLoading(true);
    dispatch(
      coinActiveInactive({coinId, walletAddress, isActive, access_token}),
    )
      .then(response => {
        // props?.showLoader(true);
        setisLoading(false);
      })
      .catch(error => {
        Singleton.showAlert(error.message);
        setisLoading(false);
      });
  };

  const isCloseToBottom = async ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 60;
    let bottomReached =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    if (bottomReached && loadList) {
      let pagee = Page + 1;
      setloadList(false);
      console.log('coinList.length===', coinList.length);
      console.log('totalRecords===', totalRecords);

      if (coinList.length != totalRecords) {
        setisLoading(true);
        let page = pagee;
        let limit = Limit;
        let access_token = Singleton.getInstance().access_token;
        let search = Search;
        Singleton.getInstance()
          .newGetData(constants.addresKeyList)
          .then(addresKeyList => {
            Singleton.getInstance()
              .newGetData(constants.coinFamilyKeys)
              .then(coinFamilyKey => {
                let addrsListKeys = JSON.parse(addresKeyList);
                let coinFamilyKeys = coinFamilyKey?.split(',');
                console.log('page===', page);
                console.log('totalRecords===', totalRecords);

                dispatch(
                  getCoinList({
                    page,
                    limit,
                    search,
                    addrsListKeys,
                    coinFamilyKeys,
                    access_token,
                  }),
                )
                  .then(response => {
                    console.warn(
                      'MM',
                      'response coin list view-Pagination--- ',
                      response,
                    );
                    const data = coinList.concat(response.data);
                    setisLoading(false);
                    setcoinList(data);
                    setloadList(true);
                    setpage(page);
                    //console.warn('MM','coinList--- ', coinList);
                  })
                  .catch(error => {
                    //console.warn('MM','===error====error====', error);
                    setisLoading(false);
                  });
              });
          });
      }
    }
  };

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />

      <SimpleHeaderNew
        title={LanguageManager.Manage}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          props.navigation.goBack();
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />

      <View style={styles.searchBarWrap}>
        {showSearch && (
          <SearchBar
            text={Search}
            placeholder="Search "
            returnKeyType={'done'}
            icon={
              Search.length > 0
                ? Images.cancel
                : ThemeManager.ImageIcons.searchIcon
            }
            imgstyle={styles.imgstyle}
            iconStyle={
              Search.length > 0 ? styles.searchIcon1 : styles.searchIcon
            }
            width={'90%'}
            ImageStyle={{tintColor: ThemeManager.colors.lightTextColor}}
            activeOpacity={1}
            disabled={false}
            onPress={() => {
              console.log('called:::');
              if (Search.length <= 0) {
                return;
              } else {
                Search = '';
                getcoinList();
              }

              // setSearchText(true)
              // //console.warn('MM',"dffff",SearchText);
              // alert('ddd')
            }}
            onSubmitEditing={() => getcoinList()}
            onChangeText={onChangeText}
          />
        )}
      </View>
      <View style={styles.blockChainWrap}>
        <FlatList
          contentContainerStyle={styles.coinListWrapStyle}
          data={coinList}
          onScroll={({nativeEvent}) => {
            isCloseToBottom(nativeEvent);
          }}
          ListEmptyComponent={
            <View style={styles.NoDataStyle}>
              <Text style={styles.NoDataTextStyle}>No data found</Text>
            </View>
          }
          renderItem={({item, index}) => (
            <View
              style={[
                styles.coinsListStyle,
                {backgroundColor: ThemeManager.colors.mnemonicsView},
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.coin_image ? (
                  <FastImage
                    source={{uri: item.coin_image}}
                    style={styles.coinStyle}
                  />
                ) : (
                  <View style={styles.charaterimg}>
                    <Text style={{color: Colors.white}}>
                      {item.coin_symbol?.toUpperCase().charAt(0)}
                    </Text>
                  </View>
                )}
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: areaDimen(16),
                        fontFamily: fonts.medium,
                        lineHeight: heightDimen(19),
                        color: ThemeManager.colors.textColor,
                      }}>
                      {item.coin_symbol.toUpperCase()}
                    </Text>
                    <Text
                      style={{
                        color: ThemeManager.colors.lightTextColor,
                        fontSize: areaDimen(14),
                        fontFamily: fonts.medium,
                        marginLeft: areaDimen(8),
                      }}>
                      {item?.is_token == 1
                        ? item?.coin_family == 1
                          ? 'ETH'
                          : item?.coin_family == 6
                          ? 'BNB'
                          : item?.coin_family == 11
                          ? 'MATIC'
                          : item?.coin_family == 4
                          ? 'STC'
                          : 'TRX'
                        : ''}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: ThemeManager.colors.lightTextColor,
                      fontSize: areaDimen(14),
                      fontFamily: fonts.medium,
                      // textTransform: 'capitalize',
                    }}>
                    {item.coin_name}
                  </Text>
                </View>
              </View>
              <View style={{alignSelf: 'center',marginRight: widthDimen(10),}}>
                <TouchableOpacity
                  onPress={() => {
                    if (timer?.current) {
                      clearTimeout(timer?.current);
                    }
                    timer = setTimeout(() => {
                      setisLoading(true);
                      let status = item?.coin_status == 1 ? 0 : 1;
                      coinList[index].coin_status = status;
                      coinActivityAction(item, index, status);
                      setcoinList([...coinList]);
                    }, 300);
                  }}>
                  <FastImage
                    source={
                      item?.coin_status == 1
                        ? Images.toggleOn
                        : ThemeManager.ImageIcons.toggleOff
                    }
                    style={{
                      height: heightDimen(18),
                      width: widthDimen(30),
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      {/* <BasicButton
        onPress={() => Actions.AddToken()}
        btnStyle={styles.btnStyle}
        text={LanguageManager.addToken}
      /> */}

      {/* <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => Actions.AddToken()}>
        <LinearGradient
          colors={[
            Colors.buttonColor1,
            Colors.buttonColor2,
            Colors.buttonColor3,
            Colors.buttonColor4,
          ]}
          style={styles.gradientStyle}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}>
          <Image
            source={Images.Add}
            style={{
              tintColor: Colors.white,
              height: 20,
              width: 20,
              marginHorizontal: 10,
            }}
          />

          <Text style={{color: Colors.white, fontFamily: fonts.semibold}}>
            {LanguageManager.addCustomToken}
          </Text>
        </LinearGradient>
      </TouchableOpacity> */}
      {!isBtcWallet && (
        <BasicButton
          onPress={() => {
            getCurrentRouteName() != 'AddToken' && navigate(NavigationStrings.AddToken);

            // getCurrentRouteName() != 'WalletOption' && Actions.WalletOption();
          }}
          btnStyle={[styles.btnStyle]}
          customGradient={styles.customGrad}
          // rightImage
          text={LanguageManager.addCustomToken}
        />
      )}
      {isLoading && <Loader />}

      {/* </View> */}
    </Wrap>
  );
};

const mapStateToProp = state => {
  const {coinList, search} = state.walletReducer;
  return {coinList, search};
};

export default connect(mapStateToProp, {getCoinList, coinActiveInactive})(
  ManageWallet,
);
