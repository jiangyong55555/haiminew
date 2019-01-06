import Types from '../../action/types';

const defaultState = {};

export default (state = defaultState,action) => {
    switch (action.type) {
        case Types.ONLOAD_MYINFO:
            return {
                ...state,
                myinfo: action.myinfo
            };
        default:
            return state;
    }
};
