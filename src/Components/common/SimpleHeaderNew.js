/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import fonts from '../../theme/Fonts';

const SimpleHeaderNew = props => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: areaDimen(20),
          paddingVertical: heightDimen(4),
        },
        props.containerStyle,
      ]}>
      {props.backImage ? (
        <TouchableOpacity
          style={{
            height: widthDimen(40),
            width: widthDimen(40),
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
          onPress={props.backPressed}>
          <Image
            source={ThemeManager.ImageIcons.iconBack}
            style={[
              {
                height: widthDimen(35),
                width: widthDimen(35),
                resizeMode: 'contain',
              },
              props.backImage,
            ]}
          />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            height: widthDimen(40),
            width: widthDimen(40),
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}></View>
      )}

      <Text style={[styles.heading, {color: ThemeManager.colors.headingText}]}>
        {props.title}
      </Text>

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {props.img2 && (
          <TouchableOpacity
            onPress={props.onPress2}
            style={{
              height: widthDimen(30),
              width: widthDimen(30),
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: widthDimen(2),
            }}>
            <Image source={props.img2} style={[styles.imgStyle, props.img2style]} />
          </TouchableOpacity>
        )}

        {props.img3 ? (
          <TouchableOpacity
            style={{
              height: widthDimen(30),
              width: widthDimen(30),
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: widthDimen(4),
            }}
            onPress={props.onPress3}>
            <Image source={props.img3} style={[styles.imgStyle, props.img3style]} />
          </TouchableOpacity>
        ) : props.img2 ? null : (
          <View
            style={{
              height: widthDimen(30),
              width: widthDimen(30),
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: areaDimen(18),
    fontFamily: fonts.semibold,
  },
  imgStyle: {
    height: widthDimen(20),
    width: widthDimen(20),
    resizeMode: 'contain',
  },
});

export { SimpleHeaderNew };
