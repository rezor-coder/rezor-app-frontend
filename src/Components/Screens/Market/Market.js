/* eslint-disable react-native/no-inline-styles */
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  FlatList,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {ThemeManager} from '../../../../ThemeManager';
import {APIClient} from '../../../Api';
import * as Constants from '../../../Constant';
import {HUOBI_TOKEN_LIST} from '../../../Endpoints';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import {getSwapListAll, saveSwapItem} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {
  getCurrentRouteName,
  goBack,
  navigate,
  reset,
} from '../../../navigationsService';
import {Fonts, Images} from '../../../theme';
import fonts from '../../../theme/Fonts';
import {MainStatusBar, SelectionModal, SimpleHeaderNew} from '../../common';
import {Card} from '../../common/Card';
import {Wrap} from '../../common/Wrap';
import Loader from '../Loader/Loader';
import styles from './MarketStyle';

const tabData = [{title: 'Favourites'}, {title: 'USDT'}];

const Market = props => {
  const dispatch = useDispatch();
  const [tabstatus, setTabSatus] = useState('usdt');
  const [jugad, setJugad] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [desiredToken, setDesiredToken] = useState('usdt');
  const [desiredTokenListing, setDesiredTokenListing] = useState({});
  const [sortType, setSortType] = useState(false);
  const [sortField, setSortField] = useState('price');
  const [isLoading, setIsLoading] = useState(false);
  const [openModel, setOpenModal] = useState(false);
  const [showSaitaDex, setShowSaitaDex] = useState(true);
  const [saitaDexListing, setSaitaDexListing] = useState([]);
  const [searchFilteredArray, setSearchFilteredArray] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [randomMath, setRandomMath] = useState(0);
  const flatlist_ref = createRef();
  const [showInvalid, setShowInValid] = useState(false);
  const [activeWallet, setActiveWallet] = useState(0);
  const timer = useRef();
  const initialCall = async () => {
    let isPrivate = await Singleton.getInstance().newGetData(
      Constants.IS_PRIVATE_WALLET,
    );
    console.log('isPrivate:::', isPrivate);
    if (isPrivate) {
      setActiveWallet(isPrivate);
    } else {
      setActiveWallet(0);
    }
  };
  useEffect(() => {
    console.log('initialCall:::');
    initialCall();
  }, [props]);
  /******************************************************************************************/
  useEffect(() => {
    let backHandle;
    backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
      if (getCurrentRouteName() == 'Market') {
        getCurrentRouteName() != 'Main' && reset(NavigationStrings.Main);
      } else {
        goBack();
      }
      return true;
    });
    EventRegister.addEventListener('downModal', data1 => {
      setOpenModal(false);
    });
    showSaitaDex ? getsaitaDexList() : findDesiredToken();
    // getFavourite();
    let focus = props.navigation.addListener('focus', () => {
      backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
        if (getCurrentRouteName() == 'Market') {
          getCurrentRouteName() != 'Main' && reset(NavigationStrings.Main);
        } else {
          goBack();
        }
        return true;
      });
      initialCall();
      console.log('chk focus:::::::');
      setSearchText('');
      showSaitaDex ? getsaitaDexList() : findDesiredToken();
      // getFavourite();
    });
    let blur = props.navigation.addListener('blur', () => {
      backHandle?.remove();
    });
    return () => {
      backHandle?.remove();
      blur();
      focus();
    };
  }, []);

  /******************************************************************************************/
  useEffect(() => {
    if (showSaitaDex) {
      if (saitaDexListing?.length > 0) {
        try {
          flatlist_ref?.current &&
            flatlist_ref?.current?.scrollToIndex({index: 0});
        } catch (e) {}
      }
    } else {
      if (
        (searchedData[tabstatus?.toLowerCase()] || [])?.length > 0 ||
        saitaDexListing?.length > 0
      ) {
        try {
          flatlist_ref?.current &&
            flatlist_ref?.current?.scrollToIndex({index: 0});
        } catch (e) {}
      }
    }

    return () => {};
  }, [randomMath, searchText, showSaitaDex]);

  /******************************************************************************************/
  const findDesiredToken = useCallback(
    (token = desiredToken) => {
      setJugad(!jugad);
      setIsLoading(true);
      let url = new URLSearchParams({
        limit: 500,
        receivableCurrency: token,
      });
      APIClient.getInstance()
        .get(HUOBI_TOKEN_LIST, Singleton.getInstance().access_token)
        .then(res => {
          setIsLoading(false);
          console.log('res', res);
          setSearchText('');
          // setShowSaitaDex(false);
          if (!res?.error) {
            let data = res.data?.map(item => {
              return {
                ...item,
                backgroundColor:
                  '#' + parseInt(Math.random() * 1000).toString() + 'a',
              };
            });
            setDesiredTokenListing(res.data);
            setSearchedData(res.data);
            setRandomMath(parseInt(Math.random() * 100));
          } else {
            Singleton.showAlert(res?.message || 'Something went wrong');
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log('err', err);
        });
    },
    [desiredToken, desiredTokenListing],
  );

  /******************************************************************************************/
  const changeText = val => {
    setSearchText(val);
    console.log('val:::', val);
    if (val?.trim() == '') {
      console.log(':::::');
      // if (activeWallet == Constants.COIN_SYMBOL.BNB) {
      //   list = searchFilteredArray?.filter(item => item?.coin_family == 6);
      // } else if (activeWallet == Constants.COIN_SYMBOL.ETH) {
      //   list = searchFilteredArray?.filter(item => item?.coin_family == 1);
      // }
      showSaitaDex
        ? setSaitaDexListing(searchFilteredArray)
        : setSearchedData([...desiredTokenListing]);
    }
    if (val && val?.trim() != '') {
      console.log(':::::33333', val);
      if (showSaitaDex) {
        const filteredData = searchFilteredArray.filter(function (item) {
          return (
            item?.coin_name.toLowerCase().includes(val.trim().toLowerCase()) ||
            item?.coin_symbol.toLowerCase().includes(val.trim().toLowerCase())
          );
        });
        let list = filteredData;
        // if (activeWallet == Constants.COIN_SYMBOL.BNB) {
        //   list = filteredData?.filter(item => item?.coin_family == 6);
        // } else if (activeWallet == Constants.COIN_SYMBOL.ETH) {
        //   list = filteredData?.filter(item => item?.coin_family == 1);
        // }
        setSaitaDexListing(list);
      } else {
        console.log(':::::3444444', val);
        let filteredList = desiredTokenListing?.filter(token => {
          return token?.symbol
            ?.toLowerCase()
            ?.includes(val?.trim()?.toLowerCase());
        });
        console.log(':::::filteredList', filteredList);
        setSearchedData(filteredList ? filteredList : []);
      }
    } else {
      let list = searchFilteredArray;
      // if (activeWallet == Constants.COIN_SYMBOL.BNB) {
      //   list = searchFilteredArray?.filter(item => item?.coin_family == 6);
      // } else if (activeWallet == Constants.COIN_SYMBOL.ETH) {
      //   list = searchFilteredArray?.filter(item => item?.coin_family == 1);
      // }
      showSaitaDex
        ? setSaitaDexListing(list)
        : setSearchedData([...desiredTokenListing]);
    }
  };

  /******************************************************************************************/
  const onPressItem = item => {
    setOpenModal(false);
    setSearchText('');
    if (item.toLowerCase() == 'saitadex') {
      return getsaitaDexList();
    } else {
      return findDesiredToken();
    }
  };

  /******************************************************************************************/
  const getsaitaDexList = () => {
    setIsLoading(true);
    setShowSaitaDex(true);
    const access_token = Singleton.getInstance().access_token;
    let data = {
      fiatType: 'usd',
    };
    dispatch(getSwapListAll({access_token, data}))
      .then(async res => {
        let isPrivate = await Singleton.getInstance().newGetData(
          Constants.IS_PRIVATE_WALLET,
        );
        if (res.status) {
          let bnbList = res?.data?.filter(item => item.coin_family == 6);
          let ethList = res?.data?.filter(item => item.coin_family == 1);
          let stcList = res?.data?.filter(item => item.coin_family == 4);
          console.log('bnbList::::', bnbList, 'ethList:::', ethList);
          Singleton.coinListCaching = {
            bnb: bnbList,
            eth: ethList,
            all: res.data,
            stc: stcList,
          };
          console.log('getsaitaDexList', 'res :::::::::', res, activeWallet);
          let list = res.data;

          setSaitaDexListing(list);
          setSearchFilteredArray(res?.data || []);
        }
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('getsaitaDexList', 'err :::::::::', err);
      });
  };
  const onPressSwap = item => {
    Singleton.getInstance()
      .newGetData(Constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (
          isPrivate != Constants.COIN_SYMBOL.ETH &&
          isPrivate != Constants.COIN_SYMBOL.BNB &&
          isPrivate != Constants.COIN_SYMBOL.MATIC &&
          isPrivate != Constants.COIN_SYMBOL.TRX &&
          isPrivate != Constants.COIN_SYMBOL.BTC &&
          isPrivate != Constants.COIN_SYMBOL.STC
        ) {
          dispatch(saveSwapItem(item));
          getCurrentRouteName() != 'SwapNew' &&
            navigate(NavigationStrings.SwapNew, {chain: isPrivate, item: item});
        } else if (isPrivate == Constants.COIN_SYMBOL.ETH) {
          if (item?.coin_family == 1) {
            dispatch(saveSwapItem(item));
            getCurrentRouteName() != 'SwapNew' &&
              navigate(NavigationStrings.SwapNew, {
                chain: isPrivate,
                item: item,
              });
          } else {
            Singleton.showAlert(Constants.UNCOMPATIBLE_WALLET);
          }
        } else if (isPrivate == Constants.COIN_SYMBOL.BNB) {
          if (item?.coin_family == 6) {
            dispatch(saveSwapItem(item));
            getCurrentRouteName() != 'SwapNew' &&
              navigate(NavigationStrings.SwapNew, {
                chain: isPrivate,
                item: item,
              });
          } else {
            Singleton.showAlert(Constants.UNCOMPATIBLE_WALLET);
          }
        } else if (isPrivate == Constants.COIN_SYMBOL.STC) {
          if (item?.coin_family == 4) {
            dispatch(saveSwapItem(item));
            getCurrentRouteName() != 'SwapNew' &&
              navigate(NavigationStrings.SwapNew, {
                chain: isPrivate,
                item: item,
              });
          } else {
            Singleton.showAlert(Constants.UNCOMPATIBLE_WALLET);
          }
        } else {
          Singleton.showAlert(Constants.UNCOMPATIBLE_WALLET);
        }
      });
  };

  const onPressBuySell = item => {
    if (activeWallet == Constants.COIN_SYMBOL.ETH || activeWallet == 0) {
      getCurrentRouteName() != 'TradeSwap' &&
        navigate(NavigationStrings.TradeSwap, {item: item});
    } else {
      Singleton.showAlert(Constants.UNCOMPATIBLE_WALLET);
    }
  };
  /******************************************************************************************/
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
        title={showSaitaDex ? 'Rezor' : 'HTX Exchange'}
        // backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        back={false}
        backPressed={() => {
          props.navigation.goBack();
        }}
      />

      <View style={[styles.roundView]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {/* <TouchableOpacity
            style={{padding: areaDimen(10), left: -10}}
            onPress={() => {
              setOpenModal(true);
            }}>
            <FastImage
              source={ThemeManager.ImageIcons.filter}
              style={{
                height: heightDimen(24),
                width: widthDimen(24),
              }}
              tintColor={ThemeManager.colors.inActiveColor}
            />
          </TouchableOpacity> */}
          <View
            style={{
              borderWidth: 1,
              borderColor: ThemeManager.colors.viewBorderColor,
              flexDirection: 'row',
              paddingHorizontal: widthDimen(22),
              borderRadius: areaDimen(25),
              height: heightDimen(45),
              backgroundColor: ThemeManager.colors.bg,
              alignItems: 'center',
              width: '100%',
              // left: widthDimen(-5),
              alignSelf: 'center',
            }}>
            <TextInput
              maxLength={25}
              placeholder="Search "
              placeholderTextColor={ThemeManager.colors.lightTextColor}
              style={{
                fontSize: areaDimen(14),
                fontFamily: Fonts.medium,
                flexGrow: 1,
                color: ThemeManager.colors.textColor,
              }}
              value={searchText}
              onChangeText={val => {
                changeText(val);
              }}
            />
            <FastImage
              source={Images.searchIconDark}
              style={{height: areaDimen(18), width: areaDimen(18)}}
              resizeMode="contain"
            />
          </View>
        </View>

        <View
          style={{marginTop: heightDimen(20), marginBottom: heightDimen(6)}}>
          <Text
            style={{
              fontFamily: fonts.semibold,
              color: ThemeManager.colors.textColor,
              fontSize: areaDimen(16),
              lineHeight: areaDimen(19),
            }}>
            Token Listed
          </Text>
        </View>

        {showSaitaDex ? (
          <FlatList
            bounces={false}
            ref={flatlist_ref}
            style={{flex: 1}}
            contentContainerStyle={{
              overflow: 'hidden',
              flexGrow: 1,
              paddingVertical: heightDimen(10),
            }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    marginBottom: heightDimen(Platform.OS == 'ios' ? 50 : 90),
                  }}
                />
              );
            }}
            data={saitaDexListing}
            keyExtractor={(item, index) => index + ''}
            renderItem={({item, index}) => {
              return (
                <Card
                  onPressSwap={() => onPressSwap(item)}
                  onPressBuy={() => onPressBuySell(item)}
                  isSaitaDex={showSaitaDex}
                  item={item}
                />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      color: ThemeManager.colors.textColor,
                    }}>
                    No Data Found
                  </Text>
                </View>
              );
            }}
          />
        ) : (
          <FlatList
            bounces={false}
            ref={flatlist_ref}
            style={{flex: 1, marginHorizontal: widthDimen(-5)}}
            contentContainerStyle={{
              overflow: 'hidden',
              flexGrow: 1,
              paddingVertical: heightDimen(10),
            }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    marginBottom: heightDimen(Platform.OS == 'ios' ? 50 : 90),
                  }}
                />
              );
            }}
            data={searchedData}
            keyExtractor={(item, index) => index + ''}
            renderItem={({item, index}) => {
              return (
                <Card
                  onPressSwap={() => onPressSwap(item)}
                  onPressBuy={() => onPressBuySell(item)}
                  isSaitaDex={showSaitaDex}
                  item={item}
                />
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      color: ThemeManager.colors.textColor,
                    }}>
                    No Data Found
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>

      <SelectionModal
        openModel={openModel}
        onPressIn={() => setOpenModal(false)}
        onPress={item => onPressItem(item)}
      />
      {isLoading && <Loader />}
    </Wrap>
  );
};

export default Market;
