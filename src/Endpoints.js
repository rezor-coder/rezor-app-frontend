import * as constants from './Constant';

export const BASE_URL = 'https://api.saita.pro/prod/api/v1/';
// export const BASE_URL = 'https://stage-api.saita.pro/prod/api/v1/';
//  constants.network == 'testnet' ? 'https://wallet-api.pro-saitamask.com/stage/api/v1/' : 'https://api.saita.pro/prod/api/v1/';// ? 
export const BASE_URL_SAITACARDS =
  constants.network == 'testnet' ?
   'https://stage-card-api.pro-saitamask.com/api/v1/' 
   :'https://card.saitacard.io/api/v1/';
   export const VAULT_CARD_URL='https://api.prod.testessential.net/';

export const BASE_URL_CARDS_CENTRALISED =
  constants.network == 'testnet' ? 
  'https://centralized.pro-saitamask.com/api/v1/'
    : 'https://centralized.saitacard.io/api/v1/'
export const BASE_URL_CARD_EPAY = constants.network == 'testnet' ? "https://epay-saitacard-stage.herokuapp.com/" : "https://epay-card-dev.herokuapp.com/"
export const BASE_URL_HUOBI =
  constants.network == 'testnet'
    ? 'https://api-huobi.saitamacard.ai/'
    : 'https://api-huobi.saitamacard.ai/'
export const BASE_IMAGE = BASE_URL + 'static';
export const BANNER_IMG = 'user/get/advertisement/list';
export const BANNER =
  'https://api.saita.pro/prod/api/v1/static/images/advertisement.png';
