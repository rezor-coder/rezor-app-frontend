/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, createRef} from 'react';
import {Dimensions, Share, TextInput} from 'react-native';
import {BorderLine, Wrap} from '../../common/index';
import {MainStatusBar, SimpleHeader, BasicButton} from '../../common';
import {Colors, Fonts, Images} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import styles from './QrCodeStyle';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Singleton from '../../../Singleton';
import QRCode from 'react-native-qrcode-image';
import Toast, {DURATION} from 'react-native-easy-toast';
import Clipboard from '@react-native-community/clipboard';
import * as constants from '../../../Constant';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {Actions} from 'react-native-router-flux';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';

var qrBase64 = '';
const QrCode = prop => {
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [publicAddress, setPublicAddress] = useState('');
  const [walletData, setwalletData] = useState(prop.item);
  const [disableButton, setDisabled] = useState(false);
  const toast = createRef();
  useEffect(() => {
    const add =
      prop.item.coin_family == 1
        ? Singleton.getInstance().defaultEthAddress
        : prop.item.coin_family == 6
        ? Singleton.getInstance().defaultBnbAddress
        : prop.item.coin_family == 11
        ? Singleton.getInstance().defaultBnbAddress
        : prop.item.coin_family == 3
        ? Singleton.getInstance().defaultTrxAddress
        : prop.item.coin_family == 4
        ? Singleton.getInstance().defaultStcAddress
        : Singleton.getInstance().defaultBtcAddress;

    setPublicAddress(add);
  }, [prop]);
  const shareAction = () => {
    try {
      const result = Share.share({
        message: `Please send  ${prop.item.coin_symbol.toUpperCase()} on ${publicAddress}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
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
          Actions.pop();
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
                  {prop.item?.coin_symbol?.toUpperCase()?.charAt(0)}
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
            {prop.item?.coin_image ? (
              <FastImage
                source={{uri: prop.item?.coin_image}}
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
                  {prop.item?.coin_symbol?.toUpperCase()?.charAt(0)}
                </Text>
              </View>
            )}
            <QRCode
              getBase64={base64 => {
                qrBase64 = base64;
              }}
              value={publicAddress}
              size={200}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
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
               setDisabled(true)
               setTimeout(() => {
                setDisabled(false)
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
