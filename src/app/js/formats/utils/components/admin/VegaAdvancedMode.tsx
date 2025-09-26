import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, Box } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CachedIcon from '@mui/icons-material/Cached';
import isEqual from 'lodash/isEqual';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { translate } from '../../../../i18n/I18NContext';
import Loading from '../../../../lib/components/Loading';

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

const FormSourceCodeField = lazy(
    () => import('../../../../lib/components/FormSourceCodeField'),
);

// @ts-expect-error TS7031
const VegaAdvancedMode = ({ p, value, onChange, onClear }) => {
    const [currentValue, setCurrentValue] = useState(value || '{}');
    const [error, setError] = useState(null);

    const valueObject = useMemo(() => {
        try {
            const json = JSON.parse(value);
            setError(null);
            return json;
        } catch (e) {
            // @ts-expect-error TS2345
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
            // @ts-expect-error TS2345
            setError(e);
            return null;
        }
    }, [currentValue]);

    useEffect(() => {
        if (!isEqual(currentValueObject, valueObject)) {
            onChange(currentValue);
        }
    }, [currentValueObject, valueObject]);

    // @ts-expect-error TS7006
    const handleChange = (newValue) => {
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
                                    {/*
                                     // @ts-expect-error TS2339 */}
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
                                <ul>
                                    <li>
                                        <code>{'{|__LODEX_WIDTH__|}'}</code> (
                                        {p.t('vega_variable_width')})
                                    </li>
                                    <li>
                                        <code>{'{|__LODEX_HEIGHT__|}'}</code> (
                                        {p.t('vega_variable_height')})
                                    </li>
                                    <li>
                                        <code>container</code> (
                                        {p.t('vega_variable_container')})
                                    </li>
                                </ul>
                            </i>
                        </div>
                    </p>
                </div>
                <Suspense fallback={<Loading>{p.t('loading')}</Loading>}>
                    {/*
                     // @ts-expect-error TS2322 */}
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
                </Suspense>
            </Box>
            {error ? (
                <div style={styles.error.container}>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <div style={styles.error.message.container}>
                        <div style={styles.error.message.icon}>
                            <ReportProblemIcon fontSize="large" />
                        </div>
                        <div style={styles.error.message.message}>
                            <p>{p.t('vega_json_error')}</p>
                            {/*
                             // @ts-expect-error TS2339 */}
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
