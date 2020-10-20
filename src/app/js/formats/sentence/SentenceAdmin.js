import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
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
    prefix: '',
    suffix: '',
};

class SentenceAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            prefix: PropTypes.string,
            suffix: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setPrefix = prefix => {
        const newArgs = { ...this.props.args, prefix };
        this.props.onChange(newArgs);
    };

    setSuffix = suffix => {
        const newArgs = { ...this.props.args, suffix };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { prefix, suffix },
        } = this.props;

        return (
            <div style={styles.container}>
                <TextField
                    key="prefix"
                    label={polyglot.t('prefix')}
                    onChange={e => this.setPrefix(e.target.value)}
                    style={styles.input}
                    value={prefix}
                />
                <TextField
                    key="suffix"
                    label={polyglot.t('suffix')}
                    onChange={e => this.setSuffix(e.target.value)}
                    style={styles.input}
                    value={suffix}
                />
            </div>
        );
    }
}

export default translate(SentenceAdmin);
