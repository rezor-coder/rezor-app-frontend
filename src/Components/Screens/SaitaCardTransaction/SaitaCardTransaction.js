/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, createRef } from 'react';
import { Dimensions, Share, TextInput, Modal } from 'react-native';
import { BorderLine, Wrap } from '../../common/index';
import { MainStatusBar, SimpleHeader, BasicButton } from '../../common';
import { Colors, Fonts, Images } from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import styles from './SaitaCardTransactionStyle';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import Singleton from '../../../Singleton';
import QRCode from 'react-native-qrcode-image';
import Toast, { DURATION } from 'react-native-easy-toast';
import Clipboard from '@react-native-community/clipboard';
import * as constants from '../../../Constant';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { Actions } from 'react-native-router-flux';

var qrBase64 = '';
const QrCode = prop => {

  const [publicAddress, setPublicAddress] = useState('');
  const [walletData, setwalletData] = useState(prop.item);

  const toast = createRef();
  useEffect(() => {
    const add = Singleton.getInstance().defaultEthAddress;
    setPublicAddress(add);
  }, [prop]);
  const shareAction = () => {
    try {
      const result = Share.share({
        message: `Please send amount on ${publicAddress}`,
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
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      {/* <MainStatusBar backgroundColor={Colors.black} barStyle="light-content" /> */}
      <MainStatusBar
        backgroundColor={ThemeManager.colors.backgroundColor}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <SimpleHeader
        title={"Confirm"}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle={{ marginRight: 30 }}
        imageShow
        back={false}
        backPressed={() => {

          Actions.pop();
        }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
      />
      <View style={[styles.innerContainer,]}>

        <View>

          <Text style={[styles.txtOne, { color: ThemeManager.colors.textColor }]}>From</Text>
          <Text style={[styles.txtTwo,]}>2ertgbmjbgbnddfnvdfmnd</Text>

          <Text style={[styles.txtOne, { color: ThemeManager.colors.textColor, marginTop: 20 }]}>To</Text>
          <Text style={[styles.txtTwo,]}>@bmjbgbnddfnvdfmnd</Text>

          <Text style={[styles.txtOne, { color: ThemeManager.colors.textColor, marginTop: 20 }]}>Network Fee</Text>
          <Text style={[styles.txtTwo,]}>0.00001 BTC/ $17,230.50</Text>

          <Text style={[styles.txtOne, { color: ThemeManager.colors.textColor, marginTop: 20 }]}>Total Value</Text>
          <Text style={[styles.txtTwo,]}>$17,830.50</Text>
        </View>

      </View>
      <View style={{ marginBottom: 30 }}>
        <BasicButton
          onPress={() => {
            Actions.jump("SaitaCardWelcome")
          }}
          btnStyle={styles.btnStyle}
          customGradient={[styles.customGrad]}


          text={"Continue"}
        />
      </View>



      <Toast ref={toast} />


    </Wrap>
  );
};

export default QrCode;
