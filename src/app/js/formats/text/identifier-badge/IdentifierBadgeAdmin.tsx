import { TextField, MenuItem } from '@mui/material';
import { useTranslate } from '../../../i18n/I18NContext';

import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';
import { resolvers } from './index';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    typid: 1,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

type IdentifierBadgeArgs = {
    typid?: string | number;
    colors?: string;
};

type IdentifierBadgeAdminProps = {
    args?: IdentifierBadgeArgs;
    onChange: (args: IdentifierBadgeArgs) => void;
};

const IdentifierBadgeAdmin = ({
    args = defaultArgs,
    onChange,
}: IdentifierBadgeAdminProps) => {
    const { translate } = useTranslate();

    const handleTypid = useUpdateAdminArgs<
        IdentifierBadgeArgs,
        'typid',
        React.ChangeEvent<HTMLInputElement>
    >('typid', {
        args,
        onChange,
        parseValue: (event: React.ChangeEvent<HTMLInputElement>) =>
            event.target.value,
    });

    const handleColorsChange = useUpdateAdminArgs<
        IdentifierBadgeArgs,
        'colors',
        string
    >('colors', {
        args,
        onChange,
        parseValue: (colors: string) => {
            const colorValue = colors.split(' ')[0];
            return colorValue;
        },
    });

    const { typid } = args;

    const items = Object.keys(resolvers).map((resolverID) => (
        <MenuItem key={`resolver_${resolverID}`} value={resolverID}>
            {translate(resolverID)}
        </MenuItem>
    ));

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('list_format_select_identifier')}
                    value={typid || defaultArgs.typid}
                    onChange={handleTypid}
                    variant="standard"
                >
                    {items}
                </TextField>
                <ColorPickerParamsAdmin
                    colors={args.colors}
                    onChange={handleColorsChange}
                    monochromatic={true}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default IdentifierBadgeAdmin;
