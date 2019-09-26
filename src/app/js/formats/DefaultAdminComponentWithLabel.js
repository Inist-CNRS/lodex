import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select, TextField } from '@material-ui/core';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
};

export const defaultArgs = {
    type: 'value',
    value: '',
};

class DefaultAdminComponentWithLabel extends Component {
    static propTypes = {
        args: PropTypes.shape({
            type: PropTypes.string,
            value: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setType = (event, index, type) => {
        const newArgs = { ...this.props.args, type };
        this.props.onChange(newArgs);
    };

    setValue = (_, value) => {
        const newArgs = { ...this.props.args, value };
        this.props.onChange(newArgs);
    };

    render() {
        const { type, value } = this.props.args;

        return (
            <div style={styles.container}>
                <Select
                    floatingLabelText="Select a format"
                    onChange={this.setType}
                    style={styles.input}
                    value={type}
                >
                    <MenuItem value="value">The column content</MenuItem>
                    <MenuItem value="text">
                        A custom text (same for all resources)
                    </MenuItem>
                    <MenuItem value="column">Another column content</MenuItem>
                </Select>

                {type !== 'value' && (
                    <TextField
                        floatingLabelText={
                            type !== 'text' ? 'Custom text' : "Column's name"
                        }
                        onChange={this.setValue}
                        style={styles.input}
                        value={value}
                    />
                )}
            </div>
        );
    }
}

export default DefaultAdminComponentWithLabel;
