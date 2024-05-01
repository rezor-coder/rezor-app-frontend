import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Colors from '../../theme/Colors';
import FastImage from 'react-native-fast-image';
import {Fonts, Images} from '../../theme';
import { areaDimen, heightDimen } from '../../Utils/themeUtils';
import { ThemeManager } from '../../../ThemeManager';
const IconText = props => {
  return (
    <>
      {props.eImg ? (
        <TouchableOpacity
          style={[
            {
              // paddingHorizontal: 10,
              width: "23%",
              height: 80,
              justifyContent: 'center',
              borderRadius: 8,
            },
            props.styleIconText,
          ]}
          onPress={props.onPress}>
          <FastImage
            style={{height: areaDimen(25), width: areaDimen(25), alignSelf: 'center'}}
            resizeMode="contain"
            source={props.imageIcon}
          />
          <FastImage
            style={{height: 15, width: 56, alignSelf: 'center', marginTop: 4}}
            resizeMode="contain"
            source={Images.epayWhiteVectorLight}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            {
              // paddingHorizontal: 10,
              width: "21%",
              // height: heightDimen(95),
              // width: "23%",
              height: heightDimen(80),
              justifyContent: 'center',
              borderRadius: 8,
              shadowColor:ThemeManager.colors.shadowColor,
              shadowOffset: {
                width: 0.2,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.05,
              elevation: 4,
            },
            props.styleIconText,
          ]}
          onPress={props.onPress}>
          <FastImage
            style={{height: areaDimen(25), width: areaDimen(25), alignSelf: 'center'}}
            resizeMode="contain"
            source={props.imageIcon}
            tintColor={props.tintColor}
          />
          <Text
            style={{
              fontSize: areaDimen(14),
              marginTop: heightDimen(13),
              textAlign: 'center',
              letterSpacing: areaDimen(-0.24),
              lineHeight:areaDimen(15),
              color:ThemeManager.colors.headingText,
              fontFamily: Fonts.medium,
            }}>
            {props.title}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: Colors.languageHeader,
    fontSize: 36,
  },
});

export {IconText};
