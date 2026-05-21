import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import CSSEditor from './CSSEditor';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { translate, useTranslate } from '../../../i18n/I18NContext';
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';

type CSSArgs = {
    template?: string;
    globalMode?: boolean;
};

export const defaultArgs = {
    template: `{
    color: red;
    background: #f0f0f0;
    padding: 1rem;
    &:hover {
      background: pink;
    }
    @media (max-width: 600px) {
      font-size: 14px;
    }
}`,
    globalMode: false,
};

type CSSAdminProps = {
    args: CSSArgs;
    onChange: (args: CSSArgs) => void;
};

const CSSAdmin = ({ args = defaultArgs, onChange }: CSSAdminProps) => {
    const { translate } = useTranslate();

    const { template, globalMode } = args;

    const toggleGlobalMode = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                globalMode: event.target.checked,
            });
        },
        [onChange, args],
    );

    const handleTemplateChange = useCallback(
        (template: string) => {
            onChange({
                ...args,
                template,
            });
        },
        [onChange, args],
    );

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={globalMode}
                                onChange={toggleGlobalMode}
                            />
                        }
                        label={translate('globalMode')}
                    />
                </FormGroup>
                <CSSEditor value={template} onChange={handleTemplateChange} />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default translate(CSSAdmin);
