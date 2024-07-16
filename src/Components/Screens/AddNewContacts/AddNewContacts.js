/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Clipboard,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { saveWalletContact } from '../../../Redux/Actions/ContactsAction';
import Singleton from '../../../Singleton';
import { Colors, Images } from '../../../theme/index';
import { BasicButton, BorderLine, Wrap } from '../../common';
import { BasicInputBox } from '../../common/BasicInputBox';
import { SimpleHeader } from '../../common/SimpleHeader';
import Loader from '../Loader/Loader';
import { APP_NAME, NEW_NAME_REGX } from './../../../Constant';
import { styles } from './AddNewContactsStyle';
// import {CameraScreen} from 'react-native-camera-kit';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { goBack, navigate } from '../../../navigationsService';
import QRReaderModal from '../../common/QRReaderModal';
let scanner = false
const AddNewContacts = props => {
  const [contactName, setContactName] = useState('');
  const [contactAddress, setContactAddress] = useState(
    props?.route?.params?.address ? props?.route?.params?.address : '',
  );
  const [coinFamily, setCoinFamily] = useState('');
  const [network, setNetwork] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [Start_Scanner, setStart_Scanner] = useState(false);
  const setNetworkState = () => {
    let coinFamily = props?.route?.params?.coinFamily ? props?.route?.params?.coinFamily : 1;
    setCoinFamily(props?.route?.params?.coinFamily);
    switch (coinFamily) {
      case 1:
        setNetwork('ethereum');
        break;
      case 6:
        setNetwork('binance');
        break;
      case 11:
        setNetwork('polygon');
        break;
      case 3:
        setNetwork('tron');
        break;
        case 4:
          setNetwork('saitachain');
          break;
      default:
        setNetwork('bitcoin');
    }
  };
  useEffect(() => {
    //  console.warn('MM','****************i walletData.decimals', props.walletData.decimals , props.walletData);
    props.navigation.addListener('focus', onScreenFocus);
    props.navigation.addListener('blur', onScreenBlur);
  }, [props]);

  const onScreenFocus = () => {
    console.log("onScreenFocus----------------------FOCUS")
    BackHandler.addEventListener('hardwareBackPress', backAction);
  };
  const onScreenBlur = () => {
    console.log("onScreenFocus----------------------BLUR")
    BackHandler.removeEventListener('hardwareBackPress', backAction);
  };
  const backAction = () => {
    console.log("Start_Scanner::::",scanner);
    if(scanner){
     setStart_Scanner(false)
     scanner=false
     return true;
    } else{
      goBack(); 
      return true;
    }
  };
  useEffect(() => {
    setNetworkState();
    return;
  }, []);
  // const onChangeNameText = text => {
  //   if(ALPHABET_REGEX.test(text))
  //   setContactName(text);
  // };
  const onChangeAddressText = text => {
    setContactAddress(text);
  };
  const savePressed = () => {
    console.log(contactName);
    if (contactName?.trim()?.length == 0) {
      Singleton.showAlert('Name can not be empty');
      return;
    }

    if (contactName.trim().length < 3) {
      Singleton.showAlert('Name should be of atleast 3 words');
      return;
    }
    if (contactAddress.trim().length == 0) {
      Singleton.showAlert('Please Add Wallet Address');
      return;
    } else {
      if (network == 'tron') {
        if (Singleton.getInstance().validateTronAddress(contactAddress)) {
          setIsLoading(true);
          saveContact();
        } else {
          Singleton.showAlert('Invalid Wallet Address');
        }
      } else if (network == 'bitcoin') {
        if (Singleton.getInstance().validateBTCAddress(contactAddress)) {
          setIsLoading(true);
          saveContact();
        } else {
          Singleton.showAlert('Invalid Wallet Address');
        }
      } else {
        if (Singleton.getInstance().validateEthAddress(contactAddress)) {
          setIsLoading(true);
          saveContact();
        } else {
          Singleton.showAlert('Invalid Wallet Address');
        }
      }
    }
  };
  const saveContact = () => {
    let data = {
      address: contactAddress,
      network: network,
      name: contactName,
    };
    console.log(data);
    let access_token = Singleton.getInstance().access_token;
    props
      .saveWalletContact({data, access_token})
      .then(res => {
        setIsLoading(false);
        Alert.alert(
          APP_NAME,
          'Contact saved successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                props?.route?.params?.isPop ? goBack(): navigate(NavigationStrings.Wallet)
                
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert(
          APP_NAME,
          err.message,
          [
            {
              text: 'OK',
              onPress: () => {
                // getCurrentRouteName() != 'Dashboard' && Actions.Dashboard();
              },
            },
          ],
          {cancelable: false},
        );
      });
  };
  const qrClose = () => {
    setStart_Scanner(false);
    scanner=false
  };
  const onQR_Code_Scan_Done = QR_Code => {
    setContactAddress(QR_Code);
    setStart_Scanner(false);
    scanner=false
  };
  const open_QR_Code_Scanner = () => {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera App Permission',
              message: 'Saita Pro App needs access to your camera ',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setContactAddress('');
            setStart_Scanner(true);
            scanner=true
          } else {
            Singleton.showAlert('CAMERA permission denied');
          }
        } catch (err) {
          Singleton.showAlert('Camera permission err', err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      setContactAddress('');
      setStart_Scanner(true);
      scanner=true
    }
  };

  const pastePressed = () => {
    Clipboard.getString().then(res => {
      setContactAddress(res);
    });
  };
  return (
    <>
      {Start_Scanner && (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.black,
            paddingTop: Platform.OS == 'ios' ? 20 : 0,
          }}>
             <QRReaderModal
          visible={Start_Scanner}
          setvisible={(data)=>{
            setStart_Scanner(data);
            scanner=data
          }}
          onCodeRead={onQR_Code_Scan_Done}
        />
          {/* <TouchableOpacity
            onPress={() => qrClose()}
            style={[styles.addressIcon]}>
            <FastImage
              style={styles.imgStyle}
              resizeMode={FastImage.resizeMode.contain}
              source={Images.modal_close_icon}
            />
          </TouchableOpacity>
          <CameraScreen
            showFrame={true}
            scanBarcode={true}
            laserColor={'#FF3D00'}
            frameColor={'#00C853'}
            colorForScannerFrame={'black'}
            onReadCode={event => {
              onQR_Code_Scan_Done(event.nativeEvent.codeStringValue);
            }}
          /> */}
        </SafeAreaView>
      )}
      {!Start_Scanner && (
        <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
          <SimpleHeader
            title={LanguageManager.addNewContact}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            back={false}
            backPressed={() => {
              props.navigation.goBack();
            }}
          />
          <BorderLine
            borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
          />

          <View style={styles.roundView}>
            <View style={styles.marginView}>
              <View style={styles.marginSubView}>
                <BasicInputBox
                  style={[
                    styles.inputBoxStyle,
                    {borderColor: ThemeManager.colors.viewBorderColor},
                  ]}
                  maxLength={25}
                  mainStyle={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                  }}
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  text={contactName}
                  placeholder={LanguageManager.enterNameHere}
                  title={LanguageManager.nameYourContact}
                  width={'100%'}
                  onChangeText={text => {
                    if (text != '') {
                      if (NEW_NAME_REGX.test(text)) {
                        setContactName(text);
                      }
                    } else {
                      setContactName(text);
                    }
                  }}
                />
              </View>
              <View style={styles.walletView}>
                <Text
                  style={[
                    styles.addWalletAddressText,
                    {
                      color: ThemeManager.colors.textColor,
                    },
                  ]}>
                  {LanguageManager.addWalletAddress}
                </Text>
                {/* <View
                  style={[
                    styles.addWalletView, {
                      backgroundColor: ThemeManager.colors.mnemonicsView,
                    }]}> */}
                <View
                  style={[
                    styles.addressView,
                    {borderColor: ThemeManager.colors.viewBorderColor},
                  ]}>
                  <TextInput
                    placeholder={LanguageManager.address}
                    style={[
                      styles.textInputAddress,
                      {color: ThemeManager.colors.textColor},
                    ]}
                    value={contactAddress}
                    placeholderTextColor={Colors.languageItem}
                    onChangeText={text => onChangeAddressText(text)}
                  />

                  <TouchableOpacity
                    onPress={() => open_QR_Code_Scanner()}
                    style={styles.scanView}>
                    <Image source={Images.scanner} style={styles.iconstyle} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => pastePressed()}
                    style={[styles.scanView, {marginRight: widthDimen(12)}]}>
                    <Image
                      source={Images.icon_paste}
                      style={styles.iconstyle}
                    />
                    {/* <Text style={styles.pastetxt}>
                      {LanguageManager.paste}
                    </Text> */}
                  </TouchableOpacity>
                </View>
                {/* <View style={styles.line} /> */}
              </View>

              <View style={styles.walletView}>
                <Text
                  style={[
                    styles.addWalletAddressText,
                    {
                      color: ThemeManager.colors.textColor,
                    },
                  ]}>
                  {'Network'}
                </Text>
                <View
                  style={[
                    styles.networkView,
                    {borderColor: ThemeManager.colors.viewBorderColor},
                  ]}>
                  <Text
                    style={[
                      styles.nettxt,
                      {color: ThemeManager.colors.textColor},
                    ]}>
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </Text>
                </View>
                {/* </View> */}
              </View>
            </View>
            <View style={styles.basicView}>
              <BasicButton
                onPress={() => savePressed()}
                btnStyle={styles.savebtn}
                text={LanguageManager.saveContact}
                // customGradient={{ borderRadius: heightDimen(25) }}
                customGradient={{
                  borderRadius: heightDimen(100),
                }}
              />
            </View>
          </View>
          {isLoading && <Loader />}
        </Wrap>
      )}
    </>
  );
};

const mapStateToProp = state => {
  return {};
};

export default connect(mapStateToProp, {saveWalletContact})(AddNewContacts);
