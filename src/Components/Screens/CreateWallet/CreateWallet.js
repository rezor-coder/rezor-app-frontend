import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Wrap} from '../../common/Wrap';
import {SubHeader} from '../../common';
import {Actions} from 'react-native-router-flux';
import colors from '../../../theme/Colors';
import images from '../../../theme/Images';
import {Multibtn} from '../../common/Multibtn';
import {DotPagination} from '../../common/DotPagination';
import {styles} from './CreateWalletStyle';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
const CreateWallet = () => {
  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
      <ScrollView>
        <View style={styles.mainView}>
          <SubHeader
            title={LanguageManager.title1}
            Subtitle={LanguageManager.Wallet}
            headerstyle={{marginTop: 40}}
          />

          <View style={styles.imgView}>
            <View>
              <TouchableOpacity
                onPress={() =>
                  Actions.currentScene != 'ImportWallet' &&
                  Actions.ImportWallet()
                }>
                <Image source={images.Add} style={styles.Img} />
              </TouchableOpacity>
              <Text style={styles.imgText}>{LanguageManager.ImportWallet}</Text>
            </View>

            <View>
              <TouchableOpacity
                onPress={() =>
                  Actions.currentScene != 'CreateNewWallet' &&
                  Actions.CreateNewWallet()
                }>
                <Image source={images.Add} style={styles.Img} />
              </TouchableOpacity>
              <Text style={styles.imgText}>{LanguageManager.CreateWallet}</Text>
            </View>
          </View>

          <View style={{paddingTop: 45}}>
            <Text style={styles.imgText}>{LanguageManager.needHelp}</Text>
          </View>

          <View style={styles.textView}>
            <Text style={styles.text}>{LanguageManager.walletText}</Text>
            <View style={{marginTop: 50}}>
              <TouchableOpacity
                onPress={() => Actions.pop()}
                style={styles.back}>
                <Text style={styles.heading}>{LanguageManager.Back}</Text>
              </TouchableOpacity>
              <DotPagination activeDotNumber={1} />
            </View>
          </View>
        </View>
      </ScrollView>
    </Wrap>
  );
};
export default CreateWallet;
