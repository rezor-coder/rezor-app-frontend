import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Modal, Text, View } from 'react-native';
import images from '../../../theme/Images';
import { BasicButton, BorderLine, ImageBackgroundComponent, MainStatusBar, SimpleHeader, Wrap } from '../../common';
import { styles } from './SaitaCardPayOptionStyle';

import LottieView from 'lottie-react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import { Fonts } from '../../../theme';
import { SettingBar } from '../../common/SettingBar';

const windowHeight = Dimensions.get('window').height;

const SaitaCardPayOption = props => {
    const [onPressActive, setPressActive] = useState(false);
    const [applyModal, setApplyModal] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);
    const [kycmodaldone, setKycDoneModal] = useState(false);
    const [kycmodal, setKycModal] = useState(false);


    useEffect(() => {
        //console.warn('MM',">>>>>statesprops", props.email);
    }, []);


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
                title={'Cards'}
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

            <View style={[styles.card, { paddingVertical: 10 }]}>
                <SettingBar
                    disabled={onPressActive}
                    // iconImage={images.wallet_inactive}
                    iconImage={ThemeManager.ImageIcons.manageWallet}
                    title={LanguageManager.PayusingSaitaPro}
                    titleStyle={{ color: ThemeManager.colors.textColor, fontFamily: Fonts.light, fontSize: 13, }}
                    onPress={() => { setApplyModal(true) }}
                    style={{ borderBottomWidth: 0 }}
                    imgStyle={[styles.img]}
                    arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
                />
            </View>

            <View style={[styles.card, { paddingVertical: 10 }]}>
                <SettingBar
                    disabled={onPressActive}
                    iconImage={ThemeManager.ImageIcons.currencyPreferences}
                    title={LanguageManager.Payusinggateway}
                    titleStyle={{ color: ThemeManager.colors.textColor, fontFamily: Fonts.light, fontSize: 13, }}
                    onPress={() => { setApplyModal(true) }}
                    style={{ borderBottomWidth: 0 }}
                    imgStyle={[styles.img]}
                    arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
                />
            </View>

            {/* *********************************************************** MODAL FOR Apply ********************************************************************** */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={applyModal}
                onRequestClose={() => setApplyModal(false)}>
                <Wrap
                    style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>

                    <ImageBackgroundComponent style={{ height: windowHeight }}>

                        <SimpleHeader
                            back={false}
                            backPressed={() => setApplyModal(false)}
                        />
                        <View style={{ height: "56%", width: "90%", alignItems: 'center', alignSelf: "center", justifyContent: 'center', }}>
                            <ImageBackground resizeMode='contain' style={styles.imgcards} source={images.cardblackform} >
                                <View style={{
                                    backgroundColor: 'rgba(57, 57, 57, 0.7)', borderRadius: 17, height: "30%", width: "60%"
                                    , justifyContent: 'center', padding: 10
                                }}>
                                    <Text style={styles.txtone}>Application Fee:</Text>
                                    <Text style={styles.txttwo}>USD 249</Text>
                                    <Text style={styles.txtthree}>Only USD 199*</Text>
                                </View>
                            </ImageBackground>
                        </View>

                        <View style={{ height: "24%", }}>
                            <Text style={[styles.txtWelcome, { color: ThemeManager.colors.textColor, marginTop: 15 }]}>Thank you for applying for{'\n'}SaitaCard Black</Text>
                            <Text style={[styles.txtkyc]}>Now you need to complete your{'\n'}identification process (KYC) to start{'\n'}using SaitaCard</Text>
                        </View>

                        <View style={{ alignItems: 'center', height: "10%", }}>
                            <BasicButton
                                onPress={() => {
                                    setApplyModal(false)
                                    //  setReviewModal(true)
                                    getCurrentRouteName() != "KycShufti" && navigate(NavigationStrings.KycShufti,{ "email": props.route?.params?.email })
                                }}
                                btnStyle={styles.btnStyle}
                                customGradient={styles.customGrad}
                                text={"Start KYC Process"}
                                textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
                            />
                        </View>


                    </ImageBackgroundComponent>

                </Wrap>
            </Modal>

            {/* *********************************************************** MODAL FOR review ********************************************************************** */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={reviewModal}
                onRequestClose={() => setReviewModal(false)}>


                <Wrap
                    style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>

                    <ImageBackgroundComponent style={{ height: windowHeight }}>


                        <SimpleHeader
                            title="Review"
                            titleStyle={{ marginRight: 30 }}
                            back={false}
                            backPressed={() => setReviewModal(false)}

                        />
                        <View style={{ height: "45%", alignItems: 'center', justifyContent: 'center', }}>
                            <LottieView
                                source={images.Loadclock}
                                style={{ width: '100%', height: "100%", }}
                                autoPlay
                                loop
                            />

                        </View>

                        <View style={{ height: "35%", alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={[styles.txtWelcome, { color: ThemeManager.colors.textColor, }]}>Thank you!{'\n'}Your SaitaCard Black{'\n'}application is in review</Text>
                            <Text style={[styles.txtkyc]}>We will get back to you as quickly as{'\n'}possible. It usually takes 2 - 4 working{'\n'}days. You can check the status of your{'\n'}application at any time by coming{'\n'}back to this page</Text>

                        </View>


                        <View style={{ alignItems: 'center', height: "10%", }}>
                            <BasicButton
                                onPress={() => {
                                    setReviewModal(false)
                                    setKycDoneModal(true)
                                }}
                                btnStyle={styles.btnStyle}
                                customGradient={styles.customGrad}
                                text={"Continue"}
                                textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
                            />
                        </View>


                    </ImageBackgroundComponent>

                </Wrap>
            </Modal>

            {/* *********************************************************** MODAL FOR kyc success ********************************************************************** */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={kycmodaldone}
                onRequestClose={() => setKycDoneModal(false)}>
                <Wrap
                    style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>

                    <ImageBackgroundComponent style={{ height: windowHeight }}>


                        <View style={{ height: "55%", alignItems: 'center', justifyContent: 'center', marginTop: 10, }}>
                            <LottieView
                                source={images.DoneKyc}
                                style={{ width: '100%', height: "100%", }}
                                autoPlay
                                loop
                            />

                        </View >

                        <View style={{ height: "24%", }}>
                            <Text style={[styles.txtWelcome, { color: ThemeManager.colors.textColor, marginTop: 20 }]}>Congratulations</Text>
                            <Text style={[styles.txtkyc]}>Your KYC has been approved you are{'\n'}all set! Now top up your SaitaCard to{'\n'} start changing the way you pay.</Text>
                        </View>



                        <View style={{ height: "12%", alignItems: 'center', justifyContent: 'center', }}>
                            <BasicButton
                                onPress={() => {
                                    setKycDoneModal(false)
                                    setKycModal(true)
                                }}
                                btnStyle={styles.btnStyle}
                                customGradient={styles.customGrad}
                                text={"Deposit Your First Crypto"}
                                textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
                            />
                        </View>


                    </ImageBackgroundComponent>

                </Wrap>
            </Modal>

            {/* *********************************************************** MODAL FOR error ********************************************************************** */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={kycmodal}
                onRequestClose={() => setKycModal(false)}>
                <Wrap
                    style={{ backgroundColor: ThemeManager.colors.backgroundColor }}>

                    <ImageBackgroundComponent style={{ height: windowHeight }}>

                        <SimpleHeader
                            title="Retry KYC"
                            titleStyle={{ marginRight: 30 }}
                            back={false}
                            backPressed={() => setKycModal(false)}

                        />
                        <View style={{ height: "35%", alignItems: 'center', justifyContent: 'center', }}>
                            <LottieView
                                source={images.Kycerror}
                                style={{ width: '40%', }}
                                autoPlay
                                loop
                            />

                        </View>
                        <View style={{ height: "30%", }}>
                            <Text style={[styles.txtWelcome, { color: ThemeManager.colors.textColor, marginTop: 20 }]}>Oops…{'\n'}Your Identification Was{'\n'}Declined</Text>
                            <Text style={[styles.txtkyc]}>The information you submitted did not{'\n'}pass KYC identification. Please retry{'\n'}Identification or contact support.</Text>
                        </View>


                        <View style={[styles.card,]}>
                            <SettingBar
                                disabled={onPressActive}
                                // iconImage={images.wallet_inactive}
                                iconImage={ThemeManager.ImageIcons.manageWallet}
                                title={LanguageManager.retryKyc}
                                titleStyle={{ color: ThemeManager.colors.textColor, fontFamily: Fonts.light, fontSize: 13, }}
                                onPress={() => { setKycModal(false) }}
                                style={{ borderBottomWidth: 0 }}
                                imgStyle={[styles.img]}
                                showArw={false}
                                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
                            />
                        </View>

                        <View style={[styles.card,]}>
                            <SettingBar
                                disabled={onPressActive}
                                iconImage={ThemeManager.ImageIcons.currencyPreferences}
                                title={LanguageManager.contactepay}
                                titleStyle={{ color: ThemeManager.colors.textColor, fontFamily: Fonts.light, fontSize: 13, }}
                                onPress={() => { setKycModal(false) }}
                                style={{ borderBottomWidth: 0 }}
                                imgStyle={[styles.img]}
                                isseconText={true}
                                showArw={false}
                                seconText={"Support@epay.me"}
                                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
                            />
                        </View>



                    </ImageBackgroundComponent>

                </Wrap>
            </Modal>
        </Wrap>
    )

};
export default SaitaCardPayOption;
