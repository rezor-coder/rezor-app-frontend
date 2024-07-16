import React, { Component } from 'react';
import {
  BackHandler,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Singleton from '../../../Singleton';
import { Colors, Images } from '../../../theme';
import styles from './ScanQrStyle';
// import { CameraScreen } from 'react-native-camera-kit';
import FastImage from 'react-native-fast-image';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { LanguageManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';

class ScanQr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to_Address: '',
      Start_Scanner: false,
      item: props.item,
    };
  }
  componentDidMount() {
    this.open_QR_Code_Scanner();
    this.props.navigation.addListener('focus', this.onScreenFocus);
    this.props.navigation.addListener('blur', this.onScreenBlur);
  }

  onScreenFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  onScreenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  backAction() {
    goBack();
    return true;
  }

  open_QR_Code_Scanner = () => {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: LanguageManager.cameraAppPermission,
              message: LanguageManager.needAccessToCamera,
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.setState({ to_Address: '', Start_Scanner: true });
          } else {
            Singleton.showAlert(LanguageManager.cameraPermissionDenied);
          }
        } catch (err) {
          Singleton.showAlert(LanguageManager.cameraPermissionError, err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      that.setState({ to_Address: '', Start_Scanner: true });
    }
  };

  qrClose() {
    // this.setState({ to_Address: '', Start_Scanner: false });
    getCurrentRouteName() != 'Dashboard' && navigate(NavigationStrings.Dashboard);
  }

  onQR_Code_Scan_Done = QR_Code => {
    // //console.warn('MM','this.props?.route?.params?.item.coin_family', this.props?.route?.params?.item.coin_family);

    // alert(QR_Code)
    // this.setState({ to_Address: QR_Code, Start_Scanner: false, maxClicked: false });
    if (this.props?.route?.params?.item.coin_family == 1) {
      getCurrentRouteName() != 'SendETH' &&
        navigate(NavigationStrings.SendETH,{ walletData: this.props?.route?.params?.item, qrCode: QR_Code });
    } else {
      getCurrentRouteName() != 'SendBNB' &&
        navigate(NavigationStrings.SendBNB,{ walletData: this.props?.route?.params?.item, qrCode: QR_Code });
    }
    // if (Singleton.getInstance().validateEthAddress(QR_Code)) {
    // }
    // else {
    //   alert('Invalid Address.')
    // }
  };

  render() {
    return this.state.Start_Scanner == true ? (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.black,
          paddingTop: Platform.OS == 'ios' ? 20 : 0,
        }}>
        <TouchableOpacity
          onPress={() => this.qrClose()}
          style={[styles.addressIcon, { padding: 15, alignSelf: 'flex-end' }]}>
          <FastImage
            style={{ width: 30, height: 30, marginRight: 10 }}
            resizeMode={FastImage.resizeMode.contain}
            source={Images.modal_close_icon}
          />
        </TouchableOpacity>
        {/* <CameraScreen
          showFrame={true}
          scanBarcode={true}
          laserColor={'#FF3D00'}
          frameColor={'#00C853'}
          colorForScannerFrame={'black'}
          onReadCode={event =>
            this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
          }
        /> */}
        <QRCodeScanner
          onRead={event => {
            console.log("event:::::",event.data);
            this.onQR_Code_Scan_Done(event.data);
          }}
          cameraStyle={{width: '100%', height: '100%'}}
        />
      </SafeAreaView>
    ) : null;
  }
}

const mapStateToProp = state => {
  return {};
};

export default connect(mapStateToProp, {})(ScanQr);
