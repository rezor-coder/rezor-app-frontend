import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { BorderLine, Header, SimpleHeader, Wrap } from '../../common';
import styles from './RecipientStyle';
import { Fonts, Images, Colors } from '../../../theme';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { heightDimen } from '../../../Utils/themeUtils';

class Recipient extends Component {
  render() {
    console.log("this.props.csvData",this.props.csvData);
    return (
      <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <SimpleHeader
            title={LanguageManager.listOfRecipients}
            // rightImage={[styles.rightImgStyle]}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            back={false}
            backPressed={() => {
              // props.navigation.state.params.onGoBack();
              this.props.navigation.goBack();
            }}
          />

          <BorderLine
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
          />
          <View style={styles.searchBarStyle}>
            <FlatList
              data={this.props.csvData}
              keyExtractor={item => item.address}
              ItemSeparatorComponent={()=><BorderLine/>}
              renderItem={({ item, index }) => (
                <View style={[styles.recipient_list, {
                  borderBottomColor: ThemeManager.colors.viewBorderColor,
                  // borderBottomWidth: this.props.csvData?.length - 1 > index ? 1 : 0,
                }]}>
                  <Text style={[styles.addressLabelTextStyle, { color: ThemeManager.colors.textColor }]}>Address </Text>
                  <Text style={[styles.addressTextStyle, { color: ThemeManager.colors.lightTextColor }]}>{item.address}</Text>
                  <Text style={[styles.addressLabelTextStyle, { color: ThemeManager.colors.textColor, marginTop: heightDimen(10) }]}>
                    Total Amount
                  </Text>
                  <Text style={[styles.amountTextStyle, { color: ThemeManager.colors.textColor }]}>{item.amount}</Text>
                </View>
              )}
            />
          </View>
        </Wrap>
        <SafeAreaView style={{ backgroundColor: ThemeManager.colors.backgroundColor }} />
      </>
    );
  }
}

export default Recipient;
