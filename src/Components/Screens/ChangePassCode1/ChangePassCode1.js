import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Actions, ActionConst } from 'react-native-router-flux';
import styles from './ChangePassCode1Style';
import Singleton from '../../../Singleton';
import * as Constants from './../../../Constant';
import { Wrap, SimpleHeader } from '../../common';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';

class ChangePassCode1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      pin: '',
      showImage: false,
    };
    this.pinCode = props.pin | '';
    this.firstTime = props.firstTime || false;
  }
  componentDidMount() {
    Singleton.getInstance()
      .newGetData(Constants.PIN)
      .then(pin => {
        this.pinCode = pin;
      });
    this.props.navigation.addListener('didFocus', () => {
      this.setState({ pin: '' });
    });
  }
  async updatePin(text) {
    if (this.state.pin.length == 6) {
      return;
    }
    let pin = this.state.pin + text;
    await this.setState({ pin });
    if (pin.length == 6) {
      if (pin == this.pinCode) {
        // alert('DONE')
        // this.props.screen == 'WalletManageEdit' ? Actions.currentScene != 'RecoveryPhrase' && Actions.RecoveryPhrase({ mnemonics: this.props.mnemonics }) : Actions.ChangePin2()
      } else {
        this.refs.toast.show('Wrong PIN');
        this.setState({ pin: '' });
      }
    }
  }

  // deletePin() {
  //   let pin = this.state.pin;
  //   if (pin.length > 0) {
  //     pin = pin.slice(0, -1)
  //     this.setState({ pin })
  //   }
  // }
  goBack() {
    global.isOnPinScreen = false;
  }
  enableBiometrics() { }
  render() {
    return (
      <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
        {/* <HeaderConfirmPin
          backVisible={true}
          title={this.props.screen == 'WalletManageEdit' ? "Enter PIN" : 'Change PIN'}
        /> */}

        <SimpleHeader
          title={LanguageManager.changePasscode}
          // rightImage={[styles.rightImgStyle]}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle
          imageShow
          back={false}
          backPressed={() => {
            // props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();
          }}
        />

        <View
          style={{
            height: 2,
            width: '100%',
            backgroundColor: ThemeManager.colors.chooseBorder,
            marginTop: 10,
            opacity: 0.6,
          }}
        />
        <View style={styles.indicatorWrapStyle}></View>
        <View style={styles.enterPinWrap}>
          <Text style={styles.enterPinTextStyle}>Enter 6 Digit PIN</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <SmoothPinCodeInput
              autoFocus={true}
              password
              mask="﹡"
              cellSize={36}
              codeLength={6}
              cellStyleFocused={{ borderColor: ThemeManager.colors.textColor }}
              cellStyle={[
                styles.cellStyle,
                { borderColor: ThemeManager.colors.inputBoxColor },
              ]}
              textStyle={[
                styles.inputText,
                { color: ThemeManager.colors.textColor },
              ]}
              value={this.state.pin}
              onTextChange={text => this.setState({ pin: text })}
            />
          </View>
        </View>
        <Toast ref="toast" />
      </Wrap>
    );
  }
}
export default ChangePassCode1;
