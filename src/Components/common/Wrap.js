import React from 'react';
import {Platform, SafeAreaView, StyleSheet,StatusBar} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';

const Wrap = props => {
  return (
    <>
      <SafeAreaView style={[styles.wrapBg, props.style]}>
      <StatusBar
      backgroundColor={props.style.backgroundColor || ThemeManager.colors.bg}
      barStyle={  ThemeManager.colors.themeColor === 'light'
      ? 'dark-content'
      : 'light-content'}
    />
        {props.children}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapBg: {
    // backgroundColor: Colors.Darkbg,
    flex: 1,
    // color: Colors.White,o,

  },
});

export {Wrap};
