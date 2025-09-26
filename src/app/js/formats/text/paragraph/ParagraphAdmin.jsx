import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import { translate } from '../../../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import updateAdminArgs from '../../utils/updateAdminArgs';

export const defaultArgs = {
    paragraphWidth: '100%',
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

const ParagraphAdmin = ({
    args = defaultArgs,
    onChange,
    p: polyglot,
}) => {
    const [colors, setColors] = useState(args.colors || defaultArgs.colors);
    const [paragraphWidth, setParagraphWidth] = useState(args.paragraphWidth || defaultArgs.paragraphWidth);

    const handleParagraphWidth = (event) => {
        const newParagraphWidth = event.target.value;
        updateAdminArgs('paragraphWidth', newParagraphWidth, { args, onChange });
        setParagraphWidth(newParagraphWidth);
    };

    const handleColors = (newColors) => {
        updateAdminArgs('colors', newColors, { args, onChange });
        setColors(newColors);
    };

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('list_format_select_image_width')}
                    onChange={handleParagraphWidth}
                    value={paragraphWidth}
                >
                    <MenuItem value="10%">{polyglot.t('ten_percent')}</MenuItem>
                    <MenuItem value="20%">{polyglot.t('twenty_percent')}</MenuItem>
                    <MenuItem value="30%">{polyglot.t('thirty_percent')}</MenuItem>
                    <MenuItem value="50%">{polyglot.t('fifty_percent')}</MenuItem>
                    <MenuItem value="80%">{polyglot.t('eighty_percent')}</MenuItem>
                    <MenuItem value="100%">{polyglot.t('hundred_percent')}</MenuItem>
                </TextField>
                <ColorPickerParamsAdmin
                    colors={colors}
                    onChange={handleColors}
                    polyglot={polyglot}
                    monochromatic={true}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

ParagraphAdmin.propTypes = {
    args: PropTypes.shape({
        paragraphWidth: PropTypes.string,
        colors: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(ParagraphAdmin);
