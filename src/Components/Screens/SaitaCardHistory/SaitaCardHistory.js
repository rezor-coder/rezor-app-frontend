import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler
} from 'react-native';
import {
  Wrap,
  Multibtn,
  BasicButton,
  MainStatusBar,
  ImageBackgroundComponent,
  SimpleHeaderNew,
  BorderLine,
} from '../../common';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import { styles } from './SaitaCardHistoryStyle';
import { Actions } from 'react-native-router-flux';
import { fetchCardHistory } from '../../../Redux/Actions/SaitaCardAction';
import { useDispatch } from 'react-redux';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import Loader from '../Loader/Loader';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { Fonts, Colors, Images } from '../../../theme';
import moment from 'moment';
import CardHistoryItem from '../../common/CardHistoryItem';

const windowHeight = Dimensions.get('window').height;

const SaitaCardHistory = props => {
  //console.warn('MM','SaitaCardHistory card_id', props.cardId);
  const dispatch = useDispatch();
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    let backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Actions.pop()
      return true
    })
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(access_token => {
        if (access_token) {
          //console.warn('MM',">>>access_token", access_token);
          setisLoading(true);
          getCardHistory(access_token, props.cardId);
        }
      });
      return ()=>{
        backHandler?.remove()
      }
  }, []);

  const _renderItemhistory = item => {
    return (
      <CardHistoryItem
        item={item}
        list={historyList}
        onPress={() =>
          Actions.currentScene != 'CardHistoryDetail' &&
          Actions.CardHistoryDetail({
            selectedItem: item,
            card_currency: props?.card_currency,
          })
        }
        currency={props?.card_currency}
      />
    );
  };
  const getDate = date => {
    //16 02 2020
    const data =
      date.substring(0, 2) +
      '-' +
      date.substring(2, 4) +
      '-' +
      date.substring(4, 8);
    return data;
  };

  const getCardHistory = (access_token, card_id) => {
    //console.warn('MM','getCardHistory', access_token, card_id);
    let data = {
      card_id: card_id,
      end_time: moment().format('MMYYYY'),
      start_time: moment().subtract(5, 'months').format('MMYYYY'),
    };
    //console.warn('MM','getCardHistory data', data);
    dispatch(fetchCardHistory({ data, access_token }))
      .then(res => {
        console.warn('MM', 'chk res getCardHistory::::::', res);
        setisLoading(false);
        setHistoryList(res);
      })
      .catch(err => {
        setisLoading(false);
        Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG);
        //   console.warn('MM','chk err getCardHistory::::::', err);
      });
  };

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <SimpleHeaderNew
        title={LanguageManager.history}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          Actions.pop();
        }}
        containerStyle={{ marginRight: 20 }}
      />
      <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.coinListWrapStyle}
        data={historyList}
        renderItem={item => _renderItemhistory(item)}
        ListEmptyComponent={
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              padding: 10,
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: ThemeManager.colors.textColor,
              }}>
              No Data Found
            </Text>
          </View>
        }
      />

      {isLoading && <Loader />}
    </Wrap>
  );
};
export default SaitaCardHistory;
