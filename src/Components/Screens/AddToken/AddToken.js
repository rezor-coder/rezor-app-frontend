/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Image, PermissionsAndroid, SafeAreaView, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
import { connect } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import {
  addToken,
  getCoinGeckoSymbols,
  searchToken,
} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Colors, Fonts, Images } from '../../../theme/index';
import {
  BasicButton,
  BorderLine,
  Inputtext,
  MainStatusBar,
  SimpleHeader,
  Wrap
} from '../../common';
import QRReaderModal from '../../common/QRReaderModal';
import Loader from './../Loader/Loader';
import { styles } from './AddTokenStyle';
let scanner = false
const AddToken = props => {
  const [isLoading, setisLoading] = useState(false);
  const [selectedCurrency, setselectedCurrency] = useState("Ethereum");
  const [currencyData, setCurrencyData] = useState(["Ethereum", "Binance", "Polygon", "Tron", "SaitaChain", "Solana"])
  const [tokenSymbol, settokenSymbol] = useState('');
  const [NoOfdecimals, setNoOfdecimals] = useState('');
  const [name, setname] = useState('');
  const [isEditing, setIsEditing] = useState(false)
  const [contractAddress, setContractAddress] = useState(''); // mainnet saitama 0x8B3192f5eEBD8579568A2Ed41E6FEB402f93f73F
  const [Start_Scanner, setStart_Scanner] = useState(false);
  let timer = useRef();
  let dropDownRef = useRef()
  useEffect(() => {
    if(props?.route?.params?.from=='swap'){
      setCurrencyData(["Ethereum", "Binance", "SaitaChain"])
    }
    if(props?.route?.params?.coin_family==4){
      setCurrencyData(["SaitaChain"])
      setselectedCurrency("SaitaChain")
    }else if(props?.route?.params?.coin_family==1){
      setCurrencyData(["Ethereum"])
      setselectedCurrency("Ethereum")
    }else if(props?.route?.params?.coin_family==6){
      setCurrencyData(["Binance"])
      setselectedCurrency("Binance")
    }else if(props?.route?.params?.coin_family==8){
      setCurrencyData(["Solana"])
      setselectedCurrency("Solana")
    }
    const backAction = () => {
      console.log("Start_Scanner::::", scanner);
      if (scanner) {
        setStart_Scanner(false)
        scanner = false
        return true;
      } else {
        goBack();
        return true;
      }
    };

    Singleton.getInstance().newGetData(constants.IS_PRIVATE_WALLET)
      .then(res => {

        if (res == 'matic') {
          setselectedCurrency('Polygon')
          setCurrencyData(["Polygon"])
        } else if (res === constants.COIN_SYMBOL.BNB) {
          setselectedCurrency('Binance')
          setCurrencyData(["Binance"])
        } else if (res === constants.COIN_SYMBOL.ETH) {
          setselectedCurrency('Ethereum')
          setCurrencyData(["Ethereum"])
        } else if (res === constants.COIN_SYMBOL.TRX) {
          setselectedCurrency('Tron')
          setCurrencyData(["Tron"])
        } else if (res == constants.COIN_SYMBOL.STC) {
          setselectedCurrency('SaitaChain')
          setCurrencyData(["SaitaChain"])
        } else if (res == constants.COIN_SYMBOL.SOL) {
          setselectedCurrency('Solana')
          setCurrencyData(["Solana"])
        }
      })

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {

    let blur = props.navigation.addListener('blur', () => {
      if (dropDownRef?.current) {
        console.log('called.....from.. ');
        dropDownRef?.current?.closeDropdown()
      }
    })

    return () => {
      blur()
    }
  }, [])


  const nextAction = () => {

    if (isEditing) {
      return
    }

    if (contractAddress.length == 0) {
      Singleton.showAlert(constants.ENTER_CONTRACT_ADDRESS);
      return;
    }
    if (name.length == 0) {
      Singleton.showAlert(constants.ENTER_TOKEN_NAME);
      return;
    }
    if (tokenSymbol.length == 0) {
      Singleton.showAlert(constants.ENTER_TOKEN_SYMBOL);
      return;
    }
    if (NoOfdecimals.length == 0) {
      Singleton.showAlert(constants.ENTER_DECIMAL_PERCISION);
      return;
    } else {
      getCoinGeckoSymbol();
    }
  };
  const updateContractAddress = text => {
    setIsEditing(true)
    // setContractAddress(text);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    //console.warn('MM','------');
    timer.current = setTimeout(() => {
      //console.warn('MM','......');
      setIsEditing(false)
      changeContractAddress(text);
    }, 1000);
  };
  const changeContractAddress = text => {

    text.length == 0 ? null : SearchToken(text);
  };
  const SearchToken = text => {
    validateAddress(text) ? hitSearchTokenApi(text) : setValues();
  };
  const setValues = () => {
    setNoOfdecimals('');
    setname('');
    settokenSymbol('');
  };
  const hitSearchTokenApi = text => {
    //console.warn('MM','hitSearchTokenApi');
    setisLoading(true);
    let data = {
      tokenAddress: text,
      coinFamily:
        selectedCurrency.toLowerCase() == constants.NETWORK.ETHEREUM
          ? 1
          : selectedCurrency.toLowerCase() == constants.NETWORK.BINANCE
          ? 6
          : selectedCurrency.toLowerCase() == constants.NETWORK.POLYGON
          ? 11
          : selectedCurrency.toLowerCase() == constants.NETWORK.SAITACHAIN
          ? 4
          : selectedCurrency.toLowerCase() == constants.NETWORK.SOLANA
          ? 8
          : 3,
      tokenType:
        selectedCurrency.toLowerCase() == constants.NETWORK.TRON ? 2 : 1,
    };
    let access_token = Singleton.getInstance().access_token;
    props
      .searchToken({ data, access_token })
      .then(res => {
        console.warn('MM', 'res---TOKEN---', res);
        setisLoading(false);
        setNoOfdecimals(res.data?.decimals.toString());
        settokenSymbol(res.data?.symbol);
        setname(res.data?.name);
      })
      .catch(err => {
        setisLoading(false);
        settokenSymbol('');
        setNoOfdecimals('');
        setContractAddress('');
        setname('');
        Singleton.showAlert(err?.message || 'Invalid Contract Address');
      });
  };
  const validateAddress = text => {
    if (selectedCurrency.toUpperCase() == 'ETHEREUM') {
      var isEthAddress = Singleton.getInstance().validateEthAddress(text);
      if (isEthAddress) {
        return true;
      } else {
        Singleton.showAlert('Invalid token address');
        setContractAddress('');
        return false;
      }
    } else if (selectedCurrency.toUpperCase() == 'BINANCE') {
      var isBnbAddress = Singleton.getInstance().validateEthAddress(text);
      if (isBnbAddress) {
        return true;
      } else {
        Singleton.showAlert('Invalid token address');
        setContractAddress('');
        return false;
      }
    } else if (selectedCurrency.toUpperCase() == 'POLYGON') {
      var isMaticAddress = Singleton.getInstance().validateEthAddress(text);
      if (isMaticAddress) {
        return true;
      } else {
        Singleton.showAlert('Invalid token address');
        setContractAddress('');
        return false;
      }
    } else if (selectedCurrency.toUpperCase() == 'SAITACHAIN') {
      var isStcAddress = Singleton.getInstance().validateEthAddress(text);
      if (isStcAddress) {
        return true;
      } else {
        Singleton.showAlert('Invalid token address');
        setContractAddress('');
        return false;
      }
    } else if (selectedCurrency.toUpperCase() == 'SOLANA') {
      var isSolAddress = Singleton.getInstance().validateSolAddress(text);
      if (isSolAddress) {
        return true;
      } else {
        Singleton.showAlert('Invalid token address');
        setContractAddress('');
        return false;
      }
    } else {
      var isTronAddress = Singleton.getInstance().validateTronAddress(text);
      if (isTronAddress) {
        return true;
      } else {
        Singleton.showAlert('Invalid token address');
        setContractAddress('');
        return false;
      }

    }
  };
  const getCoinGeckoSymbol = () => {
    setisLoading(true);
    let access_token = Singleton.getInstance().access_token;
    let coin_symbol = tokenSymbol?.trim()?.includes(' ') ? tokenSymbol?.trim()?.replace(' ', '_') : tokenSymbol
    props
      .getCoinGeckoSymbols({ coin_symbol, access_token })
      .then(res => {
        addToken(res ? res.id : 'gicko_alias');
      })
      .catch(err => {
        Singleton.showAlert('Something went wrong.Please try again later');
        setisLoading(false);
      });
  };
  const addToken = coin_gicko_alias => {
    let data = {
      coin_family:
        selectedCurrency.toLowerCase() == constants.NETWORK.ETHEREUM
          ? 1
          : selectedCurrency.toLowerCase() == constants.NETWORK.BINANCE
          ? 6
          : selectedCurrency.toLowerCase() == constants.NETWORK.POLYGON
          ? 11
          : selectedCurrency.toLowerCase() == constants.NETWORK.SOLANA
          ? 8
          : selectedCurrency.toLowerCase() == constants.NETWORK.SAITACHAIN
          ? 4
          : 3,
      token_address: contractAddress,
      name: name,
      token_type:
        selectedCurrency.toLowerCase() == constants.NETWORK.TRON ? 2 : 1,
      symbol: tokenSymbol.toLowerCase(),
      coin_gicko_alias: coin_gicko_alias,
      decimals: NoOfdecimals,
      wallet_address:
        selectedCurrency.toLowerCase() == constants.NETWORK.TRON
          ? Singleton.getInstance().defaultTrxAddress
          : selectedCurrency.toLowerCase() == constants.NETWORK.SOLANA
          ? Singleton.getInstance().defaultSolAddress
          : Singleton.getInstance().defaultEthAddress,

      wallet_name: Singleton.getInstance().walletName,
      is_swap_list: props?.route?.params?.from == 'swap' ? 1 : 0,
    };
    let access_token = Singleton.getInstance().access_token;
    props
      .addToken({ data, access_token })
      .then(res => {
        setisLoading(false);
       if(props?.route?.params?.from=='swap'){
        getCurrentRouteName()=='AddToken' && navigate(NavigationStrings.Trade,{from:'AddToken'})
        Alert.alert(
          constants.APP_NAME,
          res.message,
          [
            {
              text: 'OK',
              onPress: () => {
                //         settokenSymbol('');
                // setNoOfdecimals('');
                // setContractAddress('');
                // setname('');
                // getCurrentRouteName() != 'Wallet' && Actions.jump('Wallet');
              },
            },
          ],
          { cancelable: false },
        );
       }else{
        getCurrentRouteName() != 'Wallet' && navigate(NavigationStrings.Wallet);
        Alert.alert(
          constants.APP_NAME,
          res.message,
          [
            {
              text: 'OK',
              onPress: () => {
                //         settokenSymbol('');
                // setNoOfdecimals('');
                // setContractAddress('');
                // setname('');
                // getCurrentRouteName() != 'Wallet' && Actions.jump('Wallet');
              },
            },
          ],
          { cancelable: false },
        );
       }
      })
      .catch(err => {
        setisLoading(false);
        //console.warn('MM',err.message);
      });
  };
  const open_QR_Code_Scanner = () => {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera App Permission',
              message: 'Rezor App needs access to your camera ',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setContractAddress('');
            setStart_Scanner(true);
            scanner = true
          } else {
            Singleton.showAlert('CAMERA permission denied');
          }
        } catch (err) {
          Singleton.showAlert('Camera permission err', err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      setContractAddress('');
      setStart_Scanner(true);
      scanner = true
    }
  };
  const qrClose = () => {
    // let contactItem = props.contactItem;
    setStart_Scanner(false);
    scanner = false
    // setContractAddress(contactItem ? contactItem.item.address : '');
  };
  const onQR_Code_Scan_Done = QR_Code => {
    setContractAddress(QR_Code);
    updateContractAddress(QR_Code);
    setStart_Scanner(false);
    scanner = false
  };
  return (
    <>

      {Start_Scanner && (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: ThemeManager.colors.bg,
            paddingTop: Platform.OS == 'ios' ? 20 : 0,
          }}>
          <QRReaderModal
            visible={Start_Scanner}
            setvisible={(data) => {
              setStart_Scanner(data);
              scanner = data
            }}
            onCodeRead={onQR_Code_Scan_Done}
          />
          {/* <TouchableOpacity
            onPress={() => qrClose()}
            style={[styles.addressIcon, { padding: 15, alignSelf: 'flex-end' }]}>
            <FastImage
              style={{ width: 30, height: 30, marginRight: 10 }}
              resizeMode={FastImage.resizeMode.contain}
              source={Images.modal_close_icon}
            />
          </TouchableOpacity>
          <CameraScreen
            showFrame={true}
            scanBarcode={true}
            laserColor={'#FF3D00'}
            frameColor={'#00C853'}
            colorForScannerFrame={'black'}
            onReadCode={event => {
              onQR_Code_Scan_Done(event.nativeEvent.codeStringValue);
            }}
          /> */}
        </SafeAreaView>
      )}
      {
        !Start_Scanner && (
          <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
            <MainStatusBar
              backgroundColor={ThemeManager.colors.bg}
              barStyle={
                ThemeManager.colors.themeColor === 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
            />
            <SimpleHeader
              title={LanguageManager.addCustomToken}
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

            <View style={styles.roundView}>
              <View>
                <View
                  style={{
                    // paddingHorizontal: 15,
                    // backgroundColor:ThemeManager.colors.backgroundColor
                  }}>
                  <Text
                    style={[
                      styles.txtContractAddress,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    {LanguageManager.selectNetwork}
                  </Text>

                  <SelectDropdown
                    disabled={currencyData?.length > 0 ? false : true}
                    data={currencyData}
                    ref={dropDownRef}
                    label={LanguageManager.selectNetwork}
                    buttonStyle={{
                      borderWidth: 1,
                      height: heightDimen(50),
                      borderRadius: 30,
                      width: '100%',
                      // paddingHorizontal: 10,
                      // marginTop: heightDimen(10),
                      backgroundColor: ThemeManager.colors.bg,
                      borderColor: ThemeManager.colors.viewBorderColor,
                      paddingHorizontal: widthDimen(16)
                    }}
                    buttonTextStyle={
                      // styles.btnTextStyle,
                      {
                        color: ThemeManager.colors.textColor,
                        fontSize: areaDimen(14),
                        fontFamily: Fonts.medium,
                        textAlign: 'left',
                      }
                    }
                    dropdownStyle={{
                      backgroundColor: ThemeManager.colors.mnemonicsView,
                      borderRadius: 8,
                    }}
                    rowTextStyle={[
                      styles.rowTextStyle,
                      { color: ThemeManager.colors.textColor },
                    ]}
                    rowStyle={{
                      borderBottomWidth: 1,
                      borderBottomColor: ThemeManager.colors.viewBorderColor,
                      paddingLeft: widthDimen(20),
                      backgroundColor: ThemeManager.colors.mnemonicsView,
                    }}
                    defaultButtonText={selectedCurrency}
                    renderDropdownIcon={() => (
                      <Image
                        source={ThemeManager.ImageIcons.dropIconDown}
                        style={[styles.dpDwonImgRight, { tintColor: ThemeManager.colors.lightTextColor }]}
                      />
                    )}
                    onSelect={item => {
                      //console.warn('MM','item---token-');
                      setselectedCurrency(item);
                      // contractAddress.length > 0 && updateContractAddress(contractAddress);
                      setContractAddress('');
                      setNoOfdecimals('');
                      settokenSymbol('');
                      setname('');
                      // if (selectedCurrency == 'Ethereum') {
                      //   settokenSymbol('ERC-20');
                      // } else if (selectedCurrency == 'Binance') {
                      //   settokenSymbol('BEP-20');
                      // }
                    }}
                  // defaultText={currencyData[0]}
                  />
                </View>

                <View style={styles.viewContractAddress}>
                  <Text style={[
                    styles.txtContractAddress,
                    { color: ThemeManager.colors.textColor },
                  ]}>
                    {LanguageManager.enterContractAdress}
                  </Text>
                  {/* placeholder={LanguageManager.contractAddress} */}

                  <View style={[styles.addressView, { borderColor: ThemeManager.colors.viewBorderColor }]}>
                    <TextInput
                      placeholder={LanguageManager.contractAddress}
                      style={{
                        flex: 1,
                        fontFamily: Fonts.medium,
                        fontSize: areaDimen(14),
                        paddingLeft: widthDimen(20),
                        color: ThemeManager.colors.textColor,
                      }}
                      placeholderTextColor={Colors.fadeDot}

                      onChangeText={text => {
                        // onChangeAddressText(text)
                        updateContractAddress(text);
                        setContractAddress(text);
                      }}
                      value={contractAddress}
                    />

                    <TouchableOpacity
                      onPress={() => open_QR_Code_Scanner()}
                      style={styles.scanView}>
                      <Image
                        source={Images.scan}
                        style={[
                          styles.iconstyle,
                          // { tintColor: ThemeManager.colors.textColor },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>

                  <Inputtext
                    inputStyle={[
                      styles.inputStyle,
                      {
                        color: ThemeManager.colors.textColor,
                        borderColor: ThemeManager.colors.viewBorderColor,
                      },
                    ]}
                    placeholderTextColor={Colors.fadeDot}
                    labelStyle={[
                      { color: ThemeManager.colors.textColor },
                    ]}
                    label={LanguageManager.tokenName}
                    placeholder={LanguageManager.tokenName}
                    // defaultValue={contractAddress}
                    value={name}
                    editable={false}

                  // onChangeNumber={text => {
                  // updateContractAddress(text);
                  // setContractAddress(text);
                  // }}
                  />

                  <View style={styles.viewSymbolDecimalOuter}>
                    <Inputtext
                      inputStyle={[
                        styles.inputSymbol,
                        {
                          borderColor: ThemeManager.colors.viewBorderColor,
                          color: ThemeManager.colors.textColor,
                        },
                      ]}
                      style={styles.styleSymbol}
                      placeholderTextColor={Colors.fadeDot}
                      label={LanguageManager.symbol}
                      labelStyle={{
                        color: ThemeManager.colors.textColor,
                        alignSelf: 'flex-start',
                      }}
                      placeholder={LanguageManager.symbol}
                      value={tokenSymbol}
                      editable={false}
                    />
                    <Inputtext
                      inputStyle={[
                        styles.inputDecimal,
                        {
                          borderColor: ThemeManager.colors.viewBorderColor,
                          color: ThemeManager.colors.textColor,
                        },
                      ]}
                      style={styles.styleDecimal}
                      placeholderTextColor={Colors.fadeDot}
                      labelStyle={{
                        color: ThemeManager.colors.textColor,
                        alignSelf: 'flex-start',
                        marginLeft: "5%"
                      }}
                      label="Decimals"
                      placeholder={LanguageManager.decimal}
                      value={NoOfdecimals}
                      editable={false} />
                  </View>
                </View>
              </View>
              <View style={styles.basicButtonView}>
                <BasicButton
                  onPress={() => nextAction()}
                  btnStyle={styles.savebtn}
                  text={LanguageManager.addToken} />
              </View>
            </View>
            {isLoading && <Loader />}
          </Wrap>
        )
      }
    </>
  );
};
const mapStateToProp = state => {
  const { } = state.AddTokenReducer;
  return {};
};
export default connect(mapStateToProp, {
  searchToken,
  getCoinGeckoSymbols,
  addToken,
})(AddToken);
