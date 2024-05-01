/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../../theme/Colors';

const Multibtn = props => {
  return (
    <View
      style={[
        props.style,
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        },
      ]}>
      <TouchableOpacity
        onPress={props.firstBtn}
        style={[
          {
            height: 40,
            width: 55,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: props.borderColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 7,
          },
        ]}>
        <Text style={[styles.heading, props.firstTextStyle]}>
          {props.firsttext}
        </Text>
      </TouchableOpacity>

      {props.secondtext !== '' && (
        <TouchableOpacity
          onPress={props.secondBtn}
          style={{
            height: 40,
            width: 55,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: props.borderColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 7,
          }}>
          <Text style={styles.heading}>{props.secondtext}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: Colors.languageHeader,
    fontSize: 13,
  },
});

export {Multibtn};
