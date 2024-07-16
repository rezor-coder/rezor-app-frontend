import { Dimensions } from 'react-native';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const SESSION_LIST = 'wallet_connect_sessionList';
export const ColorA = '';
export const ColorB = '';
export const ColorC = '';
export const ColorD = '';
export const ColorE = '';
export const ColorF = '';
export const IS_THEME_ENABLE = 'theme_enabled';
export const CURRENT_THEME_MODE = 'current_mode';
//NOTE: Please also change IS_PRODUCTION parameter from EndPoints
export const ismainnet = true;
export const mainnetInfuraLink =
  'https://mainnet.infura.io/v3/2436cc78200f432aa2d847a7ba486391';
export const mainnetInfuraLinkMatic = 'https://polygon-rpc.com/';
export const mainnetInfuraLinkBNB = 'https://bsc-dataseed1.binance.org:443';
export const mainnetInfuraLinkSTC = 'https://testnet-rpc-nodes.saitascan.io/';
export const testnetMatic =
  'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78';
// export const testnetEth =
//   'https://goerli.infura.io/v3/805096ce0ba141b797b939635f778424';
export const testnetEth =
  'https://ethereum-sepolia.blockpi.network/v1/rpc/e358716e6295edfe6dc53885450a8777f8ca9013';
  export const testnetStc ='https://testnet-rpc-nodes.saitascan.io/'
// 'https://api.zan.top/node/v1/eth/sepolia/public';
export const testnetBnb = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
export const NETWORK_NAME_ETH_TESTNET = 'sepolia'; // 'goerli'
export const CHAIN_ID_ETH = ismainnet ? '1' : '11155111';
export const CHAIN_ID_BNB = ismainnet ? '56' : '97';
export const SwapRouterAddress = '';
export const SwapRouterBNBAddress = '';
export const SwapRouterStcAddress = '';
export const SwapFactoryAddress = '';
export const StakeSaitamaAddress = '';
export const StakingContractAddress = '';
export const SwapWethAddress = ''; 

export const isFirstTime = false;
export const network = ismainnet ? 'mainnet' : 'testnet';
export const isQA = false;
export const Langauage = 'language';
export const LangauageIndex = 'languageindex';
export const access_token = 'access_token';
export const refresh_token = 'refresh_token';
export const access_token_cards = 'access_token_cards';
export const refresh_token_cards = 'refresh_token_cards';
export const black_access_token = 'black_access_token';
export const gold_access_token = 'gold_access_token';
export const diamond_access_token = 'diamond_access_token';
export const isLoginCard = 'isLoginCard';
export const my_referral = 'my_referral';
export const multi_wallet_array = 'multi_wallet_array';
export const ACTIVE_WALLET = 'active_wallet';
export const addresKeyList = 'addresKeyList';
export const coinFamilyKeys = 'coinFamilyKeys';
export const ethBNBMnemonics = 'ethBNBMnemonics';
export const withoutTokenList = 'withoutTokenList';
export const login_data = 'login_data';
export const wallet_data = 'wallet_data';
export const device_token = 'device_token';
export const CHANGED = 'change';
export const PIN = 'user_pin';
export const CURRENCY_SYMBOL = '$';
export const CURRENCY_SELECTED = 'USD';
export const IS_LOGIN = 'is_login';
export const WALLET_LIST = 'WALLET_LIST';
export const FIAT_DECIMALS = 2;
export const CRYPTO_DECIMALS = 8;
export const ENABLE_PIN = 'enable_pin';
export const GRADIENT_COLOR = 'gradient_color';
export const COIN_LIST_ORDER = 'CoinListOrder';
export const USER_NAME = 'user_name';
export const IS_PRIVATE_WALLET = 'is_private_wallet';
export const EPAY_MERCHANTKEY = 'SDKRDFSXCT';
export const EPAY_MERCHANTID = '62bb2ff86b1f7332ac2fc132';

export const CARD_CREDENTIALS = 'card_credentials';

