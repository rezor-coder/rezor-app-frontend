import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { Colors, Images } from '../../theme';

const TitleHeader = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          height: 40,
          width: 40,
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
        onPress={() => Actions.pop()}>
        <Image source={Images.backIconArrow} style={styles.backIconStyle} />
      </TouchableOpacity>
      <Text style={styles.title}>{props.title}</Text>
      <Image
        onPress={() => {
  console.warn('MM','Drawer Pressed')
        }
      }
      
      
        source={props.image}
        style={styles.hamburgerStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: '8%',
    alignItems: 'center',
  },
  backIconStyle: {
    tintColor: Colors.pink,
    width: 20,
    height: 20,
  },
  hamburgerStyle: {
    width: 20,
    height: 20,
  },
  title: {
    color: Colors.lightGrey,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { TitleHeader };
