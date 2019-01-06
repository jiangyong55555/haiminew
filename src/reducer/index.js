import {combineReducers} from 'redux';
import chatlist from './chatlist';
import contactlist from './contactlist';
import groupchatlist from './groupchatlist';
import newfriendlist from './newfriendlist';
import groupmember from './groupmember';
import myinfo from './myinfo';

const index = combineReducers({
    chatlist,
    contactlist,
    groupchatlist,
    newfriendlist,
    groupmember,
    myinfo
});

export default index;
