import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';

export const defaultArgs = {
    diameter: 500,
};

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

class StreamAdmin extends Component {

    setHeightValue = (_, value) => {
        console.log("value : " + value);
        this.props.onChange({
            ...this.props.params,
            height: value,
        });
    };

    //<TextField
    //    floatingLabelText="height"
    //    onChange={this.setHeightValue}
    ///>
    //<TextField
    //    floatingLabelText="color"
    //    onChange={console.log("color")}
    ///>

    render() {
        return (
            <div style={styles.container}>
            </div>
        );
    }
}

export default translate(StreamAdmin);