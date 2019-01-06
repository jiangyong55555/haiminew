import React,{PureComponent} from 'react';
import NavigationHeader from "../navigator/NavigationHeader";
import ContactItem from "../common/ContactItem";
import {FlatList,View} from "react-native";
import {connect} from "react-redux";
import {withTheme} from 'react-native-elements';
import actions from "../action";
import Toast from "react-native-root-toast";
import NavigationUtil from "../navigator/NavigationUtil";

/**
 * 创建群聊页面
 */
class CreateGroupPage extends PureComponent{
    /**
     * 加载数据
     */
    componentDidMount() {
        this.accounts = [];
        let {onLoadContactList} = this.props;
        onLoadContactList();
    }

    _onPress = (account) => {
        this.accounts.push(account);
    };

    Callback = () =>{
        let {navigation} = this.props;
        nim.createTeam({
            type: 'advanced',
            name: '高级群9999',
            accounts: this.accounts,
            joinMode: 'noVerify',
            beInviteMode: 'noVerify',
            done: (error) => {
                if(!error){
                    Toast.show('群聊创建成功');
                    NavigationUtil.goBack(navigation);
                }else {
                    Toast.show(error.message);
                }
            }
        });
    };

    render(){
        let {navigation,contactlist,theme} = this.props;
        let len = contactlist.dataSource.length-1;
        return(
            <View style={{flex: 1,backgroundColor:theme.colors.paper}}>
                <NavigationHeader
                    back={navigation}
                    right={'determine'}
                    Callback={this.Callback}
                    title={navigation.getParam('title')}
                />
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={contactlist.dataSource}
                    renderItem={({item,index}) => (
                        <ContactItem
                            item={item}
                            onPress={this._onPress}
                            checkbox={true}
                            bottomDivider={!(len===index)}
                        />
                    )}
                />
            </View>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    onLoadContactList(){
        dispatch(actions.onLoadContactList());
    }
});

const mapStateToProps = (state) => ({
    contactlist: state.contactlist
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(CreateGroupPage));
