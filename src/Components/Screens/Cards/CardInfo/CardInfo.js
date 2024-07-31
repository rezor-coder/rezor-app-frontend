import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AppState, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../../ThemeManager';
import * as Constants from '../../../../Constant';
import { cardDetailsCode, getCardDetails } from '../../../../Redux/Actions';
import Singleton from '../../../../Singleton';
import { Colors, Images } from '../../../../theme';
import { decryptionCard } from '../../../../utils';
import { areaDimen } from '../../../../Utils/themeUtils';
import { BorderLine, SimpleHeader } from '../../../common';
import CardImageBgCom from '../../../common/CardImageBgCom';
import OtpModal from '../../../common/OtpModal';
import Loader from '../../Loader/Loader';
import { styles } from './styles';
import { goBack } from '../../../../navigationsService';

const CardInfo = (props) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const [isLoading, setisLoading] = useState(false)
  const [cardData, setCardData] = useState(props.route.params.userCards[0])
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showCardDetail, setShowCardDetail] = useState(false)
  const [cardDetails, setCardDetails] = useState({
      cardNumber: props.route.params.userCards[0]?.number,
      cvv: '***',
      expire: props.route.params.userCards[0]?.expired,
      name: props.route.params.userCards[0]?.cardholderName,
      balance: '****'
  })
  console.log(props.route.params.userCards[0]?.expired,'props.route.params.userCards[0]?.expired,');
  useEffect(() => {
    AppState.addEventListener('change', state => {
      console.log(state, 'statestatestate');
      if (state === 'inactive' || state === 'background') {
        setShowOtpModal(false)
      }
    });
    props.navigation.addListener('focus', () => {
      setisLoading(false)
    })
    props.navigation.addListener('blur', () => {
      setisLoading(false)
      setShowOtpModal(false)
    })
  }, []);
  console.log(cardData,'setCardDatasetCardData');
  const onPressShowDetail = () => {
      if (showCardDetail) {
          setCardDetails({
              cardNumber: props.route.params.userCards[0]?.number,
              cvv: '***',
              expire: props.route.params.userCards[0]?.expired,
              name: props.route.params.userCards[0]?.cardholderName,
              balance: '****'
          })
          setShowCardDetail(!showCardDetail);
      } else {
          getCardDetailsCode()
      }

  };
  const getCardDetailsCode = () => {
      let data = {
          cardId: props.route.params.userCards[0]?.id,
          cardProgram: props.route.params.userCards[0]?.cardProgram,
      }
      setisLoading(true)
      dispatch(cardDetailsCode(data)).then(res => {
          setisLoading(false)
          setShowOtpModal(true)
          console.log("res::::::", res);
      }).catch(err => {
          setisLoading(false)
          console.log("err::::::", err);
      })
  }
  console.log("cardData::::::", cardData);
  const onContinueOTP = (code) => {
      setShowOtpModal(false)
      setisLoading(true)
      let data = {
          "code": code,
          "publicKey": Constants.CARD_PUBLIC_KEY,
          cardId: props.route.params.userCards[0]?.id,
          cardProgram: props.route.params.userCards[0]?.cardProgram,
      }
      dispatch(getCardDetails({ data })).then(async res => {
          console.log("res::::::::", res);
          let number = await decryptionCard(res.number)
          let cvv = await decryptionCard(res.cvv)
          let name = await decryptionCard(res.cardholderName)
          let expiry = await decryptionCard(res.expiry)
          let cardData = {
              cardNumber: number,
              cvv: cvv,
              expire: props.route.params.userCards[0]?.expired,
              name: name,
              balance: props.route.params.userCards[0].balance.value
          }
          console.log("cardData::::::::", cardData);
          setShowCardDetail(true)
          await setCardDetails(cardData)
          setisLoading(false)
      }).catch(async err => {
          setisLoading(false)
          Singleton.showAlert(err || LanguageManager.somethingWentWrong)
          console.log("err::::::", err);
      })
  }
  const renderCardView = () => {
    return (
      <View style={styles.cardInnerView}>
        <View style={[styles.flexRowJustify, {marginBottom: areaDimen(18)}]}>
          <View style={{flexDirection:'row',alignItems: 'center'}}>
            <Text style={styles.cardtitle}>{LanguageManager.cardNumber}</Text>
            <TouchableOpacity onPress={() => onPressShowDetail()}>
            <FastImage
              source={!showCardDetail ? Images.eyeClosed : Images.eyeOpened}
              style={styles.iconStyle}
              tintColor={Colors.white}
            />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardtitle}>{cardDetails.cardNumber}</Text>
        </View>

        <View style={[styles.flexRowJustify, {marginBottom: areaDimen(18)}]}>
          <Text style={styles.cardtitle}>{LanguageManager.cvv}</Text>
          <Text style={styles.cardtitle}>{cardDetails.cvv}</Text>
        </View>
        <View style={[styles.flexRowJustify, {marginBottom: areaDimen(18)}]}>
          <Text style={styles.cardtitle}>{LanguageManager.expired}</Text>
          <Text style={styles.cardtitle}>
            {moment(cardDetails.expire).format('MM/YY')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        ...styles.mainContainerStyle,
        backgroundColor: ThemeManager.colors.dashboardBg,
        paddingTop: insets.top,
      }}>
      <SimpleHeader
        title={LanguageManager.cardInfo}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          goBack();
        }}
      />
      {/* <View style={styles.borderLineStyle} /> */}
      <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={10}
        enableOnAndroid={true}
        bounces={true}
        contentContainerStyle={{paddingBottom: areaDimen(30)}}>
        <CardImageBgCom renderComponent={renderCardView} />
        <View style={styles.cardInfoDetailView}>
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>{LanguageManager.cardName}</Text>
            <Text style={styles.cardInfoSubTitle}>
            {cardData.cardCompany}
            </Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>{LanguageManager.cardtype}</Text>
            <Text style={styles.cardInfoSubTitle}>{cardData.cardType}</Text>
          </View>
          {/* <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.cardLevel}
            </Text>
            <Text style={styles.cardInfoSubTitle}>{'Platinum'}</Text>
          </View> */}
        </View>
        <View style={[styles.cardInfoDetailView, {marginTop: areaDimen(16)}]}>
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.cardholder}
            </Text>
            <Text style={styles.cardInfoSubTitle}>{cardData?.cardholderName}</Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.cardCurrency}
            </Text>
            <Text style={styles.cardInfoSubTitle}>{cardData?.balance?.currency}</Text>
          </View>
          {/* <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.cardLimitDaily}
            </Text>
            <Text style={styles.cardInfoSubTitle}>1,000.00 USDT</Text>
          </View> */}
          {/* <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.depositCap}
            </Text>
            <Text style={styles.cardInfoSubTitle}>no cap</Text>
          </View> */}
          {/* <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.applcationTime}
            </Text>
            <Text style={styles.cardInfoSubTitle}>2024-10-04, 15:01</Text>
          </View> */}
        </View>
      </KeyboardAwareScrollView>
      {!!showOtpModal && <OtpModal
        showOtpModal={showOtpModal}
        setShowOtpModal={() => setShowOtpModal(false)}
        onContinueOTP={onContinueOTP}
      />}
      {isLoading && <Loader />}
    </View>
  );
};

export default CardInfo;
