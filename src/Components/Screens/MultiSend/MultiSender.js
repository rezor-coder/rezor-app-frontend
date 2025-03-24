/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { Component } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { EventRegister } from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import SelectDropdown from 'react-native-select-dropdown';
import { connect } from 'react-redux';
import Web3 from 'web3';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getMyWallets, uploadCsvFile } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Colors, Fonts, Images } from '../../../theme';
import images from '../../../theme/Images';
import {
  BasicButton,
  BorderLine,
  SimpleHeader,
  Wrap,
} from '../../common';
import { CoustomModal } from '../../common/CoustomModal';
import Loader from '../Loader/Loader';
import styles from './MultiSenderStyle';
import ListModal from '../SwapSelected/ListModal';
let isInvalid = false
let refAddress = '0x0000000000000000000000000000000000000000';
class MultiSender extends Component {
  constructor(props) {
    super();
    this.state = {
      myNo: '',
      csvFile: '',
      csvName: '',
      csvJSON: [],
      isLoading: false,
      coinData: [],
      dropDownList: [],
      selectedCoinIndex: 0,
      amount: -1,
      modalVisible: false,
      leftIconVisible: true,
      isInvalid: false,
      showAssetList: false,
      bottomLoading:false,
      page: 1,
      totalPages:0,
      totalLength:0
    };
  }

