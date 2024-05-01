/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  Keyboard,
} from 'react-native';
import styles from './DefiAccessMainStyle';
import {
  DefiAccessMainList,
  TabIcon,
  InputCustom,
  LeadAlert,
  LoaderView,
} from '../../common';
import { Fonts, Images, Colors } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constants';
import { Actions } from 'react-native-router-flux';
import { requestDefiLinks } from '../../../Redux/Actions';
import { connect } from 'react-redux';

class DefiAccessMain extends Component {
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
    };
  }
  componentDidMount() {
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
    Singleton.getInstance()
      .getData(Constants.ACCESS_TOKEN)
      .then(token => {
        this.setState({ isLoading: true });
        this.props
          .requestDefiLinks({ url: 'wallet/dapp', token })
          .then(res => {
            console.log('res--00--Defi-->>>>', JSON.stringify(res));
            if (res.status) {
              this.setState({ defiList: res.data });
            }
            this.setState({ isLoading: false });

            console.log('======', JSON.stringify(res));
          })
          .catch(() => {
            this.setState({ isLoading: false });
          });
      });

    this.props.navigation.addListener('didFocus', event => {
      this.setState({ refresh: !this.state.refresh, enteredURL: '' });
      Singleton.getInstance()
      .getData(Constants.PRIVATE_KEY_WALLET_COIN_FAMILY)
      .then(coin_family => {
        if (coin_family && coin_family != 1 && coin_family != 3)
          this.setState({
            showAlertDialog3: true,
            alertTxt3: 'Please import ETH,BNB wallet to use Defi Access.',
          });
      });
      Singleton.getInstance()
      .getData(Constants.ACCESS_TOKEN)
      .then(token => {
        this.setState({ isLoading: true });
        this.props
          .requestDefiLinks({ url: 'wallet/dapp', token })
          .then(res => {
            console.log('res--00--Defi-->>>>', JSON.stringify(res));
            if (res.status) {
              this.setState({ defiList: res.data });
            }
            this.setState({ isLoading: false });

            console.log('======', JSON.stringify(res));
          })
          .catch(() => {
            this.setState({ isLoading: false });
          });
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
    this.focus = this.props.navigation.addListener('didBlur', event => {
      if (this.keyboardDidShowListener) this.keyboardDidShowListener.remove();
      if (this.keyboardDidHideListener) this.keyboardDidHideListener.remove();
    });
    this.props.navigation.addListener('didFocus', this.onScreenFocus);
  }
  componentWillUnmount() {
    if (this.keyboardDidShowListener) this.keyboardDidShowListener.remove();
    if (this.keyboardDidHideListener) this.keyboardDidHideListener.remove();
  }

  onScreenFocus = () => {
    this.checkFavorite();
  };

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

  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      tabBarLabel: ' ',
      tabBarIcon: ({ focused }) => (
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
          activeImg={Images.divi_access_light_nav}
          defaultImg={Images.divi_access_light_nav_inactive}
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

  checkFavorite() {
    Singleton.getInstance()
      .getData(Constants.FAVORITE)
      .then(res => {
        if (res != null) {
          let favArray = JSON.parse(res);
          this.setState({ favoriteArray: favArray });
        }
      });
  }

  renderFavorites() {
    return (
      <FlatList
        style={{ flex: 1, marginTop: 20 }}
        data={this.state.favoriteArray}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => {
          return (
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: Colors.themeColor, marginTop: 50 }}>
                No items found.
              </Text>
            </View>
          );
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                flex: 1,
                flexWrap: 'wrap',
                marginHorizontal: 20,
                paddingVertical: 8,
                justifyContent: 'center',
                borderBottomWidth: 0.5,
                borderColor: `rgba(0,0,0,0.3)`,
              }}
              onPress={() => Actions.currentScene !== 'DappBrowser' && Actions.DappBrowser({ url: item.url })}>
              <View
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: ThemeManager.colors.inputMainColor,
                    marginRight: 8,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: Fonts.ibmbold,
                      fontSize: 15,
                      color: ThemeManager.colors.inputMainColor,
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.ibmregular,
                      fontSize: 15,
                      color: ThemeManager.colors.urlLinkColor,
                      maxWidth: '95%',
                    }}>
                    {item.url}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  }

  renderExploreSites() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.subHeader}>
          <Text
            style={[
              styles.subHeaderTitleStyle,
              { color: ThemeManager.colors.passPhraseTitle },
            ]}>
            Defi Access
          </Text>
        </View>
        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          <InputCustom
            placeHolder="Search or Type URL"
            placeholderTextColor={ThemeManager.colors.welcomeCommaName}
            customInputStyle={{
              backgroundColor: ThemeManager.colors.parentColor,
              // color: ThemeManager.colors.walletCreatedInput,
              borderColor: ThemeManager.colors.textColor,
              color: ThemeManager.colors.inputMainColor,
              paddingRight: 40,
            }}
            value={this.state.enteredURL}
            onChangeText={text => {
              // if (Constants.NO_SPACE_REGEX.test(text)) {
              this.setState({ enteredURL: text });
              // }
            }}
            autoCapitalize={'none'}
            onEndEditing={() => {
              let url = '';
              if (this.validURL(this.state.enteredURL)) {
                console.log("this.validURL");
                if (!this.state.enteredURL.startsWith('http')) {
                  console.log("!this.state.enteredURL.startsWith('http')");
                  this.setState({
                    enteredURL: 'https://' + this.state.enteredURL,
                  });
                  url = 'https://' + this.state.enteredURL;
                  Keyboard.dismiss();
                } else {
                  console.log("!this.state.enteredURL.startsWith('http')");
                  this.setState({ enteredURL: this.state.enteredURL });
                  url = this.state.enteredURL;
                }
              } else {
                console.log("!::::this.validURL");
                if (this.state.enteredURL.trim().length == 0) {

                  Keyboard.dismiss();

                  return;
                } else {
                  console.log("!!!!this.state.enteredURL.trim().length == 0");
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
              Actions.currentScene !== 'DappBrowser' && Actions.DappBrowser({ url: url });
            }}
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              let url = '';
              if (this.validURL(this.state.enteredURL)) {
                if (!this.state.enteredURL.startsWith('http')) {
                  this.setState({
                    enteredURL: 'https://' + this.state.enteredURL,
                  });
                  url = 'https://' + this.state.enteredURL;
                  Keyboard.dismiss();
                } else {
                  this.setState({ enteredURL: this.state.enteredURL });
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
              Actions.currentScene !== 'DappBrowser' && Actions.DappBrowser({ url: url });
            }}>
            <Image
              source={Images.icon_search_light}
              style={{ tintColor: Colors.White }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginBottom: this.state.bottomSpace }}>
          <DefiAccessMainList
            defiList={this.state.defiList.length > 0 ? this.state.defiList : []}
          />
        </View>
      </View>
    );
  }
  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: ThemeManager.colors.parentColor }}>
        {this.state.isFavoriteSelected
          ? this.renderFavorites()
          : this.renderExploreSites()}
        {this.state.showAlertDialog && (
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
              Actions.currentScene !== 'WalletMain' && Actions.jump('WalletMain');
            }}
          />
        )}
        <LoaderView isLoading={this.state.isLoading} />
      </SafeAreaView>
    );
  }
}

export default connect(null, {
  requestDefiLinks,
})(DefiAccessMain);
