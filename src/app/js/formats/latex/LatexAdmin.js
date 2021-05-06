import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, FormControl } from '@material-ui/core';
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
        width: '100%',
    },
};

export const defaultArgs = {
    delimiter: '',
};

class LatexAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            delimiter: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setDelimiter = e => {
        const delimiter = String(e.target.value);
        const newArgs = { ...this.props.args, delimiter };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { delimiter },
        } = this.props;

        return (
            <div style={styles.container}>
                <FormControl fullWidth>
                    <TextField
                        label={polyglot.t('choose_delimiter')}
                        type="string"
                        onChange={this.setDelimiter}
                        style={styles.input}
                        value={delimiter}
                    />
                </FormControl>
            </div>
        );
    }
}

export default translate(LatexAdmin);

