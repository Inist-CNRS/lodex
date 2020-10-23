import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';

const SelectFormat = ({ formats, value, onChange, p: polyglot }) => (
    <FormControl>
        <InputLabel id="select-form-input-label">
            {polyglot.t('select_a_format')}
        </InputLabel>
        <Select
            className="select-format"
            labelId="select-form-input-label"
            onChange={e => onChange(e.target.value)}
            value={value}
            autoWidth
        >
            <MenuItem value="None">{'None'}</MenuItem>
            {formats
                .sort((x, y) => polyglot.t(x).localeCompare(polyglot.t(y)))
                .map(format => (
                    <MenuItem
                        className="select-format-item"
                        key={format}
                        value={format}
                    >
                        {polyglot.t(format)}
                        <div data-value={format} />
                    </MenuItem>
                ))}
        </Select>
    </FormControl>
);

SelectFormat.defaultProps = {
    value: null,
};

SelectFormat.propTypes = {
    formats: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(SelectFormat);
