/* eslint-disable react/self-closing-comp */
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { BorderLine, SimpleHeader, Wrap } from '../../common';

const Linkview = props => {
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    let backHandle=BackHandler.addEventListener('hardwareBackPress',()=>{
      goBack();
      return true;
    })
    return()=>{
      backHandle?.remove()
    }
    //console.warn('MM','linkkkk', props.linkhash);
  }, []);

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <SimpleHeader
        title={LanguageManager.buy}
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
        borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        enabled={Platform.OS === 'android'}>
        {
          /* <WebView
          source={{
            uri: props.linkhash
          }}
        /> */

          <WebView
            javaScriptEnabledAndroid={true}
            originWhitelist={['*']}
            onMessage={event => {
              // let message  = event.nativeEvent.data;
              // //console.warn('MM','>>>>>>message',message);

              //console.warn('MM','nativeEvent-----', event);
              let data = JSON.parse(event.nativeEvent.data);
              //console.warn('MM','nativeEvent----->>>', data);
              //console.warn('MM','nativeEvent----->>>ss', data.status);

              if (data.status == 'success') {
                if (data.message == 'Order confirmed successfully') {
                  setTimeout(() => {
                    getCurrentRouteName() != 'Dashboard' &&
                    navigate(NavigationStrings.Dashboard);
                    Singleton.showAlert(
                      'Transaction completed. Your crypto will be funded soon',
                    );
                  }, 2000);
                } else {
                  setTimeout(() => {
                    getCurrentRouteName() != 'Dashboard' &&
                    navigate(NavigationStrings.Dashboard);
                    Singleton.showAlert(data.message);
                  }, 2000);
                }
              }
              if (data.status == 'failed') {
                setTimeout(() => {
                  getCurrentRouteName() != 'Dashboard' &&
                  navigate(NavigationStrings.Dashboard);
                  Singleton.showAlert('Transaction Failed.');
                }, 2000);
              }
              // if (navState.url.includes("failed")) {
              //   setTimeout(() => {
              //     Actions.jump('Dashboard')
              //     Singleton.showAlert("Transaction Failed.")
              //   }, 2000);
              // }
            }}
            source={{ uri: props.route?.params.linkhash }}
            javaScriptEnabled={true}
            // onLoadStart={()=>{
            //   setisLoading(true)
            // }}
            // onLoadEnd={() => {
            //   setisLoading(false);
            // }}
            // renderLoading={() => {
            //   return <Loader color="white" />;
            // }}
            startInLoadingState={true}
            onNavigationStateChange={navState => {
              //console.warn('MM','VALUE--------', navState);
              //console.warn('MM','VALUE--------url', navState.url);
              // if (navState.url.includes("completed")) {
              //   setTimeout(() => {
              //     Actions.jump('Dashboard')
              //     Singleton.showAlert("Transaction completed. Your crypto will be funded soon")
              //   }, 2000);
              // }
              // if (navState.url.includes("failed")) {
              //   setTimeout(() => {
              //     Actions.jump('Dashboard')
              //     Singleton.showAlert("Transaction Failed.")
              //   }, 2000);
              // }
            }}></WebView>
          }
          {/* {isLoading && <Loader />} */}
      </KeyboardAvoidingView>
    </Wrap>
  );
};

export default Linkview;
