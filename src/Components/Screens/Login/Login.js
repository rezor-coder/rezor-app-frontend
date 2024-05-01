import React from 'react';
import {View, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {BasicInputBox, Wrap, BasicButton} from '../../common/index';
import images from '../../../theme/Images';
import styles from './LoginStyle';

const Login = () => {
  return (
    <Wrap>
      <View style={styles.container}>
        <View style={styles.upperTextWrapStyle}>
          <Text style={styles.textSimple}>Don’t have an account?</Text>
          <Text
            onPress={() => Actions.currentScene != 'Signup' && Actions.Signup()}
            style={styles.signupText}>
            {' '}
            SIGN UP
          </Text>
        </View>
        <BasicInputBox
          width="80%"
          icon={images.emailIcon}
          iconStyle={styles.iconStyle}
          placeholder="E-mail Address"
        />
        <BasicInputBox
          width="80%"
          icon={images.lockIcon}
          iconStyle={styles.iconStyle}
          placeholder="Password"
          secureTextEntry={true}
        />
        <BasicButton
          onPress={() =>
            Actions.currentScene != 'VerifyPhrase' && Actions.VerifyPhrase()
          }
          btnStyle={styles.btnStyle}
          text="Log in"
        />
        <Text style={styles.forgotPassText}>Forgot Password?</Text>
      </View>
    </Wrap>
  );
};

export default Login;
