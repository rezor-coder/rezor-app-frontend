/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import { Colors, Images } from '../../../theme/index';
import { AddressBox } from '../../common/AddressBox';
import { AdvanceOptions } from '../../common/AdvanceOptions';
import { BasicModal } from '../../common/BasicModal';
import { ButtonPrimary } from '../../common/ButtonPrimary';
import { ButtonTransaction } from '../../common/ButtonTransaction';
import { Wrap } from '../../common/index';
import styles from './confirmTransactionStyle';

const confirmTransaction = () => {
  const [selected, setselected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [VisibleOptions, setVisibleOptions] = useState(false);

  return (
    <Wrap style={{backgroundColor: ThemeManager.colors.backgroundColor}}>
      <View
        style={[
          styles.roundView,
          {opacity: VisibleOptions || modalVisible ? 0.05 : 1},
        ]}>
        {/* <SimpleHeader 
          backPressed={()=>alert('ou8979')}
          title="Confirm Transaction" /> */}
        <View style={{}}>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: '99%',
              marginLeft: 22,
            }}>
            <AddressBox
              img={Images.solana}
              address="22ub7465538FG763e725 873gfD87g3652"
              title="From:"
            />
            <Image source={Images.roundArw} style={styles.roundImg} />
            <AddressBox
              address="22ub7465538FG763e725 873gfD87g3652"
              title="To:"
            />
          </View>
          <View style={{marginTop: 20, paddingHorizontal: 15}}>
            <View style={styles.advncOptionView}>
              <Text style={[styles.textStyle, {color: Colors.white}]}>
                {LanguageManager.transactionFees}
              </Text>
              <TouchableOpacity onPress={() => setVisibleOptions(true)}>
                <Text style={styles.textStyle}>
                  {LanguageManager.advancedOptions}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnView}>
              <ButtonTransaction
                style={styles.btnSlow}
                onPress={() => Singleton.showAlert(LanguageManager.slow)}
                label="Slow"
                transactionfee="0.00"
                isSelected={selected == 'Slow' ? true : null}
              />
              <ButtonTransaction
                style={styles.btnAvrage}
                onPress={() => Singleton.showAlert(LanguageManager.average)}
                label="Average "
                transactionfee="0.00"
                isSelected={selected == 'Average' ? true : null}
              />
              <ButtonTransaction
                style={styles.fastBtn}
                onPress={() => Singleton.showAlert(LanguageManager.fast)}
                label="Fast"
                transactionfee="0.00"
                isSelected={selected == 'Fast' ? true : null}
              />
            </View>
          </View>

          <View style={styles.amountView}>
            <Text style={[styles.textStyle, {color: Colors.white}]}>
              {LanguageManager.totalAmount}
            </Text>
            <Text style={styles.amount}>0</Text>
          </View>
          <View style={{marginTop: 20, paddingHorizontal: 15}}>
            <ButtonPrimary
              onpress={() => setModalVisible(true)}
              btnstyle={{height: 50, width: '99%'}}
              text="Send 980.890 STR"
            />
          </View>
        </View>
      </View>
      {modalVisible && <BasicModal></BasicModal>}
      {VisibleOptions && <AdvanceOptions setVisible={setVisibleOptions} />}
    </Wrap>
  );
};

export default confirmTransaction;
