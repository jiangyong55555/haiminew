import React from 'react';
import {StyleSheet, View, Switch, Dimensions} from "react-native";
import NavigationHeader from "../../navigator/NavigationHeader";
import {ListItem, withTheme} from "react-native-elements";

import {settingMenue} from '../../model/MenuModel';

/**
 * 设置页面
 * @param navigation
 * @param theme
 * @returns {*}
 * @constructor
 */
const Setting = ({navigation,theme}) => {
    return(
        <View style={[styles.container,{backgroundColor:theme.colors.paper}]}>
            <NavigationHeader
                back={navigation}
                title={navigation.getParam('displayName')}
            />
            <View style={{width:Dimensions.get('window').width,marginTop: 20}}>
                {
                    settingMenue.map((item,i,list) => (
                        <ListItem
                            key={i}
                            title={item.title}
                            bottomDivider={(i === (list.length-1)) ? false : true}
                            containerStyle={{height:48}}
                            switch={<Switch/>}
                        />
                    ))
                }
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
    }
});

export default withTheme(Setting);
