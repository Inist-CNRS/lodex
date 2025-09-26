import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import { translate } from '../../../i18n/I18NContext';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import SelectFormat from '../../SelectFormat';
import { getAdminComponent, FORMATS, getFormatInitialArgs } from '../../index';
import {
    FormatDefaultParamsFieldSet,
    FormatSubFormatParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import updateAdminArgs from '../../utils/updateAdminArgs';

export const defaultArgs = {
    type: 'unordered',
    bullet: '◉',
    subFormat: 'none',
    subFormatOptions: {},
};

const ListAdmin = ({
    args = defaultArgs,
    // @ts-expect-error TS7031
    onChange,
    // @ts-expect-error TS7031
    p: polyglot,
}) => {

    const [type, setType] = useState(args.type || defaultArgs.type);
    // @ts-expect-error TS7006
    const handleType = (event) => {
        const newValue = event.target.value;
        updateAdminArgs('type', newValue, { args, onChange });
        setType(newValue);
    };

    const [bullet, setBullet] = useState(args.bullet || defaultArgs.bullet);
    // @ts-expect-error TS7006
    const handleBullet = (event) => {
        const newValue = event.target.value;
        updateAdminArgs('bullet', newValue, { args, onChange });
        setBullet(newValue);
    };

    const [subFormat, setSubFormat] = useState(args.subFormat || defaultArgs.subFormat);
    // @ts-expect-error TS7006
    const handleSubFormat = (event) => {
        const newValue = event;
        updateAdminArgs('subFormat', newValue, { args: getFormatInitialArgs(subFormat), onChange });
        setSubFormat(newValue);
    };

    const [subFormatOptions, setSubFormatOptions] = useState(args.subFormatOptions || defaultArgs.subFormatOptions);
    // @ts-expect-error TS7006
    const handleSubFormatOptions = (event) => {
        const newValue = event;
        updateAdminArgs('subFormatOptions', newValue, { args, onChange });
        setSubFormatOptions(newValue);
    };

    const SubAdminComponent = getAdminComponent(subFormat);

    return (
        <FormatGroupedFieldSet>
            {/*
             // @ts-expect-error TS2322 */}
            <FormatDefaultParamsFieldSet defaultExpanded>
                {/*
                 // @ts-expect-error TS2322 */}
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('list_format_select_type')}
                    onChange={handleType}
                    value={type}
                >
                    <MenuItem value="unordered">
                        {polyglot.t('list_format_unordered')}
                    </MenuItem>
                    <MenuItem value="ordered">
                        {polyglot.t('list_format_ordered')}
                    </MenuItem>
                    <MenuItem value="unordered_without_bullet">
                        {polyglot.t('list_format_unordered_without_bullet')}
                    </MenuItem>
                    <MenuItem value="unordered_flat">
                        {polyglot.t('list_format_unordered_flat')}
                    </MenuItem>
                </TextField>
                {/*
                 // @ts-expect-error TS2322 */}
                <div
                    style={{
                        width: '100%',
                    }}
                >
                    <SelectFormat
                        formats={FORMATS}
                        value={subFormat}
                        onChange={handleSubFormat}
                    />
                </div>
                {/*
                 // @ts-expect-error TS2322 */}
                <TextField
                    key="bullet"
                    label={polyglot.t('bullet')}
                    onChange={handleBullet}
                    value={bullet}
                />
            </FormatDefaultParamsFieldSet>
            {/*
             // @ts-expect-error TS2322 */}
            <FormatSubFormatParamsFieldSet>
                {subFormat && subFormat !== 'none' ? (
                    <SubAdminComponent
                        onChange={handleSubFormatOptions}
                        args={subFormatOptions}
                    />
                ) : (
                    polyglot.t('no_format')
                )}
            </FormatSubFormatParamsFieldSet>
        </FormatGroupedFieldSet>
    );
}

ListAdmin.propTypes = {
    args: PropTypes.shape({
        type: PropTypes.string,
        bullet: PropTypes.string,
        subFormat: PropTypes.string,
        subFormatOptions: PropTypes.any,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(ListAdmin);