export const SlippageTlrnc = 'slippage';
export const SlippageTimeout = 'timeout';
export const BUTTON_THEME = 'buttonTheme';
export const SOCIAL_LINKS = 'socialLinks';
export const HOT_LIST = 'hotList';
export const DAPP_LIST = 'dappList';
export const FINANCE_LIST = 'financeList';
export const UPDATE_ASYNC_KEY = 'updateasynckey';
export const UPDATE_STC_ASYNC_KEY = 'updateStcAsyncKey';
export const UPDATE_PRIVATE_KEY = 'updateprivatekey';

export const CARD_CURRENCY = 'card_currency';
export const PRIVATE_KEY_WALLET_COIN_FAMILY = 'private_key_wallet_coin_family';
export const FAVORITE = 'favorite';

export const ANDROID_APP_ID =
  'https://play.google.com/store/apps/details?id=com.saitapro';
export const IOS_APP_ID = 'https://apps.apple.com/in/app/saitapro/id1636523777';
export const CURRENT_ANDROID_VERSION = 1.23;
export const CURRENT_IOS_VERSION = 1.91;

export const KYC_CLIENTID =
  'b62f96f10b6912daa5884f4645df2e29730348402c341b456cf1c76a4bb14bb0';
export const KYC_SECRETKEY = '7sTPf887HestGcegqposGQYJovA2PWfq';
export const WALLET_CONNECT_PROJECT_ID = '160e9f6ba80c6225462a13c2640ffd83';
/************************************** Regex ****************************************************/
export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//min 6 letter password, with at least a symbol, upper and lower case letters and a number
export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
export const ALPHABET_REGEX = /^[a-zA-Z]*$/;
export const ALPHABET_REGEX_WITH_SPACE = /^[a-zA-Z ]*$/;
export let ACCOUNT_NUMBER_REGEX = /^[0-9]{0,18}$/;
export const NUMBER_REGEX = /^\d*$/;
export let NUMBER_ONLY_REGEX = /^[0-9]*$/;
export const DECIMAL_REGEX = /^(\.\d{0,8})?$/;
export const ONE_DECIMAL_REGEX = /^\d*\.?\d*$/;
export const TWO_DECIMAL_REGEX = /^\d*\.?\d{0,2}$/;
export const THREE_DECIMAL_REGEX = /^\d*\.?\d{0,3}$/;
export const FIVE_DECIMAL_REGEX = /^\d*\.?\d{0,5}$/;
export const EIGHT_DECIMAL_REGEX = /^\d*\.?\d{0,8}$/;
export const TEN_DECIMAL_REGEX = /^\d*\.?\d{0,10}$/;
export const ALPHABET_HYPEN_REGEX = /^[a-zA-Z]*\-?[a-zA-Z]*$/;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]*$/;
export const NUMBER_START_DOT_OR_NOT_ZERO = /^[1-9.][0-9]*$/;
export const SPACE_REGEX = /[^-\s]/;
export const NAME_REGEX = /^[a-zA-Z ]*$/;
export const urlRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  export const ALPHANUMERIC_REGEX_SPACE = /^[a-zA-Z0-9 ]*$/;
  export const NEW_NAME_REGX = /^[\w\s ]+$/

export let getRandomString = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
export const PERCENTAGE_VALUES = [
  { value: 25, title: '25%' },
  { value: 50, title: '50%' },
  { value: 75, title: '75%' },
  { value: 100, title: '100%' },
];

/************************************** Error messages ****************************************************/
export const APP_NAME = 'SaitaPro';
export const COPIED = 'Copied!';
export const DO_YOU_WANT_TO_CHANGE_CARD =
  'Prior to proceeding with the payment of the card fee, would you like to modify the card type?';
export const CONFIRMATION = 'Confirmation';
export const YES_I_WANT = 'Yes, I want';
export const NO_CONTINUE = 'No, Continue';

