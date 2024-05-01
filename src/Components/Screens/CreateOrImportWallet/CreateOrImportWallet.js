import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import {Wrap} from '../../common/Wrap';
import {Actions} from 'react-native-router-flux';
import images from '../../../theme/Images';
import {styles} from './CreateOrImportWalletStyle';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {BasicButton, MainStatusBar, LightButton} from '../../common';
import Singleton from '../../../Singleton';
import LottieView from 'lottie-react-native';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import {heightDimen, widthDimen} from '../../../Utils/themeUtils';
const windowHeight = Dimensions.get('window').height;

const CreateOrImportWallet = props => {
  const [btnColor, setBtnColor] = useState('');
  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      // if (Platform.OS == "android")
      // RNPreventScreenshot?.enabled(true)
      //MMconsole.warn('MM','did Blur called secure Wallet::::::');
      setBtnColor(Singleton.getInstance().dynamicColor);
    });
  }, []);

  const onProceed = () => {
    Actions.currentScene != 'CreateNewWallet' &&
      Actions.CreateNewWallet({isFrom: props.isFrom});
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
        {/* <TouchableOpacity
          style={styles.backTouchable}
          onPress={() => Actions.pop()}>
          <Image
            source={ThemeManager.ImageIcons.iconBack}
            style={styles.imgBackStyle}
          />
        </TouchableOpacity> */}
        {/* <ImageBackgroundComponent style={{ height: windowHeight }}> */}

        {/* <Text style={{color:colors.white}}>CreateWallet</Text> */}
        <View>
          {/* <Image style={[styles.imgSaitaPro, { height: Dimensions.get('window').height / 12 }]} source={images.SaitaPro} /> */}

          {/* <LottieView
          source={images.newAnimation}
          style={styles.BYsaita}
          autoPlay
          loop
        /> */}

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
              if (props.isFrom == 'multiWallet') {
                Actions.currentScene != 'MultiWalletOptions' &&
                  Actions.MultiWalletOptions({ isFrom: props.isFrom });
              } else {
                Actions.currentScene != 'ImportWallet' &&
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
            if (props.isFrom == 'multiWallet') {
              Actions.currentScene != 'MultiWalletOptions' &&
                Actions.MultiWalletOptions({isFrom: props.isFrom});
            } else {
              Actions.currentScene != 'ImportWallet' && Actions.ImportWallet();
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
