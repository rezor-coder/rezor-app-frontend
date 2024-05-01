import React, {useState, useEffect, createRef, useCallback} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Linking,
  RefreshControl,
  BackHandler
} from 'react-native';
import {
  Wrap,
  BasicButton,
  MainStatusBar,
  ImageBackgroundComponent,
  SimpleHeader,
  BorderLine,
  PinInput,
  KeyboardDigit,
} from '../../common';
import images from '../../../theme/Images';
import {styles} from './SaitaCardBlackStyle';
import {Actions} from 'react-native-router-flux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {Fonts, Colors, Images} from '../../../theme';
import {
  getUserCardDetail,
  getCardsDetailApi,
  getUserCardAddress,
  fetchBankDetails,
  fetchCardHistory,
  getCardList,
} from '../../../Redux/Actions/SaitaCardAction';
import {useDispatch} from 'react-redux';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import Loader from '../Loader/Loader';
import LottieView from 'lottie-react-native';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import moment from 'moment';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-easy-toast';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import CardHistoryItem from '../../common/CardHistoryItem';
import { CommaSeprator3 } from '../../../utils';
function getUrl(card_name) {
  return card_name?.toLowerCase() == 'black'
    ? 'https://d18zkqei0yjvv8.cloudfront.net/SaitaCard_BLACK.pdf'
    : card_name?.toLowerCase() == 'diamond'
    ? 'https://d18zkqei0yjvv8.cloudfront.net/SaitaCard_DIAMOND.pdf'
    : 'https://d18zkqei0yjvv8.cloudfront.net/SaitaCard_GOLD.pdf';
}

