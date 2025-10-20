import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { Box } from '@mui/material';
import { lazy, Suspense } from 'react';
import { translate, useTranslate } from '../../../i18n/I18NContext';
import Loading from '../../../lib/components/Loading';

const SourceCodeField = lazy(
    () => import('../../../lib/components/SourceCodeField'),
);

interface EJSEditorProps {
    p: unknown;
    value: string;
    onChange(...args: unknown[]): unknown;
}

const EJSEditor = ({
    value,
    onChange
}: EJSEditorProps) => {
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

export default translate(EJSEditor);
