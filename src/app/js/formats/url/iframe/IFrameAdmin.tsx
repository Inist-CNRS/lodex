import { TextField, MenuItem } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';
import { ASPECT_RATIO_16_9 } from '../../utils/aspectRatio';
import AspectRatioSelector from '../../utils/components/admin/AspectRatioSelector';
import { useTranslate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    viewWidth: '100%',
    aspectRatio: ASPECT_RATIO_16_9,
};

type IFrameArgs = {
    viewWidth?: string;
    aspectRatio?: string;
};

type IFrameAdminProps = {
    args?: IFrameArgs;
    onChange: (args: IFrameArgs) => void;
};

const IFrameAdmin = ({ args = defaultArgs, onChange }: IFrameAdminProps) => {
    const {
        viewWidth = defaultArgs.viewWidth,
        aspectRatio = defaultArgs.aspectRatio,
    } = args;
    const { translate } = useTranslate();

    const handleViewWidth = useUpdateAdminArgs<
        IFrameArgs,
        'viewWidth',
        React.ChangeEvent<HTMLInputElement>
    >('viewWidth', {
        args,
        onChange,
        parseValue: (event: React.ChangeEvent<HTMLInputElement>) =>
            event.target.value,
    });

    const handleAspectRatio = useUpdateAdminArgs<IFrameArgs, 'aspectRatio'>(
        'aspectRatio',
        {
            args,
            onChange,
        },
    );

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('list_format_select_image_width')}
                    onChange={handleViewWidth}
                    value={viewWidth}
                >
                    <MenuItem value="10%">{translate('ten_percent')}</MenuItem>
                    <MenuItem value="20%">
                        {translate('twenty_percent')}
                    </MenuItem>
                    <MenuItem value="30%">
                        {translate('thirty_percent')}
                    </MenuItem>
                    <MenuItem value="50%">
                        {translate('fifty_percent')}
                    </MenuItem>
                    <MenuItem value="80%">
                        {translate('eighty_percent')}
                    </MenuItem>
                    <MenuItem value="100%">
                        {translate('hundred_percent')}
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

export default IFrameAdmin;