const SaitaCardBlack = props => {
  const dispatch = useDispatch();
  const [feePending, setFeePending] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [kycPending, setKycPending] = useState(false);
  const [kycRejected, setKycRejected] = useState(false);
  const [isActiveBlack, setIsActiveBlack] = useState(false);
  const [cardApplied, setCardApplied] = useState(false);
  const [activeItem, setActiveItem] = useState({});
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [istoken, setIsToken] = useState(true);
  const [cardData, setCardData] = useState('');
  const [userDetail, setUserDetail] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [hideView, setHideView] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [myWalletAddress, setMyWalletAddress] = useState('');
  const [tokenList, setTokenList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [isLogin, setisLogin] = useState(false);
  const [cardnumber, setCardnumber] = useState('');
  const toast = createRef();
  const [feesModal, setFeesModal] = useState(false);
  const [tempData, setTempdata] = useState({});
  const [firstLoading, setFirstLoading] = useState({
    first: true,
    cardApplied: false,
    activeCard: false,
    visible: true,
  });
  const [myCardList, setCardList] = useState([]);
  const [selectedItem, setItem] = useState({});
  const [selectedIndex, setIndex] = useState(0);
  const [showSetting, setshowSetting] = useState(false);
  const [PinModal, setPinModal] = useState(false);
  const [Pin, setPin] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const routerDecimals = Constants.ismainnet ? 6 : 6;
  const spaceSeparator = val => {
    return (
      val?.substring(0, 4) +
      ' ' +
      val?.substring(4, 8) +
      ' ' +
      val?.substring(8, 12) +
      ' ' +
      val?.substring(12, 16)
    );
  };
  useEffect(() => {
    // let backHandle=BackHandler.addEventListener('hardwareBackPress',()=>{
    //   Singleton.getInstance().currentCard = 'black';
    //   Singleton.getInstance()
    //     .newGetData(Constants.access_token_cards)
    //     .then(access_token => {
    //       access_token
    //         ? Actions.currentScene != 'Dashboard' &&
    //           Actions.replace('Dashboard')
    //         : props.navigation.goBack();
    //     });
    //   return true
    // })
    getDataCard();
    let onFocus = props.navigation.addListener('didFocus', () => {
      Singleton.getInstance()
        .newGetData(Constants.access_token_cards)
        .then(access_token => {
          console.warn('MM', '>>>>access_token..', access_token);
          if (access_token) {
            setshowSetting(true);
            setisLogin(true);
          } else {
            setshowSetting(false);
            setisLogin(false);
          }
        });
    });
    let onBlur = props.navigation.addListener('didBlur', () => {
      setFeesModal(false);
    });

    return () => {
      // backHandle?.remove()
      onFocus?.remove();
      onBlur?.remove();
    };
  }, []);

  const getDataCard = () => {
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        console.warn('MM', '>>>>access_token', access_token);
        if (access_token) {
          setFirstLoading({...firstLoading, first: false, cardApplied: true});
          setisLoading(true);
          getUserDetail(access_token)
            .then(async res => {
              let selected_item;
              selected_item = await getCardListing(res.cards[0].name);
              setshowSetting(true);
              setisLogin(true);

              const selectedData = res.cards.find(
                el => el.card_table_id == selected_item.card_table_id,
              );
              if (!selectedData) {
                setDisableButton(true);
              } else {
                setDisableButton(false);
              }
              getCardDetail(access_token, false, res, selected_item);
            })
            .catch(err => {
              setshowSetting(false);
              setisLogin(false);
              console.warn('MM', 'error ', err);
              getCardListing('')
                .then(res => {
                  setisLoading(false);
                  setFirstLoading({...firstLoading, visible: false});
                })
                .catch(err => {
                  setFirstLoading({...firstLoading, visible: false});
                  console.log(err);
                  Singleton.showAlert(
                    err?.message || Constants.SOMETHING_WRONG,
                  );
                  setisLoading(false);
                });
            });
        } else {
          setshowSetting(false);
          setisLoading(true);
          getCardListing('')
            .then(res => {
              setisLoading(false);
              setFirstLoading({...firstLoading, visible: false});
            })
            .catch(err => {
              setFirstLoading({...firstLoading, visible: false});
              console.log(err);
              setisLoading(false);
            });
        }
      });
  };

  const getCardListing = cardNme => {
    return new Promise((resolve, reject) => {
      dispatch(getCardList({}))
        .then(res => {
          console.warn('MM', 'getCardList res', res);
          setCardList(res);
          if (cardNme == '') {
            if (Singleton.getInstance().currentCard.toLowerCase() == 'black') {
              setItem(res[0]);
              return resolve(res[0]);
            } else if (
              Singleton.getInstance().currentCard.toLowerCase() == 'diamond'
            ) {
              setItem(res[1]);
              return resolve(res[1]);
            }
            if (Singleton.getInstance().currentCard.toLowerCase() == 'gold') {
              setItem(res[2]);
              return resolve(res[2]);
            } else {
              setItem(res[0]);
              return resolve(res[0]);
            }
          } else {
            console.warn('MM', '>>>>>>> 4444', cardNme);
            if (cardNme.toLowerCase() == 'black') {
              setItem(res[0]);
              return resolve(res[0]);
            } else if (cardNme.toLowerCase() == 'diamond') {
              setItem(res[1]);
              // setUpdateCheck(true);
              return resolve(res[1]);
            }
            if (cardNme.toLowerCase() == 'gold') {
              console.warn('MM', '>>>>>>> 5555', cardNme);
              setItem(res[2]);
              return resolve(res[2]);
            } else {
              setItem(res[0]);
              return resolve(res[0]);
            }
          }
        })
        .catch(err => {
          setisLoading(false);
          reject(err);
        });
    });
  };

  const getUserDetail = access_token => {
    return new Promise((resolve, reject) => {
      setHideView(true);
      dispatch(getUserCardDetail({access_token}))
        .then(res => {
          setUserDetail(res);
          resolve(res);
        })
        .catch(err => {
          setisLoading(false);
          reject(err);
        });
    });
  };

  const getCardDetail = (
    access_token,
    btnPressed = false,
    details = false,
    selected_item = selectedItem,
  ) => {
    setisLoading(true);
    let data = {
      card_table_id: selected_item.card_table_id,
    };
    dispatch(getCardsDetailApi({data, access_token}))
      .then(res => {
        setisLoading(false);
        console.warn('MM', btnPressed, 'Card Detail Res:::::::::', res);
        if (res.data) {
          const data = res.data;
          if (btnPressed) {
            setFirstLoading({...firstLoading, visible: false});
            setisLoading(false);
            if (data.fee_status == 'complete') {
              if (data.kyc_status == 0) {
                // setApplyModal(true);
                return;
              } else if (data.kyc_status == 1) {
                // setKycPending(true);
                return;
              } else if (data.kyc_status == 3) {
                // setKycRejected(true);
                return;
              } else if (data.kyc_status == 2 && data.card_applied == null) {
                !isActiveBlack &&
                  Actions.currentScene != 'SaitaCardApplyForm' &&
                  Actions.SaitaCardApplyForm({
                    cardType: selected_item?.card_table_id,
                    selectedItem: data,
                  });
                return;
              } else if (data.kyc_status == 2 && data.card_applied == 0) {
                return Singleton.showAlert(
                  'Your Saitacard ' +
                    (selected_item?.name ? selected_item?.name : 'Black') +
                    ' is applied successfully and is under Approval.We will inform you the Approval via an email.',
                );
              }
            } else {
              if (data.fee_status == 'pending') {
                Singleton.showAlert(
                  'Your transaction is in pending state, Please wait',
                );
              } else {
                let item = myCardList?.find(item => item.name == res.data.name);
                setActiveItem(item);
                setFeePending(true);

                setisLoading(true);
                Singleton.getInstance()
                  .cardfees(selected_item?.name?.toLowerCase())
                  .then(res => {
                    let fee = res / 10 ** routerDecimals;
                    setisLoading(false);
                    setTempdata({
                      fee: fee,
                      data: data,
                    });
                    setFeesModal(true);
                  })
                  .catch(err => {
                    setisLoading(false);
                    Singleton.showAlert(err);
                  });
              }
            }
          } else {
            if (data.card_applied && data.card_id != null) {
              setisLoading(true);
              setFirstLoading({
                ...firstLoading,
                first: false,
                cardApplied: true,
                activeCard: true,
              });
              createWalletAddress(details || data);
            } else if (data.card_applied == 1 && data.card_id == null) {
              setFirstLoading({...firstLoading, visible: false});
              setCardApplied(true);
              setisLoading(false);
            } else {
              setFirstLoading({...firstLoading, visible: false});
              setisLoading(false);
              if (data.fee_status == 'complete') {
                if (data.kyc_status == 0) {
                  // setApplyModal(true);
                  return;
                } else if (data.kyc_status == 1) {
                  // setKycPending(true);
                  return;
                } else if (data.kyc_status == 3) {
                  // setKycRejected(true);
                  return;
                } else if (data.kyc_status == 2 && data.card_applied == null) {
                  !isActiveBlack &&
                    Actions.currentScene != 'SaitaCardApplyForm' &&
                    Actions.SaitaCardApplyForm({
                      cardType: selected_item?.card_table_id,
                      selectedItem: data,
                    });
                  return;
                } else if (data.kyc_status == 2 && data.card_applied == 0) {
                  return Singleton.showAlert(
                    'Your Saitacard ' +
                      (selected_item?.name ? selected_item?.name : 'Black') +
                      ' is applied successfully and is under Approval.We will inform you the Approval via an email.',
                  );
                }
              } else {
                if (data.fee_status == 'pending') {
                  Singleton.showAlert(
                    'Your transaction is in pending state, Please wait',
                  );
                } else {
                  let item = myCardList?.find(
                    item => item.name == res.data.name,
                  );
                  setActiveItem(item);
                  setFeePending(true);
                  setisLoading(true);
                  Singleton.getInstance()
                    .cardfees(selected_item?.name?.toLowerCase())
                    .then(res => {
                      let fee = res / 10 ** routerDecimals;
                      setisLoading(false);
                      setTempdata({
                        fee: fee,
                        data: data,
                      });
                      setFeesModal(true);
                    })
                    .catch(err => {
                      setisLoading(false);
                      Singleton.showAlert(
                        err?.message || Constants.SOMETHING_WRONG,
                      );
                    });
                }
              }
            }
          }
          setCardData(res.data);

          if (data.card_id != null) {
            // setFirstLoading({...firstLoading, visible: false});
            getCardHistory(access_token, data.card_id);
          }
        } else {
          setFirstLoading({...firstLoading, visible: false});
        }
      })
      .catch(err => {
        setFirstLoading({...firstLoading, visible: false});
        Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG);
        console.warn('MM', 'Card Detail err:::::::::', err);
        setisLoading(false);
      });
  };
  const getCardHistory = (access_token, card_id) => {
    console.warn('MM', 'getCardHistory');
    let data = {
      card_id: card_id,
      end_time: moment().format('MMYYYY'),
      start_time: moment().subtract(5, 'months').format('MMYYYY'),
    };
    dispatch(fetchCardHistory({data, access_token}))
      .then(res => {
        setisLoading(false);
        console.warn('MM', 'chk res getCardHistory::::::', res);
        setHistoryList(res);
      })
      .catch(err => {
        setisLoading(false);
        console.warn('MM', 'chk err getCardHistory::::::', err);
      });
  };
  const createWalletAddress = req => {
    console.log('createWalletAddress req', req);
    let data = {
      full_name: req.full_name,
      email: req.email,
      mobile_no: req.mobile_no,
      card_name: req.cards[0]?.name,
      card_status: req.cards[0]?.card_status,
      card_id: req.cards[0]?.card_id,
    };
    dispatch(getUserCardAddress({data}))
      .then(res => {
        setFirstLoading({...firstLoading, visible: false});
        setIsActiveBlack(true);
        console.warn('MM', 'chk res getUserCardAddress::::::', res);
        Singleton.getInstance().newSaveData(
          Constants.black_access_token,
          res.access_token,
        );
        setMyWalletAddress(res.wallet[0]?.address);
        setisLoading(false);
        fetchTokenList(res.access_token);
      })
      .catch(err => {
        setFirstLoading({...firstLoading, visible: false});
        setisLoading(false);
        console.warn('MM', 'chk err getUserCardAddress::::::', err);
      });
  };

  const onProceed = text => {
    Singleton.getInstance()
      .newGetData(Constants.PIN)
      .then(pin => {
        if (text == pin) {
          hidePressed();
          setPinModal(false);
        } else {
          Singleton.showAlert(LanguageManager.wrongPin);
          setPin('');
        }
      });
    return;
  };

  const fetchTokenList = access_token => {
    setisLoading(false);
  };
  const onPressGetCard = () => {
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        if (access_token) {
          getCardDetail(access_token, true);
          return;
        } else {
          setisLoading(true);
          Singleton.getInstance()
            .cardfees(selectedItem?.name?.toLowerCase())
            .then(res => {
              let fee = res / 10 ** routerDecimals;
              setisLoading(false);
              setTempdata({
                fee: fee,
                data: cardData ? cardData : selectedItem,
              });
              setFeesModal(true);
            })
            .catch(err => {
              console.warn('MM', err?.toString());
              setisLoading(false);
              if (err && err?.toString().includes('CONNECTION')) {
                Singleton.showAlert(Constants.NO_NETWORK);
              } else {
                Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG);
              }
            });
        }
      });
  };
  const updatePin = item => {
    if (item == ' ' || Pin.length == 6) {
      return;
    }
    if (Pin.length != 6) {
      setPin(prev => {
        return prev + item;
      });

      if (Pin.length == 5) {
        console.log('PINNNNN===', Pin + item);
        let pin = Pin + item;
        onProceed(pin);
      }
    }
  };
  const deletePin = () => {
    if (Pin.length == 0) {
      return;
    }
    setPin(prev => prev.slice(0, prev.length - 1));
  };
  console.log('myCardList::::', myCardList);
  const _renderItemhistory = item => {
    return (
      <CardHistoryItem
        item={item}
        list={historyList}
        onPress={() =>
          Actions.currentScene != 'CardHistoryDetail' &&
          Actions.CardHistoryDetail({
            selectedItem: item,
            card_currency:
              userDetail?.cards?.length > 0
                ? userDetail?.cards[0]?.card_currency?.toUpperCase()
                : 'USD',
          })
        }
        currency={
          userDetail?.cards?.length > 0
            ? userDetail?.cards[0]?.card_currency?.toUpperCase()
            : 'USD'
        }
      />
    );
  };
  const inActiveCard = () => {
    return (
      <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
        <View
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                getDataCard();
                setTimeout(() => {
                  setIsRefreshing(false);
                }, 2000);
              }}
            />
          }>
          <MainStatusBar
            backgroundColor={ThemeManager.colors.bg}
            barStyle={
              ThemeManager.colors.themeColor === 'light'
                ? 'dark-content'
                : 'light-content'
            }
          />
          {!feePending && (
            <View
              style={{
                height: heightDimen(44),
                width: widthDimen(380),
                borderRadius: 100,
                backgroundColor: ThemeManager.colors.backgroundColor,
                alignSelf: 'center',
                borderWidth: 0.8,
                borderColor: ThemeManager.colors.viewBorderColor,
                flexDirection: 'row',
                marginTop: heightDimen(15),
              }}>
              {myCardList?.map((item, index) => {
                return (
                  <BasicButton
                    onPress={() => {
                      setActiveTabIndex(index);
                      setActiveItem(myCardList[index]);
                      setItem(item);
                    }}
                    customColor={
                      activeTabIndex == index
                        ? [Colors.buttonColor1, Colors.buttonColor2]
                        : [
                            ThemeManager.colors.backgroundColor,
                            ThemeManager.colors.backgroundColor,
                          ]
                    }
                    customGradient={{
                      width: widthDimen(380 / 3),
                      height: heightDimen(44),
                    }}
                    text={item.name}
                    textStyle={
                      activeTabIndex == index
                        ? {
                            fontSize: areaDimen(16),
                            fontFamily: Fonts.semibold,
                            lineHeight: heightDimen(19),
                          }
                        : {
                            fontSize: areaDimen(14),
                            fontFamily: Fonts.medium,
                            lineHeight: heightDimen(18),
                          }
                    }
                  />
                );
              })}
            </View>
          )}
          {!feePending && (
            <Text
              style={[
                styles.txtdescribe,
                {
                  color: ThemeManager.colors.inActiveColor,
                  marginTop: heightDimen(20),
                },
              ]}>
              Choose the desired category
            </Text>
          )}
          <View style={{flex: 1, paddingHorizontal: 25}}>
            <ImageBackground
              style={[styles.imgcards, {width: widthDimen(214)}]}
              source={{
                uri:
                  activeItem?.new_card_image ||
                  'https://d2l91m18wre6ml.cloudfront.net/stage-saitacard/BlackCard.png',
              }}
              resizeMode="stretch">
              <View
                style={{
                  backgroundColor: 'rgba(57, 57, 57, 0.7)',
                  borderRadius: areaDimen(17),
                  height: heightDimen(100),
                  width: widthDimen(180),
                  justifyContent: 'center',
                  padding: areaDimen(10),
                  marginBottom: heightDimen(200),
                }}>
                <Text style={styles.txtone}>Application Fee:</Text>
                <Text style={styles.txttwo}>
                  USD {activeItem?.old_fee || '249'}
                </Text>

                <Text style={styles.txtthree}>
                  Only USD {activeItem?.new_fee || '199'}*
                </Text>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => Linking.openURL(getUrl(activeItem?.name))}>
              <FastImage
                source={Images.downloadCardFeature}
                style={{
                  marginBottom: heightDimen(6),
                  alignSelf: 'center',
                  height: areaDimen(32),
                  width: areaDimen(32),
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text
              style={{
                marginBottom: heightDimen(60),
                fontSize: areaDimen(14),
                fontFamily: Fonts.semibold,
                lineHeight: heightDimen(26),
                color: ThemeManager.colors.inActiveColor,
              }}>
              Download Card Features
            </Text>
            {disableButton ? (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.disableBtnStyle}
                disabled>
                <Text style={{...styles.textStylee, textAlign: 'center'}}>
                  {activeItem?.name?.toLowerCase() == 'black'
                    ? LanguageManager.blackCard
                    : activeItem?.name?.toLowerCase() == 'diamond'
                    ? LanguageManager.diamondCard
                    : LanguageManager.goldCard}
                </Text>
              </TouchableOpacity>
            ) : (
              <BasicButton
                onPress={() => {
                  onPressGetCard();
                }}
                btnStyle={styles.btnStyle}
                text={
                  selectedIndex == 0
                    ? LanguageManager.saitaCard
                    : activeItem?.name?.toLowerCase() == 'black'
                    ? LanguageManager.blackCard
                    : activeItem?.name?.toLowerCase() == 'diamond'
                    ? LanguageManager.diamondCard
                    : LanguageManager.goldCard
                }
                textStyle={{fontSize: 16, fontFamily: Fonts.semibold}}
              />
            )}
          </View>
        </View>
      </Wrap>
    );
  };

  const AppliedCard = () => {
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
        <View style={{flex: 1, marginTop: 45}}>
          <ImageBackground
            resizeMode="contain"
            style={styles.imgcards}
            source={{
              uri: selectedItem
                ? selectedItem.new_card_image
                : 'https://d2l91m18wre6ml.cloudfront.net/stage-saitacard/BlackCard.png',
            }}>
            <View
              style={{
                backgroundColor: 'rgba(57, 57, 57, 0.7)',
                borderRadius: 17,
                height: 100,
                width: 180,
                justifyContent: 'center',
                padding: 10,
                marginBottom: heightDimen(180),
              }}>
              <Text style={styles.InaCtiveText}>Inactive</Text>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: heightDimen(50),
          }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(getUrl(myCardList[activeTabIndex]?.name))
            }>
            <FastImage
              source={Images.downloadCardFeature}
              style={{
                marginBottom: heightDimen(6),
                alignSelf: 'center',
                height: areaDimen(32),
                width: areaDimen(32),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              marginBottom: heightDimen(60),
              fontSize: areaDimen(14),
              fontFamily: Fonts.semibold,
              lineHeight: heightDimen(26),
              color: ThemeManager.colors.inActiveColor,
            }}>
            Download Card Features
          </Text>
        </View>
      </Wrap>
    );
  };

  const hidePressed = async () => {
    setShowDetail(false);
    setTimeout(() => {
      setHideView(!hideView);
      if (hideView == true) {
        setisLoading(true);
        let data = {
          card_id: cardData.card_id,
        };
        Singleton.getInstance()
          .newGetData(Constants.access_token_cards)
          .then(access_token => {
            dispatch(fetchBankDetails({data, access_token}))
              .then(res => {
                console.warn('MM', 'chk fetchBankDetails res:::::', res);
                cardData.cvv = res.cvv;

                var date = res.expire.substring(0, 3);
                var year = res.expire.substring(5, 7);
                // console.log("date==",date+year)
                cardData.expire = date+year;
                // cardData.expire = res.expire;
                cardData.card_numberr = res.card_number;
                setCardnumber(res.card_number);
                setisLoading(false);
                setShowDetail(true);
              })
              .catch(err => {
                setisLoading(false);
                console.warn('MM', 'chk fetchBankDetails err:::::', err);
                setHideView(true);
                setShowDetail(false);
                Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG);
              });
          });
      }
    }, 100);
  };
  const activeCard = () => {
    return (
      <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                getDataCard();
                setTimeout(() => {
                  setIsRefreshing(false);
                }, 2000);
              }}
            />
          }>
          <View
            style={{
              marginHorizontal: widthDimen(22),
              marginTop: heightDimen(20),
            }}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0.8, y: 1}}
              colors={['#9ABFFF', '#4C80FF', '#6F6CFF', '#4C80FF']}
              style={{
                borderRadius: areaDimen(25),
                alignItems: 'center',
                // height: heightDimen(200),
                paddingBottom: heightDimen(20),
              }}>
              <Text
                style={[
                  styles.txtonecard,
                  {color: Colors.white},
                ]}>
                Card Balance
              </Text>
              <Text
                style={[
                  styles.txttwocard,
                  {color: Colors.white},
                ]}>
                ${" "}
                {cardData?.available_balance
                  ? CommaSeprator3(
                      parseFloat(cardData?.available_balance),
                      2,
                    )
                  : cardData?.available_balance}
              </Text>
              <Text
                style={[
                  styles.txtonecard,
                  {
                    color: Colors.white,
                    marginTop: heightDimen(10),
                    textAlign: 'center',
                    paddingHorizontal: widthDimen(20),
                  },
                ]}>
                {'Card Address: ' + myWalletAddress}
              </Text>
              <TouchableOpacity
                style={styles.depositButton}
                onPress={() => {
                  Actions.currentScene != 'SaitaCardDepositQr' &&
                    Actions.SaitaCardDepositQr({
                      myAddress: myWalletAddress,
                      tokenListItem: tokenList,
                      fees: selectedItem?.card_fee,
                    });
                }}>
                <FastImage
                  source={Images.depositCard}
                  style={{height: areaDimen(17.2), width: areaDimen(17.2)}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    marginLeft: widthDimen(7),
                    fontFamily: Fonts.semibold,
                    fontSize: areaDimen(16),
                    lineHeight: heightDimen(19),
                    color: ThemeManager.colors.primary,
                  }}>
                  Deposit
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <ImageBackground
            style={[
              styles.imgcards,
              {
                marginTop: heightDimen(30),
                height: heightDimen(284),
                width: widthDimen(204),
              },
            ]}
            source={{uri: cardData.card_image}}
            resizeMode={'stretch'}>
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0005',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: widthDimen(6),
              }}>
              <View style={styles.activeCardName}>
                <Text style={styles.txtCardone}>{userDetail.full_name}</Text>
                <Text style={[styles.txtCardred,{color:Colors.white}]}>( Active )</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}>
                  <Text style={[styles.txtstar]}>
                    {hideView
                      ? spaceSeparator(cardData.card_number)
                      : showDetail
                      ? cardData.card_numberr
                        ? spaceSeparator(cardData.card_numberr)
                        : spaceSeparator(cardData.card_number)
                      : spaceSeparator(cardData.card_number)}
                  </Text>

                  {
                    <TouchableOpacity
                      onPress={() => {
                        if (!hideView) {
                          Clipboard.setString(
                            // bankDetail[selectCard(selectedIndex)]?.card_number,
                            cardData.card_numberr
                          );
                          Singleton.showAlert(Constants.COPIED);
                        }
                      }}
                      style={{paddingLeft: 8}}>
                      {!hideView ? (
                        <Image
                          style={[styles.imgCopyInside, {tintColor: 'white'}]}
                          source={images.IconCopyInside}
                        />
                      ) : (
                        <View style={[styles.imgCopyInside]} />
                      )}
                    </TouchableOpacity>
                  }
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flexDirection: 'column'}}>
                    <Text style={[styles.txtcvv, {}]}>CVV</Text>
                    <Text style={[styles.txtdate, {}]}>
                      {hideView
                        ? 'XXX'
                        : showDetail
                        ? cardData.cvv
                          ? cardData.cvv
                          : 'XXX'
                        : 'XXX'}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'column', marginLeft: 30}}>
                    <Text style={[styles.txtcvv, {}]}>Expiry Date</Text>

                    <Text style={[styles.txtdate, {}]}>
                      {hideView
                        ? 'MM/YY'
                        : showDetail
                        ? cardData?.expire
                          ? cardData?.expire
                          : 'MM/YY'
                        : 'MM/YY'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (hideView) {
                  setPin('');
                  setPinModal(true);
                } else {
                  setHideView(true);
                  setShowDetail(false);
                }
              }}
              style={styles.eyeStyle}>
              {!hideView ? (
                <Image
                  style={{height: widthDimen(18), width: widthDimen(18), margin: 5, tintColor:'white'}}
                  resizeMode="contain"
                  source={images.open_eye}
                />
              ) : (
                <Image
                  source={images.eye_card}
                  style={{height: widthDimen(18), width: widthDimen(18), margin: 5, tintColor:'white'}}
                />
              )}
            </TouchableOpacity>
          </ImageBackground>

          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: widthDimen(21),
                marginTop: heightDimen(30.5),
              }}>
              <View>
                <View>
                  <Text
                    style={[
                      styles.tokenlistActive,
                      {
                        color: ThemeManager.colors.textColor,
                      },
                    ]}>
                    History
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Actions.currentScene != 'SaitaCardHistory' &&
                    Actions.SaitaCardHistory({
                      cardId: cardData.card_id,
                      card_currency:
                        userDetail?.cards?.length > 0
                          ? userDetail?.cards[0]?.card_currency?.toUpperCase()
                          : 'USD',
                    });
                }}>
                <Text
                  style={[
                    styles.txtviewall,
                    {color: ThemeManager.colors.inActiveColor},
                  ]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View
            style={{
              borderColor: ThemeManager.colors.chooseBorder,
              borderWidth: 0.5,
            }}
          /> */}
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.coinListWrapStyle}
            data={historyList.slice(0, 2)}
            renderItem={item => _renderItemhistory(item)}
            ListEmptyComponent={
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.regular,
                    color: ThemeManager.colors.textColor,
                  }}>
                  No Data Found
                </Text>
              </View>
            }
          />
          <Toast ref={toast} />
        </ScrollView>
      </Wrap>
    );
  };

  return (
    <>
      <SimpleHeader
        title={
          isLogin && selectedItem?.name
            ? selectedItem?.name?.toUpperCase() + ' CARD'
            : 'CARDS'
        }
        img3style={{tintColor:ThemeManager.colors.iconColor}}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle={{marginRight: 30}}
        imageShow
        back={false}
        backPressed={() => {
          Singleton.getInstance().currentCard = 'black';
          Singleton.getInstance()
            .newGetData(Constants.access_token_cards)
            .then(access_token => {
              if(props?.from=='Main'){
                Actions.currentScene != 'Main' && Actions.reset("Main")
              }else{
                Actions.currentScene != 'Dashboard' && Actions.replace('Dashboard');
              }
            });
        }}
        history={showSetting && !firstLoading.visible}
        onPressHistory={() =>
          Actions.currentScene != 'CardSetting' && Actions.CardSetting()
        }
        customIcon={ThemeManager.ImageIcons.setting}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      {/* <View
        style={{
          marginTop: 6,
          backgroundColor: ThemeManager.colors.swapBorder,
          width: '100%',
          height: 1,
        }}
      /> */}
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        {/* {cardApplied
          ? AppliedCard()
          : isActiveBlack
          ? activeCard()
          : inActiveCard()} */}
        {isActiveBlack ? (
          activeCard()
        ) : (
          <>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <FastImage
                source={Images.contactSaitaSupport}
                style={{height: heightDimen(120), width: widthDimen(120)}}
                resizeMode="contain"
                tintColor={ThemeManager.colors.headingText}
              />
              <TouchableOpacity
                onPress={() => {
                  Actions.currentScene != 'GetSupport' && Actions.GetSupport();
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    color: ThemeManager.colors.textColor,
                    fontSize: areaDimen(20),
                    marginTop: heightDimen(20),
                  }}>
                  Contact SaitaSupport
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {firstLoading.visible && (
          <View
            style={{
              position: 'absolute',
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor: ThemeManager.colors.bg,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
            <SkeletonPlaceholder borderRadius={4}>
              {
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  height={90}
                  paddingHorizontal={25}>
                  <SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item height={15} width={80} />
                    <SkeletonPlaceholder.Item
                      height={30}
                      width={60}
                      marginTop={15}
                      marginBottom={5}
                    />
                  </SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item
                    width={100}
                    height={40}
                    borderRadius={12}
                    marginTop={5}
                  />
                </SkeletonPlaceholder.Item>
              }

              <SkeletonPlaceholder.Item marginTop={10}>
                <SkeletonPlaceholder.Item
                  width={windowWidth * 0.8}
                  height={windowWidth * 1.2}
                  alignSelf="center"
                  borderRadius={30}
                />
              </SkeletonPlaceholder.Item>

              <SkeletonPlaceholder.Item
                height={170}
                marginTop={15}
                alignItems="center"
                justifyContent="center"
                paddingHorizontal={10}>
                <SkeletonPlaceholder.Item
                  width={'100%'}
                  borderRadius={10}
                  height={50}
                  alignSelf="center"
                />
                <SkeletonPlaceholder.Item
                  width={'70%'}
                  marginTop={15}
                  height={20}
                  alignSelf="center"
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
        )}
      </View>

      {isLoading && !firstLoading.visible && <Loader />}
      {/* *********************************************************** MODAL FOR Apply ********************************************************************** */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={applyModal}
        onRequestClose={() => {
          setApplyModal(false);
          // setIsBindingPending(false);
        }}>
        <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
          <View style={{height: windowHeight}}>
            <SimpleHeader
              back={false}
              backPressed={() => {
                setApplyModal(false);
                // setIsBindingPending(false);
              }}
            />
            <View
              style={{
                marginTop: 30,
                height: '50%',
                width: '90%',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <ImageBackground
                resizeMode="contain"
                style={styles.imgcards}
                source={{uri: selectedItem.new_card_image}}>
                <View
                  style={{
                    backgroundColor: 'rgba(57, 57, 57, 0.7)',
                    borderRadius: 17,
                    height:
                      selectedItem?.card_type == 'physical' ? '20%' : '30%',
                    width: '50%',
                    justifyContent: 'center',
                    padding: 10,
                    marginBottom: heightDimen(150),
                  }}>
                  <Text style={styles.txtone}>Application Fee:</Text>
                  <Text style={styles.txttwo}>
                    USD {selectedItem?.old_fee || '249'}
                  </Text>
                  <Text style={styles.txtthree}>
                    Only USD {selectedItem?.new_fee || '199'}*
                  </Text>
                </View>
              </ImageBackground>
            </View>

            <Text
              style={[
                styles.txtWelcome,
                {
                  color: ThemeManager.colors.textColor,
                  marginTop: heightDimen(10),
                },
              ]}>
              Thank you for applying for{'\n'}SaitaCard{' '}
              <Text
                style={[
                  styles.txtWelcome,
                  {
                    color: ThemeManager.colors.textColor,
                    marginTop: 15,
                    textTransform: 'capitalize',
                  },
                ]}>
                {cardData?.name}
              </Text>
            </Text>
            <Text style={[styles.txtkyc]}>
              Now you need to complete your identification{'\n'}process (KYC) to
              start using SaitaCard
            </Text>

            <View style={{alignItems: 'center', height: '30%'}}>
              <BasicButton
                onPress={() => {
                  setApplyModal(false);
                  Actions.currentScene != 'KycShufti' &&
                    Actions.KycShufti({email: userDetail?.email});
                }}
                btnStyle={styles.btnStylekyc}
                customGradient={styles.customGrad}
                text={'Start KYC Process'}
                textStyle={{fontSize: 16, fontFamily: Fonts.medium}}
              />
            </View>
          </View>
        </Wrap>
      </Modal> */}
      {/* *********************************************************** KYC in Review ********************************************************************** */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={kycPending}
        onRequestClose={() => setKycPending(false)}>
        <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
          <ImageBackgroundComponent style={{height: windowHeight}}>
            <View
              style={{
                marginTop: 30,
                height: '35%',
                width: '90%',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <LottieView
                source={images.kycReview}
                style={styles.centerLottie}
                autoPlay
                loop
              />
            </View>
            <View style={{height: '20%', marginTop: 45}}>
              <Text
                style={[
                  styles.txtWelcome,
                  {color: ThemeManager.colors.textColor, marginTop: 15},
                ]}>
                Thank you!{'\n'}Your SaitaCard{' '}
                <Text
                  style={[
                    styles.txtWelcome,
                    {
                      color: ThemeManager.colors.textColor,
                      marginTop: 15,
                      textTransform: 'capitalize',
                    },
                  ]}>
                  {cardData.name}
                </Text>
                {'\n'}application is in review
              </Text>
              <Text style={[styles.txtkyc]}>
                We will get back to you as quickly as possible. It usually takes
                2 - 4 working days. You can check the status of your application
                at any time by coming back to this page
              </Text>
            </View>

            <View
              style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '25%',
                marginBottom: 40,
              }}>
              <BasicButton
                onPress={() => {
                  setKycPending(false);
                }}
                btnStyle={styles.btnStylekyc}
                customGradient={styles.customGrad}
                text={'Ok'}
                textStyle={{fontSize: 16, fontFamily: Fonts.medium}}
              />
            </View>
          </ImageBackgroundComponent>
        </Wrap>
        {isLoading && <Loader />}
      </Modal> */}
      {/* *********************************************************** KYC Rejected ********************************************************************** */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={kycRejected}
        onRequestClose={() => setKycRejected(false)}>
        <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
          <View style={{height: windowHeight}}>
            <SimpleHeader
              back={false}
              backPressed={() => setKycRejected(false)}
            />
            <View
              style={{
                marginTop: 30,
                height: '35%',
                width: '90%',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <LottieView
                source={images.kycRejected}
                style={{...styles.centerLottie}}
                autoPlay
                loop
              />
            </View>
            <View style={{height: '20%', marginTop: 45}}>
              <Text
                style={[
                  styles.txtWelcome,
                  {color: ThemeManager.colors.textColor, marginTop: 15},
                ]}>
                Oops...{'\n'}Your Identification was{'\n'}Declined
              </Text>
              <Text style={[styles.txtkyc]}>
                The information you submitted did not pass KYC identification.
                Please retry Identification or contact support.
              </Text>
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  height: '25%',
                  marginBottom: 40,
                }}>
                <BasicButton
                  onPress={() => {
                    setKycRejected(false);
                    Actions.currentScene != 'KycShufti' &&
                      Actions.KycShufti({email: userDetail?.email});
                  }}
                  btnStyle={styles.btnStylekyc}
                  customGradient={styles.customGrad}
                  text={'Retry KYC Process'}
                  textStyle={{fontSize: 16, fontFamily: Fonts.medium}}
                />
              </View>
            </View>
          </View>
        </Wrap>
        {isLoading && <Loader />}
      </Modal> */}
      {/* <Modal
        visible={feesModal}
        animationType="fade"
        onRequestClose={() => {
          setFeesModal(false);
        }}
        transparent>
        <View
          style={{
            backgroundColor: '#0002',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: ThemeManager.colors.backgroundColor,
              padding: 20,
              borderRadius: 20,
              alignItems: 'center',
              marginHorizontal: 25,
            }}>
            <Image
              source={Images.alertIcon}
              style={{
                width: Dimensions.get('window').width / 2,
                height: 70,
                marginVertical: 10,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 20,
                color: ThemeManager.colors.textColor,
                textAlign: 'center',
              }}>
              Voila
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 15,
                color: ThemeManager.colors.lightTextColor,
                textAlign: 'center',
                marginTop: 12,
              }}>
              You can now buy your SaitaCard using Visa / Mastercard / USDT
              (ERC-20)
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: heightDimen(20),
              }}>
              <BasicButton
                onPress={() => {
                  setFeesModal(false);
                }}
                btnStyle={[styles.btnStylekyc, {width: '48%'}]}
                customGradient={{
                  borderWidth: 1,
                  borderRadius: 100,
                  borderColor: ThemeManager.colors.inActiveColor,
                }}
                customColor={['transparent', 'transparent']}
                text={'Cancel'}
                textStyle={{
                  fontSize: areaDimen(16),
                  fontFamily: Fonts.semibold,
                  color: ThemeManager.colors.inActiveColor,
                }}
              />
              <View style={{flex: 1}} />
              <BasicButton
                onPress={() => {
                  if (global.disconnected) {
                    Singleton.showAlert(Constants.NO_NETWORK);
                    return;
                  }
                  !isActiveBlack &&
                    Actions.currentScene != 'SaitaCardApplyForm' &&
                    Actions.SaitaCardApplyForm({
                      cardType: selectedItem?.card_table_id,
                      selectedItem: tempData?.data,
                    });
                  setFeesModal(false);
                }}
                btnStyle={[
                  styles.btnStylekyc,
                  {width: '48%', alignSelf: 'flex-end'},
                ]}
                customGradient={[
                  styles.customGrad,
                  {marginTop: heightDimen(0)},
                ]}
                text={'Ok'}
                textStyle={{
                  fontSize: areaDimen(16),
                  fontFamily: Fonts.semibold,
                }}
              />
            </View>
          </View>
        </View>
      </Modal> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={PinModal}
        onRequestClose={() => setPinModal(false)}>
        <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
          <SimpleHeader
            back={false}
            backPressed={() => setPinModal(false)}
            title={''}
          />
          <View style={{paddingHorizontal: widthDimen(22)}}>
            <Text
              style={{
                fontFamily: Fonts.semibold,
                alignSelf: 'flex-start',
                fontSize: areaDimen(30),
                lineHeight: areaDimen(37),
                marginTop: heightDimen(30),
                color: ThemeManager.colors.headingText,
              }}>
              Confirm Pin
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: areaDimen(14),
                textAlign: 'left',
                lineHeight: heightDimen(28),
                color: ThemeManager.colors.inActiveColor
              }}>
              {LanguageManager.enterSixDigitPin}
            </Text>
            <View style={{}}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: heightDimen(30),
                  flexDirection: 'row',
                }}>
                {[0, 1, 2, 3, 4, 5].map((item, index) => {
                  return (
                    <PinInput
                      key={item}
                      isActive={
                        Pin.length == 0
                          ? index == 0
                            ? true
                            : false
                          : Pin.length == index + 1
                      }
                      digit={Pin.length > index ? '*' : ''}
                    />
                  );
                })}
              </View>
            </View>
          </View>

          <View
            style={[
              {
                justifyContent: 'flex-end',
                flex: 1,
                marginTop: heightDimen(102),
              },
            ]}>
            <KeyboardDigit
              updatePin={item => updatePin(item)}
              deletePin={() => deletePin()}
            />
          </View>
        </Wrap>
      </Modal>
    </>
  );
};
export default SaitaCardBlack;
