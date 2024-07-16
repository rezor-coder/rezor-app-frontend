/* eslint-disable react-native/no-inline-styles */
import Clipboard from '@react-native-community/clipboard';
import React, { createRef, useEffect, useState } from 'react';
import { Share, Text, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { goBack, navigate } from '../../../navigationsService';
import { BasicButton, MainStatusBar, SimpleHeader } from '../../common';
import { BorderLine, Wrap } from '../../common/index';
import styles from './SaitaCardTransactionStyle';

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

          goBack();
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
            navigate(NavigationStrings.SaitaCardWelcome)
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
