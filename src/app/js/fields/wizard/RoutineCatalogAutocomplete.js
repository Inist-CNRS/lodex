import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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

const RoutineOption = ({ key, option, polyglot, ...props }) => {
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
                        {polyglot.t(`${option.id}_description`)}
                    </Typography>
                </Box>

                <Box justifyContent="space-between" display="flex" mt={2}>
                    {option.recommendedWith && (
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

RoutineOption.propTypes = {
    key: PropTypes.string.isRequired,
    option: PropTypes.shape({
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        doc: PropTypes.string,
        url: PropTypes.string,
        recommendedWith: PropTypes.array,
    }).isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

const RoutineCatalog = ({
    p: polyglot,
    label,
    onChange,
    currentValue,
    precomputed = false,
}) => {
    const [value, setValue] = useState(null);

    /**
     * @type {Array<{id: string, title: string, url: string, doc: string, recommendedWith: string[]}>}
     */
    const catalog = useMemo(() => {
        let routineCatalog = precomputed ? routinesPrecomputed : routines;
        const formatedRoutineCatalog = routineCatalog.map((routine) => {
            const title = polyglot.t(`${routine.id}_title`);
            const firstLetter = title[0].toUpperCase();
            const formatedFirstLetter = /[0-9]/.test(firstLetter)
                ? '0-9'
                : firstLetter;
            return {
                ...routine,
                title: polyglot.t(`${routine.id}_title`),
                firstLetter: formatedFirstLetter,
            };
        });
        return formatedRoutineCatalog.sort(
            (a, b) => -b.firstLetter.localeCompare(a.firstLetter),
        );
    }, [precomputed]);

    useEffect(() => {
        setValue(
            catalog.find(
                (routine) =>
                    typeof currentValue === 'string' &&
                    currentValue.startsWith('/') &&
                    routine.url.includes(currentValue),
            ),
        );
    }, [currentValue, catalog]);

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
            value={value ?? null}
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

RoutineCatalog.propTypes = {
    label: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    currentValue: PropTypes.string,
    precomputed: PropTypes.bool,
};

export default compose(translate)(RoutineCatalog);
