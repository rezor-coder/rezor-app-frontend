import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {ThemeManager} from '../../../ThemeManager';
import {Colors, Fonts} from '../../theme';

const BrowserMenu = props => {
  return (
    <View style={styles.browserMenu}>
      <Text style={styles.menuTitle}>{props.title}</Text>
      <View style={styles.container}>
        {props.menuData.map(item => {
          return (
            <View style={styles.singleMenuItemStyle}>
              <Image style={styles.imageStyle} source={item.image}></Image>
              <View>
                <Text style={styles.headingTextStyle}>{item.heading}</Text>
                <Text style={styles.subHeadingTextStyle}>
                  {item.subHeading.length > 15
                    ? item.subHeading.substring(0, 12) + '...'
                    : item.subHeading}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.lightBg,
    padding: '5%',
    borderRadius: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  browserMenu: {
    marginTop: 22,
  },
  menuTitle: {
    color: Colors.languageItem,
    marginBottom: 10,
    fontSize: 18,
    fontFamily: Fonts.regular,
  },
  singleMenuItemStyle: {
    flexDirection: 'row',
    width: '45%',
    marginHorizontal: 7,
    marginVertical: 20,
  },
  imageStyle: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  headingTextStyle: {
    fontSize: 12,
    //    color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.regular,
  },
  subHeadingTextStyle: {
    color: Colors.languageItem,
    marginTop: 5,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
});

export {BrowserMenu};
