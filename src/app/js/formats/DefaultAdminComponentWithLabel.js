import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
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
        args: {
            type: 'value',
            value: '',
        },
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
                <SelectField
                    floatingLabelText="Select a format"
                    onChange={this.setType}
                    style={styles.input}
                    value={type}
                >
                    <MenuItem value="value" primaryText="The column content" />
                    <MenuItem
                        value="text"
                        primaryText="A custom text (same for all resources)"
                    />
                    <MenuItem
                        value="column"
                        primaryText="Another column content"
                    />
                </SelectField>

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
