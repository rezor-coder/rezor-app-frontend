/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
  Linking,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {
  MainStatusBar,
  BasicButton,
  Header,
  Wrap,
  CheckBox,
  SecurityLink,
  ImageBackgroundComponent,
} from '../../common/index';
import styles from './SelectLanguageStyle';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import LottieView from 'lottie-react-native';

import {Fonts, Images, Colors} from '../../../theme';
// import {ScrollView} from 'react-native-gesture-handler';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Languages = [
  {name: 'English', flag: Images.english},
  // { name: 'Español', flag: Images.espanol },
  // { name: 'Deutsch', flag: Images.deutsch },
  // { name: 'Français', flag: Images.france },
  // { name: 'Italian', flag: Images.italian },
  // { name: 'Português', flag: Images.portugues },
];

//'Deutsch',
const SelectLanguage = props => {
  const [languageIndex, setlanguageIndex] = useState(0);
  const [selectedlang, setSelectedLang] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [btnColor, setBtnColor] = useState('');

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      setBtnColor(Singleton.getInstance().dynamicColor);
    });
  }, []);
  useEffect(() => {
    Singleton.getInstance()
      .newGetData(Constants.LangauageIndex)
      .then(res => {
        if (res == null) {
          setSelectedLang(0);
        } else {
          setSelectedLang(res);
        }
        setlanguageIndex(res);
      });

    const backAction = () => {
      //console.warn('MM','i SelectLanguage');
      if (props.from == 'setting') {
        Actions.pop();
        return true;
      } else {
        //  BackHandler.exitApp();
        Actions.pop();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const onLangProceed = () => {
    if (!toggleCheckBox) {
      Singleton.showAlert('Please accept terms and privacy policy');
    } else {
      Singleton.getInstance().newSaveData(
        Constants.LangauageIndex,
        languageIndex?.toString(),
      );
      Singleton.getInstance()
        .newGetData(Constants.Langauage)
        .then(res => {
          //console.warn('MM','res-SAVED-setLanguage---', res);
          LanguageManager.setLanguage(res == null ? 'English' : res);
          languageMethod();
        })
        .catch(err => {
          //  console.warn('MM','chk Langauage errr::::', err);
          languageMethod();
        });
    }
  };
  const languageMethod = () => {
    if (global.disconnected) {
      Singleton.showAlert(Constants.NO_NETWORK);
      return;
    }

    if (props.from == 'setting') {
      Actions.pop();
    } else {
      Actions.currentScene != 'WalletSequrity' && Actions.WalletSequrity();
    }
  };
  const languageChanged = index => {
    setSelectedLang(index);
  };

  const renderLanguageItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setlanguageIndex(index);
          Singleton.getInstance().newSaveData(Constants.Langauage, item.name);
          Singleton.getInstance()
            .newGetData(Constants.Langauage)
            .then(res => {
              //console.warn('MM','langResponse', JSON.stringify(res));
            });
          languageChanged(index);
        }}
        disabled={true}
        activeOpacity={1}
        style={[
          styles.languageItemWrapStyle,
          {
            borderColor:
              index == selectedlang
                ? ThemeManager.colors.primary
                : 'transparent',
            backgroundColor: ThemeManager.colors.backgroundColor,
          },
        ]}>
        <Image source={item.flag} />
        <Text
          style={[
            styles.languageItemStyle,
            {
              color: ThemeManager.colors.textColor,
              // color:
              //   index == selectedlang
              //     ? ThemeManager.colors.textColor
              //     : Colors.lightGrey2,
            },
          ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg, paddingBottom: 20}}>
      <View style={styles.container}>
        <MainStatusBar
          backgroundColor={ThemeManager.colors.bg}
          barStyle={
            ThemeManager.colors.themeColor === 'light'
              ? 'dark-content'
              : 'light-content'
          }
        />
        <View style={styles.containerStyle}>
          <Header
            headerStyle={[
              styles.headerStyle,
              {color: ThemeManager.colors.titleColor},
            ]}
            title={'Welcome To SaitaPro'}
          />
          <Text
            style={[
              styles.lablePrefLang,
              {color: ThemeManager.colors.lightTextColor},
            ]}>
            {LanguageManager.selectLangProceed}
          </Text>

          {Languages.map((item, index) => {
            return renderLanguageItem(item, index);
          })}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: heightDimen(100),
          // alignItems: 'center',
          paddingHorizontal: widthDimen(20),
        }}>
        {/* <CheckBox
          checkBoxLeft={0}
          checkboxstyle={{
            width: widthDimen(16),
            height: widthDimen(16),
            marginTop: widthDimen(1.5)
          }}
          checkboxColor={ThemeManager.colors.titleColor}
          isStored={toggleCheckBox}
          onHandleCheckBox={() => {
            setToggleCheckBox(!toggleCheckBox);
          }}
        /> */}
        <View style={{alignSelf: 'center'}}>
          <TouchableOpacity
          style={ {height: heightDimen(36),
          }}
            onPress={() => {
              setToggleCheckBox(!toggleCheckBox);
            }}>
            <FastImage
              style={{
                height: heightDimen(18),
                width: widthDimen(30),
              }}
              resizeMode={FastImage.resizeMode.contain}
              source={toggleCheckBox ? Images.toggleOn : ThemeManager.ImageIcons.toggleOff}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: widthDimen(8),
            marginBottom:heightDimen(20)
          }}>
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: areaDimen(15),
              color: ThemeManager.colors.lightTextColor,
              lineHeight: areaDimen(22),
            }}>
            {'I have read and accept the'}
          </Text>
          <TouchableOpacity
            style={{}}
            onPress={() =>
              Linking.openURL(
                'https://api.saita.pro/prod/api/v1/page/web-terms-and-conditions.html',
              )
            }>
            <Text
              style={{
                color: ThemeManager.colors.titleColor,
                fontFamily: Fonts.semibold,
                fontSize: areaDimen(15),
                lineHeight: areaDimen(22),
                // top:2
              }}>
              {' Terms of Service '}
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: ThemeManager.colors.lightTextColor,
              fontFamily: Fonts.regular,
              fontSize: areaDimen(15),
              lineHeight: areaDimen(22),
            }}>
            and
          </Text>

          <TouchableOpacity
            style={{}}
            onPress={() =>
              Linking.openURL(
                'https://api.saita.pro/prod/api/v1/page/web-privacy-policy.html',
              )
            }>
            <Text
              style={{
                color: ThemeManager.colors.titleColor,
                fontFamily: Fonts.semibold,
                fontSize: areaDimen(15),
                lineHeight: areaDimen(22),
              }}>
              {' Privacy Policy '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <BasicButton
        onPress={() => onLangProceed()}
        btnStyle={styles.btnStyle}
        customGradient={styles.customGrad}
        text={LanguageManager.proceed}
      />
    </Wrap>
  );
};

export default SelectLanguage;
