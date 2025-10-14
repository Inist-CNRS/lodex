import React, { useCallback, type ChangeEvent } from 'react';
import { MenuItem, Checkbox, TextField, FormControlLabel } from '@mui/material';
import { useTranslate } from '../../../i18n/I18NContext';

import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    allowToLoadMore: true,
    pageSize: 6,
    spaceWidth: '30%',
    titleSize: 100,
    summarySize: 400,
    openInNewTab: false,
    params: {
        maxSize: 5,
        orderBy: 'value/asc',
    },
};

type ResourcesGridArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
    };
    spaceWidth?: string;
    allowToLoadMore?: boolean;
    pageSize?: number;
    titleSize?: number;
    summarySize?: number;
    openInNewTab?: boolean;
};

type ResourcesGridAdminProps = {
    args?: ResourcesGridArgs;
    onChange: (args: ResourcesGridArgs) => void;
};

const ResourcesGridAdmin = ({
    args = defaultArgs,
    onChange,
}: ResourcesGridAdminProps) => {
    const { translate } = useTranslate();

    const handleWidth = useUpdateAdminArgs<
        ResourcesGridArgs,
        'spaceWidth',
        ChangeEvent<HTMLInputElement>
    >('spaceWidth', {
        args,
        onChange,
        parseValue: (event) => event.target.value,
    });

    const toggleAllowToLoadMore = useUpdateAdminArgs<
        ResourcesGridArgs,
        'allowToLoadMore',
        ChangeEvent<HTMLInputElement>
    >('allowToLoadMore', {
        args,
        onChange,
        parseValue: (event) => event.target.checked,
    });

    const toggleOpenInNewTab = useUpdateAdminArgs<
        ResourcesGridArgs,
        'openInNewTab',
        ChangeEvent<HTMLInputElement>
    >('openInNewTab', {
        args,
        onChange,
        parseValue: (event) => event.target.checked,
    });

    const handlePageSize = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const pageSize = parseInt(e.target.value, 10);
            onChange({
                ...args,
                pageSize: pageSize,
                params: {
                    ...args.params,
                    maxSize: pageSize,
                },
            });
        },
        [args, onChange],
    );

    const handleSummarySize = useUpdateAdminArgs<
        ResourcesGridArgs,
        'summarySize',
        ChangeEvent<HTMLInputElement>
    >('summarySize', {
        args,
        onChange,
        parseValue: (event) => parseInt(event.target.value, 10),
    });

    const handleTitleSize = useUpdateAdminArgs<
        ResourcesGridArgs,
        'titleSize',
        ChangeEvent<HTMLInputElement>
    >('titleSize', {
        args,
        onChange,
        parseValue: (event) => parseInt(event.target.value, 10),
    });

    const {
        spaceWidth,
        allowToLoadMore,
        pageSize,
        titleSize,
        summarySize,
        openInNewTab,
    } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('list_format_select_image_width')}
                    onChange={handleWidth}
                    value={spaceWidth || defaultArgs.spaceWidth}
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
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={toggleAllowToLoadMore}
                            checked={
                                allowToLoadMore ?? defaultArgs.allowToLoadMore
                            }
                        />
                    }
                    label={translate('allow_to_load_more')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={toggleOpenInNewTab}
                            checked={openInNewTab ?? defaultArgs.openInNewTab}
                        />
                    }
                    label={translate('open_in_new_tab')}
                />
                <TextField
                    label={translate('number_of_char_title')}
                    onChange={handleTitleSize}
                    value={titleSize || defaultArgs.titleSize}
                    type="number"
                    fullWidth
                />
                <TextField
                    label={translate('number_of_char_summary')}
                    onChange={handleSummarySize}
                    value={summarySize || defaultArgs.summarySize}
                    type="number"
                    fullWidth
                />
                <TextField
                    label={translate('items_per_page')}
                    onChange={handlePageSize}
                    value={pageSize || defaultArgs.pageSize}
                    type="number"
                    fullWidth
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default ResourcesGridAdmin;
