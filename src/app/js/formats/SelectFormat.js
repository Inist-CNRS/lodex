import React, { PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    select: {
        width: '100%',
    },
};

const SelectFormat = ({ formats, value, onChange, p: polyglot }) => (
    <SelectField
        floatingLabelText={polyglot.t('select_a_format')}
        onChange={(event, index, newValue) => onChange(newValue)}
        value={value}
        style={styles.select}
    >
        <MenuItem value="None" primaryText="None" />

        {formats.map(f =>
            <MenuItem key={f} value={f} primaryText={polyglot.t(f)} />,
        )}
    </SelectField>
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