export const UPDATEDPIN = 'Pin updated Successfully';
export const ENTERPIN = 'Please enter Pin';
export const CONFIRMPIN = 'Please enter Confirm Pin';
export const CHECKPIN = 'Pin Mismatch';
export const COMING_SOON = 'Coming Soon...';
export const TEST_MAINNET = 'To be tested on mainnet...';
export const VALID_WALLET_NAME = 'Please enter wallet name.';
export const VALID_NAME_CONTACT = 'Please enter valid name.';
export const VALID_NAME =
  'Wallet name must have minimum 3 or maximum 20 characters.';
export const VALID_MNEMONICS_ARRANGE =
  'Please arrange mnemonics in valid order.';
export const VALID_MNEMONICS = 'Please enter mnemonics to import your wallet.';
export const VALID_PVTKEY = 'Please enter private key to import your wallet.';
export const CHECK_EMAIL = 'Please enter an email address';
export const CHECK_OTP = 'Please enter an otp';
export const VALID_OTP = 'Please enter a valid otp';
export const WALLET_ALREADY_EXIST =
  'Wallet already exist';
export const OTP_SUCCESS = 'Otp successfully sent to your email.';
export const OTP_SUCCESS_MOB = 'Otp successfully sent to your mobile number.';
export const VALID_EMAIL = 'Please enter a valid email address';
export const VALID_PASSWORD =
  'Your password must be at least 10 characters long and contain at least 1 uppercase (e.g. A - Z), 1 lowercase(e.g. a - z), 1 numeric digit (e.g 0 - 9) and 1 symbol (e.g $,#,@,!,%,^,&,*,(,))';
export const VALID_OLD_PASSWORD = 'Please enter your valid old password.';
export const VALID_NEW_PASSWORD =
  'Please enter new password and should have one uppercase, one lowercase, one number, one special character, minimum 8 characters';
export const VALID_NEW_CON_PASSWORD =
  'Please enter re-enter new password and should have one uppercase, one lowercase, one number, one special character, minimum 8 characters';
export const VALID_MISMATCH_PASSWORD =
  'Entered password & confirm password are not same.';
export const CHECK_TERMS = 'Please agree terms & condtions before sign up.';
export const VALID_PHONE_NO = 'Please enter a valid Phone number.';
export const VALID_FIRST_NAME = 'Please enter your first name.';
export const VALID_LAST_NAME = 'Please enter your last name.';
export const VALID_VERIFICATION_CODE = 'Please enter verification code.';
export const VALID_DOCUMENT_NUMBER = 'Please enter Passport/ID number.';
export const VALID_NATIONALITY_NAME = 'Please enter nationality.';
export const VALID_BVN_NUMBER = 'BVN should be of 11 digits.';
export const USER_LOGOUT = 'User Logged In on other device.';
export const SESSION_OUT = 'Your saitacard account has been logged out. Please login again';
export const ENTER_PERSONAL_INFO =
  'Please enter your Personal Information before entering your address.';
export const ENTER_ADDRESS_INFO =
  'Please enter your Address before verifying level 1.';
export const ENTER_LEVEl_1_INFO =
  'Please verify level 1 before verifying level 2.';
export const USER_LOGOUT_CHECK =
  'Are you sure you want to logout? Remember to have a backup of seed phrase before you logout.';
export const USER_LOGOUT_CARD = 'Are you sure you want to Logout?';
export const DELETE_WALLET_CHECK = 'Are you sure, you want to delete?';
export const RESET_PIN = 'Are you sure, you want to reset your pin?';
export const RESET_GOOGLE_AUTH =
  'Are you sure, you want to reset your google auth secret key?';
export const BIOMETRIC_UNAVAILABLE = 'Biometrics unavailable';
export const PROVIDE_BIOMETRIC = 'Please provide biometrics to login';
export const ENTER_COIN_ADDRESS = 'Please enter coin address.';
export const NO_NETWORK = 'Please check your internet connection';
export const SOMETHING_WRONG = 'Something went wrong';

