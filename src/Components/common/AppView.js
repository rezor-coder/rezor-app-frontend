import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { Colors } from '../../theme';

let bgColo = ''
function AppView(props) {
  const [bgColor, setBgColor] = useState('');
  const [barStyle, setBarStyle] = useState('light-content');
  const [isPin, setIsPin] = useState(false);
  const [themeSelected, setThemeSelected] = useState('theme1');

  /******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener('themeChanged', data => {
        console.log("themeChanged::::::",data);
    //   getData(Constants.PIN_LOCK).then(pin => {
    //    Singleton.getInstance().newGetData(Constants.CURRENT_THEME_MODE).then(async theme => {
          setThemeSelected(data);
        // })
        // bgColo = data
        // const havingPin = pin ? true : false;
        // setIsPin(havingPin);
        // setBgColor(data);
    //   })
    });
  }, [themeSelected]);

  /******************************************************************************************/
  return (
    <>
      <StatusBar barStyle={themeSelected=='theme2' ? 'dark-content' : 'light-content'} />
      {console.log("themeChanged::::::inside",themeSelected)}
      <SafeAreaView style={{ flex: 1, backgroundColor: themeSelected=='theme1'?Colors.bgBlack:Colors.bgWhite}}>
        {props.children}
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: themeSelected=='theme1'?Colors.bgBlack:Colors.bgWhite }} />
    </>
  );
}
export { AppView };
