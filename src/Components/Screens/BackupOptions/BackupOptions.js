/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  BackHandler,
  View,
  Text,
} from 'react-native';
import styles from './BackupOptionsStyle';
import {
  SecuritySwitch,
  SimpleHeader,
  Wrap,
  SecurityLink,
  MainStatusBar,
  BorderLine,
} from '../../common';
import { Fonts, Images, Colors } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import * as constants from '../../../Constant';
import { SettingBar } from '../../common/SettingBar';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import fonts from '../../../theme/Fonts';

class BackupOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: true,
      isPrivate: false,
      activeWallet: {},
    };
  }
  componentDidMount() {
    Singleton.getInstance()
      .newGetData(constants.ACTIVE_WALLET)
      .then(wallet => {
        this.setState({ activeWallet: JSON.parse(wallet) });
      });

    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (isPrivate == null || isPrivate == '0') {
          this.setState({ isPrivate: false });
        } else {
          this.setState({ isPrivate: true });
        }
      })
      .catch(err => {
 //  console.warn('MM','err', err);
      });

    Singleton.getInstance()
      .newGetData(constants.ENABLE_PIN)
      .then(enablePin => {
        // console.warn('MM','chk enablePin app lock::::security', enablePin);
        enablePin == 'false'
          ? this.setState({ isEnabled: false })
          : this.setState({ isEnabled: true });
      });
    this.props.navigation.addListener('didFocus', this.screenFocus);
    this.props.navigation.addListener('didBlur', this.screenBlur);
  }
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  screenFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
 //  console.warn('MM','i security');
    Actions.pop();
    return true;
  };
  enableDisableAppLock(status) {
    // console.warn('MM','chk status app lock::::', status);
    Singleton.getInstance().newSaveData(constants.ENABLE_PIN, status.toString());
  }
  render() {
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
          <MainStatusBar
            backgroundColor={ThemeManager.colors.backgroundColor}
            barStyle={
              ThemeManager.colors.themeColor === 'light'
                ? 'dark-content'
                : 'light-content'
            }
          />
          <SimpleHeader
            title={LanguageManager.backupWallet}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            back={false}
            backPressed={() => {
              this.props.navigation.goBack();
            }}
          />
          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
          />
          <Text
            style={[
              styles.optionStyle,
              { color: ThemeManager.colors.textColor },
            ]}>
            {LanguageManager.backUpOptions}
          </Text>
          <View
            style={[
              styles.securityView,
              { backgroundColor: ThemeManager.colors.backupView },
            ]}>
            {!this.state.isPrivate && (
              <View>
                <SecurityLink
                  title={LanguageManager.showRecoveryPhrase}
                  textstyle={[
                    styles.linkStyle,
                    { color: ThemeManager.colors.textColor },
                  ]}
                  showIcon
                  onPress={() =>
                    Actions.currentScene != 'ConfirmPin' &&
                    Actions.ConfirmPin({
                      redirectTo: 'RecoveryPhrase',
                      goBack: true,
                      walletItem: this.state.activeWallet,
                    })
                  }
                />
                <View
                  style={[
                    styles.securityViewStyle,
                    { backgroundColor: ThemeManager.colors.chooseBorder },
                  ]}
                />
              </View>
            )}
            <SecurityLink
              textstyle={[
                styles.linkStyle,
                { color: ThemeManager.colors.textColor },
              ]}
              showIcon
              title={LanguageManager.exportPrivateKeys}
              onPress={() =>
             {
              Actions.currentScene != 'ConfirmPin' &&
              Actions.ConfirmPin({
                redirectTo: 'ExportPrivateKeys',
                goBack: true,
                walletItem: this.state.activeWallet,
              })
                //  Actions.currentScene != 'ExportPrivateKeys' &&
                // Actions.ExportPrivateKeys({
                //   walletItem: this.state.activeWallet,
                // })
              }
              }
              style={styles.borderWidthStyle}
            />
          </View>
        </Wrap>
      </>
    );
  }
}

export default BackupOptions;