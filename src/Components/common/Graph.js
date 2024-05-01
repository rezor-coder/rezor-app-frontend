import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View, processColor, SafeAreaView, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { debounce } from "lodash";
import { LineChart } from "react-native-charts-wrapper";
import { LanguageManager } from "../../../ThemeManager";
import Singleton from "../../Singleton";
import { Colors } from "../../theme/";
import colors from "../../theme/Colors";
import fonts from "../../theme/Fonts";
const greenBlue = "rgba(240, 230, 140, 0.2)";
const petrel = "#E4991B";
const List = ["1D", "1W", "1M", "1Y",]

export const Graph = (props) => {
    const [selectedIndx, setselectedIndx] = useState(0)
    // const handler = useCallback(debounce((props.onHoverGraph), 1), []);
    // const handlerFinal = useCallback(debounce((props.onHoverGraph), 300), []);
    const lineRef = useRef(null)
    // //console.warn('MM',"=-=-=-=-=-=-=-=-=-", props.defaultValue)
    return (
        <SafeAreaView style={{ backgroundColor: Colors.headerBg, }}>
            <View style={styles.container}>

                <LineChart ref={lineRef}
                    style={styles.chart}

                    data={{
                        dataSets: [
                            {
                                values: props.graphData,
                                label: "",
                                config: {
                                    mode: "CUBIC_BEZIER",
                                    drawValues: false,
                                    lineWidth: 2,
                                    drawCircles: false,
                                    circleColor: processColor(Colors.fiatPrice),
                                    drawCircleHole: false,
                                    circleRadius: 5,
                                    highlightColor: processColor('transparent'),
                                    color: processColor(Colors.fiatPrice),
                                    drawFilled: true,
                                    fillGradient: {
                                        colors: [processColor(Colors.buttonColor3), processColor('#A73CBE')],

                                        positions: [0, 0],
                                        angle: 0,
                                        orientation: 'TOP_BOTTOM',
                                    },
                                    fillAlpha: 100,
                                    valueTextSize: 15
                                }
                            },
                        ]
                    }}
                    chartDescription={{ text: "" }}

                    legend={{
                        enabled: false,
                        textSize: 8,
                        form: 'CIRCLE',
                        wordWrapEnabled: true,

                    }}
                    marker={{
                        enabled: false,
                        digits: 2,
                        backgroundTint: processColor('transparent'),
                        markerColor: processColor('white'),
                        textColor: processColor(colors.fiatPrice),

                    }}
                    xAxis={{
                        granularityEnabled: true,
                        granularity: 1,
                        valueFormatter: 'date',
                        valueFormatterPattern: 'HH:mm',
                        position: 'BOTTOM',
                        drawGridLines: false,
                        centerAxisLabels: false,
                        enabled: false
                    }}
                    yAxis={{
                        left: {
                            enabled: false
                        },
                        right: {
                            enabled: false,
                            valueFormatter: '# ' + '$',
                        }
                    }}
                    animation={{
                        durationX: 0,
                        durationY: 1500,
                        easingY: "EaseInOutQuart"
                    }}
                    drawGridBackground={false}
                    borderColor={processColor('transparent')}
                    borderWidth={0}
                    drawBorders={true}
                    autoScaleMinMaxEnabled={false}
                    touchEnabled={true}
                    dragEnabled={true}
                    scaleEnabled={false}
                    scaleXEnabled={false}
                    scaleYEnabled={false}
                    pinchZoom={false}
                    doubleTapToZoomEnabled={false}
                    highlightPerTapEnabled={true}
                    highlightPerDragEnabled={true}
                    dragDecelerationEnabled={true}
                    dragDecelerationFrictionCoef={0.99}
                    keepPositionOnRotation={false}
                // onTouchEnd={(event) => {
                //           handlerFinal(props.defaultValue, props.defaultPercent, props.defaultDate)
                // }}
                // onSelect={event => {
                //           handler(Singleton.getInstance().toFixed(event.nativeEvent.data?.y, 3), Singleton.getInstance().toFixed(event.nativeEvent.data?.price_percentage, 2), event.nativeEvent.data?.marker)
                // }}
                />
                {/* <FlatList
                                                  keyExtractor={(item, index) => index + ""}
                                                  data={List}
                                                  horizontal
                                                  contentContainerStyle={{ justifyContent: 'space-evenly', width: '100%', }}
                                                  renderItem={(item, index) => {
                                                            return (
                                                                      <View style={{ height: 30 }}>
                                                                                <TouchableOpacity
                                                                                          style={{ borderRadius: 20, width: 45, paddingVertical: 3, backgroundColor: selectedIndx == item.index ? Colors.fiatPrice : 'transparent', paddingHorizontal: 10 }}
                                                                                          onPress={() => { selectedIndx != item.index && props.onClickgraph(item.item), setselectedIndx(item.index) }}>
                                                                                          <Text style={{ textAlign: 'center', textDecorationLine: 'underline', color: selectedIndx == item.index ? Colors.lightWhite : Colors.fadeDot, fontFamily: fonts.bold }}>{item.item}</Text></TouchableOpacity>
                                                                      </View>
                                                            )
                                                  }}
                                        /> */}
            </View>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: Colors.headerBg,
        height: 200
    },
    chart: {
        backgroundColor: Colors.headerBg,
        height: 160,
        width: '100%'
    }
});

