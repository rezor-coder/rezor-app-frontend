import moment from 'moment';
import React, { useState } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { cardUserdata, setUserProfile } from '../../../Redux/Actions/SaitaCardAction';
import Singleton from '../../../Singleton';
import {
  stringValidation,
  zipCodeValidation
} from '../../../Utils/Validation';
import { areaDimen, height } from '../../../Utils/themeUtils';
import { navigate } from '../../../navigationsService';
import { Images } from '../../../theme';
import { BorderLine, SimpleHeader } from '../../common';
import BlurBottomModal from '../../common/BlurBottomModal';
import GradientButton from '../../common/GradientButton';
import TextInputWithLabel from '../../common/TextInputWithLabel';
import WraperContainer from '../../common/WraperContainer';
import styles from './styles';

const UserDetail = ({navigation, route}) => {
  console.log('userData::::', userData);
  const {userData} = route?.params
  const dispatch = useDispatch()
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [primaryCurrency, setPrimaryCurrency] = useState('');
  const [residenceCity, setResidenceCity] = useState('');
  const [residenceStreet, setResidenceStreet] = useState('');
  const [residenceZipCode, setResidenceZipCode] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState();
  const [showDate, setShowDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);

  // ------------------------- For specify year---------------------------------------
  const getEighteenYearsAgoDate = () => {
    const currentDate = new Date();
    const eighteenYearsAgo = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    return eighteenYearsAgo;
  };
  const maximumDate = getEighteenYearsAgoDate();
  //----------------------------------------------------------------
  const validateInputs = () => {
    // Validate each field
    if (!firstName) {
      Singleton.showAlert('Please enter first name');
      return;
    } else if (!stringValidation(firstName)) {
      Singleton.showAlert('Invalid first name');
      return;
    }

    if (!lastName) {
      Singleton.showAlert('Please enter last name');
      return;
    } else if (!stringValidation(lastName)) {
      Singleton.showAlert('Invalid last name');
      return;
    }

    if (!primaryCurrency) {
      Singleton.showAlert('Please enter primary currency');
      return;
    } else if (!stringValidation(primaryCurrency)) {
      Singleton.showAlert('Invalid primary currency');
      return;
    }

    if (!residenceCity) {
      Singleton.showAlert('Please enter residence city');
      return;
    } else if (!stringValidation(residenceCity)) {
      Singleton.showAlert('Invalid residence city');
      return;
    }

    if (!residenceStreet) {
      Singleton.showAlert('Please enter residence street');
      return;
    } else if (!stringValidation(residenceStreet)) {
      Singleton.showAlert('Invalid residence street');
      return;
    }

    if (!residenceZipCode) {
      Singleton.showAlert('Please enter residence zip code');
      return;
    } else if (!zipCodeValidation(residenceZipCode)) {
      Singleton.showAlert('Invalid residence zip code');
      return;
    }

    if (!dateOfBirth) {
      Singleton.showAlert('Please enter date of birth');
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
      primaryCurrency: 'USD',
      residenceCountry: userData?.country_code,
      residenceCity: residenceCity,
      residenceStreet: residenceStreet,
      residenceZipCode: residenceZipCode,
      dateOfBirth: dateOfBirth,
    };
    let token = userData?.access_token;
    console.log('data:::::', data);
    let newUserData = {...data, ...userData};
    setIsLoading(true);
    setUserProfile({data, token})
      .then(res => {
        Singleton.getInstance().newSaveData(constants.USER_DATA, JSON.stringify(newUserData));
        cardUserdata(dispatch, newUserData);
        navigate(NavigationStrings.SaitaCardDashBoard)
        setIsLoading(false);
        setButtonDisable(false);
      })
      .catch(error => {
        Singleton.showAlert(error.message);
        setIsLoading(false);
      });
  };
  return (
    <WraperContainer isLoading={isLoading}>
      <SimpleHeader
        title={'User Details'}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          navigation.goBack();
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
            label={'First Name'}
            placeHolder={'Enter Your First Name'}
            value={firstName}
            onChangeText={text => {
              setFirstName(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(20)}}
          />
          <TextInputWithLabel
            label={'Last Name'}
            placeHolder={'Enter Your Last Name'}
            value={lastName}
            onChangeText={text => {
              setLastName(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
          />
          <TextInputWithLabel
            label={'Primary Currency'}
            placeHolder={'Enter Your Primary Currency'}
            value={primaryCurrency}
            onChangeText={text => {
              setPrimaryCurrency(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
          />
          {/* <TextInputWithLabel
            label={'Residence Country'}
            placeHolder={'Enter Your Residence Country'}
            value={residenceCountry}
            labelStyle={{marginTop: areaDimen(16)}}
            rightIcon={Images.dropIconDownDark}
            rightIconStyle={styles.iconStyle}
            tintColor={ThemeManager.colors.dotLine}
            editable={false}
            onPress={() => setCountryListModal(true)}
          /> */}
          <TextInputWithLabel
            label={'Residence City'}
            placeHolder={'Enter Your Residence City'}
            value={residenceCity}
            onChangeText={text => {
              setResidenceCity(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
          />
          <TextInputWithLabel
            label={'Residence Street'}
            placeHolder={'Enter Your Residence Street'}
            value={residenceStreet}
            onChangeText={text => {
              setResidenceStreet(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
          />
          <TextInputWithLabel
            label={'Residence ZipCode'}
            placeHolder={'Enter Your Residence ZipCode'}
            value={residenceZipCode}
            onChangeText={text => {
              setResidenceZipCode(text.trimStart());
            }}
            labelStyle={{marginTop: areaDimen(16)}}
            maxLength={6}
            keyboardType={'numeric'}
          />
          <TextInputWithLabel
            label={'Date Of Birth'}
            placeHolder={'Enter Your Date Of Birth'}
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
        title={'Submit'}
        onPress={onPressSubmit}
        disabled={!buttonDisable}
        buttonStyle={styles.buttonView}
        buttonColor={
          !buttonDisable
            ? [ThemeManager.colors.lightGrey, ThemeManager.colors.lightGrey]
            : []
        }
      />
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={countryListModal}
        onRequestClose={() => setCountryListModal(false)}>
        <WraperContainer>
          <CountryCodes
            List={countryData}
            twoItems={true}
            hideCode={true}
            onPress={item => {
              console.log('MM', '????', item, item.dial_code.replace('+', ''));
              setResidenceCountry(item?.name);
              setCountryListModal(false);
            }}
            closeModal={() => setCountryListModal(false)}
          />
        </WraperContainer>
      </Modal> */}
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
            confirmText="confirm"
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
                Singleton.showAlert('Select Date First');
                return;
              }
              setShowDate(false);
            }}
          />
        </View>
      </BlurBottomModal>
    </WraperContainer>
  );
};

export default UserDetail;
