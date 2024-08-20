/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import Singleton from '../../../Singleton';
import { Fonts, Images } from '../../../theme';
import { MainStatusBar, TabIcon } from '../../common';
import styles from './DefiAccessMainStyle';
// import { requestDefiLinks } from '../../../Redux/Actions';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate, reset } from '../../../navigationsService';
import { InputCustom } from '../../common/InputCustom';

class DefiAccessmainIOS extends Component {
  
  constructor(props) {

    super(props);
    this.state = {
      refresh: false,
      isLoading: false,
      enteredURL: '',
      isFavoriteSelected: false,
      favoriteArray: [],
      showAlertDialog: false,
      alertTxt: '',
      defiList: [],
      showAlertDialog3: false,
      alertTxt3: '',
      bottomSpace: 60,
      isPrivate: '',
      showDefi: true,
    };
  }
  componentDidMount() {

    this.backHandle= BackHandler.addEventListener('hardwareBackPress',()=>{
      if( getCurrentRouteName()=='DeFi'){
        getCurrentRouteName() != 'Main' && reset(NavigationStrings.Main)
      }else{
        goBack()
      }
      return true
    })
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (Singleton.bottomBar) {
          Singleton.bottomBar.toggleBar(false);
          this.setState({
            bottomSpace: 0,
          });
        }
      },
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (Singleton.bottomBar) {
          Singleton.bottomBar.toggleBar(true);
          this.setState({
            bottomSpace: 60,
          });
        }
      },
    );

    this.props.navigation.addListener('focus', event => {
      this.backHandle= BackHandler.addEventListener('hardwareBackPress',()=>{
        if( getCurrentRouteName()=='DeFi'){
          getCurrentRouteName() != 'Main' && reset(NavigationStrings.Main)
        }else{
          goBack()
        }
        return true
      })
      Singleton.getInstance()
        .newGetData(Constants.IS_PRIVATE_WALLET)
        .then(isPrivate => {
          console.log('isPrivate::::', isPrivate);
          if (isPrivate == 'btc' || isPrivate == 'trx' || isPrivate == 'stc' ) {
            console.log('isPrivate::::', isPrivate);
            // Singleton.showAlert(Constants.UNCOMPATIBLE_WALLET);
            this.setState({isPrivate: isPrivate, showDefi: false});
          } else {
            if (
              isPrivate == Constants.COIN_SYMBOL.BNB ||
              isPrivate == Constants.COIN_SYMBOL.ETH ||
              isPrivate == Constants.COIN_SYMBOL.MATIC
            ) {
              this.setState({isPrivate: isPrivate, showDefi: true});
            } else {
              this.setState({isPrivate: '', showDefi: true});
            }
          }
        });
      this.setState({enteredURL: ''});
      Singleton.getInstance()
        .getData(Constants.FAVORITE)
        .then(res => {
          this.setState({favoriteArray: JSON.parse(res)});
        });
      Singleton.getInstance()
        .getData(Constants.PRIVATE_KEY_WALLET_COIN_FAMILY)
        .then(coin_family => {
          if (coin_family && coin_family != 1 && coin_family != 3) {
            this.setState({
              showAlertDialog3: true,
              alertTxt3: 'Please import ETH,BNB wallet to use Defi Access.',
            });
          }
        });
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          if (Singleton.bottomBar) {
            Singleton.bottomBar.toggleBar(false);
            this.setState({
              bottomSpace: 0,
            });
          }
        },
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          if (Singleton.bottomBar) {
            Singleton.bottomBar.toggleBar(true);
            this.setState({
              bottomSpace: 60,
            });
          }
        },
      );
    });
    this.focus = this.props.navigation.addListener('blur', event => {
      this.backHandle?.remove()
      if (this.keyboardDidShowListener) {
        this.keyboardDidShowListener.remove();
      }
      if (this.keyboardDidHideListener) {
        this.keyboardDidHideListener.remove();
      }
    });
    this.props.navigation.addListener('focus', this.onScreenFocus);
  }
  componentWillUnmount() {
    this.backHandle?.remove()
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  onScreenFocus = () => {};

  validURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(str);
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
      tabBarLabel: ' ',
      tabBarIcon: ({focused}) => (
        <TabIcon
          focused={focused}
          title={'Defi Access'}
          ImgSize={{
            width: 17,
            height: 23,
            tintColor: focused
              ? ThemeManager.colors.focussedBottomTextColor
              : ThemeManager.colors.unFocussedBottomTextColor,
          }}
          activeImg={Images.defiActiveNew}
          defaultImg={Images.defiInActiveNew}
          titleColor={{
            color: focused
              ? ThemeManager.colors.focussedBottomTextColor
              : ThemeManager.colors.unFocussedBottomTextColor,
          }}
        />
      ),
      tabBarOptions: {
        style: {
          borderTopColor: 'transparent',
          backgroundColor: ThemeManager.colors.tabBarColor,
        },
        keyboardHidesTabBar: true,
      },
    };
  };

  renderExploreSites() {
    return (
      <View style={{flex: 1}}>
         <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
        <View style={{marginHorizontal: 20, marginBottom: 20}}>
          <InputCustom
            placeHolder="Search or Type URL"
            placeholderTextColor={ThemeManager.colors.lightTextColor}
            customInputStyle={{
              backgroundColor: ThemeManager.colors.mnemonicsView,
              // color: ThemeManager.colors.walletCreatedInput,
              borderColor: ThemeManager.colors.viewBorderColor,
              color: ThemeManager.colors.textColor,
              paddingRight: 40,
              borderWidth:1
            }}
            value={this.state.enteredURL}
            onChangeText={text => {
              console.log('text?.length', text?.length);
              // if (Constants.NO_SPACE_REGEX.test(text)) {
              this.setState({enteredURL: text});
              // }
            }}
            maxLength={250}
            autoCapitalize={'none'}
            onEndEditing={() => {
              let url = '';
              if (
                !this.state.enteredURL?.startsWith('https') &&
                this.state.enteredURL?.length > 250
              ) {
                Singleton.showAlert(
                  'Please enter valid keywords or url to search.',
                );
                return;
              }
              if (this.validURL(this.state.enteredURL)) {
                console.log('this.validURL');
                if (!this.state.enteredURL.startsWith('http')) {
                  console.log("!this.state.enteredURL.startsWith('http')");
                  this.setState({
                    enteredURL: 'https://' + this.state.enteredURL,
                  });
                  url = 'https://' + this.state.enteredURL;
                  Keyboard.dismiss();
                } else {
                  console.log("!this.state.enteredURL.startsWith('http')");
                  this.setState({enteredURL: this.state.enteredURL});
                  url = this.state.enteredURL;
                }
              } else {
                console.log('!::::this.validURL');
                if (this.state.enteredURL.trim().length == 0) {
                  Keyboard.dismiss();

                  return;
                } else {
                  console.log('!!!!this.state.enteredURL.trim().length == 0');
                  this.setState({
                    enteredURL:
                      'https://www.google.com/search?q=' +
                      this.state.enteredURL,
                  });
                  url =
                    'https://www.google.com/search?q=' + this.state.enteredURL;
                  Keyboard.dismiss();
                }
              }
              getCurrentRouteName() !== 'DappBrowser' &&
              navigate(NavigationStrings.DappBrowser,{
                  url: url,
                  chain: this.state.isPrivate,
                  item: {
                    coin_family:
                      this.state.isPrivate == Constants.COIN_SYMBOL.ETH
                        ? 1
                        : this.state.isPrivate == Constants.COIN_SYMBOL.BNB
                        ? 6
                        : this.state.isPrivate == Constants.COIN_SYMBOL.MATIC
                        ? ''
                        : 1,
                  },
                });
            }}
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              let url = '';
              if (
                !this.state.enteredURL?.startsWith('https') &&
                this.state.enteredURL?.length > 40
              ) {
                Singleton.showAlert(
                  'Please enter valid keywords or url to search.',
                );
                return;
              }
              if (this.validURL(this.state.enteredURL)) {
                if (!this.state.enteredURL.startsWith('http')) {
                  this.setState({
                    enteredURL: 'https://' + this.state.enteredURL,
                  });
                  url = 'https://' + this.state.enteredURL;
                  Keyboard.dismiss();
                } else {
                  this.setState({enteredURL: this.state.enteredURL});
                  url = this.state.enteredURL;
                }
              } else {
                if (this.state.enteredURL.trim().length == 0) {
                  this.setState({
                    showAlertDialog: true,
                    alertTxt: 'Please enter URL',
                  });
                  Keyboard.dismiss();

                  return;
                } else {
                  this.setState({
                    enteredURL:
                      'https://www.google.com/search?q=' +
                      this.state.enteredURL,
                  });
                  url =
                    'https://www.google.com/search?q=' + this.state.enteredURL;
                  Keyboard.dismiss();
                }
              }
              getCurrentRouteName() !== 'DappBrowser' &&
              navigate(NavigationStrings.DappBrowser,{
                  url: url,
                  chain: this.state.isPrivate,
                  item: {
                    coin_family:
                      this.state.isPrivate == Constants.COIN_SYMBOL.ETH
                        ? 1
                        : this.state.isPrivate == Constants.COIN_SYMBOL.BNB
                        ? 6
                        : this.state.isPrivate == Constants.COIN_SYMBOL.MATIC
                        ? ''
                        : 1,
                  },
                });
            }}>
            <Image
              source={ThemeManager.ImageIcons.searchIcon}
              style={{height: widthDimen(16), width: widthDimen(16)}}
            />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, marginBottom: this.state.bottomSpace}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            {this.state.favoriteArray?.length > 0 && (
              <Text
                style={[
                  styles.linkTextStyle,
                  {
                    paddingHorizontal: 20,
                    fontSize: 16,
                    fontFamily: Fonts.medium,
                    top: -10,
                    color: ThemeManager.colors.textColor,
                  },
                ]}>
                Saved Bookmarks
              </Text>
            )}
            {this.state.favoriteArray?.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Alert',
                    'Are you sure, you want to clear all your bookmarks?',
                    [
                      {
                        text: `${'No'}`,
                        onPress: () => {},
                      },
                      {
                        text: `${'Yes'}`,
                        onPress: () => {
                          Singleton.getInstance()
                            .saveData(Constants.FAVORITE, JSON.stringify([]))
                            .then(res => {
                              this.setState({
                                favoriteArray: [],
                              });
                            });
                        },
                      },
                    ],
                  );
                }}>
                <Text
                  style={[
                    styles.linkTextStyle,
                    {
                      paddingHorizontal: 20,
                      fontSize: 14,
                      fontFamily: Fonts.medium,
                      top: -10,
                      textDecorationLine: 'underline',
                      color: ThemeManager.colors.lightTextColor,
                    },
                  ]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {this.state.favoriteArray?.length > 0 ? (
            <FlatList
              data={this.state.favoriteArray}
              contentContainerStyle={{marginTop:heightDimen(10)}}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={[styles.listStyle]}
                    onPress={() => {
                      getCurrentRouteName() !== 'DappBrowser' &&
                      navigate(NavigationStrings.DappBrowser, {
                          type: 'Decentralized Finance ',
                          url: item.url,
                          chain: this.state.isPrivate,
                          item: {
                            coin_family:
                              this.state.isPrivate == Constants.COIN_SYMBOL.ETH
                                ? 1
                                : this.state.isPrivate == Constants.COIN_SYMBOL.BNB
                                ? 6
                                : this.state.isPrivate == Constants.COIN_SYMBOL.MATIC
                                ? ''
                                : 1,
                          },
                        });
                    }}>
                    <View
                      style={[styles.item_defi, {backgroundColor: ThemeManager.colors.backgroundColor}]}>
                      <FastImage
                        style={{
                          width: 40,
                          height: 40,
                          left: 5,
                          borderRadius: item.iconUrl?.icon != '' ? 40 : 0,
                        }}
                        source={
                          item.iconUrl?.icon != ''
                            ? {uri: item.iconUrl?.icon}
                            : Images.bookmark
                        }
                        resizeMode="contain"
                      />
                      <View style={styles.textBlockStyle}>
                        {/* <Text style={[styles.titleTextStyle,{color:ThemeManager.colors.welcomeCommaName}]}>{item.title}</Text>     */}
                        <Text
                          style={[
                            styles.descTextStyle,
                            {color: ThemeManager.colors.textColor},
                          ]}>
                          {item.title}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            getCurrentRouteName() !== 'DappBrowser' &&
                            navigate(NavigationStrings.DappBrowser, {
                                type: 'Decentralized Finance ',
                                url: item.url,
                                chain: this.state.isPrivate,
                                item: {
                                  coin_family:
                                    this.state.isPrivate == Constants.COIN_SYMBOL.ETH
                                      ? 1
                                      : this.state.isPrivate == Constants.COIN_SYMBOL.BNB
                                      ? 6
                                      : this.state.isPrivate == Constants.COIN_SYMBOL.MATIC
                                      ? ''
                                      : 1,
                                },
                              });
                          }}>
                          <Text style={[styles.linkTextStyle,{color:ThemeManager.colors.lightTextColor}]}>{item.url}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                }}>
                <Text
                  style={[
                    styles.linkTextStyle,
                    {
                      paddingHorizontal: 20,
                      fontSize: 14,
                      fontFamily: Fonts.regular,
                      color: ThemeManager.colors.lightTextColor,
                    },
                  ]}>
                  Your bookmarks will appear here
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: ThemeManager.colors.bg}}>
        <View style={styles.subHeader}>
          <Text
            style={[
              styles.subHeaderTitleStyle,
              {color: ThemeManager.colors.headingText},
            ]}>
            Defi Access
          </Text>
        </View>
        {/* <View style={{backgroundColor:'red', height:200,width:200}} /> */}
        {this.state.showDefi ? (
          this.renderExploreSites()
        ) : (
          <>
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text
                style={{
                  fontSize: areaDimen(16),
                  fontFamily: Fonts.medium,
                  color: ThemeManager.colors.textColor,
                  paddingHorizontal: widthDimen(22),
                  textAlign:'center'
                }}>
                {Constants.UNCOMPATIBLE_WALLET}
              </Text>
            </View>
          </>
        )}
        {/* {this.state.showAlertDialog && (
                    <LeadAlert
                        alertTxt={this.state.alertTxt}
                        hideAlertDialog={() => {
                            this.setState({ showAlertDialog: false });
                        }}
                    />
                )}
                {this.state.showAlertDialog3 && (
                    <LeadAlert
                        alertTxt={this.state.alertTxt3}
                        hideAlertDialog={() => {
                            this.setState({ showAlertDialog3: false });
                            getCurrentRouteName() !== 'WalletMain' &&    Actions.jump('WalletMain');
                        }}
                    />
                )} */}
        {/* <LoaderView isLoading={this.state.isLoading} /> */}
      </SafeAreaView>
    );
  }
}

export default connect(null, {
  // requestDefiLinks,
})(DefiAccessmainIOS);
