/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import Colors from '../../theme/Colors';
import fonts from '../../theme/Fonts';
import images from '../../theme/Images';
import { goBack } from '../../navigationsService';
const SimpleHeader = props => {
  return (
    <>
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
        <View style={{flex: 1}}>
          {props.imageShow == false ? (
            <Text />
          ) : props.back == false ? (
            <TouchableOpacity
              onPress={props.backPressed}
              style={{
                height: widthDimen(40),
                width: widthDimen(40),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={ThemeManager.ImageIcons.iconBack}
                style={[
                  {
                    height: widthDimen(35),
                    width: widthDimen(35),
                    resizeMode: 'contain',
                  },
                  props.rightImage,
                ]}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                height: widthDimen(40),
                width: widthDimen(40),
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
              onPress={() => {
                goBack();
              }}>
              <Image
                source={props.backImage}
                style={[
                  {
                    height: widthDimen(35),
                    width: widthDimen(35),
                    resizeMode: 'contain',
                  },
                  props.rightImage,
                ]}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text
          style={[
            {
              lineHeight: areaDimen(22),
              color: ThemeManager.colors.headingText,
              fontSize: areaDimen(18),
              fontFamily: fonts.semibold,
              alignSelf: 'center',
              textTransform: 'capitalize',
            },
            props.titleStyle,
          ]}>
          {props.title}
        </Text>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingVertical: heightDimen(5),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={props.onPressHistory}
            style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            {props?.history && (
              <Image
                source={
                  props?.customIcon
                    ? props?.customIcon
                    : props.history != true
                    ? ThemeManager.ImageIcons.setting
                    : ThemeManager.ImageIcons.setting
                }
                style={[
                  {
                    // tintColor: Colors.darkFade,
                    height:
                      props.history == true ? widthDimen(22) : widthDimen(26),
                    width:
                      props.history == true ? widthDimen(22) : widthDimen(26),
                    resizeMode: 'contain',
                  },
                  props.iconstyle,
                  {tintColor: ThemeManager.colors.iconColor},
                ]}
              />
            )}

            {props.plusIcon == true ? (
              <Image
                source={images.plusIconWhite}
                style={
                  ([
                    {
                      tintColor: Colors.darkFade,
                      height:
                        props.history == true ? widthDimen(22) : widthDimen(26),
                      width:
                        props.history == true ? widthDimen(22) : widthDimen(26),
                      resizeMode: 'contain',
                    },
                  ],
                  props.plusIconStyle)
                }
              />
            ) : (
              <View style={{width: widthDimen(0)}} />
            )}
            {props.rightIcon ? (
              <Image
                source={props.rightIcon}
                style={
                  ([
                    {
                      tintColor: Colors.darkFade,
                      height:
                        props.history == true ? widthDimen(22) : widthDimen(26),
                      width:
                        props.history == true ? widthDimen(22) : widthDimen(26),
                      resizeMode: 'contain',
                    },
                  ],
                  props.plusIconStyle)
                }
              />
            ) : props.rightText ? (
              <Text style={props.rightIconStyle}>{props.rightText}</Text>
            ) : (
              <View style={{width: widthDimen(0)}} />
            )}
          </TouchableOpacity>
          {props.secondRightImage ? (
            <TouchableOpacity
              onPress={props.onPresssecondRightImage}
              style={{
                padding: 5,
                marginLeft: widthDimen(10),
              }}>
              <Image
                source={props.secondRightImage}
                style={
                  ([
                    {
                      height: areaDimen(16),
                      width: areaDimen(16),
                      resizeMode: 'contain',
                    },
                  ],
                  props.plusIconStyle)
                }
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: Colors.languageHeader,
    fontSize: 36,
  },
  img: {height: 20, width: 30, resizeMode: 'contain', marginLeft: 5},
});

export { SimpleHeader };

