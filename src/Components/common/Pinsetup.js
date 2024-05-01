import React from 'react';
import { View, StyleSheet } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const Pinsetup = () => {
  return (
    <View style={styles.container}>
      <OTPInputView
        pinCount={6}
        style={styles.otpView}
        codeInputFieldStyle={styles.underlineStyleBase}
        onCodeFilled={value => {
          //console.warn('MM',value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpView: {
    width: '80%',
    height: 200,
    color: 'black',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: 'black',
    borderBottomColor: '#17BED0',
  },
});

export default Pinsetup;