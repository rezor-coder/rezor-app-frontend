import React, { createRef, useEffect } from 'react';
import {
  BackHandler,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import Toast from 'react-native-easy-toast';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import colors from '../../../theme/Colors';
import images from '../../../theme/Images';
import { Wrap } from '../../common/Wrap';
import { styles } from './FaceIDStyle';

const FaceID = props => {
  const toastRef = createRef();

  useEffect(() => {
    checkSensorAvailable();

    const backAction = () => {
      //console.warn('MM','i FaceID');
      goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const checkSensorAvailable = () => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        //console.warn('MM','TouchID is supported');
        bimetricPrompt();
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        //console.warn('MM','FaceID is supported');
        bimetricPrompt();
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        //console.warn('MM','Biometrics is supported');
        bimetricPrompt();
      } else {
        //console.warn('MM','Biometrics not supported');
      }
    });
  };
  const bimetricPrompt = () => {
    try {
      ReactNativeBiometrics.simplePrompt({
        promptMessage: LanguageManager.ConfirmPin,
      })
        .then(resultObject => {
          const { success } = resultObject;
          if (success) {
            toastRef.current.show(LanguageManager.Approved);
            setTimeout(() => {
              getCurrentRouteName() != 'CreatePIN' &&
              navigate(NavigationStrings.CreatePIN);
            }, 200);
            //console.warn('MM','successful biometrics provided');
          } else {
            //console.warn('MM','user cancelled biometric prompt');
          }
        })
        .catch(() => {
          //console.warn('MM','biometrics failed');
        });
    } catch (e) {
      //console.warn('MM','Device not Support Fingerprint');
    }
  };
  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <View style={styles.viewContainer}>
        <Text style={styles.faceIdText}>{props.bioType}</Text>
        <View>
          <Image source={images.faceID} style={styles.img} />
        </View>
        <Text style={styles.textApprove}></Text>
        <TouchableOpacity onPress={() => goBack()} style={styles.btnView2}>
          <Text style={{ color: colors.white, paddingHorizontal: 15 }}>
            {LanguageManager.Back}
          </Text>
        </TouchableOpacity>
      </View>
      <Toast
        ref={toastRef}
        positionValue={200}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={0.8}
        textStyle={{ color: '#fff', fontSize: 20 }}
      />
    </Wrap>
  );
};

export default FaceID;
