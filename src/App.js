import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import {Provider} from 'react-redux';
import AppNavigator from './navigator/AppNavigator';
import store from './store';
/**
 * 定义主题
 * @type {{}}
 */
const theme = {
    colors:{
        secondary: '#19bc08',//微信绿
        primary: '#38393D',//微信黑
        paper: '#f3f3f3',//背景白
        error: '#e04748',
    },
    Header:{
        statusBarProps:{
            backgroundColor: '#38393D'
        },
        containerStyle:{
            height:50,
            borderBottomColor: '#38393D'
        }
    },
    ListItem: {
        titleStyle:{
            color:'#000'
        },
        containerStyle:{
            borderBottomColor: '#ddd'
        }
    }
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <AppNavigator/>
            </Provider>
        </ThemeProvider>
    );
};

export default App;
