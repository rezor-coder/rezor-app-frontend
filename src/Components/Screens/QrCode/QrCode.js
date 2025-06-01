/* eslint-disable react-native/no-inline-styles */
import Clipboard from '@react-native-community/clipboard';
import React, {createRef, useEffect, useState, useRef} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-easy-toast';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
// import QRCode from 'react-native-qrcode-image';
import QRCode from 'react-native-qrcode-svg';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import Singleton from '../../../Singleton';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {Colors, Fonts, Images} from '../../../theme';
import {MainStatusBar, SimpleHeader} from '../../common';
import {BorderLine, Wrap} from '../../common/index';
import styles from './QrCodeStyle';
import {goBack} from '../../../navigationsService';

const QrCode = props => {
  const qrCodeRef = useRef(null);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [publicAddress, setPublicAddress] = useState('');
  const [walletData, setwalletData] = useState(props.route?.params?.item);
  const [disableButton, setDisabled] = useState(false);
  const toast = createRef();
  useEffect(() => {
    const add =
      props.route?.params?.item.coin_family == 1
        ? Singleton.getInstance().defaultEthAddress
        : props.route?.params?.item.coin_family == 6
        ? Singleton.getInstance().defaultBnbAddress
        : props.route?.params?.item.coin_family == 11
        ? Singleton.getInstance().defaultBnbAddress
        : props.route?.params?.item.coin_family == 3
        ? Singleton.getInstance().defaultTrxAddress
        : props.route?.params?.item.coin_family == 4
        ? Singleton.getInstance().defaultStcAddress
        : props.route?.params?.item.coin_family == 8
        ? Singleton.getInstance().defaultSolAddress
        : Singleton.getInstance().defaultBtcAddress;

    setPublicAddress(add);
  }, [props.route?.params?.item]);
  const shareAction = () => {
    try {
      if (qrCodeRef.current) {
        qrCodeRef.current.toDataURL(dataURL => {
          const shareOptions = {
            message: `My Public Address to Receive  ${props.route?.params?.item.coin_symbol.toUpperCase()}  ${publicAddress}`,
            url: `data:image/png;base64,${dataURL}`,
          };
          Share.open(shareOptions);
        });
      }
      // const result = Share.share({
      //   message: `Please send  ${props.route?.params?.item.coin_symbol.toUpperCase()} on ${publicAddress}`,
      // });
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //   } else {
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   // dismissed
      // }
    } catch (error) {
      Singleton.showAlert(error.message);
    }
  };
  const copyAction = () => {
    //console.warn('MM','---------', publicAddress);
    Clipboard.setString(publicAddress);
    toast.current.show(constants.COPIED);
  };
  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      {/* <MainStatusBar backgroundColor={Colors.black} barStyle="light-content" /> */}
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <SimpleHeader
        titleStyle={{
          textTransform: 'none',
        }}
        title={
          LanguageManager.receive + ' ' + walletData.coin_symbol?.toUpperCase()
        }
        backImage={ThemeManager.ImageIcons.iconBack}
        imageShow
        back={false}
        backPressed={() => {
          goBack();
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <View
        style={[styles.innerContainer, {opacity: showAmountModal ? 0.2 : 1}]}>
        <TouchableOpacity
          disabled
          style={{
            borderColor: ThemeManager.colors.viewBorderColor,
            backgroundColor: ThemeManager.colors.backgroundColor,
            borderRadius: 100,
            borderWidth: 1,
            height: heightDimen(50),
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: heightDimen(30),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingStart: 16,
            }}>
            {walletData?.coin_image ? (
              <FastImage
                style={{
                  height: areaDimen(30),
                  width: areaDimen(30),
                  borderRadius: 100,
                }}
                source={{
                  uri: walletData?.coin_image,
                }}
              />
            ) : (
              <View
                style={{
                  height: areaDimen(30),
                  width: areaDimen(30),
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: ThemeManager.colors.primary,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.bold,
                    fontSize: areaDimen(14),
                  }}>
                  {props.route?.params?.item?.coin_symbol
                    ?.toUpperCase()
                    ?.charAt(0)}
                </Text>
              </View>
            )}

            <Text
              style={{color: ThemeManager.colors.textColor, marginStart: 8}}>
              {walletData?.coin_symbol.toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.qrCode_wrap}>
          <View style={styles.qrCode_holder}>
            {props.route?.params?.item?.coin_image ? (
              <FastImage
                source={{uri: props.route?.params?.item?.coin_image}}
                style={{
                  position: 'absolute',
                  height: areaDimen(50),
                  width: areaDimen(50),
                  backgroundColor: ThemeManager.colors.bg,
                  borderRadius: 100,
                  borderWidth: 5,
                  borderColor: ThemeManager.colors.bg,
                  zIndex: 9999,
                  top: -areaDimen(45 / 2),
                }}
              />
            ) : (
              <View
                style={{
                  position: 'absolute',
                  height: areaDimen(50),
                  width: areaDimen(50),
                  backgroundColor: ThemeManager.colors.primary,
                  borderRadius: 100,
                  borderWidth: 5,
                  borderColor: ThemeManager.colors.bg,
                  zIndex: 9999,
                  top: -areaDimen(45 / 2),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.bold,
                    fontSize: areaDimen(18),
                  }}>
                  {props.route?.params?.item?.coin_symbol
                    ?.toUpperCase()
                    ?.charAt(0)}
                </Text>
              </View>
            )}
            {publicAddress && (
              <QRCode
                // getBase64={base64 => {
                //   qrBase64 = base64;
                // }}
                getRef={qrCodeRef}
                value={publicAddress}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            )}
          </View>
          <Text
            style={{
              color: ThemeManager.colors.stakeColor,
              fontSize: 12,
              fontFamily: Fonts.regular,
              marginTop: 11,
            }}>
            {`${
              'For ' + walletData?.coin_symbol.toUpperCase() + ' deposit only'
            }`}
          </Text>
        </View>
        <View style={styles.publicAddressWrapStyle}>
          <Text
            style={[
              styles.publicAddressText,
              {color: ThemeManager.colors.textColor},
            ]}>
            {LanguageManager.publicAddress}
          </Text>
          <Text
            style={[
              styles.publicAddressStyle,
              {color: ThemeManager.colors.inActiveColor},
            ]}>
            {publicAddress}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: heightDimen(50),
          }}>
          <View>
            <TouchableOpacity
              disabled={disableButton}
              onPress={() => {
                setDisabled(true);
                setTimeout(() => {
                  setDisabled(false);
                }, 1000);
                shareAction();
              }}
              style={[
                styles.copyBtn,
                {
                  backgroundColor: ThemeManager.colors.primary,
                },
              ]}>
              <Image
                style={[styles.imgCopyInside, {tintColor: Colors.white}]}
                source={Images.share}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.heading,
                {
                  color: ThemeManager.colors.inActiveColor,
                  fontFamily: Fonts.semibold,
                  marginStart: 6,
                  marginTop: heightDimen(5),
                  fontSize: areaDimen(12),
                },
              ]}>
              Share
            </Text>
          </View>

          <View style={{marginLeft: widthDimen(30)}}>
            <TouchableOpacity
              onPress={() => {
                copyAction();
              }}
              style={[
                styles.copyBtn,
                {
                  backgroundColor: ThemeManager.colors.primary,
                },
              ]}>
              <Image
                style={[styles.imgCopyInside, {tintColor: Colors.white}]}
                source={Images.IconCopyInside}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.heading,
                {
                  color: ThemeManager.colors.inActiveColor,
                  fontFamily: Fonts.semibold,
                  marginStart: 6,
                  marginTop: heightDimen(5),
                  fontSize: areaDimen(12),
                },
              ]}>
              {LanguageManager.copy}
            </Text>
          </View>
        </View>
      </View>

      {showAmountModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>
              {LanguageManager.setAmount}
            </Text>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalContentHeaderText}>
              {LanguageManager.setAmount}
            </Text>
            <TextInput
              style={styles.amountInputBox}
              onChangeText={text => {
                //  console.warn('MM',text)
              }}
              placeholder="2"
              placeholderTextColor={Colors.white}
            />
            <TouchableOpacity
              onPress={() => setShowAmountModal(false)}
              style={[styles.button, styles.doneBtn]}>
              <Text style={styles.buttonText}>{LanguageManager.done}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* {
                    showAmountModal && <BasicModal></BasicModal>
                } */}

      <Toast ref={toast} />
    </Wrap>
  );
};

export default QrCode;
