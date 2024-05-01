import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Fonts, Colors } from '../../theme';
const IndicatorCreatePin = ({ isActive }) => {
  return (
    <View style={[styles.IndicatorStyle]}>
      {isActive && <Text style={{ color: Colors.White, fontSize: 20, top: 2 }}>*</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  IndicatorStyle: {
    width: 50,
    height: 50,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.White,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  }

});

export { IndicatorCreatePin };
