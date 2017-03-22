import React, { Component, PropTypes } from 'react';
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

class UriEdition extends Component {
    static propTypes = {
        type: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        type: 'value',
        value: '',
    }
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type,
            value: this.props.value,
        };
    }

    setType = (type) => {
        this.setState({ type });
        this.props.onChange({
            type,
            value: this.state.value,
        });
    }

    setValue = (value) => {
        this.setState({ value });
        this.props.onChange({
            value,
            type: this.state.type,
        });
    }

    render() {
        const { type, value } = this.state;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText="Select a format"
                    onChange={(event, index, newValue) => this.setType(newValue)}
                    style={styles.input}
                    value={type}
                >
                    <MenuItem value="value" primaryText="The column content" />
                    <MenuItem value="text" primaryText="A custom text (same for all resources)" />
                    <MenuItem value="column" primaryText="Another column content" />
                </SelectField>

                {type !== 'value' &&
                    <TextField
                        floatingLabelText={type !== 'text' ? 'Custom text' : 'Column\'s name'}
                        onChange={(event, newValue) => this.setValue(newValue)}
                        style={styles.input}
                        value={value}
                    />
                }
            </div>
        );
    }
}

export default UriEdition;
