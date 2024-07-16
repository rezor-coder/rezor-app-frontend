import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { cardUserdata, userLogOut } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, height } from '../../../Utils/themeUtils';
import { Colors, Images } from '../../../theme';
import images from '../../../theme/Images';
import { BorderLine, SimpleHeader } from '../../common';
import BlurBottomModal from '../../common/BlurBottomModal';
import CardImageBgCom from '../../common/CardImageBgCom';
import GradientButton from '../../common/GradientButton';
import TopUpCard from '../../common/TopUpCard';
import TransactionCard from '../../common/TransactionCard';
import WraperContainer from '../../common/WraperContainer';
import ListModal from '../SwapSelected/ListModal';
import styles from './SaitaCardDashBoardStyles';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { navigate } from '../../../navigationsService';
const SaitaCardDashBoard = ({navigation}) => {
  const bottomSheetRef = useRef(null);
  const {cardUserDetail} = useSelector(state=>state?.saitaCardReducer)
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const [billsData, setBillData] = useState([
    {
      date: new Date(),
      status: 'pending',
      title: 'Expense (0987)',
      discription: 'Zara shopping store',
      inUsdt: '-3.83',
      inINR: '307.54',
    },
    {
      date: new Date(),
      status: 'declined',
      title: 'Expense (0987)',
      discription: 'Zara shopping store',
      inUsdt: '-3.83',
      inINR: '307.54',
    },
    {
      date: new Date(),
      status: 'success',
      title: 'Expense (0987)',
      discription: 'Zara shopping store',
      inUsdt: '-3.83',
      inINR: '307.54',
    },
    {
      date: new Date(),
      status: 'pending',
      title: 'Expense (0987)',
      discription: 'Zara shopping store',
      inUsdt: '-3.83',
      inINR: '307.54',
    },
  ]);
  const [accountData, setAccountData] = useState([
    {coin_name: 'USDT',coin_image:Images.usdtIcon},
    {coin_name: 'Crypto',},
    {coin_name: 'Bitcoin',},
  ]);
  const [walletPayAmount,setWalletPayAmount]= useState('')
  const [cardGetAmount,setCardGetAmount]= useState('')

  const [selectedAccount,setSelectedAccount] = useState(accountData[0])
  const [selectedCardAccount,setSelectedCardAccount] = useState(accountData[0])

  const [cardCategory, setCardCategory] = useState([
    {titile: LanguageManager.topUp, icon: Images.topUp},
    {titile: LanguageManager.cardInfo, icon: Images.cardInfo},
    {titile: LanguageManager.manage, icon: Images.manage},
  ]);
  const [tabs, setTab] = useState([
    LanguageManager.transactions,
    LanguageManager.Rewards,
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [loginStatus, setLoginStatus] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const [applyCardDemo, setApplyCardDemo] = useState(false);
  const [onPressActive, setPressActive] = useState(false);

 const [showWalletPay ,setShowWalletPay]= useState(false);
 const [showCardPay ,setShowCardPay]= useState(false);

 const [isLoading,setIsLoading]= useState(false);
 useEffect(() => {
   AppState.addEventListener('change', state => {
     console.log(state, 'statestatestate');
     if (state === 'inactive' || state === 'background') {
       setShowBottomSheet(false);
       setShowWalletPay(false);
     }
   });
 }, []);

 const onCloseAllList =()=>{
  setShowWalletPay(false)
  setShowCardPay(false)
  setShowBottomSheet(true)
 }
 const onPressShowModal =()=>{
  setShowWalletPay(true)
  setShowBottomSheet(false)
 }
 const onPressShowModalTwo =()=>{
  setShowCardPay(true)
  setShowBottomSheet(false)
 }
  const onPresslogin = () => {
    setPressActive(true);
    setTimeout(() => {
      setPressActive(false);
    }, 200);
    navigate(NavigationStrings.SaitaCardLogin,{from: 'Dashboard'});
  };
  const onPressApplyCard = () => {
    setPressActive(true);
    setTimeout(() => {
      setPressActive(false);
    }, 200);
    navigate(NavigationStrings.ApplyCardWelcomeScreen);
  };
  const onPressShowDetail = () => {
    setShowCardDetail(!showCardDetail);
  };
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);
  const onPressCategory = type => {
    setPressActive(true);
    setTimeout(() => {
      setPressActive(false);
    }, 200);

    switch (type.trim()) {
      case LanguageManager.topUp.trim():
        setShowBottomSheet(true);
        break;
      case LanguageManager.cardInfo.trim():
        navigate(NavigationStrings.CardInfo)
        break;
      case LanguageManager.manage.trim():
        navigate(NavigationStrings.CardManage)
        break;
      default:
        break;
    }
  };

  const onPressCloseSheet = () => {
    setWalletPayAmount('')
    setCardGetAmount('')
    setShowBottomSheet(false);
  };
  //----------------------------------------------------------------

  const onPressLogOut = () => {
    setIsLoading(true);
    userLogOut({data: {}, token: cardUserDetail?.access_token})
      .then(res => {
        console.log(res,'resresresres');
        Singleton.getInstance().newSaveData(
          constants.USER_DATA,
          JSON.stringify({}),
        );
        cardUserdata(dispatch, {});
        setIsLoading(false);
      })
      .catch(error => {
        Singleton.showAlert(error.message);
        setIsLoading(false);
      });
  };
  //----------------------------------------------------------------
  const renderCategoryView = ({item}) => {
    return (
      <TouchableOpacity   disabled={onPressActive}  style={styles.categoryView} onPress={()=>onPressCategory(item.titile)}>
        <FastImage
          source={item.icon}
          style={styles.categoryIconStyle}
          resizeMode="contain"
        />
        <Text style={styles.categoryTextStyle}>{item.titile}</Text>
      </TouchableOpacity>
    );
  };
  //----------------------------------------------------------------

  const renderCardView = useCallback(() => {
    return (
      <View>
        <TouchableOpacity
          disabled={onPressActive}
          style={[
            styles.loginView,
            {backgroundColor: ThemeManager.colors.iconBg},
          ]}
          onPress={() =>
            cardUserDetail?.access_token ? setApplyCardDemo(true) : setLoginStatus(true)
          }>
          <Text
            style={[styles.logintext, {color: ThemeManager.colors.textColor}]}>
            {!cardUserDetail?.access_token
              ? LanguageManager.loginRegister
              : LanguageManager.applytheCard}
          </Text>
        </TouchableOpacity>
        <View style={styles.cardTitleView}>
          <Text style={[styles.cardTitle]}>
            {!cardUserDetail?.access_token
              ? LanguageManager.unlockSavingWithClick
              : LanguageManager.applyForCard}
          </Text>
          <Text style={[styles.cardSubTitle]}>
            {!cardUserDetail?.access_token
              ? LanguageManager.loginOrRegisterDiscription
              : LanguageManager.applyCarddiscription}
          </Text>
        </View>
      </View>
    );
  },[cardUserDetail,applyCardDemo,showCardDetail]);
// ----------------------------------------------------------------
  const renderCardDetail = useCallback(() => {
    return (
      <View style={styles.cardInnerView}>
        <Text style={styles.cardOwnername}>{'Cillian Murphy'}</Text>
        <View style={styles.flexRow}>
          <Text style={styles.cardName}>{LanguageManager.cardBalance}</Text>
          <TouchableOpacity       disabled={onPressActive}  onPress={onPressShowDetail}>
            <Image
              source={!showCardDetail ? Images.eyeClosed : Images.eyeOpened}
              style={styles.showIconStyle}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.cardNumber, {marginBottom: '5%'}]}>
          {showCardDetail ? '$2000' : '*******'}
        </Text>
        <Text style={styles.cardNumber}>
          {showCardDetail ? '4242 4242 4242 0987' : '**** **** **** 0987'}
        </Text>
        <LinearGradient
          style={styles.gradientView}
          colors={[Colors.blackLight, Colors.lightGrey]}>
          <Text style={styles.cardBrand}>Platinum</Text>
        </LinearGradient>
      </View>
    );
  },[showCardDetail]);
