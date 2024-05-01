import { Platform } from "react-native";

const fonts = {


  // regular: 'Helvetica',
  // normal: 'Helvetica',
  // light: 'helvetica-light',
  // semibold: 'Helvetica-BoldOblique',
  // bold: 'Helvetica-Bold',



  // "regular": 'Poppins-Regular',
  // "normal": 'Poppins-Regular',
  // "medium": 'Poppins-Medium',
  // "light": 'Poppins-Light',
  // "semibold": 'Poppins-SemiBold',
  // "bold": 'Poppins-Bold',

  "regular": 'Montserrat-Regular',
  "normal": 'Montserrat-Regular',
  "medium": 'Montserrat-Medium',
  "light": 'Montserrat-Light',
  "semibold": 'Montserrat-SemiBold',
  "bold": 'Montserrat-Bold',

  "ocr": Platform.OS == 'android' ? 'OCR-A_Regular' : 'OCR-A'

}
export default fonts;