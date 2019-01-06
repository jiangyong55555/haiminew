import React,{PureComponent} from 'react';
import {FlatList, View, Text, StyleSheet, Dimensions, Switch, TouchableOpacity} from "react-native";
import {withTheme,Avatar,Divider,ListItem,Button} from 'react-native-elements';
import { NimTeam } from 'react-native-netease-im'

import NavigationHeader from "../../navigator/NavigationHeader";
import NavigationUtil from "../../navigator/NavigationUtil";

/**
 * 返回列表项
 * @param item
 * @param index
 * @returns {*}
 */
const renderItem = ({item,index},len) => {
    let config = item.avatar ? {source:{uri:item.avatar}} : {title:item.name&&item.name[0]};
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
        <View style={{alignItems:'center',marginLeft: 8.5,marginRight: 8.5,width:width/5-25}}>
            <Avatar
                size={width/5-25}
                rounded={false}
                {...config}
            />
            <Text numberOfLines={1} style={{fontSize:13,marginTop: 5}}>
                {item.name&&item.name}
            </Text>
        </View>
    )
};

/**
 * 返回尾部组件
 * @param colors
 * @returns {*}
 * @constructor
 */
const ListFooterComponent = (colors,item,len,teamInfo) => {
    let width = Dimensions.get('window').width;
    const groupInfoMenu = [
        {displayName:'群名称',rightTitle:teamInfo.name},
        {displayName:'群公告',rightTitle:teamInfo.introduce},
        {displayName:'群二维码',rightIcon:'qrcode'},
        {displayName:'消息免打扰',switch:true},
        ...(teamInfo.creator === globalAccount ? [
            {displayName:'全员禁言',switch:true},
        ]:[])
    ];
    return(
        <View style={{alignItems:'center'}}>
            <View style={{marginTop: 15,marginBottom: 15}}>
                {
                    len >= 50 && (
                        <TouchableOpacity
                            onPress={() => NavigationUtil.goPage('AllMember',{item:item})}
                        >
                            <Text style={{fontSize:16}}>
                                查看全部群成员
                            </Text>
                        </TouchableOpacity>
                    )
                }
            </View>
            <View style={{ width:width}}>
                <Divider style={{height: 15,backgroundColor: colors.paper }} />
                {
                    groupInfoMenu.map((v,i,list) => {
                        return(
                            <ListItem
                                key={i}
                                title={v.displayName}
                                rightTitle={v.rightTitle && v.rightTitle}
                                rightTitleStyle={{fontSize: 14}}
                                switch={v.switch && <Switch/>}
                                bottomDivider={(list.length-1)>i && true}
                                containerStyle={{height:48}}
                                rightIcon={v.rightIcon&&{
                                    name:v.rightIcon,
                                    type:'font-awesome',
                                    size:20
                                }}
                                onPress={() => {
                                    if(i===0){
                                        NavigationUtil.goPage(
                                            'ModifyPage',
                                            {item:{...v,...item}}
                                        );
                                    }
                                    if(i===2){
                                        NavigationUtil.goPage(
                                            'QrCodePage',
                                            {item:{...v,...item}}
                                        );
                                    }
                                }}
                            />
                        )
                    })
                }
                <Divider style={{height: 40,backgroundColor: colors.paper }} />
                <View style={{alignItems:'center',backgroundColor: colors.paper}}>
                    <Button
                        buttonStyle={{
                            backgroundColor:colors.error,
                            width: width*0.95,
                            height: 48
                        }}
                        title={'删除并退出'}
                    />
                </View>
            </View>
        </View>
    )
};

/**
 * 群聊详情
 * @param navigation
 * @param groupchatlist
 * @param theme
 * @returns {*}
 * @constructor
 */
class GroupInfo extends PureComponent{

    constructor(props) {
        super(props);
        this.state = {
            teamInfo: {},
            members: [],
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        const session = navigation.getParam('item');
        NimTeam.getTeamInfo(session.contactId).then(data => {
            this.setState({
                teamInfo: data,
            })
        });
        NimTeam.fetchTeamMemberList(session.contactId).then(data => {
            this.setState({
                members: data,
            });
        })
    }

    render(){
        let {navigation,theme} = this.props;
        let {members,teamInfo} = this.state;
        members.push({});
        let len = members.length;
        return(
            <View style={{flex: 1,backgroundColor:theme.colors.paper}}>
                <NavigationHeader
                    back={navigation}
                    title={'群聊信息'}
                />
                <FlatList
                    data={members}
                    numColumns={5}
                    contentContainerStyle={{backgroundColor:'#fff'}}
                    renderItem={(item) => renderItem(item,len)}
                    columnWrapperStyle={styles.columnWrapperStyle}
                    ListFooterComponent={ListFooterComponent(theme.colors,navigation.getParam('item'),len,teamInfo)}
                    keyExtractor={item => item.contactId}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    columnWrapperStyle:{
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    }
});

export default withTheme(GroupInfo);
