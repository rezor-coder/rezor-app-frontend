import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Modal, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
import {LanguageManager, ThemeManager} from '../../../../../ThemeManager';
import {getCurrencyPreferenceList} from '../../../../Redux/Actions';
import {getCountryCodes, updateCustomerProfile} from '../../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../../Singleton';
import {
  stringValidation,
  zipCodeValidation,
} from '../../../../Utils/Validation';
import {areaDimen, height} from '../../../../Utils/themeUtils';
import {Images} from '../../../../theme';
import {BorderLine, SimpleHeader} from '../../../common';
import BlurBottomModal from '../../../common/BlurBottomModal';
import GradientButton from '../../../common/GradientButton';
import TextInputWithLabel from '../../../common/TextInputWithLabel';
import WrapperContainer from '../../../common/WrapperContainer';
import styles from './styles';
import CountryCodes from '../../CountryCodes/CountryCodes';
import { goBack, navigate } from '../../../../navigationsService';
import { isEmpty } from 'lodash';
import Loader from '../../Loader/Loader';
import { NavigationStrings } from '../../../../Navigation/NavigationStrings';

const UserDetail = (props) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(props.route.params?.profile?.firstName || '');
  const [lastName, setLastName] = useState(props.route.params?.profile?.lastName || '');
  const [primaryCurrency, setPrimaryCurrency] = useState({name:props.route.params?.profile?.primaryCurrency || ''});
  const [residenceCity, setResidenceCity] = useState(props.route.params?.profile?.residenceCity || '');
  const [residenceStreet, setResidenceStreet] = useState(props.route.params?.profile?.residenceStreet || '');
  const [residenceZipCode, setResidenceZipCode] = useState(props.route.params?.profile?.residenceZipCode || '');
  const [dateOfBirth, setDateOfBirth] =useState(props.route.params?.profile?.dateOfBirth || '');
  const [showDate, setShowDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [currencyList, setCurrencyList] = useState([]);
  const [residencyCountry, setResidenceCountry] = useState({});
  const [showModalCodeCountry, setshowModalCodeCountry] = useState(false);
  const [showModalCurrency, setshowModalCurrency] = useState(false);
  const [countryData,setCountryData]= useState([])
  useEffect(() => {
    getCurrencyData();
    getCountryCodesData()

  }, []);
  const getCountryCodesData = async () => {
      dispatch(getCountryCodes()).then((res)=>{
        let newArray = res.data?.map(item=> {return{
          name:item?.english,
          iso_3166_alpha3:item?.iso_3166_alpha2,
          dial_code:item?.mobile_area_code,
          code:item?.iso_3166_alpha3
        }})
        console.log(res.data,'newArraynewArraynewArraynewArray');
        setCountryData(newArray);

      }).catch(error=>{
        setIsLoading(false);
        console.log('countryCode::::err:', error);
        Singleton.getInstance().showAlert(error);
      })
  };

  const getCurrencyData = () => {
    let access_token = Singleton.getInstance().access_token;
    dispatch(getCurrencyPreferenceList({access_token}))
      .then(res => {
        console.log('getCurrencyPref:::::', res);
        let newList = res?.map(currency => ({
          name: currency.currency_name,
          mobile_area_code: currency.currency_code,
          symbol: currency.currency_symbol,
        }));
        console.log(newList,'newListnewListnewList');
        setCurrencyList(newList);
      })
      .catch(err => {
        setIsLoading(false);
        Singleton.getInstance().showAlert(err?.message);
        console.log('getCurrencyPref::::err:', err);
      });
  };

  const validateInputs = () => {
    // Validate each field
    if (!firstName) {
      Singleton.showAlert(LanguageManager.pleaseEnterFirstName);
      return;
    }
    if (!lastName) {
      Singleton.showAlert(LanguageManager.pleaseEnterLastName);
      return;
    }
    if (primaryCurrency?.mobile_area_code == '') {
      Singleton.showAlert(LanguageManager.pleaseSelectPrimaryCurrency);
      return;
    }
    if (isEmpty(residencyCountry)) {
      Singleton.showAlert(LanguageManager.pleaseSelectResidenceCountry);
      return;
    }
    if (!residenceCity) {
      Singleton.showAlert(LanguageManager.pleaseEnterResidenceCity);
      return;
    }
    if (!residenceStreet) {
      Singleton.showAlert(LanguageManager.pleaseEnterResidenceStreet);
      return;
    }
    if (!residenceZipCode) {
      Singleton.showAlert(LanguageManager.pleaseEnterResidenceZip);
      return;
    }
    if (!dateOfBirth) {
      Singleton.showAlert(LanguageManager.pleaseSelectDateOfBirth);
      return;
    }
    return true;
  };
  const onPressSubmit = () => {
    if (!validateInputs()) {
      return;
    }
    let data = {
      firstName: firstName,
      lastName: lastName,
      primaryCurrency: primaryCurrency?.mobile_area_code,
      residenceCountry: residencyCountry?.iso_3166_alpha3,
      residenceCity: residenceCity,
      residenceStreet: residenceStreet,
      residenceZipCode: residenceZipCode,
      dateOfBirth: dateOfBirth,
      citizenshipCountry: residencyCountry?.iso_3166_alpha3,
    };
    console.log('data:::::', data);
    setIsLoading(true);
    dispatch(updateCustomerProfile({data}))
      .then(res => {
        navigate(NavigationStrings.SaitaCardDashBoard)
        setIsLoading(false);
        setButtonDisable(false);
      })
      .catch(error => {
        console.log(error,'errorerror');
        Singleton.showAlert(error);
        setIsLoading(false);
      });
  };
  return (
    <WrapperContainer isLoading={isLoading}>
      <SimpleHeader
        title={LanguageManager.userDetails}
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
        <View style={styles.mainContainer}>
          <TextInputWithLabel
            label={LanguageManager.firstName}
            placeHolder={LanguageManager.enterYourFirstName}
            value={firstName}
            onChangeText={text => {
              setFirstName(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(20)}}
          />
          <TextInputWithLabel
            label={LanguageManager.lastName}
            placeHolder={LanguageManager.enterYourLastName}
            value={lastName}
            onChangeText={text => {
              setLastName(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
          />
          <TextInputWithLabel
            label={LanguageManager.primaryCurrency}
            placeHolder={LanguageManager.enterYourPrimaryCurrency}
            value={primaryCurrency?.name}
            onChangeText={text => {
              setPrimaryCurrency(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
            rightIcon={Images.dropIconDownDark}
            rightIconStyle={styles.iconStyle}
            tintColor={ThemeManager.colors.dotLine}
            editable={false}
            onPress={() => setshowModalCurrency(true)}
          />
          <TextInputWithLabel
            label={LanguageManager.residenceCountry}
            placeHolder={LanguageManager.enterYourResidenceCountry}
            value={residencyCountry?.name}
            labelStyle={{marginTop: areaDimen(16)}}
            rightIcon={Images.dropIconDownDark}
            rightIconStyle={styles.iconStyle}
            tintColor={ThemeManager.colors.dotLine}
            editable={false}
            onPress={() => setshowModalCodeCountry(true)}
          />
          <TextInputWithLabel
            label={LanguageManager.residenceCity}
            placeHolder={LanguageManager.enterYourResidenceCity}
            value={residenceCity}
            onChangeText={text => {
              setResidenceCity(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
          />
          <TextInputWithLabel
            label={LanguageManager.residenceStreet}
            placeHolder={LanguageManager.enterYourResidenceStreet}
            value={residenceStreet}
            onChangeText={text => {
              setResidenceStreet(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
          />
          <TextInputWithLabel
            label={LanguageManager.residenceZipCode}
            placeHolder={LanguageManager.enterYourResidenceZipCode}
            value={residenceZipCode}
            onChangeText={text => {
              setResidenceZipCode(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
            maxLength={6}
          />
          <TextInputWithLabel
            label={LanguageManager.dateOfBirth}
            placeHolder={LanguageManager.enterYourDateOfBirth}
            value={!!dateOfBirth ? moment(dateOfBirth).format('ll') : ''}
            labelStyle={{marginTop: areaDimen(16)}}
            rightIcon={Images.dropIconDownDark}
            rightIconStyle={styles.iconStyle}
            tintColor={ThemeManager.colors.dotLine}
            editable={false}
            onPress={() => setShowDate(true)}
          />
        </View>
      </KeyboardAwareScrollView>
      <GradientButton
        title={LanguageManager.submit}
        onPress={onPressSubmit}
        disabled={!buttonDisable}
        buttonStyle={styles.buttonView}
        buttonColor={
          !buttonDisable
            ? [ThemeManager.colors.lightGrey, ThemeManager.colors.lightGrey]
            : []
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModalCodeCountry}
        onRequestClose={() => setshowModalCodeCountry(false)}>
        <WrapperContainer>
          <CountryCodes
            List={countryData}
            twoItems={true}
            hideCode={true}
            onPress={item => {
              setResidenceCountry(item);
              setshowModalCodeCountry(false);
            }}
            closeModal={() => setshowModalCodeCountry(false)}
          />
        </WrapperContainer>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModalCurrency}
        onRequestClose={() => setshowModalCurrency(false)}>
        <WrapperContainer>
          <CountryCodes
            List={currencyList}
            title={LanguageManager.currency}
            twoItems={true}
            hideCode={true}
            onPress={item => {
              console.log(item,'itemitemitemitemitem');
              setPrimaryCurrency(item)
              setshowModalCurrency(false);
            }}
            closeModal={() => setshowModalCurrency(false)}
          />
        </WrapperContainer>
      </Modal>
      <BlurBottomModal
        visible={showDate}
        modalHeight={height / 2.4}
        onPressCloseSheet={() => {
          setShowDate(false);
          setDateOfBirth('');
        }}>
        <View
          style={{
            paddingHorizontal: areaDimen(22),
            paddingTop: areaDimen(55),
          }}>
          <DatePicker
            date={!!dateOfBirth ? dateOfBirth : new Date()}
            confirmText={LanguageManager.confirm}
            maximumDate={new Date()}
            style={{marginBottom: areaDimen(10)}}
            onDateChange={date => {
              console.log(date, 'datedatedatedate');
              setDateOfBirth(date);
            }}
            fadeToColor={ThemeManager.colors.backgroundColor}
            textColor={ThemeManager.colors.textColor}
            mode="date"
          />
          <GradientButton
            title={LanguageManager.confirm}
            buttonStyle={styles.buttonView}
            onPress={() => {
              if (!dateOfBirth) {
                Singleton.showAlert(LanguageManager.selectDateFirst);
                return;
              }
              setShowDate(false);
            }}
          />
        </View>
      </BlurBottomModal>
      {isLoading && <Loader />}
    </WrapperContainer>
  );
};

export default UserDetail;
