import { polyglot as polyglotPropTypes } from '../../../propTypes';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { lazy, Suspense, useEffect, useState } from 'react';
import { translate, useTranslate } from '../../../i18n/I18NContext';
import Loading from '../../../lib/components/Loading';

const SourceCodeField = lazy(
    () => import('../../../lib/components/SourceCodeField'),
);

// @ts-expect-error TS7031
const EJSEditor = ({ value, onChange }) => {
    const { translate } = useTranslate();

    const [currentValue, setCurrentValue] = useState(value || '');

    useEffect(() => {
        onChange(currentValue);
    }, [currentValue, onChange]);

    // @ts-expect-error TS7006
    const handleChange = (newValue) => {
        setCurrentValue(newValue);
    };

    return (
        <Box width="100%">
            <Suspense fallback={<Loading>{translate('loading')}</Loading>}>
                <SourceCodeField
                    style={{
                        width: '100%',
                        height: '70vh',
                        borderRadius: '5px',
                    }}
                    mode="ejs"
                    input={{
                        value: currentValue,
                        onChange: handleChange,
                    }}
                />
            </Suspense>
        </Box>
    );
};

EJSEditor.propTypes = {
    p: polyglotPropTypes.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default translate(EJSEditor);
