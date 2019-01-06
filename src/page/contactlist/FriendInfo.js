import React, {PureComponent} from 'react';
import {View, Switch, Dimensions, StyleSheet} from 'react-native';
import {ListItem, withTheme, Button, Text} from "react-native-elements";

import NavigationHeader from '../../navigator/NavigationHeader';
import NavigationUtil from "../../navigator/NavigationUtil";
import actions from "../../action";
import {connect} from "react-redux";
import Toast from "react-native-root-toast";
import Loading from "../../common/Loading";
import {NimFriend} from "react-native-netease-im";

/**
 * 好友详情
 */
class FriendInfo extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            userInfo: props.navigation.getParam('item'),
        }
    }

    /**
     * 加载用户信息
     */
    componentDidMount(){
        NimFriend.getUserInfo(this.state.userInfo.contactId).then(
            userInfo => {
                this.setState({
                    userInfo: userInfo
                });
            }
        );
    }

    /**
     * 列表项视图
     * @returns {any[]}
     * @constructor
     */
    renderItem = () => {
        const {userInfo} = this.state;
        const friendInfoMenu = [
            {displayName:userInfo.name,subtitle:'账号：'+userInfo.contactId,avatarPath:userInfo.avatar && {uri:userInfo.avatar}},
            ...(userInfo.contactId !== globalAccount) ? [
                {displayName:'个性签名',rightTitle:userInfo.signature && userInfo.signature},
                (userInfo.status === 'accept' || !userInfo.status) ? { displayName:'接收信息',switch:true} : (userInfo.idServer && {displayName:'留言',rightTitle:userInfo.leave && userInfo.leave})
            ] : []
        ];
        return friendInfoMenu.map((item,i) => {
            if(item){
                let config = {
                    title: item.displayName,
                    containerStyle: {height: (item.subtitle ? 81 : 48)},
                    subtitle: item.subtitle && item.subtitle,
                    rightElement:<Text style={{fontSize:14}} numberOfLines={1}>{item.rightTitle && item.rightTitle}</Text>,
                    bottomDivider: (i===1) ? true : false,
                    switch: item.switch && <Switch/>
                };
                item.subtitle && (config.leftAvatar = {
                    [item.avatarPath ? 'source' : 'title']:item.avatarPath ? item.avatarPath : item.displayName[0],
                    avatarStyle: item.avatarPath && {backgroundColor:'#fff'},
                    size: 63,
                    rounded: false,
                });
                return(
                    <View
                        key={i}
                        style={(i===0||i===1) && {marginTop: 20}}
                    >
                        <ListItem
                            {...config}
                        />
                    </View>
                )
            }
        })
    };

    /**
     * 返回按钮
     * @returns {*}
     */
    renderButton = () => {
        let {reviewNewFriend,addContact,navigation,theme,myinfo} = this.props;
        const item = this.state.userInfo;
        const index = navigation.getParam('index');
        const statusData = {
            unreviewed : [{
                title: '接受',
                onPress: () => {
                    item.status = 'accept';
                    reviewNewFriend(item,index,myinfo,this.refs.loading,() => {
                        addContact(item);
                        NavigationUtil.goPage('FriendInfo',{
                            item:item
                        })
                    })
                }
            },{
                title: '拒绝',
                onPress: () => {
                    item.status = 'refuse';
                    reviewNewFriend(item,index,myinfo,this.refs.loading,() => {
                        NavigationUtil.goPage('FriendInfo',{
                            item:item
                        })
                    })
                },
                style:{
                    backgroundColor:theme.colors.error,
                    marginTop:10
                }
            }],
            accept : [{
                title: '发送信息',
                onPress: () => {
                    NavigationUtil.goPage('MainChatRoom',{
                        item:{
                            ...item,
                            sessionType: '0'
                        }
                    })
                }
            }],
            refuse : [{
                title: '申请加为好友',
                onPress: () => {
                    this.refs.loading.show();
                    nim.applyFriend({
                        account: item.account,
                        ps: JSON.stringify(myinfo),
                        done: (error) => {
                            if(!error){
                                Toast.show('请求发送成功');
                            }
                            this.refs.loading.close();
                        }
                    });
                }
            }]
        };
        let data = item.status ? statusData[item.status] : statusData['accept'];
        (item.account === globalAccount) && (data = []);
        return data.map((v,i) => (
            <Button
                key={i}
                title={v.title}
                onPress={v.onPress}
                buttonStyle={{
                    ...styles.buttonStyle,
                    backgroundColor: theme.colors.secondary,
                    ...v.style
                }}
            />
        ))
    };

    /**
     * 返回视图
     * @returns {*}
     */
    render() {
        let {theme,navigation} = this.props;
        return (
            <View style={{flex: 1,alignItems: 'center',backgroundColor:theme.colors.paper}}>
                <NavigationHeader
                    back={navigation}
                    title={'详细资料'}
                />
                <Loading ref={'loading'}/>
                <View style={{width: Dimensions.get('window').width}}>
                    {this.renderItem(navigation)}
                </View>
                {this.renderButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle:{
        marginTop: 50,
        width: Dimensions.get('window').width*0.95,
        height: 48,
    }
});

const mapDispatchToProps = (dispatch) => ({
    reviewNewFriend(data,index,myinfo,loading,cheback){
        dispatch(actions.reviewNewFriend(data,index,myinfo,loading,cheback));
    },
    addContact(data){
        dispatch(actions.addContact(data));
    }
});

const mapStateToProps = (state) => ({
    myinfo: state.myinfo.myinfo
});


export default connect(mapStateToProps,mapDispatchToProps)(withTheme(FriendInfo));
