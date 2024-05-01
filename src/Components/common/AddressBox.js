import React from 'react';
import { StyleSheet, TextInput, View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemeManager } from '../../../ThemeManager';
import { Images } from '../../theme';
import Colors from '../../theme/Colors';
import fonts from '../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const AddressBox = props => {
  return (
    <View style={[{ paddingTop: heightDimen(10) }, props.fromtxtStyle]}>
      <View>
        <Text
          style={{
            // color: Colors.white,
            color: ThemeManager.colors.textColor,
            marginVertical: heightDimen(10),
            fontSize: areaDimen(14),
            fontFamily: fonts.medium,
          }}>
          {props.title}
        </Text>
      </View>
      <View
        style={[{
          height: heightDimen(98),
          width: '100%',
          borderRadius: widthDimen(12),
          backgroundColor: ThemeManager.colors.mnemonicsView,
        }, props.boxStyle]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              //   color: Colors.white,
              color: ThemeManager.colors.textColor,
              paddingHorizontal: widthDimen(20),
              paddingTop: heightDimen(15),
              paddingBottom: heightDimen(10),
              fontSize: areaDimen(14),
              fontFamily: fonts.medium,
            }}>
            {props.walletName}
          </Text>
          <Image
            source={props.img}
            style={{
              height: widthDimen(25),
              width: widthDimen(25),
              borderRadius: widthDimen(15),
              resizeMode: 'contain',
              marginRight: widthDimen(20),
            }}
          />
        </View>
        <Text
          // numberOfLines={2}
          style={{
            color: ThemeManager.colors.lightTextColor,
            paddingHorizontal: widthDimen(20),
            fontSize: areaDimen(14),
            fontFamily: fonts.medium
          }}>
          {props.address}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: Colors.languageItem,
    borderWidth: 2,
    height: 50,
    marginTop: 30,
    fontSize: 16,
    paddingLeft: 20,
    borderRadius: 4,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
  },
});

export { AddressBox };
