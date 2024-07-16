/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemeManager } from '../../../ThemeManager';
import Singleton from '../../Singleton';
import Colors from '../../theme/Colors';

const ModalHeader = props => {
  return (
    <>
       


        <TouchableOpacity
          onPress={()=>{Singleton.showAlert("ddddd")}}
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'flex-start',

          }}>
          <Image
            source={ThemeManager.ImageIcons.iconBack}
            style={[
              { height: 20, width: 20, resizeMode: 'contain', backgroundColor: 'green' },
              props.rightImage,
            ]}
          />
        </TouchableOpacity>

       
      
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: Colors.languageHeader,
    fontSize: 36,
  },
  img: { height: 20, width: 30, resizeMode: 'contain', marginLeft: 5 },
});

export { ModalHeader };
