import Types from '../../action/types';

const defaultState = {dataSource:[]};

export default (state = defaultState,action) => {
    switch (action.type) {
        case Types.ONLOAD_CONTACT_LIST:
            return {
                ...state,
                dataSource: action.contactlist
            };
        case Types.ADD_CONTACT_LIST:
            return {
                ...state,
                dataSource: [
                    ...state.dataSource,
                    action.contact
                ]
            };
        default:
            return state;
    }
};