export const DAPP_IMG_URL = 'https://api.saita.pro/prod/api/v1/static';
export const SOCIAL_LINK = 'user/get/social/media/link/list';
export const API_CREATE_WALLET = 'user/create/wallet';
export const API_COIN_LIST = 'wallet/coinlist';
export const API_MYWALLETS = 'wallet/mywallet';
export const API_DASHBOARD_WALLETS = 'wallet/myWalletHomeScreen';
export const API_ACTIVE_INACTIVE_COIN = 'wallet/activeinactive';
export const API_SEND_TXN = '/send';
export const API_SAVE_TXN = '/savetrnx';
export const API_TRANSACTION = 'wallet/transaction/list';
export const API_TRANSACTION_DETAIL = 'wallet/transaction/details';
export const API_GRAPH_DATA = 'graphs?';
export const API_VERIFY_EMAIL = 'user/verifyemail';
export const API_VERIFY_MOBILE = 'user/verifymobile';
export const API_OTP_VERIFY = 'user/verifyotpcode';
export const API_REGISTER = 'user/register';
export const API_REFRESH_TOKEN = 'user/refreshToken';
export const API_LOGIN = 'user/login';
export const API_USER_DETAIL = 'user/getuserdata';
export const API_REFERRER_CODE = 'user/checkreferrercode';
export const API_BTC_COMMISSION = 'wallet/getcommissiondata';
export const WALLET_GET_COIN_LIST_ORDER = 'wallet/get/coin/list/order';
export const DAPP_LIST = 'dapp/list?coin_family=1';
export const FINANCE_LIST = 'wallet/exchange/support/list';
export const IS_PRODUCTION = constants.ismainnet ? 1 : 0;
export const COLOR_LIST = 'wallet/colorlist';
export const UPDATE_BALANCE = 'wallet/updateUserBalance';
/**************************************ETHEREUM APIs ****************************************************/
export const API_NONCE = '/nonce';
export const API_ETH_GAS_PRICE = 'wallet/gasprice';
export const API_ETH_GAS_ESTIMATE = '/gas_estimation';
export const API_ETH_TOKEN_RAW = '/get_raw_data_string';
export const CHECK_EXIST_CONTACT='user/check-contact-exist'
/**************************************BITCOIN APIs ****************************************************/
export const API_BTC_GAS_PRICE = 'https://api.blockchain.info/mempool/fees';
export const API_UNSPENT = 'bitcoin/unspent/';
/**************************************BCH APIs ****************************************************/
export const API_UNSPENT_BCH = 'bitcoincash/unspent/';
/**************************************BNB APIs ****************************************************/
export const API_BNB_GAS_ESTIMATE = '/gas_estimation';
export const API_BNB_GAS_PRICE = 'wallet/gasprice';
/**************************************LTC APIs ****************************************************/
export const API_UNSPENT_LTC = 'litecoin/unspent/';
/**************************************DOGE APIs ****************************************************/
export const API_UNSPENT_DOGE = 'dogecoin/unspent/';
/**************************************TRON APIs ****************************************************/
export const API_TRON_FEE = '/tron/trx/tronfee';
/**************************************DOT APIs ****************************************************/
export const API_DOT_PROVIDER = '/providers';
/**************************************KSM APIs ****************************************************/
export const API_KSM_PROVIDER = '/providers';
/**************************************ADD TOKEN APIs ****************************************************/
export const API_SEARCH_TOKEN = 'wallet/search';
export const API_ADD_TOKEN = 'wallet/addtoken';
export const API_ADD_TOKEN_V2 = 'wallet/addtoken-v2';
export const API_COIN_GECKO = 'coin-gecko/search?symbol=';
/************************************ LOGOUT API ***************************************************/
export const API_LOGOUT = 'user/logout';
/************************************ NOTIFICATION API ***************************************************/
export const API_NOTIFICATION = 'user/notification/list';
export const API_ENABLE_DISABLE_NOTI = 'user/notification/update?status=';
export const API_ENABLE_DISABLE_NOTI_STATUS = 'user/notification/status';
/************************************ CURRENCY PREFERENCE API ***************************************************/
export const API_CURRENCY_PREFERENCE = 'wallet/currencyfiatlist';
/************************************ CHAR API'S ***************************************************/
export const API_GET_CONTACTS = 'chat/check-contacts';
export const API_CREATE_THREAD = 'chat/thread';
export const API_CHAT_LIST = 'chat/all-chats?mobile=';
export const API_CHAT_HISTORY = 'chat/user-chat?threadId=';
export const UPLOAD_IMAGE_URL = 'upload';
export const BLOCK_USER_URL = 'chat/block';
export const BLOCK_USER_LIST_URL = 'chat/block-list?mobile=';
export const UNBLOCK_USER_URL = 'chat/unblock';
export const ME_BLOCK_USER_LIST_URL = 'chat/me-blocked-list?mobile=';
export const API_UPDATE_CONTACT_URL = 'chat/update/addresses';
export const API_SEND_CONTACTS = 'chat/add-all-contacts';
export const API_CHECK_MOBILENO = 'chat/mobile/addresses';
/**************************************Tezos APIs ****************************************************/
export const API_TEZOS_SEND = '/send';
/**************************************ADD WALLET CONTACT APIs ****************************************************/
export const API_ADD_WALLET_CONTACT = 'chat/add-contact';
export const API_ADD_WALLET_CONTACT_LIST = 'chat/contacts?network=';
export const API_ADD_WALLET_CONTACT_RECENT_LIST =
  'wallet/contact-transactions?coin_family=';
export const API_DELETE_WALLET_CONTACT = 'chat/delete-contact';
export const API_EDIT_WALLET_CONTACT = 'chat/edit-contact';
/************************************ NEWS API ***************************************************/
export const API_NEWS = 'news/listing?coin_id=';
/************************************ NFT API ***************************************************/
export const API_NFT = 'nft/add';
export const API_NFT_BSC = 'nft/addbscnft';
export const API_NFT_LIST = 'nft/list?walletAddress=';
export const API_NFT_GAS_ESTIMATE = 'nft/gas-estimation';
/************************************ Swap API ***************************************************/
export const API_SWAP_COIN_LIST = 'wallet/swap/coinlist';
export const API_SWAP_USER_LIST = 'wallet/swap/myNewCoinList';
export const API_SWAP_LIST_ALL = 'wallet/all_swap_list';
export const API_SWAP_LIST_ALL_V2 = 'wallet/all_swap_list';
export const API_SWAP_NEW='wallet/new_swap_list';
export const API_SWAP_COIN_LIST_NEW = 'wallet/swap_list';
export const API_SWAP_COIN_LIST_BNB = 'wallet/swap_list_bnb';
/************************************ Invite Link API ***************************************************/
export const API_INVITE = 'wallet/invitelink';
/************************************ Invite Link API ***************************************************/
export const UPLOAD_CSV_URL = 'upload/csv';
/************************************ upload kyc API ***************************************************/
export const UPLOAD_IMAGE_KYC_URL =
  'https://1c674262-b495-47d5-a536-81a449706d35.mock.pstmn.io/api/v1/ocr/aadhaar'; // 'https://sandbox.surepass.io/api/v1/ocr/aadhaar'
