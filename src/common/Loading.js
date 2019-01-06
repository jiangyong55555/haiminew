import React, {PureComponent} from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import Spinner from 'react-native-spinkit';

/**
 * 加载中
 */
class Loading extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    show() {
        this.setState({
            visible: true
        });
    }

    close(){
        this.setState({
            visible: false
        });
    }

    render() {
        let {visible} = this.state;
        return (
            <Modal
                transparent={true}
                visible={visible}
                onRequestClose={() => this.close()}
            >
                <View
                    style={styles.container}
                >
                    <Spinner type={'Bounce'} isVisible={visible}/>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    }
});

export default Loading;
