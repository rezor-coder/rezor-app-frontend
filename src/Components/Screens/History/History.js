/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import {
  FlatList
} from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getTransactionList } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import { Colors } from '../../../theme/index';
import {
  BorderLine,
  MainHeader,
  SimpleHeaderNew,
  Wrap
} from '../../common';
import HistoryItem from '../../common/HistoryItem';
import Loader from '../Loader/Loader';
import * as Constants from '../../../Constant';
import { isEmpty } from 'lodash';

const History = props => {
  const dispatch = useDispatch();
  const [selectedPage, setselectedPage] = useState(0);
  const [LoadList, setLoadList] = useState(false);
  const [Page, setpage] = useState(1);
  const [limit, setlimit] = useState(25);
  const [isLoading, setisLoading] = useState(false);
  const [selectedCoinData, setselectedCoinData] = useState('');
  const [trx_page, settrx_page] = useState(1);
  const [trx_limit, settrx_limit] = useState(25);
  const [transaction_List, settransaction_List] = useState([]);
  const [totalRecords, setTotalRecordd] = useState('');
  const walletData = useSelector(state => state?.walletReducer);
  // //console.warn('MM','WallletData---------', walletData);
  const {refreshWallet} = useSelector(state => state?.walletReducer);

  useEffect(() => {
    Singleton.getInstance()
      .newGetData(Constants.History)
      .then((res) => {
        let temp = !!res ? res : '[]'
        console.log(res,'resresresres');
        setisLoading(!isEmpty(JSON.parse(temp)) ? false : true)
        settransaction_List(!isEmpty(JSON.parse(temp)) ? JSON.parse(temp) :[])
        getHistory();
      }).catch(error => {
        console.log(error, 'errorerror');
      })

    
    // let focus = props.navigation.addListener('focus', () => {
    //   getHistory();
    // });

    // return () => {
    //   focus();
    // };
  }, []);

  function getHistory() {
    Singleton.getInstance()
      .newGetData(constants.addresKeyList)
      .then(addrssList => {
        Singleton.getInstance()
          .newGetData(constants.coinFamilyKeys)
          .then(coinFamilyKeys => {
            console.log(
              'addrssList',
              addrssList,
              'coinFamilyKeys',
              coinFamilyKeys?.split(','),
            );
            let data = {
              addrsListKeys: JSON.parse(addrssList),
              page: 1,
              limit: trx_limit,
              coin_family: coinFamilyKeys?.split(','),
              status: '',
              coin_type: '',
              trnx_type: '',
              from_date: '',
              to_date: '',
            };
            getTransactions(data);
          });
      });
  }

  // const convertToPdf = () =>{
  //   let csvRequestData = [];
  //   this.state.originalList.forEach(item => {
  //     csvRequestData.push({
  //       Transaction_ID: item?.tx_id,
  //       Type: item?.type.toUpperCase(),
  //       From_Address: item?.from_adrs,
  //       Amount: item?.amount,
  //       Coin_symbol: item?.coin_symbol.toUpperCase(),
  //       Status: item?.status,
  //       Blockchain_status: item?.blockchain_status,
  //       To_address: item?.to_adrs,
  //       Wallet_name: item?.wallet_name,
  //       Created_at: item?.created_at,
  //     });
  //   });
  //   // console.log("csvRequestData:::::", csvRequestData);
  //   let csv = jsonToCSV(csvRequestData);
  //   // console.log("csv::::", csv);
  //   let path = null

  //   if (Platform.OS == "android") {
  //     path = RNFetchBlob.fs.dirs.DownloadDir + '/SHIDO_Transactions_' + this.props?.selectedCoin?.coin_symbol?.toUpperCase() + '_' + new Date().getTime() + '.csv';
  //   } else {
  //     path = RNFetchBlob.fs.dirs.DocumentDir + '/SHIDO_Transactions_' + this.props?.selectedCoin?.coin_symbol?.toUpperCase() + '_' + new Date().getTime() + '.csv';
  //   }
  //   // console.log("csv_path::::", path);
  //   if (Platform.OS == "android") {
  //     RNFetchBlob.fs.mkdir(RNFetchBlob.fs.dirs.DownloadDir).catch(err => {
  //       console.log("mkdir_err:::", err);
  //     });
  //     RNFetchBlob.fs.createFile(path, csv).then(res => {
  //       console.log(res);
  //       this.setState({
  //         showAlertDialog: true,
  //         alertTxt: 'Transaction history saved successfully',
  //       });
  //     }).catch(er => {
  //       console.log("createFile_err", er);
  //       this.setState({
  //         showAlertDialog: true,
  //         alertTxt: 'Unable to save the transaction history',
  //       });
  //     });
  //   } else {
  //     RNFetchBlob.fs.mkdir(RNFetchBlob.fs.dirs.DocumentDir).then(res => {
  //       // console.log("mkdir::::::", res);
  //     }).catch(err => {
  //       console.log("mkdir_err:::", err);
  //     });
  //     RNFetchBlob.fs.createFile(path, csv, 'utf8').then(res => {
  //       // console.log("createFile::::::", res);
  //       this.setState({
  //         showAlertDialog: true,
  //         alertTxt: 'Transaction history saved successfully',
  //       });
  //     }).catch(er => {
  //       console.log("createFile_err", er);
  //       this.setState({
  //         showAlertDialog: true,
  //         alertTxt: 'Unable to save the transaction history',
  //       });
  //     });
  //   }
  // }

  const getTransactions = data => {
    let access_token = Singleton.getInstance().access_token;
    // alert(transaction_List.length)
    // setisLoading(transaction_List.length > 0 ? false : true),
      setTimeout(() => {
        dispatch(getTransactionList({data, access_token}))
          .then(response => {
            console.warn('MM', 'response===History====', response?.data);
            Singleton.getInstance().newSaveData(Constants.History,JSON.stringify(response?.data))
            settransaction_List(response?.data);
            setTotalRecordd(response.meta.total);
            setLoadList(true);
            setisLoading(false);
            setpage(1);
          })
          .catch(error => {
            //console.warn('MM','error===History====', error);
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
            Singleton.getInstance()
              .newGetData(constants.coinFamilyKeys)
              .then(coinFamilyKey => {
                let addrsListKeys = JSON.parse(addresKeyList);
                let coinFamilyKeys = coinFamilyKey?.split(',');
                let data = {
                  addrsListKeys: addrsListKeys,
                  page: page,
                  limit: trx_limit,
                  coin_family: coinFamilyKeys,
                  status: '',
                  coin_type: '',
                  trnx_type: '',
                  from_date: '',
                  to_date: '',
                };
                dispatch(getTransactionList({data, access_token}))
                  .then(response => {
                    console.warn(
                      'MM',
                      'response===History====close',
                      response?.data,
                    );
                    const txnList = transaction_List.concat(response?.data);
                    settransaction_List(txnList);
                    setLoadList(true);
                    setisLoading(false);
                  })
                  .catch(error => {
                    //console.warn('MM','error===History====', error);
                    setisLoading(false);
                    Singleton.showAlert(err.message);
                  });
              });
          });
      }
    }
  };

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      {global.currentScreen === 'tabs' ? (
        <MainHeader
          goback={false}
          // onpress2={() =>
          //   getCurrentRouteName() != 'SelectBlockchain' &&
          //   Actions.SelectBlockchain({ blockChainsList: walletList })
          // }
          searchEnable={false}
          onChangedText={text => {
            // alert(text)
          }}
          onpress3={() =>
            //    setModalVisible(true)
            // getCurrentRouteName() != 'History' && Actions.Setting()
            getCurrentRouteName() != 'Setting' &&
            props.navigation.navigate('Setting', {
              onGoBack: () => {
                // getThemeData();
              },
            })
          }
          onpress2={() => {
            getCurrentRouteName() != 'Notification' && navigate(NavigationStrings.Notification);
          }}
          styleImg3={{tintColor: '#B1B1B1', width: 20}}
          //  firstImg={Images.Bell}
          secondImg={ThemeManager.ImageIcons.bellIcon}
          thridImg={ThemeManager.ImageIcons.setting}
        />
      ) : (
        <SimpleHeaderNew
          title={LanguageManager.history}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle
          imageShow
          back={false}
          backPressed={() => {
            props.navigation.goBack();
          }}
          // img3={ThemeManager.ImageIcons.setting}
          // img2={ThemeManager.ImageIcons.bellIcon}
          // onPress2={() => {
          //   getCurrentRouteName() != 'Notification' && Actions.Notification();
          // }}
          // onPress3={() => {
          //   // getCurrentRouteName() != 'Setting' && Actions.Setting();
          //   getCurrentRouteName() != 'Setting' && Actions.Setting();
          // }}
        />
      )}
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      {transaction_List.length > 0 ? (
        <>
          <FlatList
            bounces={false}
            data={transaction_List}
            // style={{marginTop:heightDimen(20)}}
            keyExtractor={(item, index) => index + ''}
            onScroll={({nativeEvent}) => {
              isCloseToBottom(nativeEvent);
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <HistoryItem
                onPress={() => {
                  getCurrentRouteName() != 'TransactionDetail' &&
                  navigate(NavigationStrings.TransactionDetail,{TxnData: item});
                }}
                item={item}
              />
            )}
          />
        </>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: Colors.fadeDot}}>
            {LanguageManager.NoHistory}
          </Text>
        </View>
      )}
      {isLoading && <Loader />}
    </Wrap>
  );
};

export default memo(History);
