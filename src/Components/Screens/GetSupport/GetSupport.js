/* eslint-disable react/self-closing-comp */
/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, createRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  Linking,
  Platform,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from './GetSupportStyle';
import {Colors, Images} from '../../../theme';
import {
  ButtonPrimary,
  BasicInputBox,
  Wrap,
  ThankYouModal,
  SimpleHeader,
  BasicButton,
  BorderLine,
} from '../../common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {
  saveSupportRequest,
  uploadImage,
} from '../../../Redux/Actions/SupportRequestAction';
import Singleton from '../../../Singleton';
import Loader from '../Loader/Loader';
import {APP_NAME, VALID_NAME_CONTACT} from '../../../Constant';
import {validateEmail} from '../../../utils';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import fonts from '../../../theme/Fonts';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {Keyboard, KeyboardEvent} from 'react-native';
const GetSupport = props => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [walletAddress, setwalletAddress] = useState('');
  const [transactionLinks, setTransactionLinks] = useState('');
  const actionSheetRef = createRef();

  useEffect(() => {
    const backAction = () => {
      Actions.pop();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    function onKeyboardDidShow(e) {
      setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );
    return () => {
      backHandler.remove();
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const sendSupportRequest = () => {
    if (name.trim() == '') {
      Singleton.showAlert(LanguageManager.nameFieldIsRequired);
      return;
    }

    if (name.trim().length < 3) {
      Singleton.showAlert(VALID_NAME_CONTACT);
      return;
    }
    if (subject.trim() == '') {
      Singleton.showAlert(LanguageManager.subjectFieldIsRequired);
      return;
    }

    if (subject.trim().length < 3) {
      Singleton.showAlert('Subject should have minimum of 3 characters');
      return;
    }

    if (message.trim() == '') {
      Singleton.showAlert(LanguageManager.messageFieldIsRequired);
      return;
    }

    if (message.trim().length < 3) {
      Singleton.showAlert('Message should have minimum of 3 characters');
      return;
    }

    if (walletAddress.trim() == '') {
      Singleton.showAlert(LanguageManager.addressFieldIsRequired);
      return;
    }
    let isEthValid = Singleton.getInstance().validateEthAddress(walletAddress);
    let isTronValid =
      Singleton.getInstance().validateTronAddress(walletAddress);
    let isBTCValid = Singleton.getInstance().validateBTCAddress(walletAddress);
    if (!(isEthValid || isTronValid || isBTCValid)) {
      Singleton.showAlert(LanguageManager.invalidAddress);
      return;
    }

    if (transactionLinks.trim() == '') {
      Singleton.showAlert(LanguageManager.transactionLinkRequired);
      return;
    }
    let urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
    if (urlRegex.test(transactionLinks) == false) {
      Singleton.showAlert('Please provide valid link.');
      return;
    }
    if (selectedImageUrl == '') {
      Singleton.showAlert(LanguageManager.attachScreenshotsRequired);
      return;
    }

    let data = {
      name: name,
      email: 'info@saitachain.com',
      subject: subject,
      message: message,
      address: walletAddress,
      transaction_link: transactionLinks,
      image_url: selectedImageUrl,
    };

    let access_token = Singleton.getInstance().access_token;

    setIsLoading(true);

    props
      .saveSupportRequest({data, access_token})
      .then(res => {
        setIsLoading(false);
        Linking.openURL(
          `mailto:info@saitachain.com?subject=${subject}&body=Name: ${name}\nMessage: ${message}\nWalletAddress: ${walletAddress}\nLink: ${transactionLinks}\nImage: ${selectedImageUrl}`,
        );
        Actions.pop();
      })
      .catch(err => {
        Alert.alert(
          APP_NAME,
          LanguageManager.errorWhileSendingRequest,
          [
            {
              text: 'OK',
              onPress: () => {
                Actions.currentScene != 'Dashboard' && Actions.Dashboard();
              },
            },
          ],
          {cancelable: false},
        );
      });
  };

  const uploadSupportImage = file => {
    const data = {
      name: 'file',
      filename: `img${Date.now() + Math.random()}.png`,
      type: 'image/png',
      data: file,
    };
    let access_token = Singleton.getInstance().access_token;
    setIsLoading(true);
    props
      .uploadImage({data, access_token})
      .then(res => {
        setIsLoading(false);
        setSelectedImageUrl(res.Location);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const camera = () => {
    global.isCamera = true;
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      compressImageQuality: Platform.OS == 'ios' ? 0.1 : 0.4,
    }).then(image => {
      global.isCamera = true;
      setImageUri(`data:${image?.mime};base64,${image?.data}`);
      uploadSupportImage(image?.data);
    });
  };
  const gallery = () => {
    global.isCamera = true;
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      compressImageQuality: Platform.OS == 'ios' ? 0.1 : 0.4,
    }).then(image => {
      global.isCamera = true;
      setImageUri(`data:${image?.mime};base64,${image?.data}`);
      uploadSupportImage(image?.data);
    });
  };

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      <SimpleHeader
        title={LanguageManager.getSupport} //getInTouch}
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
      <KeyboardAwareScrollView bounces={false}>
        <View
          style={[
            styles.container,
            {
              opacity: modalVisible ? 0.05 : 1,
              marginBottom:
                Platform.OS == 'ios'
                  ? heightDimen(-10)
                  : keyboardHeight - heightDimen(20),
            },
          ]}>
          <View
            style={{
              marginTop: heightDimen(14),
              alignItems: 'flex-start',
              marginHorizontal: widthDimen(22),
            }}>
            <Text
              style={[
                styles.textSimple,
                {color: ThemeManager.colors.lightTextColor},
              ]}>
              {LanguageManager.supportLine}
            </Text>
          </View>
          <View
            style={{
              dislay: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: heightDimen(4),
              marginHorizontal: widthDimen(22),
            }}>
            <BasicInputBox
              titleStyle={{color: ThemeManager.colors.textColor}}
              title={LanguageManager.name}
              maxLength={20}
              text={name}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              onChangeText={text => {
                let regx = /^[a-zA-Z ]*$/
                if(regx.test(text)){
                  setname(text)
                }
               }}
              width="100%"
              placeholder={LanguageManager.name}
            />
            <BasicInputBox
              titleStyle={{color: ThemeManager.colors.textColor}}
              title={LanguageManager.email}
              editable={false}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              text={'info@saitachain.com'}
              onChangeText={text => setEmail(text)}
              width="100%"
              placeholder={LanguageManager.email}></BasicInputBox>
            <BasicInputBox
              titleStyle={{color: ThemeManager.colors.textColor}}
              title={LanguageManager.subject}
              maxLength={100}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              onChangeText={text => setSubject(text)}
              width="100%"
              text={subject}
              placeholder={LanguageManager.subject}></BasicInputBox>
            <BasicInputBox
              titleStyle={{color: ThemeManager.colors.textColor}}
              title={LanguageManager.message}
              onChangeText={text => setMessage(text)}
              width="100%"
              text={message}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              placeholder={LanguageManager.message}></BasicInputBox>
            <BasicInputBox
              titleStyle={{color: ThemeManager.colors.textColor}}
              maxLength={92}
              title={LanguageManager.walletAddress}
              onChangeText={text => setwalletAddress(text)}
              width="100%"
              text={walletAddress}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              placeholder={LanguageManager.walletAddress}></BasicInputBox>
            <BasicInputBox
              titleStyle={{color: ThemeManager.colors.textColor}}
              title={LanguageManager.transactionLinks}
              onChangeText={text => setTransactionLinks(text)}
              width="100%"
              text={transactionLinks}
              mainStyle={{borderColor: ThemeManager.colors.inputBoxColor}}
              placeholder={LanguageManager.transactionLinks}></BasicInputBox>
          </View>
          <View
            style={{
              alignSelf: 'flex-start',
              marginTop: heightDimen(20),
              marginHorizontal: widthDimen(22),
            }}>
            <Text
              style={[
                styles.attachStatementText,
                {color: ThemeManager.colors.textColor},
              ]}>
              {LanguageManager.attachScreenshots}{' '}
            </Text>
          </View>
          <View
            style={{
              height: heightDimen(imageUri ? 240 : 112),
              width: widthDimen(370),
              backgroundColor: ThemeManager.colors.mnemonicsView,
              borderRadius: heightDimen(16),
              marginTop: heightDimen(10),
              justifyContent: 'center',
              borderColor: ThemeManager.colors.viewBorderColor,
              borderWidth: 1,
            }}>
            <TouchableOpacity
              onPress={() => actionSheetRef.current.show()}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                height: '100%',
                width: '100%',
              }}>
              {imageUri ? (
                <Image
                  source={{uri: imageUri}}
                  resizeMode="contain"
                  style={{width: '90%', height: heightDimen(200)}}
                />
              ) : (
                <>
                  <Image
                    style={{
                      textAlign: 'center',
                      marginBottom: heightDimen(7),
                    }}
                    source={Images.upload_file_icon}
                  />
                  <View>
                    <Text
                      style={[
                        styles.forgotPassText,
                        {color: ThemeManager.colors.lightTextColor},
                      ]}>
                      Upload Screenshot
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>
          <ActionSheet
            ref={actionSheetRef}
            title={'Select Option'}
            options={[
              LanguageManager.takePhoto,
              LanguageManager.chooseFromGallery,
              LanguageManager.cancel,
            ]}
            cancelButtonIndex={2}
            onPress={index => {
              if (index == 0) {
                camera();
              }
              if (index == 1) {
                gallery();
              }
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: widthDimen(45),
              paddingBottom: widthDimen(30),
              marginHorizontal: widthDimen(20),
            }}>
            <TouchableOpacity
              onPress={() =>
                Actions.currentScene != 'Dashboard' && Actions.Dashboard()
              }
              style={{
                height: widthDimen(60),
                width: widthDimen(175),
                backgroundColor:ThemeManager.colors.themeColor=='dark'? Colors.fadeDot:'#D9D9D9',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: widthDimen(50),
                marginRight: widthDimen(10),
              }}>
              <Text
                style={{
                  fontSize: areaDimen(16),
                  color: ThemeManager.colors.textColor,
                  fontFamily: fonts.semibold,
                }}>
                {LanguageManager.cancel}
              </Text>
            </TouchableOpacity>
            <BasicButton
              onPress={() => {
                sendSupportRequest();
              }}
              btnStyle={{
                flex: 1,
                marginHorizontal: 10,
                height: widthDimen(50),
                justifyContent: 'center',
              }}
              customGradient={{
                borderRadius: widthDimen(50),
                width: widthDimen(175),
              }}
              text={LanguageManager.send}
              textStyle={{fontSize: 14, fontFamily: fonts.semibold}}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {modalVisible && <ThankYouModal></ThankYouModal>}
      {isLoading && <Loader />}
    </Wrap>
  );
};

const mapStateToProp = state => {
  return {};
};

export default connect(mapStateToProp, {saveSupportRequest, uploadImage})(
  GetSupport,
);