export const VALIDATE_ADHAR_CARD =
  'https://1c674262-b495-47d5-a536-81a449706d35.mock.pstmn.io/api/v1/aadhaar-validation/aadhaar-validation'; //'https://sandbox.surepass.io/api/v1/aadhaar-validation/aadhaar-validation'
export const GENERATE_OTP_ADHAR_CARD =
  'https://1c674262-b495-47d5-a536-81a449706d35.mock.pstmn.io/api/v1/aadhaar-v2/generate-otp'; //'https://sandbox.surepass.io/api/v1/aadhaar-v2/generate-otp'
export const SUBMIT_OTP_ADHAR_CARD =
  'https://1c674262-b495-47d5-a536-81a449706d35.mock.pstmn.io/api/v1/aadhaar-v2/submit-otp'; //'https://sandbox.surepass.io/api/v1/aadhaar-v2/submit-otp'
export const UPLOAD_IMAGE_PASS_URL =
  'https://1c674262-b495-47d5-a536-81a449706d35.mock.pstmn.io/api/v1/ocr/passport';
export const FACE_MATCH_URL =
  'https://sandbox.surepass.io/api/v1/face/face-match';
export const ADD_KYC = 'user/addkyc';
export const API_SUPPORT_REQUEST = 'user/contact/support';
export const API_UPLOAD_SUPPORT_IMAGE = 'upload';
/**************************************epay APIs ****************************************************/
export const API_EPAY_ORDER = 'user/create-order';
export const API_EPAY_ORDER_V2 = 'user/create-order-v2';
export const API_CRYPTO_PRICE = 'user/get-data';
export const API_CRYPTO_PRICE_NEW = 'user/get-epay-data';
export const API_BUYLIST = 'user/transactionList';
export const API_EpayRate = 'user/calculateFee';
export const API_GET_PRICE_EPAY = 'user/get-pricing-v2';
/**************************************infuramainnet APIs ****************************************************/
export const API_INFURA_LINK = 'user/mainnet/node-datails';
export const API_INFURA_LINKBNB = 'user/mainnet/bsc-node';
export const API_Contract_Info = 'user/mainnet/nodeInfo';
export const API_DEX_URLS = 'user/fetchDexUrls';
export const CHECK_FOR_SWAP_TOKEN = 'wallet/toCheckForSwapToken';
/************************************** saitacard APIs ****************************************************/
// export const API_LOGIN_CARDS = 'user/v2/login';
export const API_LOGIN_CARDS = 'user/login';
// export const API_SIGNUP_CARDS = 'user/v2/signup';
export const API_SIGNUP_CARDS = 'user/signup'; // old
export const API_CARDS_SEND_OTP = 'auth/sendOtp';
// export const API_CARDS_VERIFY_OTP = 'auth/verifyOtp';
// export const API_CARDS_USERDETAIL = 'user/v2/userDetails';
export const API_CARDS_USERDETAIL = 'user/userDetails';
// export const API_CARDS_DETAIL = 'card/v2/getcarddetails';
// export const API_CARD_BALANCE = 'user/v2/getUserBalance';
export const API_CARDS_DETAIL = 'card/getcarddetails';
export const API_CARD_BALANCE = 'user/getUserBalance';
export const API_NEW_CARD_APPLY_IF_NOT = 'user/applyAnotherCard';
export const API_CARDS_SAVETX = 'card/saveTrnx';
export const API_CARDS_SENDOTP = 'user/sendOtp';
export const API_CARDS_SENDOTP_MOBILE = 'user/sendOtpOnMobile';
export const API_APPLY_VIRTUAL_ADDRESS = 'user/addressDetails';
// export const API_GET_CARDLIST = 'card/v2/getcardlist';
export const API_GET_COUNTRYLIST = 'user/getNationalityCodeList';
export const API_GET_CARDLIST = 'card/getcardlist'; // old
export const API_APPLY_ANOTHER_CARD = 'card/applyAnotherCard';
export const API_CARD_PHYSICAL_FORM = 'user/physicalCardAddressDetails';
export const API_CARD_PHYSICAL_FORM_KYC = 'user/kyc_details';
export const API_CREATE_WALLET_SAITACARD = 'user/create/wallet';
export const API_COINLIST_SAITACARD = 'user/coinlist';
export const API_FETCH_BANK_DETAILS = 'card/bankDetails';
export const API_CARD_HISTORY = 'card/transactionRecord';
export const API_USERCARD_LIST = 'card/getusercardlist';
export const API_FORGETCARDPASSWORD = 'auth/forgetPwd';
export const API_FORGETCARD_VERIFY = 'auth/verifyOtp';
export const API_NEWPASSWORDCARD = 'auth/setNewPwd';
export const API_CHANGE_PASSWORDCARD = 'auth/changePwd';
export const API_UPDATE_MOBILE = 'user/updateUserDetails';
export const API_CARD_EPAY_CREATE_ORDER = 'epay/create-order';
export const API_CARD_BINANCE_CREATE_ORDER = 'card/bpay/create-order'; // old
export const LIMINAL_COIN_LIST = 'liminal/LiminalCoin'
export const LIMINAL_PRICE_CONVERSION = 'liminal/Calculator'
export const BINANCE_PRICE_CONVERSION = 'bpay/create-order'
/************************************** HUOBI APIs ****************************************************/
export const HUOBI_FIND_DESIRED_TOKEN = 'findDesiredToken'
export const HUOBI_GET_FAVOURITES = 'getFavorites'
export const HUOBI_SET_FAVOURITES = 'setFavourite'
export const HUOBI_REMOVE_FAVOURITES = 'removeFromFavourites'
export const HUOBI_FETCH_CHAIN = 'fetchChain'
export const HUOBI_FETCH_FEE = 'fetchFee'
export const HUOBI_CHECK_SWAP = 'checkswap'
export const HUOBI_FIND_TOKEN_FOR_CURRENCY = 'findTokenForCurrency'
export const HUOBI_SWAP = 'swap'
export const HUOBI_TOKEN_LIST = 'wallet/getHuobiListing'
export const CHECK_MAINTENANCE='wallet/isOnMaintainance';
export const UPDATE_WALLET_BALANCES='user/updateUserWalletBalances';
/************************************** HUOBI APIs ****************************************************/
export const STC_GAS_PRICE='saitachain/gasPrices';
export const STC_GAS_LIMIT='saitachain/gasLimit';

