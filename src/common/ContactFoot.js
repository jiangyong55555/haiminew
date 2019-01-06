import React from "react";
import {Text, View, StyleSheet} from "react-native";

/**
 * 联系人底部组件
 * @param statistics
 * @returns {*}
 */
export default({statistics}) => (
    <View style={styles.footerComponent}>
        <Text style={{fontSize:16}}>{statistics}</Text>
    </View>
)

const styles = StyleSheet.create({
    footerComponent: {
        height:55,
        alignItems:'center',
        justifyContent: 'center'
    }
});
