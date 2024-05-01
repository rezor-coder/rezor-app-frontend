/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../../theme/Colors';
import images from '../../theme/Images';
import {ThemeManager} from '../../../ThemeManager';
import {useEffect} from 'react';
import {areaDimen, heightDimen, widthDimen} from '../../Utils/themeUtils';
import fonts from '../../theme/Fonts';

const MainHeader = props => {
  const [crossIcon, setcrossIcon] = useState(false);
  const [searchText, setsearchText] = useState('');

  useEffect(() => {
    if (searchText.length > 0) {
      setcrossIcon(false);
    }
  }, []);

  const onTextChange = param => {
    //console.warn('MM','MyAlertParam', param);
    props.onChangedText(param);
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 2,
        },
        props.containerStyle,
      ]}>
      <View
        style={[
          {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: ThemeManager.colors.bg,
          },
          props.containerStyle,
        ]}>
        {!props.leftComponent ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={images.splashLogo}
              style={{
                height: heightDimen(32.3),
                width: widthDimen(25.5),
                resizeMode: 'contain',
                marginLeft: 20,
              }}
            />
            <Text
              style={{
                color: ThemeManager.colors.textColor,
                fontFamily: fonts.semibold,
                marginLeft: areaDimen(10.5),
                fontSize: areaDimen(18),
              }}>
              SaitaPro
            </Text>
          </View>
        ) : (
          <>{props.leftComponent()}</>
        )}
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <>
            {props.firstImg != '' && (
              <TouchableOpacity style={{ padding:widthDimen(6)}} onPress={props.onpress1}>
                <Image
                  source={props.firstImg}
                  style={[styles.img, props.styleImg1]}
                />
              </TouchableOpacity>
            )}
          </>
          <>
            {props.secondImg !== 'none' && (
              <TouchableOpacity
                style={{padding: widthDimen(5), marginLeft: widthDimen(6)}}
                onPress={props.onpress2}>
                <Image
                  source={props.secondImg}
                  style={[styles.img, props.styleImg2]}
                />
              </TouchableOpacity>
            )}
          </>
          <>
            {props.thridImg !== 'none' && (
              <TouchableOpacity
                style={{marginLeft: widthDimen(6), padding:widthDimen(5)}}
                onPress={props.onpress3}>
                <Image
                  source={props.thridImg}
                  style={[styles.img, {marginRight: 15},props.styleImg3]}
                />
              </TouchableOpacity>
            )}
          </>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: Colors.languageHeader,
    fontSize: areaDimen(36),
  },
  img: {
    height: areaDimen(24),
    width: areaDimen(24),
    resizeMode: 'contain',
    // marginLeft: 5,
    // marginRight: 20,
  },
});

export {MainHeader};
