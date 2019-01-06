import React from 'react';
import {FlatList, View, Text, StyleSheet, Dimensions} from "react-native";
import {connect} from "react-redux";
import {withTheme, Avatar, Input} from 'react-native-elements';

import NavigationHeader from "../../navigator/NavigationHeader";

/**
 * 返回列表项
 * @param item
 * @param index
 * @returns {*}
 */
const renderItem = ({item,index},len) => {
    let config = item.avatar ? {source:{uri:item.avatar}} : {title:item.nick&&item.nick[0]};
    let width = Dimensions.get('window').width;
    if(len-1 === index){
        config = {
            icon:{
                name: 'add',
                size: 40
            }
        }
    }
    return(
        <View style={{alignItems:'center',marginLeft: 10,marginRight: 10}}>
            <Avatar
                size={width/5-30}
                rounded={false}
                {...config}
            />
            <Text style={{fontSize:14,marginTop: 5}}>
                {item.nick&&item.nick}
            </Text>
        </View>
    )
};

/**
 * 返回了表现key
 * @param item
 * @param index
 * @returns {string}
 * @private
 */
const _keyExtractor = (item, index) => index.toString();

/**
 * 群聊详情
 * @param navigation
 * @param groupchatlist
 * @param theme
 * @returns {*}
 * @constructor
 */
const AllMemcer = ({navigation,groupmember,theme}) => {
    let {teamId} = navigation.getParam('item');
    let {dataSource} = groupmember;
    let newDataSource = dataSource[teamId] ? dataSource[teamId] : [];
    newDataSource.push({});
    let len = newDataSource.length;
    return(
        <View style={{flex: 1,backgroundColor:theme.colors.paper}}>
            <NavigationHeader
                back={navigation}
                title={'全部成员'}
            />
            <Input
                placeholder={'搜索成员'}
                inputStyle={{fontSize:14}}
                leftIcon={{
                    name: 'search',
                    color: theme.colors.grey3
                }}
                inputContainerStyle={{borderColor:theme.colors.greyOutline,...styles.input}}
                shake
            />
            <FlatList
                data={newDataSource}
                numColumns={5}
                contentContainerStyle={{
                    flex:1,
                    backgroundColor:'#fff',
                }}
                renderItem={(item) => renderItem(item,len)}
                columnWrapperStyle={styles.columnWrapperStyle}
                keyExtractor={(item, index) => _keyExtractor(item, index)}
            />
        </View>
    )
};

const mapStateToProps = (state) => ({
    groupmember: state.groupmember
});

const styles = StyleSheet.create({
    columnWrapperStyle:{
        marginTop: 15,
        marginLeft: 25,
        marginRight: 25
    },
    input:{
        borderBottomWidth: 0.5,
        width: Dimensions.get('window').width,
        height:45,
        backgroundColor:'#fff'
    }
});

export default connect(mapStateToProps)(withTheme(AllMemcer));
