import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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

class LinkImageAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            type: PropTypes.string,
            value: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
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
        const { p: polyglot, args: { type, value } } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('Select a format')}
                    onChange={this.setType}
                    style={styles.input}
                    value={type}
                >
                    <MenuItem
                        value="text"
                        primaryText={polyglot.t(
                            'A custom URL (same for all resources)',
                        )}
                    />
                    <MenuItem
                        value="column"
                        primaryText={polyglot.t('Another column content')}
                    />
                </SelectField>
                <TextField
                    floatingLabelText={
                        type !== 'text'
                            ? polyglot.t('Custom URL')
                            : polyglot.t("Column's name")
                    }
                    onChange={this.setValue}
                    style={styles.input}
                    value={value}
                />
            </div>
        );
    }
}

export default translate(LinkImageAdmin);
