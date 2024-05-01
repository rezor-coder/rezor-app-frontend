import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Colors from '../../theme/Colors';

const DotPagination = props => {
  return (
    <View style={[props.style, {flexDirection: 'row', alignSelf: 'center'}]}>
      <View
        style={[
          styles.dotView,
          {
            backgroundColor:
              props.activeDotNumber == 1 ? Colors.white : Colors.fadeDot,
          },
        ]}></View>
      <View
        style={[
          styles.dotView,
          {
            backgroundColor:
              props.activeDotNumber == 2 ? Colors.white : Colors.fadeDot,
          },
        ]}></View>
      <View
        style={[
          styles.dotView,
          {
            backgroundColor:
              props.activeDotNumber == 3 ? Colors.white : Colors.fadeDot,
          },
        ]}></View>
      <View
        style={[
          styles.dotView,
          {
            backgroundColor:
              props.activeDotNumber == 4 ? Colors.white : Colors.fadeDot,
          },
        ]}></View>
      {/* <View style={[styles.dotView, {backgroundColor: props.activeDotNumber == 5 ? Colors.white : Colors.fadeDot}]}></View>
   <View style={[styles.dotView, {backgroundColor: props.activeDotNumber == 6 ? Colors.white : Colors.fadeDot}]}></View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  dotView: {borderRadius: 40, height: 10, width: 10, margin: 12},
});

export {DotPagination};
