import React, {PureComponent} from 'react';
import {StyleSheet, View, ImageBackground, StatusBar, Dimensions} from 'react-native';
import {withTheme, Button} from "react-native-elements";
import SplashScreen from "react-native-splash-screen";

/**
 * 选择页面
 */
class SignInScreen extends PureComponent {
    componentDidMount() {
        SplashScreen.hide();
    }
    render() {
        let {theme,navigation} = this.props;
        return (
            <ImageBackground
                style={{flex: 1}}
                source={require('../../images/signin/loginback.jpg')}
            >
                <StatusBar hidden={true} />
                <View style={styles.container}>
                    <Button
                        title='登录'
                        onPress={
                            () => navigation.navigate(
                                'RegLogin',
                                {type:'login'}
                            )
                        }
                        buttonStyle={{
                            ...styles.btn,
                            backgroundColor:theme.colors.secondary
                        }}
                    />
                    <Button
                        title='注册'
                        onPress={
                            () => navigation.navigate(
                                'RegLogin',
                                {type:'reg'}
                            )
                        }
                        buttonStyle={{
                            ...styles.btn,
                            backgroundColor:'#fff',
                        }}
                        titleStyle={{ color:'#000'}}
                    />
                </View>
            </ImageBackground>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        bottom:20,
        width:Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent:'space-around'
    },
    btn: {
        width:Dimensions.get('window').width/3,
        height:48,
    }
});

export default withTheme(SignInScreen);
