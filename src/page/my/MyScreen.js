import React, {PureComponent} from 'react';
import {View,AsyncStorage,Alert} from 'react-native';
import {ListItem, withTheme} from "react-native-elements";
import {connect} from 'react-redux';
import { NimSession } from 'react-native-netease-im'

import NavigationHeader from '../../navigator/NavigationHeader';
import {myMenue} from '../../model/MenuModel';
import NavigationUtil from "../../navigator/NavigationUtil";
import DataStore from "../../expand/dao/DataStore";
import Loading from "../../common/Loading";

/**
 * 个人中心列表
 */
class MyScreen extends PureComponent {

    /**
     * 退出登录
     * @param item
     */
    loginout(item){
        NimSession.logout();
        AsyncStorage.removeItem('token');
        this.refs.loading.close();
        NavigationUtil.goPage(item.pageName);
    }

    /**
     * 点击列表项事件
     * @param item
     * @constructor
     */
    ListItemonPress(item){
        if(item.pageName==='SignInScreen'){
            Alert.alert(
                '提示',
                '退出后不会删除任何历史数据，下次登陆依然可以使用本账号。',
                [
                    {text: '取消'},
                    {text: '确认', onPress: () => {
                        this.refs.loading.show();
                        DataStore.fetchData('logout')
                            .then(() => {
                                this.loginout(item);
                            })
                            .catch(() => {
                                this.loginout(item);
                            });
                    }}
                ]
            );
            return;
        }
        NavigationUtil.goPage(item.pageName,item);
    }

    /**
     * 列表项视图
     * @returns {any[]}
     * @constructor
     */
    RenderItem = () => {
        let {myinfo} = this.props.myinfo;
        if (myinfo) {
            myMenue[0] = {
                ...myMenue[0],
                displayName: myinfo.name,
                subtitle: myinfo.contactId,
                avatarPath: (myinfo.avatar.length) > 0 && {uri:myinfo.avatar},
                rightIcon: 'qrcode'
            }
        }
        return myMenue.map((item,i) => {
            let config = {
                title: item.displayName,
                containerStyle: {height: (item.subtitle ? 81 : 48)},
                subtitle: item.subtitle && '账号：'+item.subtitle,
                bottomDivider: ((i===4) || (i===0) || (i===3)) ? false : true,
                onPress: () => this.ListItemonPress(item),
                leftAvatar: {
                    ...(item.avatarPath ? {source:item.avatarPath} : {title:item.displayName[0]}),
                    avatarStyle: item.avatarPath && {backgroundColor:'#fff'},
                    containerStyle:!item.subtitle && {marginLeft:5},
                    size: item.subtitle ? 63 : 24,
                    rounded: false,
                }
            };
            if(!item.subtitle) config.titleStyle = {marginTop:10};
            if(item.rightIcon) config.rightIcon = {name:item.rightIcon,type:'font-awesome',size:22};
            return(
                <View
                    key={i}
                    style={{marginTop: ((i===4) || (i===0) || (i===1)) ? 20 : 0}}
                >
                    <ListItem
                        {...config}
                    />
                </View>
            )
        })
    };

    /**
     * 返回视图
     * @returns {*}
     */
    render() {
        let {theme} = this.props;
        return (
            <View style={{flex: 1,backgroundColor:theme.colors.paper}}>
                <NavigationHeader
                    right={'more'}
                    title={'我的'}
                />
                <Loading ref={'loading'}/>
                {this.RenderItem()}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    myinfo: state.myinfo
});

export default connect(mapStateToProps)(withTheme(MyScreen));
