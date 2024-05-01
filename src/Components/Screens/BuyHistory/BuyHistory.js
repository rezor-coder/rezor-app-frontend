/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from './BuyHistoryStyle';
import { Wrap, BasicButton, BorderLine } from '../../common';
import LinearGradient from 'react-native-linear-gradient';
import { SimpleHeader } from '../../common/SimpleHeader';
import { Actions } from 'react-native-router-flux';
import { BasicInputBox } from '../../common/BasicInputBox';
import { Images, Colors } from '../../../theme/index';
import { getBuyTransactionList } from '../../../Redux/Actions';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { ButtonPrimary } from '../../common/ButtonPrimary';
import fonts from '../../../theme/Fonts';
import * as constants from '../../../Constant';
import Singleton from '../../../Singleton';
import { connect, useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import moment from 'moment';

const BuyHistory = props => {
  const dispatch = useDispatch();
  const [selectedPage, setselectedPage] = useState(0);
  const [LoadList, setLoadList] = useState(false);
  const [Page, setpage] = useState(1);
  const [limit, setlimit] = useState(25);
  const [isLoading, setisLoading] = useState(false);
  const [selectedCoinData, setselectedCoinData] = useState('');
  const [trx_page, settrx_page] = useState(1);
  const [trx_limit, settrx_limit] = useState(10);
  const [transaction_List, settransaction_List] = useState([]);
  const [totalRecords, setTotalRecordd] = useState('');
  const walletData = useSelector(state => state?.walletReducer);
  // //console.warn('MM','WallletData---------', walletData);

  useEffect(() => {
    let data = {
      page: 1,
      limit: 10,
    };
    getTransactions(data);
  }, []);
  const getTransactions = data => {
    let access_token = Singleton.getInstance().access_token;
    setisLoading(true),
      setTimeout(() => {
        dispatch(getBuyTransactionList({ data, access_token }))
          .then(response => {
            //  //console.warn('MM','response===BuyHistory====', response);
            settransaction_List(response?.data);
            setLoadList(true);
            setisLoading(false);
            setTotalRecordd(response?.meta?.total);
          })
          .catch(error => {
            //console.warn('MM','error===BuyHistory====', error);
            setisLoading(false);
          });
      }, 500);
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
    if (bottomReached && LoadList) {
      let page = Page + 1;
      setpage(page);
      setLoadList(false);
      if (transaction_List.length != totalRecords) {
        setisLoading(true);
        let access_token = Singleton.getInstance().access_token;
        Singleton.getInstance()
          .newGetData(constants.addresKeyList)
          .then(addresKeyList => {
            let addrsListKeys = JSON.parse(addresKeyList);
            let data = {
              page: page,
              limit: 10,
            };
            dispatch(getBuyTransactionList({ data, access_token }))
              .then(response => {
                // //console.warn('MM','response===History====close', response);
                const txnList = transaction_List.concat(response?.data);
                settransaction_List(txnList);
                setLoadList(true);
                setisLoading(false);
              })
              .catch(error => {
                //console.warn('MM','error===History====', error);
                setisLoading(false);
                Singleton.showAlert(error.message);
              });
          });
      }
    }
  };
  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <SimpleHeader
        back={false}
        backPressed={() => {
          Actions.pop();
        }}
        title={'Buy ' + LanguageManager.history}
        history={false}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
      />
      {transaction_List.length > 0 ? (
        <FlatList
          data={transaction_List}
          keyExtractor={(item, index) => index + ''}
          onScroll={({ nativeEvent }) => {
            isCloseToBottom(nativeEvent);
          }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  Actions.currentScene != 'BuyTransactionDetail' &&
                    Actions.BuyTransactionDetail({ TxnData: item });
                }}>
                <View
                  style={[
                    styles.tokenItem,
                    { backgroundColor: ThemeManager.colors.headerBg },
                  ]}>
                  <View style={styles.viewStyle}>
                    <Image
                      source={
                        item.blockchain_status == 'pending'
                          ? Images.time_icon
                          : item.blockchain_status == 'confirmed'
                            ? Images.icon_successfully_sent
                            : item.blockchain_status == 'failed'
                              ? Images.modal_close_icon
                              : Images.icon_successfully_sent
                      }
                      style={{
                        height: 18,
                        width: 20,
                        alignSelf: 'center',
                        //transform: [{ rotate: '-90deg' }],
                        resizeMode: 'contain',
                        tintColor: Colors.pink,
                      }}
                    />
                    <View style={{ flex: 1, paddingHorizontal: 20 }}>
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontSize: 16,
                          fontFamily: fonts.regular,
                        }}>
                        {' '}
                        Buy {item.crypto_symbol.toUpperCase()}
                      </Text>
                      <Text
                        style={{
                          color: Colors.fadeDot,
                          marginTop: 5,
                          fontSize: 14,
                          fontFamily: fonts.regular,
                        }}>
                        {moment(item.created_at).format(
                          'DD MMM, YYYY | hh:mm a',
                        )}
                      </Text>
                    </View>
                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text
                        style={{
                          color: ThemeManager.colors.textColor,
                          fontSize: 13,
                          fontFamily: fonts.regular,
                        }}>
                        $ {item.amount}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: Colors.fadeDot }}>
            {LanguageManager.noTransactionFound}
          </Text>
        </View>
      )}
      {isLoading && <Loader />}
    </Wrap>
  );
};

export default BuyHistory;
