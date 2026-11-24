import React, {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
} from 'react';
import { useFormContext, useWatch, type Control } from 'react-hook-form';
import { MenuItem, Checkbox, TextField, FormControlLabel } from '@mui/material';
import { useTranslate } from '../../../i18n/I18NContext';

import {
    FormatDefaultParamsFieldSet,
    FormatFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import {
    isSimilarResourcesSource,
    parseSimilarityInput,
} from '../resources-common/similarity';
import {
    DEFAULT_PAGE_SIZE,
    MAX_SIMILAR_RESOURCES,
    toPageSize,
} from '../resources-common/pageSize';

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

type ResourcesGridArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
        maxResources?: number;
        minSimilarity?: number;
    };
    showMinSimilarity?: boolean;
    itemsPerRow?: number;
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

type ResourcesGridAdminContentProps = ResourcesGridAdminProps & {
    isSimilar: boolean;
};

const ResourcesGridAdminContent = ({
    args = defaultArgs,
    onChange,
    isSimilar,
}: ResourcesGridAdminContentProps) => {
    const { translate } = useTranslate();
    const storedMinSimilarity = args.params?.minSimilarity;
    const [minSimilarityText, setMinSimilarityText] = useState(
        storedMinSimilarity?.toString() ?? '',
    );

    // Resync the text when args change from outside (e.g. the format is reset),
    // but keep what the admin is typing when it already matches the stored value.
    useEffect(() => {
        setMinSimilarityText((text) =>
            parseSimilarityInput(text) === storedMinSimilarity
                ? text
                : storedMinSimilarity?.toString() ?? '',
        );
    }, [storedMinSimilarity]);

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

    const toggleAllowToLoadMore = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                allowToLoadMore: event.target.checked,
            });
        },
        [onChange, args],
    );

    const toggleOpenInNewTab = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                openInNewTab: event.target.checked,
            });
        },
        [onChange, args],
    );

    const handlePageSize = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const pageSize = toPageSize(parseInt(e.target.value, 10));
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

    // Sets a numeric key of args.params, or removes it when value is undefined.
    const setParam = useCallback(
        (key: 'maxResources' | 'minSimilarity', value?: number) => {
            const { [key]: _removed, ...params } = args.params ?? {};
            onChange({
                ...args,
                params:
                    value === undefined ? params : { ...params, [key]: value },
            });
        },
        [onChange, args],
    );

    const handleMaxResources = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const maxResources = parseInt(event.target.value, 10);
            setParam(
                'maxResources',
                Number.isNaN(maxResources) || maxResources < 1
                    ? undefined
                    : Math.min(maxResources, MAX_SIMILAR_RESOURCES),
            );
        },
        [setParam],
    );

    // The text is kept locally so intermediate input such as "0," can be
    // typed. An empty or invalid input removes the setting, so what is saved
    // always matches what the field shows (an invalid field is shown in error).
    const handleMinSimilarity = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const text = event.target.value;
            setMinSimilarityText(text);
            setParam('minSimilarity', parseSimilarityInput(text));
        },
        [setParam],
    );

    const toggleShowMinSimilarity = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({ ...args, showMinSimilarity: event.target.checked });
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

    const {
        allowToLoadMore,
        pageSize,
        titleSize,
        summarySize,
        openInNewTab,
        showMinSimilarity,
    } = args;

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
                <FormatFieldSet
                    title="similarity_section"
                    id="format-field-set-similarity"
                    defaultExpanded
                >
                    <TextField
                        label={translate('similar_max_resources')}
                        onChange={handleMaxResources}
                        value={args.params?.maxResources ?? ''}
                        type="number"
                        inputProps={{ min: 1, max: MAX_SIMILAR_RESOURCES }}
                        fullWidth
                    />
                    <TextField
                        label={translate('similar_min_similarity')}
                        onChange={handleMinSimilarity}
                        value={minSimilarityText}
                        error={
                            minSimilarityText.trim() !== '' &&
                            parseSimilarityInput(minSimilarityText) ===
                                undefined
                        }
                        fullWidth
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={toggleShowMinSimilarity}
                                checked={showMinSimilarity ?? false}
                                // The sentence only shows an explicit minimum.
                                disabled={storedMinSimilarity === undefined}
                            />
                        }
                        label={translate('similar_show_min_similarity')}
                    />
                </FormatFieldSet>
            )}
        </FormatGroupedFieldSet>
    );
};

// useWatch needs a form control: it is only called below, inside a form context.
const ResourcesGridAdminWithForm = ({
    control,
    ...props
}: ResourcesGridAdminProps & { control: Control }) => {
    const transformers = useWatch({ control, name: 'transformers' });
    return (
        <ResourcesGridAdminContent
            {...props}
            isSimilar={isSimilarResourcesSource(transformers)}
        />
    );
};

const ResourcesGridAdmin = (props: ResourcesGridAdminProps) => {
    const formContext = useFormContext();

    if (!formContext) {
        return <ResourcesGridAdminContent {...props} isSimilar={false} />;
    }

    return (
        <ResourcesGridAdminWithForm {...props} control={formContext.control} />
    );
};

export default ResourcesGridAdmin;
