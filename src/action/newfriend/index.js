import NewFriendDao from "../../expand/dao/NewFriendDao";
import Types from '../types';
import Toast from "react-native-root-toast";
import Utils from '../../util/Utils';

const onLoadNewFriendAction = (newfriends) => ({
    type: Types.ONLOAD_NEW_FRIEND,
    newfriends: newfriends
});

/**
 * 加载数据
 * @returns {Function}
 */
export const onLoadNewFriend = () => {
    return (dispatch) => {
        const newFriendDao = new NewFriendDao();
        newFriendDao.getAllItems().then((data) => {
            dispatch(onLoadNewFriendAction(data));
        })
    }
};

const addNewFriendAction = (newfriend) => ({
    type: Types.ADD_NEW_FRIEND,
    newfriend: newfriend
});

/**
 * 添加数据
 * @returns {Function}
 */
export const addNewFriend = (newfriend) => {
    return (dispatch) => {
        const utils = new Utils;
        utils.checkNewUser(newfriend).then(judge=>{
            if(!judge){
                const newFriendDao = new NewFriendDao();
                newFriendDao.saveFavoriteItem(newfriend);
                dispatch(addNewFriendAction(newfriend));
            }
        });
    }
};

const reviewNewFriendAction = (newfriend,index) => ({
    type: Types.REVIEW_NEW_FRIEND,
    newfriend: newfriend,
    index
});

/**
 * 审核修改数据
 * @returns {Function}
 */
export const reviewNewFriend = (data,index,myinfo,loading,cheback) => {
    return (dispatch) => {
        loading.show();
        let request = {
            idServer: data.idServer,
            account: data.account,
            ps: JSON.stringify(myinfo),
            done: (error) => {
                if (!error) {
                    const newFriendDao = new NewFriendDao();
                    newFriendDao.saveFavoriteItem(data);
                    cheback();
                    dispatch(reviewNewFriendAction(data, index));
                }else {
                    Toast.show(error.message);
                }
                loading.close();
            }
        };
        if(data.status === 'accept'){
            nim.passFriendApply(request);
        }else {
            nim.rejectFriendApply(request);
        }
    }
};
