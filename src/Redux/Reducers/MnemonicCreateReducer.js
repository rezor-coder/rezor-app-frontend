import {
  CREATEMNEMONIC_FORM_UPDATE,
  REGISTER_USER_FAIL,
  REGISTER_USER_SUCCESS,
  REGISTER_USER,
  REGISTER_FORM_RESET,
  BACKUPMNEMONIC_FORM_UPDATE,
} from '../Actions/types';

const INITIAL_STATE = {
  mainmnemonics: [],
  mnemonics: [],
  walletAddress: '',
  backupMnemonics: [],
  ethAddress: '',
  importMnemonics: '',
  password: '',
  confirmPassword: '',
  registerUser: '',
  registerError: '',
  regLoading: false,
  // walletName: '',
  walletPin: '',
  isfromImport: false,
  mnemonicData: '',
  currentTheme: 'theme',
  currentLanguage: '',
};

/************************************** Register reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATEMNEMONIC_FORM_UPDATE:
      // //console.warn('MM',"----****---", state, action);
      return { ...state, [action.payload.prop]: action.payload.value };
    case BACKUPMNEMONIC_FORM_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case REGISTER_USER:
      return { ...state, regLoading: true, registerError: '' };
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        registerUser: action.payload,
        registerError: '',
        regLoading: false,
      };
    case REGISTER_USER_FAIL:
      return { ...state, registerError: action.payload, regLoading: false };
    case REGISTER_FORM_RESET:
      return { ...state, ...INITIAL_STATE };
    case 'CHANGE_THEME':
      return { ...state, currentTheme: action.payload };
    case 'CHANGE_LANGUAGE':
      return { ...state, currentLanguage: action.payload };
    default:
      return state;
  }
};
