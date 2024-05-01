import {
  WALLET_FORM_UPDATE,
  WALLET_FORM_RESET,
  COIN_LIST,
  WALLET_FAIL,
  MYWALLET_LIST,
  ACTIVE_INACTIVE_COIN,
  // MOBILE_FAIL,
  WALLET_REFRESH,
  COIN_LIST_EMPTY,
  MYWALLET_TOTAL_BALANCE,
  DASHBOARD_WALLET_LIST,
  LAST_DEPOSIT_DATA,
  SAVE_DEX_URLS,
  CLEAR_REDUCER
} from '../Actions/types';
const INITIAL_STATE = {
  search: '',
  coinList: [],
  walletError: '',
  mobileError: '',
  myWallets: [],
  coinActivity: '',
  withoutTokenList: [],
  refreshWallet: true,
  isOtpModalpop: true,
  totalBalance: 0,
  dashboardWallets: [],
  lastDepositData: {},
  dex_data: {
    epayUrl: '',
    liquidityUrl: '',
    stakeUrl: '',
    publicBscUrl: '',
    publicEthUrl: ''
  }
};

/************************************** wallet reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WALLET_FORM_UPDATE:
      //console.warn('MM',"checkkk " + [action.payload.prop] + ' ' + action.payload.value)
      return { ...state, [action.payload.prop]: action.payload.value };
    case WALLET_FORM_RESET:
      return { ...state, ...INITIAL_STATE };
    case COIN_LIST:
      return { ...state, coinList: action.payload };
    case COIN_LIST_EMPTY:
      return { ...state, myWallets: [], totalBalance: 0 };
    case SAVE_DEX_URLS:
      return { ...state, dex_data: action.payload };
    case MYWALLET_LIST:
      return { ...state, myWallets: action.payload };
    case DASHBOARD_WALLET_LIST:
      return { ...state, dashboardWallets: action.payload };
    case MYWALLET_TOTAL_BALANCE:
      return { ...state, totalBalance: action.payload };
    case ACTIVE_INACTIVE_COIN:
      return { ...state, coinActivity: action.payload };
    case WALLET_FAIL:
      return { ...state, walletError: action.payload };
    // case MOBILE_FAIL:
    //   return {...state, mobileError: action.payload};

    case WALLET_REFRESH:
      return { ...state, refreshWallet: !state.refreshWallet };
    case LAST_DEPOSIT_DATA:
      return { ...state, lastDepositData: action.payload };
    case CLEAR_REDUCER: {
      console.log("walletReducer");
      return INITIAL_STATE
    }
    default:
      return state;
  }
};
