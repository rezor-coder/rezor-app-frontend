import {
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Modal,
  Alert,
} from 'react-native';
import React, { useEffect } from 'react';
import { BasicButton, BasicInputBox, BorderLine, SimpleHeader, Wrap } from '../../common';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { ActionConst, Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import fonts from '../../../theme/Fonts';
import * as Constants from '../../../Constant';
import { useState } from 'react';
import moment from 'moment';
import { Colors, Fonts, Images } from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Singleton from '../../../Singleton';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import { APIClient } from '../../../Api';
import Loader from '../Loader/Loader';
import {
  API_CARD_PHYSICAL_FORM_KYC,
  API_GET_COUNTRYLIST,
} from '../../../Endpoints';
import ImageCropPicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import CountryCodes from '../CountryCodes/CountryCodes';
import { TouchableWithoutFeedback } from 'react-native';
import { StyleSheet } from 'react-native';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
const ImgaeBelowText = ({ text }) => {
  return (
    <View style={{ flexDirection: 'row', marginTop: 5 }}>
      <Image
        source={Images.tickWhite}
        style={{
          height: 12,
          width: 12,
          marginTop: 3,
          tintColor: ThemeManager.colors.lightTextColor,
        }}
      />
      <Text
        style={{
          color: ThemeManager.colors.lightTextColor,
          fontSize: 13,
          fontFamily: fonts.regular,
          lineHeight: 21,
          marginLeft: 9,
        }}>
        {text}
      </Text>
    </View>
  );
};
const SaitaCardHyperKycForm = props => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState({});
  const [documentType, setDocumentType] = useState('Passport');
  const [documentNo, setDocumentNo] = useState('');
  const [countryList, setcountryList] = useState([]);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [doc_expiry, setdoc_expiry] = useState(new Date());
  const [isDOB, setIsDOB] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emergencyNo, setEmergencyNo] = useState('');
  const [dateModal, setDateModal] = useState(false);
  const [countryListModal, setCountryListModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [province, setProvince] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [gender, setGender] = useState('male');
  const [frontID, setFrontId] = useState({
    fileName: '',
    fileSize: null,
    height: null,
    type: '',
    uri: '',
    width: null,
  });
  const [selfie, setSelfie] = useState({
    fileName: '',
    fileSize: null,
    height: null,
    type: '',
    uri: '',
    width: null,
  });
  const [signature, setSignature] = useState({
    fileName: '',
    fileSize: null,
    height: null,
    type: '',
    uri: '',
    width: null,
  });
  const [dob, setDOB] = useState(new Date());
  const { userDetail, cardDetail, selectedItem } = props;
  useEffect(() => {
    console.log(props);
    setFirstName(userDetail?.first_name || '');
    setLastName(userDetail?.last_name || '');
    let onBlur = props.navigation.addListener('didBlur', () => {
      setCountryListModal(false);
      setDateModal(false);
    });
    getCountryList();
    return () => {
      onBlur && onBlur?.remove();
    };
  }, []);

  const getCountryList = async () => {
    try {
      setLoading(true);
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token_cards,
      );
      let res = await APIClient.getInstance().getCards(
        API_GET_COUNTRYLIST,
        token,
      );
      setcountryList(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Singleton.showAlert('Unable to fetch data');
      Actions.pop();
    }
  };

  const checkValidations = () => {
    if (firstName.trim() == '') {
      Singleton.showAlert('First Name field is required');
      return;
    }
    if (firstName.length < 3) {
      Singleton.showAlert('Name field must be greater than 3 characters');
      return;
    }
    if (lastName.trim() == '') {
      Singleton.showAlert('Last Name field is required');
      return;
    }
    if (street.length < 5) {
      Singleton.showAlert(
        'Street Address field must be greater than 5 characters.',
      );
      return;
    }
    if (city.trim() == '') {
      Singleton.showAlert('City field is required');
      return;
    }
    if (province.length < 5) {
      Singleton.showAlert('Province field must be greater than 5 characters.');
      return;
    }
    if (postcode.trim() == '') {
      Singleton.showAlert('PostCode field is required');
      return;
    }
    if (!nationality?.name) {
      Singleton.showAlert('Please select nationality');
      return;
    }
    if (documentNo == '') {
      Singleton.showAlert('Please enter document no.');
      return;
    }
    if (emergencyContact == '') {
      Singleton.showAlert('Please enter emergency contact.');

      return;
    }
    if (emergencyNo == '') {
      Singleton.showAlert('Please enter emergency number.');
      return;
    }
    if (frontID.uri == '') {
      Singleton.showAlert('"Please upload front ID photo"');
      return;
    }
    if (selfie.uri == '') {
      Singleton.showAlert('Please upload selfie of hand holding ID card.');
      return;
    }
    if (signature.uri == '') {
      Singleton.showAlert('Please save your signature');
      return;
    }

    submitKYC();
  };

  const submitKYC = async () => {
    try {
      const formData = new FormData();
      formData.append('files', {
        uri: frontID.uri,
        type: frontID?.mime || 'image/png',
        name: 'front_id_pic',
      });
      formData.append('files', {
        uri: selfie.uri,
        type: selfie?.mime || 'image/png',
        name: 'selfie',
      });
      formData.append('files', {
        uri: signature.uri,
        type: signature?.mime || 'image/png',
        name: 'sign',
      });
      let req = {
        card_type: selectedItem?.card_type,
        first_name: firstName?.trim(),
        last_name: lastName?.trim(),
        dob: moment(dob).format('YYYY-MM-DD'),
        doc_expire_date: moment(doc_expiry).format('YYYY-MM-DD'),
        docs_type: documentType,
        nation: nationality?.unique_id,
        docs_number: documentNo,
        emergency_no: emergencyNo,
        emergency_contact: emergencyContact?.trim(),
        gender: gender == 'male' ? 1 : 2,
        city: city?.trim(),
        post_code: postcode?.trim(),
        province: province?.trim(),
        street_address: street?.trim(),
      };
      let data = JSON.parse(APIClient.getInstance().encodeData(req));
      console.log('------ ', req);
      formData.append('dataString', data.dataString);
      setLoading(true);
      let token = await Singleton.getInstance().newGetData(
        Constants.access_token_cards,
      );
      let resKYC = await APIClient.getInstance().postTokenCardsFormData(
        API_CARD_PHYSICAL_FORM_KYC,
        formData,
        token,
      );

      console.log('resKYC:::::::', resKYC);
      setLoading(false);
      Alert.alert(
        Constants.APP_NAME,
        resKYC?.message || 'KYC details submitted successfully.',
        [{ text: 'OK', onPress: () => { } }],
        { cancelable: false, onDismiss: () => { } },
      );
      Actions.Main({ type: ActionConst.RESET });
    } catch (error) {
      setLoading(false);
      console.log('err:::::::', error);
      Singleton.showAlert(error?.message || Constants.SOMETHING_WRONG);
    }
  };
  const requestCameraPermission = async () => {
    return new Promise((resolve, reject) => {
      Singleton.isCameraOpen = true;
      if (Platform.OS === 'android') {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Camera Permission',
          message: 'SaitaPro wants to access camera to upload document',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        })
          .then(granted => {
            console.log('----- cccc', granted);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              resolve(true);
              return;
            } else {
              reject(false);
              return;
            }
          })
          .catch(err => {
            reject(false);
            return;
          });
      } else {
        resolve(true);
        return;
      }
    });
  };

  const requestExternalStoreageRead = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (Platform.OS == 'ios') {
          resolve(true);
          return;
        }
        Singleton.isCameraOpen = true;
        global.stop_pin = true;
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        console.log('granted::::', granted);
        if (Platform.Version >= 33) {
          resolve(true);
          return;
        }
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          resolve(true);
          return;
        } else {
          Singleton.showAlert('Grant storage permission in settings');
          reject(false);
          return;
        }
      } catch (err) {
        reject(false);
      }
    });
  };

  const attachBtnClicked = isCamera => {
    return new Promise((resolve, reject) => {
      global.isCamera = true;
      let method = isCamera
        ? ImageCropPicker.openCamera
        : ImageCropPicker.openPicker;
      method({
        cropping: true,
        compressImageQuality: 0.8,
        multiple: false,
        compressImageMaxHeight: 1024,
        compressImageMaxWidth: 1024,
      })
        .then(response => {
          global.stop_pin = true;
          console.log('Response ===== ', response);
          if (response.path) {
            return resolve({ ...response, uri: response.path });
          } else if (response.sourceURL) {
            return resolve({ ...response, uri: response.sourceURL });
          } else {
            return reject('Image not selected');
          }
        })
        .catch(err => {
          console.log('errorroor', err);
          reject(err);
        });
    });
  };
  const pickDocument = async (type, isCamera) => {
    Singleton.isCameraOpen = true;
    global.stop_pin = true;
    attachBtnClicked(isCamera)
      .then(res => {
        console.log('res::::attachBtnClicked', res);
        if (type == 'signature') {
          setSignature(res);
        } else if (type == 'frontId') {
          setFrontId(res);
        } else {
          setSelfie(res);
        }
        setTimeout(() => {
          global.stop_pin = false;
        }, 1000);
      })
      .catch(err => {
        setTimeout(() => {
          global.stop_pin = false;
        }, 1000);
        console.log('err::::', err);
      });
  };
  const onImageUpload = async type => {
    Singleton.isCameraOpen = true;
    global.stop_pin = true;

    Alert.alert(
      'Image upload',
      'Please select one option',
      [
        {
          text: 'Open Camera',
          onPress: () => {
            requestCameraPermission()
              .then(granted => {
                if (granted) {
                  pickDocument(type, true);
                }
              })
              .catch(err => {
                console.log(err);
                Singleton.showAlert('Permission denied');
                global.stop_pin = false;
              });
          },
        },
        {
          text: 'Open Gallery',
          onPress: () => {
            requestExternalStoreageRead()
              .then(granted => {
                if (granted) {
                  pickDocument(type, false);
                }
              })
              .catch(err => {
                console.log(err);
                global.stop_pin = false;
                Singleton.showAlert('Permission denied');
              });
          },
        },
      ],
      {
        onDismiss: () => {
          Singleton.isCameraOpen = false;
          global.stop_pin = false;
        },
        cancelable: true,
      },
    );
  };

  const onPressRemove = type => {
    let emptyData = {
      fileName: '',
      fileSize: null,
      height: null,
      type: '',
      uri: '',
      width: null,
    };
    if (type == 'signature') {
      setSignature(emptyData);
    } else if (type == 'frontId') {
      setFrontId(emptyData);
    } else {
      setSelfie(emptyData);
    }
  };
  return (
    <>
      <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
        <SimpleHeader
          back={false}
          backPressed={() => {
            Actions.pop();
          }}
          title={'KYC'}
        />
        <BorderLine borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}/>
        <KeyboardAwareScrollView style={{ padding: widthDimen(22), }}>
          <View style={{ flex: 1, marginBottom: 60 }}>
            <BasicInputBox
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
                marginTop:0
              }}
              title={LanguageManager.firstName}
              maxLength={20}
              mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
              width="100%"
              text={firstName}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX_WITH_SPACE.test(text)) {
                  setFirstName(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicInputBox
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={LanguageManager.lastName}
              maxLength={20}
              mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
              width="100%"
              text={lastName}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX_WITH_SPACE.test(text)) {
                  setLastName(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <View>
              <BasicInputBox
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: fonts.semibold,
                }}
                title={LanguageManager.dateOfBirth}
                mainContainerStyle={{ width: '100%' }}
                maxLength={20}
                text={moment(dob).format('DD MMM YYYY')}
                onChangeText={text => {
                  if (Constants.ALPHABET_REGEX.test(text)) {
                  }
                }}
                style={{ flex: 1 }}
                mainStyle={{
                  borderColor: ThemeManager.colors.viewBorderColor,
                }}
                placeholder={LanguageManager.enterhere}></BasicInputBox>
              <TouchableOpacity
                onPress={() => {
                  setTempDate(dob);
                  setIsDOB(true);
                  setDateModal(true);
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}></TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[
                  {
                    alignSelf: 'flex-start',
                    marginHorizontal: 10,
                    marginBottom: 10,
                  },
                ]}>
                <Text
                  style={[
                    { color: ThemeManager.colors.textColor, left: 0 },
                    {
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    },
                  ]}>
                  {'Gender'}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setGender('male');
                }}>
                {gender == 'male' ? (
                  <LinearGradient
                    colors={[
                      Colors.buttonColor1,
                      Colors.buttonColor2,
                    ]}
                    style={styles.genderButtonContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    >
                    <Image
                      source={Images.male}
                      style={[styles.genderImage, { tintColor: 'white' }]}
                      tintColor={'white'}
                    />
                    <Text style={styles.genderText}>Male</Text>
                  </LinearGradient>
                ) : (
                  <View
                    style={[
                      styles.genderButtonContainer,
                      { borderWidth: 1, borderColor: Colors.languageItem },
                    ]}>
                    <Image
                      source={Images.male}
                      style={[
                        styles.genderImage,
                        { tintColor: Colors.languageItem },
                      ]}
                      tintColor={Colors.languageItem}
                    />
                    <Text
                      style={[styles.genderText, { color: Colors.languageItem }]}>
                      Male
                    </Text>
                  </View>
                )}
              </TouchableWithoutFeedback>
              <View style={{ flex: 0.1 }} />
              <TouchableWithoutFeedback
                onPress={() => {
                  setGender('female');
                }}>
                {gender == 'female' ? (
                  <LinearGradient
                  colors={[
                    Colors.buttonColor1,
                    Colors.buttonColor2,
                  ]}
                  style={styles.genderButtonContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                    <Image
                      source={Images.female}
                      style={[styles.genderImage, { tintColor: 'white' }]}
                    />
                    <Text style={styles.genderText}>Female</Text>
                  </LinearGradient>
                ) : (
                  <View
                    style={[
                      styles.genderButtonContainer,
                      { borderWidth: 1, borderColor: Colors.languageItem },
                    ]}>
                    <Image
                      source={Images.female}
                      style={[
                        styles.genderImage,
                        { tintColor: Colors.languageItem },
                      ]}
                      tintColor={Colors.languageItem}
                    />
                    <Text
                      style={[styles.genderText, { color: Colors.languageItem }]}>
                      Female
                    </Text>
                  </View>
                )}
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                marginTop: 10,
              }}>
              <BasicInputBox
                editable={true}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: fonts.semibold,
                }}
                title={'Street Address'}
                maxLength={256}
                mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
                width="100%"
                text={street}
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                onChangeText={text => {
                  setStreet(text);
                }}
                placeholder={LanguageManager.enterhere}></BasicInputBox>
            </View>
            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={'City'}
              maxLength={100}
              mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
              width="100%"
              text={city}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX_WITH_SPACE.test(text)) {
                  setCity(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={'Province'}
              maxLength={100}
              mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
              width="100%"
              text={province}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (Constants.ALPHABET_REGEX_WITH_SPACE.test(text)) {
                  setProvince(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={'PostCode'}
              maxLength={20}
              mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
              width="100%"
              text={postcode}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                if (/^[a-zA-Z0-9- ]*$/.test(text)) {
                  setPostcode(text);
                }
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <View>
              <BasicInputBox
                editable={false}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 13,
                  fontFamily: fonts.semibold,
                }}
                title={LanguageManager.nationality}
                maxLength={20}
                mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
                width="100%"
                text={nationality?.name}
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                onChangeText={text => { }}
                placeholder={LanguageManager.enterhere}></BasicInputBox>
              <TouchableOpacity
                onPress={() => {
                  setCountryListModal(true);
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}></TouchableOpacity>
            </View>
            <BasicInputBox
              editable={false}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={LanguageManager.documentType}
              maxLength={20}
              mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
              width="100%"
              text={documentType}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => { }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={LanguageManager.documentNo}
              maxLength={20}
              mainStyle={{ borderColor: ThemeManager.colors.viewBorderColor }}
              width="100%"
              text={documentNo}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                setDocumentNo(text);
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            {selectedItem?.card_type?.toLowerCase() == 'virtual' && (
              <View>
                <BasicInputBox
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: 13,
                    fontFamily: fonts.semibold,
                  }}
                  title={'Document Expiry Date'}
                  mainContainerStyle={{ width: '100%' }}
                  maxLength={20}
                  text={moment(doc_expiry).format('DD MMM YYYY')}
                  onChangeText={text => {
                    if (Constants.ALPHABET_REGEX.test(text)) {
                    }
                  }}
                  style={{ flex: 1 }}
                  mainStyle={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                  }}
                  placeholder={LanguageManager.enterhere}></BasicInputBox>
                <TouchableOpacity
                  onPress={() => {
                    setTempDate(doc_expiry);
                    setIsDOB(false);
                    setDateModal(true);
                  }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                  }}></TouchableOpacity>
              </View>
            )}

            {/* // *************************************Front ID**************************************************** */}
            <View style={{  }}>
              <View style={[{ alignSelf: 'flex-start' }]}>
                <Text
                  style={[
                    {
                      color: ThemeManager.colors.textColor,
                      left: 0,
                      marginTop: heightDimen(20),
                    },
                    {
                      color: ThemeManager.colors.textColor,
                      fontSize: areaDimen(13),
                      fontFamily: fonts.semibold,
                    },
                  ]}>
                  {LanguageManager.frontID}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  onImageUpload('frontId');
                }}
                style={{
                  height: 180,
                  borderRadius: 15,
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  borderColor:ThemeManager.colors.textColor
                }}>
                {frontID.uri != '' ? (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        onPressRemove('frontId');
                      }}
                      style={{
                        zIndex: 9999,
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'red',
                        padding: 5,
                        borderRadius: 40,
                        right: -10,
                        top: -10,
                      }}>
                      <Image
                        source={Images.cancel}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'stretch',
                          borderRadius: 15,
                          tintColor: 'white',
                        }}
                      />
                    </TouchableOpacity>
                    <FastImage
                      source={{ uri: frontID.uri }}
                      style={{
                        height: heightDimen(180),
                        width: '100%',
                        borderRadius: 15,
                      }}
                      resizeMode="stretch"
                    />
                  </>
                ) : (
                  <>
                    <LinearGradient
                      colors={[
                        Colors.buttonColor1,
                        Colors.buttonColor2,
                      ]}
                      style={{
                        height: areaDimen(32),
                        width: areaDimen(32),
                        borderRadius: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      >
                      <Image
                        source={Images.uploadWhite}
                        style={{ height: 13.4, width: 12, resizeMode: 'contain' }}
                      />
                    </LinearGradient>
                    <Text
                      style={{
                        color: ThemeManager.colors.textColor,
                        fontSize: 14,
                        fontFamily: fonts.regular,
                        lineHeight: 27,
                      }}>
                      {LanguageManager.uploadIdCard}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', marginVertical: 18 }}>
                <View style={{ flex: 1 }}>
                  <Image
                    source={Images.id_front}
                    style={{ height: 103, width: '100%', resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: ThemeManager.colors.lightTextColor,
                      fontSize: 13,
                      fontFamily: fonts.regular,
                      lineHeight: 21,
                    }}>
                    Front
                  </Text>
                </View>
                <View style={{ flex: 0.1 }}></View>
                <View style={{ flex: 1 }}>
                  <Image
                    source={Images.id_back}
                    style={{ height: 103, width: '100%', resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: ThemeManager.colors.lightTextColor,
                      fontSize: 13,
                      fontFamily: fonts.regular,
                      lineHeight: 21,
                    }}>
                    Back
                  </Text>
                </View>
              </View>
              <ImgaeBelowText
                text={'Please upload the front page of the ID card.'}
              />
              <ImgaeBelowText
                text={
                  'Ensure that the ID card is completely visible, the font is clear, and the brightness is uniform.'
                }
              />
              <ImgaeBelowText
                text={
                  'The photo should be less than 2MB and can be in jpg/jpeg/png formats.'
                }
              />
            </View>
            {/* // *************************************Selfie With ID Card**************************************************** */}
            <View style={{ paddingHorizontal: 0 }}>
              <View style={[{ alignSelf: 'flex-start' }]}>
                <Text
                  style={[
                    {
                      color: ThemeManager.colors.textColor,
                      left: 0,
                      marginTop: heightDimen(20),
                    },
                    {
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    },
                  ]}>
                  {LanguageManager.selfieWithId}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  onImageUpload('selfie');
                }}
                style={{
                  height: heightDimen(200),
                  borderRadius: 15,
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  marginTop: heightDimen(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor:ThemeManager.colors.textColor
                }}>
                {selfie.uri != '' ? (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        onPressRemove('selfie');
                      }}
                      style={{
                        zIndex: 9999,
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'red',
                        padding: 5,
                        borderRadius: 40,
                        right: -10,
                        top: -10,
                      }}>
                      <Image
                        source={Images.cancel}
                        style={{
                          height: areaDimen(20),
                          width: areaDimen(20),
                          resizeMode: 'stretch',
                          borderRadius: 15,
                          tintColor: 'white',
                        }}
                      />
                    </TouchableOpacity>
                    <FastImage
                      source={{ uri: selfie.uri }}
                      style={{
                        height: heightDimen(198),
                        width: '100%',
                        borderRadius: 15,
                      }}
                      resizeMode="stretch"
                    />
                  </>
                ) : (
                  <>
                    <LinearGradient
                      colors={[
                        Colors.buttonColor1,
                        Colors.buttonColor2,
                      ]}
                      style={{
                        height: 32,
                        width: 32,
                        borderRadius: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}>
                      <Image
                        source={Images.uploadWhite}
                        style={{ height: 13.4, width: 12, resizeMode: 'contain' }}
                      />
                    </LinearGradient>
                    <Text
                      style={{
                        color: ThemeManager.colors.textColor,
                        fontSize: 14,
                        fontFamily: fonts.regular,
                        lineHeight: 27,
                      }}>
                      {LanguageManager.uploadSelfieIdCard}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <View style={{ marginVertical: 18 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Images.selfie_kyc}
                    style={{
                      height: 186,
                      width: 166,
                      alignSelf: 'center',
                    }}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <ImgaeBelowText
                text={
                  'Please upload your selfie with hand holding the ID card.'
                }
              />
              <ImgaeBelowText
                text={
                  'Take a selfie with hand holding the ID card information page.'
                }
              />
            </View>
            {/* // *************************************Signature Photo**************************************************** */}
            <View style={{ paddingHorizontal: 0 }}>
              <View style={[{ alignSelf: 'flex-start' }]}>
                <Text
                  style={[
                    {
                      color: ThemeManager.colors.textColor,
                      left: 0,
                      marginTop: 10,
                    },
                    {
                      color: ThemeManager.colors.textColor,
                      fontSize: 13,
                      fontFamily: fonts.semibold,
                    },
                  ]}>
                  {LanguageManager.signaturePhoto}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  onImageUpload('signature');
                }}
                style={{
                  height: heightDimen(200),
                  borderRadius: 15,
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor:ThemeManager.colors.textColor
                }}>
                {signature.uri != '' ? (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        onPressRemove('signature');
                      }}
                      style={{
                        zIndex: 9999,
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'red',
                        padding: 5,
                        borderRadius: 40,
                        right: -10,
                        top: -10,
                      }}>
                      <Image
                        source={Images.cancel}
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 15,
                          tintColor: 'white',
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <FastImage
                      source={{ uri: signature.uri }}
                      style={{
                        height: heightDimen(200),
                        width: '100%',

                        borderRadius: 15,
                      }}
                      resizeMode="stretch"
                    />
                  </>
                ) : (
                  <>
                    <LinearGradient
                      colors={[
                        Colors.buttonColor1,
                        Colors.buttonColor2,
                      ]}
                      style={{
                        height: 32,
                        width: 32,
                        borderRadius: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}>
                      <Image
                        source={Images.uploadWhite}
                        style={{ height: 13.4, width: 12, resizeMode: 'contain' }}
                      />
                    </LinearGradient>
                    <Text
                      style={{
                        color: ThemeManager.colors.textColor,
                        fontSize: 14,
                        fontFamily: fonts.regular,
                        lineHeight: 27,
                      }}>
                      {'Upload Photo of your Signature'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <View style={{ marginTop: 20 }}>
                <ImgaeBelowText
                  text={'The photo of the signature must be clearly visible.'}
                />
                <ImgaeBelowText
                  text={
                    'The photo should be less than 1MB and can be in jpg/jpeg/png format.'
                  }
                />
              </View>
            </View>
            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={LanguageManager.EmergencyName}
              maxLength={20}
              mainStyle={{ borderColor: ThemeManager.colors.inputBoxColor }}
              width="100%"
              text={emergencyContact}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={text => {
                setEmergencyContact(text);
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicInputBox
              editable={true}
              titleStyle={{
                color: ThemeManager.colors.textColor,
                fontSize: 13,
                fontFamily: fonts.semibold,
              }}
              title={LanguageManager.EnergencyNumber}
              maxLength={20}
              mainStyle={{ borderColor: ThemeManager.colors.inputBoxColor }}
              width="100%"
              text={emergencyNo}
              keyboardType="phone-pad"
              onChangeText={text => {
                setEmergencyNo(text);
              }}
              placeholder={LanguageManager.enterhere}></BasicInputBox>
            <BasicButton
              onPress={() => {
                checkValidations();
              }}
              btnStyle={{
                marginTop: 50,
                marginHorizontal: 10,
                justifyContent: 'center',
                borderRadius: 100,
              }}
              customGradient={{ borderRadius: 100, height: 55 }}
              text={LanguageManager.apply}
              textStyle={{ fontSize: 16, fontFamily: fonts.semibold }}
            />
          </View>
        </KeyboardAwareScrollView>
      </Wrap>
      <Modal
        animationType="slide"
        transparent={true}
        visible={dateModal}
        onRequestClose={() => setDateModal(false)}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#9993',
          }}>
          <View
            style={{
              backgroundColor: ThemeManager.colors.backgroundColor,

              borderRadius: 20,
              paddingBottom: 20,
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                fontWeight: 'bold',
                width: 30,
                height: 30,
              }}
              onPress={() => {
                setDateModal(false);
              }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text
                  style={{
                    color: ThemeManager.colors.textColor,
                    fontWeight: 'bold',
                  }}>
                  X
                </Text>
              </View>
            </TouchableOpacity>
            <DatePicker
              date={tempDate}
              confirmText="confirm"
              maximumDate={isDOB ? new Date() : undefined}
              minimumDate={!isDOB ? new Date() : undefined}
              onDateChange={date => {
                console.log(date);
                setTempDate(date);
              }}
              style={{
                marginTop: 10,
              }}
              fadeToColor={ThemeManager.colors.backgroundColor}
              textColor={ThemeManager.colors.textColor}
              mode="date"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <BasicButton
                onPress={() => {
                  setDateModal(false);
                }}
                btnStyle={[
                  {
                    height: 50,
                    width: '42%',
                  },
                ]}
                customGradient={{
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: Colors.buttonColor1,
                }}
                customColor={['transparent', 'transparent']}
                text={'Cancel'}
                textStyle={{
                  fontSize: 16,
                  fontFamily: Fonts.bold,
                  color: Colors.buttonColor1,
                }}
              />
              <BasicButton
                onPress={() => {
                  if (isDOB) {
                    setDOB(tempDate);
                  } else {
                    setdoc_expiry(tempDate);
                  }
                  setDateModal(false);
                }}
                btnStyle={[
                  {
                    height: 50,
                    width: '42%',
                  },
                ]}
                customGradient={{ borderRadius: 12 }}
                text={'Ok'}
                textStyle={{ fontSize: 16, fontFamily: Fonts.bold }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={countryListModal}
        onRequestClose={() => setCountryListModal(false)}>
        <SafeAreaView style={{ backgroundColor: Colors.White, flex: 1 }}>
          <CountryCodes
            List={countryList}
            twoItems={true}
            hideCode
            onPress={item => {
              setNationality(item);
              setCountryListModal(false);
            }}
            closeModal={() => setCountryListModal(false)}
          />
        </SafeAreaView>
      </Modal>
      {loading && <Loader />}
    </>
  );
};

export default SaitaCardHyperKycForm;
const styles = StyleSheet.create({
  genderButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 55,
    borderRadius: 10,
    flexDirection: 'row',
  },
  genderText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.white,
    left: 10,
  },
  genderImage: {
    height: 17,
    width: 11,
    resizeMode: 'stretch',
  },
});
