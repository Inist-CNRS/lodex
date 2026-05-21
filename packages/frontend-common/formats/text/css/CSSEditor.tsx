import { Box } from '@mui/material';
import { lazy, Suspense } from 'react';
import { translate, useTranslate } from '../../../i18n/I18NContext';
import Loading from '../../../components/Loading';

const SourceCodeField = lazy(
    () => import('../../../components/SourceCodeField'),
);

interface CSSEditorProps {
    p: unknown;
    value: string;
    onChange(...args: unknown[]): unknown;
}

const CSSEditor = ({ value, onChange }: CSSEditorProps) => {
    const { translate } = useTranslate();

    return (
        <Box width="100%">
            <Suspense fallback={<Loading>{translate('loading')}</Loading>}>
                <SourceCodeField
                    style={{
                        width: '100%',
                        height: '50vh',
                        borderRadius: '5px',
                    }}
                    mode="css"
                    input={{
                        value,
                        onChange,
                    }}
                />
            </Suspense>
        </Box>
    );
};

export default translate(CSSEditor);
