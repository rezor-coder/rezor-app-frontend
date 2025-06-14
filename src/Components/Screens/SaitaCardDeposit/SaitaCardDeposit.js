import React from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { BorderLine, MainStatusBar, SimpleHeader, Wrap } from '../../common';
import { styles } from './SaitaCardDepositStyle';

import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import { Colors, Fonts, Images } from '../../../theme';
import { goBack } from '../../../navigationsService';

const windowHeight = Dimensions.get('window').height;

let tokenList = [
    {
        id: 1,
        coin_name: 'Ethereum',
        coin_symbol: 'ETH',
        coin_image: Images.eth_s,
    },
    {
        id: 2,
        coin_name: 'Saitama',
        coin_symbol: 'Saitama',
        coin_image: Images.rezor_stake,
    },

];

const _renderItem = (item, index) => {
    //console.warn('MM',"????>>>item", item);
    return (
        <TouchableOpacity

            style={styles.coinsListStyle}>
            <View style={{ flexDirection: 'row', width: '44%' }}>
                {item.item.coin_image ? (
                    <Image
                        source={item.item.coin_image}
                        style={styles.coinStyle}
                    />
                ) : (
                    <View style={styles.coinNameStyle}>
                        <Text style={{ color: 'white' }}>
                            {item.item.coin_name.charAt(0)}
                        </Text>
                    </View>
                )}
                <View style={{ marginLeft: 10 }}>
                    <Text
                        style={{
                            color: ThemeManager.colors.textColor,
                            fontFamily: Fonts.semibold,
                            fontSize: 13,
                        }}>
                        {item.item.coin_symbol.toString().length > 13
                            ? item.item.coin_symbol.substring(0, 13) + '...'
                            : item.item.coin_symbol}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.fiatText}>
                            {item.item.coin_name}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.graphStyle}>

            </View>
            <View style={styles.balanceViewStyle}>
                <Text
                    style={[
                        styles.balanceText,
                        { color: ThemeManager.colors.textColor },
                    ]}>
                    0 {item.item.coin_symbol.toUpperCase()}
                </Text>
                <Text
                    style={[styles.coinPriceStyle, { color: Colors.lightGrey2 }]}>
                    {Singleton.getInstance().CurrencySymbol}  0.00
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const SaitaCardDeposit = () => {

    return (
        <Wrap style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>

            <MainStatusBar
                backgroundColor={ThemeManager.colors.backgroundColor}
                barStyle={
                    ThemeManager.colors.themeColor === 'light'
                        ? 'dark-content'
                        : 'light-content'
                }
            />
            <SimpleHeader
                title={LanguageManager.deposit}
                backImage={ThemeManager.ImageIcons.iconBack}
                titleStyle={{ marginRight: 30 }}
                imageShow
                back={false}
                backPressed={() => {
                    goBack()
                }}

            />
            <BorderLine
                borderColor={{ backgroundColor: ThemeManager.colors.chooseBorder }}
            />

            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.coinListWrapStyle}
                data={tokenList}
                renderItem={(item) => (

                    _renderItem(item)
                )}

            />

        </Wrap>
    )

};
export default SaitaCardDeposit;
