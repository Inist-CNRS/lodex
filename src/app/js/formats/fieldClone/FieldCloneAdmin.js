import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { TextField } from '@material-ui/core';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
    },
    input: {
        marginLeft: '1rem',
    },
};
export const defaultArgs = {
    value: '',
};

const FieldCloneAdmin = ({ args, onChange, p: polyglot }) => {
    const setValue = e => {
        const newArgs = { value: e.target.value };
        onChange(newArgs);
    };

    return (
        <div style={styles.container}>
            <TextField
                label={polyglot.t('fieldclone_format_value')}
                onChange={setValue}
                style={styles.input}
                value={args.value}
            />
        </div>
    );
};

FieldCloneAdmin.propTypes = {
    args: PropTypes.shape({
        value: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

FieldCloneAdmin.defaultProps = {
    args: defaultArgs,
};

export default translate(FieldCloneAdmin);
