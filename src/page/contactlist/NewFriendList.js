import React,{PureComponent} from 'react';
import NavigationHeader from "../../navigator/NavigationHeader";
import ContactItem from "../../common/ContactItem";
import {FlatList,View} from "react-native";
import {connect} from "react-redux";
import {withTheme,Button,ListItem,Text} from 'react-native-elements';
import NavigationUtil from "../../navigator/NavigationUtil";
import actions from "../../action";
import Loading from "../../common/Loading";

/**
 * 新的朋友列表
 * @param navigation
 * @param newfriendlist
 * @param theme
 * @returns {*}
 * @constructor
 */
class GroupChatList extends PureComponent{
    componentDidMount() {
        let {onLoadNewFriend} = this.props;
        onLoadNewFriend();
    }

    /**
     * 返回接受按钮
     * @param item
     * @param index
     * @returns {boolean|*}
     */
    getButton = (item,index) => {
        let {reviewNewFriend,addContact,myinfo,theme} = this.props;
        return (
            <View>
                {
                    item.status === "unreviewed" ? (
                        <Button
                            title={'接受'}
                            onPress={
                                () => {
                                    item.status = 'accept';
                                    reviewNewFriend(item,index,myinfo,this.refs.loading,() => {
                                        addContact(item);
                                        NavigationUtil.goPage('FriendInfo',{
                                            item:item
                                        })
                                    });
                                }
                            }
                            buttonStyle={{
                                backgroundColor:theme.colors.secondary,
                                height:25,
                                width:50
                            }}
                            titleStyle={{
                                fontSize:14
                            }}
                        />
                    ) : (
                        <Text key={index} style={{fontSize:14}}>{(item.status==='refuse') ? '已拒绝' : '已通过'}</Text>
                    )
                }
            </View>
        )
    };

    /**
     * 返回头部组件
     * @param colors
     * @returns {*}
     * @constructor
     */
    ListHeaderComponent = ({colors}) => (
        <View style={{marginBottom: 15,marginTop:20}}>
            <ListItem
                title={'搜索嗨米群号'}
                titleStyle={{
                    color:colors.grey3,
                    marginTop:5,
                    fontSize:14
                }}
                containerStyle={{
                    height: 48
                }}
                leftIcon={{
                    name: 'search',
                    color: colors.grey3,
                }}
                onPress={
                    () => NavigationUtil.goPage('SearchPage',{
                        title:'添加好友'
                    })
                }
            />
        </View>
    );

    render(){
        let {navigation,newfriendlist,theme} = this.props;
        let {dataSource} = newfriendlist;
        let len = dataSource.length-1;
        return(
            <View style={{flex: 1,backgroundColor:theme.colors.paper}}>
                <NavigationHeader
                    back={navigation}
                    title={navigation.getParam('item').nick}
                />
                <Loading ref={'loading'}/>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={dataSource}
                    ListHeaderComponent={this.ListHeaderComponent(theme)}
                    renderItem={({item,index}) => {
                        return(
                            <ContactItem
                                item={item}
                                index={index}
                                gopage={'FriendInfo'}
                                rightElement={this.getButton(item,index)}
                                bottomDivider={!(len === index)}
                            />
                        )
                    }}
                />
            </View>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    onLoadNewFriend(){
        dispatch(actions.onLoadNewFriend());
    },
    reviewNewFriend(data,index,myinfo,loading,cheback){
        dispatch(actions.reviewNewFriend(data,index,myinfo,loading,cheback));
    },
    addContact(data){
        dispatch(actions.addContact(data));
    }
});

const mapStateToProps = (state) => ({
    newfriendlist: state.newfriendlist,
    myinfo: state.myinfo.myinfo
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(GroupChatList));