  componentDidMount() {
    Singleton.getInstance()
      .newGetData(constants.access_token)
      .then(access_token => {
        Singleton.getInstance().access_token = access_token;
      });
    this.focus = this.props.navigation.addListener('focus', () => {
      EventRegister.addEventListener('downModal', data1 => {
        this.setState.modalVisible = false;
      });
      BackHandler.addEventListener('hardwareBackPress', this.backAction);
    });
    this.blur = this.props.navigation.addListener('blur', () => {
      if (this.dropDownRef) {
        this.dropDownRef?.closeDropdown();
      }
    });
    let coinsData = this.props?.route?.params?.walletList;
    let tempList = [];
    let tempList1 = [];
    coinsData.map(item => {
      if (
        item.coin_family == 1 ||
        item.coin_family == 6 ||
        item?.coin_family == 11 || 
        item?.coin_family == 4
      ) {
        item = {
          ...item,
          coin_fiat_price_graph: [],
          graphData: [],
          coin_fiat_price: [],
        };
        tempList.push(item);
        tempList1.push(item.coin_symbol.toUpperCase());
      }
    });
    console.warn('MM', '-------tempList1----------', tempList1);
    console.warn('MM', '-------tempList----------', tempList);

    this.setState({ coinData: tempList, dropDownList: tempList1,totalLength:tempList?.[0].totalRecords });
  }
  componentWillUnmount() {
    this.blur();
    this.focus();
  }
  screenBlur = () => {
   console.log("called::::::");
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
    console.log("backAction:::::::called");
    goBack();
    return true;
  };
  async requestExternalStoreageRead() {
    global.isCamera = true;
    try {
      if (Platform.OS == 'ios') return true;
      if (Platform.Version >= 33) {
        return true;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'App Permission',
          message:
            'Rezor App needs access to your files to upload CSV file ',
        },
      );

      if (granted == PermissionsAndroid.RESULTS.GRANTED) return true;
      else {
        Singleton.showAlert('Grant storage permission in settings');
        return false;
      }
    } catch (err) {
      return false;
    }
  }
  async pickDocument() {
    global.isCamera = true;
    global.stop_pin = true;
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res[0].name.includes('.csv'))
        this.processSelectedCsvFile(res[0].uri, res[0].name);
      else Singleton.showAlert('Please select CSV file');

      setTimeout(() => {
        global.stop_pin = false;
      }, 2000);
    } catch (err) {
      global.stop_pin = false;
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }
  processSelectedCsvFile(csvFilePath, csvFileName) {
    this.setState({ isLoading: true });
    let access_token = Singleton.getInstance().access_token;
    this.props
      .uploadCsvFile(csvFilePath, access_token)
      .then(res => {
        this.setState({ isLoading: false });
        let resArr = res;
        //TEMP
        // let validationLength = 300;
        // if (resArr.length > validationLength) {
        //   Singleton.showAlert(
        //     `Csv file addresses length can't exceed ${validationLength}.`,
        //   );
        //   this.setState({ csvFile: '', csvName: '' });
        //   return;
        // }
        console.log("res[0]:::::",res[0]);
        if (res[0]?.address != undefined && res[0]?.address != '') {
       
          resArr = resArr.map((item, index) => {
            this.setState({ amount: item.amount });
            if (!item?.amount || !item?.address) {
              isInvalid=true
              this.setState({ csvFile: '', csvName: '', isInvalid: true });
              Singleton.showAlert('Invalid Csv File Fields.');

              return;
            } else
              if (item.amount == '' || item.address == '') {
                isInvalid=true
                this.setState({ csvFile: '', csvName: '', isInvalid: true });
                Singleton.showAlert('Invalid Csv File Fields.');

                return;
              }
              else if (
                (index == 0 && item['amount'] == undefined) ||
                item['address'] == undefined ||
                Object.keys(item).length > 2
              ) {
                isInvalid=true
                this.setState({ csvFile: '', csvName: '', isInvalid: true });
                Singleton.showAlert('Invalid Csv File Fields.');
                return;
              }
            item.amount = parseFloat(item.amount);
            return item;
          });
          this.setState({
            isLoading: false,
            csvJSON: resArr,
            csvFile: csvFilePath,
            csvName: csvFileName,
            isInvalid: false
          });
        } else {
          Singleton.showAlert(`Invalid csv file `);
        }
      })
      .catch(e => {
        this.setState({ isLoading: false });
        if (e.message != constants.NO_NETWORK) {
          Singleton.showAlert(e);
        }
      });
  }
  toFixedExp(num, fixed) {
    if (num) {
      let num1 = this.exponentialToDecimalNew(num);
      let re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
      return num1.toString().match(re)[0];
    }
    else return '0.00';
  }
  /************************************************** exponentialToDecimal ***************************************************/
  exponentialToDecimalNew = (exponential) => {
    let decimal = exponential.toString().toLowerCase();
    if (decimal.includes('e+')) {
      const exponentialSplitted = decimal.split('e+');
      let postfix = '';
      for (let i = 0; i < +exponentialSplitted[1] - (exponentialSplitted[0].includes('.') ? exponentialSplitted[0].split('.')[1].length : 0); i++) {
        postfix += '0';
      }
      const addCommas = text => {
        let j = 3;
        let textLength = text.length;
        while (j < textLength) {
          text = `${text.slice(0, textLength - j)}${text.slice(textLength - j, textLength,)}`;
          textLength++;
          j += 3 + 1;
        }
        return text;
      };
      decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
    }
    if (decimal.toLowerCase().includes('e-')) {
      const exponentialSplitted = decimal.split('e-');
      let prefix = '0.';
      for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
        prefix += '0';
      }
      decimal = prefix + exponentialSplitted[0].replace('.', '');
    }
    return decimal;
  }
  onSendAction() {

    console.log("this.state.isInvalid", isInvalid);
    if (isInvalid) {
      Singleton.showAlert('Please upload valid csv file.');
      return;
    }
    if (this.state.csvJSON.length <= 0) {
      Singleton.showAlert('Upload CSV file.');
      return;
    }
    if (this.state.amount <= 0) {
      Singleton.showAlert('Invalid Amount');
      return;
    }
    if (isInvalid) {
      Singleton.showAlert('Please upload valid csv file.');
      return;
    }
    if (this.state.coinData.length == 0) {
      Singleton.showAlert('Please enable your wallet for group transfer.');
      return;
    }
    let selectedCoin = this.state.coinData[this.state.selectedCoinIndex];
    if (selectedCoin.coin_family == 1) {
      let invalidAddress = this.state.csvJSON?.find((item) => {
        return !Singleton.getInstance().validateEthAddress(
          item?.address,
        )
      })
      console.log("invalidAddress", invalidAddress);
      if (
        !invalidAddress
      ) {
        if (selectedCoin.balance > 0) {
          if (selectedCoin.is_token == 0) {
            getCurrentRouteName() != 'MultiSenderEth' &&
            navigate(NavigationStrings.MultiSenderEth,{
                selectedCoin: selectedCoin,
                csvArray: this.state.csvJSON,
                referralAddress: refAddress,
              });
          } else {
            this.setState({ isLoading: true });
            Singleton.getInstance()
              .checkAllowance(
                selectedCoin.token_address,
                selectedCoin.wallet_address,
                selectedCoin.coin_family,
              )
              .then(allowance => {
                let valueInCoin = 0;
                this.state.csvJSON.map((item, index) => {
                  valueInCoin += parseFloat(item.amount);
                });
                if (selectedCoin.balance > valueInCoin) {
                  if (
                    allowance >
                    +Web3.utils.toWei(
                      valueInCoin?.toFixed(8).toString(),
                      'ether',
                    )
                  ) {
                    console.log("MultiSenderEth:::::::::::");
                    this.setState({ isLoading: false });
                    getCurrentRouteName() != 'MultiSenderEth' &&
                    navigate(NavigationStrings.MultiSenderEth,{
                        selectedCoin: selectedCoin,
                        csvArray: this.state.csvJSON,
                        referralAddress: refAddress,
                      });
                  } else {
                    console.log("MultiSenderEthToken:::::::::::");
                    this.setState({ isLoading: false });
                    getCurrentRouteName() != 'MultiSenderEthToken' &&
                    navigate(NavigationStrings.MultiSenderEthToken,{
                        selectedCoin: selectedCoin,
                        csvArray: this.state.csvJSON,
                        referralAddress: refAddress,
                      });
                  }
                } else {
                  this.setState({ isLoading: false });
                  Singleton.showAlert('Insufficient funds for Bulk Transfer.');
                }
              });
          }
          return;
        } else {
          Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
        }
      } else {
        Singleton.showAlert(
          `Enter valid ${selectedCoin.coin_symbol.toUpperCase()} address`,
        );
      }
    } else if (selectedCoin.coin_family == 6) {
      let invalidAddress = this.state.csvJSON?.find((item) => {
        return !Singleton.getInstance().validateEthAddress(
          item?.address,
        )
      })
      console.log("invalidAddress", invalidAddress);
      if (
        !invalidAddress
      ) {
        if (selectedCoin.balance > 0) {
          if (selectedCoin.is_token == 0) {
            getCurrentRouteName() != 'MultiSenderBNB' &&
            navigate(NavigationStrings.MultiSenderBNB,{
                selectedCoin: selectedCoin,
                csvArray: this.state.csvJSON,
                referralAddress: refAddress,
              });
          } else {
            this.setState({ isLoading: true });
            Singleton.getInstance()
              .checkAllowance(
                selectedCoin.token_address,
                selectedCoin.wallet_address,
                selectedCoin.coin_family,
              )
              .then(allowance => {
                let valueInCoin = 0;
                this.state.csvJSON.map((item, index) => {
                  valueInCoin += item.amount;
                });
                ////console.log(
                // 'allowance',
                //   allowance,
                //   '----',
                //   Web3.utils.toWei(valueInCoin.toFixed(8).toString(), 'ether'),
                //   'value in coin form',
                //   allowance >
                //   +Web3.utils.toWei(
                //     valueInCoin.toFixed(8).toString(),
                //     'ether',
                //   ),
                //     );
                if (selectedCoin.balance > valueInCoin) {
                  if (
                    allowance >
                    +Web3.utils.toWei(
                      valueInCoin.toFixed(8).toString(),
                      'ether',
                    )
                  ) {
                    this.setState({ isLoading: false });
                    getCurrentRouteName() != 'MultiSenderBNB' &&
                    navigate(NavigationStrings.MultiSenderBNB,{
                        selectedCoin: selectedCoin,
                        csvArray: this.state.csvJSON,
                        referralAddress: refAddress,
                      });
                  } else {
                    this.setState({ isLoading: false });
                    getCurrentRouteName() != 'MultiSenderEthToken' &&
                    navigate(NavigationStrings.MultiSenderEthToken,{
                        selectedCoin: selectedCoin,
                        csvArray: this.state.csvJSON,
                        referralAddress: refAddress,
                      });
                  }
                } else {
                  this.setState({ isLoading: false });
                  Singleton.showAlert('Insufficient funds for Group Transfer.');
                }
              })
              .catch(err => {
                // console.log('errr' , err);
                this.setState({ isLoading: false });
                Singleton.showAlert(err?.message || constants.SOMETHING_WRONG);
              });
          }
        } else {
          Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
        }
      } else {
        Singleton.showAlert(
          `Enter valid ${selectedCoin.coin_symbol.toUpperCase()} address`,
        );
      }
    } else if (selectedCoin.coin_family == 11) {
      let invalidAddress = this.state.csvJSON?.find((item) => {
        return !Singleton.getInstance().validateEthAddress(
          item?.address,
        )
      })
      console.log("invalidAddress", invalidAddress);
      if (
        !invalidAddress
      ) {
        if (selectedCoin.balance > 0) {
          if (selectedCoin.is_token == 0) {
            getCurrentRouteName() != 'MultiSenderMatic' &&
            navigate(NavigationStrings.MultiSenderMatic,{
                selectedCoin: selectedCoin,
                csvArray: this.state.csvJSON,
                referralAddress: refAddress,
              });
          } else {
            this.setState({ isLoading: true });
            Singleton.getInstance()
              .checkAllowance(
                selectedCoin.token_address,
                selectedCoin.wallet_address,
                selectedCoin.coin_family,
              )
              .then(allowance => {
                let valueInCoin = 0;
                this.state.csvJSON.map((item, index) => {
                  valueInCoin += item.amount;
                });
                // console.log(
                // 'allowance',
                //   allowance,
                //   '----',
                //   Web3.utils.toWei(valueInCoin.toFixed(8).toString(), 'ether'),
                //   'value in coin form',
                //   allowance >
                //   +Web3.utils.toWei(
                //     valueInCoin.toFixed(8).toString(),
                //     'ether',
                //   ),
                //     );
                if (selectedCoin.balance > valueInCoin) {
                  if (
                    allowance >
                    +Web3.utils.toWei(
                      valueInCoin.toFixed(8).toString(),
                      'ether',
                    )
                  ) {
                    this.setState({ isLoading: false });
                    getCurrentRouteName() != 'MultiSenderMatic' &&
                    navigate(NavigationStrings.MultiSenderMatic,{
                        selectedCoin: selectedCoin,
                        csvArray: this.state.csvJSON,
                        referralAddress: refAddress,
                      });
                  } else {
                    this.setState({ isLoading: false });
                    getCurrentRouteName() != 'MultiSenderEthToken' &&
                    navigate(NavigationStrings.MultiSenderEthToken,{
                        selectedCoin: selectedCoin,
                        csvArray: this.state.csvJSON,
                        referralAddress: refAddress,
                      });
                  }
                } else {
                  this.setState({ isLoading: false });
                  Singleton.showAlert('Insufficient funds for Group Transfer.');
                }
              });
          }
        } else {
          Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
        }
      } else {
        Singleton.showAlert(
          `Enter valid ${selectedCoin.coin_symbol.toUpperCase()} address`,
        );
      }
    }else if (selectedCoin.coin_family == 4) {
      let invalidAddress = this.state.csvJSON?.find((item) => {
        return !Singleton.getInstance().validateEthAddress(
          item?.address,
        )
      })
      console.log("invalidAddress", invalidAddress);
      if (
        !invalidAddress
      ) {
        if (selectedCoin.balance > 0) {
          if (selectedCoin.is_token == 0) {
            getCurrentRouteName() != 'MultiSenderSTC' &&
            navigate(NavigationStrings.MultiSenderSTC,{
                selectedCoin: selectedCoin,
                csvArray: this.state.csvJSON,
                referralAddress: refAddress,
              });
          } else {
            this.setState({ isLoading: true });
            Singleton.getInstance()
              .checkAllowance(
                selectedCoin.token_address,
                selectedCoin.wallet_address,
                selectedCoin.coin_family,
              )
              .then(allowance => {
                console.log("allowance:::::",allowance);
                let valueInCoin = 0;
                this.state.csvJSON.map((item, index) => {
                  valueInCoin += item.amount;
                });
                if (selectedCoin.balance > valueInCoin) {
                  if (
                    allowance >
                    +Web3.utils.toWei(
                      valueInCoin.toFixed(8).toString(),
                      'ether',
                    )
                  ) {
                    this.setState({ isLoading: false });
                    getCurrentRouteName() != 'MultiSenderSTC' &&
                    navigate(NavigationStrings.MultiSenderSTC,{
                        selectedCoin: selectedCoin,
                        csvArray: this.state.csvJSON,
                        referralAddress: refAddress,
                      });
                  } else {
                    this.setState({ isLoading: false });
                    getCurrentRouteName() != 'MultiSenderEthToken' &&
                    navigate(NavigationStrings.MultiSenderEthToken,{
                        selectedCoin: selectedCoin,
                        csvArray: this.state.csvJSON,
                        referralAddress: refAddress,
                      });
                  }
                } else {
                  this.setState({ isLoading: false });
                  Singleton.showAlert('Insufficient funds for Group Transfer.');
                }
              });
          }
        } else {
          Singleton.showAlert(constants.INSUFFICIENT_BALANCE);
        }
      } else {
        Singleton.showAlert(
          `Enter valid ${selectedCoin.coin_symbol.toUpperCase()} address`,
        );
      }
    }
  }
  getMyWalletsData() {
    let page = this.state.page;
    let limit = 25;
    let access_token = Singleton.getInstance().access_token;
    Singleton.getInstance()
      .newGetData(constants.addresKeyList)
      .then(addresKeyList => {
        Singleton.getInstance()
          .newGetData(constants.coinFamilyKeys)
          .then(coinFamilyKey => {
            let addrsListKeys = JSON.parse(addresKeyList);
            let coinFamilyKeys = coinFamilyKey?.split(',');

            this.props
              .getMyWallets({
                page,
                limit,
                addrsListKeys,
                coinFamilyKeys,
                access_token,
              })
              .then(response => {
                let data =
                  page == 1 ? response : [...this.state.coinData, ...response];
                this.setState({
                  isLoading: false,
                  totalLength: data[0]?.totalRecords,
                  bottomLoading: false,
                  coinData:data
                });
              })
              .catch(error => {
                this.setState({isLoading: false, bottomLoading: false});
              });
          })
          .catch(err => {
            this.setState({isLoading: false, bottomLoading: false});
          });
      });
  }
  render() {
    return (
      <>
        <Wrap
          style={{
            flex: 1,
            backgroundColor: ThemeManager.colors.bg,
          }}>
          {
            <CoustomModal
              modalVisible={this.state.modalVisible}
              setModalVisible={() =>
                this.setState({ modalVisible: false })
              }></CoustomModal>
          }

          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: ThemeManager.colors.bg,
            }}>
            <View style={{}}>
              <SimpleHeader
                title={LanguageManager.bulkTransfer}
                backImage={ThemeManager.ImageIcons.iconBack}
                titleStyle
                imageShow
                back
              />
            </View>

            <BorderLine
              borderColor={{
                backgroundColor: ThemeManager.colors.viewBorderColor,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.multiSendText,
                  {
                    color: ThemeManager.colors.textColor,
                  },
                ]}>
                Send your crypto assets to multiple addresses
              </Text>
              <ScrollView
                bounces={false}
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}
                style={{
                  flex: 1,
                  backgroundColor: ThemeManager.colors.bg,
                }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: ThemeManager.colors.bg,
                  }}>
                  <View style={[styles.step_list, { alignItems: 'flex-start' }]}>
                    <View
                      style={[styles.step_Item, { alignItems: 'flex-start' }]}>
                      <View style={[styles.viewStatusDottedStyle, { borderColor: ThemeManager.colors.dotLine }]} />

                      <View style={{ alignItems: 'center' }}>
                        <View
                          style={[
                            styles.step_item_title_view,
                            {
                              backgroundColor: ThemeManager.colors.primary,
                            },
                          ]}>
                          <Text
                            style={{
                              ...styles.step_item_title,
                              color: Colors.White,
                            }}>
                            1
                          </Text>
                        </View>
                        <Text
                          style={{
                            ...styles.step_item_text,
                            color: ThemeManager.colors.headingText,
                          }}>
                          Select
                        </Text>
                      </View>
                    </View>
                    <View style={styles.step_Item}>
                      <View
                        style={[
                          styles.viewStatusDottedStyle,
                          { left: widthDimen(-20), width: widthDimen(80), borderColor: ThemeManager.colors.dotLine },
                        ]}
                      />
                      <View
                        style={[
                          styles.viewStatusDottedStyle,
                          { left: widthDimen(60), width: widthDimen(105), borderColor: ThemeManager.colors.dotLine },
                        ]}
                      />

                      <View
                        style={[
                          styles.step_item_title_view,
                          {
                            backgroundColor: ThemeManager.colors.dotLine,
                          },
                        ]}>
                        <Text
                          style={{
                            ...styles.step_item_title,
                            color: Colors.white,
                          }}>
                          2
                        </Text>
                      </View>
                      <Text
                        style={{
                          ...styles.step_item_text,
                          color: ThemeManager.colors.colorLight,
                        }}>
                        Approve
                      </Text>
                    </View>
                    <View style={[styles.step_Item, {alignItems: 'flex-end'}]}>
                      <View
                        style={[
                          styles.viewStatusDottedStyle,
                          {
                            left: widthDimen(-20),
                            width: widthDimen(105),
                            borderColor: ThemeManager.colors.dotLine,
                          },
                        ]}
                      />

                      <View style={{alignItems: 'center'}}>
                        <View
                          style={[
                            styles.step_item_title_view,
                            {
                              backgroundColor: ThemeManager.colors.dotLine,
                            },
                          ]}>
                          <Text
                            style={{
                              ...styles.step_item_title,
                              color: Colors.white,
                            }}>
                            3
                          </Text>
                        </View>
                        <Text
                          style={{
                            ...styles.step_item_text,
                            color: ThemeManager.colors.colorLight,
                          }}>
                          Bulk Transfer
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{marginHorizontal: widthDimen(22)}}>
                    {this.state.dropDownList.length > 0 && (
                      <SelectDropdown
                        disabled={true}
                        data={this.state.dropDownList}
                        ref={ref => (this.dropDownRef = ref)}
                        label="Select Coin"
                        buttonStyle={{
                          borderWidth: 1,
                          height: heightDimen(50),
                          borderRadius: heightDimen(25),
                          justifyContent: 'flex-end',
                          backgroundColor: ThemeManager.colors.mnemonicsView,
                          borderColor: ThemeManager.colors.viewBorderColor,
                          width: '100%',
                          paddingHorizontal: widthDimen(6),
                          marginTop: heightDimen(30),
                        }}
                        buttonTextStyle={{
                          fontSize: 15,
                          color: ThemeManager.colors.lightTextColor,
                          textAlign: 'left',
                        }}
                        dropdownStyle={{
                          backgroundColor: ThemeManager.colors.mnemonicsView,
                          borderRadius: 8,
                        }}
                        rowTextStyle={styles.rowTextStyle}
                        rowStyle={{
                          borderBottomWidth: 1,
                          borderBottomColor:
                            ThemeManager.colors.viewBorderColor,
                          paddingLeft: 20,
                          backgroundColor: ThemeManager.colors.mnemonicsView,
                        }}
                        defaultButtonText={this.state.coinData[0]}
                        onSelect={(item, index) => {
                          let a = this.state.coinData[index];
                          //console.warn('MM','-====', a);
                          this.setState({selectedCoinIndex: index});
                        }}
                        renderDropdownIcon={() => (
                          <FastImage
                            source={ThemeManager.ImageIcons.dropIconDown}
                            style={{
                              width: widthDimen(10),
                              height: widthDimen(10),
                              tintColor: ThemeManager.colors.lightTextColor,
                              marginRight: widthDimen(18),
                            }}
                            resizeMode="contain"
                            tintColor={ThemeManager.colors.lightTextColor}
                          />
                        )}
                        renderCustomizedButtonChild={(item, index) => {
                          //console.warn('MM','checkItem', index);
                          let a = this.state.coinData[this.state.selectedCoinIndex]
                          
                          // console.log('item======', item);
                          console.log('item=a==', a);

                          return (
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                              onPress={() => {
                                this.setState({showAssetList: true});
                              }}>
                              {/* {a?.coin_image?.includes('http') ? ( */}
                              {item ? (
                                a?.coin_image?.includes('http') ? (
                                  <Image
                                    source={{uri: a?.coin_image}}
                                    style={{
                                      // borderRadius: widthDimen(14),
                                      // width: widthDimen(25),
                                      // height: widthDimen(25),
                                      borderRadius: widthDimen(20),
                                      width: widthDimen(30),
                                      height: widthDimen(30),
                                      resizeMode: 'contain',
                                    }}
                                    resizeMode="contain"
                                  />
                                ) : (
                                  <View
                                    style={{
                                      width: widthDimen(28),
                                      height: widthDimen(28),
                                      backgroundColor: Colors.buttonColor2,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      borderRadius: areaDimen(40),
                                    }}>
                                    <Text
                                      style={{
                                        color: 'white',
                                        textTransform: 'uppercase',
                                      }}>
                                      {a?.coin_symbol.charAt(0)}
                                    </Text>
                                  </View>
                                )
                              ) : (
                                <Image
                                  source={{
                                    uri: a.coin_image,
                                  }}
                                  style={{
                                    borderRadius: widthDimen(20),
                                    width: widthDimen(30),
                                    height: widthDimen(30),
                                    resizeMode: 'contain',
                                  }}
                                  resizeMode="contain"
                                />
                              )}

                              <Text
                                style={{
                                  fontFamily: Fonts.medium,
                                  fontSize: areaDimen(14),
                                  color: ThemeManager.colors.textColor,
                                  paddingStart: widthDimen(12),
                                }}>
                                {a?.coin_symbol.toUpperCase() ||
                                  this.state.coinData[0].coin_symbol.toUpperCase()}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}

                      />
                    )}

                    <View
                      style={{
                        marginTop: 11,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <Text
                        style={[
                          styles.balanceLabelStyle,
                          {color: ThemeManager.colors.lightTextColor},
                        ]}>
                        {LanguageManager.available + ': '}
                      </Text>
                      <Text
                        style={[
                          styles.balanceValueStyle,
                          {color: ThemeManager.colors.headingText},
                        ]}>
                        {this.state.coinData.length > 0
                          ? // Singleton.getInstance().toFixed(
                            // this.state.coinData[this.state.selectedCoinIndex]
                            //   .balance,
                            //     5,
                            //   ) +
                            //   Singleton.getInstance().exponentialToDecimal(
                            //     Singleton.getInstance().toFixed( this.state.coinData[this.state.selectedCoinIndex].balance, constants.CRYPTO_DECIMALS ),
                            // ) +
                            this.toFixedExp(
                              this.state.coinData[this.state.selectedCoinIndex]
                                .balance,
                              8,
                            ) +
                            ' ' +
                            this.state.coinData[
                              this.state.selectedCoinIndex
                            ].coin_symbol.toUpperCase()
                          : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.buttonStyle}>
                <FastImage
                  source={images.formatImage}
                  style={{
                    height: heightDimen(98.8),
                    width: '100%',
                    borderRadius: widthDimen(8),
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      'https://d2l91m18wre6ml.cloudfront.net/SampleFormat.csv',
                    );
                  }}>
                  <Text
                    style={[
                      styles.downloadCSVText,
                      {color: ThemeManager.colors.textColor},
                    ]}>
                    {' '}
                    (Sample Format)
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    marginTop: heightDimen(15),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: ThemeManager.colors.mnemonicsView,
                    borderColor: ThemeManager.colors.viewBorderColor,
                    height: heightDimen(111),
                    borderRadius: heightDimen(16),
                    borderStyle: 'dashed',
                    borderWidth: 1,
                  }}>
                  {this.state.csvFile == '' ? (
                    <TouchableOpacity
                      onPress={async () => {
                        if (await this.requestExternalStoreageRead())
                          this.pickDocument();
                      }}
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}>
                      <FastImage
                        style={{
                          height: heightDimen(18),
                          width: heightDimen(28),
                        }}
                        resizeMode={'contain'}
                        source={Images.upload_file_icon}
                      />
                      <View style={{flexDirection: 'row', marginLeft: 5}}>
                        <Text
                          style={[
                            styles.uploadCSVText,
                            {color: ThemeManager.colors.lightTextColor},
                          ]}>
                          {LanguageManager.upLoadCsv}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.uploadCSVText,
                          {
                            color: ThemeManager.colors.csvTextColor,
                            marginTop: 0,
                          },
                        ]}>
                        {' '}
                        {this.state.csvName}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          isInvalid = false;
                          this.setState({
                            csvFile: '',
                            csvName: '',
                            csvJSON: '',
                          });
                        }}>
                        <FastImage
                          style={{
                            width: widthDimen(16),
                            height: widthDimen(16),
                            marginLeft: widthDimen(8),
                            tintColor: ThemeManager.colors.primary,
                          }}
                          tintColor={ThemeManager.colors.primary}
                          resizeMode={FastImage.resizeMode.contain}
                          source={Images.cancel}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <BasicButton
                  text={LanguageManager.send}
                  onPress={() => this.onSendAction()}
                  btnStyle={styles.btnStyle}
                  customGradient={styles.customGrad}
                />
              </View>
            </View>
            {this.state.isLoading && <Loader color="white" />}
          </SafeAreaView>
        </Wrap>
        <SafeAreaView style={{backgroundColor: Colors.bulkTransBg}} />
        <Modal
          visible={this.state.showAssetList}
          animationType="slide"
          transparent={true}
          statusBarTranslucent
          style={{flex: 1, justifyContent: 'flex-end'}}>
          <ListModal
            list={this.state.coinData}
            onClose={() => this.setState({showAssetList: false})}
            onPressItem={(item, index) => {
              this.setState({selectedCoin: item});
              this.setState({selectedCoinIndex: index});
            }}
            onEndReached={() => {
              if (
                this.state.totalLength > this.state.coinData?.length &&
                !this.state.bottomLoading
              ) {
                this.setState({page: this.state.page + 1, bottomLoading: true});
                this.getMyWalletsData();
              }
            }}
            onEndReachedThreshold={0.5}
            listFooterComponent={() => {
              if (this.state.bottomLoading) {
                return (
                  <View
                    style={{
                      padding: areaDimen(20),
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingBottom: areaDimen(30),
                    }}>
                    <ActivityIndicator
                      color={ThemeManager.colors.headingText}
                    />
                  </View>
                );
              } else {
                return null;
              }
            }}
          />
        </Modal>
      </>
    );
  }
}
const mapStateToProp = state => {
  return {};
};
export default connect(mapStateToProp, { uploadCsvFile,getMyWallets })(MultiSender);
