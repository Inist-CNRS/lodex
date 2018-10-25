import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export const defaultArgs = {
    diameter: 500,
};

class StreamAdmin extends Component {
    render() {
        return (
            <TextField
                floatingLabelText="test"
                onChange={console.log("I just changed !")}
            />
        );
    }
}

export default StreamAdmin;