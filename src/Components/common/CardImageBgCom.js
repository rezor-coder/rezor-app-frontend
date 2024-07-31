import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Images} from '../../theme';
import {areaDimen, height, heightDimen, width} from '../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';

const CardImageBgCom = ({
  cardMainViewStyle,
  onPress = () => {},
  renderComponent = () => {},
  cardImage = Images.cardBg,
  disabled=false
}) => {

  
  return (
    <TouchableOpacity
      style={{...styles.cardView, ...cardMainViewStyle}}
      activeOpacity={1}
      disabled={disabled}
      onPress={onPress}>
      <FastImage
        source={cardImage}
        style={styles.cardImageStyle}
      />
      {renderComponent()}
    </TouchableOpacity>
  );
};

export default CardImageBgCom;

const styles = StyleSheet.create({
  cardImageStyle: {
    height: '100%',
    width: '100%',
    
    position: 'absolute',
    zIndex: 0,
    alignSelf:'center',
    borderRadius: areaDimen(20),
    resizeMode:'stretch'
  },
  cardView: {
    height: heightDimen(210),
    // width: width,
    paddingHorizontal:areaDimen(21),
    borderRadius: areaDimen(24),
    overflow: 'hidden',
    marginTop: areaDimen(24),
  },
});
