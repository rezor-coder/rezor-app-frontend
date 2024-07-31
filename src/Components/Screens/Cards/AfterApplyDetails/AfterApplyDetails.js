import {View, Text, Image, TouchableOpacity, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import styles from './AfterApplyDetailsStyles';
import {LanguageManager, ThemeManager} from '../../../../../ThemeManager';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {Colors, Images} from '../../../../theme';
import {
  addAdditionalInfo,
  addAddressForCardReq,
  getCountryCodes,
} from '../../../../Redux/Actions';
import {InputCustomWithQrButton} from '../../../common/InputCustomWithQrButton';
import {areaDimen, heightDimen, widthDimen} from '../../../../Utils/themeUtils';
import GradientButton from '../../../common/GradientButton';
import Loader from '../../Loader/Loader';
import CountryCodes from '../../CountryCodes/CountryCodes';
import WrapperContainer from '../../../common/WrapperContainer';
import TextInputWithLabel from '../../../common/TextInputWithLabel';
import {BorderLine, SimpleHeader} from '../../../common';
import {goBack, navigate} from '../../../../navigationsService';
import Singleton from '../../../../Singleton';
import { NavigationStrings } from '../../../../Navigation/NavigationStrings';
const AfterApplyDetails = props => {
  const { card } = props.route.params
  console.log(card,'cardcardcard');
  const dispatch = useDispatch();
  const [country, setCountry] = useState('');
  const [documentCountry, setDocumentCountry] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [postalCode, setPotalCode] = useState('');
  const [taxId, setTaxId] = useState('');
  const [taxCountry, setTaxCountry] = useState('');
  const [isUsRelated, setIsUsRelated] = useState(false);
  const [name, setName] = useState(false);
  const [title, setTitle] = useState('');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disableTopDetails, setDisableTopDetails] = useState(card?.additionalStatuses?.includes('ADDRESS') ? true : false)
  console.log(disableTopDetails,'dfaedf');
  useEffect(() => {
      getCountryCodesData()
  }, [])
  const getCountryCodesData = async () => {
    dispatch(getCountryCodes()).then((res)=>{
      let newArray = res.data?.map(item=> {return{
        name:item?.english,
        iso_3166_alpha3:item?.iso_3166_alpha3,
        dial_code:item?.mobile_area_code,
        code:item?.iso_3166_alpha3
      }})
      console.log(res.data,'newArraynewArraynewArraynewArray');
      setCountryList(newArray);

    }).catch(error=>{
      setIsLoading(false);
      console.log('countryCode::::err:', error);
      Singleton.showAlert(error);
    })
};
const onPressSubmit = () => {
  if (!disableTopDetails) {
    if (name == '') {
      Singleton.showAlert(LanguageManager.pleaseEnterValidName);
      return;
    }
    if (country == '') {
      Singleton.showAlert(LanguageManager.pleaseSelectCountry);
      return;
    }
    if (documentCountry == '') {
      Singleton.showAlert(LanguageManager.pleaseSelectDocumentCountry);
      return;
    }
    if (city == '') {
      Singleton.showAlert(LanguageManager.pleaseEnterCity);
      return;
    }
    if (city?.length <= 2) {
      Singleton.showAlert(LanguageManager.pleaseEnterValidCity);
      return;
    }
    if (state == '') {
      Singleton.showAlert(LanguageManager.pleaseEnterState);
      return;
    }
    if (state?.length <= 2) {
      Singleton.showAlert(LanguageManager.pleaseEnterValidState);
      return;
    }
    if (address == '') {
      Singleton.showAlert(LanguageManager.pleaseEnterAddress1);
      return;
    }
    if (address?.length <= 2) {
      Singleton.showAlert(LanguageManager.pleaseEnterValidAddress1);
      return;
    }
    if (address2 == '') {
      Singleton.showAlert(LanguageManager.pleaseEnterAddress2);
      return;
    }
    if (address2?.length <= 2) {
      Singleton.showAlert(LanguageManager.pleaseEnterValidAddress2);
      return;
    }
    if (postalCode == '') {
      Singleton.showAlert(LanguageManager.pleaseEnterPostalCode);
      return;
    }
    if (postalCode?.length < 6) {
      Singleton.showAlert(LanguageManager.pleaseEnterValidPostalCode);
      return;
    }

    let data = {
      country: country?.iso_3166_alpha3,
      documentCountry: documentCountry?.iso_3166_alpha3,
      city: city,
      state: state,
      address: address,
      address2: address2,
      postalCode: postalCode,
      cardholderName: name,
      id: props.route.params.card.cardRequestId,
      cp: props.route.params.card.cardProgram,
    };
    setIsLoading(true);
    dispatch(addAddressForCardReq({data}))
      .then(res => {
        console.log('addAddressForCardReq:::::::::res', res);
        setDisableTopDetails(true);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        Singleton.showAlert(
          err || LanguageManager.somethingWentWrong,
        );

        console.log('addAddressForCardReq:::::::::err', err);
      });
  } else {
    if (taxId == '') {
      Singleton.showAlert(LanguageManager.pleaseEnterTaxID);
      return;
    }
    if (taxCountry == '') {
      Singleton.showAlert(LanguageManager.pleaseEnterTaxID);
      return;
    }

    let data = {
      taxId: taxId,
      taxCountry: taxCountry?.iso_3166_alpha3,
      isUsRelated: isUsRelated,
    };
    setIsLoading(true);
    dispatch(addAdditionalInfo({data},props.route.params.card.cardProgram))
      .then(res => {
        setIsLoading(false);
        console.log('addAdditionalInfo:::::::::res', res);
       navigate(NavigationStrings.SaitaCardDashBoard)
      })
      .catch(err => {
        setIsLoading(false);
        Singleton.showAlert(err);
        console.log('addAdditionalInfo:::::::::err', err);
      });
  }
};
  return (
    <WrapperContainer>
      <SimpleHeader
        title={'Submit details'}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          navigate(NavigationStrings.SaitaCardDashBoard)
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <KeyboardAwareScrollView
        automaticallyAdjustKeyboardInsets={true}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}>
        <View style={styles.formView}>
          {!disableTopDetails && (
            <>
              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.cardHolderName}
                placeHolder={LanguageManager.enterNameHere}
                keyboardType="default"
                maxLength={40}
                value={name}
                onChangeText={text => setName(text)}
              />
              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.country}
                placeHolder={LanguageManager.enterCity}
                value={country.name}
                editable={false}
                rightIcon={Images.dropIconDownLight}
                rightIconStyle={{height: areaDimen(10), width: areaDimen(10)}}
                tintColor={ThemeManager.colors.inActiveColor}
                onPress={() => {
                  setTitle(LanguageManager.selectCountry);
                  setTimeout(() => {
                    setShowCountryModal(true);
                  }, 300);
                }}
              />
              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.documentCountry}
                placeHolder={LanguageManager.chooseDocumentCountry}
                value={documentCountry.name}
                editable={false}
                rightIcon={Images.dropIconDownLight}
                rightIconStyle={{height: areaDimen(10), width: areaDimen(10)}}
                tintColor={ThemeManager.colors.inActiveColor}
                onPress={() => {
                  setTitle(LanguageManager.chooseDocumentCountry);
                  setTimeout(() => {
                    setShowCountryModal(true);
                  }, 300);
                }}
              />

              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.city}
                placeHolder={LanguageManager.enterCity}
                keyboardType="default"
                maxLength={40}
                value={city}
                onChangeText={text => setCity(text)}
                editable={disableTopDetails ? false : true}
              />
              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.state}
                placeHolder={LanguageManager.enterState}
                keyboardType="default"
                maxLength={40}
                value={state}
                onChangeText={text => setState(text)}
                editable={disableTopDetails ? false : true}
              />
              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.address}
                placeHolder={LanguageManager.enterAddress1}
                keyboardType="default"
                maxLength={40}
                value={address}
                onChangeText={text => setAddress(text)}
                editable={disableTopDetails ? false : true}
              />
              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.address2}
                placeHolder={LanguageManager.enterAddress2}
                keyboardType="default"
                maxLength={40}
                value={address2}
                onChangeText={text => setAddress2(text)}
                editable={disableTopDetails ? false : true}
              />
              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.postalCode}
                placeHolder={LanguageManager.enterPostalCode}
                keyboardType="default"
                maxLength={40}
                value={postalCode}
                onChangeText={text => setPotalCode(text)}
                editable={disableTopDetails ? false : true}
              />
            </>
          )}
          {disableTopDetails && (
            <>
              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.taxId}
                placeHolder={LanguageManager.enterTaxIs}
                keyboardType="default"
                maxLength={40}
                value={taxId}
                onChangeText={text => setTaxId(text)}
              />
              <TextInputWithLabel
                mainContainerStyle={{marginTop: heightDimen(12)}}
                label={LanguageManager.taxCountry}
                placeHolder={LanguageManager.chooseTaxCountry}
                value={taxCountry.name}
                editable={false}
                rightIcon={Images.dropIconDownLight}
                rightIconStyle={{height: areaDimen(10), width: areaDimen(10)}}
                tintColor={ThemeManager.colors.inActiveColor}
                onPress={() => {
                  setTitle(LanguageManager.chooseTaxCountry);
                  setTimeout(() => {
                    setShowCountryModal(true);
                  }, 300);
                }}
              />

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsUsRelated(!isUsRelated)}
                style={styles.checkTouchStyle}>
                {isUsRelated ? (
                  <Image
                    source={ThemeManager.ImageIcons.radioOn}
                    style={styles.imgView}
                  />
                ) : (
                  <Image
                    source={ThemeManager.ImageIcons.radioOff}
                    style={styles.imgView}
                  />
                )}
                <Text
                  style={[
                    styles.readAndAccept,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {LanguageManager.isUSRelared}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
      <GradientButton
        buttonStyle={styles.buttonView}
        title={LanguageManager.submit}
        onPress={() => onPressSubmit()}
      />
      {/* ********************************************************Country & Currency Modal******************************************************* */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCountryModal}
        onRequestClose={() => setShowCountryModal(false)}>
        <WrapperContainer>
          <CountryCodes
            List={countryList}
            twoItems={true}
            hideCode={true}
            title={title}
            onPress={item => {
              if (title == LanguageManager.chooseDocumentCountry) {
                setDocumentCountry(item);
              } else if (title == LanguageManager.chooseTaxCountry) {
                setTaxCountry(item);
              } else {
                setCountry(item);
              }
              setShowCountryModal(false);
            }}
            closeModal={() => setShowCountryModal(false)}
          />
        </WrapperContainer>
      </Modal>
      {/* ********************************************************Loader******************************************************* */}
      {isLoading == true && <Loader isLoading={isLoading} />}
    </WrapperContainer>
  );
};

export default AfterApplyDetails;
