import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react';
import { Button, Tooltip, Box } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CachedIcon from '@mui/icons-material/Cached';

import Loading from '@lodex/frontend-common/components/Loading';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const styles: {
    error: {
        container: CSSProperties;
        message: {
            container: CSSProperties;
            icon: CSSProperties;
            message: CSSProperties;
        };
    };
} = {
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

const SourceCodeField = lazy(
    () => import('@lodex/frontend-common/components/SourceCodeField'),
);

type VegaAdvancedModeProps = {
    value?: string | null;
    onChange: (value: string) => void;
    onClear?: () => void;
};

const VegaAdvancedMode = ({
    value,
    onChange,
    onClear,
}: VegaAdvancedModeProps) => {
    const { translate } = useTranslate();
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        try {
            JSON.parse(value as string);
            setError(null);
        } catch (e) {
            setError(e as Error);
        }
    }, [value]);

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
                            {translate('regenerate_vega_lite_spec')}
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
                                    <p>{translate('vega_json_error')}</p>
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
                        {translate('vega_validator')}
                    </a>
                    <p>
                        {translate('vega_variable_list')}
                        <div>
                            <i>
                                <ul>
                                    <li>
                                        <code>{'{|__LODEX_WIDTH__|}'}</code> (
                                        {translate('vega_variable_width')})
                                    </li>
                                    <li>
                                        <code>{'{|__LODEX_HEIGHT__|}'}</code> (
                                        {translate('vega_variable_height')})
                                    </li>
                                    <li>
                                        <code>container</code> (
                                        {translate('vega_variable_container')})
                                    </li>
                                </ul>
                            </i>
                        </div>
                    </p>
                </div>
                <Suspense fallback={<Loading>{translate('loading')}</Loading>}>
                    <SourceCodeField
                        style={{
                            width: '100%',
                            height: '70vh',
                            borderRadius: '5px',
                        }}
                        mode="json"
                        input={{
                            value: value || '{}',
                            onChange,
                        }}
                    />
                </Suspense>
            </Box>
            {error ? (
                <div style={styles.error.container}>
                    <div style={styles.error.message.container}>
                        <div style={styles.error.message.icon}>
                            <ReportProblemIcon fontSize="large" />
                        </div>
                        <div style={styles.error.message.message}>
                            <p>{translate('vega_json_error')}</p>
                            <p>{error.message}</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default VegaAdvancedMode;
