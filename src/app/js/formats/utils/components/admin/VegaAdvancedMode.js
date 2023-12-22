import React, { useEffect, useMemo, useState } from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { Button, Tooltip, Box } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CachedIcon from '@mui/icons-material/Cached';
import isEqual from 'lodash.isequal';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';

const styles = {
    error: {
        container: {
            marginLeft: 'auto',
            marginRight: '24px',
            color: 'red',
        },
        message: {
            container: {
                display: 'flex',
                flexDirection: 'row',
            },
            icon: {
                marginTop: 'auto',
                marginBottom: 'auto',
                marginRight: '10px',
            },
            message: {
                borderLeft: 'solid 1px red',
                paddingLeft: '10px',
            },
        },
    },
};

const VegaAdvancedMode = ({ p, value, onChange, onClear }) => {
    const FormSourceCodeField = require('../../../../lib/components/FormSourceCodeField')
        .default;

    const [currentValue, setCurrentValue] = useState(value || '{}');
    const [error, setError] = useState(null);

    const valueObject = useMemo(() => {
        try {
            const json = JSON.parse(value);
            setError(null);
            return json;
        } catch (e) {
            setError(e);
            return null;
        }
    }, [value]);

    const currentValueObject = useMemo(() => {
        try {
            const json = JSON.parse(currentValue);
            setError(null);
            return json;
        } catch (e) {
            setError(e);
            return null;
        }
    }, [currentValue]);

    useEffect(() => {
        if (!isEqual(currentValueObject, valueObject)) {
            onChange(currentValue);
        }
    }, [currentValueObject, valueObject]);

    const handleChange = newValue => {
        setCurrentValue(newValue);
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 1,
                }}
            >
                <div>
                    {onClear ? (
                        <Button
                            onClick={onClear}
                            color="primary"
                            variant="contained"
                        >
                            <CachedIcon
                                sx={{
                                    marginRight: '10px',
                                }}
                            />
                            {p.t('regenerate_vega_lite_spec')}
                        </Button>
                    ) : null}
                </div>
                <div
                    style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    {error ? (
                        <Tooltip
                            title={
                                <div>
                                    <p>{p.t('vega_json_error')}</p>
                                    <p>{error.message}</p>
                                </div>
                            }
                        >
                            <ReportProblemIcon
                                fontSize="large"
                                sx={{
                                    color: 'red',
                                }}
                            />
                        </Tooltip>
                    ) : null}
                </div>
            </div>
            <Box width="100%">
                <div>
                    <a
                        href="https://vega.github.io/editor/#/edited"
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                    >
                        {p.t('vega_validator')}
                    </a>
                    <p>
                        {p.t('vega_variable_list')}
                        <div>
                            <i>
                                <code>
                                    {'{|__LODEX_WIDTH__|}'} (
                                    {p.t('vega_variable_width')}),{' '}
                                    {'{|__LODEX_HEIGHT__|}'} (
                                    {p.t('vega_variable_height')})
                                </code>
                            </i>
                        </div>
                    </p>
                </div>
                <FormSourceCodeField
                    style={{
                        width: '100%',
                        height: '70vh',
                        borderRadius: '5px',
                    }}
                    mode="json"
                    input={{
                        value: currentValue,
                        onChange: handleChange,
                    }}
                />
            </Box>
            {error ? (
                <div style={styles.error.container}>
                    <div style={styles.error.message.container}>
                        <div style={styles.error.message.icon}>
                            <ReportProblemIcon fontSize="large" />
                        </div>
                        <div style={styles.error.message.message}>
                            <p>{p.t('vega_json_error')}</p>
                            <p>{error.message}</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

VegaAdvancedMode.propTypes = {
    p: polyglotPropTypes.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func,
};

export default translate(VegaAdvancedMode);
