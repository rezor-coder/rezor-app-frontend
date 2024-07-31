import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import { ThemeManager } from '../../../ThemeManager';
import fonts from '../../theme/Fonts';
import { KeyboardDigit } from './KeyboardDigit';
import { SimpleHeader } from './SimpleHeader';
import WrapperContainer from './WrapperContainer';
import { PinInput } from './PinInput';
import { Loader } from '../Screens';

const OtpModal = ({ showOtpModal, setShowOtpModal, onContinueOTP,isLoading }) => {
  const [Pin, setPin] = useState('');

  const updatePin = async (item) => {
    console.log(Pin.length,'itemitemitem');
    if (item == ' ' || Pin.length == 4) {
      return;
    }
    if (Pin.length != 4) {
      setPin(prev => prev + item);

      if (Pin.length == 3) {
        console.log('PINNNNN===', Pin + item);
        let pin = Pin + item;
        await onContinueOTP(pin);
        setTimeout(()=>{
            setPin('')
        },1000)
      }
    }
  };

  const deletePin = () => {
    if (Pin.length == 0) {
      return;
    }
    setPin(prev => prev.slice(0, prev.length - 1));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showOtpModal}
      onRequestClose={() => {
        setShowOtpModal(false) 
        setPin('')
        }}>
      <WrapperContainer style={styles.wrapperContainer}>
        <SimpleHeader
          back={false}
          backPressed={() => {
            setShowOtpModal(false) 
            setPin('')
            }}
          title={''}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>Confirm OTP</Text>
          <View>
            <View style={styles.pinContainer}>
              {[0, 1, 2, 3].map((item, index) => (
                <PinInput
                  key={item}
                  isActive={Pin.length == 0 ? index == 0 : Pin.length == index + 1}
                  digit={Pin.length > index ? '*' : ''}
                />
              ))}
            </View>
          </View>
        </View>
        <View style={styles.keyboardContainer}>
          <KeyboardDigit
            updatePin={updatePin}
            deletePin={deletePin}
          />
        </View>
        {isLoading && <Loader />}
      </WrapperContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: ThemeManager.colors.bg,
  },
  contentContainer: {
    paddingHorizontal: widthDimen(22),
  },
  headerText: {
    fontFamily: fonts.semibold,
    alignSelf: 'flex-start',
    fontSize: areaDimen(30),
    lineHeight: areaDimen(37),
    marginTop: heightDimen(30),
    color: ThemeManager.colors.headingText,
  },
  subHeaderText: {
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    textAlign: 'left',
    lineHeight: heightDimen(28),
    color: ThemeManager.colors.inActiveColor,
  },
  pinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightDimen(30),
    flexDirection: 'row',
  },
  keyboardContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    marginTop: heightDimen(102),
  },
});

export default OtpModal;
