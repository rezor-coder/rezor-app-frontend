import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import styles from './WalletStyle';
import images from '../../../theme/Images';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import Singleton from '../../../Singleton';
import { ThemeManager } from '../../../../ThemeManager';
const WalletHomeCard = ({userDetails, cardInfo, onPressEye, showDetails}) => {
  const spaceSeparator = val => {
    return (
      val?.substring(0, 4) +
      ' ' +
      val?.substring(4, 8) +
      ' ' +
      val?.substring(8, 12) +
      ' ' +
      val?.substring(12, 16)
    );
  };
  return (
    <View style={[styles.cardContainer]}>
      <Text style={[styles.totalBal,{color:ThemeManager.colors.textColor}]}>Total Balance</Text>
      <Text style={[styles.balText,{color:ThemeManager.colors.textColor}]}>
        {'$ '}
        {userDetails.cards[0]?.available_balance}
      </Text>
      <ImageBackground
        style={styles.imgcards}
        source={{
          uri: userDetails.cards[0]?.card_image,
        }}
        resizeMode={'stretch'}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#0005',
            padding: areaDimen(10),
            justifyContent: 'flex-end',
          }}>
          <View style={styles.activeCardName}>
            <Text style={styles.txtCardone}>{userDetails?.full_name}</Text>
            <Text style={styles.txtCardred}>( Active )</Text>
            <Text style={styles.txtstar}>
              {showDetails
                ? spaceSeparator(cardInfo?.cardNumber)
                : spaceSeparator(userDetails.cards[0]?.card_number)}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column'}}>
                <Text style={[styles.txtcvv, {}]}>CVV</Text>
                <Text style={[styles.txtdate, {}]}>
                  {showDetails ? cardInfo?.cvv : 'XXX'}
                </Text>
              </View>

              <View style={{flexDirection: 'column', marginLeft: 30}}>
                <Text style={[styles.txtcvv, {}]}>Expiry Date</Text>

                <Text style={[styles.txtdate, {}]}>
                  {showDetails ? cardInfo?.expire : 'MM/YY'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={onPressEye}
          style={[styles.eyeStyle, {top: 12, right: 12}]}>
          <Image
            style={{
              height: widthDimen(18),
              width: widthDimen(18),
              margin: 5,
              tintColor: 'white',
            }}
            resizeMode="contain"
            source={showDetails ? images.open_eye : images.eye_card}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default WalletHomeCard;