/************************************** Vault APIs ****************************************************/
// export const SIGN_UP = 'user/v3/mobile/signup';
// export const CONFIRM_PHONE = 'user/v3/mobile/phone/confirm';
// export const RESEND_OTP = 'user/v3/mobile/phone/verify/resend';
// export const EMAIL_ADD = 'user/v3/mobile/email/add';
// export const SET_USER_DETAIL='user/v3/customer/profile';
// export const USER_LOGOUT = 'user/v3/signout';
// export const USER_LOGIN = 'user/v3/oauth/token';
// export const GET_USER_PROFILE = 'user/v3/customer/profile';
// export const GET_KYC_ID='user/v3/kyc/start';
// export const REQUEST_VAULT_CARD='card/v3/card/card-requests';

// export const FORGET_OTP_SEND = 'user/v3/mobile/password/reset';
// export const FORGET_OTP_CONFIRM = 'user/v3/mobile/password/reset/confirm/code';
// export const FORGET_PASSWORD_CONFIRM = 'user/v3/mobile/password/reset/confirm';


// ----------------------------------------------------------------
export const GET_SIGNUP_CODE = 'v2/mobile/signup';
export const CONFIRM_PHONE_OTP = 'user-v3/mobile/phone/confirm';
export const EMAIL_ADD='user-v3/mobile/email/add';
export const USER_LOGIN='oauth/token';
export const KYC_DATA='user-v3/customer/kyc/data';
export const GET_CUSTOMER_PROFILE='user-v3/customer/profile';
export const RESEND_OTP='user-v3/mobile/phone/verify/resend';
export const KYC_START='user-v3/kyc/start';
export const VAULT_DETAILS='user-v3/vault/details';
export const USER_CARD_LIST='card-v3/card/list';
export const CARD_TRANSACTION_HISTORY='card-v3/history/card/';
export const otpForCardDetailsCode=(cardId,cp)=>`card-v3/card/${cardId}/details/code?cp=${cp}`;
export const otpForCardDetails=(cardId,cp)=>`v2/card/${cardId}/details?cp=${cp}`;
export const otpForCardBlock=(cardId,cp)=>`card-v3/card/${cardId}/soft-block/code?cp=${cp}`;
export const otpForCardUnblock=(cardId,cp)=>`card-v3/card/${cardId}/soft-unblock/code?cp=${cp}`;
export const BlockCard=(cardId,cp)=>`v2/card/${cardId}/soft-block?cp=${cp}`;
export const unblockCard=(cardId,cp)=>`v2/card/${cardId}/soft-unblock?cp=${cp}`;
export const LOG_OUT='signout';
export const CHANGE_PASSWORD='v2/mobile/password/change';
// ----------vault forget apis ----------
export const FORGET_OTP_SEND = 'v2/mobile/password/reset';
export const FORGET_OTP_CONFIRM = 'v2/mobile/password/reset/confirm/code';
export const FORGET_PASSWORD_CONFIRM = 'v2/mobile/password/reset/confirm';

