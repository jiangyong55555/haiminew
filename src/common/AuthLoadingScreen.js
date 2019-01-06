import React from 'react';
import {
    View
} from 'react-native';

import DataStore from '../expand/dao/DataStore';
import {connect} from 'react-redux';
import actions from "../action";
import NimSession from "react-native-netease-im/im/Session";

class AuthLoadingScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    componentDidMount() {
        this.props.onLoadMyinfo();
    }

    _bootstrapAsync = async () => {
        const userToken = await DataStore.fetchLocalData('token');
        if(userToken){
            const data = userToken.data;
            NimSession.login(data.contactId,data.token);
            global.globalAccount = data.contactId;
        }
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };

    render() {
        return (
            <View/>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    onLoadMyinfo(){
        dispatch(actions.onLoadMyinfo());
    }
});

export default connect(null,mapDispatchToProps)(AuthLoadingScreen);
