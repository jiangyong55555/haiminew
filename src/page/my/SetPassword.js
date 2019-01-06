import React from 'react';
import {Dimensions, StyleSheet, View} from "react-native";
import NavigationHeader from "../../navigator/NavigationHeader";
import {Input, withTheme} from "react-native-elements";

import {setPasswordMenue} from '../../model/MenuModel';

/**
 * 设置密码
 * @param navigation
 * @param theme
 * @returns {*}
 * @constructor
 */
const SetPassword = ({navigation,theme}) => {
    return(
        <View style={styles.container}>
            <NavigationHeader
                back={navigation}
                right={'determine'}
                title={navigation.getParam('displayName')}
            />
            <View style={styles.inputContainerStyle}>
                {
                    setPasswordMenue.map((item,i) => (
                        <Input
                            key={i}
                            placeholder={item.title}
                            defaultValue={ (i===0) ? '账号: BASIC INPUT' : ''}
                            editable={(i===0) ? false : true}
                            inputStyle={{fontSize:14}}
                            inputContainerStyle={{borderColor:theme.colors.greyOutline,...styles.input}}
                            shake
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
        backgroundColor: 'white'
    },
    inputContainerStyle:{
        alignItems: 'center',
        marginTop:20,
        width:Dimensions.get('window').width
    },
    input:{
        marginTop:5,
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});

export default withTheme(SetPassword);
