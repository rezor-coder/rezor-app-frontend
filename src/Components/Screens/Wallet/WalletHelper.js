import messaging from '@react-native-firebase/messaging';
import {AppState, Alert, BackHandler, Linking} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {getRouterDetails} from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import {getCurrentRouteName, navigate} from '../../../navigationsService';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import {EventRegister} from 'react-native-event-listeners';

const handleNotification = data => {
  console.log('AppState.currentState::::::', AppState.currentState);
  if (AppState.currentState === 'active') {
    global.isAppOpen = true;
  }
  global.isNotification = true;
};

export const Notification = () => {
  messaging()
    .getInitialNotification()
    .then(notificationOpen => {});
  messaging().onNotificationOpenedApp(notificationOpen => {
    console.warn('MM', 'data notify----', notificationOpen);
    handleNotification(notificationOpen);
  });
  messaging().onMessage(async notification => {
    console.warn(
      'MM',
      'A new FCM message arrived!',
      JSON.stringify(notification),
    );
    showMessage({
      message: notification.data.body,
      backgroundColor: '#fff',
      titleStyle: {color: '#000', marginTop: -12, marginBottom: 10},
      style: {borderRadius: 8, margin: 10},
      duration: 4000,
      type: 'success',
      onPress: () => {},
    });
  });
};

export const backAction = () => {
  let stopAsk = false;
  if (!stopAsk) {
    stopAsk = true;
    Alert.alert(Constants.APP_NAME, 'Are you sure you want to exit the app?', [
      {
        text: 'Cancel',
        onPress: () => {
          stopAsk = false;
        },
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          stopAsk = false;
          BackHandler.exitApp();
        },
      },
    ]);
  }
  return true;
};

export const getRouterDetailsApi = dispatch => {
  dispatch(getRouterDetails())
    .then(response => {
      console.warn('MM', 'response== router ==== pin', response.data);
      let instance = Singleton.getInstance();
      instance.SwapRouterAddress = response.data.Router;
      instance.SwapFactoryAddress = response.data.Factory;
      instance.StakeSaitamaAddress = response.data.SaitamaAddress;
      instance.StakingContractAddress = response.data.StakingContractAddress;
      instance.SwapWethAddress = response.data.WethAddress;
      instance.SwapRouterBNBAddress = response.data.BnbRouter;
      instance.SwapRouterStcAddress = response.data.StcRouter;
      instance.SwapRouterStcAddress = response.data.StcRouter;
      instance.SwapWBNBAddress = response.data.WbnbAddress;
      instance.SwapWethAddressSTC = response.data.StcWeth;
      instance.SwapFactoryAddressSTC = response.data.StcFactory;
      instance.SwapFactoryAddressBNB = response.data.BnbFactory;
    })
    .catch(error => {
      console.warn('MM', 'error==contract=== pin', error);
    });
};

const handleDeepLink = event => {
  console.log('::::::deeep linking::::::::::');
  if (getCurrentRouteName() === 'DappBrowser') {
    Singleton.getInstance().isCamera = true;
    global.isCamera = true;
    global.stop_pin = true;
  }
  setTimeout(async () => {
    const decodedLink = decodeURIComponent(event.url);
    const link = decodedLink.includes('saitapro')
      ? decodedLink
          .replace('saitapro:///wc?uri=', '')
          .replace('saitapro://wc?uri=', '')
          .replace('saitapro://app/wc?uri=', '')
      : decodedLink;
    if (link.includes('requestId=') || link.includes('sessionTopic=')) {
      if (getCurrentRouteName() === 'DappBrowser') {
        global.requestFromDeepLink = false;
      } else {
        global.requestFromDeepLink = true;
      }
    } else {
      Singleton.getInstance()
        .newGetData(Constants.IS_LOGIN)
        .then(res => {
          if (res === 1) {
            Singleton.getInstance()
              .newGetData(Constants.ENABLE_PIN)
              .then(pin => {
                if (pin === 'false') {
                  if (getCurrentRouteName() !== 'ConnectWithDapp') {
                    navigate(NavigationStrings.ConnectWithDapp, {url: link});
                  } else {
                    EventRegister.emitEvent('wallet_connect_event', link);
                  }
                } else {
                  if (getCurrentRouteName() === 'DappBrowser') {
                    navigate(NavigationStrings.ConnectWithDapp, {url: link});
                  } else {
                    global.isDeepLink = true;
                    global.deepLinkUrl = link;
                  }
                }
              });
          }
        });
    }
  }, 500);
};

export const addDeepLinkListner = () => {
  try {
    Linking.addEventListener('url', event => handleDeepLink(event));
    Linking.getInitialURL()
      .then(url => {
        console.log('------killed------', url);
        if (url) {
          Linking.canOpenURL(url).then(async supported => {
            // console.log('------killed------', url);
            if (supported) {
              const decodedLink = decodeURIComponent(url);
              const link = decodedLink.includes('saitapro')
                ? decodedLink
                    .replace('saitapro:///wc?uri=', '')
                    .replace('saitapro://wc?uri=', '')
                    .replace('saitapro://app/wc?uri=', '')
                : decodedLink;
              if (link?.includes('relay')) {
                Singleton.getInstance()
                  .newGetData(Constants.IS_LOGIN)
                  .then(res => {
                    if (res === 1) {
                      Singleton.getInstance()
                        .newGetData(Constants.ENABLE_PIN)
                        .then(pin => {
                          if (pin === 'false') {
                            if (getCurrentRouteName() !== 'ConnectWithDapp') {
                              navigate(NavigationStrings.ConnectWithDapp, {
                                url: link,
                              });
                            } else {
                              EventRegister.emitEvent(
                                'wallet_connect_event',
                                link,
                              );
                            }
                          } else {
                            global.isDeepLink = true;
                            global.deepLinkUrl = link;
                          }
                        });
                    }
                  });
              } else {
                global.requestFromDeepLink = true;
              }
            } else {
              global.requestFromDeepLink = true;
            }
          });
        }
      })
      .catch(e => console.log('errr::::::', e));
  } catch (e) {
    console.log('deeplink listener error::::::', e);
  }
};

export const getCardDetails = () => {
  Singleton.getInstance()
    .newGetData(Constants.CARD_TOKEN)
    .then(token => {
      console.log(token, 'tokentokentokentoken');
      if (!!token) {
        navigate(NavigationStrings.SaitaCardDashBoard);
      }
    });
};

export const coinSelection = item => {
  getCurrentRouteName() !== 'CoinHome' &&
    navigate(NavigationStrings.CoinHome, {coin: item});
};
