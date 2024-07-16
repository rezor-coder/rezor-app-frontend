import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { NavigationStrings } from '../../Navigation/NavigationStrings';
import { getCurrentRouteName, navigate } from '../../navigationsService';
import { Fonts } from '../../theme';
import Colors from '../../theme/Colors';
import { BasicButton } from './index';

const ThankYouModal = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.thankYouText}>Thank You</Text>
      <Text style={styles.thankYouDesc}>
        We will get in touch shortly in the email address you provided. This is
        the only official Saita mask support. Please do not trust other alleged
        channels.
      </Text>
      <BasicButton
        onPress={() => {
          getCurrentRouteName() != 'Dashboard' && navigate(NavigationStrings.Dashboard);
        }}
        btnStyle={styles.btnStyle}
        text="Close"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
    left: '10%',
    top: '32%',
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 30,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.normal,
  },
  thankYouDesc: {
    fontSize: 16,
    color: Colors.languageItem,
    fontFamily: Fonts.normal,
    width: '80%',
    textAlign: 'center',
  },
  btnStyle: {
    width: '30%',
    height: 50,
    marginTop: '30%',
  },
});

export { ThankYouModal };
