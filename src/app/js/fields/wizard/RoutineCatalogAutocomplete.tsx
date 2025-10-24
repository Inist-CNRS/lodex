import { useEffect, useMemo, useState } from 'react';
import { translate } from '../../i18n/I18NContext';
import compose from 'recompose/compose';

import { Typography, Box, Link, Tooltip } from '@mui/material';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, lighten, darken } from '@mui/system';

import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import routines from '../../../custom/routines/routines-catalog.json';
import routinesPrecomputed from '../../../custom/routines/routines-precomputed-catalog.json';

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor:
        theme.palette.mode === 'light'
            ? lighten(theme.palette.primary.light, 0.85)
            : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
    padding: 0,
});

interface RoutineOptionProps {
    key: string;
    option: {
        title: string;
        id: string;
        doc?: string;
        url?: string;
        recommendedWith?: unknown[];
    };
    polyglot: unknown;
}

const RoutineOption = ({
    key,
    option,
    polyglot,
    ...props
}: RoutineOptionProps) => {
    return (
        <Box key={key} {...props}>
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Box
                    sx={{ width: '100%' }}
                    mt={1}
                    display="flex"
                    alignItems="center"
                >
                    <Typography sx={{ fontWeight: 'bold' }}>
                        {option.title}
                    </Typography>
                </Box>

                <Box
                    sx={{ width: '100%' }}
                    mt={1}
                    display="flex"
                    alignItems="center"
                >
                    <Typography>
                        {/*
                         // @ts-expect-error TS18046 */}
                        {polyglot.t(`${option.id}_description`)}
                    </Typography>
                </Box>

                <Box justifyContent="space-between" display="flex" mt={2}>
                    {option.recommendedWith && (
                        // @ts-expect-error TS18046
                        <Tooltip title={polyglot.t(`tooltip_recommendedWith`)}>
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <ThumbUpIcon color="primary" />
                                <Typography>
                                    {option.recommendedWith.join(', ')}
                                </Typography>
                            </Box>
                        </Tooltip>
                    )}
                    {option.doc && (
                        // @ts-expect-error TS18046
                        <Tooltip title={polyglot.t(`tooltip_documentation`)}>
                            <Link
                                href={option.doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <SettingsEthernetIcon />
                            </Link>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

interface RoutineCatalogProps {
    label: string;
    p: unknown;
    onChange(...args: unknown[]): unknown;
    currentValue?: string;
    precomputed?: boolean;
}

const RoutineCatalog = ({
    p: polyglot,

    label,

    onChange,

    currentValue,

    precomputed = false,
}: RoutineCatalogProps) => {
    const [value, setValue] = useState(null);

    /**
     * @type {Array<{id: string, title: string, url: string, doc: string, recommendedWith: string[]}>}
     */
    const catalog = useMemo(() => {
        const routineCatalog = precomputed ? routinesPrecomputed : routines;
        const formatedRoutineCatalog = routineCatalog.map((routine) => {
            // @ts-expect-error TS18046
            const title = polyglot.t(`${routine.id}_title`);
            const firstLetter = title[0].toUpperCase();
            const formatedFirstLetter = /[0-9]/.test(firstLetter)
                ? '0-9'
                : firstLetter;
            return {
                ...routine,
                // @ts-expect-error TS18046
                title: polyglot.t(`${routine.id}_title`),
                firstLetter: formatedFirstLetter,
            };
        });
        // @ts-expect-error TS18046
        const sorter = new Intl.Collator(polyglot.currentLocale, {
            numeric: true,
            ignorePunctuation: true,
        });
        // @ts-expect-error TS2345
        return formatedRoutineCatalog.sort(sorter.compare);
    }, [precomputed]);

    useEffect(() => {
        setValue(
            // @ts-expect-error TS2345
            catalog.find(
                (routine) =>
                    typeof currentValue === 'string' &&
                    currentValue.startsWith('/') &&
                    routine.url.includes(currentValue),
            ) ?? null,
        );
    }, [currentValue, catalog]);

    // @ts-expect-error TS7006
    const handleChange = (event, newValue) => {
        setValue(newValue);
        onChange({
            target: {
                value: newValue.url,
            },
        });
    };

    return (
        <Autocomplete
            value={value}
            onChange={handleChange}
            isOptionEqualToValue={(option1, option2) => {
                if (!option1 || !option2) {
                    return false;
                }
                return option1.id === option2.id && option1.url === option2.url;
            }}
            fullWidth
            options={catalog}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            renderOption={(props, option) => (
                <RoutineOption option={option} polyglot={polyglot} {...props} />
            )}
            renderInput={(params) => <TextField {...params} label={label} />}
            renderGroup={(params) => (
                <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                </li>
            )}
        />
    );
};

// @ts-expect-error TS2345
export default compose(translate)(RoutineCatalog);
