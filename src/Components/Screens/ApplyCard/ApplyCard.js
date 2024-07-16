import { isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { requestVaultCard } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, height } from '../../../Utils/themeUtils';
import { navigate } from '../../../navigationsService';
import { Colors, Images } from '../../../theme';
import { BorderLine, SimpleHeader } from '../../common';
import BlurBottomModal from '../../common/BlurBottomModal';
import CardImageBgCom from '../../common/CardImageBgCom';
import GradientButton from '../../common/GradientButton';
import WraperContainer from '../../common/WraperContainer';
import { styles } from './styles';

const ApplyCard = ({navigation}) => {
  const refCarousel = useRef();
  const insets = useSafeAreaInsets();
  const {cardUserDetail} = useSelector(state=>state?.saitaCardReducer)
  console.log('cardUserDetail::::',cardUserDetail);
  const [activeIndex, setActiveIndex] = useState(0);
  const [choosecardArray, setChooseCardArray] = useState([
    {
      title: 'Muse Card',
      cardType: 'USDT Physical Card',
      topUpFeeTitle: 'Top Up Fee(0%)',
      cardCategory: 'Platinum',
      kyc: 'KYC L1',
      id: 1,
      cardType: 'PHYSICAL',
      cardDesignId: 'BLACK',
    },
    {
      title: 'Paytend USDT Virtual Card',
      cardType: 'USDT Virtual Card',
      topUpFeeTitle: 'Top Up Fee(0%) Lowest Fee in EEA',
      cardCategory: 'Platinum',
      kyc: 'KYC L1',
      cardType: 'VIRTUAL',
      id: 2,
      cardDesignId: 'BLUE',
    },
  ]);
  const [restrictedCountries, setRestrictedCountries] = useState([
    'Cuba',
    'North Korea (DPRK)',
    'Congo',
    'Central African',
    'Myanmar (Burma)',
  ]);
  const [selectedCard, setSelectedCard] = useState({});
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [onPressActive, setPressActive] = useState(false);
  const [isLoading,setIsLoading]= useState(false);

  const onPressCloseSheet = () => {
    setShowBottomSheet(false);
  };

  const onPressNext = () => {
    // requestVaultCard()
    setShowBottomSheet(true)
    // setShowBottomSheet(true);
  };

  const onPressConfirm = () => {
    setShowBottomSheet(false);
    setPressActive(true);
    setTimeout(() => {
      setPressActive(false);
    }, 200);
    navigate(NavigationStrings.DepositScreen);
  };

  const onPressSelectedCard = item => {
    setIsLoading(true);
    let data = {
      cardType: item?.cardType,
      cardDesignId: item?.cardDesignId,
    };
    console.log('data:::::::', data);
    requestVaultCard({data, token: cardUserDetail?.access_token})
      .then(res => {
        console.log('res1111', res);
        setSelectedCard(item);
        setIsLoading(false);
      })
      .catch(error => {
        console.log('res1111', error);
        setIsLoading(false);
        Singleton.showAlert(error?.message);
      });
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
            item.id == 2
              ? [Colors.royalBlue, Colors.midnightBlue]
              : [Colors.blackLight, Colors.lightGrey]
          }>
          <Text style={styles.cardBrand}>{item.cardCategory}</Text>
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
    <WraperContainer isLoading={isLoading}>
      <SimpleHeader
        title={LanguageManager.applytheCard}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          if (!isEmpty(selectedCard)) {
            setSelectedCard({});
            return;
          }
          navigation.goBack();
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
                cardImage={item.id == 2 ? Images.bluecardImage : Images.cardBg}
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
              paddingBottom: areaDimen(100),
            }}>
            <View style={[styles.flexRow, {paddingHorizontal: areaDimen(22)}]}>
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
            </View>
            <CardImageBgCom
              renderComponent={() => renderCardType(selectedCard)}
              cardImage={
                selectedCard.id == 2 ? Images.bluecardImage : Images.cardBg
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
                  USDT
                </Text>
              </View>
              <View style={styles.borderLine} />
              <View
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
              </View>
              <View style={styles.borderLine} />
              <View
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
              <View style={styles.borderLine} />
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
                  {'400.0 USDT'}
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
      <BlurBottomModal
        visible={showBottomSheet}
        modalHeight={height / 3}
        onPressCloseSheet={onPressCloseSheet}>
        <View
          style={{
            paddingHorizontal: areaDimen(22),
            paddingVertical: areaDimen(18),
          }}>
          {applyFeeView()}
        </View>
      </BlurBottomModal>
    </WraperContainer>
  );
};

export default ApplyCard;
