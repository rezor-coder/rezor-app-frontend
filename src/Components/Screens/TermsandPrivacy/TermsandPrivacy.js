/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  BackHandler,
  Linking,
  Text,
  View
} from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import { Fonts } from '../../../theme';
import {
  BorderLine,
  CheckBox,
  SecurityLink,
  SimpleHeader,
  Wrap
} from '../../common';
import { ButtonPrimary } from '../../common/ButtonPrimary';
import styles from './TermsandPrivacyStyle';
class TermsandPrivacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      toggleCheckBox: false,
    };
  }
  componentDidMount() {
    // Singleton.getInstance().getData(constants.ENABLE_PIN).then(enablePin => {
    //   //console.warn('MM','chk enablePin app lock::::security', enablePin);
    //   enablePin == 'false' ? this.setState({ isEnabled: false }) : this.setState({ isEnabled: false })
    // })
    constants.isFirstTime = true;
    this.props.navigation.addListener('focus', this.screenFocus);
    this.props.navigation.addListener('blur', this.screenBlur);
  }
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  screenFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
    //console.warn('MM','i security');
    BackHandler.exitApp();
    return true;
  };

  onProceed = () => {
    if (this.state.toggleCheckBox == false) {
      Singleton.showAlert('Please agree to terms and condtions.');
      return;
    } else {
      getCurrentRouteName() != 'SelectLanguage' && navigate(NavigationStrings.SelectLanguage);
    }
  };

  enableDisableAppLock(status) {
    //console.warn('MM','chk status app lock::::', status);
    Singleton.getInstance().newSaveData(constants.ENABLE_PIN, status.toString());
  }
  render() {
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
          <SimpleHeader
            imageShow={false}
            back={false}
            backPressed={() =>
              getCurrentRouteName() != 'Settings' && navigate(NavigationStrings.Settings)
            }
            title={'Legal'}
          />
          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
          />
          <View style={styles.securityView}>
            <SecurityLink
              textstyle={{ color: 'black' }}
              showIcon={true}
              title={'Terms of Service'}
              onPress={() =>
                Linking.openURL(
                  'https://api.saita.pro/prod/api/v1/page/web-terms-and-conditions.html',
                )
              }
            />

            <SecurityLink
              textstyle={{ color: 'black' }}
              showIcon={true}
              title={'Privacy Policy'}
              onPress={() =>
                Linking.openURL(
                  'https://api.saita.pro/prod/api/v1/page/web-privacy-policy.html',
                )
              }
            />
          </View>

          <View
            style={{
              paddingHorizontal: 15,
              flex: 1,
              borderColor: 'white',
              justifyContent: 'flex-end',
              paddingBottom: 10,
            }}>
            {/* <Text style={{ fontFamily: Fonts.regular, fontSize: 16, color: Colors.white }}>
              I have reacd and accept the Terms of service and Privacy policy.</Text> */}
            <CheckBox
              checkBoxLeft={5}
              isStored={this.state.toggleCheckBox}
              label={
                <Text
                  style={{
                    fontFamily: Fonts.regular,
                    fontSize: 14,
                    // color: Colors.white,
                    color: ThemeManager.colors.textColor,
                  }}>
                  I have read and accept the Terms of service and Privacy
                  policy.
                </Text>
              }
              onHandleCheckBox={() => {
                this.setState({ toggleCheckBox: !this.state.toggleCheckBox });
              }}
            />

            <ButtonPrimary
              btnstyle={styles.btnStyle}
              onpress={() => this.onProceed()}
              text="Proceed"
            />
          </View>
        </Wrap>
      </>
    );
  }
}

export default TermsandPrivacy;
