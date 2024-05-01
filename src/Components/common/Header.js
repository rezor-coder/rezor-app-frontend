import React from 'react';
import { Text, StyleSheet } from 'react-native';
import {Colors, Fonts} from '../../theme';

const Header = props => {
  return (
    <Text style={[styles.heading, props.headerStyle]}>{props.title}</Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: Colors.languageHeader,
    fontSize: 36,
    fontFamily: Fonts.regular
  }
});

export { Header };