import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    MenuItem,
    Select,
    TextField,
    FormControl,
    InputLabel,
} from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    input: {
        marginLeft: '1rem',
    },
};

export const defaultArgs = {
    type: 'value',
    value: '',
    maxHeight: 200,
};

class LinkImageAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            type: PropTypes.string,
            value: PropTypes.string,
            maxHeight: PropTypes.number,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setType = e => {
        const newArgs = { ...this.props.args, type: e.target.value };
        this.props.onChange(newArgs);
    };

    setValue = e => {
        const newArgs = { ...this.props.args, value: e.target.value };
        this.props.onChange(newArgs);
    };

    setMaxHeight = e => {
        const maxHeight = Math.max(e.target.value, 1);
        const newArgs = { ...this.props.args, maxHeight };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { type, value, maxHeight },
        } = this.props;

        return (
            <div style={styles.container}>
                <FormControl fullWidth>
                    <InputLabel id="linkimage-admin-input-label">
                        {polyglot.t('select_a_format')}
                    </InputLabel>
                    <Select
                        labelId="linkimage-admin-input-label"
                        onChange={this.setType}
                        style={styles.input}
                        value={type}
                    >
                        <MenuItem value="text">
                            {polyglot.t('item_other_column_content')}
                        </MenuItem>
                        <MenuItem value="column">
                            {polyglot.t('item_custom_url')}
                        </MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label={
                        type !== 'text'
                            ? polyglot.t('Custom URL')
                            : polyglot.t("Column's name")
                    }
                    onChange={this.setValue}
                    style={styles.input}
                    value={value}
                />
                <TextField
                    label={polyglot.t('height_px')}
                    type="number"
                    onChange={this.setMaxHeight}
                    style={styles.input}
                    value={maxHeight}
                />
            </div>
        );
    }
}

export default translate(LinkImageAdmin);
