import React from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {Fonts, Images} from '../../theme';
import Colors from '../../theme/Colors';
import {BasicButton} from './index';
import {Actions} from 'react-native-router-flux';
import {BasicInputBox} from './BasicInputBox';
import {ButtonPrimary} from './ButtonPrimary';

const AdvanceOptions = props => {
  return (
    <>
      <View style={styles.container}>
        <BasicInputBox
          width="100%"
          placeholder="Please enter Gas Limit"
          style={{}}
          title="Gas Limit"
        />
        <BasicInputBox
          width="100%"
          txtViewStyle={{marginTop: 20}}
          placeholder="Please enetr Max Priority Fee"
          style={{}}
          title="Max Priority Fee(Gwei)"
        />
        <BasicInputBox
          width="100%"
          txtViewStyle={{marginTop: 20}}
          placeholder="Max Fee"
          style={{}}
          title="Max Fee(Gwei)"
        />
        <View style={{marginTop: 40}}>
          <ButtonPrimary
            onpress={() => props.setVisible(false)}
            btnstyle={{height: 50, width: '98%'}}
            text="Submit"
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: Colors.black,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

export {AdvanceOptions};
