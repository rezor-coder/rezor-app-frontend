import { Dimensions } from "react-native"

export const areaDimen = (dimension) => {
    let height = 896
    let width = 414
    let percentage = dimension/(2*(height+width)) *100
    let screenHeight = Dimensions.get('screen').height
    let screenWidth = Dimensions.get('screen').width
    let actualDImension = (2*(screenHeight+screenWidth)) * (percentage/100)
    return actualDImension
}
export const heightDimen=(dimension)=>{
  let height = 896
  let percentage = dimension/(height) *100
  let screenHeight = Dimensions.get('screen').height
  let actualDImension = screenHeight * (percentage/100)
  return actualDImension
}
export const widthDimen=(dimension)=>{
  let width = 414
  let percentage = dimension/(width) *100
  let screenWidth = Dimensions.get('screen').width
  let actualDImension = screenWidth * (percentage/100)
  return actualDImension
}