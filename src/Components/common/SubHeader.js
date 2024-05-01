import React from 'react';
import {Text, StyleSheet, View, Platform} from 'react-native';
import Colors from '../../theme/Colors';
import fonts from '../../theme/Fonts';

const SubHeader = props => {
  return (
    <View style={[props.headerstyle]}>
      <Text style={[styles.heading, props.headerTextStyle]}>{props.title}</Text>
      <Text
        style={[
          styles.heading,
          {marginTop: Platform.OS === 'ios' ? -7 : -15},
          props.subTitleStyle,
        ]}>
        {props.Subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: Colors.languageHeader,
    fontSize: 36,
    alignSelf: 'center',
    fontFamily: fonts.regular,
  },
});

export {SubHeader};
