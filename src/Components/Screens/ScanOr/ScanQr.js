import React, { Component } from 'react';
import {
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import styles from './ScanQrStyle';
import { Images, Colors } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import { connect } from 'react-redux';
import { CameraScreen } from 'react-native-camera-kit';
import FastImage from 'react-native-fast-image';
import { LanguageManager } from '../../../../ThemeManager';

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
    this.props.navigation.addListener('didFocus', this.onScreenFocus);
    this.props.navigation.addListener('didBlur', this.onScreenBlur);
  }

  onScreenFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  onScreenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  backAction() {
    Actions.pop();
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
    Actions.currentScene != 'Dashboard' && Actions.Dashboard();
  }

  onQR_Code_Scan_Done = QR_Code => {
    // //console.warn('MM','this.props?.item.coin_family', this.props?.item.coin_family);

    // alert(QR_Code)
    // this.setState({ to_Address: QR_Code, Start_Scanner: false, maxClicked: false });
    if (this.props?.item.coin_family == 1) {
      Actions.currentScene != 'SendETH' &&
        Actions.SendETH({ walletData: this.props?.item, qrCode: QR_Code });
    } else {
      Actions.currentScene != 'SendBNB' &&
        Actions.SendBNB({ walletData: this.props?.item, qrCode: QR_Code });
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
        <CameraScreen
          showFrame={true}
          scanBarcode={true}
          laserColor={'#FF3D00'}
          frameColor={'#00C853'}
          colorForScannerFrame={'black'}
          onReadCode={event =>
            this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
          }
        />
      </SafeAreaView>
    ) : null;
  }
}

const mapStateToProp = state => {
  return {};
};

export default connect(mapStateToProp, {})(ScanQr);
