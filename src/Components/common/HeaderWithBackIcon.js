import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Colors } from '../../theme';
import { Wrap } from './Wrap';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const HeaderwithBackIcon = props => {
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity
        style={{
          width: widthDimen(40),
          height: widthDimen(40),
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
        onPress={props.onPress || Actions.pop}>
        <Image style={styles.iocnLeftStyle} source={props.iconLeft} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: areaDimen(20),
    paddingVertical: heightDimen(4),
},

  iocnLeftStyle: {
    width: widthDimen(35),
    height: widthDimen(35),
    resizeMode: 'contain',
    // tintColor: Colors.white,
    padding: widthDimen(10),
  },
});

export default HeaderwithBackIcon;
