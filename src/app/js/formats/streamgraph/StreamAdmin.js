import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

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

    render() {
        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText="height"
                    onChange={this.setHeightValue}
                />
                <TextField
                    floatingLabelText="color"
                    onChange={console.log("color")}
                />
            </div>
        );
    }
}

export default StreamAdmin;