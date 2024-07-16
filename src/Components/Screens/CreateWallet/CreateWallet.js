import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import images from '../../../theme/Images';
import { SubHeader } from '../../common';
import { DotPagination } from '../../common/DotPagination';
import { Wrap } from '../../common/Wrap';
import { styles } from './CreateWalletStyle';
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
                  getCurrentRouteName() != 'ImportWallet' &&
                  navigate(NavigationStrings.ImportWallet)
                }>
                <Image source={images.Add} style={styles.Img} />
              </TouchableOpacity>
              <Text style={styles.imgText}>{LanguageManager.ImportWallet}</Text>
            </View>

            <View>
              <TouchableOpacity
                onPress={() =>
                  getCurrentRouteName() != 'CreateNewWallet' &&
                  navigate(NavigationStrings.CreateNewWallet)
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
                onPress={() => goBack()}
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