export const VALID_GASPRICE = 'Please enter correct Gas Price';
export const VALID_PRIORITY_FEE = 'Please enter correct Priority Fess';
export const VALID_GASLIMIT = 'Gas limit must be at least 21000';
export const ENTER_GASLIMIT = 'Please enter correct Gas Limit';
export const ENTER_ADDRESS = 'Please enter address';
export const ENTER_AMOUNT = 'Please enter amount';
export const VALID_AMOUNT = 'Please enter valid amount';
export const VALID_ADDRESS = 'Please enter valid receiver address';
export const VALID_ADDRESS_CONTACT = 'Please enter valid address';
export const INSUFFICIENT_BALANCE = 'Insufficient Balance';
export const INSUFFICIENT_BALANCE_TRX = 'Insufficient Tron Balance';
export const DUST_AMOUNT_ERROR = 'Error While Broadcasting Due To Dust Amount.';
export const ZERO_CONFIRMATIONS =
  'You have balance with 0 confirmations. Please wait for confirmations to proceed further.';
export const UNSPENT_ERR =
  'Insufficient Balance or You have balance with 0 confirmations. Please wait for confirmations to proceed further.';
export const INVALID_ETH_ADDRESS = 'Invalid ETH Address.';
export const INVALID_ETH_CONTRACT_ADDRESS = 'Invalid ETH Contract Address.';
export const INVALID_BNB_CONTRACT_ADDRESS = 'Invalid BNB Contract Address.';
export const INVALID_MATIC_CONTRACT_ADDRESS = 'Invalid MATIC Contract Address.';
export const INVALID_TRX_CONTRACT_ADDRESS = 'Invalid TRX Contract Address.';
export const INVALID_BNB_ADDRESS = 'Invalid BNB Address.';
export const INVALID_TRX_ADDRESS = 'Invalid TRX Address.';
export const ENTER_CONTRACT_ADDRESS = 'Please Enter Contract Address';
export const ENTER_TOKEN_SYMBOL = 'Please Enter Token Symbol';
export const ENTER_TOKEN_NAME = 'Please Enter Token Name';
export const ENTER_TOKEN_ID = 'Please Enter Token ID';
export const ENTER_DECIMAL_PERCISION = 'Please Enter Decimals of Percision';
export const SAME_ADDRESS_ERROR = 'You cannot send to same address.';
export const VALID_IMAGE = 'Please select valid image';
export const UNCOMPATIBLE_WALLET =
  'Feature is incompatible with Selected Wallet';

export const VALID_F_NAME =
  'First name must have minimum 3 or maximum 20 characters.';
export const VALID_L_NAME = 'Last name must have minimum 3 characters.';
export const TRX_MAX_FEE =
  'This is the maximum fee used for successful transaction.';
export const wallet_already_exist = 'Wallet already exist';
export const wallet_name_already_exist = 'Wallet name already exist';
export const PIn_SUCCESS = 'Pin changed successfully';
export const CONTACT_SAVED = 'Contact Saved';
export const BLOCKED_MSG = 'Unblock user to continue chat.';
export const BLOCKED_SUCCESS = 'User blocked successfully.';
export const UNBLOCKED_SUCCESS = 'User unblocked successfully.';
export const UPLOAD_CSV = 'Please upload CSV file';
export const DASHBOARD_WALLET_LIST='dashboardWalletList'
export const SECRET_KEY =
  'RfUjXn2r5u8x/A?D(G+JJHbg69NGF6bcUIBCRHudnds9(bGJkbhE)H@McQfTjHtGbVOSkhsw!z%C*K-H';

// STATIC
export const SAITAMASK_WALLET_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDstos8vXpthjbSLjooIj9A0Wm5
Rm4qx9kRaHd1CVmWpETRDh58QmBPsCEZb1T+J1hxSi7KCshC+9Fjv+cRFyXtPxt5
IS4JagAJRH556DuNABRAOhi5WoEp3Q3abBBDjEhnKe3OE6RPG01z66jLkF2YJEgn
lpkQfI1KvRI8ngjIbwIDAQAB
-----END PUBLIC KEY-----
`;

// MAIN
export const CARD_KEY = 
ismainnet ? `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxDSieamd3WokSGeMzVn8kxnRU
Ux7xhpFohM0RFzVPmDJLpFmutHDFjNT5eH/sHWT3qiHu6jYNldd07UHqnpGZL2BH
dszPD2UENpSKnY+gigWMkWAExlC6s0GphIdGlzHpixVJwOi8Slp5mVEU/crlUfB9
1CoBsz5rkwBPTNM2LwIDAQAB
-----END PUBLIC KEY-----
` :
  `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiD8nV5eM+qWR3WRUKLRXcmMLU
