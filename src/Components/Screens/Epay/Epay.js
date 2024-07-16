/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Modal,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-easy-toast';
import FastImage from 'react-native-fast-image';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import {
  checkMaintenance,
  epayMerchant,
  getBuyRAte,
  getCryptoPrice,
  getDexUrls,
} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Colors, Fonts } from '../../../theme';
import Images from '../../../theme/Images';
import { CommaSeprator3 } from '../../../utils';
import {
  BasicButton,
  MainStatusBar,
  SimpleHeader
} from '../../common';
import { BorderLine, KeyboardDigit, Wrap } from '../../common/index';
import Loader from '../Loader/Loader';
import ListModal from '../SwapSelected/ListModal';
import styles from './EpayStyle';
var debounce = require('lodash.debounce');
const currency = [];
// const Epay = ({ navigation }) => {
const Epay = props => {
  const EpayUrlSaved = useSelector(
    state => state?.walletReducer?.dex_data?.epayUrl,
  );
  console.log('props==', EpayUrlSaved);
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [fiatamount, setAmount] = useState('');
  const [coinImage, setCoinImage] = useState(
    props.selectedItem == undefined
      ? ''
      : props.selectedItem?.coin_image
        ? props.selectedItem?.coin_image
        : '',
  );
  const [coinType, setcoinType] = useState(
    props.selectedItem == undefined
      ? 'ETH'
      : props.selectedItem?.coin_symbol
        ? props.selectedItem?.coin_symbol.toUpperCase()
        : '',
  );
  const [coinID, setcoinID] = useState(
    props.selectedItem == undefined
      ? 1
      : props.selectedItem?.coin_id
        ? props.selectedItem?.coin_id
        : '',
  );
  const [epayUrl, setEpayUrl] = useState(EpayUrlSaved);
  const [converted, setconverted] = useState('');
  const refTextInput = useRef();
  const [cryptPricedata, setcryptPriceData] = useState([]);
  const [cryptsettingData, setcryptsettingData] = useState([]);
  const [limitData, setLimitData] = useState([]);
  const [cryptPrice, setcryptPrice] = useState([]);
  const [cryptList, setcryptList] = useState([]);
  const [actualcryptPrice, setActualcryptPrice] = useState([]);
  const [isfetching, setIsfetching] = useState(false);
  const [initialText, setInitialText] = useState('ETH');
  const [selectFromDropDown, setSelectFromDropDown] = useState(false);
  const [showList, setShowList] = useState(false);
  const [isOnMaintainance, setIsOnMaintainance] = useState(false);
  const [isOnMaintainanceMsg, setIsOnMaintainanceMsg] = useState('');
  const toastRef = useRef();
  const dropDownRef = useRef();
  let toast;

  useEffect(() => {
    let backHandle = null;
    Singleton.getInstance()
      .newGetData(Constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (isPrivate == 'eth' || isPrivate == 'bnb') {
          setcoinType(isPrivate?.toUpperCase());
          setCoinImage(
            isPrivate == 'eth'
              ? 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880'
              : 'https://assets-cdn.trustwallet.com/blockchains/smartchain/info/logo.png',
          );
        }
      });
    backHandle = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    getCryptoPriceApi(true);
    let focus = props.navigation.addListener('focus', () => {
      backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
      let access_token = Singleton.getInstance().access_token;
      if (epayUrl == '') {
        dispatch(getDexUrls(access_token))
          .then(response => {
            let url = '';
            response?.map(item => {
              if (item.name.toUpperCase() == 'EPAY') {
                console.warn('MM', 'response==getDexUrls ==== pin', item.url);
              }
            });
            if (url?.length > 0) {
              setEpayUrl(url);
            } else {
              getCurrentRouteName() == 'Epay' && Singleton.showAlert(
                'Something went wrong. Please try after sometime.',
              );
            }
            console.warn('MM', 'response==getDexUrls ==== pin', response);
            setisLoading(false);
          })
          .catch(error => {
            setisLoading(false);
            getCurrentRouteName() == 'Epay' && Singleton.showAlert(
              error?.toString() ||
              'Something went wrong. Please try after sometime.',
            );
            console.warn('MM', 'error==getDexUrls=== pin', error);
          });
      }
      dispatch(checkMaintenance())
        .then(res => {
          console.log('res::::checkMaintenance', res);
          let epayCheck = res?.data?.find(
            item => item.type == 'IS_EPAY_MAINTENANCE',
          );
          if (epayCheck?.value == 1) {
            setIsOnMaintainanceMsg(epayCheck?.msg);
            setIsOnMaintainance(true);
            getCurrentRouteName() == 'Epay' && Singleton.showAlert(epayCheck?.msg);
          } else {
            setIsOnMaintainance(false);
          }
        })
        .catch(err => {
          console.log('err::::checkMaintenance', err);
        });
    });
    let blur = props.navigation.addListener('blur', () => {
      backHandle?.remove()
      if (dropDownRef?.current) {
        dropDownRef?.current?.closeDropdown();
      }
    });
    return () => {
      backHandle?.remove()
      blur();
      focus();
    };
  }, []);
  const backAction = () => {
    goBack();
    return true;
  }
  const handler = useCallback(
    debounce(text => {
      console.log('texttt==', text);
    if(limitData[0]?.min_price){
      if (+text > +limitData[0]?.min_price) {
        getRate(text);
      } else {
        setconverted(0)
        console.log("limitData",limitData);
        setisLoading(false);
        getCurrentRouteName() == 'Epay' && Singleton.showAlert(`Unable to process your request. Please enter amount between ${limitData[0]?.min_price == undefined
          ? 0
          : CommaSeprator3(limitData[0]?.min_price)} USD and ${limitData[0]?.max_price == undefined
            ? 0
            : CommaSeprator3(limitData[0]?.max_price)} USD.`)
      }
    }else{
      getRate(text);
    }
    }, 1500),
    [coinID],
  );
  const getRate = amount => {
    console.log('Amount===', amount);
    setisLoading(true);
    let data = {
      buyamount: amount,
      coin_id: coinID,
      currency: coinType?.toUpperCase(),
      fiat: "USD"
    };
    let access_token = Singleton.getInstance().access_token;
    dispatch(getBuyRAte({ data, access_token }))
      .then(res => {
        setIsfetching(false);
        console.warn('MM', 'res>>>getRate', res);
        if (res.data > 0) {
          console.warn(
            'MM',
            'res>>>getRate--currentSaitamaUserFinal',
            res.data,
          );
          setconverted(res?.data);
        } else {
          setconverted(0);
        }
        setisLoading(false);
      })
      .catch(err => {
        setconverted(0);
        console.log('err', err);
        setIsfetching(false);
        setisLoading(false);
        getCurrentRouteName() == 'Epay' && Singleton.showAlert(err?.message || err);
        console.warn('MM', 'getRate mercahantdata:::::::::', err);
      });
  };
  const getCryptoPriceApi = showloader => {
    if (showloader) {
      setisLoading(true);
    }
    Singleton.getInstance()
      .newGetData(Constants.coinFamilyKeys)
      .then(coinFamilyKey => {
        let coinFamilyKeys = coinFamilyKey?.split(',');
        dispatch(getCryptoPrice({ coinFamilyKeys }))
          .then(res => {
            console.warn('MM', '----->>>>temparr res', res);
            let temparr = [];
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              temparr.push(element.coin_symbol.toUpperCase());
              console.warn('MM', '----->>>>temparr', temparr, temparr.length);
            }
            setcryptList(temparr);
            setCoinImage(
              props.selectedItem
                ? props.selectedItem?.coin_image
                : res.data[0].coin_image,
            );
            setcoinType(
              props.selectedItem
                ? props.selectedItem?.coin_symbol.toUpperCase()
                : res.data[0]?.coin_symbol.toUpperCase(),
            );
            console.warn(
              'MM',
              '----->>>>cryptList',
              cryptList,
              cryptList.length,
            );
            setcryptPriceData(res.data);
            setcryptsettingData(res.settingData);
            setLimitData(res.limitData);
            console.warn('MM', '----->>>>coinType', coinType);
            console.warn(
              'MM',
              '----->>>>coinType res.limitData',
              res.limitData,
            );
            res.data.find(value => {
              if (coinType.toLowerCase() == value.coin_symbol.toLowerCase()) {
                let actualprice = parseFloat(value.usd_price);
                setActualcryptPrice(actualprice);
                console.warn('MM', '-----value.usd_price', value.usd_price);
                console.warn('MM', '-----actualprice', actualprice);
                return;
              }
            });
            setisLoading(false);
            if (refTextInput?.current) {
              refTextInput?.current?.focus();
            }
          })
          .catch(err => {
            setisLoading(false);
            console.warn('MM', 'err price:::::::::', err);
          });
      });
  };
  const checkpermission = () => {
    if (global.disconnected) {
      getCurrentRouteName() == 'Epay' && Singleton.showAlert(Constants.NO_NETWORK);
      return;
    }
    global.isCamera = true;

    if (coinType == '') {
      getCurrentRouteName() == 'Epay' && Singleton.showAlert(LanguageManager.selectcrypto);
      return;
    }
    if (isfetching) {
      getCurrentRouteName() == 'Epay' && Singleton.showAlert(LanguageManager.fetching_prices_please_wait);
      return;
    }

    if (fiatamount == '') {
      getCurrentRouteName() == 'Epay' && Singleton.showAlert(LanguageManager.pleaseEnterAmount);
      return;
    }

    if (converted == '' || converted == 0) {
      getCurrentRouteName() == 'Epay' && Singleton.showAlert(LanguageManager.invalidamount);
      return;
    }

    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: LanguageManager.cameraAppPermission,
              message: LanguageManager.needAccessToCamera,
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            checkpermissionStorage();
          } else {
            getCurrentRouteName() == 'Epay' && Singleton.showAlert(LanguageManager.cameraPermissionDenied);
          }
        } catch (err) {
          getCurrentRouteName() == 'Epay' && Singleton.showAlert(LanguageManager.cameraPermissionError, err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      getMerchantData();
    }
  };

  const checkpermissionStorage = () => {
    global.isCamera = true;
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        getMerchantData();
        return;
      }
      async function requestFilePermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Access Files Permission',
              message: 'File App Permission needed.',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getMerchantData();
          } else {
            getCurrentRouteName() == 'Epay' && Singleton.showAlert('File Permission Denied.');
          }
        } catch (err) {
          getCurrentRouteName() == 'Epay' && Singleton.showAlert('File Permission error.');
          console.warn(err);
        }
      }
      requestFilePermission();
    } else {
      getMerchantData();
    }
  };
  const getMerchantData = () => {
    global.isCamera = true;
    if (coinType == '') {
      getCurrentRouteName() == 'Epay' && Singleton.showAlert(LanguageManager.selectcrypto);
      return;
    }
    if (fiatamount == '') {
      getCurrentRouteName() == 'Epay' && Singleton.showAlert(LanguageManager.invalidamount);
      return;
    }
    setisLoading(true);
    let data = {
      merchant_id: 0,
      currency_type: 'usd',
      description: 'Purchasing',
      actual_amount: parseFloat(fiatamount),
      amount: parseFloat(fiatamount),
      wallet_address:
        coinType?.toLowerCase() == 'btc'
          ? Singleton.getInstance().defaultBtcAddress : coinType?.toLowerCase() == 'trx' ? Singleton.getInstance().defaultTrxAddress
            : Singleton.getInstance().defaultEthAddress,
      crypto_symbol: coinType.toLowerCase(),
      crypto_amount: parseFloat(converted),
      coinId: coinID,
    };
    let access_token = Singleton.getInstance().access_token;
    console.warn('MM', 'data========>>>> ', data, 'access_token', access_token);
    dispatch(epayMerchant({ data, access_token }))
      .then(res => {
        console.warn('MM', 'res>>>', res);
        if (res.status) {
          //merchantkey DESCRIPTION merchantid order_id customer_id amount currency_type
          // JSHash(
          //   `${Constants.EPAY_MERCHANTKEY}${res.data.description}${Constants.EPAY_MERCHANTID}${res.data.order_id}${res.data.customer_id}${res.data.amount}${res.data.currency_type}`,
          //   CONSTANTS.HashAlgorithms.sha256,
          // ).then(hash => {
          //   console.warn('MM', 'hashhh', hash);
          //   let link = `${epayUrl}?customerId=${res.data.customer_id}&orderID=${res.data.order_id}&orderDescription=${res.data.description}&orderAmount=${res.data.amount}`;
          //   console.log('link::::::::::epay', link);
          navigate(NavigationStrings.Linkview,{
            linkhash: res.data,
          });
          // });
        } else {
          getCurrentRouteName() == 'Epay' && Singleton.showAlert(res.message);
        }
        setisLoading(false);
      })
      .catch(err => {
        setisLoading(false);
        getCurrentRouteName() == 'Epay' && Singleton.showAlert(err);
        console.warn('MM', 'err mercahantdata:::::::::', err);
      });
  };
  const updateAmount = item => {
    if (Constants.EIGHT_DECIMAL_REGEX.test(item)) {
      if ((fiatamount + item)?.toString().length == 1 && item == 0) {
        return;
      }
      if (coinType == '') {
        getCurrentRouteName() == 'Epay' && Singleton.showAlert('Select crypto first');
        return;
      }
      if (
        fiatamount + item >
        (limitData[0]?.max_price == undefined ? 0 : limitData[0]?.max_price)
      ) {
        getCurrentRouteName() == 'Epay' && Singleton.showAlert('Entered Amount should be less than max amount.');
        return;
      } else {
        setIsfetching(true);
        setAmount(prev => {
          return prev + item;
        });
        const createdValue = fiatamount + item;
        console.log('createdValue==', createdValue);
        handler(createdValue);
      }
    }
  };
  const deleteAmount = () => {
    if (fiatamount.length == 0) {
      return;
    }
    setAmount(prev => prev.slice(0, prev.length - 1));
    const createdValue = fiatamount.slice(0, fiatamount.length - 1);
    handler(createdValue);
  };
  console.log('propsss=', props.item);
  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <SimpleHeader
        history={false}
        onPressHistory={() =>
          getCurrentRouteName() != 'BuyHistory' && navigate(NavigationStrings.BuyHistory)
        }
        titleStyle={{ textTransform: 'none' }}
        imageShow
        back={false}
        backPressed={() => {
          goBack();
        }}
        customIcon={ThemeManager.ImageIcons.history}
        backImage={ThemeManager.ImageIcons.iconBack}
        title={LanguageManager.buy + ' ' + coinType}
        coinType
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />
      {isOnMaintainance ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: widthDimen(22)
          }}>
          <Text
            style={{
              fontFamily: Fonts.medium,
              textAlign: 'center',
              fontSize: areaDimen(20),
              color: ThemeManager.colors.textColor,
            }}>
            {isOnMaintainanceMsg}
          </Text>
        </View>
      ) : (
        <>
          <View
            style={[
              styles.innerContainer,
              { backgroundColor: ThemeManager.colors.bg },
            ]}>
            <Text
              style={[styles.label, { color: ThemeManager.colors.textColor }]}>
              Enter Amount
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: heightDimen(50),
                borderRadius: heightDimen(25),
                borderWidth: 1,
                borderColor: ThemeManager.colors.viewBorderColor,
                paddingHorizontal: widthDimen(24),
              }}>
              <Text
                style={[
                  styles.priceInput,
                  { color: ThemeManager.colors.textColor },
                ]}>
                ${' '}
              </Text>
              <Text
                style={[
                  styles.priceInput,
                  { color: ThemeManager.colors.textColor },
                ]}>
                {fiatamount?.length > 0 ? CommaSeprator3(fiatamount) : '0.00'}
                {fiatamount?.length > 0 && '.00'}
              </Text>
            </View>
            <SelectDropdown
              ref={dropDownRef}
              // disabled={props.selectedItem != undefined ? true : cryptList?.length > 0 ? false : true}
              disabled={true}
              data={cryptList}
              buttonStyle={{
                fontFamily: Fonts.regular,
                justifyContent: 'flex-end',
                backgroundColor: ThemeManager.colors.swapBg,
                borderWidth: 0,
                alignSelf: 'stretch',
                width: '100%',
                paddingLeft: widthDimen(20),
                paddingRight: widthDimen(24),
                height: heightDimen(66),
                borderRadius: heightDimen(40),
                marginVertical: heightDimen(20),
              }}
              buttonTextStyle={{
                color: ThemeManager.colors.textColor,
                fontFamily: Fonts.medium,
                fontSize: areaDimen(16),
                textAlign: 'left',
              }}
              dropdownStyle={styles.dropDownStyle}
              rowTextStyle={[
                styles.rowTextStyle,
                { color: ThemeManager.colors.textColor },
              ]}
              rowStyle={{
                borderBottomWidth: 1,
                borderBottomColor: ThemeManager.colors.viewBorderColor,
                paddingLeft: 20,
                backgroundColor: ThemeManager.colors.bg,
              }}
              // defaultButtonText={coinType}
              defaultButtonText={
                converted ? converted + ' ' + coinType : coinType
              }
              renderDropdownIcon={() =>
                props.selectedItem == undefined ? (
                  <FastImage
                    source={Images.downIcon}
                    style={{
                      width: widthDimen(15),
                      height: heightDimen(8),
                      tintColor: ThemeManager.colors.lightTextColor,
                    }}
                    resizeMode="stretch"
                    tintColor={ThemeManager.colors.lightTextColor}
                  />
                ) : null
              }
              // onSelect={(selectedItem, index) => {
              //   console.log('selectedItem==', selectedItem);
              //   setcoinType(selectedItem);
              //   setAmount('');
              //   setconverted('');
              //   cryptPricedata.find(value => {
              //     if (
              //       selectedItem.toLowerCase() == value.coin_symbol.toLowerCase()
              //     ) {
              //       console.log('value.coin_image=', value.coin_image);
              //       setSelectFromDropDown(true);
              //       let actualprice = parseFloat(value.usd_price);
              //       setActualcryptPrice(actualprice);
              //       setcoinID(value.coin_id);
              //       setCoinImage(value.coin_image);
              //       return;
              //     }
              //   });
              // }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                // return selectedItem;
                return converted
                  ? converted + ' ' + selectedItem
                  : selectedItem;
                // return converted + ' ' + selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
              //BUTTON Style
              renderCustomizedButtonChild={(item, index) => {
                console.log('coinImage===', coinImage);
                return (
                  <TouchableOpacity
                    disabled={
                      props.selectedItem != undefined
                        ? true
                        : cryptList?.length > 0
                          ? false
                          : true
                    }
                    onPress={() => setShowList(true)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: heightDimen(14),
                    }}>
                    {selectFromDropDown ? (
                      coinImage ? (
                        <FastImage
                          source={{ uri: coinImage }}
                          style={{
                            borderRadius: widthDimen(20),
                            width: widthDimen(36),
                            height: widthDimen(36),
                            resizeMode: 'contain',
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      ) : (
                        <View
                          style={{
                            borderRadius: widthDimen(20),
                            width: widthDimen(36),
                            height: widthDimen(36),
                            backgroundColor: ThemeManager.colors.bg,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: Fonts.semibold,
                              fontSize: areaDimen(15),
                              lineHeight: heightDimen(18),
                            }}>
                            {coinType.charAt(0)}
                          </Text>
                        </View>
                      )
                    ) : (
                      <FastImage
                        source={
                          props.selectedItem == undefined
                            ? coinImage == ''
                              ? Images.ETH
                              : { uri: coinImage }
                            : { uri: coinImage }
                        }
                        style={{
                          borderRadius: widthDimen(20),
                          width: widthDimen(36),
                          height: widthDimen(36),
                          resizeMode: 'contain',
                        }}
                      />
                    )}
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
                        fontSize: areaDimen(14),
                        color: ThemeManager.colors.textColor,
                        paddingStart: widthDimen(12),
                      }}>
                      {converted ? converted + ' ' + coinType : coinType}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              scrollViewProps={{ bounces: false }}
              mainContainerStyle={{ flex: 1, overflow: 'hidden' }}
            />
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontFamily: Fonts.semibold,
                fontSize: areaDimen(12),
                marginTop: heightDimen(10),
              }}>
              {' '}
              {`MIN $${limitData[0]?.min_price == undefined
                  ? 0
                  : CommaSeprator3(limitData[0]?.min_price)
                } | MAX $${limitData[0]?.max_price == undefined
                  ? 0
                  : CommaSeprator3(limitData[0]?.max_price)
                }`}
            </Text>
          </View>

          <View
            style={[
              styles.bottomContainer,
              { backgroundColor: ThemeManager.colors.bg },
            ]}>
            <KeyboardDigit
              updatePin={item => updateAmount(item)}
              deletePin={() => deleteAmount()}
            />
            <Text
              style={[
                styles.noteStyle,
                { color: ThemeManager.colors.lightTextColor },
              ]}>
              Note: Amount of crypto received may vary due to volatile crypto
              market.{' '}
            </Text>

            <BasicButton
              disabled={converted ? false : true}
              onPress={() => checkpermission()}
              btnStyle={[styles.btnStyle, { alignSelf: 'center' }]}
              customGradient={styles.customGrad}
              text={LanguageManager.continue}
            />
          </View>
          {isLoading && <Loader />}
          <Toast
            ref={toastRef}
            style={{ backgroundColor: Colors.darkGrey }}
            textStyle={{ color: Colors.White }}
          />
        </>
      )}
      <Modal
        visible={showList}
        animationType="fade"
        transparent={true}
        statusBarTranslucent
        style={{ flex: 1, justifyContent: 'flex-end' }}>
        <ListModal
          list={cryptPricedata}
          isEpay={true}
          onClose={() => setShowList(false)}
          onPressItem={(selectedItem, index) => {
            // console.log('selectedItem==', selectedItem);
            setcoinType(selectedItem.coin_symbol.toUpperCase());
            setAmount('');
            setconverted('');
            cryptPricedata.find(value => {
              if (
                selectedItem.coin_symbol.toLowerCase() ==
                value.coin_symbol.toLowerCase()
              ) {
                // console.log('value.coin_image=', value.coin_image);
                setSelectFromDropDown(true);
                let actualprice = parseFloat(value.usd_price);
                setActualcryptPrice(actualprice);
                setcoinID(value.coin_id);
                setCoinImage(value.coin_image);
                return;
              }
            });
          }}
        />
      </Modal>
    </Wrap>
  );
};

export default Epay;

