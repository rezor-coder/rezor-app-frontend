import React from 'react';
import { Image, Text, View } from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import { ButtonPrimary, SimpleHeader, Wrap } from '../../common';
import styles from './style';

const RemoveLiquidity = props => {
  const { selectedToCoin, selectedFromCoin, pairBalance, secondTokenSupply, firstTokenSupply, poolSupply, resultPair, pairNonce,
    FilteredCoinOne, FilteredCoinTwo } = props?.route?.params;
  //console.warn('MM','=====', FilteredCoinOne,FilteredCoinTwo);

  const LiquidityValue = ({ title, value }) => {
    return (
      <View style={styles.row1}>
        <Text
          style={[styles.textReg12, { color: ThemeManager.colors.textColor }]}>
          {title}
        </Text>
        <Text
          style={[styles.textReg12, { color: ThemeManager.colors.textColor }]}>
          {value}
        </Text>
      </View>
    );
  };

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>
      <SimpleHeader
        title={LanguageManager.removeLiquidity}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle
        imageShow
        back
      />
      <View style={styles.wrap}>
        <Text style={[styles.textSm14, { color: ThemeManager.colors.textColor }]}>
          Your Liquidity
        </Text>
        <View style={styles.pinkRoundBox}>
          <View style={styles.row}>
            <View style={{ width: 60 }}>
              <View style={styles.toImageView}>
                <Image
                  style={styles.toImage}
                  source={{ uri: selectedToCoin?.coin_image }}
                />
              </View>
              <View style={styles.fromImageView}>
                <Image
                  style={styles.toImage}
                  source={{ uri: selectedFromCoin?.coin_image }}
                />
              </View>
            </View>
            <Text
              style={[
                styles.textReg14,
                { color: ThemeManager.colors.textColor, },
              ]}>
              {selectedToCoin.coin_symbol}/{selectedFromCoin.coin_symbol}
            </Text>
          </View>
          <LiquidityValue title={'Your total pool tokens'} value={Singleton.getInstance().toFixed((pairBalance / 10 ** 18), 8)} />
          <LiquidityValue
            title={`Pooled ${selectedToCoin?.coin_symbol.toUpperCase()}`}
            value={Singleton.getInstance().toFixed(firstTokenSupply, 8)}
          />
          <LiquidityValue
            title={`Pooled ${selectedFromCoin?.coin_symbol.toUpperCase()}`}
            value={Singleton.getInstance().toFixed(secondTokenSupply, 8)}
          />
          <LiquidityValue title={'Your Pool Share'} value={Singleton.getInstance().toFixed(poolSupply, 8) + ' %'} />
        </View>
        <Text style={styles.liquidityTxt}>
          Don't see pool you joined? {'\n \n'}Or, if you staked your LP tokens
          in farm, Un-stake them to see them here
        </Text>
        <ButtonPrimary
          onpress={() => {
            getCurrentRouteName() != 'RmLiquidityConfirm' &&
            navigate(NavigationStrings.RmLiquidityConfirm,{
                selectedToCoin, selectedFromCoin,
                pairBalance, firstTokenSupply, secondTokenSupply, poolSupply, resultPair, pairNonce, FilteredCoinOne, FilteredCoinTwo
              });
          }}
          btnstyle={styles.continueBtn}
          text={LanguageManager.remove}
        />
      </View>
    </Wrap>
  );
};

export { RemoveLiquidity };
