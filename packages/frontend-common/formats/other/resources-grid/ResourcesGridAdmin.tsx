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
import { isSimilarResourcesSource, parseSimilarityInput } from './similarity';

// Upper bound of "Maximum number of resources": every resource is loaded in a
// single call, and the routine clamps to the same value.
export const MAX_SIMILAR_RESOURCES = 100;

// A page size that is not a positive integer (e.g. an emptied input) falls back to the default.
export const toPageSize = (value: unknown): number =>
    typeof value === 'number' && Number.isInteger(value) && value > 0
        ? value
        : defaultArgs.pageSize;

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
        maxResources?: number;
        minSimilarity?: number;
    };
    showMinSimilarity?: boolean;
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

    const handleWidth = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                spaceWidth: event.target.value,
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
        spaceWidth,
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
