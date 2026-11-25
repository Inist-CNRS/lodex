import { useCallback, type ChangeEvent } from 'react';
import { MenuItem, Checkbox, TextField, FormControlLabel } from '@mui/material';
import { useTranslate } from '../../../i18n/I18NContext';

import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { DEFAULT_PAGE_SIZE } from '../resources-common/pageSize';
import SimilarityFieldSet from '../resources-common/SimilarityFieldSet';
import type { ResourcesListArgs } from '../resources-common/types';
import { useResourcesListHandlers } from '../resources-common/useResourcesListHandlers';
import withSimilarSource from '../resources-common/withSimilarSource';

export const defaultArgs = {
    allowToLoadMore: true,
    pageSize: DEFAULT_PAGE_SIZE,
    itemsPerRow: 3,
    spaceWidth: '30%',
    titleSize: 100,
    summarySize: 400,
    openInNewTab: false,
    params: {
        maxSize: 5,
        orderBy: 'value/asc',
    },
};

export const ITEMS_PER_ROW_CHOICES = [1, 2, 3, 5, 10];

// Fields saved before itemsPerRow store the card width as a percentage
// (spaceWidth): 30% → 3 per row, 80% → 1. Any other count is brought down
// to the closest menu choice, so the admin select always shows it.
export const toItemsPerRow = ({
    itemsPerRow,
    spaceWidth,
}: {
    itemsPerRow?: unknown;
    spaceWidth?: unknown;
}): number => {
    const count = parseFloat(String(itemsPerRow));
    const percent = parseFloat(String(spaceWidth));
    const perRow = count >= 1 ? count : percent > 0 ? 100 / percent : NaN;
    if (!(perRow >= 1)) {
        return defaultArgs.itemsPerRow;
    }
    return (
        ITEMS_PER_ROW_CHOICES.filter((choice) => choice <= perRow).pop() ?? 1
    );
};

// The old percentage for a count (3 → 30%), kept next to itemsPerRow so a
// Lodex without itemsPerRow still shows the grid it can.
export const toSpaceWidth = (itemsPerRow: number) =>
    `${Math.floor(10 / itemsPerRow) * 10}%`;

type ResourcesGridArgs = ResourcesListArgs & {
    itemsPerRow?: number;
    spaceWidth?: string;
    titleSize?: number;
    summarySize?: number;
};

type ResourcesGridAdminProps = {
    args?: ResourcesGridArgs;
    onChange: (args: ResourcesGridArgs) => void;
};

type ResourcesGridAdminContentProps = ResourcesGridAdminProps & {
    isSimilar: boolean;
};

const ResourcesGridAdminContent = ({
    args = defaultArgs,
    onChange,
    isSimilar,
}: ResourcesGridAdminContentProps) => {
    const { translate } = useTranslate();
    const { toggleAllowToLoadMore, toggleOpenInNewTab, handlePageSize } =
        useResourcesListHandlers(args, onChange);

    const handleItemsPerRow = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const itemsPerRow = Number(event.target.value);
            onChange({
                ...args,
                itemsPerRow,
                spaceWidth: toSpaceWidth(itemsPerRow),
            });
        },
        [onChange, args],
    );

    const handleSummarySize = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                summarySize: parseInt(event.target.value, 10),
            });
        },
        [onChange, args],
    );

    const handleTitleSize = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                titleSize: parseInt(event.target.value, 10),
            });
        },
        [onChange, args],
    );

    const { allowToLoadMore, pageSize, titleSize, summarySize, openInNewTab } =
        args;

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('resources_grid_items_per_row')}
                    helperText={translate(
                        'resources_grid_items_per_row_helper',
                    )}
                    onChange={handleItemsPerRow}
                    value={toItemsPerRow(args)}
                >
                    {ITEMS_PER_ROW_CHOICES.map((count) => (
                        <MenuItem key={count} value={count}>
                            {count}
                        </MenuItem>
                    ))}
                </TextField>
                {!isSimilar && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={toggleAllowToLoadMore}
                                checked={
                                    allowToLoadMore ??
                                    defaultArgs.allowToLoadMore
                                }
                            />
                        }
                        label={translate('allow_to_load_more')}
                    />
                )}
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
            {isSimilar && (
                <SimilarityFieldSet args={args} onChange={onChange} />
            )}
        </FormatGroupedFieldSet>
    );
};

export default withSimilarSource(ResourcesGridAdminContent);
