import Types from '../../action/types';

const defaultState = {
    dataSource:[
        // {
        //     scene: 'p2p',
        //     nick: 'Amy Farha',
        //     avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        //     subtitle: 'Vice President',
        //     timeString:'2018/12/5'
        // },
        // {
        //     scene: 'p2p',
        //     nick: 'Chris Jackson',
        //     subtitle: 'Vice Chairman',
        //     timeString:'2018/12/5'
        // }
    ]
};

export default (state = defaultState,action) => {
    switch (action.type) {

        default:
            return state;
    }
};