2awDZtne6jwwGruvMLqJ8KxnJIT9wC8a0p7Bqo+An9uJZTTrVYzL/abp1UglxQjC
86nem32YF7T1p/tq2ExVWe3QWB97l5rQ+wWA4SAov0zmxXWPNFO7ZP256yeTvu2s
Ue85sf65M07NR8JoKQIDAQAB
-----END PUBLIC KEY-----`
export const CENTRALIZED_KEY = 
ismainnet ? `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZnlS96B6itl12lH39dBL8igG+
9PM45RivGfkwiBX/8RxLpEyFDKNb4TEhGI1i74BDRhQ1Ih/zqFp0LwRyiQXmZb6k
l+GtwdEyKiYwgXZnV85cJMFJE4uMDnQDijI+UD5IC3XEs//1+2gZuHO4K9IVnvzi
VIWtY4HllUu/jyI82QIDAQAB
-----END PUBLIC KEY-----
` :
  `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaZglyLtjL1fEajfaJoG8mpnsF
HfInaHjn0jNQ56xGEhrx7pG5PksH2Qg1BYLWhjVcyg6ks9Ta3iV5yZ89K6FQuAjX
Ar0UdgTi+p4NY7caJYm62cUASz9IjJFis+/3gyETxqnQFvKoSjmvvwRnKvIaQVoT
5W+Lqi3lUhDHydcvawIDAQAB
-----END PUBLIC KEY-----`

export const BANK_DETAIL_PRIVATEKEY = ismainnet ? `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCxDSieamd3WokSGeMzVn8kxnRUUx7xhpFohM0RFzVPmDJLpFmu
tHDFjNT5eH/sHWT3qiHu6jYNldd07UHqnpGZL2BHdszPD2UENpSKnY+gigWMkWAE
xlC6s0GphIdGlzHpixVJwOi8Slp5mVEU/crlUfB91CoBsz5rkwBPTNM2LwIDAQAB
AoGAFbGFDpP/BXLEZMFjQ0EP5xOh4Usl+XYBjwrmjXeIgq4lS3thubRGNQ5icga/
tdCMNIRWEA4GfXekpKEFeJfhQu2NJ7GeHi45BTyOy6x4vjS/5oIE98T5TZgCm8Lp
lLnEwgviq+F1PHRuj5q/iwQE/2ShUy/yY+o2MSbZ45nHXuECQQDVIAK+APKCUJUB
rqyUUE7ki9Enp6dQSdemSQtLzwP/fkOsYiHmzM2GmKreJPbvK/GHs4glTDsePo0Y
9d5+9kCZAkEA1KtY2H3TGobnBtyNBPZKhXbSn96xLlNRcVMJzS0U5ZH88mEKAfzi
RzMcCAgJSPYyKPbDyBC5no9qRWelCPBCBwJAAkUXAmMMMisdiykLGYFJddGvZpa4
h3hh3ZmFj0cjKcN0gQ+CgOzJe5eAqmEGaEG1jtZwqsUHFCliY1OrDPsecQJBANBd
zZ/XsAU2lZaIcvagpSUc5YLTur+LzKj+1gScHfRL1AxafWazMbTW46kOzqIY7c5q
8CnOET/EfjfgM7eNRvMCQCKnpNafx/qd+mYEezNHDj7jtPSLQdd3TCpmT9nO2OIv
lafuu4A9yPNbMZvmxj/j/Edsp8pxapuhD9lRF19lO5s=
-----END RSA PRIVATE KEY-----` :
  `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCiD8nV5eM+qWR3WRUKLRXcmMLU2awDZtne6jwwGruvMLqJ8Kxn
