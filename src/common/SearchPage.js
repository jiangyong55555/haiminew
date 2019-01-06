import React,{PureComponent} from 'react';
import {SearchBar, withTheme} from 'react-native-elements';
import NavigationUtil from '../navigator/NavigationUtil';
import Toast from "react-native-root-toast";
import Utils from '../util/Utils';

class SearchPage extends PureComponent{

    state = {
        Loading: false
    };

    setLoading = () => {
        this.setState({
            Loading: !this.state.Loading
        })
    };

    search = () => {
        this.setLoading();
        if(!this.text){
            this.setLoading();
            Toast.show('不能为空');
            return;
        }
        nim.getUser({
            account: this.text,
            done: (error, user) => {
                this.setLoading();
                if(!error){
                    if(!user){
                        Toast.show('没有此用户');
                    }else {
                        user.status='refuse';
                        const utils = new Utils;
                        utils.checkContact(user).then(judge => {
                            if(judge) (user.status='accept');
                            NavigationUtil.goPage('FriendInfo',{
                                item:user
                            })
                        });
                    }
                }else {
                    Toast.show(error.message);
                }
            }
        })
    };

    render(){
        const {navigation,theme} = this.props;
        return(
            <SearchBar
                showLoading={this.state.Loading}
                autoFocus={true}
                clearIcon={{name: 'close'}}
                placeholderTextColor={theme.colors.grey4}
                inputStyle={{marginTop: 6,fontSize:14}}
                platform="android"
                placeholder='搜索'
                onChangeText={text => this.text = text}
                maxLength={24}
                onSubmitEditing={() => this.search()}
                onCancel={
                    () => NavigationUtil.goBack(navigation)
                }
            />
        )
    }
}

export default withTheme(SearchPage);
