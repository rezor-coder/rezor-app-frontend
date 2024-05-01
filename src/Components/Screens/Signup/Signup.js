import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MainHeader} from '../../common';
import Colors from '../../../theme/Colors';
import {Wrap} from '../../common/index';
import {Actions} from 'react-native-router-flux';
import {Images} from '../../../theme';
import Singleton from '../../../Singleton';
const Signup = () => {
  return (
    <Wrap>
      <MainHeader
        onpress2={() => Singleton.showAlert('scan')}
        onpress3={() => Singleton.showAlert('soon')}
        styleImg3={{tintColor: '#B1B1B1'}}
        firstImg={Images.Bell}
        secondImg={Images.scan}
        thridImg={Images.hamburger}
        containerStyle={{paddingHorizontal: 0}}
        onChangedText={text => {
          // alert(text)
        }}
      />
      <View style={styles.container}>
        <Text
          onPress={() =>
            Actions.currentScene != 'VerifyPhrase' && Actions.VerifyPhrase()
          }
          style={styles.signupText}>
          SETTINGSsdsdsds
        </Text>
      </View>
    </Wrap>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  upperTextWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '15%',
  },
  textSimple: {
    fontSize: 17,
    color: Colors.languageItem,
  },
  signupText: {
    fontSize: 22,
    color: Colors.buttonColor1,
  },
  forgotPassText: {
    fontSize: 17,
    color: Colors.languageItem,
    alignSelf: 'flex-end',
    right: '10%',
    marginTop: 10,
  },
  iconStyle: {
    position: 'absolute',
    width: 22,
    height: 22,
    resizeMode: 'contain',
    top: 43,
    left: '70%',
  },
});

export default Signup;
