import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Images } from './../../theme/index';

const MenuBar = props => {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity onPress={props.onPress1} style={props.itemStyle}>
        <Image source={Images.financeIcon} style={styles.imageStyle}></Image>
        <Text style={styles.text}>{props.titles[0]}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.onPress2} style={props.itemStyle}>
        <Image source={Images.exchangesIcon} style={styles.imageStyle}></Image>
        <Text style={styles.text}>{props.titles[1]}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.onPress3} style={props.itemStyle}>
        <Image source={Images.gamesIcon} style={styles.imageStyle}></Image>
        <Text style={styles.text}>{props.titles[2]}</Text>
      </TouchableOpacity>
        <TouchableOpacity onPress={props.onPressBuy} style={props.itemStyle}>
        <Image source={Images.Buy} style={styles.imageStyle}></Image>
        <Text style={styles.text}>{props.titles[3]}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.pressStaking} style={props.itemStyle}>
        <Image source={Images.staking} style={styles.imageStyle}></Image>
        <Text style={styles.text}>{props.titles[4]}</Text>
      </TouchableOpacity>
      {props.staking == true ? (
        <TouchableOpacity onPress={props.onPressMulti} style={props.itemStyle}>
          <Image source={Images.bulk_icon} style={styles.imageStyle}></Image>
          <Text style={styles.text}>{props.titles[5]}</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    
   
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    marginTop: '10%',
    justifyContent: 'space-evenly',
   
  },
  imageStyle: {
    width: 30,
    height: 25,
    resizeMode: 'contain',
  },
  text: {
    color: Colors.languageItem,
    marginTop: 5,
    textAlign:"center"
  },
});

export { MenuBar };