const renderAllcardCategory =useCallback(()=>{
return (
  <CardImageBgCom
  disabled={onPressActive}
    renderComponent={!applyCardDemo ? renderCardView : renderCardDetail}
    cardMainViewStyle={{marginTop: 0}}
    onPress={!cardUserDetail?.access_token ? onPresslogin : onPressApplyCard}
  />
)
},[cardCategory,cardUserDetail,applyCardDemo,showCardDetail])
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
        <View
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
        </View>
        <View style={styles.viewAllView}>
          <Text
            style={[
              styles.billTextStyle,
              {color: ThemeManager.colors.textColor},
            ]}>
            {LanguageManager.bill}
          </Text>
          <Text style={styles.viewAllTextStyle}>{LanguageManager.viewAll}</Text>
        </View>
        <View style={styles.tabMainView}>
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
        </View>
        {billsData.length > 0 ? (
          <View style={[styles.expenseDetailView,{backgroundColor:ThemeManager.colors.cardBgColor}]}>
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
        ) : null}
      </View>
    );
  };
// ----------------------------------------------------------------
   const renderTransactionsView = ({item}) => {
     return <TransactionCard item={item} />;
   };
   //----------------------------------------------------------------
   const topUpView = useCallback(() => {
     return (
       <View>
         <Text
           style={[
             styles.topUpTextStyle,
             {color: ThemeManager.colors.textColor},
           ]}>
           {LanguageManager.topUp}
         </Text>
         <TopUpCard
           data={accountData}
           selectedValue={selectedAccount ?? accountData[0]}
           title={'Wallet Pay'}
           placeholder={'0.00'}
           value={walletPayAmount}
           walletBalance={'0.00'}
           onChangeText={text => setWalletPayAmount(text)}
           onPressShowModal={onPressShowModal}
         />
         <TopUpCard
           data={accountData}
           selectedValue={selectedCardAccount ?? accountData[0]}
           title={'Card Get'}
           value={cardGetAmount}
           placeholder={'0.00'}
           onChangeText={text => setCardGetAmount(text)}
           onPressShowModal={onPressShowModalTwo}
         />
         <GradientButton
           buttonStyle={styles.buttonView}
           title={LanguageManager.topUp}
           
         />
       </View>
     );
   }, [cardGetAmount, selectedAccount,accountData, walletPayAmount,selectedCardAccount]);
  //  ------------------------------------------------------------------------------------------------
   return (
     <WraperContainer isLoading={isLoading}>
       <SimpleHeader
         title={LanguageManager.saitaCard}
         backImage={ThemeManager.ImageIcons.iconBack}
         titleStyle
         imageShow
         back={false}
         backPressed={() => {
           navigation.goBack();
         }}
         rightIcon={cardUserDetail?.access_token && images.icon_logout}
         onPressHistory={() => {
           Alert.alert(
             constants.APP_NAME,
             'Are you sure you want to log out?',
             [
               {
                 text: 'No',
                 onPress: () => console.log('Cancel Pressed'),
                 style: 'cancel',
               },
               {text: 'Yes', onPress: () => onPressLogOut()},
             ],
           );
         }}
       />
       {/* <View style={styles.borderLineStyle} /> */}
       <BorderLine
         borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
       />

       <FlatList
         data={billsData}
         style={{paddingTop: areaDimen(24)}}
         contentContainerStyle={{paddingBottom: areaDimen(50)}}
         renderItem={renderTransactionsView}
         ListHeaderComponent={renderHeaderComponent}
         ListEmptyComponent={() => {
           return (
             <View style={styles.emptyTransactionsView}>
               <FastImage
                 source={Images.emptyTransactions}
                 style={styles.emptyIconStyle}
                 resizeMode="contain"
               />
               <Text
                 style={[
                   styles.emptyTextStyle,
                   {color: ThemeManager.colors.viewBorderColor},
                 ]}>
                 {LanguageManager.noDataFound}
               </Text>
             </View>
           );
         }}
         showsVerticalScrollIndicator={false}
         ItemSeparatorComponent={() => <View style={{height: areaDimen(12)}} />}
         keyExtractor={(item, index) => index.toString()}
       />
       <BlurBottomModal
         visible={showBottomSheet}
         modalHeight={height / 2.4}
         onPressCloseSheet={onPressCloseSheet}>
         <View
           style={{
             paddingHorizontal: areaDimen(22),
             paddingVertical: areaDimen(18),
           }}>
           {topUpView()}
         </View>
       </BlurBottomModal>

       {showWalletPay ? (
         <BottomSheet
           ref={bottomSheetRef}
           snapPoints={[height]}
           backgroundStyle={{backgroundColor: 'transparent'}}
           handleComponent={() => <></>}
           onChange={handleSheetChanges}>
           <ListModal
             list={accountData}
             onPressItem={value => setSelectedAccount(value)}
             onClose={onCloseAllList}
             title={LanguageManager.account}
           />
         </BottomSheet>
       ) : null}
       {showCardPay ? (
         <BottomSheet
           ref={bottomSheetRef}
           snapPoints={[height]}
           backgroundStyle={{backgroundColor: 'transparent'}}
           handleComponent={() => <></>}
           onChange={handleSheetChanges}>
           <ListModal
             list={accountData}
             onPressItem={value => setSelectedCardAccount(value)}
             onClose={onCloseAllList}
             title={LanguageManager.account}
           />
         </BottomSheet>
       ) : null}
     </WraperContainer>
   );
};

export default SaitaCardDashBoard;