JIT9wC8a0p7Bqo+An9uJZTTrVYzL/abp1UglxQjC86nem32YF7T1p/tq2ExVWe3Q
WB97l5rQ+wWA4SAov0zmxXWPNFO7ZP256yeTvu2sUe85sf65M07NR8JoKQIDAQAB
AoGAKHSYhfTlTXcrxT9PqUKn+nGH8WqFLjQ2nxcJ/1gtEgawCk8yOm07ZbzcBW4e
g2n4eLtvKlVBaJ3qj+G6ERVU9PCplqHXTVVaLMsqWm+/RVlxPXZKM0YZ6RirXwDL
ofQqlNpa5y/voLUE6/uZPnHvC9Bac5/GX64/FfAOW+ipsIECQQD9D1XFMUYTibAv
cagskLMksjCH/N0bCuQ3E+MfmPRp9qYtpRqtq6ZRMKcvqYF7sPSVFbt7Ubv0D7lF
0RZzFykFAkEAo/HNJL01kDj5OWUjw17e33A5e5HpWCoCnmxFK4AIxpUm24R4rSap
GKCfR2YW9jMu4iP9cm/u1dzoaBqBxK7b1QJANuWBvMJgqlJfNxuX2PsW8an6HzX6
nSgys8QLrEoZE3efOx2q+OvYq5o7WnqSDUwo8sKBJlJnzJ0wmvWtwg/PJQJBAIJW
r9igkKALm6BU11zw5NHQ//JM664LIC/hNhDCZreyRsVJCUPns5H/yQHTmTe9M23Y
XRwI/2GJkj+Jq1e6CM0CQGUBtJMtKJV0vq/IAeRpUy3GKCzmfLq+v4RPxn6uFwtr
ScC/xR+ChGQMepwx2APkYOT2zvp2RdhqARKWViUf/nM=
-----END RSA PRIVATE KEY-----
`

// STAGE
// export const CARD_KEY = `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiD8nV5eM+qWR3WRUKLRXcmMLU
// 2awDZtne6jwwGruvMLqJ8KxnJIT9wC8a0p7Bqo+An9uJZTTrVYzL/abp1UglxQjC
// 86nem32YF7T1p/tq2ExVWe3QWB97l5rQ+wWA4SAov0zmxXWPNFO7ZP256yeTvu2s
// Ue85sf65M07NR8JoKQIDAQAB
// -----END PUBLIC KEY-----`;
// export const CENTRALIZED_KEY = `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaZglyLtjL1fEajfaJoG8mpnsF
// HfInaHjn0jNQ56xGEhrx7pG5PksH2Qg1BYLWhjVcyg6ks9Ta3iV5yZ89K6FQuAjX
// Ar0UdgTi+p4NY7caJYm62cUASz9IjJFis+/3gyETxqnQFvKoSjmvvwRnKvIaQVoT
// 5W+Lqi3lUhDHydcvawIDAQAB
// -----END PUBLIC KEY-----`;

