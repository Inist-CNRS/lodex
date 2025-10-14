import { polyglot as polyglotPropTypes } from '../../../propTypes';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { lazy, Suspense } from 'react';
import { translate, useTranslate } from '../../../i18n/I18NContext';
import Loading from '../../../lib/components/Loading';

const SourceCodeField = lazy(
    () => import('../../../lib/components/SourceCodeField'),
);

const EJSEditor = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => {
    const { translate } = useTranslate();

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
                        value,
                        onChange,
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
