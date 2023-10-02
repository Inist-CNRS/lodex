import React, { useEffect, useMemo, useState } from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { Button, TextField, Tooltip } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CachedIcon from '@mui/icons-material/Cached';
import isEqual from 'lodash.isequal';

import { polyglot as polyglotPropTypes } from '../../propTypes';

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

const VegaAdvancedModeError = ({ message, p, isTooltip }) => {
    return (
        <div style={styles.error.message.container}>
            {!isTooltip ? (
                <div style={styles.error.message.icon}>
                    <ReportProblemIcon fontSize="large" />
                </div>
            ) : null}
            <div style={!isTooltip ? styles.error.message.message : undefined}>
                <p>{p.t('vega_json_error')}</p>
                <p>{message}</p>
            </div>
        </div>
    );
};

VegaAdvancedModeError.defaultProps = {
    isTooltip: false,
};

VegaAdvancedModeError.propTypes = {
    p: polyglotPropTypes.isRequired,
    message: PropTypes.string.isRequired,
    isTooltip: PropTypes.bool,
};

const VegaAdvancedMode = ({ p, value, onChange, onClear }) => {
    const [currentValue, setCurrentValue] = useState(value || '{}');
    const [error, setError] = useState(null);

    const valueObject = useMemo(() => {
        try {
            return JSON.parse(value);
        } catch (e) {
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
        if (valueObject === null || currentValueObject === null) return;
        if (!isEqual(currentValueObject, valueObject)) {
            onChange(currentValue);
        }
    }, [currentValueObject, valueObject]);

    const handleChange = event => {
        setCurrentValue(event.target.value);
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
                                <VegaAdvancedModeError
                                    message={error.message}
                                    p={p}
                                    isTooltip
                                />
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
            <TextField
                onChange={handleChange}
                value={currentValue}
                fullWidth
                multiline
            />
            {error ? (
                <div style={styles.error.container}>
                    <VegaAdvancedModeError message={error.message} p={p} />
                </div>
            ) : null}
        </>
    );
};

VegaAdvancedMode.propTypes = {
    p: polyglotPropTypes.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};

export default translate(VegaAdvancedMode);
