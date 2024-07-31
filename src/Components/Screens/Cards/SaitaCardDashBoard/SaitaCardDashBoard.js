import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { AppState, BackHandler, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../../ThemeManager';
import * as Constants from '../../../../Constant';
import { NavigationStrings } from '../../../../Navigation/NavigationStrings';
import { goBack, navigate } from '../../../../navigationsService';
import {
  ConfirmCardFee,
  customerProfile,
  kycData,
  PayCardFee,
  userCardList
} from '../../../../Redux/Actions';
import Singleton from '../../../../Singleton';
import { Colors, Images } from '../../../../theme';
import {
  areaDimen,
  heightDimen
} from '../../../../Utils/themeUtils';
import { BorderLine, SimpleHeader } from '../../../common';
import CardImageBgCom from '../../../common/CardImageBgCom';
import ShimmerLoader from '../../../common/ShimmerLoader';
import WrapperContainer from '../../../common/WrapperContainer';
import Loader from '../../Loader/Loader';
import CardHome from '../CardHome/CardHome';
import RechargeModule from '../RechargeModule/RechargeModule';
import { styles } from './styles';

const SaitaCardDashBoard = props => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // Individual state hooks
  const [isCardActive, setIsCardActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onPressActive, setOnPressActive] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [detailsAdded, setDetailsAdded] = useState(false);
  const [kycStatus, setKycStatus] = useState('');
  const [userCards, setUserCards] = useState([]);
  const [activeCards, setActiveCards] = useState([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [loader, setLoader] = useState(false);
  const [welcomStep, setWelcomStep] = useState([
    {"status": "pending", "title": "KYC"},
    {"status": "pending", "title": "Select card"},
    {"status": "pending", "title": "Submit details"},
    {"status": "pending", "title": "Done"}
  ]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [emailAdded,setEmailAdded]=useState(false)
  const [refreshing, setRefreshing] = useState(false)


  useFocusEffect(useCallback(() => {
    setWelcomStep([
      { title: 'KYC', status: 'pending',  },
      { title: 'Select card', status: 'pending',},
      { title: 'Submit details', status: 'pending',},
      { title: 'Done', status: 'pending',},
    ])
    setDetailsAdded(false)
    setIsCardActive(false)
    setIsLoading(true)
    setKycStatus('')
    setUserCards([])
    setActiveCards([])
    initialCall()
    AppState.addEventListener('change', state => {
      console.log(state, 'statestatestate');
      if (state === 'inactive' || state === 'background') {
        setShowBottomSheet(false)
      }
    });
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
  }, []))
  const handleBackButtonClick = () => {
    navigate(NavigationStrings.Dashboard)
    return true;
  };
  const initialCall = useCallback((isloader) => {
    isloader ? setLoader(true) : setIsLoading(true)
    dispatch(customerProfile())
      .then(async res => {
        console.log('customerProfile:', res);
        if (!!res?.data?.email) {
          setEmailAdded(true)
        }
        if (!!res?.data?.residenceZipCode) {
          setIsSignedIn(true);
          setDetailsAdded(true);
          dispatch(kycData())
            .then(resKYc => {
              console.log('kycData:', res);
              setKycStatus(resKYc.data?.kyc1ClientData?.status);
              let stepData = [
                { title: 'KYC', status: 'pending',  },
                { title: 'Select card', status: 'pending',},
                { title: 'Submit details', status: 'pending',},
                { title: 'Done', status: 'pending',},
              ]
              if (!!(resKYc.data?.kyc1ClientData?.status === 'APPROVED')) {
                dispatch(userCardList())
                  .then(res => {
                    setUserCards(res.data?.cards);
                    if (res.data?.cards?.length > 0) {
                      let activeCard = res.data?.cards?.filter(
                        card =>
                          card?.status == 'ACTIVE' ||
                          card?.status == 'SOFT_BLOCKED',
                      );
                      let newArr = stepData.map(step => {
                        if (
                          step.title == 'KYC' &&
                          resKYc.data?.kyc1ClientData?.status == 'APPROVED'
                        ) {
                          return {...step, status: 'done'};
                        } else if (
                          step.title == 'Select card' &&
                          res.data?.cards?.length > 0
                        ) {
                          setCurrentPosition(2);
                          return {...step, status: 'done'};
                        } else if (
                          step.title == 'Submit details' &&
                          res.data?.cards[0]?.additionalStatuses?.includes(
                            'ADDITIONAL_PERSONAL_INFO',
                          )
                        ) {
                          setCurrentPosition(4);
                          return {...step, status: 'done'};
                        } else if (
                          step.title == 'Pay Fee' &&
                          res.data?.cards[0]?.additionalStatuses?.includes(
                            'PAID',
                          ) && activeCard.length > 0
                        ) {
                          setCurrentPosition(5);
                          return {...step, status: 'done'};
                        } else {
                          return step;
                        }
                      });
                      setWelcomStep(newArr);
                      if (activeCard?.length > 0) {
                        setActiveCards(activeCard || []);
                        console.log('tru:::::::::');
                        if (
                          activeCard[0]?.status == 'ACTIVE' ||
                          activeCard[0]?.status == 'SOFT_BLOCKED' ||
                          activeCard[0]?.status == 'INACTIVE'
                        ) {
                          console.log('tru:::::::::');
                          setIsCardActive(true);
                        }
                      }
                    } else {
                      let newArr = welcomStep.map(step => {
                        if (
                          step.title == 'KYC' &&
                          resKYc.data?.kyc1ClientData?.status == 'APPROVED'
                        ) {
                          setCurrentPosition(1);
                          return {...step, status: 'done'};
                        } else {
                          return step;
                        }
                      });
                      setWelcomStep(newArr);
                    }
                    isloader ? setLoader(false) : setIsLoading(false)
                    
                  })
                  .catch(err => {
                    console.log('userCardList error:', err);
                    isloader ? setLoader(false) : setIsLoading(false)
                  });
              }else{
                isloader ? setLoader(false) : setIsLoading(false)
              }
            })
            .catch(err => {
              console.log('kycData error:', err);
              isloader ? setLoader(false) : setIsLoading(false)
            });
        } else {
          setIsLoading(false);
          setDetailsAdded(false);
          setIsSignedIn(true);
        }
      })
      .catch(err => {
        console.log('customerProfile error:', err);
        isloader ? setLoader(false) : setIsLoading(false)
        if (err === Constants.ACCESS_TOKEN_EXPIRED) {
          setIsSignedIn(false);
          setIsCardActive(false);
        } else {
          setIsSignedIn(true);
        }
      });
  }, [dispatch, props.navigation]);
  const onPressLogin = () => {
    navigate(NavigationStrings.SaitaCardLogin);
  };

  const onPressApplyCard = () => {
    if (!emailAdded) {
      navigate(NavigationStrings.RegisterNow, {verifyEmail: true});
    } else if (
      userCards[0]?.additionalStatuses?.includes('ADDITIONAL_PERSONAL_INFO')
    ) {
      setShowBottomSheet(true);
    } else if (!detailsAdded) {
      navigate(NavigationStrings.UserDetail, {
        from: 'dashboard',
      });
    } else if (kycStatus == 'UNDER_REVIEW') {
      Singleton.showAlert(
        'Your KYC is currently under review. Please wait for a moment.',
      );
    } else {
      if (kycStatus === 'UNDEFINED' || kycStatus === 'DENIED') {
        navigate(NavigationStrings.ApplyCardWelcomeScreen, {
          from: 'dashboard',
          kycStatus,
        });
      } else {
        if (kycStatus !== 'UNDER_REVIEW') {
          if (userCards?.length > 0) {
            if (userCards[0]?.status === 'COLLECTION') {
              navigate(NavigationStrings.AfterApplyDetails, {
                card: userCards[0],
              });
            } else if (userCards[0]?.status === 'IN_PROGRESS') {
              // Handle IN_PROGRESS state if needed
            }
          } else {
            navigate(NavigationStrings.ApplyCardWelcomeScreen, {
              from: 'dashboard',
              kycStatus: 'APPROVED',
            });
          }
        }
      }
    }
  };

  // --------------------------------  recharge module--------------------------------
  const onPressCloseSheet = () => {
    setShowBottomSheet(false);
  };
  const onDeposit = () => {
    setShowBottomSheet(false);
    navigate(NavigationStrings.DepositScreen);
  };
  const onPressConfirm = selectedAccount => {
    console.log(selectedAccount, 'selectedAccountselectedAccount');
    setShowBottomSheet(false);
    setOnPressActive(true);
    setTimeout(() => {
      setOnPressActive(false);
    }, 200);
    setLoader(true);
    PayCardFee(
      userCards[0]?.cardRequestId,
      selectedAccount?.currency,
      userCards[0]?.cardProgram,
    )
      .then(res => {
        ConfirmCardFee(userCards[0]?.cardRequestId, userCards[0]?.cardProgram)
          .then(async res => {
            initialCall(true);
            console.log('res:::::ConfirmCardFee', res);
            setLoader(false);
          })
          .catch(err => {
            Singleton.showAlert(err);
            setLoader(false);
            console.log('err:::::ConfirmCardFee', err);
          });
        console.log('res:::::PayCardFee', res);
      })
      .catch(err => {
        Singleton.showAlert(err);
        console.log('err::::PayCardFee', err);
      });
  };
  const onRefresh = () => {
    console.log("onRefresh::::::::::");
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500);
    initialCall(true)
  }

  const renderCardView = useCallback(() => {
    return (
      <View>
        <TouchableOpacity
          disabled={onPressActive}
          style={[
            styles.loginView,
            {backgroundColor: ThemeManager.colors.iconBg},
          ]}
          onPress={() => (isSignedIn ? onPressApplyCard() : onPressLogin())}>
          <Text
            style={[styles.logintext, {color: ThemeManager.colors.textColor}]}>
            {!isSignedIn
              ? LanguageManager.loginRegister
              : kycStatus === 'UNDEFINED' || kycStatus === 'DENIED'
              ? 'Finish KYC'
              : userCards[0]?.additionalStatuses?.includes(
                  'ADDITIONAL_PERSONAL_INFO',
                )
              ? 'Pay Fee'
              : !detailsAdded
              ? LanguageManager.userDetails
              : kycStatus == 'UNDER_REVIEW'
              ? 'KYC Under Review'
              : !userCards[0]?.additionalStatuses?.includes(
                  'ADDITIONAL_PERSONAL_INFO',
                )
              ? 'Submit details'
              : LanguageManager.applytheCard}
          </Text>
        </TouchableOpacity>
        <View style={styles.cardTitleView}>
          <Text style={[styles.cardTitle]}>
            {!isSignedIn
              ? LanguageManager.unlockSavingWithClick
              : !detailsAdded ||
                kycStatus === 'UNDEFINED' ||
                kycStatus === 'DENIED'
              ? ''
              : LanguageManager.applyForCard}
          </Text>
          <Text style={[styles.cardSubTitle]}>
            {!isSignedIn
              ? LanguageManager.loginOrRegisterDiscription
              : !detailsAdded ||
                kycStatus === 'UNDEFINED' ||
                kycStatus === 'DENIED'
              ? ''
              : LanguageManager.applyCarddiscription}
          </Text>
        </View>
      </View>
    );
  }, [isSignedIn, detailsAdded, kycStatus, onPressActive, userCards,isCardActive,isLoading]);



  const renderAllCardCategory = useCallback(() => {
    if (isLoading) {
      return (
        <View>
          <ShimmerLoader style={styles.cardView} />
        </View>
      );
    }
    return (
      <FlatList
      data={!isCardActive && isSignedIn ?  welcomStep : []}
      style={{
        ...styles.welcomSecondView,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} tintColor={Colors.buttonColor1} />
      }
      ListHeaderComponent={()=>{
        return (
          <View style={{flex: 0.9, paddingTop: heightDimen(22)}}>
          <CardImageBgCom
            disabled={onPressActive}
            renderComponent={renderCardView}
            cardMainViewStyle={{marginTop: 0}}
            onPress={() => (isSignedIn ? onPressApplyCard() : onPressLogin())}
          />
        </View>
        )
      }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderStepData}
      extraData={welcomStep}
      ListFooterComponent={() => {
        return !isCardActive && isSignedIn ? (
          <View style={[styles.welcomStepView, {paddingHorizontal: 0}]}>
            {[
              {
                icon: Images.manage,
                text: LanguageManager.quickSetUpItsFree,
                rotation: '180deg',
              },
              {
                icon: Images.blueCrown,
                text: LanguageManager.exclusivEnjoyDiscription,
                rotation: '0deg',
              },
            ].map((item, index) => {

              return (
              <View
                key={index}
                style={{
                  ...styles.cardStyle,
                  backgroundColor: ThemeManager.colors.aliceBlue,
                }}>
                <FastImage
                  style={[
                    styles.manageIconStyle,
                    {transform: [{rotate: item.rotation}]},
                  ]}
                  source={item.icon}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.cardTextStyle,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {item.text}
                </Text>
              </View>
            )}
            )}
          </View>
        ):null;
      }}
    />

    );
  }, [
    isSignedIn,
    detailsAdded,
    isLoading,
    onPressActive,
    welcomStep,
    isCardActive

  ]);
  const renderStepData = useCallback(
    ({item, index}) => {

      return (
        <View style={styles.welcomStepView}>
          <View>
            {currentPosition == index ? (
              <View style={styles.indicatorStyle} />
            ) : null}
            <Text
              style={[
                styles.setpTitleStyle,
                {color: ThemeManager.colors.inActiveColor},
              ]}>{`${LanguageManager.step} ${index + 1}`}</Text>
            <Text
              style={[
                styles.setpTitleStyle,
                {color: ThemeManager.colors.textColor},
              ]}>
              {item?.title}
            </Text>
          </View>
          <View>
            {item.status == 'done' ? (
              <FastImage
                style={[
                  styles.likeIcon,
                  {
                    backgroundColor: ThemeManager.colors.bg,
                    zIndex: 1,
                  },
                ]}
                source={Images.circleBlueTick}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.inActiveIndicator} />
            )}
            <View
              style={{
                // borderStyle: item.status == 'done' ? 'solid' : Platform.OS =='android'? 'dashed':'solid',
                opacity: item.status == 'done' ? 1 : 0.5,
                height: index == welcomStep.length - 1 ? 0 : areaDimen(70),
                justifyContent: 'space-evenly',
                overflow: 'hidden',
                ...styles.indicatorLine,
              }}>
              {[...Array(6)].map(() => {
                return (
                  <View
                    style={{
                      backgroundColor: 'red',
                      height: item.status == 'done' ? '25%' : '5%',
                      zIndex: 1,
                      width: 1,
                      backgroundColor: Colors.buttonColor1,
                      bottom: 0,
                    }}
                  />
                );
              })}
            </View>
          </View>
        </View>
      );
    },
    [
      isSignedIn,
      detailsAdded,
      isLoading,
      onPressActive,
      welcomStep,
      isCardActive
    ],
  );
  return (
    <WrapperContainer>
      <SimpleHeader
        title={LanguageManager.saitaCard}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={()=>navigate(NavigationStrings.Dashboard)}
        history={isSignedIn}
        onPressHistory={() => {
          navigate(NavigationStrings.CardSetting, {userCards: userCards});
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <View style={{flex: 1}}>
        {isCardActive ? (
          <CardHome
            navigation={props.navigation}
            userCards={activeCards}
            initialCall={() => {
              initialCall(true);
            }}
            isLoading={isLoading || loader}
          />
        ) : (
          renderAllCardCategory()
        )}
      </View>
      <RechargeModule
        visible={showBottomSheet}
        onPressCloseSheet={onPressCloseSheet}
        userCards={userCards}
        onDeposit={onDeposit}
        onPressConfirm={selectedAccount => onPressConfirm(selectedAccount)}
        onPressActive={onPressActive}
      />
      {loader && <Loader />}
    </WrapperContainer>
  );
};

export default React.memo(SaitaCardDashBoard);
