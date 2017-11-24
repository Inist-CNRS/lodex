import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        type: 'value',
        value: '',
    };
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type,
            value: this.props.value,
        };
    }

    setType = type => {
        this.setState({ type });
        this.props.onChange({
            type,
            value: this.state.value,
        });
    };

    setValue = value => {
        this.setState({ value });
        this.props.onChange({
            value,
            type: this.state.type,
        });
    };

    render() {
        const { type, value } = this.state;
        const { p: polyglot } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('uri_format_select_type')}
                    onChange={(event, index, newValue) =>
                        this.setType(newValue)
                    }
                    style={styles.input}
                    value={type}
                >
                    <MenuItem
                        value="value"
                        primaryText={polyglot.t('uri_format_column')}
                    />
                    <MenuItem
                        value="text"
                        primaryText={polyglot.t('uri_format_custom')}
                    />
                    <MenuItem
                        value="column"
                        primaryText={polyglot.t('uri_format_another_column')}
                    />
                </SelectField>

                {type !== 'value' && (
                    <TextField
                        floatingLabelText={
                            type !== 'text'
                                ? polyglot.t('uri_format_custom_value')
                                : polyglot.t('uri_format_another_column_value')
                        }
                        onChange={(event, newValue) => this.setValue(newValue)}
                        style={styles.input}
                        value={value}
                    />
                )}
            </div>
        );
    }
}

export default translate(UriEdition);
