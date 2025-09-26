import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { translate } from '../../../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { TextField, MenuItem } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import updateAdminArgs from '../../utils/updateAdminArgs';
import { ASPECT_RATIO_16_9 } from '../../utils/aspectRatio';
import AspectRatioSelector from '../../utils/components/admin/AspectRatioSelector';

export const defaultArgs = {
    viewWidth: '100%',
    aspectRatio: ASPECT_RATIO_16_9,
};

const IFrameAdmin = ({
    args = defaultArgs,
    // @ts-expect-error TS7031
    onChange,
    // @ts-expect-error TS7031
    p: polyglot,
}) => {
    const [viewWidth, setViewWidth] = useState(
        args.viewWidth || defaultArgs.viewWidth,
    );
    const [aspectRatio, setAspectRatio] = useState(
        args.aspectRatio || defaultArgs.aspectRatio,
    );

    // @ts-expect-error TS7006
    const handleViewWidth = (event) => {
        const newViewWidth = event.target.value;
        updateAdminArgs('viewWidth', newViewWidth, { args, onChange });
        setViewWidth(newViewWidth);
    };

    // @ts-expect-error TS7006
    const handleAspectRatio = (newAspectRatio) => {
        updateAdminArgs('aspectRatio', newAspectRatio, { args, onChange });
        setAspectRatio(newAspectRatio);
    };

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('list_format_select_image_width')}
                    onChange={handleViewWidth}
                    value={viewWidth}
                >
                    <MenuItem value="10%">{polyglot.t('ten_percent')}</MenuItem>
                    <MenuItem value="20%">
                        {polyglot.t('twenty_percent')}
                    </MenuItem>
                    <MenuItem value="30%">
                        {polyglot.t('thirty_percent')}
                    </MenuItem>
                    <MenuItem value="50%">
                        {polyglot.t('fifty_percent')}
                    </MenuItem>
                    <MenuItem value="80%">
                        {polyglot.t('eighty_percent')}
                    </MenuItem>
                    <MenuItem value="100%">
                        {polyglot.t('hundred_percent')}
                    </MenuItem>
                </TextField>
                <AspectRatioSelector
                    value={aspectRatio}
                    onChange={handleAspectRatio}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

IFrameAdmin.propTypes = {
    args: PropTypes.shape({
        viewWidth: PropTypes.string,
        aspectRatio: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(IFrameAdmin);
