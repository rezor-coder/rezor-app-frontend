import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, FlatList, Image, Modal, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../../ThemeManager';
import * as constants from '../../../../Constant';
import { blockCard, cardDetailsCode, cardTransactions, cardUserdata, ConfirmRecharge, getCardDetails, getCardLimits, getCardWalletList, getCodeForCardBlock, getCodeForCardUnBlock, getVaultCardWalletList, RechargeConversion, unBlockCard, userLogOut } from '../../../../Redux/Actions';
import Singleton from '../../../../Singleton';
import { areaDimen, height, heightDimen } from '../../../../Utils/themeUtils';
import { Colors, Images } from '../../../../theme';
import images from '../../../../theme/Images';
import { BorderLine, KeyboardDigit, PinInput, SimpleHeader } from '../../../common';
import BlurBottomModal from '../../../common/BlurBottomModal';
import CardImageBgCom from '../../../common/CardImageBgCom';
import GradientButton from '../../../common/GradientButton';
import TopUpCard from '../../../common/TopUpCard';
import TransactionCard from '../../../common/TransactionCard';
import WrapperContainer from '../../../common/WrapperContainer';
import ListModal from '../../SwapSelected/ListModal';
import styles from './styles';
import { NavigationStrings } from '../../../../Navigation/NavigationStrings';
import { navigate } from '../../../../navigationsService';
import Loader from '../../Loader/Loader';
import { decryptionCard, toFixedExp } from '../../../../utils';
import OtpModal from '../../../common/OtpModal';
import ShimmerLoader from '../../../common/ShimmerLoader';
import { debounce, isEmpty } from 'lodash';
const CardHome = (props) => {
  const bottomSheetRef = useRef(null);
  const { cardUserDetail } = useSelector(state => state?.saitaCardReducer);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [billsData, setBillData] = useState([]);
  const [accountData, setAccountData] = useState([
    { coin_name: 'USDT', coin_image: Images.usdtIcon },
    { coin_name: 'Crypto' },
    { coin_name: 'Bitcoin' },
  ]);
  const [walletPayAmount, setWalletPayAmount] = useState('');
  const [cardGetAmount, setCardGetAmount] = useState('');

  const [selectedAccount, setSelectedAccount] = useState(accountData[0]);
  const [selectedCardAccount, setSelectedCardAccount] = useState();

  const [cardCategory, setCardCategory] = useState([
    { titile: LanguageManager.topUp, icon: Images.topUp },
    { titile: LanguageManager.cardInfo, icon: Images.cardInfo },
    { titile: `${LanguageManager.lockcard}/${LanguageManager.unlockCard}`, icon: Images.lockCard }
  ]);
  const [tabs, setTab] = useState([
    LanguageManager.transactions,
    LanguageManager.Rewards,
  ]);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const [applyCardDemo, setApplyCardDemo] = useState(false);
  const [onPressActive, setPressActive] = useState(false);

  const [showWalletPay, setShowWalletPay] = useState(false);
  const [showCardPay, setShowCardPay] = useState(false);
  const [limit, setlimit] = useState(25);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionsLoader, setTransactionsLoader] = useState(true);
  //  ----------------------------------------------------------------
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: props.userCards[0]?.number,
    cvv: '***',
    expire: props.userCards[0]?.expired,
    name: props.userCards[0]?.cardholderName,
    balance: '****',
  });
  const [selectedType, setSelectedType] = useState('');
  const [shimmerLoader, setShimmerLoader] = useState(props?.isLoading);
  const [cardLimits, setCardLimits] = useState([]);
  const [cardCurrencyData, setCardCurrencyData] = useState([]);
  const [cardLocked, setCardLOcked] = useState(props.userCards[0]?.status == 'SOFT_BLOCKED' ? true : false)
  const [fee, setFee] = useState('');
  const [topUpLoader, setTopUpLoader] = useState(false)
  const [rechargeOffer, setRechargeOffer] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [feePercent, setFeePercent] = useState(0.04)

  console.log(props, 'setShimmerLoader');
  useEffect(() => {
    AppState.addEventListener('change', state => {
      console.log(state, 'statestatestate');
      if (state === 'inactive' || state === 'background') {
        setShowBottomSheet(false);
        setShowWalletPay(false);
        setIsLoading(false)
        setShowOtpModal(false)
      }
    });
    props.navigation.addListener('focus', () => {
      setIsLoading(false)
    })
    props.navigation.addListener('blur', () => {
      setIsLoading(false)
      setShowOtpModal(false)
    })
    initialCall();
  }, []);
  const initialCall = () => {
    let data = {
      cardId: props.userCards[0]?.id,
      cardProgram: props.userCards[0]?.cardProgram,
      offset: offset,
      limit: limit,
    };
    dispatch(cardTransactions(data))
      .then(async res => {
        console.log('cardTransactions:::::::::', JSON.stringify(res));
        setTransactionsLoader(false);
        setBillData(res.data);
      })
      .catch(err => {
        console.log('cardTransactions:::::::::', err);
        setTransactionsLoader(false);
        if (err == constants.ACCESS_TOKEN_EXPIRED) {
          // Singleton.showAlert(Constants.ACCESS_TOKEN_EXPIRED)
        }
      });
  };
  const onCloseAllList = () => {
    setShowWalletPay(false);
    setShowCardPay(false);
    setShowBottomSheet(true);
  };
  const onPressShowModal = () => {
    setShowWalletPay(true);
    setShowBottomSheet(false);
  };
  const onPressShowModalTwo = () => {
    setShowCardPay(true);
    setShowBottomSheet(false);
  };

  // ----------------------------------------------------------------

  const onPressShowDetail = () => {
    if(props.userCards[0]?.status == 'SOFT_BLOCKED'){
      Singleton.showAlert('To use this feature, please unlock your card.');
      return;
    }
    if (showCardDetail) {
      setShowCardDetail(false);
    } else {
      setSelectedType('topUp');
      getCardDetailsCode();
    }
  };
  // ----------------------------------------------------------------
  const getCardDetailsCode = () => {
    setIsLoading(true);
    let data = {
      cardId: props.userCards[0]?.id,
      cardProgram: props.userCards[0]?.cardProgram,
    };
    dispatch(cardDetailsCode(data))
      .then(res => {
        setIsLoading(false);
        setShowOtpModal(true);
        console.log('res::::::', res);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('err::::::', err);
      });
  };
  const onChnageTopupAmount = (text, account) => {
    setWalletPayAmount(text)
    console.log(text, 'texttexttexttext');
    if (text != 0 || text != '') {
      debounceLoadData(text, account)
    } else {
      setRechargeOffer('')
      setWalletPayAmount('')
      setCardGetAmount('')
    }
  }
  /******************************************************************************************/
  const debounceLoadData = useCallback(

    debounce((text, account) => {
        console.log("::::111", feePercent)
        let totalAmount = Number(text) + (Number(text) * feePercent)
        console.log("totalAmount::::::", account?.availableBalance,Number(text));
        if (account?.availableBalance < Number(text)) {
            setRechargeOffer('')
            setWalletPayAmount('')
            setCardGetAmount('')
            Singleton.showAlert(`${LanguageManager.insufficientBalance}. ${LanguageManager.pleaseRecharge} ${account.currency} ${LanguageManager.walletFirst}`);

            // Singleton.showAlert(LanguageManager.somethingWentWrong);
            return
        }
        if (account?.availableBalance < totalAmount) {
            setRechargeOffer('')
            setWalletPayAmount('')
            setCardGetAmount('')
            Singleton.showAlert(`The max topUp that can be done is ${toFixedExp(account?.availableBalance - (Number(text) * feePercent),8)} ${account?.currency}, ${feePercent}% of entered amount will be deducted as fee.`);
            return
        }
        if (account?.availableBalance > account?.limitObj?.fromLimits?.min) {
            getConversionAmount(text, account);
        } else {
            setRechargeOffer('')
            setWalletPayAmount('')
            setCardGetAmount('')
            Singleton.showAlert(`${LanguageManager.insufficientBalance}. ${LanguageManager.pleaseRecharge} ${account.currency} ${LanguageManager.walletFirst}`);
        }
    }, 2000),
    [],
);
  /******************************************************************************************/
  const getConversionAmount = async (amount, account) => {

    console.log("::::222", selectedAccount, accountData[0])
    let data = {
      "fromCurrency": account?.currency,
      "toCurrency": "USD",
      "fromAmount": amount
    }
    console.log("::::333")
    setTopUpLoader(true)
    await setFee('')
    RechargeConversion(data, props.userCards[0]?.id, props.userCards[0]?.cardProgram).then(async res => {
      setTopUpLoader(false)
      console.log("res::::::RechargeConversion", res);
      await setRechargeOffer(res)
      let totalFee = res.fees.clientMarkUpFee + res.fees.supplierFee + res.fees.vaultFee
      await setFee(totalFee)
      await setCardGetAmount(res.to.value?.toString())
    }).catch(err => {
      setRechargeOffer('')
      setTopUpLoader(false)
      setWalletPayAmount('')
      setCardGetAmount('')
      Singleton.showAlert(err || LanguageManager.somethingWentWrong)
      console.log("err::::::RechargeConversion", err);
    })
  }
  const onTopUp = (selectedAccount) => {
    if (selectedAccount?.availableBalance < selectedAccount?.limitObj?.fromLimits?.min) {
      props.navigation.navigate('Deposit', { account: selectedAccount })
      setShowBottomSheet(false)
      return
    }
    if (walletPayAmount == '') {
      Singleton.showAlert(LanguageManager.pleaseEnterAmount)
      return
    }
    setIsLoading(true)
    ConfirmRecharge(props.userCards[0]?.id, props.userCards[0]?.cardProgram, rechargeOffer?.offerId).then(res => {
      console.log("res::::::", res);
      if (res.status == 'FAILED') {
        setWalletPayAmount('')
        setCardGetAmount('')
        setRechargeOffer('')
        setIsLoading(false)
        Singleton.showAlert(LanguageManager.rechargeFailedTryAgain)
      } else if (res.status == 'PENDING') {
        setWalletPayAmount('')
        setCardGetAmount('')
        Singleton.showAlert(LanguageManager.rechargeConfirmWait)
        setRechargeOffer('')
        setIsLoading(false)
        setShowBottomSheet(false)
      }
    }).catch(err => {
      console.log("err::::::", err);
      Singleton.showAlert(err || LanguageManager.somethingWentWrong)
      setWalletPayAmount('')
      setCardGetAmount('')
    })
  }

  // ----------------------------------------------------------------
  const onContinueOTP = code => {
    
    if (selectedType == 'topUp') {
      setIsLoading(true);

      let data = {
        code: code,
        publicKey: constants.CARD_PUBLIC_KEY,
        cardId: props.userCards[0]?.id,
        cardProgram: props.userCards[0]?.cardProgram,
      };
      dispatch(getCardDetails({ data }))
        .then(async res => {
          setShowOtpModal(false);
          console.log('res::::::::', res);
          let number = await decryptionCard(res.number);
          let cvv = await decryptionCard(res.cvv);
          let name = await decryptionCard(res.cardholderName);
          let expiry = await decryptionCard(res.expiry);
          let cardData = {
            cardNumber: number,
            cvv: cvv,
            expire: expiry,
            name: name,
            balance: props.userCards[0].balance.value,
          };
          setShowOtpModal(false);
          console.log('cardData::::::::', cardData);
          await setCardDetails(cardData);
          await setShowCardDetail(true);
          setIsLoading(false);
          setSelectedType('');
        })
        .catch(async err => {
          setIsLoading(false);
          Singleton.showAlert(err);
          console.log('err::::::', err);
        });
    } else {
      let data = {
        cardId: props.userCards[0]?.id,
        cardProgram: props.userCards[0]?.cardProgram,
        code: code,
      };
      setIsLoading(true);
      dispatch(!cardLocked ? blockCard({ data }) : unBlockCard({ data }))
        .then(res => {
         
          setIsLoading(false);
          setShowOtpModal(false);
          setSelectedType('');
          props?.initialCall()
          if (cardLocked) {
            setCardLOcked(false);
            Singleton.showAlert('Card unlocked Successfully');
          } else {
            setCardLOcked(true);
            Singleton.showAlert('Card locked Successfully');
          }
        })
        .catch(err => {
          setIsLoading(false);
          Singleton.showAlert(err);
          console.log(err, '::::::::::card', err);
        });
    }
  };



  const onPressCategory = async type => {
    setPressActive(true);
    setTimeout(() => {
      setPressActive(false);
    }, 200);

    switch (type.trim()) {
      case LanguageManager.topUp.trim():
        if(props.userCards[0]?.status == 'SOFT_BLOCKED'){
          Singleton.showAlert('To use this feature, please unlock your card.');
          return;
        }
        setFee('');
        setIsLoading(true);

        getCardWalletList({})
          .then(res1 => {
            getVaultCardWalletList({ data: props?.userCards[0]?.cardProgram })
              .then(async res => {
                getCardLimits(
                  props.userCards[0]?.id,
                  props?.userCards[0]?.cardProgram,
                )
                  .then(async res3 => {
                    console.log(
                      'getCardLimits::::::::::',
                      JSON.stringify(res3)
                    );
                    let newData = res1?.wallets?.filter(item =>
                      res?.includes(item?.currency),
                    );
                    let currency = res.filter(
                      item => !res1.wallets.some(w => w.currency == item),
                    );
                    let formattedCurrencies = currency.map(item => ({
                      currency: item,
                    }));
                    let limitObj = res3?.pairs?.find(
                      limit => limit?.currencyFrom == newData[0]?.currency,
                    );
                    let newObj = { ...newData[0], limitObj };
                    let totalFeePercent = 0
                    Object.keys(res3?.fees).forEach(function (key, index) {
                        totalFeePercent = totalFeePercent + res3?.fees[`${key}`]
                    });
                    console.log("totalFeePercent:::::::", totalFeePercent);
                    await setFeePercent(totalFeePercent)
                    await setAccountData(newData);
                    await setCardLimits(res3?.pairs);
                    console.log('newObj::::::', newObj);
                    await setSelectedAccount(newObj);
                    await setCardCurrencyData(formattedCurrencies);
                    await setShimmerLoader(false);
                    await setSelectedType('topUp');
                    await setShowBottomSheet(true);
                    await setIsLoading(false);
                  })
                  .catch(async err => {
                    await setIsLoading(false);
                    await setShimmerLoader(false);
                    await Singleton.showAlert(err);
                    console.error('Failed to fetch getCardLimits list:', err);
                  });
              })
              .catch(async error => {
                await setIsLoading(false);
                await setShimmerLoader(false);
                await Singleton.showAlert(error);
                console.error('Failed to fetch wallet list:', error);
              });
          })
          .catch(async error => {
            await setIsLoading(false);
            await setShimmerLoader(false);
            await Singleton.showAlert(error);
            await console.error('Failed to fetch wallet list:', error);
          });
        break;
      case LanguageManager.cardInfo.trim():
        if(props.userCards[0]?.status == 'SOFT_BLOCKED'){
          Singleton.showAlert('To use this feature, please unlock your card.');
          return;
        }
        navigate(NavigationStrings.CardInfo, { userCards: props.userCards });
        break;
      case `${LanguageManager.lockcard}/${LanguageManager.unlockCard}`.trim():
        await setSelectedType('lock');
        await setShowBottomSheet(true);
        break;
      default:
        break;
    }
  };
  //****************************************************************
  const onPressCloseSheet = () => {
    setWalletPayAmount('');
    setCardGetAmount('');
    setShowBottomSheet(false);
  };
  // ****************************************************************
  const onPressLockUnlockCard = () => {
    setShowBottomSheet(false)
    let apiData = {
      cardId: props.userCards[0]?.id,
      cardProgram: props.userCards[0]?.cardProgram,
    }
    setIsLoading(true)
    dispatch(cardLocked ? getCodeForCardUnBlock({ data: apiData }) : getCodeForCardBlock({ data: apiData })).then(res => {
      console.log("res:::::onPressLockUnlockCard", res);
      setSelectedType('lock')
      setIsLoading(false)
      setShowOtpModal(true)

    }).catch(err => {
      setIsLoading(false)
      Singleton.showAlert(err || LanguageManager.somethingWentWrong)
      console.log("err:::::onPressLockUnlockCard", err);
    })
  }
  const onRefresh = () => {
    console.log("onRefresh::::::::::");
    setRefreshing(true)
    setTimeout(() => {
        setRefreshing(false)
    }, 1500);
    initialCall()
}
  //----------------------------------------------------------------
  const renderCategoryView = ({ item }) => {
    if (transactionsLoader) {
      return <ShimmerLoader style={styles.shimmercategoryView} />;
    }
    return (
      <TouchableOpacity
        disabled={onPressActive}
        style={styles.categoryView}
        onPress={() => onPressCategory(item.titile)}>
        <FastImage
          source={item.icon}
          style={styles.categoryIconStyle}
          resizeMode="contain"
        />
        <Text style={styles.categoryTextStyle}>{item.titile}</Text>
      </TouchableOpacity>
    );
  };
  // ----------------------------------------------------------------
  const renderCardDetail = useCallback(() => {
    return (
      <View style={styles.cardInnerView}>
        <Text style={styles.cardOwnername}>{cardDetails?.name}</Text>
        <View style={styles.flexRow}>
          <Text style={styles.cardName}>{LanguageManager.cardBalance}</Text>
          <TouchableOpacity
            disabled={onPressActive}
            onPress={onPressShowDetail}>
            <FastImage
              source={!showCardDetail ? Images.eyeClosed : Images.eyeOpened}
              style={styles.showIconStyle}
              tintColor={Colors.White}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.cardNumber, { marginBottom: '5%' }]}>
          {!showCardDetail ? '****' : cardDetails.balance} {props.userCards[0]?.balance.currency}
        </Text>
        <Text style={styles.cardNumber}>{!showCardDetail ? props.userCards[0]?.number : cardDetails.cardNumber}</Text>
        <LinearGradient
          style={styles.gradientView}
          colors={[Colors.blackLight, Colors.lightGrey]}>
          <Text style={styles.cardBrand}>
            {props.userCards[0]?.cardDesignId}
          </Text>
        </LinearGradient>
      </View>
    );
  }, [showCardDetail, cardDetails]);
  const renderAllcardCategory = useCallback(() => {
    return (
      <CardImageBgCom
        disabled={onPressActive}
        renderComponent={renderCardDetail}
        cardMainViewStyle={{ marginTop: 0 }}
      />
    );
  }, [cardCategory, cardUserDetail, applyCardDemo, showCardDetail]);
  //----------------------------------------------------------------
  const renderHeaderComponent = () => {
    return (
      <View>
        <FlatList
          data={cardCategory}
          numColumns={3}
          ListHeaderComponent={renderAllcardCategory}
          columnWrapperStyle={styles.categoryMainView}
          renderItem={renderCategoryView}
          keyExtractor={(item, index) => index.toString()}
        />
        {/* <View
          style={[
            styles.flexRow,
            {justifyContent: 'space-between', paddingHorizontal: areaDimen(22)},
          ]}>
          <GradientButton>
            <View style={styles.flexRow}>
              <View style={styles.todayIcon}>
                <FastImage
                  source={Images.circleDoller}
                  style={styles.categoryIconStyle}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={styles.todayTextTitle}>
                  {LanguageManager.todaysSpending}
                </Text>
                <Text style={styles.todayTextSubTitle}>
                  {'37.92'}{' '}
                  <Text style={{fontSize: areaDimen(12)}}>
                    {LanguageManager.usdt}
                  </Text>
                </Text>
              </View>
            </View>
          </GradientButton>
          <GradientButton>
            <View style={styles.flexRow}>
              <View style={styles.todayIcon}>
                <FastImage
                  source={Images.dailyLimit}
                  style={styles.categoryIconStyle}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={styles.todayTextTitle}>
                  {LanguageManager.dailyLimit}
                </Text>
                <Text style={styles.todayTextSubTitle}>
                  {'1.0'}{' '}
                  <Text style={{fontSize: areaDimen(12)}}>
                    {LanguageManager.usdt}
                  </Text>
                </Text>
              </View>
            </View>
          </GradientButton>
        </View> */}
        {transactionsLoader ? (
          <View style={styles.viewAllView}>
            <ShimmerLoader
              style={{ width: areaDimen(110), borderRadius: areaDimen(10) }}
            />
            <ShimmerLoader
              style={{ width: areaDimen(60), borderRadius: areaDimen(10) }}
            />
          </View>
        ) : (
          <View style={styles.viewAllView}>
            <Text
              style={[
                styles.billTextStyle,
                { color: ThemeManager.colors.textColor },
              ]}>
              {LanguageManager.transactions}
            </Text>
            <TouchableOpacity onPress={() => navigate(NavigationStrings.VaultTransactionHistory, { userCards: props.userCards[0] })}>
              <Text style={styles.viewAllTextStyle}>
                {LanguageManager.viewAll}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* <View style={styles.tabMainView}>
          {tabs?.map((tab, index) => {
            return (
              <GradientButton
                buttonColor={
                  tab == activeTab
                    ? [Colors.buttonColor1, Colors.buttonColor1]
                    : ['transparent', 'transparent']
                }
                onPress={() => setActiveTab(tab)}
                buttonStyle={{borderRadius: areaDimen(20)}}>
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={[
                      styles.tabTitile,
                      {
                        color:
                          tab == activeTab
                            ? Colors.white
                            : ThemeManager.colors.textColor,
                      },
                    ]}>
                    {tab}
                  </Text>
                </View>
              </GradientButton>
            );
          })}
        </View> */}
        {/* {billsData.length > 0 ? (
          <View
            style={[
              styles.expenseDetailView,
              {backgroundColor: ThemeManager.colors.cardBgColor},
            ]}>
            <Text
              style={[
                styles.refundText,
                {color: ThemeManager.colors.textColor},
              ]}>
              Expense: <Text style={{color: Colors.red}}>$ 107.74</Text>
            </Text>
            <Text
              style={[
                styles.refundText,
                {color: ThemeManager.colors.textColor},
              ]}>
              Refund: <Text style={{color: Colors.darkGreen}}>$ 50</Text>
            </Text>
          </View>
        ) : null} */}
      </View>
    );
  };
  // ----------------------------------------------------------------
  const renderTransactionsView = ({ item }) => {
    return <TransactionCard item={item} />;
  };
  //----------------------------------------------------------------
  const topUpView = useCallback(() => {
    return (
      <View>
        <Text
          style={[
            styles.topUpTextStyle,
            { color: ThemeManager.colors.textColor },
          ]}>
          {LanguageManager.topUp}
        </Text>
        {!!shimmerLoader ? [...Array(2)].map(() => <ShimmerLoader style={styles.shimmerLoader} />) : <View>
          <TopUpCard
            selectedValue={!isEmpty(selectedAccount) ? selectedAccount : accountData[0]}
            title={'Wallet Pay'}
            placeholder={'0.00'}
            value={walletPayAmount}
            walletBalance={'0.00'}
            onChangeText={text => onChnageTopupAmount(text, !isEmpty(selectedAccount) ? selectedAccount : accountData[0])}
            onPressShowModal={onPressShowModal}
            maxLength={16}
            editable={topUpLoader ? false : true}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <View style={{}}>
              <Text
                style={[styles.maxText, { color: ThemeManager.colors.textColor }]}>
                {LanguageManager.max}
                <Text style={{ color: ThemeManager.colors.inActiveColor }}>
                  {' '}
                  {toFixedExp(selectedAccount?.limitObj?.fromLimits?.max, 8)}{' '}
                  {selectedAccount?.limitObj?.currencyFrom}
                </Text>
              </Text>
            </View>
            <View style={{}}>
              <Text
                style={[styles.minText, { color: ThemeManager.colors.textColor }]}>
                {LanguageManager.min}
                <Text style={{ color: ThemeManager.colors.inActiveColor }}>
                  {' '}
                  {toFixedExp(selectedAccount?.limitObj?.fromLimits?.min, 8)}{' '}
                  {selectedAccount?.limitObj?.currencyFrom}
                </Text>
              </Text>
            </View>
          </View>

          <TopUpCard
            selectedValue={
              !isEmpty(selectedCardAccount)
                ? selectedCardAccount
                : cardCurrencyData[0]
            }
            title={'Card Get'}
            value={cardGetAmount}
            placeholder={'0.00'}
            onChangeText={text => setCardGetAmount(text)}
            onPressShowModal={onPressShowModalTwo}
            showLoader={topUpLoader}
          />
        </View>}
        {!!shimmerLoader ? (
          <ShimmerLoader style={styles.buttonView} />
        ) : (
          <GradientButton
            buttonStyle={styles.buttonView}
            title={LanguageManager.topUp}
            onPress={() => onTopUp(selectedAccount)}
          />
        )}
      </View>
    );
  }, [cardGetAmount, selectedAccount, walletPayAmount, shimmerLoader, cardCurrencyData, topUpLoader, fee, cardGetAmount]);
  //  ------------------------------------------------------------------------------------------------
  const lockCardView = () => {
    return (
      <View>
        <FastImage
          source={Images.circleCardLock}
          style={styles.cardLockImageStyle}
          resizeMode="contain"
        />
        <Text style={[styles.cardLockTitle, { color: ThemeManager.colors.textColor, }]}>
          {props.userCards[0]?.status == 'ACTIVE' ? LanguageManager.areYorSureWantToLockYourCard : LanguageManager.areYorSureWantToUnlockYourCard}
        </Text>
        <Text style={styles.cardLockSubTitle}>
          {props.userCards[0]?.status == 'ACTIVE' ? LanguageManager.lockedCardWarning : LanguageManager.unlockCardText}
        </Text>

        <GradientButton
          title={LanguageManager.confirm}
          buttonStyle={styles.buttonView}
          onPress={() => onPressLockUnlockCard()}
        />
      </View>
    );
  };
  return (
    <View style={{flex:1}}>
      <FlatList
        data={billsData?.slice(0, 5)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} tintColor={Colors.buttonColor1} />
      }
        style={{ paddingTop: areaDimen(24) }}
        contentContainerStyle={{ paddingBottom: areaDimen(50), flexGrow: 1,}}
        renderItem={renderTransactionsView}
        ListHeaderComponent={renderHeaderComponent}
        ListEmptyComponent={() => {
          return transactionsLoader ? (
            [...Array(6)].map(() => (
              <ShimmerLoader style={styles.transactionViewshimmer} />
            ))
          ) : (
            <View style={styles.emptyTransactionsView}>
              <FastImage
                source={Images.emptyTransactions}
                style={styles.emptyIconStyle}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.emptyTextStyle,
                  { color: ThemeManager.colors.textColor },
                ]}>
                {LanguageManager.noDataFound}
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: areaDimen(12) }} />}
        keyExtractor={(item, index) => index.toString()}
      />
      <BlurBottomModal
        visible={showBottomSheet}
        modalHeight={selectedType == 'topUp' ? height / 2.2 : height / 3}
        onPressCloseSheet={onPressCloseSheet}>
        <View
          style={{
            paddingHorizontal: areaDimen(22),
            paddingVertical: areaDimen(18),
          }}>
          {selectedType == 'topUp' ? topUpView() : lockCardView()}
        </View>
      </BlurBottomModal>
      {showWalletPay ? (
        <Modal
          key={'1'}
          visible={showWalletPay}
          animationType="slide"
          transparent={true}
          statusBarTranslucent
          style={{ flex: 1, justifyContent: 'flex-end' }}
          onRequestClose={onCloseAllList}>
          <ListModal
            list={accountData}
            onPressItem={value => {
              let limitObj = cardLimits?.find(
                limit => limit?.currencyFrom == value?.currency,
              );
              let newObj = { ...value, limitObj };
              console.log('newObj::::', newObj);
              setCardGetAmount('');
              setWalletPayAmount('');
              setSelectedAccount(newObj);
            }}
            onClose={onCloseAllList}
            title={LanguageManager.account}
          />
        </Modal>
      ) : null}
      {showCardPay ? (
        <Modal
          key={'1'}
          visible={showCardPay}
          animationType="slide"
          transparent={true}
          statusBarTranslucent
          style={{ flex: 1, justifyContent: 'flex-end' }}
          onRequestClose={onCloseAllList}>
          <ListModal
            list={cardCurrencyData}
            onPressItem={value => {
              setSelectedCardAccount(value);
            }}
            onClose={onCloseAllList}
            title={LanguageManager.account}
          />
        </Modal>
      ) : null}
      {/* --------------------------------Modal for Pin----------------------------------- */}
      {!!showOtpModal && <OtpModal
        showOtpModal={showOtpModal}
        setShowOtpModal={() => setShowOtpModal(false)}
        onContinueOTP={onContinueOTP}
        isLoading={isLoading}
      />}
      {isLoading  && <Loader />}
    </View>
  );
};

export default CardHome;
