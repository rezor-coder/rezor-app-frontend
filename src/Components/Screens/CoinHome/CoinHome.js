import { View, Text, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './CoinHomeStyles';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { BorderLine, MainStatusBar, SimpleHeaderNew, Wrap } from '../../common';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { CommaSeprator3, exponentialToDecimalWithoutComma } from '../../../utils';
import Singleton from '../../../Singleton';
import FastImage from 'react-native-fast-image';
import { Images } from '../../../theme';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionList, saveSwapItem } from '../../../Redux/Actions';
import Loader from '../Loader/Loader';
import HistoryItem from '../../common/HistoryItem';
import { Actions } from 'react-native-router-flux';
import fonts from '../../../theme/Fonts';
import * as constants from '../../../Constant';
const CoinHome = props => {
  const { coin } = props;
  const dispatch = useDispatch();
  const [historyList, setHistoryList] = useState([]);
  const [Page, setpage] = useState(1);
  const trx_limit = 25;
  const [isLoading, setisLoading] = useState(true);
  const [totalRecords, setTotalRecordd] = useState('');
  console.log('props:::::::::', coin);
  const [LoadList, setLoadList] = useState(false);
  const { refreshWallet } = useSelector(state => state?.walletReducer);
  useEffect(() => {
    let backHandle = null;
    backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
    getHistory();
    let focus = props.navigation.addListener('didFocus', () => {
      backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
      getHistory();
    });
    let blur = props.navigation.addListener('didBlur', () => {
      backHandle?.remove()
    })
    return () => {
      blur?.remove()
      focus?.remove();
      backHandle?.remove();
    };
  }, [refreshWallet]);
  const backAction=()=>{
    Actions.pop();
    return true;
  }
  function getHistory() {
    let addrssList = [coin.wallet_address];
    let coinFamilyKeys = [coin.coin_family];
    let data = {
      addrsListKeys: addrssList,
      page: 1,
      limit: trx_limit,
      coin_family: coinFamilyKeys,
      status: '',
      coin_type: '',
      trnx_type: '',
      from_date: '',
      to_date: '',
      coin_id: coin.coin_id,
    };
    getTransactions(data);
  }
  const getTransactions = data => {
    let access_token = Singleton.getInstance().access_token;
    setisLoading(historyList.length > 0 ? false : true),
      setTimeout(() => {
        dispatch(getTransactionList({ data, access_token }))
          .then(response => {
            console.warn('MM', 'response===History====', response);
            setHistoryList(response?.data);
            setTotalRecordd(response.meta.total);
            setLoadList(true);
            setisLoading(false);
            setpage(1);
          })
          .catch(error => {
            console.warn('MM', 'error===History====', error);
            setisLoading(false);
          });
      }, 500);
  };
  const isCloseToBottom = async ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    console.log("::::::isCloseToBottom:");
    const paddingToBottom = 60;
    let bottomReached =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    console.log("::::::bottomReached:", bottomReached, LoadList);
    if (bottomReached && LoadList) {
      let page = Page + 1;
      setpage(page);
      setLoadList(false);
      if (historyList.length != totalRecords) {
        setisLoading(true);
        let access_token = Singleton.getInstance().access_token;
        let addrssList = [coin.wallet_address];
        let coinFamilyKeys = [coin.coin_family];
        let data = {
          addrsListKeys: addrssList,
          page: page,
          limit: trx_limit,
          coin_family: coinFamilyKeys,
          status: '',
          coin_type: '',
          trnx_type: '',
          from_date: '',
          to_date: '',
          coin_id: coin.coin_id,
        };
        dispatch(getTransactionList({ data, access_token }))
          .then(response => {
            console.warn('MM', 'response===History====close', response?.data);
            const txnList = historyList.concat(response?.data);
            setHistoryList(txnList);
            setLoadList(true);
            setisLoading(false);
          })
          .catch(error => {
            console.warn('MM', 'error===History====', error);
            setisLoading(false);
            Singleton.showAlert(err.message);
          });
      }
    }
  };
  const onSend = (item = coin) => {
    Singleton.getInstance().updateBalance(item?.coin_id, item?.wallet_address);
    if (item.coin_family == 1) {
      Actions.currentScene != 'SendETH' && Actions.SendETH({ walletData: item });
    } else if (item.coin_family == 6) {
      Actions.currentScene != 'SendBNB' && Actions.SendBNB({ walletData: item });
    } else if (item.coin_family == 11) {
      Actions.currentScene != 'SendMATIC' &&
        Actions.SendMATIC({ walletData: item });
    } else if (item.coin_family == 2) {
      Actions.currentScene != 'SendBTC' && Actions.SendBTC({ walletData: item });
    } else if (item.coin_family == 3) {
      Actions.currentScene != 'SendTRX' && Actions.SendTRX({ walletData: item });
    } else if (item.coin_family == 8) {
      Actions.currentScene != 'SendSOL' && Actions.SendSOL({ walletData: item });
    }else if (item.coin_family == 4) {
      Actions.currentScene != 'SendSTC' && Actions.SendSTC({ walletData: item });
    }
  };
  const onRecieve = (item = coin) => {
    Actions.currentScene != 'QrCode' && Actions.QrCode({ item: item });
  };
  const onPresSwap = (item = coin) => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        dispatch(saveSwapItem(item))
        Actions.currentScene != 'Trade' &&
          Actions.Trade({ chain: isPrivate, item: item });
      });
  };
  const OptionsBg = ({ image, text, onPress }) => {
    return (
      <TouchableOpacity
        style={[
          styles.optionBg,
          { backgroundColor: ThemeManager.colors.primary },
        ]}
        onPress={() => onPress()}>
        <FastImage
          style={styles.optionsImage}
          source={image}
          resizeMode="contain"
        />
        <Text
          style={[styles.optionText, { color: ThemeManager.colors.colorLight }]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => {
    return (
      <>
        <View
          style={[
            styles.box,
            { backgroundColor: ThemeManager.colors.swapBg },
          ]}>
          {coin?.coin_image ? (
            <FastImage
              style={styles.coinImage}
              source={{ uri: coin?.coin_image }}
            />
          ) : (
            <View
              style={[
                styles.coinImage,
                {
                  backgroundColor: ThemeManager.colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: fonts.semibold,
                  fontSize: areaDimen(18),
                }}>
                {coin?.coin_symbol?.toUpperCase()?.charAt(0)}
              </Text>
            </View>
          )}
          <Text
            style={[
              styles.coinBalanceStyle,
              { color: ThemeManager.colors.textColor },
            ]}>
            {Singleton.getInstance().toFixednew(
              exponentialToDecimalWithoutComma(coin?.balance),
              8,
            )}{' '}
            {coin?.coin_symbol?.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.coinBalanceFiatStyle,
              { color: ThemeManager.colors.inActiveColor },
            ]}>
            {coin?.currency_symbol} {CommaSeprator3(coin?.perPrice_in_fiat, 8)}
            <Text
              style={{
                color: coin?.price_change_percentage?.toString()?.includes('-')
                  ? ThemeManager.colors.sell
                  : ThemeManager.colors.buy,
              }}>
              {' '}
              {coin?.price_change_percentage?.toString()?.includes('-')
                ? ''
                : '+'}
              {coin?.price_change_percentage?.toFixed(2)}%
            </Text>
          </Text>
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              bottom: areaDimen(-25),
              justifyContent: 'space-evenly',
              alignItems: 'center',
              width: '100%',
            }}>
            <OptionsBg
              image={Images.send}
              text={LanguageManager.send}
              onPress={onSend}
            />
            <OptionsBg
              image={Images.recieve}
              text={LanguageManager.receive}
              onPress={onRecieve}
            />
            {coin?.is_swap == 1 && (
              <OptionsBg
                image={Images.swap}
                text={LanguageManager.swap}
                onPress={onPresSwap}
              />
            )}
          </View>
        </View>
        <Text
          style={[
            styles.trxHistoryText,
            { color: ThemeManager.colors.textColor },
          ]}>
          Transaction History
        </Text>
      </>
    );
  };
  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg, flex: 1 }}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <SimpleHeaderNew
        title={
          coin?.coin_symbol?.toUpperCase() +
          (coin.is_token == 1
            ? coin?.coin_family == 1
              ? ' (ERC20)'
              : coin?.coin_family == 6
                ? ' (BEP20)'
                : coin?.coin_family == 3
                  ? ' (TRC20)'
                  : coin?.coin_family == 11
                    ? ' (MATIC ERC20)'
                    :coin?.coin_family==4
                    ? ' (SBC24)'
                    : ''
            : '')
        }
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          props.navigation.goBack();
        }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: ThemeManager.colors.bg,
          marginBottom: -40,
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
          data={historyList}
          onScroll={({ nativeEvent }) => {
            isCloseToBottom(nativeEvent);
          }}
          renderItem={({ item, index }) => (
            <HistoryItem
              onPress={() => {
                Actions.currentScene != 'TransactionDetail' &&
                  Actions.TransactionDetail({ TxnData: item });
              }}
              item={item}
              index={index}
            />
          )}
          ListFooterComponent={() => {
            return <View style={{ marginBottom: heightDimen(60) }} />;
          }}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: heightDimen(200),
                }}>
                <Text
                  style={[
                    styles.notFound,
                    { color: ThemeManager.colors.inActiveColor },
                  ]}>
                  {LanguageManager.NoHistory}
                </Text>
              </View>
            );
          }}
        />
      </View>
      {isLoading && <Loader />}
    </Wrap>
  );
};

export default CoinHome;
