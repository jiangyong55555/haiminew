import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import { Avatar,ListItem,withTheme } from 'react-native-elements';

import NavigationHeader from '../../navigator/NavigationHeader';
import {aboutMenue} from '../../model/MenuModel';

/**
 * 关于我们
 * @param navigation
 * @returns {*}
 */
const About = ({navigation,theme}) => {
    return(
        <View style={[styles.container,{backgroundColor:theme.colors.paper}]}>
            <NavigationHeader
                back={navigation}
                title={navigation.getParam('displayName')}
            />
            <Avatar
                rounded
                size={'large'}
                source={require('../../images/my/logo.jpg')}
                containerStyle={styles.logo}
            />
            <Text style={{marginTop:10}}>嗨米1.0.0</Text>
            <View style={{width:Dimensions.get('window').width,marginTop: 30}}>
                {
                    aboutMenue.map((item,i,list) => (
                        <ListItem
                            key={i}
                            title={item.title}
                            titleStyle={{marginTop:10}}
                            bottomDivider={(i === (list.length-1)) ? false : true}
                            containerStyle={{height:48}}
                        />
                    ))
                }
            </View>
            <View style={styles.text}>
                <Text style={{fontSize:12}}>嗨米公司 版权所有</Text>
                <Text style={{fontSize:12}}>Copyight @ 2011-2018 Haimi</Text>
                <Text style={{fontSize:12}}>All Rights Reserved</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
    },
    logo:{
        marginTop: 20,
    },
    text:{
        position: 'absolute',
        bottom: 15,
        alignItems: 'center'
    }
});

export default withTheme(About);
