import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import React from 'react';
import styles from '../Screens/ConnectWithDapp/ConnectWithDappStyles';
import {Colors, Fonts, Images} from '../../theme';
import QRCode from 'react-native-qrcode-scanner';
import {LanguageManager, ThemeManager} from '../../../ThemeManager';
import {SimpleHeader} from './SimpleHeader';
import images from '../../theme/Images';
import {areaDimen, heightDimen, widthDimen} from '../../Utils/themeUtils';
import QRCodeScanner from 'react-native-qrcode-scanner';
import FastImage from 'react-native-fast-image';
import { MainStatusBar } from './StatusBar';
import { SafeAreaView } from 'react-native-safe-area-context';
const QRReaderModal = ({visible, setvisible, onCodeRead, onImageUpload}) => {
  return (
    <View style={[styles.connectModalViewStyle,{backgroundColor:ThemeManager.colors.bg}]}>
        {/* <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      /> */}
      <SimpleHeader
        containerStyle={{
          backgroundColor: ThemeManager.colors.bg,
          zIndex:9999
        }}
        title={LanguageManager.ScanQRCode}
        backImage={images.iconBackLight}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          setvisible(false);
        }}
      />
      {/* <View
        style={{
          flex: 1,
          overflow: 'hidden',
        }}>
        <FastImage
          source={images.QRScreen}
          style={styles.absoluteView}
          resizeMode="stretch"
        />
        <View style={styles.cameraAbsoluteView}>
          <QRCodeScanner
            containerStyle={{
              flex: 1,
              marginTop:
                Dimensions.get('screen').height > 900
                  ? heightDimen(40)
                  : heightDimen(10),
                  height:Dimensions.get('screen').height,
                  width:Dimensions.get('screen').width,
            }}
            cameraStyle={styles.cameraStyle}
            onRead={value => {
              console.log('value:::', value);
              onCodeRead(value.data, true);
            }}
          />
        </View>
        <TouchableOpacity
        onPress={() => onImageUpload()}
        style={{
          height: areaDimen(68),
          width: widthDimen(68),
          backgroundColor: ThemeManager.colors.backgroundColor,
          borderRadius: areaDimen(100),
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          alignSelf: 'center',
          marginTop: heightDimen(610),
        }}>
        <Image
          source={images.uploadImage}
          style={{
            alignSelf: 'center',
          }}
        />
      </TouchableOpacity>
      </View> */}
      <View
        style={{
          flex: 1,
          position:'relative',
          // backgroundColor:'green'
          // justifyContent: 'center',
        }}>
        <QRCodeScanner
          onRead={event => {
            onCodeRead(event.data,true);
          }}
          cameraStyle={{width: '100%', height: '100%'}}
        />
        <FastImage
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            // top: -80,
            left: 0,
          }}
          source={ThemeManager.ImageIcons.qrScreen}
        />
       {onImageUpload && <TouchableOpacity
          onPress={() => onImageUpload()}
          style={{
            height: areaDimen(68),
            width: widthDimen(68),
            backgroundColor: ThemeManager.colors.backgroundColor,
            borderRadius: areaDimen(100),
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            alignSelf: 'center',
            marginTop: heightDimen(610),
          }}>
          <Image
            source={images.uploadImage}
            style={{
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>}
      </View>
    </View>
  );
};

export default QRReaderModal;
