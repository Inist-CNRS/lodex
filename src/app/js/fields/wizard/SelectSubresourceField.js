import React from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import parseValue from '../../../../common/tools/parseValue';

import { fromParsing } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    select: {
        width: '100%',
    },
};

export const SelectSubresourceFieldComponent = ({
    datasetFields = [],
    handleChange,
    p: polyglot,
    column,
    label,
    id,
}) => (
    <FormControl id="select-subresource-input-label" fullWidth>
        <InputLabel>{polyglot.t(label)}</InputLabel>
        <Select
            id={id}
            onChange={e => handleChange(e.target.value)}
            style={styles.select}
            labelId="select-subresource-input-label"
            value={column}
        >
            {datasetFields.map(datasetField => (
                <MenuItem
                    key={`id_${datasetField}`}
                    className={`column-${datasetField}`}
                    value={datasetField}
                >
                    {datasetField}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

SelectSubresourceFieldComponent.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    column: PropTypes.string,
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
};

SelectSubresourceFieldComponent.defaultProps = {
    column: '',
    id: 'select_subresource',
};

export const mapStateToProps = (state, { subresourceUri }) => {
    const { subresources } = state.subresource;

    const subresource = subresources.find(s => s._id === subresourceUri);
    const [firstParsedLine] = fromParsing.getExcerptLines(state);

    if (!subresource || !firstParsedLine) {
        return {};
    }

    const subresourceData = parseValue(firstParsedLine[subresource.path] || '');

    return {
        datasetFields: Object.keys(
            (Array.isArray(subresourceData)
                ? subresourceData[0]
                : subresourceData) || {},
        ),
    };
};

export default compose(
    connect(mapStateToProps),
    translate,
)(SelectSubresourceFieldComponent);