// export const BANK_DETAIL_PRIVATEKEY = `-----BEGIN RSA PRIVATE KEY-----
// MIICXAIBAAKBgQCiD8nV5eM+qWR3WRUKLRXcmMLU2awDZtne6jwwGruvMLqJ8Kxn
// JIT9wC8a0p7Bqo+An9uJZTTrVYzL/abp1UglxQjC86nem32YF7T1p/tq2ExVWe3Q
// WB97l5rQ+wWA4SAov0zmxXWPNFO7ZP256yeTvu2sUe85sf65M07NR8JoKQIDAQAB
// AoGAKHSYhfTlTXcrxT9PqUKn+nGH8WqFLjQ2nxcJ/1gtEgawCk8yOm07ZbzcBW4e
// g2n4eLtvKlVBaJ3qj+G6ERVU9PCplqHXTVVaLMsqWm+/RVlxPXZKM0YZ6RirXwDL
// ofQqlNpa5y/voLUE6/uZPnHvC9Bac5/GX64/FfAOW+ipsIECQQD9D1XFMUYTibAv
// cagskLMksjCH/N0bCuQ3E+MfmPRp9qYtpRqtq6ZRMKcvqYF7sPSVFbt7Ubv0D7lF
// 0RZzFykFAkEAo/HNJL01kDj5OWUjw17e33A5e5HpWCoCnmxFK4AIxpUm24R4rSap
// GKCfR2YW9jMu4iP9cm/u1dzoaBqBxK7b1QJANuWBvMJgqlJfNxuX2PsW8an6HzX6
// nSgys8QLrEoZE3efOx2q+OvYq5o7WnqSDUwo8sKBJlJnzJ0wmvWtwg/PJQJBAIJW
// r9igkKALm6BU11zw5NHQ//JM664LIC/hNhDCZreyRsVJCUPns5H/yQHTmTe9M23Y
// XRwI/2GJkj+Jq1e6CM0CQGUBtJMtKJV0vq/IAeRpUy3GKCzmfLq+v4RPxn6uFwtr
// ScC/xR+ChGQMepwx2APkYOT2zvp2RdhqARKWViUf/nM=
// -----END RSA PRIVATE KEY-----
// `;

// NOT USING
// older stage private key
// export const BANK_DETAIL_PRIVATEKEY = `-----BEGIN RSA PRIVATE KEY-----
// MIICXAIBAAKBgQDGqxg5tbQvEbkWx/ZdZ3ROZSASfKKWHU1N9cEeJUqY8yq16xpo
// QtGYGR1qaYMrNaLZPbuPW0sXwog6OepGH3NWfcfq03SiUAyT7StiugCJhUkE8To5
// v8E9WDNijsLoObeFkw2f5xaBHVjFrdVYmI2UxEmTmoeeNa/KPM+hjXLxfQIDAQAB
// AoGAVgfpabRB3tAx8qeNDE2sk/Y+uUK3tYHi5Au0ITXM5AcJS9YPjW7CDLdzgY1H
// fAKyDpkpC59hGVzoWS6TQOKFsv7J1szO0whZdrDUIIw/qhB7wW74Ke6ctUWntEMV
// jYhqSykqvlKkoH/WkB2gl7pezwcpo/syh3R66ngvWr6HwRECQQDzYDCOXlKa/nkS
// fvaJ5C2LoFgcmieHmJ2uhSnoQ+9nt5F9xmUTCHdx28id7/JIUvvVvngl0f8QcKfy
// BgbkYQ6LAkEA0Pk7IUeHPpggUWSkwr6+C0lUcRjv2DGJc4NWwOQ2NrSeW5WanOUz
// csa0NhmrfdA3PaDoiXhLexmL1uBhol9JFwJAEbxozXdCPdldqWNnRBVE3HAK+8qg
// JtmQZC+AJlUNFVnjWG8k3oY3biy+KgRae7rQb3s59kefdus+0fxudCY+kQJAJDXL
// hSy7xqDdmLzzv7sFezctpptHlBKhWp67fZkNu9T4S65UqDMfAxhjSayRBq/5ongr
// UwbBLYdzr7wZruUL6QJBAJmDQLnPbF7MgDw9uQqqIrKlLo0ZGyLqJr8aGgOVtByT
// XFmoO661tRGlWM+qYuOfGq8sPo2S/iDRIZoGlg7xDYE=
// -----END RSA PRIVATE KEY-----
// `;

// NOT USING
// export const SAITAMASK_WALLET_KEY = `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDstos8vXpthjbSLjooIj9A0Wm5
// Rm4qx9kRaHd1CVmWpETRDh58QmBPsCEZb1T+J1hxSi7KCshC+9Fjv+cRFyXtPxt5
// IS4JagAJRH556DuNABRAOhi5WoEp3Q3abBBDjEhnKe3OE6RPG01z66jLkF2YJEgn
// lpkQfI1KvRI8ngjIbwIDAQAB
// -----END PUBLIC KEY-----
// `
export const USER_DATA = 'userData'