export const GET_WALLET_LIST = 'user-v3/wallets';
export const CREATE_WALLETS = 'user-v3/wallets';
export const requestCard=(cp)=>`card-v3/card/card-requests?cp=${cp}`;
export const getValutWalletList=(cp) => `v2/card/payload/currencies?cp=${cp}&force=true`
export const FINISH_KYC='user-v3/kyc/ondato/finished?platform=COMMON';

export const cardRequestAddress=(cardId,cp)=>`card-v3/card/card-requests/${cardId}/address?cp=${cp}`;
export const ADDITIONAL_INFO=`card-v3/card/additional-personal-info`;
export const getTopUpConversionPrice=(cardId,cp) => `card-v3/card/${cardId}/payload/offers?cp=${cp}&force=false`
export const GET_COUNTRY_CODES = 'card-v3/get_country_codes';
export const GET_VAULT_SETTINGS = 'card-v3/get_vault_settings';
export const cardPrice=(cardId,currency,cp)=>`card-v3/card/card-requests/${cardId}/price/${currency}?cp=${cp}`;
export const payCardFee=(cardId,currency,cp)=>`card-v3/card/card-requests/${cardId}/payment-offer/${currency}?cp=${cp}`
export const confirmCardFee=(cardId,cp)=>`card-v3/card/card-requests/payment-offer/${cardId}/confirm?cp=${cp}`;
export const rechargeConversion=(cardId,cp)=>`card-v3/card/${cardId}/payload/offers?cp=${cp}&force=false`;
export const confirmRecharge=(cardId,cp,offerId)=>`card-v3/card/${cardId}/payload/offers/${offerId}/confirm?cp=${cp}&force=false`;
export const cardLimits=(cardId,cp)=>`card-v3/card/${cardId}/payload/data?cp=${cp}&force=false`;
export const CARD_PRICES = 'card-v3/card/prices';