import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';

const dropDownMenuProps = { autoWidth: true };

const SelectFormat = ({ formats, value, onChange, p: polyglot }) => (
    <Select
        className="select-format"
        floatingLabelText={polyglot.t('select_a_format')}
        onChange={(event, index, newValue) => onChange(newValue)}
        value={value}
        dropDownMenuProps={dropDownMenuProps}
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
