import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../../ThemeManager';
import { NavigationStrings } from '../../../../Navigation/NavigationStrings';
import { createCardWallets, getCardPrices, getVaultSettings, requestNewCard } from '../../../../Redux/Actions';
import Singleton from '../../../../Singleton';
import { areaDimen } from '../../../../Utils/themeUtils';
import { navigate } from '../../../../navigationsService';
import { Colors, Images } from '../../../../theme';
import { BorderLine, SimpleHeader } from '../../../common';
import CardImageBgCom from '../../../common/CardImageBgCom';
import GradientButton from '../../../common/GradientButton';
import WrapperContainer from '../../../common/WrapperContainer';
import { styles } from './styles';

const ApplyCard = ({navigation}) => {
  const dispatch = useDispatch()
  const {cardUserDetail} = useSelector(state=>state?.saitaCardReducer)
  console.log('cardUserDetail::::',cardUserDetail);
  const [choosecardArray, setChooseCardArray] = useState([
    {
      title: 'VISA Card',
      topUpFeeTitle: '',
      cardCategory: 'BLACK',
      kyc: '',
      id: 1,
      cardType: 'VIRTUAL',
      cardDesignId: 'BLACK',
    },
    // {
    //   title: 'VISA Card',
    //   topUpFeeTitle: '',
    //   cardCategory: 'GOLD',
    //   kyc: '',
    //   id: 2,
    //   cardType: 'VIRTUAL',
    //   cardDesignId: 'GOLD',
    // },
  ]);
  const [restrictedCountries, setRestrictedCountries] = useState([
    'Abkhazia', 'Afghanistan', 'Albania', 'Barbados', 'Botswana', 'Cambodia', 'Crimea', 'Cuba',
    'Donetsk National Republic (DNR)', 'Gaza Strip', 'Haiti', 'Iran', 'Iraq', 'Jamaica', 'Kashmir',
    'Libya', 'Luhansk National Republic (LNR)', 'Mongolia', 'Myanmar', 'Nagorno Karabakh',
    'Netherlands (the)', 'Nicaragua', 'North Korea (Democratic People\'s Republic of Korea)', 'Pakistan',
    'Palestine', 'Senegal', 'Russia', 'Somalia', 'South Ossetia', 'South Sudan', 'Syria',
    'Trinidad and Tobago', 'Uganda', 'Vanuatu', 'West Bank', 'Yemen'
  ]);
  const [selectedCard, setSelectedCard] = useState({});
  const [onPressActive, setPressActive] = useState(false);
  const [isLoading,setIsLoading]= useState(false);
  useEffect(() => {
    initialCall()
  }, [])
  const initialCall = () => {
    setIsLoading(true)
    getCardPrices().then(res => {
      console.log("res::::::::::", res);
      let obj = res?.prices?.find(price => price?.cardDesignId == 'BLACK')
      setSelectedCard(obj)
    }).catch(err => {
      console.log("err::::::::::", err);
    })
    getVaultSettings().then(res=>{
      console.log(res,'res?.data?.WALLETS_TO_CREATE');
      dispatch(createCardWallets({ data:{ currencies : res?.WALLETS_TO_CREATE} })).then(res => {
        setIsLoading(false)
        console.log("res:::::::createCardWallets", res);
      }).catch(err => {
        setIsLoading(false)
        console.log("err:::::::createCardWallets", err);
      })
    })
    
  }


  const onPressNext = () => {
    setIsLoading(true);
    let data = {
      cardType:  selectedCard.cardType,
      cardDesignId: selectedCard.cardDesignId,
    };
    dispatch(requestNewCard({data}))
      .then(res => {
        setIsLoading(false);
        console.log('res::::::::::', res);
        navigate(NavigationStrings.AfterApplyDetails, {
          card: {cardRequestId: res.id, cardProgram: 'CP_2'},
        });
      })
      .catch(err => {
        setIsLoading(false);
        Singleton.showAlert(err)
        console.log('err::::::::::', err);
      });
  };

  const onPressConfirm = () => {
    setPressActive(true);
    setTimeout(() => {
      setPressActive(false);
    }, 200);
    navigate(NavigationStrings.DepositScreen);
  };

  const onPressSelectedCard = item => {
    // getCardPrices().then(res => {
    //   console.log("res::::::::::", res);
    // }).catch(err => {
    //   console.log("err::::::::::", err);
    // })
    setSelectedCard(item);
  };
  

  const renderCardHeader = () => {
    return (
      <Text
        style={[
          styles.headerTextStyle,
          
          {color: ThemeManager.colors.textColor,  paddingLeft:areaDimen(24),},
        ]}>
        {LanguageManager.chooseCard}
      </Text>
    );
  };

  const renderCardType = item => {
    return (
      <View style={styles.cardInnerView}>
        <Text style={styles.kycTitleStyle}>{item?.kyc}</Text>
        <Text style={styles.cardName}>{item.title}</Text>
        <Text style={[styles.carSubtitle, {marginBottom: areaDimen(10)}]}>
          {item.cardType}
        </Text>
        <Text style={styles.carSubtitle}>{item.topUpFeeTitle}</Text>
        <LinearGradient
          style={styles.gradientView}
          colors={
            item.cardDesignId == 'BLUE'
              ? [Colors.royalBlue, Colors.midnightBlue]
              : [Colors.blackLight, Colors.lightGrey]
          }>
          <Text style={styles.cardBrand}>{item.cardDesignId}</Text>
        </LinearGradient>
      </View>
    );
  };

  const applyFeeView = () => {
    return (
      <View>
        <FastImage
          source={Images.circleAddWallet}
          style={styles.cardLockImageStyle}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.cardLockTitle,
            ,
            {color: ThemeManager.colors.textColor},
          ]}>
          {`${LanguageManager.applyFee}: 400.0 USDT`}
        </Text>
        <Text style={styles.cardLockSubTitle}>
          {LanguageManager.insufficientBalance}
        </Text>

        <GradientButton
          onPress={onPressConfirm}
          disabled={onPressActive}
          title={LanguageManager.goToRecharge}
          buttonStyle={styles.goToRechargeButton}
        />
      </View>
    );
  };

  return (
    <WrapperContainer isLoading={isLoading}>
      <SimpleHeader
        title={LanguageManager.applytheCard}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          // if (!isEmpty(selectedCard)) {
          //   setSelectedCard({});
          //   return;
          // }
          navigate(NavigationStrings.SaitaCardDashBoard);
        }}
      />
      {/* <View style={styles.borderLineStyle} /> */}
      <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />

      {isEmpty(selectedCard) ? (
        <FlatList
          data={choosecardArray}
          renderItem={({item}) => {
            return (
              <CardImageBgCom
                renderComponent={() => renderCardType(item)}
                cardImage={ item.cardDesignId == 'BLUE' ? Images.bluecardImage : Images.cardBg}
                cardMainViewStyle={{marginTop: 0}}
                onPress={()=>onPressSelectedCard(item)}
              />
            );
          }}
          ListHeaderComponent={renderCardHeader}
          style={styles.listMainStyle}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <View style={{height: areaDimen(12)}} />
          )}
        />
      ) : (
        <View style={{flex: 1}}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flexGrow: 1,
              // paddingHorizontal: areaDimen(22),
            }}
            contentContainerStyle={{
              paddingBottom: areaDimen(150),
              marginTop:areaDimen(16),

            }}>
            {/* <View style={[styles.flexRow, {paddingHorizontal: areaDimen(22)}]}>
              <Text
                style={[
                  styles.selectedCardText,
                  {
                    fontSize: areaDimen(16),
                    color: ThemeManager.colors.textColor,
                  },
                ]}>
                {LanguageManager.selectCardType}
              </Text>
              <Text style={styles.selectedCardText}>
                {LanguageManager.alreadyHaveACard}
              </Text>
            </View> */}
            <CardImageBgCom
              renderComponent={() => renderCardType(selectedCard)}
              cardImage={
                selectedCard.cardDesignId == 'BLUE' ? Images.bluecardImage : Images.cardBg
              }
              cardMainViewStyle={{marginTop: 0}}
            />
            <View
              style={[
                styles.applicationRequiredView,
                {backgroundColor: ThemeManager.colors.lightBlue2},
              ]}>
              <Text
                style={[
                  styles.applicationRequiredTitle,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {LanguageManager.applicationRequirements}
              </Text>
              <View style={styles.flexRowWrap}>
                <View style={styles.dotStyle} />
                <Text
                  style={[
                    styles.applicationRequiredText,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {LanguageManager.appliactionMustBe}
                </Text>
              </View>
              <View style={styles.flexRowWrap}>
                <View style={styles.dotStyle} />
                <Text
                  style={[
                    styles.applicationRequiredText,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {LanguageManager.kycDocumentType}
                  <Text style={{color: Colors.buttonColor1}}>
                    {' '}
                    {LanguageManager.documentsName}
                  </Text>
                </Text>
              </View>
              <View style={styles.flexRowWrap}>
                <View style={styles.dotStyle} />
                <Text
                  style={[
                    styles.applicationRequiredText,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {LanguageManager.eachDocumentCanApplyOneCard}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.restrictedCountriesMainView,
                {backgroundColor: ThemeManager.colors.lightRedColor},
              ]}>
              <Text
                style={[
                  styles.restrictedCountriesTitle,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {LanguageManager.restrictedCountries}
              </Text>
              <View style={styles.flexRowWrap}>
                {restrictedCountries.map(item => {
                  return (
                    <View
                      style={[
                        {backgroundColor: ThemeManager.colors.cottonCandyPink},
                        styles.restricedView,
                      ]}>
                      <Text
                        style={[
                          styles.restrictedCountriesText,
                          {color: ThemeManager.colors.textColor},
                        ]}>
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.cardInfoDetailView}>
              <Text
                style={[
                  styles.cardInfoText,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {LanguageManager.platinumCardInfo}
              </Text>
              <View
                style={[
                  styles.flexRowJustify,
                  {paddingHorizontal: areaDimen(12)},
                ]}>
                <Text style={styles.cardInfoTitle}>
                  {LanguageManager.cardtype}
                </Text>
                <Text
                  style={[
                    styles.cardInfoSubTitle,
                    {color: ThemeManager.colors.textColor,textTransform:'capitalize'},
                  ]}>
                  {selectedCard?.cardType}
                </Text>
              </View>
              <View style={styles.borderLine} />
              <View
                style={[
                  styles.flexRowJustify,
                  {paddingHorizontal: areaDimen(12)},
                ]}>
                <Text style={styles.cardInfoTitle}>
                  {LanguageManager.cardCurrency}
                </Text>
                <Text
                  style={[
                    styles.cardInfoSubTitle,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {selectedCard?.currency}
                </Text>
              </View>
              <View style={styles.borderLine} />
              {/* <View
                style={[
                  styles.flexRowJustify,
                  {paddingHorizontal: areaDimen(12)},
                ]}>
                <Text style={styles.cardInfoTitle}>
                  {LanguageManager.cardLimitDaily}
                </Text>
                <Text
                  style={[
                    styles.cardInfoSubTitle,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {'500,000.00 USDT'}
                </Text>
              </View> */}
              {/* <View style={styles.borderLine} /> */}
              {/* <View
                style={[
                  styles.flexRowJustify,
                  {paddingHorizontal: areaDimen(12)},
                ]}>
                <Text style={styles.cardInfoTitle}>
                  {LanguageManager.depositCap}
                </Text>
                <Text
                  style={[
                    styles.cardInfoSubTitle,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {'No Cap'}
                </Text>
              </View>
              <View style={styles.borderLine} /> */}
              <View
                style={[
                  styles.flexRowJustify,
                  {paddingHorizontal: areaDimen(12)},
                ]}>
                <Text style={styles.cardInfoTitle}>
                  {LanguageManager.applyFee}
                </Text>
                <Text
                  style={[
                    styles.cardInfoSubTitle,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                 {selectedCard?.price} {selectedCard?.currency}
                </Text>
              </View>
            </View>
          </KeyboardAwareScrollView>

          <GradientButton
            onPress={onPressNext}
            disabled={onPressActive}
            title={LanguageManager.next}
            buttonStyle={styles.buttonView}
          />
        </View>
      )}
    </WrapperContainer>
  );
};

export default ApplyCard;
