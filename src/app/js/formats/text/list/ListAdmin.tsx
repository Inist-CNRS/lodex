import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import { useTranslate } from '../../../i18n/I18NContext';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import SelectFormat from '../../SelectFormat';
import { getAdminComponent, FORMATS, getFormatInitialArgs } from '../../index';
import {
    FormatDefaultParamsFieldSet,
    FormatSubFormatParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useCallback } from 'react';

export const defaultArgs = {
    type: 'unordered',
    bullet: '◉',
    subFormat: 'none',
    subFormatOptions: {},
};

type ListArgs = {
    type?: string;
    bullet?: string;
    subFormat?: string;
    subFormatOptions?: unknown;
};

type ListAdminProps = {
    args?: ListArgs;
    onChange: (args: ListArgs) => void;
};

const ListAdmin = ({ args = defaultArgs, onChange }: ListAdminProps) => {
    const { translate } = useTranslate();

    const {
        type = defaultArgs.type,
        bullet = defaultArgs.bullet,
        subFormat = defaultArgs.subFormat,
        subFormatOptions = defaultArgs.subFormatOptions,
    } = args;
    const handleType = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                type: event.target.value,
            });
        },
        [onChange, args],
    );

    const handleBullet = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                bullet: event.target.value,
            });
        },
        [onChange, args],
    );

    const handleSubFormat = useCallback(
        (subFormat: string) => {
            onChange({
                ...getFormatInitialArgs(subFormat),
                subFormat,
            });
        },
        [onChange],
    );

    const handleSubFormatOptions = useCallback(
        (subFormatOptions: unknown) => {
            onChange({
                ...args,
                subFormatOptions,
            });
        },
        [onChange, args],
    );

    const SubAdminComponent = getAdminComponent(subFormat);

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('list_format_select_type')}
                    onChange={handleType}
                    value={type}
                >
                    <MenuItem value="unordered">
                        {translate('list_format_unordered')}
                    </MenuItem>
                    <MenuItem value="ordered">
                        {translate('list_format_ordered')}
                    </MenuItem>
                    <MenuItem value="unordered_without_bullet">
                        {translate('list_format_unordered_without_bullet')}
                    </MenuItem>
                    <MenuItem value="unordered_flat">
                        {translate('list_format_unordered_flat')}
                    </MenuItem>
                </TextField>
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
                <TextField
                    key="bullet"
                    label={translate('bullet')}
                    onChange={handleBullet}
                    value={bullet}
                />
            </FormatDefaultParamsFieldSet>
            <FormatSubFormatParamsFieldSet>
                {subFormat && subFormat !== 'none' ? (
                    // @ts-expect-error TS2739 - Too complex union type from getAdminComponent
                    <SubAdminComponent
                        onChange={handleSubFormatOptions}
                        args={subFormatOptions as any}
                    />
                ) : (
                    <>{translate('no_format')}</>
                )}
            </FormatSubFormatParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

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

export default ListAdmin;
