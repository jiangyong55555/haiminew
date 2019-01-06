import React,{PureComponent} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {withTheme, Header, Icon, Text, Input, Button} from 'react-native-elements';
import Toast from 'react-native-root-toast';
import {connect} from 'react-redux';
import { NimSession,NimFriend } from 'react-native-netease-im';

import NavigationUtil from '../../navigator/NavigationUtil';
import {loginMenu,regMenu} from '../../model/MenuModel';
import DataStore from '../../expand/dao/DataStore';
import Loading from '../../common/Loading';
import actions from "../../action";

/**
 * 头部
 * @param navigation
 * @returns {*}
 * @constructor
 */
const NavigationHeader = ({navigation}) => {
    let leftComponent = (
        <TouchableOpacity
            onPress={
                () => NavigationUtil.goBack(navigation)
            }
        >
            <Icon
                name={'close'}
                size={28}
            />
        </TouchableOpacity>
    );
    return(
        <Header
            statusBarProps={{
                backgroundColor: '#fff'
            }}
            containerStyle={{
                backgroundColor: '#fff',
                borderBottomWidth: 0
            }}
            leftComponent={leftComponent}
        />
    )
};

/**
 * 注册登录页面
 * @param navigation
 * @returns {*}
 * @constructor
 */
class RegLogin extends PureComponent{
    /**
     * 初始化数据
     * @param props
     */
    constructor(props){
        super(props);
        this.formData = {};
    }

    /**
     * 保存个人信息
     * @param account
     */
    saveMyInfo = (account,token) => {
        let {onLoadMyinfo} = this.props;
        NimFriend.fetchUserInfo(account).then(
            myInfo => {
                console.log(myInfo);
                onLoadMyinfo(myInfo);
                DataStore.saveData('token',{token:token,contactId:myInfo.contactId});
                this.refs.loading.close();
                this.props.navigation.navigate('App');
            },
            err => {
                this._abnormal(err);
            }
        )
    };

    /**
     * 登陆方法
     */
    login(){
        this.refs.loading.show();
        const formData = this.formData;
        DataStore.fetchData('login',formData).then((res) => {
            const contactId = 'userid'+res.data.id;
            global.globalAccount = contactId;
            const token = res.data.token;
            NimSession.login(contactId,token).then(
                account => {
                    this.saveMyInfo(account,token);
                },
                err => {
                    this._abnormal(err);
                }
            )
        })
    }

    /**
     * 抛出异常
     * @param info
     * @private
     */
    _abnormal(info){
        this.refs.loading.close();
        Toast.show(info);
    }

    /**
     * 验证
     * @param list
     */
    verification(list){
        for(let i = 0; i<list.length; i++){
            if(!this.formData[list[i].name]){
                Toast.show(list[i].displayName+'不能为空');
                return;
            }
        }
        this.login();
    }

    /**
     * 渲染页面
     * @returns {*}
     */
    render(){
        let {navigation,theme} = this.props;
        let type = navigation.getParam('type');
        let list = (type === 'login') ? loginMenu:regMenu;
        return(
            <View style={{flex: 1}}>
                <NavigationHeader
                    navigation={navigation}
                />
                <Loading ref={'loading'}/>
                <Text
                    style={styles.title}
                >
                    {type === 'login' ? '登录嗨米':'注册嗨米'}
                </Text>
                <View
                    style={styles.container}
                >
                    {
                        list.map((v,i) => (
                            <Input
                                key={i}
                                onChangeText={(text) => this.formData[v.name] = text}
                                secureTextEntry={v.name === 'password' && true}
                                placeholder={'请输入'+v.displayName}
                                maxLength={36}
                                leftIcon={
                                    <Text style={{
                                        color:'#000',
                                        fontSize:16
                                    }}>{v.displayName}</Text>
                                }
                                inputContainerStyle={{
                                    ...styles.input,
                                    borderColor:theme.colors.greyOutline,
                                }}
                                inputStyle={{
                                    fontSize:14,
                                    color:theme.colors.grey3
                                }}
                            />
                        ))
                    }
                    <Button
                        title={type === 'login' ? '登录':'注册'}
                        buttonStyle={{
                            ...styles.btn,
                            backgroundColor:theme.colors.secondary
                        }}
                        onPress={
                            () => this.verification(list)
                        }
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        marginTop: 40
    },
    title:{
        color:'#000',
        fontSize:28,
        paddingLeft:30,
        marginTop:20
    },
    input:{
        marginTop:10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    btn:{
        height:48,
        marginTop:60,
        width:Dimensions.get('window').width*0.95,
    }
});

const mapDispatchToProps = (dispatch) => ({
    onLoadMyinfo(myinfo){
        dispatch(actions.onLoadMyinfo(myinfo));
    }
});

export default connect(null,mapDispatchToProps)(withTheme(RegLogin));
