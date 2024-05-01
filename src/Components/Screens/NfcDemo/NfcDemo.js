/* eslint-disable react/self-closing-comp */
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform, StyleSheet
} from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import { Wrap } from '../../common';
// import NfcManager,{NfcTech} from 'react-native-nfc-manager';
import { WebView } from 'react-native-webview';


// NfcManager.start();
const NfcDemo = props => {
  // const [isLoading, setisLoading] = useState(false);
  // const [hasNfc, setHasNFC] = useState(null);

  // useEffect(() => {
  //   //console.warn('MM',"????>>>>>", "use1");

  //   checkIsSupported()
  // }, []);


  // useEffect(() => {
  //   NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
  //     //console.warn('MM','tag found')
  //   })

  //   return () => {
  //     NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
  //   }
  // }, [])

  // const checkIsSupported = async () => {
  //   //console.warn('MM',"????>>>>>", "use12");

  //   try {
  //     const deviceIsSupported = await NfcManager.isSupported()
  //     //console.warn('MM',"????>>>>>fff", deviceIsSupported);
  //   //  alert(deviceIsSupported)

  //   } catch (error) {
  //     //console.warn('MM',"????>>>>>error", error);
  //   }



  //   setHasNFC(deviceIsSupported)
  //   if (deviceIsSupported) {
  //     await NfcManager.start()
  //   }
  // }


  // const readTag = async () => {
  //   await NfcManager.registerTagEvent();
  // }

  // return (
  //   <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>

  //     <Text>Hello world</Text>
  //     <TouchableOpacity style={{padding:10}} onPress={() => { readTag }}>
  //       <Text style={{ color: "red" }}>Scan Tag</Text>
  //     </TouchableOpacity>
  //     {/* <TouchableOpacity onPress={() => { cancelReadTag }}>
  //       <Text style={{ color: "green" }}>Cancel Scan</Text>
  //     </TouchableOpacity> */}

  //   </Wrap>
  // );

  //  const readNdef = async()=> {
  //   try {
  //     // register for the NFC tag with NDEF in it
  //     alert('fd')
  //     await NfcManager.requestTechnology(NfcTech.MifareClassic);
  //     // the resolved tag object will contain `ndefMessage` property
  //     const tag = await NfcManager.getTag();
  //     console.warn('Tag found', tag);
  //   } catch (ex) {
  //     console.warn('Oops!', ex);
  //   } finally {
  //     // stop the nfc scanning
  //     NfcManager.cancelTechnologyRequest();
  //   }
  // }
  return (
    // <View style={styles.wrapper}>
    //   <TouchableOpacity onPress={readNdef}>
    //     <Text>Scan a Tag</Text>
    //   </TouchableOpacity>
    // </View>
    // <WebView
    //         javaScriptEnabledAndroid={true} 
    //         source={{html:`
    //         <div class="tradingview-widget-container">
    //           <div id="tradingview_5c9c8"></div>
    //           <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL stock chart</span></a> by TradingView</div>
    //           <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
    //           <script type="text/javascript">
    //           new TradingView.widget(
    //           {
    //           "autosize": true,
    //           "symbol": "NASDAQ:AAPL",
    //           "interval": "D",
    //           "timezone": "Etc/UTC",
    //           "theme": "light",
    //           "style": "1",
    //           "locale": "en",
    //           "toolbar_bg": "#f1f3f6",
    //           "enable_publishing": false,
    //           "allow_symbol_change": true,
    //           "container_id": "tradingview_5c9c8"
    //         }
    //           );
    //           </script>
    //         </div>
    //         `}}
    //         javaScriptEnabled={true}
    //         renderLoading={() => {
    //           return <Loader color="white" />;
    //         }}
    //         onNavigationStateChange={navState => {

    //         }}></WebView>

    <WebView
      allowsInlineMediaPlayback={true}
      originWhitelist={['*']}
      source={{
        html: `<div class="tradingview-widget-container">
              <div id="tradingview_5c9c8"></div>
              <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL stock chart</span></a> by TradingView</div>
              <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
              <script type="text/javascript">
              new TradingView.widget(
              {
              "autosize": true,
              "symbol": "NASDAQ:AAPL",
              "interval": "D",
              "timezone": "Etc/UTC",
              "theme": "light",
              "style": "1",
              "locale": "en",
              "toolbar_bg": "#f1f3f6",
              "enable_publishing": false,
              "allow_symbol_change": true,
              "container_id": "tradingview_5c9c8"
            }
              );
              </script>
            </div>
             ` }}
      javaScriptEnabled={true}
      javaScriptEnabledAndroid={true}
      mediaPlaybackRequiresUserAction={false}
      mixedContentMode={'compatibility'}

      javaScriptCanOpenWindowsAutomatically={true}
      onNavigationStateChange={(navState) => {

        //console.warn('MM','VALUE--------', navState);
      }} />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



export default NfcDemo;
