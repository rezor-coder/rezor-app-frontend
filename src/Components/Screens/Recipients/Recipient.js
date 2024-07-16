import React, { memo } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { heightDimen } from '../../../Utils/themeUtils';
import { BorderLine, SimpleHeader, Wrap } from '../../common';
import styles from './RecipientStyle';

const Recipient = (props) => {
  // console.log("this.props.csvData", props.csvData?.length);
  const keyExtractor = item => item.index?.toString();
  const RenderItem =
  memo(({ item ,index}) => {
    return (
      <View style={[styles.recipient_list, {
        borderBottomColor: ThemeManager.colors.viewBorderColor,
      }]}>
        <Text style={[styles.addressLabelTextStyle, { color: ThemeManager.colors.textColor }]}>Address</Text>
        <Text style={[styles.addressTextStyle, { color: ThemeManager.colors.lightTextColor }]}>{item.address}</Text>
        <Text style={[styles.addressLabelTextStyle, { color: ThemeManager.colors.textColor, marginTop: heightDimen(10) }]}>
          Total Amount
        </Text>
        <Text style={[styles.amountTextStyle, { color: ThemeManager.colors.textColor }]}>{item.amount}</Text>
      </View>
    )
  })
  return (
    <>
      <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
        <SimpleHeader
          title={LanguageManager.listOfRecipients}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle
          imageShow
          back={false}
          backPressed={() => {
            // props.navigation.state.params.onGoBack();
            props.navigation.goBack();
          }}
        />

        <BorderLine
          borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
        />
        <View style={styles.searchBarStyle}>
          <FlatList
            data={props.route?.params?.csvData}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={5}
            updateCellsBatchingPeriod={5}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={() => <BorderLine />}
            removeClippedSubviews={true}
            renderItem={({item,index})=><RenderItem item={item} index={index}/>}
            getItemLayout={(data, index) => (
              {length: heightDimen(150), offset: heightDimen(150) * index, index}
            )}
          />
        </View>
      </Wrap>
      <SafeAreaView style={{ backgroundColor: ThemeManager.colors.backgroundColor }} />
    </>
  );
}
export default Recipient;
