import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select, TextField } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
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

    setType = (event, index, type) => {
        const newArgs = { ...this.props.args, type };
        this.props.onChange(newArgs);
    };

    setValue = (_, value) => {
        const newArgs = { ...this.props.args, value };
        this.props.onChange(newArgs);
    };

    setMaxHeight = (_, maxHeight) => {
        maxHeight = Math.max(maxHeight, 1);
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
                <Select
                    label={polyglot.t('Select a format')}
                    onChange={this.setType}
                    style={styles.input}
                    value={type}
                >
                    <MenuItem value="text">
                        {polyglot.t('Another column content')}
                    </MenuItem>
                    <MenuItem value="column">
                        {polyglot.t('A custom URL (same for all resources)')}
                    </MenuItem>
                </Select>
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
