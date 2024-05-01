import React, {Component} from 'react';
import {View,Modal} from 'react-native';
import LottieView from 'lottie-react-native';
import { Images} from '../../../theme';
export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
    };
  }
  componentDidMount() {}
  componentWillUnmount() {
    this.setState({loader: false});
  }
  render() {

  //  return <Modal
  //   visible={this.state.loader}
  //   transparent
  //   presentationStyle='overFullScreen'
  //   >
  //     <View style={{flex:1 , alignItems:'center' , justifyContent:'center' , backgroundColor:'#0003'}}>
  //     <View style={{  width: "20%", height: "20%", }}>
  //             <LottieView source={this.props.color == "white" ? Images.LoaderJson : Images.LoaderJson} autoPlay loop />
  //           </View>
  //     </View>
  //   </Modal>

    return (
      <Modal
        visible={this.state.loader}
        transparent
        presentationStyle="overFullScreen"
        statusBarTranslucent>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0003',
          }}>
          <View style={{width: '40%', height: '40%'}}>
            <LottieView
              source={
                this.props.color == 'white'
                  ? Images.LoaderJson
                  : Images.LoaderJson
              }
              autoPlay
              loop
            />
          </View>
        </View>
      </Modal>
    );

    // return (
    //   <View style={[{ width: Dimensions.get("window").width, height: Dimensions.get("window").height, alignItems: "center", justifyContent: "center", position: "absolute", },this.props.customheight]}>

    //     <View style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height, alignItems: "center", justifyContent: "center", position: "absolute", opacity: 0.4, backgroundColor: "#000", position: "absolute" }}></View>

    //     {this.props.smallLoader ?
    //       <View style={{ width: "20%", height: "20%", bottom: 100 }}>
    //         <LottieView source={this.props.color == "white" ? Images.LoaderJson : Images.LoaderJson} autoPlay loop />
    //       </View>
    //       :
    //       <View style={{ width: "50%", height: "30%", justifyContent: 'center', alignItems: 'center', bottom: 0 }}>
    //         <View style={{ width: "66%", height: "35%", }}>
    //           <LottieView source={this.props.color == "white" ? Images.LoaderJson : Images.LoaderJson} autoPlay loop />
    //         </View>
    //         <Text style={{ color: Colors.White, fontFamily: Fonts.regular, fontSize: 12, position: 'absolute', bottom: 40, width: 172, textAlign: 'center' }}>{this.props.text}</Text>
    //       </View>
    //     }
    //   </View>
    // );
  }
}
