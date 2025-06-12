import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Text,
  View
} from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { heightDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import images from '../../../theme/Images';
import { BasicButton, LightButton, MainStatusBar } from '../../common';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import { Wrap } from '../../common/Wrap';
import { styles } from './CreateOrImportWalletStyle';
const windowHeight = Dimensions.get('window').height;

const CreateOrImportWallet = props => {
  const [btnColor, setBtnColor] = useState('');
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      // if (Platform.OS == "android")
      // RNPreventScreenshot?.enabled(true)
      //MMconsole.warn('MM','did Blur called secure Wallet::::::');
      setBtnColor(Singleton.getInstance().dynamicColor);
    });
  }, []);

  const onProceed = () => {
    getCurrentRouteName() != 'CreateNewWallet' &&
    navigate(NavigationStrings.CreateNewWallet,{isFrom: props?.route?.params?.isFrom});
  };

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />
      <View style={[styles.container,{backgroundColor: ThemeManager.colors.bg,}]}>
        <View>

          <View style={{marginTop: heightDimen(120)}}>
            <LottieView
              source={images.animRound}
              style={[
                styles.centerLottie,
                {
                  height: heightDimen(242),
                  width: heightDimen(242),
                },
              ]}
              autoPlay
              loop
            />
          </View>
          <Text
            style={[
              styles.txtEaseToUse,
              {color: ThemeManager.colors.headingText},
            ]}>
            {LanguageManager.easeToUse}
          </Text>

          <Text style={styles.txtAllTx}>{LanguageManager.allTxMultCrpt}</Text>

          {/* <TouchableOpacity
            style={{
              padding: 4, backgroundColor: 'red',
              paddingHorizontal: widthDimen(22),
              height: 50,
              alignSelf: 'center',
              textAlign: 'center',
              justifyContent: 'center'
            }}
            onPress={() => {
              if (props?.route?.params?.isFrom == 'multiWallet') {
                getCurrentRouteName() != 'MultiWalletOptions' &&
                  Actions.MultiWalletOptions({ isFrom: props?.route?.params?.isFrom });
              } else {
                getCurrentRouteName() != 'ImportWallet' &&
                  Actions.ImportWallet();
              }
            }}>
            <Text
              style={[
                styles.txtImportWallet,
                { color: ThemeManager.colors.textColor },
              ]}>
              {LanguageManager.importYourWallet}
            </Text>
          </TouchableOpacity> */}
        </View>
        <BasicButton
          onPress={() => {
            onProceed();
          }}
          // colors={btnColor}
          btnStyle={styles.btnStyle}
          customGradient={styles.customGrad}
          text="Create New Wallet"
        />

        <LightButton
          onPress={() => {
            if (props?.route?.params?.isFrom == 'multiWallet') {
              getCurrentRouteName() != 'MultiWalletOptions' &&
                navigate(NavigationStrings.MultiWalletOptions,{isFrom: props?.route?.params?.isFrom});
            } else {
              getCurrentRouteName() != 'ImportWallet' && navigate(NavigationStrings.ImportWallet);
            }
          }}
          // colors={btnColor}
          btnStyle={styles.importBtnStyle}
          customGradient={styles.customGrad}
          text={LanguageManager.importYourWallet}
        />
        {/* </ImageBackgroundComponent> */}
      </View>
    </Wrap>
  );
};

export default CreateOrImportWallet;
