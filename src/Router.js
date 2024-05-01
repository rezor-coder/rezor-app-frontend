/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, Platform} from 'react-native';
import {Router, Scene, Stack, Tabs} from 'react-native-router-flux';
import {LanguageManager, ThemeManager} from '../ThemeManager';
import {CustomTabBar, TabIcon} from './Components/common';
import ConnectWithDapp2 from './Components/Screens/ConnectWithDapp/ConnectWithDapp2';
import {
  Login,
  Signup,
  SplashAppName,
  WalletSequrity,
  WalletSequrityConfirm,
  CreateOrImportWallet,
  FaceID,
  CreatePIN,
  CreateWallet,
  SelectLanguage,
  ImportWallet,
  CreateNewWallet,
  SecureWallet,
  Dashboard,
  VerifyPhrase,
  Wallet,
  Market,
  Hot,
  SwapScreen,
  StakingPools,
  confirmTransaction,
  SendETH,
  Send,
  QrCode,
  AddNewContacts,
  GetSupport,
  SendCryptoContacts,
  SaveContact,
  Setting,
  Gainer,
  Loser,
  HourChanges,
  Loader,
  SendBNB,
  ManageWallet,
  AddToken,
  CurrencyPreference,
  Notification,
  TransactionDetail,
  EditContact,
  History,
  ConfirmPin,
  CoinHistory,
  Security,
  ChangePassCode1,
  ResetConfirmPin,
  ScanQr,
  DappBrowser,
  SelectBlockchain,
  ResetCreatePIN,
  BackupOptions,
  RecoveryPhrase,
  ExportPrivateKeys,
  MultiSender,
  MultiSenderEth,
  MultiSenderBNB,
  Recipient,
  MultiWalletList,
  WalletOption,
  MultiSenderEthToken,
  Epay,
  Linkview,
  Liquidity,
  DappBrowserSwap,
  TermsandPrivacy,
  BuyHistory,
  DappBrowserSwapc,
  BuyTransactionDetail,
  MultiWalletOptions,
  MultiWalletImportSingleCoin,
  SwapTab,
  SwapLiquidity,
  Congrats,
  ChooseLanguage,
  SwapNew,
  SaitaProSupport,
  SwapSettings,
  EditWallet,
  ConfirmSecurityPin,
  LiquiditySelectToken,
  RemoveLiquidity,
  RmLiquidityConfirm,
  SaitaCardWelcome,
  SaitaCardsInfo,
  SaitaCardBlack,
  SaitaCardGold,
  SaitaCardDiamond,
  SaitaCardDeposit,
  SaitaCardHistory,
  SaitaCardApplyForm,
  SaitaCardPayOption,
  SaitaCardDepositQr,
  SaitaCardTransaction,
  KycShufti,
  CountryCodes,
  SaitaCardLogin,
  NfcDemo,
  CardHistoryDetail,
  SaitaCardForgot,
  CardSetting,
  SaitaCardNewPassword,
  SaitaCardChangePassword,
  SendBTC,
  SendMATIC,
  MultiSenderMatic,
  SendTRX,
  SaitaCardEpay,
  SaitaCardBinanceQr,
  SaitaVirtualForm,
  SaitaCardDepositBinance,
  Splash,
  DefiAccessmainIOS,
} from './Components/Screens/index';

import {Colors, Images} from './theme';
import Trade from './Components/Screens/Trade/Trade';
import SaitaCardHyperKycForm from './Components/Screens/SaitaCardHyperKyc/SaitaCardHyperKycForm';
import SaitaCardApplyPhysicalCard from './Components/Screens/SaitaCardApplyPhysicalCard/SaitaCardApplyPhysicalCard';
import WelcomeScreen from './Components/Screens/Welcome/WelcomeScreen';
import Stake from './Components/Screens/StakeScreen/Stake';
import CoinHome from './Components/Screens/CoinHome/CoinHome';
import { heightDimen } from './Utils/themeUtils';
import SendSTC from './Components/Screens/SendSTC/SendSTC';
import MultiSenderSTC from './Components/Screens/MultiSenderSTC/MultiSenderSTC';

