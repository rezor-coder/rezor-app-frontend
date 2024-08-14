/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable react/self-closing-comp */
import React, {useEffect, useState} from 'react';
import {Dimensions, Platform, Text, TextInput, View} from 'react-native';
import {connect, useDispatch, useSelector} from 'react-redux';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import {getColorList, walletFormUpdate} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import {getCurrentRouteName, navigate} from '../../../navigationsService';
import {BasicButton, MainStatusBar} from '../../common';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import {Wrap} from '../../common/Wrap';
import Loader from '../Loader/Loader';
import {styles} from './CreateNewWalletStyle';

const windowHeight = Dimensions.get('window').height;
const CreateNewWallet = props => {
  const dispatch = useDispatch();
  const [btn, setBtn] = useState('');
  const [loading, setLoading] = useState(false);
  const walletName = useSelector(
    state => state?.createWalletReducer?.walletName,
  );

  const letsStart = async () => {
    try {
      Singleton.getInstance().newSaveData(Constants.USER_NAME, walletName);
      console.log(
        'props.route?.params?.isFrom===',
        props.route?.params?.isFrom,
      );

      // Save gradient color if not 'multiWallet'
      if (props.route?.params?.isFrom !== 'multiWallet') {
        Singleton.getInstance().newSaveData(
          Constants.GRADIENT_COLOR,
          JSON.stringify(
            btn ? btn : ['#DA539C', '#A73CBE', '#882DD4', '#7C28DD'],
          ),
        );
      }

      // Validate wallet name
      const trimmedWalletName = walletName.trim();
      if (trimmedWalletName.length === 0) {
        Singleton.showAlert(Constants.VALID_WALLET_NAME);
        return;
      }
      if (trimmedWalletName.length < 3) {
        Singleton.showAlert(Constants.VALID_NAME);
        return;
      }
      setLoading(true);

      // Check for existing wallet name if 'multiWallet'
      if (props.route?.params?.isFrom === 'multiWallet') {
        const multiWalletData = JSON.parse(
          await Singleton.getInstance().newGetData(
            Constants.multi_wallet_array,
          ),
        );
        const isNameExist = multiWalletData.some(
          item =>
            item?.walletName?.trim()?.toLowerCase() ===
            trimmedWalletName.toLowerCase(),
        );

        if (isNameExist) {
          Singleton.showAlert(Constants.wallet_name_already_exist);
          setLoading(false);
          return;
        }
      }

      // Create wallet and navigate
      const res = await Singleton.getInstance().createWallet();
      console.warn('MM', 'create wallet res--------', res);
      dispatch(walletFormUpdate({prop: 'walletData', value: res}));

      if (props.route?.params?.isFrom === 'multiWallet') {
        navigate(NavigationStrings.SecureWallet, {
          isFrom: props.route?.params?.isFrom,
        });
      } else {
        if (getCurrentRouteName() !== 'SecureWallet') {
          navigate(NavigationStrings.SecureWallet);
        }
      }
    } catch (err) {
      console.log('err', err);
      Singleton.showAlert('Error while creating the wallet');
    } finally {
      setLoading(false);
    }
  };

  const walletNameInputChanged = text => {
    const walletNameRegex = Constants.ALPHANUMERIC_REGEX_SPACE;
    if (walletNameRegex.test(text)) {
      if (text.length > 20) {
        Singleton.showAlert('Wallet name has maximum length of 20 Character.');
      } else {
        dispatch(walletFormUpdate({prop: 'walletName', value: text}));
      }
    } else {
      Singleton.showAlert('Space not alowed in wallet name');
    }
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      // if (Platform.OS == "android")
      // RNPreventScreenshot?.enabled(true)
      dispatch(walletFormUpdate({prop: 'walletName', value: ''}));
    });

    // colorList();
  }, []);

  // const colorList = () => {
  //   let access_token = Singleton.getInstance().access_token;
  //   setLoading(true),
  //     setTimeout(() => {
  //       dispatch(getColorList({ access_token }))
  //         .then(async response => {
  //           Singleton.getInstance().newGetData(Constants.GRADIENT_COLOR);
  //           setcolor_list(response);
  //           setLoading(false);
  //         })
  //         .catch(error => {
  //    //  console.warn('MM','error=getColorList====', error);
  //           setLoading(false);
  //         });
  //     }, 500);
  // };
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
      {/* <ImageBackgroundComponent style={{ height: windowHeight, flex: 1 }}> */}
      <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />
      {/* <ScrollView keyboardShouldPersistTaps="handled" bounces={false}> */}
      <View style={{height: windowHeight - 250}}>
        <Text
          style={[
            styles.txtCreateNewWallet,
            {
              color: ThemeManager.colors.headingText,
            },
          ]}>
          {LanguageManager.createNewWallet}
        </Text>

        <Text
          style={[
            styles.txtNamingWallet,
            {color: ThemeManager.colors.lightTextColor},
          ]}>
          {LanguageManager.namingYourWallet}
        </Text>

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
            style={[styles.textInput, {color: ThemeManager.colors.textColor}]}
            placeholder={LanguageManager.NameWallet}
            placeholderTextColor={ThemeManager.colors.placeholderTextColor}
            value={walletName}
            keyboardType={
              Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
            }
            onChangeText={text => {
              if (text?.charAt(0) == ' ') {
                return;
              }
              if (text != '') {
                if (Constants.NEW_NAME_REGX.test(text)) {
                  walletNameInputChanged(text);
                } else {
                  Singleton.showAlert(
                    'Please enter valid name. Only Alphabets, numbers and space are allowed',
                  );
                }
              } else {
                walletNameInputChanged(text);
              }
            }}
          />
        </View>

        {/* <View
              style={{
                height: props.route?.params?.isFrom != 'multiWallet' ? 160 : 50,
              }}>
              {props.route?.params?.isFrom != 'multiWallet' && (
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
                            Singleton.getInstance().dynamicColor = JSON.parse(
                              item.color,
                            );
                            ////console.log(
                            // 'color list=-=-=-=>>',
                            //   JSON.parse(item.color),
                            //   );
                            Singleton.getInstance().newSaveData(Constants.BUTTON_THEME, item.color);

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
      </View>
      <View
        style={[
          {
            justifyContent: 'flex-end',
            flex: 0.9,
          },
        ]}>
        <BasicButton
          onPress={() => {
            letsStart();
          }}
          btnStyle={styles.btnStyle}
          customGradient={styles.customGradient}
          text={LanguageManager.proceed}
        />
      </View>
      {/* </ScrollView> */}

      {loading && <Loader />}
      {/* </ImageBackgroundComponent> */}
    </Wrap>
  );
};
const mapStateToProp = state => {
  return {};
};
export default connect(mapStateToProp, {getColorList})(CreateNewWallet);
