import React,{PureComponent} from 'react';
import NavigationHeader from "../../navigator/NavigationHeader";
import ContactItem from "../../common/ContactItem";
import {AsyncStorage, FlatList, NativeAppEventEmitter, View} from "react-native";
import {withTheme} from 'react-native-elements';
import ContactFoot from "../../common/ContactFoot";
import { NimTeam } from 'react-native-netease-im'

/**
 * 群聊列表页面
 */
class GroupChatList extends PureComponent{
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
    }

    componentWillMount() {
        NimTeam.startTeamList();
    }

    /**
     * 初始化数据
     */
    componentDidMount() {
        NimTeam.getTeamList('').then(data=>{
            this.setState({
                dataSource: data
            });
        });
        this.teamListener = NativeAppEventEmitter.addListener(
            'observeTeam',
            data => {
                this.setState({
                    dataSource: data
                })
            }
        )
    }

    /**
     * 删除监听
     */
    componentWillUnmount() {
        NimTeam.stopTeamList();
        this.teamListener && this.teamListener.remove();
    }

    /**
     * 最终视图
     * @returns {*}
     */
    render(){
        let {navigation,theme} = this.props;
        let {dataSource} = this.state;
        let len = dataSource.length-1;
        dataSource.map((v,i)=>{
            dataSource[i].sessionType = '1';
            dataSource[i].contactId = v.teamId;
        });
        return(
            <View style={{flex: 1,backgroundColor:theme.colors.paper}}>
                <NavigationHeader
                    back={navigation}
                    title={navigation.getParam('item').name}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.teamId}
                    initialNumToRender={13}
                    data={dataSource}
                    ListFooterComponent={
                        <ContactFoot
                            statistics={(len+1)+'个群聊'}
                        />
                    }
                    renderItem={({item,index}) => (
                        <ContactItem
                            item={item}
                            gopage={'MainChatRoom'}
                            bottomDivider={!(len===index)}
                        />
                    )}
                />
            </View>
        )
    }
}

export default withTheme(GroupChatList);
