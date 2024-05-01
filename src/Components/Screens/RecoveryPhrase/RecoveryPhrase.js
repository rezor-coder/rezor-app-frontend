import React, { useState, useEffect, createRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  BackHandler,
  ScrollView,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { Wrap } from '../../common/Wrap';
import {
  BasicButton,
  BorderLine,
  SimpleHeader,
  SubHeader,
} from '../../common';
import { Actions } from 'react-native-router-flux';
import colors from '../../../theme/Colors';
import { DotPagination } from '../../common/DotPagination';
import { FlatList } from 'react-native-gesture-handler';
import { styles } from './RecoveryPhraseStyle';
import { Multibtn } from '../../common/Multibtn';
import { Fonts } from '../../../theme';
import { connect, useSelector } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as Constants from '../../../Constant';
import Singleton from '../../../Singleton';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import images from '../../../theme/Images';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import { areaDimen, heightDimen } from '../../../Utils/themeUtils';
import fonts from '../../../theme/Fonts';

const windowHeight = Dimensions.get('window').height;
const RecoveryPhrase = props => {
  const [copiedText, setCopiedText] = useState(['']);
  const [mnemonicArr, setMnemonicArray] = useState(['']);
  const [mnemonics, setMnemonics] = useState(['']);
  //   const mnemonics = useSelector(state => state?.createWalletReducer?.walletData?.mnemonics)
  const toastRef = createRef();
  const [PrvtKey, setPrvtKey] = useState('');
  const [IsPrvtKey, setIsPrvtKey] = useState(false);

  useEffect(() => {
    let backHandle = null;
    backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
    let focus = props.navigation.addListener('didFocus', () => {
      // if (Platform.OS == "android")
      // RNPreventScreenshot?.enabled(true)
      //  console.warn('MM','did Focus called recovery phrase::::::');
      backHandle = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    });
    let blur = props.navigation.addListener('didBlur', () => {
      if (Platform.OS == "android")
        RNPreventScreenshot?.enabled(false)
      //  console.warn('MM','did Blur called recovery phrase::::::');
      backHandle?.remove();
    });


    return () => {
      if (focus) {
        focus?.remove()
      }
      if (blur) {
        blur?.remove()
      }
      if (backHandle) {
        backHandle?.remove()
      }
    }

  }, [props]);

  const backAction = () => {
    //Actions.jump('BackupOptions');
    props.screenType == 'Editwallet'
      ? Actions.jump('EditWallet')
      : Actions.jump('BackupOptions');
    return true;
  };
  useEffect(() => {
    if (props.screenType == 'Editwallet') {
      //console.warn('MM','>>>>>>walletItem', props.walletItem);
      if (props.walletItem.privateKey == undefined) {
        let mnemonics = props.walletItem?.mnemonics;
        setIsPrvtKey(false);
        setMnemonics(mnemonics);
        let mnemonicArr = mnemonics ? mnemonics.split(' ') : [];
        setMnemonicArray(mnemonicArr);
      } else {
        setPrvtKey(props.walletItem.privateKey);
        setIsPrvtKey(true);
      }
      // let mnemonics = await Singleton.getInstance().getData( response.defaultEthAddress,);
      //   if (mnemonics == null) {
      //     Singleton.getInstance()
      //       .getData(`${Singleton.getInstance().defaultEthAddress}_pk`)
      //       .then(ethPvtKey => {
      //         //console.warn('MM','ethPvtKey--------', ethPvtKey);
      //         setPrvtKey(ethPvtKey);
      //         setIsPrvtKey(true);
      //         // alert(ethPvtKey)
      //       });
      //   } else {
      //     setIsPrvtKey(false);
      //     setMnemonics(mnemonics);
      //     let mnemonicArr = mnemonics ? mnemonics.split(' ') : [];
      //     setMnemonicArray(mnemonicArr);
      //   }
    } else {
      Singleton.getInstance()
        .newGetData(Constants.login_data)
        .then(async res => {
          let response = JSON.parse(res);
          let mnemonics = await Singleton.getInstance().newGetData(
            response.defaultEthAddress,
          );
          if (mnemonics == null) {
            Singleton.getInstance()
              .newGetData(`${Singleton.getInstance().defaultEthAddress}_pk`)
              .then(ethPvtKey => {
                //console.warn('MM','ethPvtKey--------', ethPvtKey);
                setPrvtKey(ethPvtKey);
                setIsPrvtKey(true);
                // alert(ethPvtKey)
              });
          } else {
            setIsPrvtKey(false);
            setMnemonics(mnemonics);
            let mnemonicArr = mnemonics ? mnemonics.split(' ') : [];
            setMnemonicArray(mnemonicArr);
          }
        })
        .catch(error => { });
    }
  }, []);

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      {/* <ImageBackgroundComponent style={{ height: windowHeight }}> */}
      <SimpleHeader
        title={LanguageManager.recoveryPhrase}
        // rightImage={[styles.rightImgStyle]}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          // props.navigation.state.params.onGoBack();
          // props.navigation.goBack();
          //Actions.jump('BackupOptions');
          props.screenType == 'Editwallet'
            ? Actions.jump('EditWallet')
            : Actions.jump('BackupOptions');
        }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />

      <ScrollView
        keyboardShouldPersistTaps="always"
        bounces={false}
        style={{ flexgr: 1 }}>
        <View style={{ flex: 0.9 }}>

          <View
            style={[
              styles.textView,
              { color: ThemeManager.colors.lightTextColor },
            ]}>
            <Text style={styles.text}>{LanguageManager.takeNote}</Text>
          </View>
          <View style={{ marginTop: 20, width: '100%' }}>
            {!IsPrvtKey ? (
              <FlatList
              scrollEnabled={false}
                data={mnemonicArr}
                numColumns={2}
                contentContainerStyle={styles.contentContainer}
                keyExtractor={(item, index) => index + ' '}
                renderItem={({ item, index }) => (
                  <View style={styles.listView}>
                    <View
                      style={[styles.listContainer, {
                        backgroundColor: ThemeManager.colors.mnemonicsView,
                        borderColor: ThemeManager.colors.viewBorderColor
                      },
                      ]}>
                      <Text style={[styles.numberText, { color: ThemeManager.colors.textColor }]}>
                        {index + 1 + '.  '}
                      </Text>
                      <Text
                        style={[
                          styles.listText,
                          { color: ThemeManager.colors.mnemonicsText },
                        ]}>
                        {item}
                      </Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <View style={styles.listView}>
                <Text
                  style={[
                    styles.listText,
                    { color: ThemeManager.colors.textColor },
                  ]}>
                  {PrvtKey}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(!IsPrvtKey ? mnemonics : PrvtKey);
                toastRef.current.show(Constants.COPIED);
              }}
              style={[
                styles.copyBtn,
                {
                  borderColor: ThemeManager.colors.headingText,
                },
              ]}>
              <Image
                style={[styles.imgCopyInside,{tintColor:ThemeManager.colors.headingText}]}
                source={images.IconCopyInside}
              />

              <Text
                style={[
                  {
                    color: ThemeManager.colors.headingText,
                    fontFamily: fonts.semibold,
                    marginStart: 6,
                    fontSize: areaDimen(14),
                  },
                ]}>
                {LanguageManager.copy}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'flex-end',
            flex: 0.1,
            marginTop: heightDimen(100)
          }}>
          <BasicButton
            onPress={() => {
              props.screenType == 'Editwallet'
                ? Actions.jump('EditWallet')
                : Actions.jump('BackupOptions');
            }}
            // colors={Singleton.getInstance().dynamicColor}
            btnStyle={styles.btnStyle}
            customGradient={styles.customGrad}
            text="Back" />
        </View>
        {/* <DotPagination style={{ marginTop: 20 }} activeDotNumber={3} /> */}
      </ScrollView>
      <Toast ref={toastRef} />
      {/* </ImageBackgroundComponent> */}
    </Wrap>
  );
};

export default RecoveryPhrase;
