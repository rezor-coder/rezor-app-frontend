/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { ColorA } from '../../Constant';
import { Colors, colors, Fonts } from '../../theme';

const TradeHeader = props => {
  const [size, setSize] = useState(0);
  const onLayout = event => {
    // alert('hello');
    let x = event.nativeEvent.layout;
    //console.warn('MM','width---=-=-=>>>>', x);
    setSize(x.width);
    // //console.warn('MM','width---=-=-=>>>>', x);
  };
  return (
    <View
      onLayout={onLayout}
      style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={[
          {
            color: props.underLine
              ? ThemeManager.colors.textColor
              : Colors.fadetext,
          },
          props.custmTabTxt,
        ]}>
        {props.title}
      </Text>
      {props.underLine ? (
        <View
          style={{
            // alignItems: 'baseline',
            // justifyContent: 'center',
            height: 2,
            // marginLeft: -20,
            alignSelf: 'center',
            width: 70,
            marginTop: 10,
            backgroundColor: Colors.buttonColor5,
            marginBottom: -10,
            // width: size,
          }}
        />
      ) : null}
    </View>
  );
};
export default TradeHeader;
