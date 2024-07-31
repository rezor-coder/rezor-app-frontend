import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LanguageManager, ThemeManager} from '../../../../../ThemeManager';
import {areaDimen, height, heightDimen, width, widthDimen} from '../../../../Utils/themeUtils';
import {Colors, Fonts, Images} from '../../../../theme';
import {BorderLine, Inputtext, SimpleHeader} from '../../../common';
import CardImageBgCom from '../../../common/CardImageBgCom';
import {styles} from './styles';
import LinearGradient from 'react-native-linear-gradient';
import BlurBottomModal from '../../../common/BlurBottomModal';
import GradientButton from '../../../common/GradientButton';
import TextInputWithLabel from '../../../common/TextInputWithLabel';
import Slider from 'react-native-slider';
import { isEmpty } from 'lodash';
import { Alert } from 'react-native';

const CardManage = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [cardCategory, setCardCategory] = useState([
    {titile: LanguageManager.replace, icon: Images.replaceCard},
    {titile: LanguageManager.setLimit, icon: Images.dailyLimit},
    {titile: LanguageManager.lockcard, icon: Images.lockCard},
    {titile: LanguageManager.changePin, icon: Images.pinLock},
  ]);

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [replaceReason, setReplaceReason] = useState([
    {title: LanguageManager.itsLostOrStolen, id: 1},
    {title: LanguageManager.itsDamaged, id: 2},
  ]);
  const [atmPin, setAtmPin] = useState();
  const [confirmAtmPin, setConfirmAtmPin] = useState();
  const [showAtmPin, setShowAtmPin] = useState(false);
  const [showConfirmAtmPin, setConfirmShowAtmPin] = useState(false);
  const [selectedReplaceReason, setSelectedReplaceReason] = useState();
  const [selectedRange, setSelectedRange] = useState(0);

  const onPressCategory = type => {
    switch (type.trim()) {
      case LanguageManager.replace.trim():
        setShowBottomSheet(true);
        setSelectedSheet('replace');
        break;
      case LanguageManager.setLimit.trim():
        setShowBottomSheet(true);
        setSelectedSheet('setLimit');
        break;
      case LanguageManager.lockcard.trim():
        setShowBottomSheet(true);
        setSelectedSheet('lockCard');
        break;
      case LanguageManager.changePin.trim():
        setShowBottomSheet(true);
        setSelectedSheet('changePin');
        break;
      default:
        break;
    }
  };
  const onPressCloseSheet = () => {
    setShowBottomSheet(false);
    setSelectedSheet(undefined);
  };
  const renderCardView = useCallback(() => {
    return (
      <CardImageBgCom
        renderComponent={() => (
          <View style={styles.cardInnerView}>
            <Text style={styles.cardName}>{LanguageManager.groupServiceMainProduct}</Text>
            <Text style={styles.cardNumber}>**** **** **** 0987</Text>
            <LinearGradient
              style={styles.gradientView}
              colors={[Colors.blackLight, Colors.lightGrey]}>
              <Text style={styles.cardBrand}>Platinum</Text>
            </LinearGradient>
          </View>
        )}
      />
    );
  }, [cardCategory]);
  const renderCategoryView = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.categoryView}
        onPress={() => onPressCategory(item.titile)}>
        <FastImage
          source={item.icon}
          style={styles.categoryIconStyle}
          resizeMode="contain"
          tintColor={ThemeManager.colors.primary}
        />
        <Text style={styles.categoryTextStyle}>{item.titile}</Text>
      </TouchableOpacity>
    );
  };
  const rederFooterComponent = () => {
    return (
      <View>
        <View style={styles.cardInfoDetailView}>
          <Text
            style={[
              styles.cardInfoText,
              {color: ThemeManager.colors.textColor},
            ]}>
            {LanguageManager.platinumFee}
          </Text>
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.applyFee}
            </Text>
            <Text
              style={[
                styles.cardInfoSubTitle,
                {color: ThemeManager.colors.textColor},
              ]}>
              0.1 USDT
            </Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>{LanguageManager.topUpFee}</Text>
            <Text
              style={[
                styles.cardInfoSubTitle,
                {color: ThemeManager.colors.textColor},
              ]}>
              0%
            </Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.annualFee}
            </Text>
            <Text
              style={[
                styles.cardInfoSubTitle,
                {color: ThemeManager.colors.textColor},
              ]}>
              1.00 USDT
            </Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>{LanguageManager.kycFee}</Text>
            <Text
              style={[
                styles.cardInfoSubTitle,
                {color: ThemeManager.colors.textColor},
              ]}>
              0.00 USDT
            </Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.monthlyFee}
            </Text>
            <Text
              style={[
                styles.cardInfoSubTitle,
                {color: ThemeManager.colors.textColor},
              ]}>
              0.00 USDT
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.faqView,
            {backgroundColor: ThemeManager.colors.lightBlue2},
          ]}>
          <Text
            style={[
              styles.cardInfoText,
              {marginHorizontal: 0, color: ThemeManager.colors.textColor},
            ]}>
            {LanguageManager.faq}
          </Text>
          <View style={[styles.flexRow, {marginBottom: areaDimen(20)}]}>
            <Text
              style={[styles.faqText, {color: ThemeManager.colors.textColor}]}>
              {LanguageManager.howToTopUp}
            </Text>
            <TouchableOpacity>
              <FastImage
                source={Images.rightCircleArrow}
                style={styles.rightArrowStyle}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.flexRow}>
            <Text
              style={[styles.faqText, {color: ThemeManager.colors.textColor}]}>
              {LanguageManager.howToActivateCard}
            </Text>
            <TouchableOpacity>
              <FastImage
                source={Images.rightCircleArrow}
                style={styles.rightArrowStyle}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const replaceCardView = () => {
    return (
      <View>
        <Text
          style={[
            styles.replaceCardTitle,
            {color: ThemeManager.colors.textColor},
          ]}>
          {LanguageManager.replaceYourCard}
        </Text>
        <Text style={styles.replaceReson}>
          {LanguageManager.reasonToReplace}
        </Text>
        {replaceReason.map(item => {
          return (
            <TouchableOpacity
              style={{
                ...styles.replaceResonTextView,
                backgroundColor:
                  item.id == selectedReplaceReason
                    ? ThemeManager.colors.lightBlue2
                    : Colors.lightGray2,
              }}
              onPress={() => setSelectedReplaceReason(item.id)}>
              <Text
                style={{
                  color:
                    item.id == selectedReplaceReason
                      ? ThemeManager.colors.textColor
                      : ThemeManager.colors.viewBorderColor,
                  ...styles.replaceResonTitle,
                }}>
                {item.title}
              </Text>
              {item.id == selectedReplaceReason ? (
                <FastImage
                  source={Images.blueTick}
                  style={styles.blueTickIcon}
                  resizeMode="contain"
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
        <GradientButton
          title={LanguageManager.proceedToReplace}
          buttonStyle={styles.buttonView}
        />
      </View>
    );
  };
  const lockCardView = () => {
    return (
      <View>
        <FastImage
          source={Images.circleCardLock}
          style={styles.cardLockImageStyle}
          resizeMode="contain"
        />
        <Text style={[styles.cardLockTitle,{ color: ThemeManager.colors.textColor,}]}>
          {LanguageManager.areYorSureWantToLockYourCard}
        </Text>
        <Text style={styles.cardLockSubTitle}>
          {LanguageManager.lockedCardWarning}
        </Text>
   
        <GradientButton
          title={LanguageManager.confirm}
          buttonStyle={styles.buttonView}
        />
      </View>
    );
  };
  const changePinView = () => {
    return (
      <View>
        <Text
          style={[
            styles.setAtmPinText,
            {color: ThemeManager.colors.textColor},
          ]}>
          {LanguageManager.setAtmPin}
        </Text>
        <Text style={styles.setAtmPinDiscriptionText}>
          {LanguageManager.atmPinDiscription}
        </Text>
        <TextInputWithLabel
          label={LanguageManager.enterTheNewPic}
          placeHolder={LanguageManager.pleaseEnter}
          value={atmPin}
          keyboardType={'numeric'}
          onChangeText={value => setAtmPin(value)}
          onPressRightIcon={() => setShowAtmPin(!showAtmPin)}
          rightIcon={!!showAtmPin ? Images.eyeOpened : Images.eyeClosed}
          secureTextEntry={!showAtmPin}
        />
        <TextInputWithLabel
          label={LanguageManager.confirmYourNewPin}
          placeHolder={LanguageManager.pleaseEnter}
          value={confirmAtmPin}
          keyboardType={'numeric'}
          onChangeText={value => setConfirmAtmPin(value)}
          onPressRightIcon={() => setConfirmShowAtmPin(!showConfirmAtmPin)}
          rightIcon={!!showConfirmAtmPin ? Images.eyeOpened : Images.eyeClosed}
          secureTextEntry={!showConfirmAtmPin}
          labelStyle={{marginTop: areaDimen(10)}}
        />
        <GradientButton
          title={LanguageManager.confirm}
          buttonStyle={styles.buttonView}
        />
      </View>
    );
  };
  const onChangeText = value => {
    var reg = /^-?\d+\.?\d*$/;
    if(isEmpty(value) && typeof value === 'string'){
      setSelectedRange(0)
      // Alert.alert('1')
    }else if (reg.test(value)) {
      let text = Number(value);
      // Alert.alert('2')
      setSelectedRange(text.toFixed(0));
    }
  };
  console.log(typeof selectedRange,'asfdaswd');

  const setLimitView = () => {
    return (
      <View>
        <Text
          style={[
            styles.spendLimitText,
            ,
            {color: ThemeManager.colors.textColor},
          ]}>
          {LanguageManager.spendingLimit}{' '}
          <Text style={{fontSize: areaDimen(12)}}>
            {' '}
            {LanguageManager.usdtEquivalent}
          </Text>
        </Text>
        <TextInputWithLabel
          label={LanguageManager.dailySependingLimit}
          placeHolder={LanguageManager.pleaseEnter}
          value={`${selectedRange}`}
          keyboardType={'numeric'}
          onChangeText={onChangeText}
          maxLength={6}
          labelStyle={{marginTop: areaDimen(10)}}
        />
        <Slider
          minimumValue={0}
          maximumValue={500000}
          minimumTrackTintColor={ThemeManager.colors.primary}
          maximumTrackTintColor={ThemeManager.colors.inputBorderColor}
          thumbTintColor={Colors.buttonColor1}
          value={Number(selectedRange)}
          thumbStyle={{borderWidth:areaDimen(2),height:areaDimen(16),width:areaDimen(16),borderColor:ThemeManager.colors.textColor}}
          onValueChange={onChangeText}
         
        />
        <View style={styles.flexRow}>
          {['0', '125000', '250000', '375000', '500000'].map(item => {
            return <Text style={styles.rangeTextStyle}>{item}</Text>;
          })}
        </View>
        <Text style={styles.subTextStyle}>
          {LanguageManager.dailyLimitDiscription}
        </Text>
        <GradientButton
          title={LanguageManager.confirm}
          buttonStyle={styles.buttonView}
        />
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
        title={LanguageManager.manage}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          navigation.goBack();
        }}
      />
      {/* <View style={styles.borderLineStyle} /> */}
      <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />
      <FlatList
        data={cardCategory}
        numColumns={4}
        ListHeaderComponent={renderCardView}
        columnWrapperStyle={styles.categoryMainView}
        renderItem={renderCategoryView}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={rederFooterComponent}
      />
        <BlurBottomModal
          visible={showBottomSheet}
          modalHeight={
            selectedSheet == 'changePin' || selectedSheet == 'setLimit'
              ? height/2.4
              : height/3
          }
          onPressCloseSheet={onPressCloseSheet}>
          <View
            style={{
              paddingHorizontal: areaDimen(22),
              paddingVertical: areaDimen(18),
            }}>
            {selectedSheet == 'replace'
              ? replaceCardView()
              : selectedSheet == 'lockCard'
              ? lockCardView()
              : selectedSheet == 'changePin'
              ? changePinView()
              : selectedSheet == 'setLimit'
              ? setLimitView()
              : null}
          </View>
        </BlurBottomModal>
    </View>
  );
};

export default CardManage;
