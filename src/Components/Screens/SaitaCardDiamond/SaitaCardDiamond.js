import Clipboard from '@react-native-community/clipboard';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { createRef, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-easy-toast';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import {
  fetchBankDetails,
  fetchCardHistory,
  getCardTokenList,
  getCardsDetailApi,
  getUserCardAddress,
  getUserCardDetail,
} from '../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import { Colors, Fonts, Images } from '../../../theme';
import images from '../../../theme/Images';
import {
  BasicButton,
  ImageBackgroundComponent,
  MainStatusBar,
  SimpleHeader,
  Wrap,
} from '../../common';
import Loader from '../Loader/Loader';
import { styles } from './SaitaCardDiamondStyle';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
let ratioHeight = (362 / 228) * 228;

const SaitaCardDiamond = props => {
  const dispatch = useDispatch();
  const [applyModal, setApplyModal] = useState(false);
  const [kycPending, setKycPending] = useState(false);
  const [kycRejected, setKycRejected] = useState(false);
  const [isActiveBlack, setIsActiveBlack] = useState(false);
  const [cardApplied, setCardApplied] = useState(false);
  const [isfirst, setisFirst] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [istoken, setIsToken] = useState(true);
  const [cardData, setCardData] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [userDetail, setUserDetail] = useState([]);
  const [hideView, setHideView] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [myWalletAddress, setMyWalletAddress] = useState('');
  const [tokenList, setTokenList] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  const [cardnumber, setCardnumber] = useState('');
  const [isLogin, setisLogin] = useState(false);

  const [feesModal, setFeesModal] = useState(false)
  const [tempData, setTempdata] = useState({})


  const toast = createRef();
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
    getDataCard();
  }, []);
  const getDataCard = () => {
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        // console.warn('MM','>>>>access_token', access_token);
        if (access_token) {
          setisLogin(true);
          getUserDetail(access_token)
            .then(res => {
              getCardDetail(access_token, false, res);
            })
            .catch(err => {
       //  console.warn('MM','errrrr'.err);
              getCardDetail(access_token);
            });
        }
      });
  };

  const getUserDetail = access_token => {
    return new Promise((resolve, reject) => {
      setHideView(true);
      dispatch(getUserCardDetail({ access_token }))
        .then(res => {
          // console.warn('MM','getUserCardDetail diamond:::::::', res);
          setUserDetail(res);
          const selectedData = res.cards.find(
            el => el.card_table_id == props.item.card_table_id,
          );
          // console.warn('MM','selectedData diamond:::::::', selectedData);
          // if (res.kyc_status == 2) {
          //     return setDisableButton(false);
          // } else
          if (!selectedData) {
            // && (res.kyc_status == 0 || res.kyc_status == 1 || res.kyc_status == 3)
            setDisableButton(true);
          } else {
            setDisableButton(false);
          }
          resolve(res);
        })
        .catch(err => {
          setisLoading(false);
          //   Singleton.showAlert(err)
          reject(err);
        });
    });
  };
  const getCardDetail = (access_token, btnPressed = false, details = false) => {
    setisLoading(true);
    let data = {
      card_table_id: props.item?.card_table_id,
    };
    dispatch(getCardsDetailApi({ data, access_token }))
      .then(res => {
        setisLoading(false);
        // console.warn('MM','Card Detail Res:::::::::diamond', res);
        if (res.data) {
          const data = res.data;
          // console.warn('MM','Card Detail Res:::::::::', data.card_applied);
          if (btnPressed) {
            if (data.fee_status == 'complete') {
              if (data.kyc_status == 0) {
                setApplyModal(true);
                return;
              } else if (data.kyc_status == 1) {
                setKycPending(true);
                return;
              } else if (data.kyc_status == 3) {
                setKycRejected(true);
                return;
              } else if (data.kyc_status == 2 && data.card_applied == null) {
                !isActiveBlack &&
                  getCurrentRouteName() != 'SaitaCardApplyForm' &&
                  navigate(NavigationStrings.SaitaCardApplyForm,{ cardType: 2, selectedItem: data });
                return;
              } else if (data.kyc_status == 2 && data.card_applied == 0) {
                return Singleton.showAlert(
                  'Your Saitacard Diamond is applied successfully and is under Approval.We will inform you the Approval via an email.',
                );
              }
            } else {
              if (data.fee_status == 'pending') {
                Singleton.showAlert(
                  'Your transaction is in pending state, Please wait',
                );
              } else {
                setisLoading(true);
                Singleton.getInstance()
                  .cardfees('diamond')
                  .then(res => {
                    // //console.log(
                    //   '+++++++++++cardFees fee',
                    //   res,
                    //   res / 10 ** routerDecimals,
                    // );
                    let fee = res / 10 ** routerDecimals;
                    setisLoading(false);
                    setTempdata({
                      fee:fee,
                      data:data
                    })
                    setFeesModal(true)
                    // Alert.alert(
                    //   Constants.APP_NAME,
                    //   `Please make sure there is ${fee} USDT in your Rezor wallet to apply for the Card`,
                    //   [
                    //     {
                    //       text: 'Ok',
                    //       onPress: () => {
                    //         !isActiveBlack &&
                    //           getCurrentRouteName() != 'SaitaCardApplyForm' &&
                    //           Actions.SaitaCardApplyForm({
                    //             cardType: 2,
                    //             selectedItem: data,
                    //           });
                    //       },
                    //     },
                    //   ],
                    //   { cancelable: false },
                    // );
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
              createWalletAddress(details || data);
              setIsActiveBlack(true);
            } else if (data.card_applied == 1 && data.card_id == null) {
              setCardApplied(true);
            }
          }
          setCardData(data);
          if (data.card_id != null) {
            getCardHistory(access_token, data.card_id);
          }
        }
      })
      .catch(err => {
 //  console.warn('MM','Card Detail err:::::::::', err);
        setisLoading(false);
      });
  };

  const getCardHistory = (access_token, card_id) => {
 //  console.warn('MM','getCardHistory');
    let data = {
      card_id: card_id,
      end_time: moment().format('MMYYYY'),
      start_time: moment().subtract(5, 'months').format('MMYYYY'),
    };
    dispatch(fetchCardHistory({ data, access_token }))
      .then(res => {
        // console.warn('MM','chk res getCardHistory::::::', res);
        setHistoryList(res);
      })
      .catch(err => {
        setisLoading(false);
 //  console.warn('MM','chk err getCardHistory::::::', err);
      });
  };
  const createWalletAddress = req => {
    let data = {
      full_name: req.full_name,
      email: req.email,
      mobile_no: req.mobile_no,
      card_name: req.cards[0].name,
      card_status: req.cards[0].card_status,
      card_id: req.cards[0].card_id,
    };
    dispatch(getUserCardAddress({ data }))
      .then(res => {
        // console.warn('MM','chk res getUserCardAddress::::::', res);
        Singleton.getInstance().newSaveData(
          Constants.diamond_access_token,
          res.access_token,
        );
        setMyWalletAddress(res.wallet[0]?.address);
        fetchTokenList(res.access_token);
      })
      .catch(err => {
        setisLoading(false);
 //  console.warn('MM','chk err getUserCardAddress::::::', err);
      });
  };
  const fetchTokenList = access_token => {
    dispatch(getCardTokenList({ access_token }))
      .then(res => {
        //  console.warn('MM','chk res fetchTokenList::::::', res);
        setTokenList(res);
        setisLoading(false);
      })
      .catch(err => {
        setisLoading(false);
 //  console.warn('MM','chk err fetchTokenList:::::', err);
      });
  };
  const maskAddress = address => {
    const a = address.slice(0, 9);
    const b = address.slice(-9);
    return a + '....' + b;
  };
  const onPressGetCard = () => {
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        // console.warn('MM','>>>>access_token', access_token);
        if (access_token) {
          getCardDetail(access_token, true);
          return;
        } else {
          setisLoading(true);
          Singleton.getInstance()
            .cardfees('diamond')
            .then(res => {
              // //console.log(
              //   '+++++++++++cardFees fee',
              //   res,
              //   res / 10 ** routerDecimals,
              // );
              let fee = res / 10 ** routerDecimals;
              setisLoading(false);
              setTempdata({
                fee:fee,
                data:cardData ? cardData : props.item
              })
              setFeesModal(true)
              // Alert.alert(
              //   Constants.APP_NAME,
              //   `Please make sure there is ${fee} USDT in your Rezor wallet to apply for the Card`,
              //   [
              //     {
              //       text: 'Ok',
              //       onPress: () => {
              //         !isActiveBlack &&
              //           getCurrentRouteName() != 'SaitaCardApplyForm' &&
              //           Actions.SaitaCardApplyForm({
              //             cardType: 2,
              //             selectedItem: cardData ? cardData : props.item,
              //           });
              //       },
              //     },
              //   ],
              //   { cancelable: false },
              // );
            })
            .catch(err => {
              setisLoading(false);
              Singleton.showAlert(err);
            });
        }
      });
  };
  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.coinsListStyle,
          backgroundColor: ThemeManager.colors.defiBgColor,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '44%',
            justifyContent: 'center',
          }}>
          {item.coin_image ? (
            <Image source={{ uri: item.coin_image }} style={styles.coinStyle} />
          ) : (
            <View style={styles.coinNameStyle}>
              <Text style={{ color: 'white' }}>{item.coin_name.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.ViewStyle}>
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontFamily: Fonts.semibold,
                textAlign: 'center',
                fontSize: 13,
                textTransform: 'capitalize',
              }}>
              {item.coin_name.toString().length > 13
                ? item.coin_name.substring(0, 13) + '...'
                : item.coin_name}
            </Text>
            <Text style={styles.fiatText}>{' '}({item.coin_symbol})</Text>
          </View>
        </View>
        <View style={styles.graphStyle}></View>
        <View style={styles.ViewStyle1}>
          <Text
            style={{
              color: Colors.lightGrey2,
              fontFamily: Fonts.semibold,
              textAlign: 'center',
              fontSize: 13,
              textTransform: 'capitalize',
            }}>
            {item.coin_family == 1 ? 'Ethereum' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  // const _renderItemhistory = (item, index) => {

  //     return (
  //         <TouchableOpacity

  //             style={styles.coinsListStyle}>
  //             <View style={{ flexDirection: 'row', width: '44%' }}>
  //                 {item.item.coin_image ? (
  //                     <Image
  //                         source={item.item.coin_image}
  //                         style={styles.coinStyle}
  //                     />
  //                 ) : (
  //                     <View style={styles.coinNameStyle}>
  //                         <Text style={{ color: 'white' }}>
  //                             {item.item.coin_name.charAt(0)}
  //                         </Text>
  //                     </View>
  //                 )}
  //                 <View style={{ marginLeft: 10 }}>
  //                     <Text
  //                         style={{
  //                             color: ThemeManager.colors.textColor,
  //                             fontFamily: Fonts.semibold,
  //                             fontSize: 13,
  //                         }}>
  //                         {item.item.coin_symbol.toString().length > 13
  //                             ? item.item.coin_symbol.substring(0, 13) + '...'
  //                             : item.item.coin_symbol}
  //                     </Text>
  //                     <View style={{ flexDirection: 'row' }}>
  //                         <Text style={styles.fiatText}>
  //                             {item.item.coin_name}
  //                         </Text>
  //                     </View>
  //                 </View>
  //             </View>
  //             <View style={styles.graphStyle}>

  //             </View>
  //             <View style={styles.balanceViewStylehistory}>
  //                 <Text
  //                     style={[styles.balanceTexthistory, { color: ThemeManager.colors.textColor, },]}>
  //                     0.1 ETH/$234.00
  //                 </Text>
  //                 <Text
  //                     style={[styles.coinPriceStylehistory, { color: Colors.lightGrey2 }]}>
  //                     To | xc1245cddd256..
  //                 </Text>
  //             </View>
  //         </TouchableOpacity>
  //     )
  // }
  const _renderItemhistory = (item, index) => {
    let date = new Date((item?.item?.transaction_date - 12600 )* 1000)
    return (
      <TouchableOpacity
        onPress={() =>
          getCurrentRouteName() != 'CardHistoryDetail' &&
          navigate(NavigationStrings.CardHistoryDetail,{ selectedItem: item , card_currency:userDetail?.cards?.length > 0 ? userDetail?.cards[0]?.card_currency?.toUpperCase() : 'USD'})
        }
        style={styles.coinsListStyle}>
        <View style={{ flexDirection: 'row', width: '44%' , alignItems:'center'}}>
          <Image source={images.deposit} style={styles.coinStyle} />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontFamily: Fonts.semibold,
                fontSize: 13,
              }}>
              {Singleton.getInstance().gettxStatus(item.item.type)}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.fiatText}>
              {item?.item?.status == 2 ? 'Transaction Failed' :  item?.item?.status == 1 ? 'Transaction Completed' : 'Transaction Pending'}
                {/* {getDate(item.item.transaction_date)} */}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.graphStyle}></View>
        <View style={styles.balanceViewStylehistory}>
          <Text
            style={[
              styles.balanceTexthistory,
              { color: ThemeManager.colors.textColor },
            ]}>
            {Singleton.getInstance().toFixed(item.item?.debit > 0 ? item?.item?.debit : item?.item?.credit, 2)} {userDetail?.cards?.length > 0 ? userDetail?.cards[0]?.card_currency?.toUpperCase() : 'USD'}
          </Text>
          <Text
            style={[styles.coinPriceStylehistory, { color: Colors.lightGrey2 }]}>
            {date.getMonth() + 1 + '/' +date.getDate() + '/' +date.getFullYear() }
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const getDate = date => {
    //16 02 2020
    const data =
      date.substring(0, 2) +
      '-' +
      date.substring(2, 4) +
      '-' +
      date.substring(4, 8);
    return data;
  };
  const inActiveCard = () => {
    return (
      <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
        <ScrollView>
        <MainStatusBar
          backgroundColor={ThemeManager.colors.backgroundColor}
          barStyle={
            ThemeManager.colors.themeColor === 'light'
              ? 'dark-content'
              : 'light-content'
          }
        />
        {!isLogin && (
          <Text
            style={[
              styles.txtdescribe,
              { color: ThemeManager.colors.textColor },
            ]}>
            Choose the desired category
          </Text>
        )}
        <View style={{ flex: 1, marginTop: 20 , paddingHorizontal:25}}>
        <View
              style={{
                 height: windowWidth * 1.2,
                width: windowWidth * 0.8,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
          <ImageBackground
            // resizeMode="contain"
            style={styles.imgcards}
            source={{ uri: props?.item?.card_image }}>
            <View
              style={{
                backgroundColor: 'rgba(57, 57, 57, 0.7)',
                borderRadius: 17,
                height: 100,
                width: 180,
                justifyContent: 'center',
                padding: 10,
              }}>
              <Text style={styles.txtone}>Application Fee:</Text>
              <Text style={styles.txttwo}>USD {props?.item?.old_fee || '249'}</Text>
              {/* <View style={{ borderBottomWidth: 1, marginTop: -10, width: 60, borderColor: "#8F939E", }}></View> */}
              <Text style={styles.txtthree}>Only USD {props?.item?.new_fee || '199'}*</Text>
            </View>
          </ImageBackground>

        </View>
        </View>

        <View
          style={{ height: 170, alignItems: 'center', justifyContent: 'center' }}>
          {disableButton ? (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.disableBtnStyle}>
              <Text style={{ ...styles.textStylee, textAlign: 'center' }}>
                {LanguageManager.diamondCard}
              </Text>
            </TouchableOpacity>
          ) : (
            <BasicButton
              onPress={() => {
                onPressGetCard();
              }}
              btnStyle={styles.btnStyle}
              customGradient={styles.customGrad}
              text={LanguageManager.diamondCard}
              textStyle={{ fontSize: 16, fontFamily: Fonts.semibold }}
            />
          )}
          <TouchableOpacity
          onPress={()=>{
            Linking.openURL('https://d18zkqei0yjvv8.cloudfront.net/SaitaCard_DIAMOND.pdf')
          }}
          >

          <Text style={[styles.login, { color: ThemeManager.colors.textColor }]}>
            Card Features
          </Text>
          </TouchableOpacity>
        </View>

        {/* <View style={{ height: 170, alignItems: 'center', justifyContent: 'center', }} >
                    <BasicButton
                        onPress={() => { onPressGetCard() }}
                        btnStyle={styles.btnStyle}
                        customGradient={styles.customGrad}
                        text={LanguageManager.diamondCard}
                        textStyle={{ fontSize: 16, fontFamily: Fonts.semibold }}
                    />
                    <Text style={[styles.login, { color: ThemeManager.colors.textColor }]}>Card Features</Text>
                </View> */}
        {isLoading && (
          <Loader
            customheight={{ height: Dimensions.get('window').height - 160 }}
          />
        )}
        </ScrollView>
      </Wrap>
    );
  };

  const hidePressed = async () => {
 //  console.warn('MM','chk isHide:::::', hideView);
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
            dispatch(fetchBankDetails({ data, access_token }))
              .then(res => {
                // console.warn('MM','chk fetchBankDetails res:::::', res);
                const expire = `${res.expire?.slice(0, 2)}/${res.expire?.slice(
                  4,
                  6,
                )}`;
                //  console.warn('MM','chk expire:::::', expire);
                cardData.cvv = res.cvv;
                cardData.expire = res.expire;
                cardData.card_numberr = res.card_number;
                setCardnumber(res.card_number);
                setisLoading(false);
                setShowDetail(true);
              })
              .catch(err => {
                setisLoading(false);
         //  console.warn('MM','chk fetchBankDetails err:::::', err);
                setHideView(true);
                setShowDetail(false);
              });
          });
      }
    }, 100);
  };
  const activeCard = () => {
    return (
      <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <View style={{ marginHorizontal: 30, marginTop: 10 }}>
            <View
              style={{
                backgroundColor: ThemeManager.colors.btcBack,
                borderRadius: 17,
                alignItems: 'center',
                padding: 20,
              }}>
              <Text
                style={[
                  styles.txtonecard,
                  { color: ThemeManager.colors.myEarn },
                ]}>
                Card Balance
              </Text>
              <Text
                style={[
                  styles.txttwocard,
                  { color: ThemeManager.colors.textColor },
                ]}>
                ${cardData?.available_balance ? Singleton.getInstance().toFixed(parseFloat(cardData?.available_balance) , 2) : cardData?.available_balance}
              </Text>
              {myWalletAddress ? (
                <View style={{ flexDirection: 'row', marginTop: -10 }}>
                  <Text
                    style={[
                      styles.txtthree,
                      { color: ThemeManager.colors.textColor, marginTop: 10 },
                    ]}>
                    Card Address:{' '}
                  </Text>
                  <Text style={styles.txtthreecard}>
                    {maskAddress(myWalletAddress)}
                  </Text>
                </View>
              ) : null}
              <BasicButton
                onPress={() => {
                  getCurrentRouteName() != 'SaitaCardDepositQr' &&
                  navigate(NavigationStrings.SaitaCardDepositQr,{
                      myAddress: myWalletAddress,
                      tokenListItem: tokenList,
                      fees:props?.item?.card_fee
                    });
                }}
                btnStyle={styles.btnStylecard}
                customGradient={styles.customGradCard}
                text={'Deposit'}
                textStyle={{
                  fontSize: 10,
                  fontFamily: Fonts.regular,
                  textAlign: 'center',
                  flex: 1,
                }}
              />
            </View>
            {/* <View style={{ zIndex: 1 }}>
                            <TouchableOpacity onPress={() => hidePressed()} style={hideView ? styles.eyeStyle : styles.eyeStyleNew}>
                                {hideView ?
                                    <Image source={images.eye_card} />
                                    :
                                    <Image style={{ height: 15, width: 15, resizeMode: 'contain' }} source={images.open_eye} />
                                }
                            </TouchableOpacity>
                        </View> */}
            <View style={{ zIndex: 1 }}>
              <TouchableOpacity
                onPress={() =>
                  hideView
                    ? getCurrentRouteName() != 'ConfirmPin' &&
                    navigate(NavigationStrings.ConfirmPin,{
                      redirectTo: 'saitaPin',
                      goBack: true,
                      getVerified: data => {
                        hidePressed();
                      },
                    })
                    : getDataCard()
                }
                style={styles.eyeStyle}>
                {hideView ? (
                  <Image
                    style={{ height: 15, width: 15, resizeMode: 'contain' }}
                    source={images.open_eye}
                  />
                ) : (
                  <Image source={images.eye_card} />
                )}
              </TouchableOpacity>
            </View>

            <View
              style={{
                 height: windowWidth * 1.2,
                width: windowWidth * 0.8,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <ImageBackground
                style={styles.imgcards}
                source={{uri: cardData.card_image}}>
                    <View style={{
                    width:'100%',
                    height:'100%',
                    backgroundColor:'#0005',
                    alignItems:'center',
                    justifyContent:'center'
                  }}>
                <View style={styles.activeCardName}>
                  <Text style={styles.txtCardone}>{userDetail.full_name}</Text>
                  {/* <Text style={styles.txtCardone}>{cardData.name}</Text> */}
                  <Text style={styles.txtCardred}>( Active )</Text>
                  {/* <Text style={styles.txtstar}>{cardData.card_number}</Text> */}
                  {/* <Text style={styles.txtstar}>{hideView ? cardData.card_number : showDetail ? cardData.card_numberr ? cardData.card_numberr : cardData.card_number : cardData.card_number}</Text> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical:10
                    }}>
                    <Text style={styles.txtstar}>
                      {hideView
                        ? spaceSeparator(cardData.card_number)
                        : showDetail
                        ? cardData.card_numberr
                          ? spaceSeparator(cardData.card_numberr)
                          : spaceSeparator(cardData.card_number)
                        : spaceSeparator(cardData.card_number)}
                    </Text>

                    {!hideView && (
                      <TouchableOpacity
                        onPress={() => {
                          // console.warn('MM','---------', cardnumber);
                          Clipboard.setString(cardnumber);
                          toast.current.show(Constants.COPIED);
                        }}>
                        <Image
                          style={[styles.imgCopyInside , {tintColor:'white'}]}
                          source={images.IconCopyInside}
                        />
                      </TouchableOpacity>
                    )}
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
                          ? 'MM/YYYY'
                          : showDetail
                          ? cardData?.expire
                            ? cardData.expire
                            : 'MM/YYYY'
                          : 'MM/YYYY'}
                      </Text>
                      {/* <Text style={[styles.txtdate, {}]}>{cardData?.expire ? (cardData?.expire.slice(0, 2) / cardData?.expire?.slice(4, 6)) : 'MM/YYYY'}</Text> */}
                    </View>
                  </View>
                </View>
                </View>
              </ImageBackground>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginVertical: 10,
              }}>
              {/* <TouchableOpacity>
                                <Text style={[styles.txtlist, { color: ThemeManager.colors.textColor }]}>List</Text>
                            </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  istoken
                    ? getCurrentRouteName() != 'SaitaCardDeposit' &&
                    navigate(NavigationStrings.SaitaCardDeposit)
                    : getCurrentRouteName() != 'SaitaCardHistory' &&
                    navigate(NavigationStrings.SaitaCardHistory,{ cardId: cardData.card_id ,  card_currency:userDetail?.cards?.length > 0 ? userDetail?.cards[0]?.card_currency?.toUpperCase() : 'USD'});
                }}>
                <Text style={styles.txtviewall}>
                  {istoken ? '' : 'View all'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              borderColor: ThemeManager.colors.chooseBorder,
              borderWidth: 0.5,
            }}></View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', marginHorizontal: 30 }}>
              <TouchableOpacity
                onPress={() => {
                  setIsToken(true);
                }}>
                {istoken ? (
                  <View>
                    <Text
                      style={[
                        styles.tokenlistActive,
                        { color: ThemeManager.colors.textColor, marginTop: 5 },
                      ]}>
                      Token List
                    </Text>
                    <View
                      style={{
                        borderColor: Colors.buttonColor5,
                        borderWidth: 1,
                        marginTop: 5,
                      }}></View>
                  </View>
                ) : (
                  <Text style={[styles.tokenlistInActive, { marginTop: 5 }]}>
                    Token List
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'column', marginLeft: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setIsToken(false);
                }}>
                {!istoken ? (
                  <View>
                    <Text
                      style={[
                        styles.tokenlistActive,
                        { color: ThemeManager.colors.textColor, marginTop: 5 },
                      ]}>
                      History
                    </Text>
                    <View
                      style={{
                        borderColor: Colors.buttonColor5,
                        borderWidth: 1,
                        marginTop: 5,
                      }}></View>
                  </View>
                ) : (
                  <Text style={[styles.tokenlistInActive, { marginTop: 5 }]}>
                    History
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              borderColor: ThemeManager.colors.chooseBorder,
              borderWidth: 0.5,
            }}></View>
          {istoken ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.coinListWrapStyle}
              data={tokenList}
              renderItem={item => _renderItem(item)}
            />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.coinListWrapStyle}
              data={historyList.slice(0, 2)}
              renderItem={item => _renderItemhistory(item)}
            />
          )}
          <Toast ref={toast} />
        </ScrollView>
        {isLoading && (
          <Loader
            customheight={{ height: Dimensions.get('window').height - 160 }}
          />
        )}
      </Wrap>
    );
  };
  const AppliedCard = () => {
    return (
      <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
        <MainStatusBar
          backgroundColor={ThemeManager.colors.backgroundColor}
          barStyle={
            ThemeManager.colors.themeColor === 'light'
              ? 'dark-content'
              : 'light-content'
          }
        />
        <View style={{ flex: 1, marginTop: 45 }}>
          <ImageBackground
            resizeMode="contain"
            style={styles.imgcards}
            source={{ uri: props.item.card_image }}>
            <View
              style={{
                backgroundColor: 'rgba(57, 57, 57, 0.7)',
                borderRadius: 17,
                height: 100,
                width: 180,
                justifyContent: 'center',
                padding: 10,
              }}>
              {/* <Text style={styles.cardName}>{cardData.name}</Text> */}
              <Text style={styles.InaCtiveText}>Inactive</Text>
            </View>
          </ImageBackground>
        </View>

        <TouchableOpacity
         onPress={()=>{
          Linking.openURL('https://d18zkqei0yjvv8.cloudfront.net/SaitaCard_DIAMOND.pdf')
        }}
          style={{ height: 170, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.login, { color: ThemeManager.colors.textColor }]}>
            Card Features
          </Text>
        </TouchableOpacity>
        {isLoading && (
          <Loader
            customheight={{ height: Dimensions.get('window').height - 160 }}
          />
        )}
      </Wrap>
    );
  };

  // console.warn('MM','>>>>selectedItem selectedItem', props.selectedItem);
  return (
    <>
      {cardApplied
        ? AppliedCard()
        : isActiveBlack
          ? activeCard()
          : inActiveCard()}
      {/* *********************************************************** MODAL FOR Apply ********************************************************************** */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={applyModal}
        onRequestClose={() => setApplyModal(false)}>
        <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
          <ImageBackgroundComponent style={{ height: windowHeight }}>
            <SimpleHeader
              back={false}
              backPressed={() => setApplyModal(false)}
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
                source={{ uri: props.item?.card_image }}>
                <View
                  style={{
                    backgroundColor: 'rgba(57, 57, 57, 0.7)',
                    borderRadius: 17,
                    height: '30%',
                    width: '50%',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  <Text style={styles.txtone}>Application Fee:</Text>
                  <Text style={styles.txttwo}>USD {props?.item?.old_fee || '249'}</Text>
                  {/* <View style={{ borderBottomWidth: 1, marginTop: -10, width: 60, borderColor: "#8F939E", }}></View> */}
                  <Text style={styles.txtthree}>Only USD {props?.item?.new_fee || '199'}*</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={{ height: '20%' }}>
              <Text
                style={[
                  styles.txtWelcome,
                  { color: ThemeManager.colors.textColor, marginTop: 15 },
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
                  {cardData.name}
                </Text>
              </Text>
              <Text style={[styles.txtkyc]}>
                Now you need to complete your{'\n'}identification process (KYC)
                to start{'\n'}using SaitaCard
              </Text>
            </View>

            <View style={{ alignItems: 'center', height: '30%' }}>
              <BasicButton
                onPress={() => {
                  setApplyModal(false);
                  getCurrentRouteName() != 'KycShufti' &&
                  navigate(NavigationStrings.KycShufti,{ email: userDetail?.email });
                }}
                btnStyle={styles.btnStylekyc}
                customGradient={styles.customGrad}
                text={'Start KYC Process'}
                textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
              />
            </View>
          </ImageBackgroundComponent>
        </Wrap>
        {isLoading && <Loader />}
      </Modal>
      {/* *********************************************************** KYC in Review ********************************************************************** */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={kycPending}
        onRequestClose={() => setKycPending(false)}>
        <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
          <ImageBackgroundComponent style={{ height: windowHeight }}>
            <SimpleHeader
              back={false}
              backPressed={() => setKycPending(false)}
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
                source={images.kycReview}
                style={styles.centerLottie}
                autoPlay
                loop
              />
            </View>
            <View style={{ height: '20%', marginTop: 45 }}>
              <Text
                style={[
                  styles.txtWelcome,
                  { color: ThemeManager.colors.textColor, marginTop: 15 },
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
                textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
              />
            </View>
          </ImageBackgroundComponent>
        </Wrap>
        {isLoading && <Loader />}
      </Modal>
      {/* *********************************************************** KYC Rejected ********************************************************************** */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={kycRejected}
        onRequestClose={() => setKycRejected(false)}>
        <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
          <ImageBackgroundComponent style={{ height: windowHeight }}>
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
                style={{ ...styles.centerLottie }}
                autoPlay
                loop
              />
            </View>
            <View style={{ height: '20%', marginTop: 45 }}>
              <Text
                style={[
                  styles.txtWelcome,
                  { color: ThemeManager.colors.textColor, marginTop: 15 },
                ]}>
                Oops...{'\n'}Your Identification was{'\n'}Declined
              </Text>
              <Text style={[styles.txtkyc]}>
                The information you submitted did not pass KYC identification.
                Please retry Identification or contact support.
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
                  setKycRejected(false);
                  getCurrentRouteName() != 'KycShufti' &&
                  navigate(NavigationStrings.KycShufti,{ email: userDetail?.email });
                }}
                btnStyle={styles.btnStylekyc}
                customGradient={styles.customGrad}
                text={'Retry KYC Process'}
                textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
              />
            </View>
          </ImageBackgroundComponent>
        </Wrap>
        {isLoading && <Loader />}
      </Modal>
      <Modal
      visible={feesModal}
      animationType='fade'
      onRequestClose={()=>{
        setFeesModal(false)
        
      }}
      transparent>
        <View style={{
          backgroundColor:'#0002',
          flex:1,
          alignItems:'center',
          justifyContent:'center'
        }}>
          <View style={{
            backgroundColor:ThemeManager.colors.backgroundColor,
            padding:20 , 
            borderRadius:20,
            alignItems:'center',
            marginHorizontal:25
          }}>
           <Image source={Images.alertIcon}
            style={{
              width:Dimensions.get('window').width/2,
              height:70,
              marginVertical:10
            }}
            resizeMode='contain'
            />
  <Text
                  style={{ fontFamily: Fonts.bold, fontSize: 20, color: ThemeManager.colors.textColor, textAlign:'center'}}>
                  IMPORTANT: Rezor Balance Check
                </Text>
  <Text
                  style={{ fontFamily: Fonts.regular, fontSize: 15, color: ThemeManager.colors.lightTextColor, textAlign:'center' , marginTop:12}}>
                  Please ensure you have {tempData?.fee} USDT in your Rezor wallet to apply successfully.
                </Text>
              
                 <View style={{flexDirection:'row' , justifyContent:'space-between' , width:'100%'}}>

                <BasicButton
                  onPress={() => {
                    setFeesModal(false)
                  }}
                  btnStyle={[styles.btnStylekyc , {width:'48%'}]}
                  customGradient={{ borderWidth:1 , borderRadius:12 , borderColor:Colors.buttonColor1}}
                  customColor={['transparent' , 'transparent']}
                  text={"Cancel"}
                  textStyle={{ fontSize: 16, fontFamily: Fonts.bold , color:Colors.buttonColor1  }}
                  />
                <BasicButton
                  onPress={() => {
                    
                    !isActiveBlack &&
                              getCurrentRouteName() != 'SaitaCardApplyForm' &&
                              navigate(NavigationStrings.SaitaCardApplyForm,{
                                cardType: 2,
                                selectedItem: tempData?.data,
                              });
                              setFeesModal(false)
                  }}
                  btnStyle={[styles.btnStylekyc , {width:'48%'}]}
                  customGradient={styles.customGrad}
                  text={"Ok"}
                  textStyle={{ fontSize: 16, fontFamily: Fonts.bold }}
                  />

                  </View>

          </View>


        </View>
      </Modal>
    </>
  );
};
export default SaitaCardDiamond;