/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable react/self-closing-comp */
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getColorList, walletFormUpdate } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate, navigation } from '../../../navigationsService';
import fonts from '../../../theme/Fonts';
import {
  BasicButton,
  BorderLine,
  SimpleHeader
} from '../../common';
import { SettingBar } from '../../common/SettingBar';
import { Wrap } from '../../common/Wrap';
import Loader from '../Loader/Loader';
import { styles } from './EditWalletStyle';
const windowHeight = Dimensions.get('window').height;
const EditWallet = props => {
  const dispatch = useDispatch();
  const [btn, setBtn] = useState(Singleton.getInstance().dynamicColor);
  const [loading, setLoading] = useState(false);
  const [color_list, setcolor_list] = useState([]);
  const [walletsDetailData, setWalletsDetailData] = useState([]);
  const [walletNames, setWalletNames] = useState('');
  const [walletMnemonics, setWalletMnemonics] = useState('');
  const [selectedColor, setselectedColor] = useState('');
  const walletName = useSelector(
    state => state?.createWalletReducer?.walletName,
  );
  const [walletNameText, setWalletNameText] = useState('');

  const letsStart = async () => {
    Singleton.getInstance().newSaveData(Constants.USER_NAME, walletName);
    ////console.log(
    // 'usename00-----',
    //   Singleton.getInstance().saveData(Constants.USER_NAME, walletName),
    // );
    if (props.isFrom != 'multiWallet') {
      Singleton.getInstance().newSaveData(
        Constants.GRADIENT_COLOR,
        JSON.stringify(
          btn ? btn : ['#DA539C', '#A73CBE', '#882DD4', '#7C28DD'],
        ),
      );
    }
    if (walletName.trim().length == 0) {
      Singleton.showAlert(Constants.VALID_WALLET_NAME);
      return;
    }
    if (walletName.trim().length < 3) {
      Singleton.showAlert(Constants.VALID_NAME);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      Singleton.getInstance()
        .createWallet()
        .then(res => {
          //console.warn('MM','create wallet res--------', res);
          dispatch(walletFormUpdate({prop: 'walletData', value: res}));
          if (props.isFrom == 'multiWallet') {
            navigate(NavigationStrings.SecureWallet, {isFrom: props.isFrom});
          } else {
            getCurrentRouteName() != 'SecureWallet' && navigate(NavigationStrings.SecureWallet);
          }

          setLoading(false);
        });
    }, 300);
  };

  const walletNameInputChanged = async text => {
    console.warn('MM','>>>>text', text + ' ddd ' + walletNames)   ;
    const walletNameRegex = Constants.ALPHANUMERIC_REGEX_SPACE;
    if (walletNameRegex.test(text)) {
      if (text?.trim().length < 3) {
        Singleton.showAlert(Constants.VALID_NAME);
        return;
      }

      let multiWalletData = JSON.parse(
        await Singleton.getInstance().newGetData(Constants.multi_wallet_array),
      );
      let isNameExist = multiWalletData.filter(
        item =>
          item?.walletName?.trim()?.toLowerCase() ==
          text?.trim()?.toLowerCase(),
      );

      if (isNameExist?.length > 0) {
        if (
          props?.route?.params?.walletData?.walletName?.trim()?.toLowerCase() !=
          text?.trim().toLowerCase()
        ) {
          Singleton.showAlert(Constants.wallet_name_already_exist);
          return;
        } else {
          if (selectedColor != '') {
            Singleton.getInstance().dynamicColor = selectedColor;
            Singleton.getInstance().newSaveData(
              Constants.BUTTON_THEME,
              JSON.stringify(selectedColor),
            );
          }

          setLoading(false);
          navigate(NavigationStrings.MultiWalletList);

          return;
        }
      }

      if (text.length > 20) {
        Singleton.showAlert('Wallet name has maximum length of 20 Character.');
        return;
      } else {
        setLoading(true);
        setTimeout(() => {
          var defaultElement = { }
          let newArray = [];
          console.log(
          'response::::::www',
            walletsDetailData.length,
            walletsDetailData,
            walletNames,
            );
          for (let i = 0; i < walletsDetailData.length; i++) {
            const element = walletsDetailData[i];
            if (
              // element.loginRequest.address ==
              // props.route?.params?.walletData.loginRequest.address
              i == props.route?.params?.index
            ) {
              console.warn('MM','response::::::www 1111');
              element.walletName = walletNames?.trim();
              element.loginRequest.wallet_name = walletNames?.trim();
              element.loginRequest.walletName = walletNames?.trim();
              let login_data = element.login_data? element.login_data: {}
              login_data ={...login_data,walletName:walletNames?.trim()}
              element.login_data= login_data
            }
            // else {
            //   //console.warn('MM','response::::::www 1111222');
            //   // element['walletName'] = element.walletName;
            // }
            if(!!element.defaultWallet){
              defaultElement = element
            }
            newArray.push(element);
          
          }
          

          if (props.route?.params?.walletData.defaultWallet == true) {
            
           Singleton.getInstance().newSaveData(
                Constants.ACTIVE_WALLET,
                JSON.stringify(defaultElement),
              );
            Singleton.getInstance().walletName = walletNames?.trim();
            //  this.props.walletFormUpdate({ prop: 'walletName', value: walletNames, });
            Singleton.getInstance()
              .newGetData(Constants.login_data)
              .then(res => {
                let response = JSON.parse(res);
                console.warn('MM', 'response::::::', response);
                let login_data = {
                  // access_token: response.access_token,
                  // defaultEthAddress: response.defaultEthAddress,
                  // defaultBNBAddress: response.defaultBNBAddress,
                  ...response,
                  walletName: walletNames?.trim(),
                };
                Singleton.getInstance().newSaveData(
                  Constants.login_data,
                  JSON.stringify(login_data),
                );
              });
             
      
          }
         
          Singleton.getInstance().newSaveData(
            Constants.multi_wallet_array,
            JSON.stringify(newArray),
          );
          console.warn('MM','newArray wallet options::::::', newArray);
          setLoading(false);
          navigate(NavigationStrings.MultiWalletList);
        }, 500);
      }
    } else {
      Singleton.showAlert('Space not allowed in wallet name');
    }
  };

  const backAction = () => {
    goBack();
    return true;
  };

  useEffect(() => {
    let backHandle = null;
    backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);

    props.navigation.addListener('focus', () => {
      backHandle = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      props.navigation.addListener('blur', () => {
        backHandle?.remove();
      });
      // //console.warn('MM','wallet data=-=-=+++-=-=>>walletData>111', props.route?.params?.walletData);

      //console.warn('MM','wallet data=-=-=+++-=-===>>>', props);
      // console.warn('MM','wallet name=-=-=-=-=>>>3333', props.route?.params?.walletData);
      setWalletNames(props?.route?.params?.walletData?.loginRequest?.wallet_name || props?.route?.params?.walletData?.loginRequest?.walletName);
      setWalletMnemonics(props?.route?.params?.walletData?.mnemonics);
      ////console.log(
      // 'wallet name=-=-=-=-=>>>3333 mmmm',
      //   props?.route?.params?.walletData?.mnemonics,
      //   );
      Singleton.getInstance()
        .newGetData(Constants.multi_wallet_array)
        .then(res => {
          let data = JSON.parse(res);
          //console.warn('MM','wallet data=-=-=-=-=>>>', data);
          setWalletsDetailData(data);
          // nextPressed(data);
        });

      //   dispatch(walletFormUpdate({prop: 'walletName', value: ''}));
    });
    colorList();
  }, []);

  const colorList = () => {
    let access_token = Singleton.getInstance().access_token;
    // setLoading(true),
      setTimeout(() => {
        dispatch(getColorList({access_token}))
          .then(async response => {
            Singleton.getInstance().newGetData(Constants.GRADIENT_COLOR);
            setcolor_list(response);
            setLoading(false);
          })
          .catch(error => {
            //console.warn('MM','error=getColorList====', error);
            setLoading(false);
          });
      }, 500);
  };

  const onColorChange = () => {
    // Singleton.getInstance().dynamicColor = JSON.parse(
    //   btn
    // );
  };

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
      {/* <ImageBackgroundComponent style={{height: windowHeight}}> */}
      <SimpleHeader
        title={LanguageManager.MultiWallet}
        // rightImage={[styles.rightImgStyle]}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          // props.navigation.state.params.onGoBack();
          props.navigation.goBack();
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />

      <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
        <View style={styles.mainView}>
          {/* <SubHeader
          title={LanguageManager.name}
          Subtitle={LanguageManager.Wallet}
          headerstyle={{ marginTop: 100 }}
        /> */}
          {/*
            <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} /> */}

          <Text
            style={[
              styles.txtNameWallet,
              {color: ThemeManager.colors.textColor},
            ]}>
            {LanguageManager.nameYourWallet}
          </Text>

          <View
            style={[
              styles.textInputView,
              {borderColor: ThemeManager.colors.viewBorderColor},
            ]}>
            <TextInput
              maxLength={20}
              style={[styles.textInput, {color: ThemeManager.colors.textColor}]}
              placeholder={LanguageManager.myWallet}
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              placeholderTextColor={ThemeManager.colors.placeholderTextColor}
              value={walletNames}
              onChangeText={text => {
                if (text?.charAt(0) == ' ') {
                  return;
                }
                if (text != '') {
                  if (Constants.NEW_NAME_REGX.test(text)) {
                    setWalletNames(text);
                  } else {
                    Singleton.showAlert(
                      'Please enter valid name. Only Alphabets,numbers and spaces are allowed',
                    );
                  }
                } else {
                  setWalletNames(text);
                }
              }}
            />
          </View>

          {/* <View
            style={{
              height: props.isFrom != 'multiWallet' ? 120 : 50,
            }}>
            {props.isFrom != 'multiWallet' && (
              <View style={{ marginHorizontal: 25 }}>
                <Text
                  style={[
                    styles.textColor,
                    { color: ThemeManager.colors.textColor },
                  ]}>
                  {LanguageManager.selectColor}
                </Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={color_list}
                  horizontal={true}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item, index }) => (
                    <View style={{}}>
                      <TouchableOpacity
                        onPress={() => {
                          setBtn(JSON.parse(item.color));
                          setselectedColor(JSON.parse(item.color));
                          // setselectedColor(JSON.parse(item.color))
                          //                 Singleton.getInstance().dynamicColor = JSON.parse(item.color);

                          // Singleton.getInstance().newSaveData(Constants.BUTTON_THEME, JSON.stringify(JSON.parse(item.color)));
                          ////console.log(
                          //   'color list=-=-=-=>>',
                          //   JSON.parse(item.color),
                          // );
                          //console.warn('MM','checkColorBtn', btn);
                          //console.warn('MM','check custom color:=-=', color_list);
                        }}
                        style={{ alignSelf: 'center' }}>
                        <LinearGradient
                          colors={JSON.parse(item.color)}
                          style={styles.gradientColorview}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0 }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}
          </View> */}
          <Text
            style={[
              styles.txtNameWallet,
              {color: ThemeManager.colors.textColor,
              fontFamily:fonts.semibold,
              fontSize:areaDimen(16)
              },
            ]}>
            {LanguageManager.backUpOptions}
          </Text>
          <View
            style={{
              // backgroundColor: ThemeManager.colors.backupView,
              marginHorizontal: widthDimen(22),
              marginTop: heightDimen(15),
              borderRadius: 14,
              paddingBottom:heightDimen(20)
            }}>
            {!props?.route?.params?.walletData?.privateKey && (
              <View
                style={[
                  styles.backupOptionsViewStyle,
                  {
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                    shadowColor:ThemeManager.colors.shadowColor,
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.05,
                    elevation: 4,
                  },
                ]}>
                <SettingBar
                  // disabled={onPressActive}
                  // iconImage={ThemeManager.ImageIcons.historyIcon}
                  title={LanguageManager.showRecoveryPhrase}
                  titleStyle={{
                    color: ThemeManager.colors.textColor,
                    fontSize: areaDimen(14),
                    fontFamily: fonts.semibold,
                  }}
                  onPress={() => {
                    getCurrentRouteName() != 'ConfirmPin' &&
                    navigate(NavigationStrings.ConfirmPin,{
                        redirectTo: 'RecoveryPhrase',
                        screenType: 'Editwallet',
                        walletItem: props.route?.params?.walletData,
                        isFrom:'ManageWallet',
                        goBack: true,
                      });
                  }}
                  style={{
                    borderBottomWidth: 0,
                    marginVertical: 5,
                    alignItem: 'center',
                    marginTop: heightDimen(7.5),
                    height: heightDimen(50),
                  }}
                  imgStyle={[styles.img]}
                  arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
                />
              </View>
            )}
            <View
              style={[
                styles.backupOptionsViewStyle,
                {
                  backgroundColor: ThemeManager.colors.mnemonicsView,
                  marginTop: heightDimen(14),
                  shadowColor:ThemeManager.colors.shadowColor,
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 3.05,
                  elevation: 4,
                },
              ]}>
              <SettingBar
                title={LanguageManager.exportPrivateKeys}
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: areaDimen(13),
                  fontFamily: fonts.semibold,

                  // lineHeight:heightDimen(19)
                }}
                onPress={() => {
                  getCurrentRouteName() != 'ConfirmPin' &&
                  navigate(NavigationStrings.ConfirmPin,{
                      redirectTo: 'ExportPrivateKeys',
                      screenType: 'Editwallet',
                      walletItem: props.route?.params?.walletData,
                      goBack: true,
                    });
                  // getCurrentRouteName() != 'ExportPrivateKeys' &&
                  //   Actions.ExportPrivateKeys({ walletItem: props.route?.params?.walletData });
                }}
                style={{
                  borderBottomWidth: 0,
                  marginVertical: 5,
                  alignItem: 'center',
                  marginTop: 7.5,
                  height: heightDimen(50),
                }}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>
          </View>

          {/* <View style={{}}>
            <TouchableOpacity
              onPress={() => goBack()}
              style={styles.btnView2}>
              <Text style={{color: colors.white}}>{LanguageManager.Back}</Text>
            </TouchableOpacity>
            <DotPagination style={{marginTop: 20}} activeDotNumber={2} />
          </View> */}
        </View>
      </ScrollView>
      <BasicButton
        onPress={() => {
          // getCurrentRouteName() != 'WalletOption' && Actions.WalletOption();
          walletNameInputChanged(walletNames);
          // onColorChange()
          // Singleton.getInstance().dynamicColor = btn;

          // Singleton.getInstance().newSaveData(Constants.BUTTON_THEME, JSON.stringify(btn));
        }}
        btnStyle={styles.btnStyle}
        customGradient={styles.customGradient}
        // rightImage
        text={LanguageManager.updateWalletName}
        customColor={btn}
      />
      {loading && <Loader />}
      {/* </ImageBackgroundComponent> */}
    </Wrap>
  );
};
const mapStateToProp = state => {
  return {};
};
// export default connect(mapStateToProp, {getColorList})(WalletOption);
export { EditWallet };

