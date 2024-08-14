/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable eqeqeq */
import React, {useState, createRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {Wrap} from '../../common/Wrap';
import {
  BasicButton,
  ImageBackgroundComponent,
  MainStatusBar,
} from '../../common';
import {FlatList} from 'react-native-gesture-handler';
import {styles} from './SecureWalletStyle';
import {Fonts} from '../../../theme';
import {useSelector} from 'react-redux';
import Toast from 'react-native-easy-toast';
import * as Constants from '../../../Constant';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import images from '../../../theme/Images';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import {heightDimen, widthDimen} from '../../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
import {getCurrentRouteName, navigate} from '../../../navigationsService';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
const windowHeight = Dimensions.get('window').height;

const SecureWallet = props => {
  const [copiedText, setCopiedText] = useState(['']);
  const mnemonics = useSelector(
    state => state?.createWalletReducer?.walletData?.mnemonics,
  );
  const mnemonicArr = mnemonics ? mnemonics.split(' ') : [];
  const [shuffledArray, setShuffledArray] = useState([]);
  const toastRef = createRef();

  useEffect(() => {
    props.navigation.addListener('focus', () => {});
  }, []);
  useEffect(() => {
    let jumbleMnemonicsArray = mnemonicArr.map((item, index) => {
      return {
        id: index + 1,
        name: item,
      };
    });
    // const shuffleArr = shuffle(jumbleMnemonicsArray);
    setShuffledArray(jumbleMnemonicsArray);
  }, []);
  const shuffle = array => {
    var currentIndex = array.length,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
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

      {/* <ImageBackgroundComponent style={{ height: windowHeight }}> */}
      <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{flex: 1}}>
        {/* <View > */}
        <View style={styles.mainView}>
          <Text
            style={[
              styles.txtHeading,
              {color: ThemeManager.colors.headingText},
            ]}>
            {`${LanguageManager.secretPhrases}`}
          </Text>

          <View style={[styles.textView]}>
            <Text
              style={[
                styles.text,
                {color: ThemeManager.colors.lightTextColor},
              ]}>
              {LanguageManager.takeNote}
            </Text>
          </View>

          <View
            style={{
              marginTop: heightDimen(10),
              marginHorizontal: widthDimen(16),
            }}>
            <FlatList
              data={shuffledArray}
              numColumns={2}
              contentContainerStyle={styles.contentContainer}
              keyExtractor={(item, index) => index + ' '}
              renderItem={({item, index}) => (
                <View style={styles.listView}>
                  <View
                    style={[
                      styles.listContainer,
                      {
                        backgroundColor: ThemeManager.colors.mnemonicsView,
                        borderColor: ThemeManager.colors.viewBorderColor,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.numberText,
                        {color: ThemeManager.colors.textColor},
                      ]}>
                      {item?.id + '. '}
                    </Text>
                    <Text
                      style={[
                        styles.listText,
                        {color: ThemeManager.colors.textColor},
                      ]}>
                      {item?.name}
                    </Text>
                  </View>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(mnemonics);
                // Clipboard.setString("ddd");
                toastRef.current.show(Constants.COPIED);
                //console.warn('MM','textCopied', mnemonics);
              }}
              style={[
                styles.copyBtn,
                {
                  // backgroundColor: ThemeManager.colors.copyView,
                  borderColor: ThemeManager.colors.primary,
                },
              ]}>
              <FastImage
                style={styles.imgCopyInside}
                source={images.IconCopyInside}
                tintColor={ThemeManager.colors.headingText}
              />

              <Text
                style={[
                  styles.copyText,
                  {color: ThemeManager.colors.headingText},
                ]}>
                {LanguageManager.copy}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <Multibtn
            style={{marginTop: 10}}
            firstBtn={() => goBack()}
            secondBtn={() => {
              if (props?.route?.params?.isFrom == 'multiWallet') {
                Actions.replace('VerifyPhrase', {isFrom: props?.route?.params?.isFrom});
              } else {
                getCurrentRouteName() != 'VerifyPhrase' &&
                  Actions.VerifyPhrase();
              }
            }}
            firsttext={LanguageManager.Back}
            secondtext={LanguageManager.next}
          /> */}
        {/* </View> */}
        {/* <View style={[{
            justifyContent: 'flex-end', flex: 1, ...ifIphoneX({
              marginTop: -100
            }, {
              marginBottom: 40
            }),
          }]}> */}
        <BasicButton
          onPress={() => {
            if (props?.route?.params?.isFrom == 'multiWallet') {
              getCurrentRouteName() != 'VerifyPhrase' &&
                navigate(NavigationStrings.VerifyPhrase, {
                  isFrom: props?.route?.params?.isFrom,
                });
            } else {
              getCurrentRouteName() != 'VerifyPhrase' &&
                navigate(NavigationStrings.VerifyPhrase);
            }
            // getCurrentRouteName() != 'VerifyPhrase' && Actions.VerifyPhrase();
          }}
          // colors={Singleton.getInstance().dynamicColor}
          btnStyle={styles.btnStyle}
          customGradient={styles.customGrad}
          text={LanguageManager.proceed}
        />
        {/* </View> */}
      </ScrollView>

      {/* <DotPagination style={{marginTop: 20}} activeDotNumber={3} /> */}
      <Toast ref={toastRef} />
      {/* </ImageBackgroundComponent> */}
    </Wrap>
  );
};

export default SecureWallet;
