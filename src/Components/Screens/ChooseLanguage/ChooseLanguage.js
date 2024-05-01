/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
  Linking,
  ImageBackground,
  Dimensions,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  MainStatusBar,
  BasicButton,
  Header,
  Wrap,
  CheckBox,
  SecurityLink,
  SimpleHeader,
  BorderLine,
} from '../../common/index';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import LottieView from 'lottie-react-native';

import { Fonts, Images, Colors } from '../../../theme';
import { ScrollView } from 'react-native-gesture-handler';
import images from '../../../theme/Images';
import { changeLanguageAction } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
// const Languages = ['English', 'Español', 'Français', 'Italian', 'Português','Deutsch'];
const Languages = [
  { name: 'English', flag: Images.english },
  // { name: 'Español', flag: Images.espanol },
  // { name: 'Deutsch', flag: Images.deutsch },
  // { name: 'Français', flag: Images.france },
  // { name: 'Italian', flag: Images.italian },
  // { name: 'Português', flag: Images.portugues },
];

const ChooseLanguage = props => {
  const dispatch = useDispatch();
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
        console.log("LangauageIndex= ", res)
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
    Singleton.getInstance().newSaveData(Constants.LangauageIndex, languageIndex?.toString(),);
    Singleton.getInstance().newGetData(Constants.Langauage).then(res => {
      console.warn('MM', 'res-SAVED-setLanguage---', res);
      LanguageManager.setLanguage(res == null ? 'English' : res);
      if (props.from == 'setting') {
        Actions.pop();
      } else {
        Actions.currentScene != 'Dashboard' && Actions.Dashboard();
      }
    });
  };

  const languageChanged = index => {
    setSelectedLang(index);
  };

  const renderLanguageItem = ({ item, index }) => {

    return (
      <TouchableOpacity
        onPress={() => {
          setlanguageIndex(index);
          Singleton.getInstance().newSaveData(Constants.Langauage, item.name);
          Singleton.getInstance().newGetData(Constants.Langauage).then(res => {
            //console.warn('MM','langResponse', JSON.stringify(res));
          });
          languageChanged(index);
        }}
        activeOpacity={1}
        style={[
          styles.languageItemWrapStyle,
          {
            borderColor:
              index == selectedlang
                ? ThemeManager.colors.primary
                : 'transparent',
            backgroundColor: ThemeManager.colors.backgroundColor
          },
        ]}>
        <Image source={item?.flag}
          style={{ height: widthDimen(30), width: widthDimen(30) }} />
        <Text
          style={[
            styles.languageItemStyle,
            {
              color: ThemeManager.colors.textColor
              // color:
              //   index == selectedlang
              //     ? ThemeManager.colors.textColor
              //     : Colors.lightGrey2,
            },
          ]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <SimpleHeader
        title={LanguageManager.chooselanguage}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          props.navigation.goBack();
        }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />

      <View
        style={styles.containerStyle}>
        <Text
          style={[
            styles.lablePrefLang,
            { color: ThemeManager.colors.lightTextColor },
          ]}>
          {LanguageManager.selectLangProceed}
        </Text>


        <FlatList
          data={Languages}
          style={{}}
          renderItem={renderLanguageItem}
          keyExtractor={(item, index) => index?.toString()}
        />
      </View>

      <BasicButton
        onPress={() => onLangProceed()}
        btnStyle={styles.btnStyle}
        customGradient={styles.customGrad}
        text={LanguageManager.continue}
      />
    </Wrap>
  );
};

const styles = StyleSheet.create({

  lablePrefLang: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.regular,
    // lineHeight: heightDimen(18),
    textAlign: 'left',
    marginTop: heightDimen(8),
    marginBottom: heightDimen(10)
  },
  containerStyle: {
    marginTop: heightDimen(24),
    paddingHorizontal: widthDimen(20),
    flex: 1
  },
  languageItemWrapStyle: {
    backgroundColor: 'white',
    // borderColor: Colors.languageItem,
    borderWidth: areaDimen(1),
    borderRadius: areaDimen(33),
    marginTop: heightDimen(10),
    flexDirection: 'row',
    width: '100%',
    height: heightDimen(66),
    padding: areaDimen(10),
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.05,
    elevation: 4,
    paddingHorizontal: widthDimen(16)
  },
  languageItemStyle: {
    fontSize: areaDimen(16),
    color: Colors.languageItem,
    fontFamily: Fonts.semibold,
    marginLeft: widthDimen(12)
  },
  btnStyle: {
    width: '100%',
    marginTop: heightDimen(20),
    height: heightDimen(60),
    paddingHorizontal: widthDimen(22),
    marginBottom: heightDimen(15),
  },
  customGrad: {
    borderRadius: areaDimen(30),
  },

});

export default ChooseLanguage;