const RouterComponent = ({onRouteChanged}) => {
  console.warn('JJJJJJJJ');
  return (
    <Router
      onStateChange={onRouteChanged}
      navigationBarStyle={{
        backgroundColor: ThemeManager.colors.bg,
        borderBottomWidth: 0,
      }}
      hideNavBar={false}
      leftButtonIconStyle={{width: 21, height: 18}}
      titleStyle={{color: '#fff'}}>
      <Stack key="root">
        <Scene
          key="Splash"
          hideNavBar={true}
          component={Splash}
          gestureEnable={false}
          panHandlers={null}
          initial
        />

        <Scene
          key="SplashAppName"
          hideNavBar={true}
          component={SplashAppName}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="Login"
          hideNavBar={true}
          component={Login}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="ResetCreatePIN"
          hideNavBar={true}
          component={ResetCreatePIN}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="DappBrowser"
          hideNavBar={true}
          component={DappBrowser}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="ResetConfirmPin"
          hideNavBar={true}
          component={ResetConfirmPin}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="BuyHistory"
          hideNavBar={true}
          component={BuyHistory}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="BackupOptions"
          hideNavBar={true}
          component={BackupOptions}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="ExportPrivateKeys"
          hideNavBar={true}
          component={ExportPrivateKeys}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SendCryptoContacts"
          hideNavBar={true}
          component={SendCryptoContacts}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="CoinHistory"
          hideNavBar={true}
          component={CoinHistory}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="BuyTransactionDetail"
          hideNavBar={true}
          component={BuyTransactionDetail}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="Security"
          hideNavBar={true}
          component={Security}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="ChangePassCode1"
          hideNavBar={true}
          component={ChangePassCode1}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="Signup"
          hideNavBar={true}
          component={Signup}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="Loser"
          hideNavBar={true}
          component={Loser}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="HourChanges"
          hideNavBar={true}
          component={HourChanges}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="VerifyPhrase"
          hideNavBar={true}
          component={VerifyPhrase}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="HistoryComponent"
          hideNavBar={true}
          component={History}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="ConfirmPin"
          hideNavBar={true}
          component={ConfirmPin}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="WalletSequrity"
          hideNavBar={true}
          component={WalletSequrity}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaProSupport"
          hideNavBar={true}
          component={SaitaProSupport}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="WalletSequrityConfirm"
          hideNavBar={true}
          component={WalletSequrityConfirm}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="CreateOrImportWallet"
          hideNavBar={true}
          component={CreateOrImportWallet}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="Setting"
          hideNavBar={true}
          component={Setting}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="Congrats"
          hideNavBar={true}
          component={Congrats}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="FaceID"
          hideNavBar={true}
          component={FaceID}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="EditWallet"
          hideNavBar={true}
          component={EditWallet}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="CreatePIN"
          hideNavBar={true}
          component={CreatePIN}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="ConfirmSecurityPin"
          hideNavBar={true}
          component={ConfirmSecurityPin}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SaitaCardForgot"
          hideNavBar={true}
          component={SaitaCardForgot}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SaitaCardNewPassword"
          hideNavBar={true}
          component={SaitaCardNewPassword}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardChangePassword"
          hideNavBar={true}
          component={SaitaCardChangePassword}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardEpay"
          hideNavBar={true}
          component={SaitaCardEpay}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="CardSetting"
          hideNavBar={true}
          component={CardSetting}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="WelcomeScreen"
          hideNavBar={true}
          component={WelcomeScreen}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SelectLanguage"
          hideNavBar={true}
          component={SelectLanguage}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="ChooseLanguage"
          hideNavBar={true}
          component={ChooseLanguage}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="CreateWallet"
          hideNavBar={true}
          component={CreateWallet}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="ManageWallet"
          hideNavBar={true}
          component={ManageWallet}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="ImportWallet"
          hideNavBar={true}
          component={ImportWallet}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="CreateNewWallet"
          hideNavBar={true}
          component={CreateNewWallet}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SecureWallet"
          hideNavBar={true}
          component={SecureWallet}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="RecoveryPhrase"
          hideNavBar={true}
          component={RecoveryPhrase}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="GetSupport"
          hideNavBar={true}
          component={GetSupport}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="Gainer"
          hideNavBar={true}
          component={Gainer}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SwapScreen"
          hideNavBar={true}
          component={SwapScreen}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="StakingPools"
          hideNavBar={true}
          component={StakingPools}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SendETH"
          hideNavBar={true}
          component={SendETH}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SendMATIC"
          hideNavBar={true}
          component={SendMATIC}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SendBNB"
          hideNavBar={true}
          component={SendBNB}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SendBTC"
          hideNavBar={true}
          component={SendBTC}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SendTRX"
          hideNavBar={true}
          component={SendTRX}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="confirmTransaction"
          hideNavBar={true}
          component={confirmTransaction}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="Hot"
          hideNavBar={true}
          component={Hot}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="Send"
          hideNavBar={true}
          component={Send}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="QrCode"
          hideNavBar={true}
          component={QrCode}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SendCryptoContacts"
          hideNavBar={true}
          component={SendCryptoContacts}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="confirmTransaction"
          hideNavBar={true}
          component={confirmTransaction}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SendETH"
          hideNavBar={true}
          component={SendETH}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="EditContact"
          hideNavBar={true}
          component={EditContact}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="AddNewContacts"
          hideNavBar={true}
          component={AddNewContacts}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="AddToken"
          hideNavBar={true}
          component={AddToken}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SaveContact"
          hideNavBar={true}
          component={SaveContact}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="Epay"
          hideNavBar={true}
          component={Epay}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="MultiWalletOptions"
          hideNavBar={true}
          component={MultiWalletOptions}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="MultiWalletImportSingleCoin"
          hideNavBar={true}
          component={MultiWalletImportSingleCoin}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="Linkview"
          hideNavBar={true}
          component={Linkview}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="Loader"
          hideNavBar={true}
          component={Loader}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="AddNewContacts"
          hideNavBar={true}
          component={AddNewContacts}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="CurrencyPreference"
          hideNavBar={true}
          component={CurrencyPreference}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="Notification"
          hideNavBar={true}
          component={Notification}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="TransactionDetail"
          hideNavBar={true}
          component={TransactionDetail}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="ScanQr"
          hideNavBar={true}
          component={ScanQr}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SelectBlockchain"
          hideNavBar={true}
          component={SelectBlockchain}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="MultiSender"
          hideNavBar={true}
          component={MultiSender}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="MultiSenderEth"
          hideNavBar={true}
          component={MultiSenderEth}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="MultiSenderBNB"
          hideNavBar={true}
          component={MultiSenderBNB}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="MultiSenderMatic"
          hideNavBar={true}
          component={MultiSenderMatic}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="MultiSenderEthToken"
          hideNavBar={true}
          component={MultiSenderEthToken}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="Recipient"
          hideNavBar={true}
          component={Recipient}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="MultiWalletList"
          hideNavBar={true}
          component={MultiWalletList}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="WalletOption"
          hideNavBar={true}
          component={WalletOption}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SwapTab"
          hideNavBar={true}
          component={SwapTab}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SwapLiquidity"
          hideNavBar={true}
          component={SwapLiquidity}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="Liquidity"
          hideNavBar={true}
          component={Liquidity}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="DappBrowserSwap"
          hideNavBar={true}
          component={DappBrowserSwap}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="DappBrowserSwapc"
          hideNavBar={true}
          component={DappBrowserSwapc}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="Stake"
          hideNavBar={true}
          component={Stake}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SwapSettings"
          hideNavBar={true}
          component={SwapSettings}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="TermsandPrivacy"
          hideNavBar={true}
          component={TermsandPrivacy}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SwapNew"
          hideNavBar={true}
          component={SwapNew}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="LiquiditySelectToken"
          hideNavBar={true}
          component={LiquiditySelectToken}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="RemoveLiquidity"
          hideNavBar={true}
          component={RemoveLiquidity}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="RmLiquidityConfirm"
          hideNavBar={true}
          component={RmLiquidityConfirm}
          gestureEnable={false}
          panHandlers={null}
          // initial
        />
        <Scene
          key="SaitaCardWelcome"
          hideNavBar={true}
          component={SaitaCardWelcome}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardsInfo"
          hideNavBar={true}
          component={SaitaCardsInfo}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SaitaCardBlack"
          hideNavBar={true}
          component={SaitaCardBlack}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SaitaCardGold"
          hideNavBar={true}
          component={SaitaCardGold}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SaitaCardDiamond"
          hideNavBar={true}
          component={SaitaCardDiamond}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SaitaCardDeposit"
          hideNavBar={true}
          component={SaitaCardDeposit}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="CardHistoryDetail"
          hideNavBar={true}
          component={CardHistoryDetail}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="SaitaCardHistory"
          hideNavBar={true}
          component={SaitaCardHistory}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardApplyForm"
          hideNavBar={true}
          component={SaitaCardApplyForm}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardPayOption"
          hideNavBar={true}
          component={SaitaCardPayOption}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardDepositQr"
          hideNavBar={true}
          component={SaitaCardDepositQr}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardDepositBinance"
          hideNavBar={true}
          component={SaitaCardDepositBinance}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardBinanceQr"
          hideNavBar={true}
          component={SaitaCardBinanceQr}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardTransaction"
          hideNavBar={true}
          component={SaitaCardTransaction}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="ConnectWithDapp"
          hideNavBar={true}
          component={ConnectWithDapp2}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="KycShufti"
          hideNavBar={true}
          component={KycShufti}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="CountryCodes"
          hideNavBar={true}
          component={CountryCodes}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="SaitaCardLogin"
          hideNavBar={true}
          component={SaitaCardLogin}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="TradeSwap"
          hideNavBar={true}
          component={Trade}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene
          key="NfcDemo"
          hideNavBar={true}
          component={NfcDemo}
          gestureEnable={false}
          panHandlers={null}
        />

        <Scene key="Main" hideNavBar wrap={false}>
          <Tabs
            wrap={false}
            showLabel={false}
            lazy={true}
            swipeEnabled={false}
            gestureEnable={false}
            panHandlers={null}
            initial="Wallet"
            type="reset"
            tabBarStyle={{
              height: heightDimen(80),
            }}
            tabBarComponent={(props) => { return (<CustomTabBar navigation={props.navigation}  />) }}>
            <Scene
              hideNavBar={true}
              key="Dashboard"
              component={Dashboard}
              gestureEnable={false}
              panHandlers={null}
              // icon={({focused}) => (
              //   <TabIcon
              //     focused={focused}
              //     title={LanguageManager.Home}
              //     ImgSize={{width: 19, height: 19}}
              //     activeImg={Images.home_active}
              //     defaultImg={Images.home_inactive}
              //   />
              // )}
            />
            <Scene
              hideNavBar={true}
              key="Market"
              component={Market}
              gestureEnable={false}
              panHandlers={null}
              // icon={({focused}) => (
              //   <TabIcon
              //     focused={focused}
              //     title={LanguageManager.Market}
              //     ImgSize={{width: 19, height: 19}}
              //     activeImg={ThemeManager.ImageIcons.marketActive}
              //     defaultImg={Images.market_inactive}
              //   />
              // )}
            />

            <Scene
              hideNavBar={true}
              key="Trade"
              component={SwapNew}
              gestureEnable={false}
              panHandlers={null}
              // icon={({focused}) => (
              //   <TabIcon
              //     focused={focused}
              //     title={LanguageManager.Wallet_}
              //     ImgSize={{width: 19, height: 19}}
              //     activeImg={Images.wallet_active}
              //     defaultImg={Images.wallet_inactive}
              //   />
              // )}
            />

            <Scene
              hideNavBar={true}
              key="Wallet"
              component={Wallet}
              gestureEnable={false}
              panHandlers={null}
              // icon={({focused}) => (
              //   <TabIcon
              //     focused={focused}
              //     title={LanguageManager.Wallet_}
              //     ImgSize={{width: 19, height: 19}}
              //     activeImg={Images.wallet_active}
              //     defaultImg={Images.wallet_inactive}
              //   />
              // )}
              initial
            />
            {/* <Scene
              hideNavBar={true}
              key="Settings"
              component={Setting}
              gestureEnable={false}
              panHandlers={null}
              icon={({focused}) => (
                <TabIcon
                  focused={focused}
                  title={LanguageManager.Settings}
                  ImgSize={{width: 19, height: 19}}
                  activeImg={Images.settings_active}
                  defaultImg={Images.settings_inactive}
                />
              )}
            /> */}

            {/* <Scene
              hideNavBar={true}
              key="History"
              component={History}
              gestureEnable={false}
              panHandlers={null}
            // icon={({focused}) => (
            //   <TabIcon
            //     focused={focused}
            //     title={LanguageManager.history}
            //     ImgSize={{width: 19, height: 19}}
            //     activeImg={Images.HistoryActive}
            //     defaultImg={Images.HistoryInActive}
            //   />
            // )}
            /> */}

            {/* {Platform.OS == 'android' && ( */}
            <Scene
              hideNavBar={true}
              key="DeFi"
              component={DefiAccessmainIOS}
              gestureEnable={false}
              panHandlers={null}
              // icon={({focused}) => (
              //   <TabIcon
              //     focused={focused}
              //     title={LanguageManager.defi}
              //     ImgSize={{width: 19, height: 19}}
              //     activeImg={Images.defiActive}
              //     defaultImg={Images.defiInActive}
              //   />
              // )}
            />
            {/* )} */}
          </Tabs>
        </Scene>
        <Scene
          hideNavBar={true}
          key="SaitaCardHyperKycForm"
          component={SaitaCardHyperKycForm}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          key="CoinHome"
          hideNavBar={true}
          component={CoinHome}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          hideNavBar={true}
          key="SaitaCardApplyPhysicalCard"
          component={SaitaCardApplyPhysicalCard}
          gestureEnable={false}
          panHandlers={null}
        />
        <Scene
          hideNavBar={true}
          key="SaitaVirtualForm"
          component={SaitaVirtualForm}
          gestureEnable={false}
          panHandlers={null}
        />
         <Scene
          hideNavBar={true}
          key="SendSTC"
          component={SendSTC}
          gestureEnable={false}
          panHandlers={null}
        />
         <Scene
          hideNavBar={true}
          key="MultiSenderSTC"
          component={MultiSenderSTC}
          gestureEnable={false}
          panHandlers={null}
        />
      </Stack>
    </Router>
  );
};
export default RouterComponent;
