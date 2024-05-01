/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import Colors from '../../../theme/Colors';
import {
  MainStatusBar,
  Wrap,
  BasicButton,
  ImageBackgroundComponent,
} from '../../common/index';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ActionConst, Actions} from 'react-native-router-flux';
import styles from './VerifyPhraseStyle';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import {connect} from 'react-redux';
import {useSelector} from 'react-redux';
import {walletFormUpdate, createWallet} from '../../../Redux/Actions';
import Loader from '../Loader/Loader';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import {Fonts} from '../../../theme';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
const windowHeight = Dimensions.get('window').height;

let a = ' ';

const VerifyPhrase = props => {
  const arr = useSelector(state =>
    state?.createWalletReducer?.walletData?.mnemonics?.split(' '),
  );
  // const arr = "pill laugh powder cluster trash actual ginger resource laugh note ship increase"
  const [sequencedArray, setSequencedArray] = useState([]);
  const [shuffledArray, setShuffledArray] = useState([]);
  const DATA = useSelector(state => state?.createWalletReducer?.walletData);
  const walletName = useSelector(
    state => state?.createWalletReducer?.walletName,
  );
  const [walletData, setwalletData] = useState(DATA);
  const [isLoading, setisLoading] = useState(false);
  const [isPhraseClicked, setIsPhraseClicked] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(null);
  const [selectedArray, setSelectedArray] = useState([]);

  useEffect(() => {
    //     props.navigation.addListener('didFocus', () => {
    //       // if (Platform.OS == "android")
    //       // RNPreventScreenshot?.enabled(true)
    //  //  console.warn('MM','did Blur called verify phrase::::::');
    //     });
    //     props.navigation.addListener('didBlur', () => {
    //       // if (Platform.OS == "android")
    //       // RNPreventScreenshot?.enabled(false)
    //  //  console.warn('MM','did Blur called secure Wallet::::::');
    //     });
    shuffledArrayFxn();
  }, []);
  const shuffledArrayFxn = () => {
    const shuffleArr = shuffle(arr);
    console.log('MM', 'shuffleArr', shuffleArr, typeof shuffleArr);
    let jumbleMnemonicsArray = shuffleArr.map((item, index) => {
      return {
        id: index,
        name: item,
      };
    });
    setShuffledArray(jumbleMnemonicsArray);
  };
  function checkExistingWallet() {
    //nextPressed()
    if (props.isFrom == 'multiWallet') {
      Singleton.getInstance()
        .newGetData(Constants.multi_wallet_array)
        .then(res => {
          let data = JSON.parse(res);

          nextPressed(data);
        });
    } else {
      nextPressed([]);
    }
  }

  const nextPressed = existingWallets => {
    ////console.log(
    // 'props.mnemonicArr::::',
    //   arr,
    //   'selectedArray::::',
    //   selectedArray,
    // );

    setTimeout(() => {
      setisLoading(true);
      let mnemonicsArr = selectedArray?.map(item => item.name);
      console.log('selectedArray:::::', mnemonicsArr);
      if (JSON.stringify(arr) == JSON.stringify(mnemonicsArr)) {
        let wallet_addresses = [
          {
            coin_symbol: 'eth',
            wallet_address: DATA?.ethAddress,
          },
          {
            coin_symbol: 'bnb',
            wallet_address: DATA?.ethAddress,
          },
          {
            coin_symbol: 'stc',
            wallet_address: DATA?.ethAddress,
          },
          {
            coin_symbol: 'btc',
            wallet_address: DATA?.btcAddress,
          },
          {
            coin_symbol: 'matic',
            wallet_address: DATA?.ethAddress,
          },
          {
            coin_symbol: 'trx',
            wallet_address: DATA?.trxAddress,
          },
        ];
        // console.log(wallet_addresses);
        let address = DATA.ethAddress;
        let wallet_name = walletName;
        let device_token = Singleton.getInstance().device_token;
        props
          .createWallet({address, wallet_addresses, wallet_name, device_token})
          .then(response => {
            //console.warn('MM','response---wallet--- ', response);

            setisLoading(false);
            let data = {
              address: DATA.ethAddress,
              btcAddress: DATA?.btcAddress,
              trxAddress: DATA?.trxAddress,
              addresses: [DATA.ethAddress, DATA.btcAddress, DATA.trxAddress],
              wallet_addresses: wallet_addresses,
              wallet_name: wallet_name,
              walletName: wallet_name,
              device_token: device_token,
            };
            let login_data = {
              access_token: response.data.token,
              defaultEthAddress: DATA.ethAddress,
              defaultBnbAddress: DATA.ethAddress,
              defaultStcAddress: DATA.ethAddress,
              defaultMaticAddress: DATA.ethAddress,
              defaultBtcAddress: DATA.btcAddress,
              defaultTrxAddress: DATA.trxAddress,
              walletName: walletName,
            };
            let addrsListKeys = [
              DATA.ethAddress,
              DATA.btcAddress,
              DATA.trxAddress,
            ];
            let coinFamilyKeys = [1, 2, 6, 11, 3,4];
            let WalletData = {
              walletName: walletName,
              mnemonics: DATA.mnemonics,
              loginRequest: data,
              defaultWallet: props.isFrom == 'multiWallet' ? false : true,
              user_jwtToken: response.data?.token,
              blockChain: 'all',
              login_data,
              refreshToken: response?.data?.refreshToken,
            };
            let Wallet_Array = existingWallets;
            Wallet_Array.push(WalletData);

            if (props.isFrom != 'multiWallet') {
              Singleton.getInstance().newSaveData(
                Constants.addresKeyList,
                JSON.stringify(addrsListKeys),
              );
              Singleton.getInstance().newSaveData(
                Constants.login_data,
                JSON.stringify(login_data),
              );
              Singleton.getInstance().newSaveData(
                Constants.coinFamilyKeys,
                coinFamilyKeys,
              );
              Singleton.getInstance().newSaveData(
                Constants.access_token,
                response.data.token,
              );
              Singleton.getInstance().newSaveData(
                Constants.refresh_token,
                response.data?.refreshToken,
              );
              Singleton.getInstance().newSaveData(
                Constants.ACTIVE_WALLET,
                JSON.stringify(WalletData),
              );
              Singleton.getInstance().access_token = response.data.token;
              Singleton.getInstance().defaultEthAddress = DATA.ethAddress;
              Singleton.getInstance().defaultMaticAddress = DATA.ethAddress;
              Singleton.getInstance().defaultBnbAddress = DATA.ethAddress;
              Singleton.getInstance().defaultBtcAddress = DATA.btcAddress;
              Singleton.getInstance().defaultTrxAddress = DATA.trxAddress;
              Singleton.getInstance().defaultStcAddress = DATA.ethAddress;
              Singleton.getInstance().walletName = walletName;
            }
            Singleton.getInstance().newSaveData(
              Constants.UPDATE_ASYNC_KEY,
              'true',
            );
            Singleton.getInstance().newSaveData(
              Constants.multi_wallet_array,
              JSON.stringify(Wallet_Array),
            );

            // Singleton.showAlert('Wallet created successfully.');
            // if (props.isFrom == 'multiWallet') Actions.jump("MultiWalletList");
            // else Actions.Main({type: ActionConst.RESET});
            if (props.isFrom == 'multiWallet') {
              Actions.currentScene != 'MultiWalletList' &&
                Actions.jump('MultiWalletList');
            } else {
              // Actions.currentScene != 'Main' &&
              //   Actions.Main({ type: ActionConst.RESET });
              // Actions.jump('Wallet');
              Actions.currentScene != 'Congrats' && Actions.jump('Congrats');
            }
          })
          .catch(err => {
            setisLoading(false);
            Singleton.showAlert(err.message);
          });
        ////console.log(
        // 'props.mnemonicArr',
        //   arr,
        //   'sequencedArray::::',
        //   sequencedArray,
        //     );
      } else {
        setisLoading(false);
        Singleton.showAlert(Constants.VALID_MNEMONICS_ARRANGE);
      }
    }, 200);
  };
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
      {/* <ImageBackgroundComponent style={{ height: '100%' }}> */}
      <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            style={[
              styles.styleLabelHeader,
              {color: ThemeManager.colors.headingText},
            ]}>
            {LanguageManager.VerifyPhrase}
          </Text>

          <View style={styles.descriptionWrapStyle}>
            <Text
              style={[
                styles.descriptionTextStyle,
                {color: ThemeManager.colors.lightTextColor},
              ]}>
              {LanguageManager.correctOrder}
            </Text>
          </View>

          <View
            style={[
              styles.selectedArrMainViewStyle,
              {
                borderColor: ThemeManager.colors.viewBorderColor,
              },
            ]}>
            <View style={styles.viewMnemonicsSelection}>
              {selectedArray.map((item, index) => (
                <View style={[styles.selectedListView]}>
                  <TouchableOpacity
                    onPress={() => {
                      selectedArray.splice(index, 1);
                      setSelectedArray([...selectedArray]);
                    }}
                    style={[styles.selectedListContainerStyle]}>
                    <View
                      style={[
                        styles.selectedListContainerStyle,
                        {
                          backgroundColor: ThemeManager.colors.mnemonicsView,
                          borderWidth:1,
                          borderColor:ThemeManager.colors.mnemonicsViewBorder
                        },
                      ]}>
                      <Text
                        style={[
                          styles.mnemonicSelectedNameText,
                          {
                            color: ThemeManager.colors.textColor,
                          },
                        ]}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.viewClearAll}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setSelectedArray([]);
                }}>
                <View style={styles.clearAllBtnStyle}>
                  <Text style={[styles.clearAllTextStyle,{color:ThemeManager.colors.headingText}]}>Clear All</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View
            style={{
              marginTop: heightDimen(12),
              marginHorizontal: widthDimen(16),
            }}>
            <FlatList
              data={shuffledArray}
              numColumns={2}
              contentContainerStyle={styles.contentContainer}
              keyExtractor={(item, index) => index + '  '}
              renderItem={({item, index}) => {
                const isArranged = selectedArray.find(
                  word => word.id == item.id,
                );
                let displayIndex = '';
                selectedArray.map((word, index) => {
                  word.id == item.id ? (displayIndex = index) : null;
                });
                console.log('isArranged::::', isArranged, item, displayIndex);
                return (
                  <View style={styles.listView}>
                    <TouchableOpacity
                      onPress={() => {
                        console.log('isArranged:::', isArranged);
                        if (isArranged) {
                          selectedArray.splice(
                            selectedArray.findIndex(el => el.id == item.id),
                            1,
                          );
                          setSelectedArray([...selectedArray]);
                        } else {
                          setSelectedArray([...selectedArray, item]);
                        }
                      }}
                      style={[
                        styles.listContainerStyle,
                        {
                          borderWidth: 0,
                        },
                      ]}>
                      <View
                        style={[
                          styles.listContainerStyle,
                          {
                            borderColor: isArranged
                              ? ThemeManager.colors.primary
                              : ThemeManager.colors.viewBorderColor,
                            backgroundColor: ThemeManager.colors.mnemonicsView,
                          },
                        ]}>
                        {/* {isArranged && (
                          <Text
                            style={{
                              color: Colors.white,
                              fontFamily: Fonts.semibold,
                              fontSize: areaDimen(15),
                            }}>
                            {displayIndex + 1 + '.  '}
                          </Text>
                        )} */}
                        <Text
                          style={[
                            styles.mnemonicNameText,
                            {
                              color: ThemeManager.colors.textColor,
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </View>

        <View
          style={[
            styles.alignCenter,
            {
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            },
          ]}>
          <BasicButton
            onPress={() => checkExistingWallet()}
            btnStyle={styles.btnStyle}
            customGradient={styles.customGrad}
            text={LanguageManager.proceed}></BasicButton>
        </View>
      </ScrollView>
      {isLoading && <Loader />}
      {/* </ImageBackgroundComponent> */}
    </Wrap>
  );
};

const mapStateToProp = state => {
  const {walletData, walletName} = state.createWalletReducer;
  return {walletData, walletName};
};

export default connect(mapStateToProp, {walletFormUpdate, createWallet})(
  VerifyPhrase,
);
