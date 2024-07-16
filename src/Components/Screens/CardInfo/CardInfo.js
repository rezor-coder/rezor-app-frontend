import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {areaDimen} from '../../../Utils/themeUtils';
import {BorderLine, SimpleHeader} from '../../common';
import CardImageBgCom from '../../common/CardImageBgCom';
import {styles} from './styles';

const CardInfo = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [cardInfoData, setCardInfoData] = useState({});

  const renderCardView = () => {
    return (
      <View style={styles.cardInnerView}>
        <View style={[styles.flexRowJustify, {marginBottom: areaDimen(18)}]}>
          <Text style={styles.cardtitle}>Card Number</Text>
          <Text style={styles.cardtitle}>**** **** **** 0987</Text>
        </View>

        <View style={[styles.flexRowJustify, {marginBottom: areaDimen(18)}]}>
          <Text style={styles.cardtitle}>CVV</Text>
          <Text style={styles.cardtitle}>***</Text>
        </View>
        <View style={[styles.flexRowJustify, {marginBottom: areaDimen(18)}]}>
          <Text style={styles.cardtitle}>Expired</Text>
          <Text style={styles.cardtitle}>**/****</Text>
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
          navigation.goBack();
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
              Group Service main Product
            </Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>{LanguageManager.cardtype}</Text>
            <Text style={styles.cardInfoSubTitle}>Physical Card</Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.cardLevel}
            </Text>
            <Text style={styles.cardInfoSubTitle}>Platinum</Text>
          </View>
        </View>
        <View style={[styles.cardInfoDetailView, {marginTop: areaDimen(16)}]}>
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.cardholder}
            </Text>
            <Text style={styles.cardInfoSubTitle}>Cillian Murphy</Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.cardCurrency}
            </Text>
            <Text style={styles.cardInfoSubTitle}>USDT</Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.cardLimitDaily}
            </Text>
            <Text style={styles.cardInfoSubTitle}>1,000.00 USDT</Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.depositCap}
            </Text>
            <Text style={styles.cardInfoSubTitle}>no cap</Text>
          </View>
          <View style={styles.borderLine} />
          <View
            style={[styles.flexRowJustify, {paddingHorizontal: areaDimen(12)}]}>
            <Text style={styles.cardInfoTitle}>
              {LanguageManager.applcationTime}
            </Text>
            <Text style={styles.cardInfoSubTitle}>2024-10-04, 15:01</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CardInfo;
