import React, {PureComponent} from 'react';
import {View, FlatList, NativeAppEventEmitter, AsyncStorage} from 'react-native';
import {withTheme,ListItem,Text,Icon} from 'react-native-elements';

import NavigationHeader from '../../navigator/NavigationHeader';
import ContactItem from '../../common/ContactItem';
import SplashScreen from "react-native-splash-screen";

/**
 * 会话列表
 */
class ChatListScreen extends PureComponent {
    /**
     * 初始化数据
     * @param props
     */
    constructor(props){
        super(props);
        this.state = {
            ListHeaderHide: true,
            dataSource: []
        }
    }

    /**
     * 挂载页面前
     */
    componentDidMount() {
        SplashScreen.hide();
        AsyncStorage.getItem('session'+globalAccount,(error,result) => {
            if(!error){
                if(result){
                    this.setState({
                        dataSource: JSON.parse(result).recents
                    });
                }
            }
        });
        this.sessionListener = NativeAppEventEmitter.addListener(
            'observeRecentContact',
            data => {
                AsyncStorage.setItem('session'+globalAccount,JSON.stringify(data));
                this.setState({
                    dataSource: data.recents
                });
            }
        )
    }

    /**
     * 卸载页面
     */
    componentWillUnmount() {
        this.sessionListener && this.sessionListener.remove();
    }

    /**
     * 网络发生变化时
     * @param isConnected
     */
    handleFirstConnectivityChange = (isConnected) => {
        this.setState({
            ListHeaderHide: isConnected
        });
    };

    /**
     * 头部组件
     * @returns {*}
     * @constructor
     */
    ListHeaderComponent(){
        let {ListHeaderHide} = this.state;
        return !ListHeaderHide && (
            <ListItem
                title={'当前网络不可用,请检测网络设置'}
                titleStyle={{
                    marginTop: 12,
                    fontSize: 14
                }}
                containerStyle={{
                    backgroundColor: 'pink',
                    height: 40
                }}
                leftIcon={{
                    name:'md-alert',
                    type:'ionicon',
                    color:'red'
                }}
            />
        )
    }
    /**
     * 返回视图
     * @returns {*}
     */
    render() {
        let {theme} = this.props;
        let {dataSource} = this.state;
        dataSource.map((v,i)=>{
            dataSource[i].avatar = v.imagePath
        });
        let len = dataSource.length-1;
        return (
            <View style={{flex: 1,backgroundColor:theme.colors.paper}}>
                <NavigationHeader
                    right={'more'}
                    title={'消息'}
                />
                {
                    len < 0 ? (
                        <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
                            <Icon
                                color={theme.colors.secondary}
                                size={100}
                                type={'ionicon'}
                                name={'logo-snapchat'}
                            />
                            <Text style={{marginTop: 15,fontSize: 14}}>
                                还没有会话，去通讯录找人聊聊吧！
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item.contactId}
                            data={dataSource}
                            ListHeaderComponent={this.ListHeaderComponent()}
                            renderItem={({item,index}) => (
                                <ContactItem
                                    item={item}
                                    gopage={'MainChatRoom'}
                                    bottomDivider={!(len===index)}
                                />
                            )}
                        />
                    )
                }
            </View>
        );
    }
}

export default withTheme(ChatListScreen);
