import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import { styles } from './styles';

import { useDispatch } from 'react-redux';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import { goBack } from '../../../navigationsService';
import { cardTransactions } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { Images } from '../../../theme';
import { areaDimen, heightDimen } from '../../../Utils/themeUtils';
import { BorderLine, SimpleHeader } from '../../common';
import ShimmerLoader from '../../common/ShimmerLoader';
import TransactionCard from '../../common/TransactionCard';
import WrapperContainer from '../../common/WrapperContainer';

const VaultTransactionHistory = props => {
  const {userCards} = props?.route?.params;
  const dispatch = useDispatch();
  const [dransactionsData, setTransactionsData] = useState([]);
  const [transactionsLoader, setTransactionsLoader] = useState(true);
  const [limit, setlimit] = useState(50);
  const [offset, setOffset] = useState(0);
  console.log(userCards, 'userCardsuserCardsuserCards');
  useEffect(() => {
    initialCall();
  }, []);
  const initialCall = () => {
    let data = {
      cardId: userCards?.id,
      cardProgram: userCards?.cardProgram,
      offset: offset,
      limit: limit,
    };
    dispatch(cardTransactions(data))
      .then(async res => {
        console.log('cardTransactions:::::::::', JSON.stringify(res));
        setTransactionsLoader(false);
        setTransactionsData(res.data);
      })
      .catch(err => {
        setTransactionsLoader(false);
        if (err == Constants.ACCESS_TOKEN_EXPIRED) {
          Singleton.showAlert(Constants.ACCESS_TOKEN_EXPIRED)
          return
        }
        Singleton.showAlert(err)
      });
  };

  const onLoadEnd = () => {
    // fetchData();
  };
  const renderTransactionsView = ({item}) => {
    return <TransactionCard item={item} />;
  };
  return (
    <WrapperContainer>
      <SimpleHeader
        title={LanguageManager.transactions}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back={false}
        backPressed={() => {
          goBack();
        }}
      />
      <BorderLine
        borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
      />
      <FlatList
        data={dransactionsData}
        renderItem={renderTransactionsView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: areaDimen(25),
          paddingBottom: heightDimen(30),
        }}
        ItemSeparatorComponent={() => <View style={{height: areaDimen(12)}} />}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.1}
        onEndReached={onLoadEnd}
        ListEmptyComponent={() => {
          return transactionsLoader ? (
            [...Array(10)].map(() => (
              <ShimmerLoader style={styles.transactionViewshimmer} />
            ))
          ) : (
            <View style={styles.emptyTransactionsView}>
              <FastImage
                source={Images.emptyTransactions}
                style={styles.emptyIconStyle}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.emptyTextStyle,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {LanguageManager.noDataFound}
              </Text>
            </View>
          );
        }}
      />
    </WrapperContainer>
  );
};

export default VaultTransactionHistory;
