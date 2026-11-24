import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';

import { useTranslate } from '../../../i18n/I18NContext';
import { FormatFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import { MAX_SIMILAR_RESOURCES } from './pageSize';
import { parseSimilarityInput } from './similarity';
import type { ResourcesListArgs } from './types';

const SimilarityFieldSet = <A extends ResourcesListArgs>({
    args,
    onChange,
}: {
    args: A;
    onChange: (args: A) => void;
}) => {
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

    return (
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
                    parseSimilarityInput(minSimilarityText) === undefined
                }
                fullWidth
            />
            <FormControlLabel
                control={
                    <Checkbox
                        onChange={toggleShowMinSimilarity}
                        checked={args.showMinSimilarity ?? false}
                        // The sentence only shows an explicit minimum.
                        disabled={storedMinSimilarity === undefined}
                    />
                }
                label={translate('similar_show_min_similarity')}
            />
        </FormatFieldSet>
    );
};

export default SimilarityFieldSet;
