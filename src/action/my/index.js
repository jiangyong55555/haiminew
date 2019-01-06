import DataStore from "../../expand/dao/DataStore";
import Types from '../types';

const onLoadMyinfoAction = (myinfo) => ({
    type: Types.ONLOAD_MYINFO,
    myinfo: myinfo
});

export const onLoadMyinfo = (myinfo) => {
    return (dispatch) => {
        if(myinfo){
            DataStore.saveData('myInfo',myinfo);
            dispatch(onLoadMyinfoAction(myinfo))
        }else {
            DataStore.fetchLocalData('myInfo').then((data) => {
                dispatch(onLoadMyinfoAction(data.data))
            });
        }
    }
};
