/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  Alert,
  Clipboard,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
  BackHandler
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from './EditContactStyle';
import { Wrap, BasicButton, BorderLine } from '../../common';
import LinearGradient from 'react-native-linear-gradient';
import { SimpleHeader } from '../../common/SimpleHeader';
import { Actions } from 'react-native-router-flux';
import { BasicInputBox } from '../../common/BasicInputBox';
import { Images, Colors } from '../../../theme/index';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { ButtonPrimary } from '../../common/ButtonPrimary';
import { editWalletContact } from '../../../Redux/Actions/ContactsAction';
import Singleton from '../../../Singleton';
import { connect } from 'react-redux';
import { ALPHABET_REGEX, APP_NAME, INVALID_BNB_CONTRACT_ADDRESS, INVALID_ETH_CONTRACT_ADDRESS, INVALID_MATIC_CONTRACT_ADDRESS, INVALID_TRX_CONTRACT_ADDRESS } from './../../../Constant';
import Loader from '../Loader/Loader';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import FastImage from 'react-native-fast-image';
import { CameraScreen } from 'react-native-camera-kit';
import { heightDimen, widthDimen } from '../../../Utils/themeUtils';
import QRReaderModal from '../../common/QRReaderModal';
let scanner = false
const EditContact = props => {
  const [contactName, setContactName] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [coinFamily, setCoinFamily] = useState('');
  const [network, setNetwork] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [Start_Scanner, setStart_Scanner] = useState(false);
  useEffect(() => {
    //  console.warn('MM','****************i walletData.decimals', props.walletData.decimals , props.walletData);
    props.navigation.addListener('didFocus', onScreenFocus);
    props.navigation.addListener('didBlur', onScreenBlur);
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
      Actions.pop(); 
      return true;
    }
  };
  useEffect(() => {
    let contactItem = props.contactItem;
    // //console.warn('MM','contactItem', contactItem);
    setContactName(contactItem.item.name);
    setContactAddress(contactItem.item.address);
    setNetwork(contactItem.item.network);
    return;
  }, []);

  // const onChangeNameText = text => {
  //   setContactName(text);
  // };

  const onChangeAddressText = text => {
    setContactAddress(text);
  };

  const editPressed = () => {
    // console.log(contactName?.trim()?.length);
    if (contactName?.trim()?.length == 0) {
      Singleton.showAlert('Name can not be empty');
      return;
    }

    if (contactName.trim().length < 3) {
      Singleton.showAlert('Invalid Name');
      return;
    }
    if (contactAddress.trim().length == 0) {
      Singleton.showAlert('Invalid Address');
      return;
    } else {


      if (network == 'tron') {
        if (Singleton.getInstance().validateTronAddress(contactAddress)) {
          setIsLoading(true);
          editContact();
        } else {
          Singleton.showAlert('Invalid Wallet Address');
        }
      } else
        if (network == 'bitcoin') {
          if (Singleton.getInstance().validateBTCAddress(contactAddress)) {
            setIsLoading(true);
            editContact();
          } else {
            Singleton.showAlert('Invalid Wallet Address');
          }
        } else {
          if (Singleton.getInstance().validateEthAddress(contactAddress)) {
            setIsLoading(true);
            editContact();
          } else {
            Singleton.showAlert('Invalid Wallet Address');
          }
        }
      // if (validateAddress(contactAddress)) {
      //   setIsLoading(true);
      //   editContact();
      // } else {
      //   Singleton.showAlert('Invalid Address');
      // }
    }
  };

  const editContact = () => {
    let data = {
      id: props.contactItem.item.id,
      address: contactAddress,
      network: network,
      name: contactName,
    };

    let access_token = Singleton.getInstance().access_token;

    props
      .editWalletContact({ data, access_token })
      .then(res => {
        setIsLoading(false);
        Alert.alert(
          APP_NAME,
          LanguageManager.contactEditedSuccessfully,
          [
            {
              text: 'OK',
              onPress: () => {
                Actions.pop();
              },
            },
          ],
          { cancelable: false },
        );
      })
      .catch(err => {
        setIsLoading(false)
        //console.warn('MM','Error', err);
        Alert.alert(
          APP_NAME,
          err?.message || LanguageManager.errorWhileEditingContact,
          [
            {
              text: 'OK',
              onPress: () => {
                // Actions.pop();
              },
            },
          ],
          { cancelable: false },
        );
      });
  };
  const qrClose = () => {
    let contactItem = props.contactItem;
    setStart_Scanner(false);
    scanner = false
    setContactAddress(contactItem ? contactItem.item.address : '');
  };
  const onQR_Code_Scan_Done = QR_Code => {
    setContactAddress(QR_Code);
    setStart_Scanner(false);
    scanner = false
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
            scanner = true
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
      scanner = true
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
            style={[styles.addressIcon, { padding: 15, alignSelf: 'flex-end' }]}>
            <FastImage
              style={{ width: 30, height: 30, marginRight: 10 }}
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
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <SimpleHeader
            title={LanguageManager.editContact}
            // rightImage={[styles.rightImgStyle]}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            back={false}
            backPressed={() => {
              // props.navigation.state.params.onGoBack();
              props.navigation.goBack();
            }}
          />
          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />
          <View style={styles.roundView}>
            <View style={styles.marginView}>
              <View style={styles.marginSubView}>
                <BasicInputBox
                  style={[
                    styles.inputBoxStyle,
                    { borderColor: ThemeManager.colors.viewBorderColor },
                  ]}
                  placeholder={LanguageManager.enterNameHere}
                  title={LanguageManager.nameYourContact}
                  width={'100%'}
                  maxLength={25}
                  mainStyle={{
                    borderColor: ThemeManager.colors.viewBorderColor,
                  }}
                  keyboardType={Platform.OS == 'ios' ? "ascii-capable" : "visible-password"}
                  onChangeText={text => {
                    if (ALPHABET_REGEX.test(text))
                      setContactName(text);
                  }}
                  text={contactName}
                />
              </View>
              <View style={styles.walletView}>
                <Text style={[styles.addWalletAddressText, {
                  color: ThemeManager.colors.textColor,
                }]}>
                  {LanguageManager.addWalletAddress}
                </Text>

                {/* <View
                  style={[
                    styles.addWalletView,
                    {
                      borderWidth: 1,
                      borderColor: ThemeManager.colors.textColor,
                    },
                  ]}> */}
                <View
                  style={[
                    styles.addressView,
                    { borderColor: ThemeManager.colors.viewBorderColor },
                  ]}>
                  <TextInput
                    placeholder={LanguageManager.address}
                    style={[
                      styles.textInputAddress,
                      { color: ThemeManager.colors.textColor },
                    ]}
                    placeholderTextColor={Colors.fadeDot}
                    onChangeText={text => onChangeAddressText(text)}
                    value={contactAddress}
                  />

                  <TouchableOpacity
                    onPress={() => open_QR_Code_Scanner()}
                    style={styles.scanView}>
                    <Image source={Images.scanner} style={styles.iconstyle} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => pastePressed()}
                    style={[styles.scanView, { marginRight: widthDimen(12) }]}>
                    <Image source={Images.icon_paste} style={styles.iconstyle} />
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    onPress={() => pastePressed()}
                    style={styles.scanView}>
                    <Text style={styles.pastetxt}>
                      {LanguageManager.paste}
                    </Text>
                  </TouchableOpacity> */}
                  {/* <TouchableOpacity
                    onPress={() => open_QR_Code_Scanner()}
                    style={styles.scanView}>
                    <Image
                      source={Images.scan}
                      style={[
                        styles.iconstyle,
                        { tintColor: ThemeManager.colors.textColor },
                      ]}
                    />
                  </TouchableOpacity> */}
                </View>
                {/* <View style={styles.line}></View> */}
              </View>

              <View style={styles.walletView}>
                <Text style={[styles.addWalletAddressText, {
                  color: ThemeManager.colors.textColor,
                }]}>
                  {"Network"}
                </Text>
                <View style={[styles.networkView, { borderColor: ThemeManager.colors.viewBorderColor }]}>
                  <Text style={[
                    styles.nettxt, { color: ThemeManager.colors.textColor }
                  ]}>
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </Text>

                </View>
                {/* </View> */}
              </View>
            </View>
            <View
              style={{
                justifyContent: 'flex-end',
                marginHorizontal: widthDimen(22),
                flex: 1,
              }}>
              <BasicButton
                onPress={() => editPressed()}
                btnStyle={styles.savebtn}
                text="Save"
                customGradient={{ borderRadius: heightDimen(25) }}
              />
            </View>
          </View>

          {isLoading && <Loader />}
        </Wrap >
      )}
    </>
  );
};

const mapStateToProp = state => {
  return {};
};

export default connect(mapStateToProp, { editWalletContact })(EditContact);
